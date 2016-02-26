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

  if ( !Meteor.users.findOne({username: 'sample'}) ) {

     // insert sample user
     console.log('Creating sample user in the database');
     let sampleUser = Accounts.createUser({
        username: 'sample',
        email: 'sample@meteorinflipflops.com',
        password: 'sample',
        profile: {
            first_name: 'sample',
            last_name: 'Assist',
            company: 'Assist'
        }
    });

    // create ticket for the sample user
    console.log('Creating sample ticket in the database');
    let timestamp = new Date();
    let sampleTicketId = Tickets.insert({
       priority: 'Medium',
       createdAt: timestamp,
       status: 'New',
       userId: sampleUser,
       userName: 'sample'
    });
    let firstHistoryId = TicketHistory.insert({
       userId: sampleUser,
       userName: 'sample',
       ticketId: sampleTicketId,
       type: 2, // message
       data: "The front door lock is not working properly",
       timestamp: timestamp,
    });
   Tickets.update({_id: sampleTicketId}, {$set:{ firstHistoryId: sampleTicketId}})

   // change status of the ticket
   Tickets.update({_id: sampleTicketId}, {$set:{ status: 'InProgress'}});

   // insert a comment from admin and change status to inprogress
   timestamp = new Date();
   let updateStatus = TicketHistory.insert({
      userId: Meteor.users.findOne({username:'admin'})._id,
      userName: 'admin',
      ticketId: sampleTicketId,
      type: 1, // status update
      data: "InProgress",
      timestamp: timestamp
    });
   let adminComment = TicketHistory.insert({
      userId: Meteor.users.findOne({username:'admin'})._id,
      userName: 'admin',
      ticketId: sampleTicketId,
      type: 2, // message
      data: "I'm going to have a look at this",
      timestamp: timestamp
    });

  }

});
