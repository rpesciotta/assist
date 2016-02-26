Meteor.startup(function() {

	// Configures login for the default accounts-ui package
	Accounts.ui.config({
		passwordSignupFields: 'USERNAME_AND_EMAIL'
	});

   Meteor.subscribe("userData");

});
