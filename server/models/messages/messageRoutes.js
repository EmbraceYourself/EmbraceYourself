var messageController = require('./messageController.js');

module.exports = function (app) {

 console.log('IN MESSAGE CONTROLLER');
 app.post('/add_message', messageController.addMessage);
 app.post('/get_trip_messages', messageController.getTripMessages);
 app.post('/get_message', messageController.getMessage);
 app.post('/insert_response', messageController.insertResponses);


}