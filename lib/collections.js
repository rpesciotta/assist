// Files store
Files = new FS.Collection("Files", {
	stores: [new FS.Store.GridFS("Files")]
});

// Tickets collection
Tickets = new Mongo.Collection("Tickets");

// History collection
TicketHistory = new Mongo.Collection("TicketHistory");
/*
ticket_id: String
user_id: String
file_id: String
type: Number (1) Status Change, (2) Message
data: String
timestamp: Date
url: String
*/

validateTicket = function (ticket) {
	var errors = {};
	if (!ticket.text)	errors.text = "Enter a message";
	return errors;
}
