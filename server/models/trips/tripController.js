var helper = require('../../config/helpers.js');


function newTrip(data, req, res, client) {

  var dataInputs = [
    data.description,
    data.pickup_point,
    data.dropoff_point,
    data.depart_date,
    data.depart_time,
    data.arrival_date,
    data.arrival_time,
    data.seats,
    data.user_id
  ];

  client.connect(function(err) {
    if(err) {
      console.error('Post failed!');
      return res.status(500).json({ success: false, data: err});
    }

    var query = client.query("INSERT INTO trips(description, pickup_point, dropoff_point, depart_date, depart_time, arrival_date, arrival_time, seats, user_id) values ($1, $2, $3, $4, $5, $6, $7, $8, $9)", dataInputs);

    query.on('end', function() {
      client.end();
      return res.status(201).send("Created new trip!");
    });

  }); // end client.connect

}


function getTrip(data, req, res) {

  var client = helper.createClient();

  client.connect(function(err) {
    if(err) {
      console.error('post failed!');
      return res.status(500).json({ success: false, data: err});
    }

    client.query("SELECT * FROM trips WHERE tripID = $1", [data.tripID], function(err, result) {
      if(err) throw err;
      if (!result) {
        client.end();
        res.status(202).send("Trip could not be found");
      } else {
        client.end();
        return res.status(201).send(result);
      }
    });

  });
}

function findTrip(data, req, res, client) {

  var results = [];

  var dataInputs = [
    data.pickup_point,
    data.dropoff_point,
    data.depart_date, // "04/08/2016" string
  ];

  client.connect(function(err) {
    if(err) {
      console.error('Post failed!');
      return res.status(500).json({ success: false, data: err});
    }

    var query = client.query("SELECT * FROM trips WHERE pickup_point = $1 AND dropoff_point = $2 AND depart_date = $3", dataInputs);
    // var query = client.query("SELECT * FROM trips");

    query.on('row', function(row) {
      results.push(row);
    });

    query.on('end', function() {
      client.end();
      return res.send(results);
    });

  }); // end client.connect
}

module.exports = {
  newTrip: newTrip,
  findTrip: findTrip,
  getTrip: getTrip
};
