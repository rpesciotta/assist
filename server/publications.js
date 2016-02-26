// place the necessary publications here
// server
Meteor.publish("userData", function () {
  //if (this.userId) {
    return Meteor.users.find({_id: this.userId},
                             {fields: {'username':1, 'profile':1, '_id':1, 'isAdmin': 1}});
  //} else {
   // this.ready();
  //}
});
