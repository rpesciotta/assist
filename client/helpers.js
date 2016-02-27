Template.registerHelper("isHelpdeskUser", function(){
   return Meteor.user() && !!Meteor.user().isAdmin;
});

Template.registerHelper('formatDate', function(date) {
	return moment(date).format('lll');
});

Template.helpdesk.helpers({
   'tickets': function() {
      return Tickets.find();
   },
   'ticketSelected': function() {
      return Session.get('ticketSelected');
   }
});

Template.helpdesk.events({
   'submit .newticketForm': function(event) {
      event.preventDefault();

      // upload file first
      var file = $('#newTicketFile').get(0).files[0];
      if (file) {
         var fileFs = new FS.File(file);
         var fileId = Files.insert(fileFs, function(err, result) {
            if(err) throw new Meteor.Error(err);
         });
      }

      Meteor.call('newTicket', {
         priority: 'Medium',
         data: $(event.target).find('#newTicketText').val(),
         fileId: fileId._id
      });

   }
});

// new template
Template.ticketList.helpers({
   'tickets': function() {
      return Tickets.find();
   },
   'firstMsg': function(id){
      var history = TicketHistory.findOne({ticketId:id})
      return history ? String(history.data).substring(0,50) : "no data";
   },
});

Template.ticketList.events({
   'click .ticketItem': function(event) {
      var currentId = $(event.target).attr('id');

      if (Session.get('ticketSelected')==currentId) {
         Session.clear('ticketSelected');
      }
      else {
         Session.set('ticketSelected', currentId);
      }
   }
});

Template.ticketCard.helpers({
   'history': function(ticketId) {
      return TicketHistory.find({ticketId: ticketId});
   },
   'ticketSelected': function() {
      return Session.get('ticketSelected');
   },
   'isMessage': function(historyId) {
      return TicketHistory.findOne(historyId).type == 2;
   },
   'isStatusChange': function(historyId) {
      return TicketHistory.findOne(historyId).type == 1;
   }
});
