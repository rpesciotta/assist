Template.registerHelper("isHelpdeskUser", function(){
   return Meteor.user() && !!Meteor.user().isAdmin;
});

Template.registerHelper('formatDate', function(date) {
	return moment(date).format('lll');
});

Template.helpdesk.helpers({
   'tickets': function() {
         return Tickets.find();
   }
});

Template.ticketItem.helpers({
   'firstMsg': function(id){
      return String(TicketHistory.findOne({ticketId:id}).data).substring(0,50);
   }
});
