angular.module('ridehook.tripview', [])

.controller('ViewTripController', function($scope, $tripID, $userID, ViewTrip) {

  var tripID = $tripID;
  var userID = $userID;

  $scope.getTrip = function(tripID) {
    ViewTrip.getTrip(tripID)
     .then(function() {
       $scope.trip = data;
       userID = $scope.trip.userID
     })
     .catch(function(error) {
      console.log(error + tripID + ' this trip did not load.');
     })
     .then(function(userID) {
       ViewTrip.getUser(userID)
        .then(function() {
          $scope.user = data;
        })
        .catch(function(error) {
         console.log(error);
        })
         .then(function() {
          ViewTrip.getReviews(userID)
           .then(function(data) {
            $scope.reviews = data;
           })
           .catch(function(error) {
            console.log(error);
           })
           .then(function() {
            ViewTrip.getMessages(tripID)
             .then(function(data) {
              $scope.messages = data;
             })
             .catch(function(error) {
               console.log(error);
             })
           })
         })
     })
  };


  $scope.makeProposal = function() {
   //add stuf in here about proposal when clicking 'buy button'
  }


   




})
.factory('ViewTrip', function($http) { 



  var getTrip = function(tripID) {
    return $http({
      method: 'GET',
      url: '/api/trips/view_trip',
      data: tripID
    })
    .then(function(resp) {
      return resp;
    });
  };


  var getUser = function(userID) {
    return $http({
      method: 'GET',
      url: '/api/user/view_trip',
      data: userID
    })
    .then(function(resp) {
      return resp;
    });
  };

  var getReviews = function(userID) {
    return $http({
      method: 'GET',
      url: '/apil/user/user_reviews',
      data: userID
    })
    .then(function(resp) {
      return resp;
    })
  }

  var getMessages = function(tripID) {
    return $http({
      method: 'GET',
      url: '/api/trips/trip_messages',
      data: tripID 
    })
  }



  return {
   getTrip: getTrip,
   getUser: getUser,
   getReviews: getReviews,
   getMessages: getMessages
  }
})