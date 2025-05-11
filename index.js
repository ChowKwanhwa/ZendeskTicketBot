require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const zendesk = require('node-zendesk');
const express = require('express');
const app = express();

// Initialize Telegram Bot
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

// Initialize Zendesk Client
const zendeskClient = zendesk.createClient({
  username: process.env.ZENDESK_EMAIL,
  token: process.env.ZENDESK_TOKEN,
  remoteUri: `https://${process.env.ZENDESK_SUBDOMAIN}.zendesk.com/api/v2`
});

// Store user conversations
const userConversations = new Map();

// Express middleware
app.use(express.json());

// Handle /start command
bot.onText(/\/start/i, async (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 
    'Welcome to SuperEx Support! 👋\n\n' +
    'Use /ticket to create a new support ticket\n' +
    'Use /close to close your current ticket'
  );
});

// Handle /ticket command
bot.onText(/\/ticket/i, async (msg) => {
  const chatId = msg.chat.id;

  // Check if user already has an active ticket
  if (userConversations.has(chatId)) {
    bot.sendMessage(chatId, 'You already have an active ticket. Please close it with /close before creating a new one.');
    return;
  }

  try {
    // Create a new ticket in Zendesk
    // Get user information
    const userDisplayName = msg.from.username || msg.from.first_name || `User_${msg.from.id}`;

    // Try to find existing user first
    const userEmail = `${msg.from.id}@telegram.bot`;
    let endUser;
    try {
      const searchResult = await zendeskClient.users.search({ query: userEmail });
      endUser = searchResult[0] || await zendeskClient.users.create({
        user: {
          name: userDisplayName,
          email: userEmail,
          role: 'end-user'
        }
      });
    } catch (searchError) {
      console.error('Error searching for user:', searchError);
      // If search fails, try to create user directly
      endUser = await zendeskClient.users.create({
        user: {
          name: userDisplayName,
          email: userEmail,
          role: 'end-user'
        }
      });
    }

    // Create the ticket with correct submitter and requester
    const ticket = await zendeskClient.tickets.create({
      ticket: {
        subject: `Support Request from ${userDisplayName}`,
        comment: {
          body: 'User started a new support conversation',
          author_id: endUser.id
        },
        requester_id: endUser.id,
        submitter_id: endUser.id,
        tags: ['telegram']
      }
    });

    // Get the requester ID from the created ticket
    const requesterId = ticket.requester_id;

    // Store both ticket ID and requester ID
    userConversations.set(chatId, ticket.id);
    userConversations.set(`${chatId}_user_id`, requesterId);
    bot.sendMessage(chatId, 
      `Support ticket #${ticket.id} has been created. Our team will assist you shortly.\n\n` +
      'You can send messages here and they will be added to your support ticket.\n' +
      'To close your current ticket, simply send /close command.'
    );
  } catch (error) {
    console.error('Error:', error);
    if (error.result) {
      console.error('Detailed error:', error.result.toString());
    }
    bot.sendMessage(chatId, 'Sorry, there was an error creating your support ticket.');
  }
});

// Handle /close command
bot.onText(/\/close/i, async (msg) => {
  const chatId = msg.chat.id;
  const ticketId = userConversations.get(chatId);

  if (ticketId) {
    try {
      // 提供问题类型选项
      const keyboard = {
        inline_keyboard: [
          [
            { text: 'General Inquiry', callback_data: 'close_general' },
            { text: 'Technical Issue', callback_data: 'close_technical' }
          ],
          [
            { text: 'Account Issue', callback_data: 'close_account' },
            { text: 'Other', callback_data: 'close_other' }
          ]
        ]
      };

      bot.sendMessage(chatId, 'Please select a reason to close your ticket:', { reply_markup: keyboard });
    } catch (error) {
      console.error('Error:', error);
      bot.sendMessage(chatId, 'Sorry, there was an error closing your ticket.');
    }
  } else {
    bot.sendMessage(chatId, 'You don\'t have an active support ticket. Send /start to create one.');
  }
});

// Handle close ticket callback
bot.on('callback_query', async (callbackQuery) => {
  const chatId = callbackQuery.message.chat.id;
  const ticketId = userConversations.get(chatId);
  const data = callbackQuery.data;

  if (data.startsWith('close_') && ticketId) {
    try {
      // Map callback data to question type
      const questionTypeMap = {
        'close_general': 'chat',  // 一般咨询
        'close_technical': 'abnormal_problem',  // 技术问题
        'close_account': 'account_issues',  // 账户问题
        'close_other': 'deposit_and_withdrawal_problem'  // 其他
      };

      const questionTypeTag = questionTypeMap[data];
      const questionTypeDisplay = {
        'chat': 'General Inquiry',
        'abnormal_problem': 'Technical Issue',
        'account_issues': 'Account Issue',
        'deposit_and_withdrawal_problem': 'Other'
      }[questionTypeTag];

      // Update ticket with question type and solve it
      await zendeskClient.tickets.update(ticketId, {
        ticket: {
          status: 'solved',
          custom_fields: [
            {
              id: 6742685813785,
              value: questionTypeTag
            }
          ],
          comment: {
            body: `User closed the conversation (Type: ${questionTypeDisplay})`,
            public: false,
            author_id: userConversations.get(`${chatId}_user_id`)
          }
        }
      });

      // Answer callback query and send success message
      await bot.answerCallbackQuery(callbackQuery.id);
      userConversations.delete(chatId);
      bot.sendMessage(chatId, 
        'Your support ticket has been closed. 🎉\n\n' +
        'If you need help again, just send /start to create a new ticket.'
      );
    } catch (error) {
      console.error('Error:', error);
      if (error.result) {
        console.error('Error details:', error.result.toString());
      }
      bot.sendMessage(chatId, 'Sorry, there was an error closing your ticket.');
      await bot.answerCallbackQuery(callbackQuery.id, {
        text: 'Error closing ticket'
      });
    }
  } else {
    await bot.answerCallbackQuery(callbackQuery.id);
    if (!ticketId) {
      bot.sendMessage(chatId, 'You don\'t have an active support ticket. Send /start to create one.');
    }
  }
});

// Handle regular messages
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const messageText = msg.text;
  const userDisplayName = msg.from.username || msg.from.first_name || `User_${msg.from.id}`;

  // Ignore commands
  if (messageText && messageText.startsWith('/')) {
    return;
  }

  try {
    // Check if there's an existing ticket for this user
    const ticketId = userConversations.get(chatId);

    if (!ticketId) {
      bot.sendMessage(chatId, 'Please use /ticket to create a new support ticket first.');
    } else {
      // Add comment to existing ticket as the user
      await zendeskClient.tickets.update(ticketId, {
        ticket: {
          comment: {
            body: messageText,
            public: true,
            author_id: userConversations.get(`${chatId}_user_id`),  // Use the user's ID
            type: 'Comment',  // Specify this is a regular comment
            via: { channel: 'telegram' }  // Mark the source as telegram
          }
        }
      });
      // Don't echo user's message back to avoid duplication
    }
  } catch (error) {
    console.error('Error:', error);
    bot.sendMessage(chatId, 'Sorry, there was an error processing your message.');
  }
});

// Webhook endpoint for Zendesk
app.post('/webhook', async (req, res) => {
  try {
    // Only process ticket.comment_added events
    if (req.body.type !== 'zen:event-type:ticket.comment_added') {
      res.status(200).send('OK');
      return;
    }

    const ticketId = req.body.subject.match(/zen:ticket:(\d+)/)?.[1];
    const comment = req.body.event?.comment;

    // Skip if not a valid comment
    if (!ticketId || !comment) {
      res.status(200).send('OK');
      return;
    }

    // Only process public comments from staff members
    // Skip user messages and internal notes
    if (!comment.is_public || !comment.author?.is_staff) {
      res.status(200).send('OK');
      return;
    }

    // Find the associated chat ID
    for (const [chatId, savedTicketId] of userConversations.entries()) {
      if (savedTicketId.toString() === ticketId) {
        // Send the agent's response to the user with a clear prefix
        const agentName = comment.author.name || 'Support Team';
        await bot.sendMessage(chatId, `👤 Support Agent (${agentName}):\n${comment.body}`);
        break;
      }
    }
    
    res.status(200).send('OK');
  } catch (error) {
    console.error('Webhook Error:', error);
    res.status(500).send('Error processing webhook');
  }
});

// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Webhook URL: ${process.env.WEBHOOK_URL}`);
});
