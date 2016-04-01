var express = require('express');
var bodyParser = require('body-parser');
var tableSure = require('./server/models/users/userModel.js');

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



app.listen(port, function() {
  console.log('App up and running on http://localhost: ', port);
  tableSure();
});
