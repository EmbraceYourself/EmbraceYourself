var helper = require('../../config/helpers.js');

// NOT needed, kept for testing purposes
function getUsers(req, res, client) {
  var results = [];
  client.connect(function(err) {
    if(err) {
      console.error('Get failed!');
      return res.status(500).json({ success: false, data: err});
    }

    var query = client.query('SELECT * FROM users');

    query.on('row', function(row) {
      results.push(row);
    });

    query.on('end', function() {
      client.end();
      return res.send(results);
    });
  }); // end client.connect
}

// signup
function newUser(data, req, res, client) {

  var dataInputs = [
    data.username,
    data.password,
    data.first_name,
    data.last_name,
    data.email,
    data.birth_date,
    data.profile_pic,
    data.city,
    data.state,
    data.zip_code
  ];

  client.connect(function(err) {
    if(err) {
      console.error('Post failed!');
      return res.status(500).json({ success: false, data: err});
    }

    client.query("SELECT * FROM users WHERE username = $1", [data.username], function(err, result) {
      if(err) throw err;
      if (result.rows.length > 0 || !data.username || !data.password) {
        client.end();
        return res.status(202).send("User either already exists or the username and/or password have not been entered!");
      } else {
        var query = client.query("INSERT INTO users(username, password, first_name, last_name, email, birth_date, profile_pic, city, state, zip_code) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)", dataInputs);

        query.on('end', function() {
          client.end();
          return res.status(201).send("Created new user!");
        });
      }
    });

  }); // end client.connect
}

function loginUser(data, req, res, client) {

  client.connect(function(err) {
    if(err) {
      console.error('post failed!');
      return res.status(500).json({ success: false, data: err});
    }

    client.query("SELECT * FROM users WHERE username = $1 AND password = $2", [data.username, data.password], function(err, result) {
      if(err) throw err;
      if (result.rows.length === 0) {
        client.end();
        res.status(202).send("Incorrect username and/or password!");
      } else {
        client.end();
        return res.status(201).send("Login worked!");
      }
    });

  }); // end client.connect
}

function getUser(req, res) {

  var client = helper.createClient();

  console.log('Here in getUser')
  console.log(req.body.userID)

  var results = [];
  client.connect(function(err) {
    if(err) {
      console.error('Get failed!');
      return res.status(500).json({ success: false, data: err});
    }

    var query = client.query("SELECT * FROM users WHERE id = $1", [req.body.userID]);

    query.on('row', function(row) {
      results.push(row);
    });

    query.on('end', function() {
      client.end();
      return res.send(results);
    });
  }); // end client.connect
}
function getUserProfile(reqbody, req, res, client) {

  var client = helper.createClient();

  console.log('Here in getUser')
  //console.log(req.body.userID)
  // console.log("request is:", req)


  var results = [];
  client.connect(function(err) {
    if(err) {
      console.error('Get failed!');
      return res.status(500).json({ success: false, data: err});
    }

    var query = client.query("SELECT * FROM users WHERE id = $1", [reqbody.userID]);

    query.on('row', function(row) {
      results.push(row);
    });

    query.on('end', function() {
      client.end();
        
      return res.send(results);
    });
  }); // end client.connect
}

// make a profile
function newBiography(data, req, res, client) {

  client.connect(function(err) {
    if(err) {
      console.error('Post failed!');
      return res.status(500).json({ success: false, data: err});
    }

    client.query("SELECT * FROM users WHERE id = $1", [data.id], function(err, result) {
      if(err) throw err;
      console.log("data:", data);
      if (result.rows.length < 1) {
        client.end();
        return res.status(202).send("User ID not present!");
      } else {
        var query = client.query("UPDATE users SET biography = $1 WHERE id = $2", [data.biography, data.id]);
        // information.biography  $window.sessionStorage.id in app.js of client

        query.on('end', function() {
          client.end();
          return res.status(201).send("Updated biography of user!");
        });
      }
    });

  }); // end client.connect
}




module.exports = {
  getUsers: getUsers,
  newUser: newUser,
  loginUser: loginUser,
  newBiography: newBiography,
  getUser: getUser,
  getUserProfile: getUserProfile
};
