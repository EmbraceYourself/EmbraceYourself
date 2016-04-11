var Messages = require('./messageModel.js');

var helper = require('../../config/helpers.js');

console.log('about to start')

Messages.messageTable();


module.exports = {

  addMessage: function(req, res, next) {

    var client = helper.createClient();

    var message = [
      req.body.message_text, 
      req.body.creator_id,
      req.body.creator_display_name,
      req.body.responds_to,
      req.body.message_trip_id,
      req.body.responses,
      req.body.created_on,
    ];

     console.log('message:   ')
    console.log(message);

    client.connect(function(err) {
      if(err) {
        console.error('Post failed!');
        return res.status(500).json({ success: false, data: err});
      }


      var query = client.query("INSERT INTO messages(\
       message_text, \
       creator_id, \
       creator_display_name, \
       responds_to, \
       message_trip_id, \
       responses, \
       modified_on) \
       values ($1, $2, $3, $4, $5, $6, $7)", message);

      query.on('end', function() {
        client.end();
        return res.status(201).send("Created new message!");
      });

    });
  },

  getTripMessages: function(req, res, next) {

    var criteria = [
      req.body.message_trip_id,
    ];

    var client = helper.createClient();

    console.log('criteria: ')
    console.log(criteria)

    client.connect(function(err) {
     if(err) {
       console.error('Did not query');
       return res.status(500).json({success: false, data: err});
     }

     var query = client.query("SELECT * FROM messages WHERE message_trip_id = $1", 
       criteria);



      var foundMessages = [];

      query.on('row', function(row) {
        console.log(row)
        foundMessages.push(row);
      });

      query.on('end', function() {
        client.end();
        return res.send(foundMessages);
      });

    });

  },


  getMessage: function(req, res, next) {

    var criteria = [
      req.body.message_id,
    ];

    var client = helper.createClient();

    console.log('getMessage criteria: ')
    console.log(criteria)

    client.connect(function(err) {
     if(err) {
       console.error('Did not query');
       return res.status(500).json({success: false, data: err});
     }

     var query = client.query("SELECT * FROM messages WHERE id = $1", 
       criteria);



      var foundMessage = [];

      query.on('row', function(row) {
        console.log(row)
        foundMessage.push(row);
      });

      query.on('end', function() {
        client.end();
        return res.send(foundMessage);
      });

    });

  },

  insertResponses: function(req, res, next) {

    var client = helper.createClient();

    var criteria = [
      req.body.responses,
      req.body.message_id
    ];

     console.log('criteria:   ')
    console.log(criteria);

    client.connect(function(err) {
      if(err) {
        console.error('Post failed!');
        return res.status(500).json({ success: false, data: err});
      }

      var query = client.query("UPDATE messages SET responses = $1\
       WHERE id = $2", criteria);

      query.on('end', function() {
        client.end();
        return res.status(201).send("Created new message!");
      });

    });
  }


}