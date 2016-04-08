// PostgresQL database Setup
// Official Documentation: https://github.com/brianc/node-postgres/wiki/pg
// Guide: http://mherman.org/blog/2015/02/12/postgresql-and-nodejs/

var pg = require('pg');
// var conString = "postgres://username:password@localhost/database";
// var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/test';

var tripTableSure = function (connectionString) {

  var client = new pg.Client(connectionString);

  client.connect(function(err) {
    if(err) {
      return console.error('could not connect to postgres', err);
    }
    // date and time are still VARCHAR as well as separate... for now
    var query1 = client.query('CREATE TABLE IF NOT EXISTS trips(id SERIAL PRIMARY KEY, description VARCHAR(255), pickup_point VARCHAR(255), dropoff_point VARCHAR(255), depart_date VARCHAR(255), depart_time VARCHAR(255), arrival_date VARCHAR(255), arrival_time VARCHAR(255), seats INTEGER, user_id INTEGER REFERENCES users (id))');

    query1.on('end', function() { client.end(); });
  });

}

module.exports = {
  tripTableSure: tripTableSure
};