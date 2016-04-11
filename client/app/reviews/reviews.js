angular.module('ridehook.reviews', [])

.controller('ReviewController', function($scope, $window, Reviews) {

  $scope.review = {};

  //var trip = $window.sessionStorage.currentTrip; //tripIDFactory.tripResult;

  //Make some dummy content for test / dev purposes.
  //this should actually get assigned @ user sign-in/prompt
  $window.sessionStorage.needs_review_username = 'hey';
  $window.sessionStorage.needs_user_review_trip_id = 3;
  $window.sessionStorage.needs_review_user_id = 1;

  var reviewing_user_id = $window.sessionStorage.id;
  var needs_reviewed_username = $window.sessionStorage.needs_review_username;
  var tripID = $window.sessionStorage.needs_user_review_trip_id; //tripIDFactory.tripID;
  var reviewed_user_id = $window.sessionStorage.needs_review_user_id;

  $scope.message = 'Leave a Review for ' + needs_reviewed_username + '!';

  $scope.addReview = function() {


    console.log('here!!!!')

    var review = {
     reviewed_user_id: reviewed_user_id, //$scope.review.reviewed_userID,
     reviewing_user_id: reviewing_user_id, //$scope.review.reviewing_userID,
     review: $scope.review.review,
     review_stars: $scope.review.stars,
     review_trip_id: tripID,
     created_on: Date.now()
    }

    console.log('review: ')
    console.log(review)




    $scope.loading = true;
    Reviews.addReview(review)
      .then(function() {
        $scope.loading = false;
      })
      .catch(function(error) {
        console.log(error);
      });


  }; 

//function to check to see if needs_review_user_id exists.
//if it exists, redirect to addreview.html


})

.factory('Reviews', function($http) {
  var counter = 0;

  var getCount = function() {
   counter++;
   return counter;
  }

  var getUserReviews = function(userID) {
   return $http({
     method: 'GET',
     url: 'api/reviews/getUserReviews',
     data: userID
   })
  }

  var addReview = function(review) {
    console.log('add review: ' + review);
    return $http({
      method: 'POST',
      url: 'api/reviews/addReview',
      data: review
    })
  }


  return {
    getCount: getCount,
    getUserReviews: getUserReviews,
    addReview: addReview
  }


 
})