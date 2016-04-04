function tableSure (client) {

  client.connect(function(err) {
    if(err) {
      return console.error('could not connect to postgres', err);
    }
    var query1 = client.query('CREATE TABLE IF NOT EXISTS users(id SERIAL PRIMARY KEY, firstname VARCHAR(255), lastname VARCHAR(255))');

    var query2 = client.query('CREATE TABLE IF NOT EXISTS cars(id SERIAL PRIMARY KEY, text VARCHAR(255))');

    // var query3 = client.query("INSERT INTO users (firstname, lastname) VALUES ('Bob', 'Barley')");


    query2.on('end', function() { client.end(); });
    });


}

function getUsers (req, res, client) {
  var results = [];
  client.connect(function(err) {
    if(err) {
      console.error('get failed!');
      return res.status(500).json({ success: false, data: err});
    }

    var query = client.query('SELECT * FROM users');

    query.on('row', function(row) {
      results.push(row);
    });

    query.on('end', function() {
      client.end();
      return res.json(results);
    });
  }); // end client.connect
}

function newUser (firstname, lastname, req, res, client) {

  client.connect(function(err) {
    if(err) {
      console.error('post failed!');
      return res.status(500).json({ success: false, data: err});
    }

    var query = client.query("INSERT INTO users(firstname, lastname) values($1, $2)", [firstname, lastname]);


    query.on('end', function() {
      client.end();
      return res.send("Success");
    });

  }); // end client.connect
}

module.exports = {
  tableSure: tableSure,
  getUsers: getUsers,
  newUser: newUser
};


// var User = require('./userModel.js'),
//
// /*exmaple of how to make table relatonsips:
// var User = sequelize.define('user', { name: Sequelize.STRING })
//   , Task = sequelize.define('task', { name: Sequelize.STRING })
//   , Tool = sequelize.define('tool', { name: Sequelize.STRING })
//
// Task.belongsTo(User)
// User.hasMany(Task)
// User.hasMany(Tool, { as: 'Instruments' })
//
//
// sequelize.sync().then(function() {
//   // this is where we continue ...
// })
// */
//
//
// module.exports = {
//
//
//   findAllUsers: function(req, res, next) {
//
//     User.findAll({ }).then(function(users) {
//       console.log(JSON.stringify(tasks));
//     });
//   },
//
//
//   signup: function(req, res, next) {
//
//     User
//       .findOrCreate({where: {username: 'sdepold'}, defaults: {job: 'Technical Lead JavaScript'}})
//       .spread(function(user, created) {
//          console.log(user.get({
//          plain: true
//          }))
//          console.log(created)
//
//     /*EXAMPLE USER GOES HERE:
//       {
//         username: 'sdepold',
//         job: 'Technical Lead JavaScript',
//         id: 1,
//         createdAt: Fri Mar 22 2013 21: 28: 34 GMT + 0100(CET),
//         updatedAt: Fri Mar 22 2013 21: 28: 34 GMT + 0100(CET)
//       }
//       created: true
//     */
//       });
//   },
//
//
//   signin: function(req, res, next) {
//
//     //code goes here
//
//   },
//
//
//   checkAuth: function(req, res, next) {
//
//     //code goes here
//
//   }
//
//
// };
