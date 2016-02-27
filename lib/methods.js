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

		// insert comment
		var comment = {
         userId: Meteor.userId(),
         userName: Meteor.user().username,
         ticketId: ticketId,
         type: 2, // message
         data: ticket.data,
         timestamp: timestamp
      }
      var historyId = TicketHistory.insert(comment);

		if (ticket.fileId) {
			TicketHistory.update({'_id': historyId}, { $set: {
				fileId: ticket.fileId,
				url: '/cfs/files/files/'+ticket.fileId
				}
			});
		}

      if(Meteor.isClient) {
         console.log('Ticket inserted with success');
         $('#newTicketText').val('');
			$('#newTicketFile').val('');
      }
   },

	newHistory: function(update) {
		console.log('newHistory: start. args: ',update);

		var timestamp = new Date(); // common timestamp for all entries
		// insert comment
		var comment = {
         userId: Meteor.userId(),
         userName: Meteor.user().username,
         ticketId: update.ticketId,
         type: 2, // message
         data: update.data,
         timestamp: timestamp
      }
		console.log('comment for update: ',comment);
		var historyId = TicketHistory.insert(comment);

		if (update.fileId) {
			console.log('updating history with fileId');
			TicketHistory.update({'_id': historyId}, { $set: {
				fileId: update.fileId,
				url: '/cfs/files/files/'+update.fileId
				}
			});
		}

		if(Meteor.isClient) {
         console.log('Ticket updated with success');
         $('#updateTicketText').val('');
			$('#updateTicketFile').val('');
      }
	},

	startProgress: function(ticketId) {
		console.log('startProgress started')
		Tickets.update(ticketId, {$set:{status: 'InProgress'}});
		var comment = {
         userId: Meteor.userId(),
         userName: Meteor.user().username,
         ticketId: ticketId,
         type: 1, // message
         data: 'InProgress',
         timestamp: new Date()
      }
		console.log('comment: ',comment)
		var historyId = TicketHistory.insert(comment);
		console.log('historyId created: ',historyId);
	},

	closeTicket: function(ticketId) {
		console.log('closeTicket started')
		Tickets.update(ticketId, {$set:{status: 'Closed'}});
		var comment = {
         userId: Meteor.userId(),
         userName: Meteor.user().username,
         ticketId: ticketId,
         type: 1, // message
         data: 'Closed',
         timestamp: new Date()
      }
		console.log('comment: ',comment)
		var historyId = TicketHistory.insert(comment);
		console.log('historyId created: ',historyId);
	}

});
