# assist
This is a generic platform aimed at issue reporting in an easy and mobile way.

Ths user interface is quite simple, and can be used for different purposes. This version has been customized for a building or campus management purpose, where users/customers/tenants can easily report issues in buildings, facilities and services to the management.

# Features:
- user must log in before opening a ticket
- admin user is created on startup
- central template uses a switch to display consumer or helpdesk pages to be displayed
- ticket priority defines the time for response

## Consumer view:
- picture, text input and priority
   - ticket cannot be submitted with no text
   - if priority is not given, 'low' is assumed
- a list of tickets opened by the same user is displayed in the home screen
- when existing ticket is clicked, it should expand and display the contents of that ticket
   - enable a button for the customer to close the ticket - only the user who opened the ticket can close it
   - display input box for customer to add new comment / picture

## Helpdesk view:
- display a list of tickets
   - sorted by remaining time for response
   - each ticket should display: prio, substring of the first message, time remaining (for fixing the issue) with a live counter
- when a ticket is clicked, expand the view (like in consumer view) and display all details
   - user should be able to change status from new to in progress - ticket can only be closed by the user who opened it.
   - user should be able to write a message back to the user and/or attach a picture to it

# Roadmap:
- enable admin to create a ticket
- admin should be able to promote other users to admin
- user can input all data without login, but requires login to submit. In this case, should be possible to create the user on the fly without losing the input data.
- existing ticket should only display the input box if admin has posted a question.
- when customer wants to close a ticket, it should be possible to request an optional text feedback for the closure
- use 2 different pages with a slider: one for new ticket, one for existing tickets
- add ui notifications
- when ticket time to responde is below 1min make it blink and shine
- upgrade to meteor 1.3
- make it ios installable app
- adapt the helpdesk view to work on mobile
- use mobile notifications instead of just ui notifications
- move configurations to a separate collection and provide an admin interface to manage it
