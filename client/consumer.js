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
  }
});
