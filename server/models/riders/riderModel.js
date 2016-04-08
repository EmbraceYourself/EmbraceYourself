var pg = require('pg');
var helper = require('../../config/helpers.js')
// var conString = "postgres://username:password@localhost/database";

var riderTable = function () {

  var client = helper.createClient();

  client.connect(function(err) {
    if(err) {
      return console.error('could not connect to postgres', err);
    }
    var query = client.query('CREATE TABLE IF NOT EXISTS riders(id SERIAL PRIMARY KEY, \
      trip_id INTEGER REFERENCES trips (id), \
      user_id INTEGER REFERENCES users (id), \
      review_id INTERGER REFERENCES reviews (id), \
      trip_end_date VARCHAR(255),\
      trip_end_time VARCHAR(255),\
      created_on VARCHAR(255), \
      modified_on VARCHAR(255) \
      )');

    query.on('end', function() { client.end(); });

  });

}

module.exports = {
  reviewTable: reviewTable
};