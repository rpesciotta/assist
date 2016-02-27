Template.consumerIssues.helpers({
  'consumerIssues': function(){
    sampleIssues = [
      {
        priority: "Low",
        status: "New",
        description: "The toilet is not working"
      }
    ]
    return sampleIssues;
   },
   'consumerTickets': function() {
     return Tickets.find({userId: Meteor.userId()}, { sort: { createdAt: -1 }} );
   }
});
Template.issueCard.helpers({
  'prioColor': function(status){
    let color;
    switch (status){
      case 'Low':
        color = "#FBC02D";
        break;
      case 'Medium':
        color = "#F57C00";
        break;
      case 'High':
        color = "#D32F2F";
        break;
      }
      return color;
    }
});

Template.issueCard.events({
  "click .issueHeading": function(event, template){
    const issueCard     = $(event.target).closest(".issueCard");
    const issueDetails  = issueCard.children(".issueDetails");
    issueDetails.toggle(200);
    issueCard.toggleClass("cardVisible");
},
'click .js-update-ticket': function(event) {
   event.preventDefault();
   let $ticketCard = $(event.target).closest('.ticketCard');
   let ticketId = $ticketCard.attr('id');
   console.log('consumer UI: updating ticket ',ticketId);

   let $textInput = $ticketCard.find('#updateTicketText');
   let update = {
      data: $textInput.val(),
      ticketId: ticketId
   }
   console.log('update: ',update);

   var $fileInput = $ticketCard.find('#updateTicketFile');
   var file = $fileInput.get(0).files[0];
   if (file) {
      var fileFs = new FS.File(file);
      var fileId = Files.insert(fileFs, function(err, result) {
         if(err) throw new Meteor.Error(err);
      });
      update.fileId = fileId._id;
   }

   Meteor.call('newHistory', update);
   $fileInput.val('');
   $textInput.val('');
}
});
