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
Getting started
Creating tickets
Ticket Management
Working with OAuth
Embed and extend Support
Build Zendesk apps for Support
Add Support to your iOS and Android apps
Ticketing
Create and manage tickets
Getting started
In this 10-minute quickstart, you'll use the Zendesk API to create a few tickets. To keep things moving along, you'll use the JavaScript console of your browser to make the API requests.

Zendesk API quick start

Creating tickets
An agent responding to a customer's ticket in Support
Building a custom ticket form with the Ticketing API
This article describes how to build a custom ticket form that lets users submit support requests from your website.

Improving performance by creating tickets asynchronously
If you create tickets in Zendesk Support with the API but want faster response times in your application, you can instruct the API to queue the jobs and just return a ticket ID and information about the status of the job.

Adding tags to tickets without overwriting existing tags
This article exmplains how to use the Update Many API. It lets you add tags without overwriting existing ones. You can also remove old tags without affecting existing tags.

Ticket Management
Common tasks for the Zendesk Support API
This article covers common tasks performed with the Zendesk API, and lists the APIs and endpoints to use in your projects.

Searching with the Zendesk API
The Zendesk REST API provides the a single, unified API for searching Zendesk Support resources such as tickets, users, organizations, and groups.

Side-loading
Side-loading allows you to retrieve related records as part of a single request.

Making cross-origin, browser-side API requests
For security purposes, modern browsers have a same-origin policy restriction that prevents scripts from accessing resources in other domains. However, if the other domain implements Cross-Origin Resource Sharing (CORS), the browser will allow a script to access resources in that domain.

Best practices for avoiding rate limiting
When you reach the API rate limit, the Zendesk API stops processing any more requests until a certain amount of time has passed. This article covers the best practices for avoiding rate limiting.

Working with OAuth
An app being authorized to access a Support instance
OAuth authorization is to allow third-party applications to interact with a Zendesk Support instance without having to store and use the passwords of users, which is sensitive information that the apps shouldn't know.

Using OAuth to authenticate Zendesk API requests in a web app
In this tutorial, you'll build a web app that implements an OAuth authorization flow.

Creating and using OAuth tokens with the API
Using OAuth tokens for authentication doesn't tie the requests to a specific username and password, and it offers more control and security than plain API tokens.

Set up a global OAuth client
If you're developing an integration for Zendesk Support, you can use OAuth authentication to let users grant access to Zendesk Support to your integration.

Embed and extend Support
Build Zendesk apps for Support
A Zendesk app is a small web application installed in the agent interface that extends the functionality of Zendesk Support, Chat, or Sell. Visit Apps for information on how to get started.

Visit Apps

Add Support to your iOS and Android apps
The Support SDKs for iOS and Android lets you embed Zendesk Support options natively in your mobile app so your customers can get help directly in the app.

Visit Mobile SDKs

Join our developer community
ForumBlogSlack
Zendesk181 Fremont Street, 17th Floor, San Francisco, California 94105
Privacy PolicyTerms & ConditionsSystem StatusCookie Settings
Navigated to Ticketing
