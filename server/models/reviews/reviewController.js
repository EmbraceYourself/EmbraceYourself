var Review = require('./reviewModel.js');

var helper = require('../../config/helpers.js');

console.log('about to start')

Review.reviewTable();


module.exports = {

  addReview: function(req, res, next) {

    var client = helper.createClient();

    var review = [
      req.body.reviewing_user_id,  //reviewing user id
      req.body.reviewed_user_id,   //user id being reviewed
      req.body.review_stars,
      req.body.review,
      req.body.review_trip_id,
      req.body.created_on,
      null
    ];



    console.log(review);

    client.connect(function(err) {
      if(err) {
        console.error('Post failed!');
        return res.status(500).json({ success: false, data: err});
      }

      var query = client.query("INSERT INTO reviews(\
       reviewing_userid, \
       reviewed_userid, \
       review_stars, \
       review, \
       review_trip_id, \
       created_on, \
       modified_on) \
       values ($1, $2, $3, $4, $5, $6, $7)", review);

      query.on('end', function() {
        client.end();
        return res.status(201).send("Created new review!");
      });

    });
  },

  getReviews: function(req, res, next) {

    var criteria = [
      req.body.reviewed_userid,
    ];

    var client = helper.createClient();

    console.log('criteria: ')
    console.log(criteria)

    client.connect(function(err) {
     if(err) {
       console.error('Did not query');
       return res.status(500).json({success: false, data: err});
     }

     var query = client.query("SELECT * FROM reviews WHERE reviewed_userid = $1", 
       criteria);



      var foundReviews = [];

      query.on('row', function(row) {
        console.log(row)
        foundReviews.push(row);
      });

      query.on('end', function() {
        client.end();
        return res.send(foundReviews);
      });

    });

  }
}