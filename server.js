var express = require('express');
var bodyParser = require('body-parser');
// database dependencies
var pg = require('pg');
var connectionString = 'postgres://localhost:5432/test';

// database users
var userTableSure = require('./server/models/users/userModel.js').userTableSure;
var userController = require('./server/models/users/userController.js');
// database trips
var tripTableSure = require('./server/models/trips/tripModel.js').tripTableSure;

var app = express();
var port = process.env.PORT || 8000;

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
app.use(express.static(__dirname + '/client'));
//app.use('/scripts', express.static(__dirname + '/bower_components'));

app.get('/', function(req, res){
  res.send("Rideshare server up and running!");
});

app.get('/data', function (req, res) {
  console.log("Get Received!");
  var client = new pg.Client(connectionString);
  userController.getUsers(req, res, client);

});

app.post('/data', function (req, res) {
  console.log("Post received!");
  if (req.body) {
    var client = new pg.Client(connectionString);
    userController.newUser(req.body.firstname, req.body.lastname, req, res, client);
  }
});

app.listen(port, function() {
  console.log('App up and running on http://localhost: ', port);
  userTableSure();
  tripTableSure();
});
