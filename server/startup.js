Meteor.startup(function () {
  //create admin user
  if ( Meteor.users.find({username: 'admin'}).count() === 0 ) {
    let admin = Accounts.createUser({
        username: 'admin',
        email: 'admin@meteorinflipflops.com',
        password: 'admin',
        profile: {
            first_name: 'Admin',
            last_name: 'Assist',
            company: 'Assist',
        }
    });
    // store admin role on user
    Meteor.users.update({_id:admin}, {$set: {isAdmin: true}});
  }

});
