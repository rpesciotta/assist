Template.registerHelper("isHelpdeskUser", function(){
  return users.findOne({_id:Meteor.userId()}).count();
})
