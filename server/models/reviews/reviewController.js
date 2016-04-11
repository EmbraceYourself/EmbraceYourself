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

  },

  checkReviewStatusOnLogin: function(data, req, res, next) {
    // console.log("data:", data)
    var client = helper.createClient();

    client.connect(function(err){
      if (err){
        console.error('Did not query');
        return res.status(500).json({success: false, data: err});
      }

      var query = client.query("SELECT users.id AS user_id, users.username, riders.trip_id AS trip_id, trips.user_id AS driver_id FROM users LEFT JOIN riders on users.id = riders.user_id LEFT JOIN reviews on users.id = reviews.reviewing_userid LEFT JOIN trips ON riders.trip_id = trips.id WHERE CAST(riders.trip_end_date AS date) < current_date AND riders.trip_end_date is not null AND reviews.review is null AND users.username =$1 AND users.password = $2;", [data.username, data.password], function(err, result){
        //  console.log("many LEFT JOINs: ", result);
          if(err) {
            throw err;
            console.log("query error");
           } if (result.rows.length < 1){
            client.end();

            return res.status(202).send('User reviews are up-to-date.');
          } else {


            reviewStatus = {
              needs_review_user_id: result.rows[0].user_id,
              needs_review_username: "placeholder username",
              needs_user_review_trip_id: result.rows[0].trip_id,
              needs_user_review_driver_id: result.rows[0].driver_id
            };
            console.log("Review status result:", result);


            res.status(200).send(reviewStatus);

            client.end();
          }
      })
    })
  }


}
