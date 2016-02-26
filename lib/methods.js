Meteor.methods({
	newTicket: function(ticket) {

      var timestamp = new Date();
      //console.log('ticket original: '+JSON.stringify(ticket));

      _.extend(ticket, {
         createdAt: timestamp,
         status: 'New',
         userId: Meteor.userId(),
         userName: Meteor.user().username
      });
      //console.log('ticket: '+JSON.stringify(ticket));

      var ticketId = Tickets.insert(_.omit(ticket,'data'));

      var comment = {
         userId: Meteor.userId(),
         userName: Meteor.user().username,
         ticketId: ticketId,
         type: 2, // message
         data: ticket.data,
         timestamp: timestamp
      }
      //console.log('comment: '+JSON.stringify(comment));
      TicketHistory.insert(comment);

      if(Meteor.isClient) {
         console.log('Ticket inserted with success');
         $('#newTicketText').val('');
      }
   }

});
