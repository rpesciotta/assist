Meteor.methods({
	newTicket: function(ticket) {
		console.log(JSON.stringify(ticket));
		// insert ticket
      var timestamp = new Date(); // common timestamp for all entries
      _.extend(ticket, {
         createdAt: timestamp,
         status: 'New',
         userId: Meteor.userId(),
         userName: Meteor.user().username
      });
      var ticketId = Tickets.insert(_.omit(ticket,['data','fileId']));

		if (ticket.fileId) {
			Tickets.update({'_id': ticketId}, { $set: {
				fileId: ticket.fileId,
				url: '/cfs/files/files/'+ticket.fileId
				}
			});
		}

		// insert comment
		var comment = {
         userId: Meteor.userId(),
         userName: Meteor.user().username,
         ticketId: ticketId,
         type: 2, // message
         data: ticket.data,
         timestamp: timestamp
      }
      TicketHistory.insert(comment);

      if(Meteor.isClient) {
         console.log('Ticket inserted with success');
         $('#newTicketText').val('');
			$('#newTicketFile').val('');
      }
   }

});
