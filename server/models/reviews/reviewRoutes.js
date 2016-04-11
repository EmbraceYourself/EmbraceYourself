var reviewController = require('./reviewController.js');

module.exports = function (app) {

 console.log('IN REVIEW CONTROLLER');
 app.post('/addReview', reviewController.addReview);
 app.post('/get_user_reviews', reviewController.getReviews);


}