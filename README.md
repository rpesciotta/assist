# assist
This is a generic platform that can be used for reporting problems, much in the sense of a ticketing system.

Ths user interface is quite simple, and can be used for any purpose. For development purposes, we customized the application to work as a building management system where residents can report problems with the building to the management office.

# Features:
- user always logs in
- 1 admin user must be created on startup (use a flag to tell it's admin)
- central template uses a switch to display consumer or helpdesk template

## Consumer view:
- picture and text input
   - ticket cannot be submitted with no text or priority is input
   - once ticket is submitted, reset the input fields and add the new ticket to the open tickets list
- list of open tickets
- when existing ticket is clicked, it should expand and display the contents of that ticket
   - enable a button for the customer to close the ticket
   - display input box for customer to add new comment

## Helpdesk:
- display a list of tickets
   - ordered by remaining time for response
   - each ticket should display: prio, substring of the first message, time remaining with a live counter
- when a ticket is clicked, expand the view (like in consumer view) and display all details
   - user should be able to change status from new to in progress, and from in progress to closed
   - user should be able to write a message back to the user

# Roadmap:
- enable admin to create a ticket
- admin should be able to promote other users to admin
- user can input all data without login, but requires login to submit. In this case, should be possible to create the user on the fly without losing the input data.
- existing ticket should only display the input box if admin has posted a question.
- when customer wants to close a ticket, it should be possible to request an optional text feedback for the closure
- use 2 different pages with a slider: one for new ticket, one for existing tickets
- add ui notifications
- when ticket time to responde is below 1min make it blink and shine
