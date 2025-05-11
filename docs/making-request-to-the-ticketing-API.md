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
Getting data from your Zendesk product
How it works
Updating data in your Zendesk product
How it works
Creating data
How it works
Making requests to the Ticketing API
You can use the Zendesk REST API to read, update, and create data in a Zendesk product. This tutorial shows you how to start working with the API. It provides examples of completing the following common tasks with the API:

Getting data from your Zendesk product
Updating data in your Zendesk product
Creating data in your Zendesk product
Make sure you enable token access to the API in Admin Center under Apps and integrations > APIs > Zendesk APIs. For more information, see Using the API dashboard.

The article uses Python because its syntax is relatively clear and readable. If you work in another language or if you're just getting started, you should still be able to follow along.

If you just want to follow along with the tutorial and don't want to try out the requests yourself, you can skip ahead.

If you want to try out the requests yourself, you'll need version 3 of Python. To install it on your system, see http://www.python.org/download/.

Also download and install the Requests library if you don't already have it. The Requests library greatly simplifies making HTTP requests in Python. To install it, run the following command in the Terminal on the Mac or the command prompt in Windows:

$ pip3 install requests
Note: The dollar sign ($) represents the command prompt. Don't enter it.

If you have Python 3.3 or earlier, see these instructions to install the library. Then use pip instead of pip3 on the command line.

Finally, when copying the examples in this tutorial, make sure to indent lines exactly as shown. Indentation matters in Python.

Disclaimer: Zendesk provides this article for instructional purposes only. Zendesk does not support or guarantee the code. Zendesk also can't provide support for third-party technologies such as Python.

Getting data from your Zendesk product
The following example gets all the groups in a Zendesk Support instance using the groups API.

Make sure you've defined a few groups in your Zendesk Support instance before trying out the script. See Creating, managing, and using groups. To learn how the script works, see the inline comments (which start with # in Python) as well as the explanations that follow.

import requests
import os

ZENDESK_API_TOKEN = os.getenv('ZENDESK_API_TOKEN')  # Make sure this is correctly set in your environment
ZENDESK_SUBDOMAIN = 'your_subdomain.zendesk.com'  # Replace with your Zendesk subdomain
ZENDESK_USER_MAIL = 'you_zendesk_email' # Replace with the Zendesk email address used to access the subdomain

# Check if ZENDESK_API_TOKEN was correctly retrieved from environment
if not ZENDESK_API_TOKEN:
    print('ZENDESK_API_TOKEN environment variable is not set. Exiting.')
    exit()

url = f'https://{ZENDESK_SUBDOMAIN}/api/v2/groups.json'

auth = f'{ZENDESK_USER_EMAIL}/token', ZENDESK_API_TOKEN

# Perform the HTTP GET request
response = requests.get(url, auth=auth)

# Check for HTTP codes other than 200
if response.status_code != 200:
    print('Status:', response.status_code, 'Problem with the request. Exiting.')
    exit()

# Decode the JSON response into a dictionary and use the data
data = response.json()

# Example 1: Print the name of the first group in the list
print('First group = ', data['groups'][0]['name'])

# Example 2: Print the name of each group in the list
group_list = data['groups']
for group in group_list:
    print(group['name'])
Save the script in a folder, use the command line to navigate to the folder, and run the script from the command line. Example:

python3 get_groups.py
Example:



How it works
The script uses the following URL to make the API call:

url = f'https://{ZENDESK_SUBDOMAIN}/api/v2/groups.json'
See Listing groups for details about the API.

The script uses the requests library to authenticate and make the HTTP get request:

response = requests.get(url, auth=auth)
Next, the script decodes the JSON returned by the API and packages the data in a Python dictionary:

data = response.json()
A dictionary is simply a collection of key/value pairs. Decoding the JSON into a dictionary lets you work with the data using regular Python operators and expressions.

Consult the Zendesk REST API docs to figure out what's in the dictionary. For example, according to the List Groups doc, the JSON returned by a call to the API has the following structure:



Decoding this JSON produces a Python dictionary consisting of one key named 'groups'. The square brackets in the doc tell you the value of groups is a list. Each item in the list is a dictionary of group properties. Armed with this information, you can access the data in the dictionary. For example, the following statement accesses and prints the name of the first group in the dictionary:

print('First group = ', data['groups'][0]['name'])
The following statement iterates through all the groups in the dictionary and prints the name of each group:

group_list = data['groups']
for group in group_list:
    print(group['name'])
You can also write the data to a file. Replace the previous example in the script with the following snippet:

group_list = data['groups']
output = ''

for group in group_list:
    output += group['name'] + '\n'  # add each name to the output variable

with open('groups.txt', mode='w', encoding='utf-8') as f:
    f.write(output)

print("Done.")
The snippet creates a file named groups.txt in the same folder as the script, and writes the group names in a column in the file.

The script described in this section is fine for getting up to two dozen or so records from your Zendesk. However, to retrieve several hundred or several thousand records, the script has to be modified to perform a few more tasks. To learn how, see Getting large data sets with the Zendesk API and Python.

To explore getting other kinds of data from your Zendesk product, see the rest of the Zendesk REST API docs.

Updating data in your Zendesk product
The following example adds a comment to a ticket in Zendesk Support using the tickets API.

To learn how the script works, see the inline comments as well as the explanations that follow.

import json
import requests
import os

# Ticket to update
ticket_id = '13'
body = 'Thanks for choosing Acme Jet Motors.'

# Package the data in a dictionary matching the expected JSON
data = {'ticket': {'comment': {'body': body}}}

# Encode the data to create a JSON payload
payload = json.dumps(data)

# Set the request parameters
zendesk_subdomain = 'your_subdomain'  # Replace this placeholder
url = f'https://{zendesk_subdomain}.zendesk.com/api/v2/tickets/{ticket_id}.json'
api_token = os.getenv('ZENDESK_API_TOKEN')  # Ensure this env variable is set
user_email = 'your_zendesk_email'  # Replace with the Zendesk email address used to access the subdomain

auth = f'{ZENDESK_USER_EMAIL}/token', ZENDESK_API_TOKEN

# Perform the HTTP PUT request
response = requests.put(url, data=payload, auth=auth)

# Check for HTTP codes other than 200 (OK) or 201 (Created)
if response.status_code not in [200, 201]:
    print(f'Status: {response.status_code}, Problem with the request. Exiting.')
    exit()

# Report success
print(f'Successfully added comment to ticket #{ticket_id}')
Save the script in a folder, use the command line to navigate to the folder, and run the script from the command line. Example:

python3 put_comment.py
Open the ticket in Zendesk Support to view the new comment.

How it works
In addition to importing the requests library, the script imports a library called json:

import json
You'll use the library to convert data in your script into JSON for the put request. The json library is a standard Python library. You don't need to download and install it.

Next, the script packages the data in a Python dictionary matching the structure of the JSON expected by the API. Consult the REST API doc for the expected JSON. For example, if you want to add a comment to a ticket, the API expects the following JSON:

{
  "ticket": {
    "comment": {
      "body": "New comment."
    }
  }
}
Accordingly in Python, package your data as nested dictionaries matching the JSON:

data = { 'ticket': { 'comment': { 'body': body } } }
Encode the data to create a JSON payload:

payload = json.dumps(data)
If you print the payload variable, you'll get the following result:

{"ticket":{"comment":{"body":"Thanks for choosing Acme Jet Motors."}}}
You should always encode your data to prevent characters like quotes from breaking the JSON. For example, the quotes in the following body would prematurely end the string and cause an error:

"body": "Learn <a href="faq">more</a>."
Encoding the data escapes the quotes. Example: "Learn <a href=\"faq.html\">more."

Next, set the request parameters. The following URL is used to make the API call:

url = f'https://{zendesk_subdomain}.zendesk.com/api/v2/tickets/{ticket_id}.json'
See Updating tickets for details about the API.

Pass the JSON payload to the put request, along with the other request parameters:

response = requests.put(url, data=payload, auth=auth)
Tip: If you want to make repeated API calls in your script -- for example, to update a collection of tickets -- you can create a requests session and persist certain parameters across the requests. For example, replace the put request above with the following snippet, which creates and configures a session:

session = requests.Session()
session.auth = (user, pwd)
session.headers = headers

# make repeated requests with session.put(), not requests.put()
... response = session.put(url, data=payload)
To explore updating other kinds of data in your Zendesk product, see the rest of the Zendesk REST API docs.

Creating data
The following example creates a ticket using the tickets API.

Creating things with the API is almost identical to updating things, except that you use a post request instead of a put request.

import json
import requests
import os

# New ticket info
subject = 'My printer is on fire!'
body = 'The smoke is very colorful.'

# Package the data in a dictionary matching the expected JSON
data = {'ticket': {'subject': subject, 'comment': {'body': body}}}

# Encode the data to create a JSON payload
payload = json.dumps(data)

# Set the request parameters
zendesk_subdomain = 'your_subdomain'  # Replace this placeholder
url = f'https://{zendesk_subdomain}.zendesk.com/api/v2/tickets.json'
api_token = os.getenv('ZENDESK_API_TOKEN')  # Ensure this env variable is set
user_email = 'your_zendesk_email'  # Replace with the Zendesk email address used to access the subdomain

auth = f'{user_email}/token', api_token

# Do the HTTP post request
response = requests.post(url, data=payload, auth=auth)

# Check for HTTP codes other than 201 (Created)
if response.status_code != 201:
    print('Status:', response.status_code, 'Problem with the request. Exiting.')
    exit()

# Report success
print('Successfully created the ticket.')
Save the script in a folder, use the command line to navigate to the folder, and run the script from the command line. Example:

python3 post_ticket.py
Go to the Unassigned Tickets view in Zendesk Support to see the new ticket.

How it works
The script uses the following URL to make the API call:

url = 'https://your_subdomain.zendesk.com/api/v2/tickets.json'
See Creating tickets for details about the API.

To learn how the script works, see the explanations in Updating data in your Zendesk product. They're basically the same, except for the post request.

To explore adding other kinds of data in your Zendesk product, see the rest of the Zendesk REST API docs.

Join our developer community
ForumBlogSlack
Zendesk181 Fremont Street, 17th Floor, San Francisco, California 94105
Privacy PolicyTerms & ConditionsSystem StatusCookie Settings
