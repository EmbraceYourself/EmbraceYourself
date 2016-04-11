var pg = require('pg');
var helper = require('../../config/helpers.js')
// var conString = "postgres://username:password@localhost/database";

var messageTable = function () {

  var client = helper.createClient();

  client.connect(function(err) {
    if(err) {
      return console.error('could not connect to postgres', err);
    }

    var query = client.query('CREATE TABLE IF NOT EXISTS messages(id SERIAL PRIMARY KEY, \
      message_text VARCHAR(500), \
      creator_id INT, \
      creator_display_name VARCHAR(255), \
      responds_to INT, \
      message_trip_id INT, \
      responses text[], \
      modified_on VARCHAR(255) \
      )');

    query.on('end', function() { client.end(); });

  });

}

module.exports = {
  messageTable: messageTable
};