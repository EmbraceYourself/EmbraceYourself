var express = require('express');
var bodyParser = require('body-parser');
var expressJwt = require('express-jwt');
var jwt = require('jsonwebtoken');
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

app.use('/data', expressJwt({secret: 'secret'})); // to support tokens and protect every call to /data

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

app.post('/authenticate', function (req, res) {
  //TODO validate req.body.username and req.body.password
  //if is invalid, return 401
  if (!(req.body.username === 'john.doe' && req.body.password === 'foobar')) {
    res.send(401, 'Wrong user or password');
    return;
  }

  var profile = {
    first_name: 'John',
    last_name: 'Doe',
    email: 'john@doe.com',
    id: 123
  };

  // We are sending the profile inside the token
  var token = jwt.sign(profile, 'secret', { expiresInMinutes: 60*5 });

  res.json({ token: token });
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
require('./server/config/middleware.js')(app, express);
