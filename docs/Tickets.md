DocumentationAPI Reference
Home
Ticketing
Ticketing
Tickets
Tickets
Attachments
Ticket Comments
Ticket Forms
Ticket Fields
Requests
Ticket Import
Ticket Audits
Ticket Metrics
Ticket Metric Events
Ticket Activities
Ticket Skips
Suspended Tickets
Email Notifications
Custom Ticket Statuses
Sharing Agreements
Ticket Form Statuses
Users
Users
User Identities
User Profiles
User Events
User Fields
User Passwords
Zendesk events in Sunshine
Organizations
Organizations
Organization Memberships
Organization Fields
Organization Subscriptions
Lookup Relationships
Lookup Relationships
Groups
Groups
Group Memberships
Ticket Management
Search
Incremental Exports
Tags
CSAT Survey Responses
Satisfaction Ratings
Satisfaction Reasons
Job Statuses
Dynamic Content Items
Dynamic Content Item Variants
Schedules
Skill-based Routing
Incremental Skill-based Routing
Resource Collections
Workspaces
Bookmarks
Business Rules
Views
Ticket Triggers
Ticket Trigger Categories
Macros
Automations
SLA Policies
Group SLA Policies
Deletion Schedules
Account Configuration
Custom Agent Roles
Account Settings
Support Addresses
Sessions
Brand Agents
Brands
Locales
Audit Logs
Access Logs
Push Notification Devices
Channel Framework
X (formerly Twitter) Channel
Zendesk Public IPs
OAuth
OAuth Tokens
OAuth Tokens for Grant Types
OAuth Clients
Global OAuth Clients
Apps
Apps
App Location Installations
App Locations
Targets
Targets
Target Failures
Side Conversation
Side Conversations
Side Conversation Events
Side Conversation Attachment
JIRA
Links
Jira Integration API
On this page
JSON format
List Tickets
Count Tickets
Show Ticket
Show Multiple Tickets
Create Ticket
Create Many Tickets
Update Ticket
Update Many Tickets
Mark Ticket as Spam and Suspend Requester
Bulk Mark Tickets as Spam
Merge Tickets into Target Ticket
Ticket Related Information
Delete Ticket
Bulk Delete Tickets
List Deleted Tickets
Restore a Previously Deleted Ticket
Restore Previously Deleted Tickets in Bulk
Delete Ticket Permanently
Delete Multiple Tickets Permanently
List Collaborators for a Ticket
List Followers for a Ticket
List Email CCs for a Ticket
List Ticket Incidents
List Ticket Problems
Autocomplete Problems
Tickets
Tickets are the means through which your end users (customers) communicate with agents in Zendesk Support. Tickets can originate from a number of channels, including email, Help Center, chat, phone call, X (formerly Twitter), Facebook, or the API. All tickets have a core set of properties.

Tickets and Requests
Zendesk has both a Tickets API and a Requests API. A ticket is an agent's perspective on a ticket. A request is an end user's perspective on a ticket. End users can only see public comments and certain fields of a ticket. Therefore, use the Requests API to let end users view, update, and create tickets. Use the Tickets API described in the rest of this document to let agents and admins manage tickets.

Requesters and submitters
Every ticket has a requester and submitter. The user who is asking for support through a ticket is the requester. For most businesses that use Zendesk Support, the requester is a customer, but requesters can also be agents in your Zendesk Support instance.

The submitter is the user who created a ticket. By default, the requester of a ticket is the submitter. For example, if your customer emails your support address, this creates a ticket with the customer as both the requester and submitter. The requester will also appear as the author of the ticket's first comment.

However, a support agent can also create a ticket on behalf of a customer. If an agent creates a ticket through the web interface, the agent is set as the submitter. This can be accomplished equivalently through the API by passing the agent's user ID as the submitter_id when creating a ticket. In this case, the agent, who is the submitter, becomes the author of the ticket's first comment and the ticket shows that the agent created the ticket "on behalf of" the customer.

If you want to include placeholders in the first comment, create the ticket as an agent, not on behalf of an end user. Placeholders only work in comments if the comment is created by an agent. If an end user tries to enter a placeholder in a comment, it's treated as a static string and is displayed as such in the ticket.

The submitter is always the first comment author
In the description above, we see that a ticket's first comment author can differ depending on who created the ticket. In both examples, whomever is the submitter becomes the first comment author. This will hold true for all tickets created in Zendesk Support with one exception.

Exception: If the ticket is created as a follow-up ticket (i.e., if the ticket is created using via_followup_source_id), then any submitter_id attribute is ignored. The API sets whoever created the follow-up ticket (for the API, always the authenticated user) as the first comment author.

Description and first comment
When creating a ticket, use the comment property to set the ticket description, which is also the first comment. Example:

{"ticket": {"subject": "My printer is on fire!", "comment": {"body": "The smoke is very colorful."}}}
Important: Do not use the description property to set the first comment. The property is for reading purposes only. While it's possible to use the property to set the first comment, the functionality has limitations and is provided to support existing implementations.

Subject
When tickets are created within the Agent Workspace, a subject is required. However, tickets can be created via the API or email without a subject. If a ticket doesn't have a subject, the text of the first comment is populated as the ticket's subject the first time the ticket is updated in the Agent Workspace.

Groups and assignees
Tickets in Zendesk Support can be passed to a group of agents unassigned, or to a specific agent in a specific group. A ticket can only be assigned to one assignee at a time.

Collaborators
Aside from the requester, a ticket can include other people in its communication, known as collaborators or cc's. Collaborators receive email notifications when tickets are updated. Collaborators can be either end users or agents.

Custom ticket statuses
If your account has activated custom ticket statuses, the status property contains the ticket's status category. An id for the custom ticket status is available in the custom_status_id property.

To get a human-readable label for a ticket's custom status, sideload custom_statuses in a GET request. Example:

GET /api/v2/tickets.json?include=custom_statuses

Response:
{
  "ticket": {
    "id": 35436,
    "custom_status_id": 123,
    "status": "open",
    ...
  },
  "custom_statuses": [
    {
      "id": 123,
      "status_category": "open",
      "agent_label": "Open",
      "end_user_label": "Open",
      ...
    }
  ]
}
For more information about custom ticket statuses and status categories, see Creating custom ticket statuses.

JSON format
Tickets are represented as JSON objects with the following properties:

Name	Type	Read-only	Mandatory	Description
allow_attachments	boolean	true	false	Permission for agents to add add attachments to a comment. Defaults to true
allow_channelback	boolean	true	false	Is false if channelback is disabled, true otherwise. Only applicable for channels framework ticket
assignee_email	string	false	false	Write only. The email address of the agent to assign the ticket to
assignee_id	integer	false	false	The agent currently assigned to the ticket
attribute_value_ids	array	false	false	Write only. An array of the IDs of attribute values to be associated with the ticket
brand_id	integer	false	false	The id of the brand this ticket is associated with. See Setting up multiple brands
collaborator_ids	array	false	false	The ids of users currently CC'ed on the ticket
collaborators	array	false	false	POST requests only. Users to add as cc's when creating a ticket. See Setting Collaborators
comment	object	false	false	Write only. An object that adds a comment to the ticket. See Ticket comments. To include an attachment with the comment, see Attaching files. A ticket can contain up to 5000 comments in total, including both public and private comments. Once this limit is reached, any additional attempts to add comments results in a 422 error. The ticket can still be updated in other ways, provided that no new comments are added.
created_at	string	true	false	When this record was created
custom_fields	array	false	false	Custom fields for the ticket. See Setting custom field values
custom_status_id	integer	false	false	The custom ticket status id of the ticket. See custom ticket statuses
description	string	true	false	Read-only first comment on the ticket. When creating a ticket, use comment to set the description. See Description and first comment
due_at	string	false	false	If this is a ticket of type "task" it has a due date. Due date format uses ISO 8601 format
email_cc_ids	array	false	false	The ids of agents or end users currently CC'ed on the ticket. Ignored when CCs and followers is not enabled
email_ccs	object	false	false	Write only. An array of objects that represents agent or end users email CCs to add or delete from the ticket. See Setting email CCs. Ignored when CCs and followers is not enabled
external_id	string	false	false	An id you can use to link Zendesk Support tickets to local records
follower_ids	array	false	false	The ids of agents currently following the ticket. Ignored when CCs and followers is not enabled
followers	object	false	false	Write only. An array of objects that represents agent followers to add or delete from the ticket. See Setting followers. Ignored when CCs and followers is not enabled
followup_ids	array	true	false	The ids of the followups created from this ticket. Ids are only visible once the ticket is closed
forum_topic_id	integer	true	false	The topic in the Zendesk Web portal this ticket originated from, if any. The Web portal is deprecated
from_messaging_channel	boolean	true	false	If true, the ticket's via type is a messaging channel.
generated_timestamp	integer	true	false	A Unix timestamp that represents the most accurate reading of when this record was last updated. It is updated for all ticket updates, including system updates
group_id	integer	false	false	The group this ticket is assigned to
has_incidents	boolean	true	false	Is true if a ticket is a problem type and has one or more incidents linked to it. Otherwise, the value is false.
id	integer	true	false	Automatically assigned when the ticket is created
is_public	boolean	true	false	Is true if any comments are public, false otherwise
macro_id	integer	false	false	Write only. A macro ID to be recorded in the ticket audit
macro_ids	array	false	false	POST requests only. List of macro IDs to be recorded in the ticket audit
metadata	object	false	false	Write only. Metadata for the audit. In the audit object, the data is specified in the custom property of the metadata object. See Setting Metadata
organization_id	integer	false	false	The organization of the requester. You can only specify the ID of an organization associated with the requester. See Organization Memberships
priority	string	false	false	The urgency with which the ticket should be addressed. Allowed values are "urgent", "high", "normal", or "low".
problem_id	integer	false	false	For tickets of type "incident", the ID of the problem the incident is linked to
raw_subject	string	false	false	The dynamic content placeholder, if present, or the "subject" value, if not. See Dynamic Content Items
recipient	string	false	false	The original recipient e-mail address of the ticket. Notification emails for the ticket are sent from this address
requester	object	false	false	Write only. See Creating a ticket with a new requester
requester_id	integer	false	true	The user who requested this ticket
safe_update	boolean	false	false	Write only. Optional boolean. When true and an update_stamp date is included, protects against ticket update collisions and returns a message to let you know if one occurs. See Protecting against ticket update collisions. A value of false has the same effect as true. Omit the property to force the updates to not be safe
satisfaction_rating	object	true	false	The satisfaction rating of the ticket, if it exists, or the state of satisfaction, "offered" or "unoffered". The value is null for plan types that don't support CSAT
sharing_agreement_ids	array	false	false	The ids of the sharing agreements used for this ticket
status	string	false	false	The state of the ticket. If your account has activated custom ticket statuses, this is the ticket's status category. See custom ticket statuses. Allowed values are "new", "open", "pending", "hold", "solved", or "closed".
subject	string	false	false	The value of the subject field for this ticket. See Subject
submitter_id	integer	false	false	The user who submitted the ticket. The submitter always becomes the author of the first comment on the ticket
tags	array	false	false	The array of tags applied to this ticket. Unless otherwise specified, the set tag behavior is used, which overwrites and replaces existing tags
ticket_form_id	integer	false	false	Enterprise only. The id of the ticket form to render for the ticket
type	string	false	false	The type of this ticket. Allowed values are "problem", "incident", "question", or "task".
updated_at	string	true	false	When this record last got updated. It is updated only if the update generates a ticket event
updated_stamp	string	false	false	Write only. Datetime of last update received from API. See the safe_update property
url	string	true	false	The API url of this ticket
via	object	false	false	For more information, see the Via object reference
via_followup_source_id	integer	false	false	POST requests only. The id of a closed ticket when creating a follow-up ticket. See Creating a follow-up ticket
via_id	integer	false	false	Write only. For more information, see the Via object reference
voice_comment	object	false	false	Write only. See Creating voicemail ticket
You can also include a comment_count property in the JSON objects returned by GET requests by sideloading it. Example:

GET /api/v2/tickets.json?include=comment_count

Example
{
  "assignee_id": 235323,
  "collaborator_ids": [
    35334,
    234
  ],
  "created_at": "2009-07-20T22:55:29Z",
  "custom_fields": [
    {
      "id": 27642,
      "value": "745"
    },
    {
      "id": 27648,
      "value": "yes"
    }
  ],
  "custom_status_id": 123,
  "description": "The fire is very colorful.",
  "due_at": null,
  "external_id": "ahg35h3jh",
  "follower_ids": [
    35334,
    234
  ],
  "from_messaging_channel": false,
  "generated_timestamp": 1304553600,
  "group_id": 98738,
  "has_incidents": false,
  "id": 35436,
  "organization_id": 509974,
  "priority": "high",
  "problem_id": 9873764,
  "raw_subject": "{{dc.printer_on_fire}}",
  "recipient": "support@company.com",
  "requester_id": 20978392,
  "satisfaction_rating": {
    "comment": "Great support!",
    "id": 1234,
    "score": "good"
  },
  "sharing_agreement_ids": [
    84432
  ],
  "status": "open",
  "subject": "Help, my printer is on fire!",
  "submitter_id": 76872,
  "tags": [
    "enterprise",
    "other_tag"
  ],
  "type": "incident",
  "updated_at": "2011-05-05T10:38:52Z",
  "url": "https://company.zendesk.com/api/v2/tickets/35436.json",
  "via": {
    "channel": "web"
  }
}
List Tickets
GET /api/v2/tickets
GET /api/v2/organizations/{organization_id}/tickets
GET /api/v2/users/{user_id}/tickets/requested
GET /api/v2/users/{user_id}/tickets/ccd
GET /api/v2/users/{user_id}/tickets/followed
GET /api/v2/users/{user_id}/tickets/assigned
GET /api/v2/tickets/recent
ccd lists tickets that the specified user is cc'd on.

followed lists tickets that the specified user is following.

recent lists tickets that the requesting agent recently viewed in the agent interface, not recently created or updated tickets (unless by the agent recently in the agent interface).

To get a list of all tickets in your account, use the Incremental Ticket Export, Cursor Based or Incremental Ticket Export, Time Based endpoint.

For more filter options, use the Search API.

You can also sideload related records with the tickets. See Side-Loading.

Archived tickets are not included in the following endpoint responses. See About archived tickets in the Zendesk help.

GET /api/v2/tickets
GET /api/v2/organizations/{organization_id}/tickets
GET /api/v2/tickets/recent
If an agent with restricted access to tickets makes a request to the api/v2/tickets endpoint, the endpoint returns only the tickets the agent can access. For information on agents with restricted access to tickets, see Creating custom roles and assigning agents. In addition, the restricted agent's request includes up to 10,000 tickets where the agent is a CC or follower.

Allowed for
Agents
Pagination
Cursor pagination (recommended)
Offset pagination
See Pagination.

Returns a maximum of 100 records per page.

Sorting
By default, tickets are sorted by id from smallest to largest.

When using cursor pagination, use the following parameter to change the sort order:

Name	Type	Required	Comments
sort	string	no	Possible values are "updated_at", "id", "status" (ascending order) or "-updated_at", "-id", "-status" (descending order)
When using offset pagination, use the following parameters to change the sort order:

Name	Type	Required	Comments
sort_by	string	no	Possible values are "assignee", "assignee.name", "created_at", "group", "id", "requester", "requester.name", "status", "subject", "updated_at"
sort_order	string	no	One of asc, desc. Defaults to asc
When sorting by creation date, the first ticket listed may not be the absolute oldest ticket in your account due to ticket archiving.

The query parameter is not supported for this endpoint. Use the Search API to narrow your results with query.

Parameters
Name	Type	In	Required	Description
external_id	string	Query	false	Lists tickets by external id. External ids don't have to be unique for each ticket. As a result, the request may return multiple tickets with the same external id.
Limits
This endpoint has its own rate limit that is different from the account wide rate limit. When calls are made to this endpoint, this limit will be consumed and you will get a 429 Too Many Requests response code if the allocation is exhausted.

Headers
API responses include usage limit information in the headers for this endpoint.

Zendesk-RateLimit-tickets-index: total={number}; remaining={number}; resets={number}
Zendesk-RateLimit-tickets-index-pagination: total={number}; remaining={number}; resets={number}
Zendesk-RateLimit-tickets-index-deep-pagination: total={number}; remaining={number}; resets={number}
Within this header, “Total” signifies the initial allocation, “Remaining” indicates the remaining allowance for the current interval, and “Resets” denotes the wait time in seconds before the limit refreshes. You can see the Total, and Interval values in the below table.

Details
This is the limit definition for the List Tickets endpoint

Rate Limits	Scopes	Interval	Sandbox	Trial	Default
Standard	Account	1 minute	100	100	N/A
With High Volume API Add On	Account	1 minute	300	300	N/A
"Default" applies to all Zendesk suite and support plans. Please refer to the general account limits for more information.

Code Samples
curl
curl https://{subdomain}.zendesk.com/api/v2/tickets.json \
  -v -u {email_address}/token:{api_token}
Go
Java
Nodejs
Python
Ruby
Example response(s)
200 OK
Count Tickets
GET /api/v2/tickets/count
GET /api/v2/organizations/{organization_id}/tickets/count
GET /api/v2/users/{user_id}/tickets/ccd/count
GET /api/v2/users/{user_id}/tickets/assigned/count
Returns an approximate count of tickets in the account. If the count exceeds 100,000, it is updated every 24 hours.

ccd lists tickets that the specified user is cc'd on.

The count[refreshed_at] property is a timestamp that indicates when the count was last updated.

Note: When the count exceeds 100,000, count[refreshed_at] may occasionally be null. This indicates that the count is being updated in the background, and count[value] is limited to 100,000 until the update is complete.

Allowed For
Agents
Code Samples
curl
curl https://{subdomain}.zendesk.com/api/v2/tickets/count.json \
  -v -u {email_address}/token:{api_token}
Go
Java
Nodejs
Python
Ruby
Example response(s)
200 OK
Show Ticket
GET /api/v2/tickets/{ticket_id}
Returns a number of ticket properties though not the ticket comments. To get the comments, use List Comments

Allowed For
Agents
Parameters
Name	Type	In	Required	Description
ticket_id	integer	Path	true	The ID of the ticket
Code Samples
curl
curl https://{subdomain}.zendesk.com/api/v2/tickets/{ticket_id}.json \
  -v -u {email_address}/token:{api_token}
Go
Java
Nodejs
Python
Ruby
Example response(s)
200 OK
Show Multiple Tickets
GET /api/v2/tickets/show_many?ids={ids}
Accepts a comma-separated list of ticket ids to return.

This endpoint will return up to 100 tickets records.

Allowed For
Agents
Parameters
Name	Type	In	Required	Description
ids	string	Query	true	Comma-separated list of ticket ids
Code Samples
curl
curl https://{subdomain}.zendesk.com/api/v2/tickets/show_many.json?ids=1,2,3 \
  -v -u {email_address}/token:{api_token}
Go
Java
Nodejs
Python
Ruby
Example response(s)
200 OK
Create Ticket
POST /api/v2/tickets
Takes a ticket object that specifies the ticket properties. The only required property is comment. See Ticket Comments. All writable properties listed in JSON Format are optional.

To submit a ticket with HTML data in a comment, use html_body instead of body in your request. HTML data is stripped out of the request if you use body.

An audit object is generated and included in the response when you create or update a ticket. The audit object has an events array listing all the updates made to the new ticket. For more information, see Ticket Audits. You can also add your own metadata to the audit object. See Setting metadata.

For more information on creating tickets, see:

Creating a follow-up ticket
Creating a ticket asynchronously
Setting collaborators
Setting followers
Setting email CCs
Setting metadata
Attaching files
Creating a ticket with a new requester
Setting custom field values
Allowed For
Agents
Example body
{
  "ticket": {
    "comment": {
      "body": "The smoke is very colorful."
    },
    "priority": "urgent",
    "subject": "My printer is on fire!"
  }
}
Code Samples
curl
curl https://{subdomain}.zendesk.com/api/v2/tickets.json \
  -d '{"ticket": {"subject": "My printer is on fire!", "comment": { "body": "The smoke is very colorful." }}}' \
  -H "Content-Type: application/json" -v -u {email_address}/token:{api_token} -X POST
Go
Java
Nodejs
Python
Ruby
Example response(s)
201 Created
Create Many Tickets
POST /api/v2/tickets/create_many
Accepts an array of up to 100 ticket objects. Note: Every ticket created with this endpoint may be affected by your business rules, which can include sending email notifications to your end users. If you are importing historical tickets or creating more than 1000 tickets, consider using the Ticket Bulk Import endpoint.

This endpoint returns a job_status JSON object and queues a background job to do the work. Use the Show Job Status endpoint to check for the job's completion. Only a certain number of jobs can be queued or running at the same time. See Job limit for more information.

Allowed For
Agents
Example body
{
  "tickets": [
    {
      "comment": {
        "body": "The smoke is very colorful."
      },
      "priority": "urgent",
      "subject": "My printer is on fire!"
    },
    {
      "comment": {
        "body": "This is a comment"
      },
      "priority": "normal",
      "subject": "Help"
    }
  ]
}
Code Samples
curl
curl https://{subdomain}.zendesk.com/api/v2/tickets/create_many.json \
  -d '{"tickets": [{"subject": "My printer is on fire!", "comment": { "body": "The smoke is very colorful." }}, {"subject": "Help!", "comment": { "body": "Help I need somebody." }}]}' \
  -H "Content-Type: application/json" -v -u {email_address}/token:{api_token} -X POST
Go
Java
Nodejs
Python
Ruby
Example response(s)
200 OK
Update Ticket
PUT /api/v2/tickets/{ticket_id}
The PUT request takes a ticket object that lists the values to update. All properties are optional.

See also Protecting against ticket update collisions.

Audit Events
An audit object is generated and included in the response when you update a ticket. See Audit events.

Allowed For
Agents
Parameters
Name	Type	In	Required	Description
ticket_id	integer	Path	true	The ID of the ticket
Example body
{
  "ticket": {
    "comment": {
      "body": "Thanks for choosing Acme Jet Motors.",
      "public": true
    },
    "custom_status_id": 321,
    "status": "solved"
  }
}
Limits
This endpoint has its own rate limit that is different from the account wide rate limit. When calls are made to this endpoint, this limit will be consumed and you will get a 429 Too Many Requests response code if the allocation is exhausted.

Headers
API responses include usage limit information in the headers for this endpoint.

Zendesk-RateLimit-tickets-update: total={number}; remaining={number}; resets={number}
Within this header, “Total” signifies the initial allocation, “Remaining” indicates the remaining allowance for the current interval, and “Resets” denotes the wait time in seconds before the limit refreshes. You can see the Total, and Interval values in the below table.

Details
This is the limit definition for the update action.

Rate Limits	Scopes	Interval	Sandbox	Trial	Default
Standard	per (User + Ticket)	10 minute	30	30	30
Standard	Account	1 minute	20	20	100
With High Volume API Add On	Account	1 minute	100	100	300
"Default" applies to all Zendesk suite and support plans. Please refer to the general account limits for more information.

Code Samples
curl
curl https://{subdomain}.zendesk.com/api/v2/tickets/{ticket_id}.json \
  -H "Content-Type: application/json" \
  -d '{"ticket": {"status": "open", "custom_status_id": 123, "comment": { "body": "The smoke is very colorful.", "author_id": 494820284 }}}' \
  -v -u {email_address}/token:{api_token} -X PUT
Go
Java
Nodejs
Python
Ruby
Example response(s)
200 OK
Update Many Tickets
PUT /api/v2/tickets/update_many
Accepts an array of up to 100 ticket objects, or a comma-separated list of up to 100 ticket ids.

This endpoint returns a job_status JSON object and queues a background job to do the work. Use the Show Job Status endpoint to check for the job's completion. Only a certain number of jobs can be queued or running at the same time. See Job limit for more information.

The system always performs safe updates for bulk and batch update jobs. This protects against record update collisions, such as updating tickets with outdated ticket data, and notifies you if one occurs. For bulk ticket updates, you can specify safe_update and updated_stamp properties to set your own safe update time; if you don't specify updated_stamp, the system uses the timestamp when the bulk update was queued. For batch ticket updates, you must specify both safe_update and updated_stamp if specifying your own safe update time; failing to include updated_stamp results in an error. For more information, see Protecting against ticket update collisions.

Bulk updates
To make the same change to multiple tickets, use the following endpoint and data format:

https://{subdomain}.zendesk.com/api/v2/tickets/update_many.json?ids=1,2,3

{
  "ticket": {
    "status": "solved"
  }
}
Batch updates
To make different changes to multiple tickets, use the following endpoint and data format:

https://{subdomain}.zendesk.com/api/v2/tickets/update_many.json

{
  "tickets": [
    { "id": 1, "status": "solved" },
    { "id": 2, "status": "pending" }
  ]
}
Updating tag lists
You can use the bulk update format to add or remove tags to the tag list of each ticket without overwriting the existing tags. To do so, include the additional_tags or remove_tags property in the ticket object. Example:

curl https://{subdomain}.zendesk.com/api/v2/tickets/update_many.json?ids=1,2,3 \
  -d '{"ticket": {"additional_tags":["a_new_tag"]}}' \
  -H "Content-Type: application/json" \
  -v -u {email_address}/token:{api_token} -X PUT
Allowed For
Agents
Parameters
Name	Type	In	Required	Description
ids	string	Query	false	Comma-separated list of ticket ids
Code Samples
curl
Bulk update

curl https://{subdomain}.zendesk.com/api/v2/tickets/update_many.json?ids=1,2,3 \
  -H "Content-Type: application/json" \
  -v -u {email_address}/token:{api_token} -X PUT \
  -d '{"ticket": {"status": "solved"}}'
curl
Go
Java
Nodejs
Python
Ruby
Example response(s)
200 OK
Mark Ticket as Spam and Suspend Requester
PUT /api/v2/tickets/{ticket_id}/mark_as_spam
Allowed For
Agents
Parameters
Name	Type	In	Required	Description
ticket_id	integer	Path	true	The ID of the ticket
Code Samples
curl
curl https://{subdomain}.zendesk.com/api/v2/tickets/{ticket_id}/mark_as_spam.json \
  -v -u {email_address}/token:{api_token} -X PUT -d '{}'
Go
Java
Nodejs
Python
Ruby
Example response(s)
200 OK
Bulk Mark Tickets as Spam
PUT /api/v2/tickets/mark_many_as_spam?ids={ids}
Accepts a comma-separated list of up to 100 ticket ids.

This endpoint returns a job_status JSON object and queues a background job to do the work. Use the Show Job Status endpoint to check for the job's completion. Only a certain number of jobs can be queued or running at the same time. See Job limit for more information.

Allowed For
Agents
Parameters
Name	Type	In	Required	Description
ids	string	Query	true	Comma-separated list of ticket ids
Code Samples
curl
curl https://{subdomain}.zendesk.com/api/v2/tickets/mark_many_as_spam.json?ids=1,2,3 \
  -v -u {email_address}/token:{api_token} -X PUT -d '{}' -H "Content-Type: application/json"
Go
Java
Nodejs
Python
Ruby
Example response(s)
200 OK
Merge Tickets into Target Ticket
POST /api/v2/tickets/{ticket_id}/merge
Merges one or more tickets into the ticket with the specified id.

See Merging tickets in the Support Help Center for ticket merging rules.

Any attachment to the source ticket is copied to the target ticket.

This endpoint returns a job_status JSON object and queues a background job to do the work. Use the Show Job Status endpoint to check for the job's completion. Only a certain number of jobs can be queued or running at the same time. See Job limit for more information.

Allowed For
Agents
Agents in the Enterprise account must have merge permissions. See Creating custom roles and assigning agents (Enterprise) in the Support Help Center.

Available parameters
The request takes a data object with the following properties:

Name	Type	Required	Comments
ids	array	yes	Ids of tickets to merge into the target ticket
target_comment	string	no	Private comment to add to the target ticket. This comment is optional but strongly recommended
source_comment	string	no	Private comment to add to the source ticket. This comment is optional but strongly recommended
target_comment_is_public	boolean	no	Whether comments in the target ticket are public or private
source_comment_is_public	boolean	no	Whether comments in the source tickets are public or private
target_comment and source_comment can be used to provide a reason for the merge for recordkeeping purposes. If the source ticket has attachments, they are included in target_comment.

Comments are private and can't be modified in the following cases:

Any of the sources or target tickets are private
Any of the sources or target tickets were created through X (formerly Twitter), Facebook or the Channel framework
In any other case, comments default to private but can be modified with the comment privacy parameters.

Parameters
Name	Type	In	Required	Description
ticket_id	integer	Path	true	The ID of the ticket
Example body
{
  "ids": [
    123,
    456,
    789
  ],
  "source_comment": "Closing in favor of #111",
  "target_comment": "Combining with #123, #456, #789"
}
Code Samples
curl
curl https://{subdomain}.zendesk.com/api/v2/tickets/{ticket_id}/merge.json \
  -v -u {email_address}/token:{api_token} -X POST \
  -d '{"ids": [123, 456, 789], "source_comment": "Closing in favor of #111", "target_comment": "Combining with #123, #456, #789"}' \
  -H "Content-Type: application/json"
Go
Java
Nodejs
Python
Ruby
Example response(s)
200 OK
Ticket Related Information
GET /api/v2/tickets/{ticket_id}/related
The request returns a data object with the following properties:

Name	Type	Comment
topic_id	string	Related topic in the Web portal (deprecated feature)
jira_issue_ids	array	Array of associated jira issues
followup_source_ids	array	Sources to follow up
from_archive	boolean	Is true if the current ticket is archived
incidents	integer	A count of related incident occurrences
Allowed For
Agents
Parameters
Name	Type	In	Required	Description
ticket_id	integer	Path	true	The ID of the ticket
Code Samples
curl
curl https://{subdomain}.zendesk.com/api/v2/tickets/{ticket_id}/related.json \
  -v -u {email_address}/token:{api_token}
Go
Java
Nodejs
Python
Ruby
Example response(s)
200 OK
Delete Ticket
DELETE /api/v2/tickets/{ticket_id}
Allowed For
Admins
Agents with permission to delete tickets
Agent delete permissions are set in Support. See Deleting tickets in the Support Help Center.

Ticket deletion rate limit
You can delete 400 tickets every 1 minute using this endpoint. The rate limiting mechanism behaves as described in Rate limits in the API introduction. Zendesk recommends that you obey the Retry-After header values. To delete many tickets, you may use Bulk Delete Tickets.

Parameters
Name	Type	In	Required	Description
ticket_id	integer	Path	true	The ID of the ticket
Code Samples
curl
curl https://{subdomain}.zendesk.com/api/v2/tickets/{ticket_id}.json \
  -v -u {email_address}/token:{api_token} -X DELETE
Go
Java
Nodejs
Python
Ruby
Example response(s)
204 No Content
Bulk Delete Tickets
DELETE /api/v2/tickets/destroy_many?ids={ids}
Accepts a comma-separated list of up to 100 ticket ids.

Allowed For
Admins
Agents with permission to delete tickets
Agent delete permissions are set in Support. See Deleting tickets in the Support Help Center.

This endpoint returns a job_status JSON object and queues a background job to do the work. Use the Show Job Status endpoint to check for the job's completion. Only a certain number of jobs can be queued or running at the same time. See Job limit for more information.

Parameters
Name	Type	In	Required	Description
ids	string	Query	true	Comma-separated list of ticket ids
Code Samples
curl
curl https://{subdomain}.zendesk.com/api/v2/tickets/destroy_many.json?ids=1,2,3 \
  -v -u {email_address}/token:{api_token} -X DELETE
Go
Java
Nodejs
Python
Ruby
Example response(s)
200 OK
List Deleted Tickets
GET /api/v2/deleted_tickets
Returns a maximum of 100 deleted tickets per page. See Pagination.

The results includes all deleted (and not yet archived) tickets that have not yet been scrubbed in the past 30 days. Archived tickets are not included in the results. See About archived tickets in the Support Help Center.

The tickets are ordered chronologically by created date, from oldest to newest. The first ticket listed may not be the oldest ticket in your account due to ticket archiving.

Pagination
Cursor pagination (recommended)
Offset pagination
See Pagination.

Returns a maximum of 100 records per page.

Allowed For
Agents
Rate Limit
You can make 10 requests every 1 minute using this endpoint. When making requests beyond page 100, you can make 5 requests every 1 minute. The rate limiting mechanism behaves as described in Monitoring your request activity in the API introduction.

Parameters
Name	Type	In	Required	Description
sort_by	string	Query	false	Sort by. Allowed values are "id", "subject", or "deleted_at".
sort_order	string	Query	false	Sort order. Defaults to "asc". Allowed values are "asc", or "desc".
Limits
This endpoint has its own rate limit that is different from the account wide rate limit. When calls are made to this endpoint, this limit will be consumed and you will get a 429 Too Many Requests response code if the allocation is exhausted.

Headers
API responses include usage limit information in the headers for this endpoint.

Zendesk-RateLimit-deleted-tickets-index: total={number}; remaining={number}; resets={number}
Zendesk-RateLimit-deleted-tickets-index-deep-pagination: total={number}; remaining={number}; resets={number}
Within this header, “Total” signifies the initial allocation, “Remaining” indicates the remaining allowance for the current interval, and “Resets” denotes the wait time in seconds before the limit refreshes. You can see the Total, and Interval values in the below table.

Details
Rate limit definition for the deleted tickets index API.

Rate Limits	Scopes	Interval	Sandbox	Trial	Default
Standard	Account	1 minute	N/A	N/A	10
With High Volume API Add On	Account	1 minute	N/A	N/A	10
"Default" applies to all Zendesk suite and support plans. Please refer to the general account limits for more information.

Code Samples
curl
curl https://{subdomain}.zendesk.com/api/v2/deleted_tickets.json \
  -v -u {email_address}/token:{api_token}
Go
Java
Nodejs
Python
Ruby
Example response(s)
200 OK
Restore a Previously Deleted Ticket
PUT /api/v2/deleted_tickets/{ticket_id}/restore
Allowed For
Agents
Parameters
Name	Type	In	Required	Description
ticket_id	integer	Path	true	The ID of the ticket
Code Samples
curl
curl https://{subdomain}.zendesk.com/api/v2/deleted_tickets/{id}/restore.json
  -X PUT -v -u {email_address}/token:{api_token}
Go
Java
Nodejs
Python
Ruby
Example response(s)
200 OK
Restore Previously Deleted Tickets in Bulk
PUT /api/v2/deleted_tickets/restore_many?ids={ids}
Allowed For
Agents
Parameters
Name	Type	In	Required	Description
ids	string	Query	true	Comma-separated list of ticket ids
Code Samples
curl
curl https://{subdomain}.zendesk.com/api/v2/deleted_tickets/restore_many?ids={ids}.json
  -X PUT -v -u {email_address}/token:{api_token}
Go
Java
Nodejs
Python
Ruby
Example response(s)
200 OK
Delete Ticket Permanently
DELETE /api/v2/deleted_tickets/{ticket_id}
Permanently deletes a soft-deleted ticket. See Soft delete in the Zendesk GDPR docs. To soft delete a ticket, use the Delete Ticket endpoint.

This endpoint enqueues a ticket deletion job and returns a payload with the jobs status.

If the job succeeds, the ticket is permanently deleted. This operation can't be undone.

This endpoint returns a job_status JSON object and queues a background job to do the work. Use the Show Job Status endpoint to check for the job's completion.

Allowed For
Agents
Parameters
Name	Type	In	Required	Description
ticket_id	integer	Path	true	The ID of the ticket
Limits
This endpoint has its own rate limit that is different from the account wide rate limit. When calls are made to this endpoint, this limit will be consumed and you will get a 429 Too Many Requests response code if the allocation is exhausted.

Headers
API responses include usage limit information in the headers for this endpoint.

Zendesk-RateLimit-deleted-tickets-destroy: total={number}; remaining={number}; resets={number}
Within this header, “Total” signifies the initial allocation, “Remaining” indicates the remaining allowance for the current interval, and “Resets” denotes the wait time in seconds before the limit refreshes. You can see the Total, and Interval values in the below table.

Details
Rate limit definition for the deleted tickets destroy API.

Rate Limits	Scopes	Interval	Sandbox	Trial	Default
Standard	Account	1 minute	N/A	N/A	1000
With High Volume API Add On	Account	1 minute	N/A	N/A	1000
"Default" applies to all Zendesk suite and support plans. Please refer to the general account limits for more information.

Code Samples
curl
curl https://{subdomain}.zendesk.com/api/v2/deleted_tickets/{id}.json \
  -X DELETE -v -u {email_address}/token:{api_token}
Go
Java
Nodejs
Python
Ruby
Example response(s)
200 OK
Delete Multiple Tickets Permanently
DELETE /api/v2/deleted_tickets/destroy_many?ids={ids}
Permanently deletes up to 100 soft-deleted tickets. See Soft delete in the Zendesk GDPR docs. To soft delete tickets, use the Bulk Delete Tickets endpoint.

This endpoint accepts a comma-separated list of up to 100 ticket ids. It enqueues a ticket deletion job and returns a payload with the jobs status.

If one ticket fails to be deleted, the endpoint still attempts to delete the others. If the job succeeds, the tickets that were successfully deleted are permanently deleted. This operation can't be undone.

This endpoint returns a job_status JSON object and queues a background job to do the work. Use the Show Job Status endpoint to check for the job's completion. Only a certain number of jobs can be queued or running at the same time. See Job limit for more information.

Allowed For
Agents
Parameters
Name	Type	In	Required	Description
ids	string	Query	true	Comma-separated list of ticket ids
Limits
This endpoint has its own rate limit that is different from the account wide rate limit. When calls are made to this endpoint, this limit will be consumed and you will get a 429 Too Many Requests response code if the allocation is exhausted.

Headers
API responses include usage limit information in the headers for this endpoint.

Zendesk-RateLimit-deleted-tickets-destroy_many: total={number}; remaining={number}; resets={number}
Within this header, “Total” signifies the initial allocation, “Remaining” indicates the remaining allowance for the current interval, and “Resets” denotes the wait time in seconds before the limit refreshes. You can see the Total, and Interval values in the below table.

Details
Rate limit definition for the deleted tickets destroy_many API.

Rate Limits	Scopes	Interval	Sandbox	Trial	Default
Standard	Account	1 minute	N/A	N/A	300
With High Volume API Add On	Account	1 minute	N/A	N/A	300
"Default" applies to all Zendesk suite and support plans. Please refer to the general account limits for more information.

Code Samples
curl
curl https://{subdomain}.zendesk.com/api/v2/deleted_tickets/destroy_many.json?ids=1,2,3 \
  -X DELETE -v -u {email_address}/token:{api_token}
Go
Java
Nodejs
Python
Ruby
Example response(s)
200 OK
List Collaborators for a Ticket
GET /api/v2/tickets/{ticket_id}/collaborators
Allowed For
Agents
Parameters
Name	Type	In	Required	Description
ticket_id	integer	Path	true	The ID of the ticket
Code Samples
curl
curl https://{subdomain}.zendesk.com/api/v2/tickets/{ticket_id}/collaborators.json \
  -v -u {email_address}/token:{api_token}
Go
Java
Nodejs
Python
Ruby
Example response(s)
200 OK
List Followers for a Ticket
GET /api/v2/tickets/{ticket_id}/followers
Returns any users who follow the ticket.

Availability
The CCs and Followers feature must be enabled in Zendesk Support.

Allowed For
Agents
Parameters
Name	Type	In	Required	Description
ticket_id	integer	Path	true	The ID of the ticket
Code Samples
curl
curl https://{subdomain}.zendesk.com/api/v2/tickets/{ticket_id}/followers.json \
  -v -u {email_address}/token:{api_token}
Go
Java
Nodejs
Python
Ruby
Example response(s)
200 OK
List Email CCs for a Ticket
GET /api/v2/tickets/{ticket_id}/email_ccs
Returns any users cc'd on the ticket.

Availability
The CCs and Followers feature must be enabled in Zendesk Support.

If the feature is not enabled, the default CC functionality is used. In that case, use List Collaborators to list the users cc'ed on the ticket.

Allowed For
Agents
Parameters
Name	Type	In	Required	Description
ticket_id	integer	Path	true	The ID of the ticket
Code Samples
curl
curl https://{subdomain}.zendesk.com/api/v2/tickets/{ticket_id}/email_ccs.json \
  -v -u {email_address}/token:{api_token}
Go
Java
Nodejs
Python
Ruby
Example response(s)
200 OK
List Ticket Incidents
GET /api/v2/tickets/{ticket_id}/incidents
Allowed For
Agents
Pagination
Cursor pagination (recommended)
Offset pagination
See Pagination.

Parameters
Name	Type	In	Required	Description
ticket_id	integer	Path	true	The ID of the ticket
Code Samples
curl
curl https://{subdomain}.zendesk.com/api/v2/tickets/12345/incidents.json \
  -v -u {email_address}/token:{api_token}
Go
Java
Nodejs
Python
Ruby
Example response(s)
200 OK
List Ticket Problems
GET /api/v2/problems
The response is always ordered by updated_at in descending order

Allowed For
Agents
Pagination
Cursor pagination (recommended)
Offset pagination
See Pagination.

Code Samples
curl
curl https://{subdomain}.zendesk.com/api/v2/problems.json \
  -v -u {email_address}/token:{api_token}
Go
Java
Nodejs
Python
Ruby
Example response(s)
200 OK
Autocomplete Problems
POST /api/v2/problems/autocomplete
Returns tickets whose type is "problem" and whose subject contains the string specified in the text parameter.

You can specify the text parameter in the request body rather than the query string. Example:

{"text": "fire"}

Allowed For
Agents
Parameters
Name	Type	In	Required	Description
text	string	Query	false	The text to search for
Example body
{
  "text": "fire"
}
Code Samples
curl
curl https://{subdomain}.zendesk.com/api/v2/problems/autocomplete.json?text=fire \
  -X POST -H "Content-Type: application/json" \
  -u {email_address}/token:{api_token}
Go
Java
Nodejs
Python
Ruby
Example response(s)
200 OK
Join our developer community
ForumBlogSlack
Zendesk181 Fremont Street, 17th Floor, San Francisco, California 94105
Privacy PolicyTerms & ConditionsSystem StatusCookie Settings
Navigated to Tickets
