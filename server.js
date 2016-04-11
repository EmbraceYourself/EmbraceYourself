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
var reviewController = require('./server/models/reviews/reviewController.js');



var app = express();
var port = process.env.PORT || 8000;

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
app.use(express.static(__dirname + '/client'));

//app.use('/data', expressJwt({secret: 'secret'})); // to support tokens and protect every call to /data

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


app.post('/data/reviews/status', function(req, res){
  console.log('Post for Review Status Recieved');
  if (req.body){
    var client = new pg.Client(connectionString);
    reviewController.checkReviewStatusOnLogin(req.body, req, res, client);
  }
});


app.post('/data/users/login', function (req, res) {

  console.log("Post received!");
  var profile = {};

  if (req.body) {
    var client = new pg.Client(connectionString);

    function loginUser(data, req, res, client) {

      client.connect(function(err) {
        if(err) {
          console.error('post failed!');
          return res.status(500).json({ success: false, data: err});
        }

        client.query("SELECT * FROM users WHERE username = $1 AND password = $2", [data.username, data.password], function(err, result) {
          if(err) throw err;
          if (!result) {
            client.end();
            res.status(202).send("Incorrect username and/or password!");
          } else {

            if (result.rows < 1) {
              res.send(401, 'Wrong user or password');
              return;
            }

            profile = {
              user_id: result.rows[0].id,
              username: result.rows[0].username,
              first_name: result.rows[0].first_name,
              last_name: result.rows[0].last_name,
              profile_pic: result.rows[0].profile_pic
            };

            // We are sending the profile inside the token
            var token = jwt.sign(profile, 'secret', { expiresIn: 18000 });

            res.json({
              token: token,
              user_id: profile.user_id,
              username: profile.username,
              first_name: profile.first_name,
              last_name: profile.last_name,
              profile_pic: profile.profile_pic
            });

            client.end();

          }
        });

      });
    }


    loginUser(req.body, req, res, client);
  }
});

// app.post('/data/users/login', function (req, res) {
//   console.log("Post received!");
//   if (req.body) {
//     var client = new pg.Client(connectionString);
//     userController.loginUser(req.body, req, res, client);
//   }
// });



app.post('/data/users/profile', function (req, res) {
  console.log("Post received!");
  if (req.body) {
    var client = new pg.Client(connectionString);
    userController.newBiography(req.body, req, res, client);
  }
});

app.post('/data/users/getProfileInfo', function (req, res) {
  console.log("Post received!");
 // console.log(req.body.userID);
  if (req.body) {
    var client = new pg.Client(connectionString);
    userController.getUserProfile(req.body, req, res, client);
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
