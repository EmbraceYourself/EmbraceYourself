var Rider = require('./riderModel.js');

var helper = require('../../config/helpers.js');

console.log('about to start rider')

Rider.riderTable();


module.exports = {

  addRider: function(req, res, next) {

    var client = helper.createClient();

    console.log('req.body: ', req.body);

    var rider = [

      req.body.trip_id,
      req.body.user_id,
      req.body.trip_end_date,
      req.body.trip_end_time,
      req.body.review_id,
      req.body.modified_on,
      req.body.created_on

    ];
    console.log('here in addRider')
    console.log(rider)


    client.connect(function(err) {
      if(err) {
        console.error('Post failed!');
        return res.status(500).json({ success: false, data: err});
      }

      client.query("SELECT * FROM riders WHERE user_id = $1 AND trip_id = $2", [req.body.user_id, req.body.trip_id], function(err, result) {
        if(err) throw err;
        if (result.rows.length > 0 || !req.body.user_id) {
          client.end();
          return res.status(202).send("Rider already exists");
        } else {

          var query = client.query("INSERT INTO riders(\
           trip_id, \
           user_id, \
           trip_end_date, \
           trip_end_time, \
           review_id, \
           modified_on,\
           created_on) \
           values ($1, $2, $3, $4, $5, $6, $7)", rider);

          query.on('end', function() {
            client.end();
            return res.status(201).send("Created new rider!");
          });
        }
      });

    });
  },

  getTripRiders: function(req, res, next) {

    var client = helper.createClient();

    client.connect(function(err) {
      if(err) {
        console.error('post failed!');
        return res.status(500).json({ success: false, data: err});
      }

      var tripID = req.body.tripID;

      var query = client.query("SELECT * FROM riders WHERE trip_id = $1", [tripID]);

      var foundRiders = [];

      query.on('row', function(row) {
        console.log(row)
        foundRiders.push(row);
      });

      query.on('end', function() {
        client.end();
        return res.send(foundRiders);
      });

    });
  },

  deleteRider: function(req, res, next) {

    var client = helper.createClient();

    client.connect(function(err) {
      if(err) {
        console.log('rider deletion connection failed!');
        return res.status(500).json({ success: false, data: err});
      }

      var data = [
        req.body.tripID,
        req.body.userID
      ]

      var query = client.query("DELETE FROM riders WHERE trip_id = $1 AND user_id = $2", data);

      query.on('end', function() {
        client.end();
        res.status(201).send("Rider has been deleted");
      });
    });

  }

}