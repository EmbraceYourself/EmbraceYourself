var pg = require('pg');
var connectionString = 'postgres://localhost:5432/test';

module.exports = {

  errorLogger: function (error, req, res, next) {

   console.log(error.stack);
   next(error);
  },

  errorHandler: function (error, req, res, next) {

    res.status(500).send({error: error.message}); 
  },

  createClient: function() {

    return new pg.Client(connectionString);

  }


}