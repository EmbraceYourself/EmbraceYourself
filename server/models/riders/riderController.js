var Rider = require('./reviewModel.js');

var helper = require('../../config/helpers.js');

console.log('about to start rider')

Rider.riderTable();


module.exports = {

  addRider: function(req, res, next) {

   var rider = [

      req.body.trip_id,
      req.body.user_id,
      req.body.trip_end_date,
      req.body.trip_end_time,
      req.body.review_id,
      req.body.modified_on,
      req.body.created_on,

    ];

    client.connect(function(err) {
      if(err) {
        console.error('Post failed!');
        return res.status(500).json({ success: false, data: err});
      }

      var query = client.query("INSERT INTO riders(\
       trip_id, \
       user_id, \
       trip_end_date, \
       trip_end_time, \
       review_id, \
       modified_on,\
       create_on) \
       values ($1, $2, $3, $4, $5, $6, $7)", rider);

      query.on('end', function() {
        client.end();
        return res.status(201).send("Created new rider!");
      });

    });

  },

  getRider: function(req, res, next) {

    //get all fields from rider from database

    var client = helper.createClient();


  }

}