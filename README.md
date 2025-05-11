# Zendesk Ticket Bot

A Telegram bot that integrates with Zendesk to manage support tickets.

## Features

- Create support tickets via Telegram
- Forward user messages to Zendesk tickets
- Receive agent responses in Telegram
- Close tickets with a simple command

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file with the following variables:
```
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
ZENDESK_EMAIL=your_zendesk_email
ZENDESK_TOKEN=your_zendesk_api_token
ZENDESK_SUBDOMAIN=your_zendesk_subdomain
PORT=8000
```

3. Start the bot:
```bash
node index.js
```

## Commands

- `/start` - Display welcome message and available commands
- `/ticket` - Create a new support ticket
- `/close` - Close the current ticket

## Notes

- Each user can only have one active ticket at a time
- Messages are forwarded to Zendesk as public comments
- Only agent responses are sent back to the user
- Internal notes are not forwarded to Telegram
