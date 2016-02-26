Meteor.startup(function () {
  //create admin user
  if ( !Meteor.users.findOne({username: 'admin'}) ) {
     console.log('Creating admin user in the database');
    let adminId = Accounts.createUser({
        username: 'admin',
        email: 'admin@meteorinflipflops.com',
        password: 'admin',
        profile: {
            first_name: 'Admin',
            last_name: 'Assist',
            company: 'Assist'
        }
    });
    // store admin role on user
    Meteor.users.update({_id:adminId}, {$set: {isAdmin: true}});
    //console.log(Meteor.users.findOne({username:'admin'}));
  }

});
