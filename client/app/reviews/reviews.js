angular.module('ridehook.reviews', [])

.controller('ReviewController', function($scope, Reviews) {

  $scope.review = {};

  $scope.message = 'Leave a Review!'

  $scope.addReview = function() {

    console.log('here!!!!')

    var review = {
     reviewed_userID: $scope.review.reviewed_userID,
     reviewing_userID: $scope.review.reviewing_userID,
     review: $scope.review.review,
     review_stars: $scope.review.stars,
     created_on: Date.now()
    }

    $scope.loading = true;
    Reviews.addReview(review)
      .then(function() {
        $scope.loading = false;
      })
      .catch(function(error) {
        console.log(error);
      });


  }; 




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