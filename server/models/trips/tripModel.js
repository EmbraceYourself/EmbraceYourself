// PostgresQL database Setup
// Official Documentation: https://github.com/brianc/node-postgres/wiki/pg
// Guide: http://mherman.org/blog/2015/02/12/postgresql-and-nodejs/

var pg = require('pg');
// var conString = "postgres://username:password@localhost/database";
var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/test';

var tripTableSure = function () {

  var client = new pg.Client(connectionString);

  client.connect(function(err) {
    if(err) {
      return console.error('could not connect to postgres', err);
    }
    var query1 = client.query('CREATE TABLE IF NOT EXISTS trips(id SERIAL PRIMARY KEY, event VARCHAR(255))');

    query1.on('end', function() { client.end(); });
  });

}

module.exports = {
  tripTableSure: tripTableSure
};
