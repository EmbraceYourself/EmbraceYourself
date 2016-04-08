var express = require('express');
var bodyParser = require('body-parser');
// database dependencies
var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/test';



// database users
var userTableSure = require('./server/models/users/userModel.js').userTableSure;
var userController = require('./server/models/users/userController.js');
// database trips
var tripTableSure = require('./server/models/trips/tripModel.js').tripTableSure;
var tripController = require('./server/models/trips/tripController.js');

var app = express();
var port = process.env.PORT || 8000;

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
app.use(express.static(__dirname + '/client'));
//app.use('/scripts', express.static(__dirname + '/bower_components'));

// app.get('/', function(req, res){
//   res.send("Rideshare server up and running!");
// });

// NOT needed, kept for testing purposes
app.get('/data/users', function (req, res) {
  console.log("Get Received!");
  var client = new pg.Client(connectionString);
  userController.getUsers(req, res, client);
});

app.post('/data/users/signup', function (req, res) {
  console.log("Post received!");
  if (req.body) {
    var client = new pg.Client(connectionString);
    userController.newUser(req.body, req, res, client);
  }
});

app.post('/data/users/login', function (req, res) {
  console.log("Post received!");
  if (req.body) {
    var client = new pg.Client(connectionString);
    userController.loginUser(req.body, req, res, client);
  }
});

app.post('/data/trips/newtrip', function (req, res) {
  console.log("Post received!");
  if (req.body) {
    var client = new pg.Client(connectionString);
    tripController.newTrip(req.body, req, res, client);
  }
});

app.post('/data/trips/findtrip', function (req, res) {
  console.log("Post received!");
  if (req.body) {
    var client = new pg.Client(connectionString);
    tripController.findTrip(req.body, req, res, client);
  }
});

app.listen(port, function() {
  console.log('App up and running on http://localhost: ', port);
  userTableSure(connectionString, tripTableSure);
  // tripTableSure(connectionString);
});

//  Ben's line
// require('./server/config/middleware.js')(app, express);
