DocumentationAPI Reference
Home
Ticketing
Introduction
Getting Started
Zendesk API quick start
Making requests to the Ticketing API
Managing Tickets
Building a custom ticket form with the Ticketing API
Improving performance by creating tickets asynchronously
Adding tags to tickets without overwriting existing tags
Adding voice comments to tickets
Creating and managing requests
Creating and updating tickets
Tickets vs Requests APIs: How to select the right option for your project
Using the Incremental Exports API
Working with url properties
Using The Zendesk API
Common tasks for the Zendesk Support API
Side-Loading
Best practices for avoiding rate limiting
Searching with the Zendesk Ticketing API
Making client-side CORS requests to the Ticketing API
Exporting users with the Zendesk API
Importing users with the Zendesk API
Making API requests on behalf of end users (Zendesk Support)
Using the API when SSO or two-factor authentication is enabled
Creating and managing private apps
Exporting access logs to a CSV file
Exporting a ticket view to a CSV file
Adding ticket attachments with the API
Retrieving lookup relationship data with the API
Using audit logs to track activity
Setting skill priority with skills in trigger action
Getting the CSAT ratings of tickets
Creating side conversations with the Zendesk API
Custom Profiles
About the Profiles API
Getting started with profiles
Anatomy of a profile
How profiles affect existing data
Using identifier queries with profiles
Creating profiles
Accessing profiles
Accessing profiles in Zendesk apps
Updating profiles
Using external ID with profiles
Custom Events
About the Events API
Getting started with events
Anatomy of an event
Displaying rich links with events
Tracking events
Accessing events
Accessing events in Zendesk apps
Filtering events
Deleting events
Security best practices
Reference Guides
Actions reference
Conditions reference
Ticket Audit events reference
Ticket metric event types reference
Cause of suspension reference
Via object reference
Via types reference
Working With OAuth
Using OAuth to authenticate Zendesk API requests in a web app
Creating and using OAuth tokens with the API
Using PKCE to make Zendesk OAuth access tokens more secure
API Clients
Introduction
Python
PHP
Node.js
.NET
Java
Ruby
Clojure
Elixir
Force.com
R
On this page
What you'll need
Creating tickets
Troubleshooting tips
Next steps
Zendesk API quick start
In this 10-minute quick start, you'll use the Zendesk Ticketing API to create a few tickets in Zendesk Support.

The tutorial is intended for admins and agents with no developer experience. To make the API requests, the tutorial uses your web browser's built-in JavaScript console.


If you're a more experienced developer, check out the API reference. The reference includes curl examples for each endpoint. The API reference also includes links to related Postman collections. See Exploring Zendesk APIs with Postman.

What you'll need
To complete this tutorial, you'll need the following:

A Zendesk Support account with agent or admin access. To get a free account for testing, see Getting a trial or sponsored account for development.

API password access is enabled for the account. See Managing password access to the API in Zendesk help.

A web browser, such as Chrome, Firefox, Safari, or Microsoft Edge. These browsers include a built-in JavaScript console.

Creating tickets
To create a ticket, use the JavaScript console to make an HTTP POST request to the Ticketing API's Create Ticket endpoint.

Sign in to your Zendesk account as an admin or agent. From the Zendesk Agent Workspace, open your browser's JavaScript console:

Chrome: View > Developer > JavaScript Console
Firefox: Tools > Browser Tools > Web Developer Tools. Then click the Console tab.
Safari: Develop > Show JavaScript Console
Microsoft Edge: Tools > Developer > JavaScript Console
Paste the following script into your browser's console.

for (let i = 1; i < 4; i++) {
  const subject = `Test ticket ${i}`
  const body = `This is test ticket ${i}`
  $.ajax({
    url: "/api/v2/tickets.json",
    contentType: "application/json",
    type: "POST",
    data: JSON.stringify({
      ticket: { subject: subject, comment: { body: body } }
    })
  }).done(data => {
    console.log(data.ticket)
  })
}
Here's what the code looks like after pasting it into Google Chrome's JavaScript console:


The code snippet creates a loop that makes three requests to the Create Ticket endpoint. Each request creates a ticket in Zendesk Support.

Press Enter.

If successful, the console lists the tickets as JavaScript objects.


You can expand each object to see the ticket's properties.


To view the tickets in the Agent Workspace, reload the browser tab. Then click Views > Recently updated tickets.


When you're done trying out the API, delete the test tickets by selecting them in the list and clicking Delete.

Troubleshooting tips
If the script returned an error, try the following troubleshooting tips:

If you get a 404 (Not Found) response, sign in to your Zendesk account before running the script.

If you get a TypeError: $.ajax not a function error, ensure you run the script from the Agent Workspace in Zendesk Support.

If you get a JavaScript error indicating that $.ajax is not defined, ensure you don't have any browser settings or plugins that block scripts from loading.

Next steps
The best way to learn how to use the Zendesk APIs is to try different requests on your own. You can use any of the following resources along the way:

To see what's possible using Zendesk APIs, check out the API reference.

Use Postman to explore the Zendesk APIs. Postman is a popular application for testing APIs and making API requests. See Exploring Zendesk APIs with Postman.

Install curl to run example requests from the API reference documentation. curl is a command-line tool for making HTTP requests without a web browser. See Installing and using curl.

Speed up development with an API client. An API client takes care of a lot of the low-level details of making requests and handling responses and lets you focus on the logic of your application.

Learn about the most common tasks developers perform with the Ticketing API.

Ask questions or look for answers in the Zendesk APIs community.

Join our developer community
ForumBlogSlack
Zendesk181 Fremont Street, 17th Floor, San Francisco, California 94105
Privacy PolicyTerms & ConditionsSystem StatusCookie Settings
Navigated to Zendesk API quick start
