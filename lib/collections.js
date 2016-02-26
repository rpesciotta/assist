// Files store
Files = new FS.Collection("Files", {
	stores: [new FS.Store.GridFS("Files")]
});

// Tickets collection
Tickets = new Mongo.Collection("Tickets");
/*
_id: String
priority: String - Low, Medium, High
createdAt: Date
firstHistoryId: String
status: String - New, InProgress, Closed
userId: String
userName: String
*/

// History collection
TicketHistory = new Mongo.Collection("TicketHistory");
TicketHistory.attachSchema(new SimpleSchema({
  ticketId: { type: String },
  userId: { type: String },
  userName: { type: String },
  fileId: { type: String, optional: true },
  type: { type: Number, allowedValues: [1,2] },
  data: { type: String, optional: true },
  timeStamp: { type: Date, defaultValue: new Date() },
  url: { type: String, optional: true }
}));
/*
ticketId: String
userId: String
userName: String
fileId: String
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
