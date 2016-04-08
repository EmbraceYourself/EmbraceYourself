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

// signup CHANGE OBJECTKEYS
function newUser(data, req, res, client) {

  var dataInputs = [
    data.username,
    data.password,
    data.first_name,
    data.last_name,
    data.email,
    data.age,
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
        var query = client.query("INSERT INTO users(username, password, first_name, last_name, email, age, profile_pic, city, state, zip_code) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)", dataInputs);

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

module.exports = {
  getUsers: getUsers,
  newUser: newUser,
  loginUser: loginUser
};
