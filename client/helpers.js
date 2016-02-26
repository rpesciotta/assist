Template.registerHelper("isHelpdeskUser", function(){
   if (Meteor.user()) {
      //var currentUser = users.findOne(Meteor.userId());
      var currentUser = Meteor.user();
      console.log(currentUser);
      return !!currentUser.isAdmin;
   }
   else
      return false;
})
