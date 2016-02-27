function timeToSolve(prio){
   switch(prio) {
      case 'Low': return 3600; // 1h
      case 'Medium': return 300; // 30m
      case 'High': return 3600/4; // 15min
      default: return 3600; // 1 hour
   }
}

Template.registerHelper("isHelpdeskUser", function(){
   return Meteor.user() && !!Meteor.user().isAdmin;
});

Template.registerHelper('formatDate', function(date) {
	return moment(date).format('lll');
});

Template.registerHelper('timeToExpire', function(ticketId) {
   var currentProgress = Session.get(ticketId+'-progress');
   if (currentProgress==undefined) {
      return "Expires at some point...";
   }
   else {
      // calculate what should be the current progress
      var ticket = Tickets.findOne(ticketId);
      if (ticket) {
         var createdAt = moment(ticket.createdAt);
         var target = moment(createdAt).add(timeToSolve(ticket.priority),'seconds');
         if (!moment(target).isBefore(moment()) ) {
            return 'Expires in '+moment().to(moment(target));
         }
         else {
            return 'Expired '+moment().to(moment(target));
         }
      }
      else return "Expires at some point...";
   }
	return moment(date).format('lll');
});

Template.registerHelper('formatFromNow', function(date) {
   return String(moment(date).fromNow());
})

Template.registerHelper('tickets', function() {
  return Tickets.find({}, { sort: { createdAt: -1 }} );
});

Template.registerHelper('firstMsg',function(id){
   var history = TicketHistory.findOne({ticketId:id});
   return history ? String(history.data).substring(0,50) : "no data";
});

Template.helpdesk.helpers({
   'ticketSelected': function() {
      return Session.get('ticketSelected');
   }
});

Template.newIssueForm.events({
   'click .js-submit-ticket': function(event) {
      console.log("test");
      event.preventDefault();

      let formElem = $("form.newticketForm");

      let issue = {
         priority: formElem.find("input:radio[name='priority']:checked").val(),
         data: formElem.find('#newTicketText').val(),
      }

      var file = $('#newTicketFile').get(0).files[0];
      if (file) {
         var fileFs = new FS.File(file);
         var fileId = Files.insert(fileFs, function(err, result) {
            if(err) throw new Meteor.Error(err);
         });
         issue.fileId = fileId._id;
      }

      Meteor.call('newTicket', issue);

   }
});

// new template
Template.ticketList.onRendered(() => {
   // callback to update timer
   this.setInterval(() => {
      $('.mdl-progress').each(function() {
         let currentElem = $(this);
         var ticketId = currentElem.closest('tr').attr('id');
         if(ticketId) {
            var currentProgress = Session.get(ticketId+'-progress');
            if (currentProgress==undefined) {
               currentProgress = 100;
            }
            else {
               // calculate what should be the current progress
               var ticket = Tickets.findOne(ticketId);
               if (ticket) {
                  var createdAt = moment(ticket.createdAt);
                  var diff = moment(createdAt).diff(moment(), 'seconds');
                  currentProgress = 100-100*(-diff/timeToSolve(ticket.priority));
                  if (currentProgress < 0) currentProgress = 0;
               }
            }

            Session.set(ticketId+'-progress', currentProgress);
            currentElem.get(0).MaterialProgress.setProgress(currentProgress);

         }
         else {
            console.log('no ticketId found for this ticket element');
         }
      });
   }, 1000);
});

Template.ticketList.helpers({
   'tickets': function() {
      return Tickets.find();
   }
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
   },
   'mdl-componentupgraded #progress': function(event) {
      var ticketId = $(event.target).closest('tr').attr('id');
      if(ticketId) {
         var currentProgress = Session.get(ticketId+'-progress');
         if (!currentProgress) {
            currentProgress = 100;
         }
         else {
            // calculate what should be the current progress
            var ticket = Tickets.findOne(ticketId);
            if (ticket) {
               var createdAt = moment(ticket.createdAt);
               var diff = moment(createdAt).diff(moment(), 'seconds');
               console.log('diff: ',diff);
               // hard-coding 10h
               currentProgress = -timeToSolve(ticket.priority)/diff;
            }
         }

         Session.set(ticketId+'-progress', currentProgress);
         event.target.MaterialProgress.setProgress(currentProgress);

      }
      else {
         console.log('no ticketId found for this ticket element');
      }
   }
});

Template.ticketCard.helpers({
   'ticketSelected': function() {
      return Session.get('ticketSelected');
   }
});

Template.registerHelper('history', function(ticketId) {
   return TicketHistory.find({ticketId: ticketId},{sort: {timeStamp: -1}});
});
Template.registerHelper('isMessage', function(historyId) {
  return TicketHistory.findOne(historyId).type == 2;
});
Template.registerHelper('isStatusChange', function(historyId) {
  return TicketHistory.findOne(historyId).type == 1;
});
