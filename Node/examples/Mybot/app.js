var restify = require('restify');
var builder = require('../../core/');

//=========================================================
// Bot Setup
//=========================================================

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});
  
// Create chat bot
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());


bot.dialog('/', [
    function (session) {
        session.send("Hi... I'm  CapitalOne Bot.");
		var msg = new builder.Message(session)
            .attachments([{
                contentType: "image/png",
                contentUrl: "https://www.capitalone.com/media/graphic-logo/global/icons/capone-logo200x200.png"
            }]);
        session.endDialog(msg);
        session.beginDialog('/menu');
    },
    function (session, results) {
        // Always say goodbye
        session.send("Ok... See you later!");
    }
]);

bot.dialog('/menu', [
    function (session) {
        builder.Prompts.choice(session, "What would you like to do?", "Check Balance|Open Account|Other|(quit)", { listStyle: builder.ListStyle.button });
    },
    function (session, results) {
        if (results.response && results.response.entity != '(quit)') {
            // Launch demo dialog
            session.beginDialog('/' + results.response.entity);
        } else {
            // Exit the menu
            session.endDialog();
        }
    },
    function (session, results) {
        // The menu runs a loop until the user chooses to (quit).
        session.replaceDialog('/menu');
    }
]);

bot.dialog('/Open Account', [
    function (session) {
        session.send("You can easily send pictures to a user...");
        var msg = new builder.Message(session)
            .attachments([{
                contentType: "image/jpeg",
                contentUrl: "http://www.theoldrobots.com/images62/Bender-18.JPG"
            }]);
        session.endDialog(msg);
    }
]);

bot.dialog('/Check Balance', [
    function (session) {
		var accountNumber=session.accountNumber;
		
		if(!accountNumber){
		builder.Prompts.number(session, 'what is the account number');
		}else{
			next();
		}
	},
	 function (session, results, next) {
		if(results.response) {
            session.accountNumber = results.response;
        }
		session.endDialog("getting account balance for account: %s", session.message.text);
    },
]);

bot.dialog('/Other', [
    function (session) {
        session.send("You can easily send pictures to a user...");
        var msg = new builder.Message(session)
            .attachments([{
                contentType: "image/jpeg",
                contentUrl: "http://www.theoldrobots.com/images62/Bender-18.JPG"
            }]);
        session.endDialog(msg);
    }
]);