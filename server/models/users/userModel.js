// PostgresQL database Setup
// Official Documentation: https://github.com/brianc/node-postgres/wiki/pg
// Guide: http://mherman.org/blog/2015/02/12/postgresql-and-nodejs/

var pg = require('pg');
// var conString = "postgres://username:password@localhost/database";
var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/test';

module.exports = function  () {

  var client = new pg.Client(connectionString);

  client.connect(function(err) {
    if(err) {
      return console.error('could not connect to postgres', err);
    }
    client.query('CREATE TABLE IF NOT EXISTS users(id SERIAL PRIMARY KEY, firstname VARCHAR(40), lastname VARCHAR(40))');
    client.query('CREATE TABLE IF NOT EXISTS messages(id SERIAL PRIMARY KEY, text VARCHAR(40))');
    client.end();
  });

}

// module.exports = {
//   tableSure: tableSure
// };
