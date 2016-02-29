function timeToSolve(prio){
   switch(prio) {
      case 'Low': return 3600; // 1h
      case 'Medium': return 600; // 10m
      case 'High': return 120; // 2min
      default: return 3600; // 1 hour - safety default value
   }
}

Template.registerHelper("isHelpdeskUser", function(){
   return Meteor.user() && !!Meteor.user().isAdmin;
});

Template.registerHelper('formatDate', function(date) {
	return moment(date).format('MMM D, HH:mm');
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
            return 'Expires '+moment().to(moment(target));
         }
         else {
            return 'Expired '+moment().to(moment(target));
         }
      }
      else return "";
   }
});

Template.registerHelper('formatFromNow', function(date) {
  return String(moment(date).fromNow());
})

Template.registerHelper('tickets', function() {
  let returns = Tickets.find({}).fetch().map((t) => {
    var createdAt = moment(t.createdAt);
    var target = moment(createdAt).add(timeToSolve(t.priority),'seconds');
    t.targetTime = target;
    return t;
  });
  return _.sortBy(returns, (item) => -item.targetTime.toDate());
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
   'click .js-submit-ticket'(event) {
      console.log("test");
      event.preventDefault();

      let formElem = $("form.newticketForm");

      let issue = {
         priority: formElem.find("input:radio[name='priority']:checked").val() || 'Low',
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
               currentProgress = 0;
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
  'helpDeskTickets': function() {
    let tickets = Tickets.find({}).fetch().map((t) => {
      var createdAt = moment(t.createdAt);
      t.targetTime = moment(createdAt).add(timeToSolve(t.priority),'seconds');
      return t;
    });
    tickets = _.filter(tickets, (t) => {
      // return tickets that have not been closed
      if(t.status!="Closed") return t;
      // filter out ticket that were closed more than 5 minutes ago

      // grab last status change history
      var closeHistory = _.last(TicketHistory.find({ticketId: t._id, type: 1}).fetch());
      var tolerance = moment().subtract(5,'minutes');
      if(tolerance.isBefore(moment(closeHistory.timestamp))) return t;
      //if (moment(closeHistory.timestamp).isBefore(tolerance)) return t;
    });
    return _.sortBy(tickets, (item) => -item.targetTime.toDate());
  },

  'ticketIsClosed': function(ticketId) {
    var ticket = Tickets.findOne(ticketId);
    return ticket && ticket.status == 'Closed';
  }
});

Template.ticketList.events({
   'click .ticketItem': function(event) {
      var currentId = $(event.target).attr('id');

      if (Session.get('ticketSelected')==currentId) {
         Session.set('ticketSelected',undefined);
      }
      else {
         Session.set('ticketSelected', currentId);
      }
   }
});

Template.ticketCard.helpers({
   'ticketSelected': function() {
      return Session.get('ticketSelected');
   },
   'getSelectedTicket': function(ticketId){
      return Tickets.findOne(ticketId);
   },
   'notInProgress': function() {
      var ticket = Tickets.findOne(Session.get('ticketSelected'));
      return ticket && ticket.status == 'New';
   },
   'ticketNotClosed': function() {
      var ticket = Tickets.findOne(Session.get('ticketSelected'));
      return ticket && ticket.status != 'Closed';
   }
});

Template.ticketCard.events({
   'click .js-update-ticket': function(event) {

      event.preventDefault();
      let ticketId = Session.get('ticketSelected');
      console.log('updating ticket ',ticketId);

      let update = {
         data: $('#updateTicketText').val(),
         ticketId: ticketId
      }
      console.log('update: ',update);

      var file = $('#updateTicketFile').get(0).files[0];
      if (file) {
         var fileFs = new FS.File(file);
         var fileId = Files.insert(fileFs, function(err, result) {
            if(err) throw new Meteor.Error(err);
         });
         update.fileId = fileId._id;
      }

      Meteor.call('newHistory', update);
   },

   'click .js-start-progress': function(event) {
      event.preventDefault();
      let ticketId = Session.get('ticketSelected');
      console.log('starting progress on ticket ',ticketId);
      Meteor.call('startProgress', ticketId);
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
