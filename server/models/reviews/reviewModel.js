var pg = require('pg');
var helper = require('../../config/helpers.js')
// var conString = "postgres://username:password@localhost/database";

var reviewTable = function () {

  var client = helper.createClient();

  client.connect(function(err) {
    if(err) {
      return console.error('could not connect to postgres', err);
    }

    var query = client.query('CREATE TABLE IF NOT EXISTS reviews(id SERIAL PRIMARY KEY, \
      reviewed_userID INT, \
      reviewing_userID INT, \
      review_stars INT, \
      review VARCHAR(255), \
      created_on VARCHAR(255), \
      modified_on VARCHAR(255) \
      )');

    query.on('end', function() { client.end(); });

  });

}

module.exports = {
  reviewTable: reviewTable
};

