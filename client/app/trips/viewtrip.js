angular.module('ridehook.tripview', [])

.controller('ViewTripController', function($scope, $window, $route, ViewTrip, tripIDFactory, Riders, authenticate) {


   $scope.trip = {};
   $scope.user = {};


  //define global variables for trip view controller
  var trip = $window.sessionStorage.currentTrip; //tripIDFactory.tripResult;
 

  var userID = $window.sessionStorage.id;
  var tripID = $window.sessionStorage.tripID; //tripIDFactory.tripID;


  var tripUserID = null;
  var riders = []; //array to hold current trip riders
  var num_seats = 0;
  var alreadyReloaded = false;
  $scope.isRider = false;
  $scope.tripFull = false;
  $scope.button = "Confirm Seat";
  $scope.loggedIn = true;



  console.log('tripID is: ' + tripID);

  console.log('trip info is: ')
  console.log(trip)
  $scope.getTripRiders = function() {

    riders = Riders.getTripRiders(tripID);
    return riders;

  }

  $scope.isUserRider = function(riders) {

    $scope.isRider = false;

    riders.data.forEach(function(rider) {
      if(parseInt(rider.user_id) === parseInt(userID)) {
        $scope.isRider = true;
        $scope.button = "  You're In!  ";
      }
    });

    
  }

  $scope.changeRiderSeatStatus = function() {

    Riders.getTripRiders(tripID)
    .then(function(resp) {
      var num_riders = resp.data.length;
      ViewTrip.calcSeatsLeft(num_riders, num_seats);
      $scope.trip.seats = ViewTrip.getSeatsLeft();
      $scope.isUserRider(resp);

      return true;

    })
  }


  $scope.getThisTrip = function() {
    console.log('Starting....')

    ViewTrip.getTrip(tripID)
     .then(function(resp) {

       console.log('what trip query got')
       console.log(resp.data[0])

       tripUserID = resp.data[0].user_id;

       $scope.trip = resp.data[0];
       $scope.trip.window = "Within 1 hour";
       $scope.trip.cargo = "1 suitcase";
       $scope.trip.seat_price = 35;
       $scope.user.profile_pic = "../../assets/profile_pics/126717412.jpg";

       num_seats = resp.data[0].seats
       console.log('about to get user....')

       $scope.changeRiderSeatStatus();

     }).then(function() {    
       ViewTrip.getUser(tripUserID).then(function(resp) {
         $scope.user = resp.data[0];
       }).then(function() {
        console.log('lets reload now')
        ViewTrip.runReload(console.log('inhere!!!'));
        console.log('did it work?')
       })
     //    .catch(function(error) {
     //     console.log(error);
     //    })
     //     .then(function() {
     //      ViewTrip.getReviews(userID)
     //       .then(function(data) {
     //        $scope.reviews = data;
     //       })
     //       .catch(function(error) {
     //        console.log(error);
     //       })
     //       .then(function() {
     //        ViewTrip.getMessages(tripID)
     //         .then(function(data) {
     //          $scope.messages = data;
     //         })
     //         .catch(function(error) {
     //           console.log(error);
     //         })
     //       })
     //     })
     // })
     });



  };





  $scope.takeSeat = function() {

    if(!authenticate.loginCheck()){
      $scope.loggedIn = authenticate.loginCheck();
      return;
    }




    var data = {
      trip_id: tripID,
      user_id: userID,
      review_id: null,
      trip_end_date: $scope.trip.arrival_date,
      trip_end_time: $scope.trip.arrival_time,
      created_on: Date.now(),
      modified_on: null
    }


    Riders.addRider(data)
    .then(function() {
      $scope.changeRiderSeatStatus();
    })
    .then(function() {
      $route.reload();
    })
  }

  $scope.cancelSeat = function() {

    if(!authenticate.loginCheck()){
      $scope.loggedIn = authenticate.loginCheck();
      return;
    }

    Riders.deleteRider(userID, tripID)
    .then(function(resp) {

      $scope.changeRiderSeatStatus();
    })
    .then(function(resp) {
      console.log('RESPOSE IS: ' + resp)
      $route.reload();
    })
  }







  $scope.getThisTrip();
  $scope.changeRiderSeatStatus();
  //$scope.runReload();
   




})
.factory('ViewTrip', function($http, $route) { 

  var seats_left = 0;
  var alreadyReloaded = false;


  var runReload = function() {
    

    console.log('about to reload in the reload')
    console.log('return me please!!!')

    if(!alreadyReloaded) {
        console.log('before')
        console.log(alreadyReloaded);
        alreadyReloaded = true;
        $route.reload();
    }


  }




  var getTrip = function(tripID) {

    var data = {};
    data.tripID = tripID; 

    return $http({
      method: 'POST',
      url: '/api/trips/view_trip',
      data: data
    })
    .then(function(resp) {
      return resp;
    });
  };


  var getUser = function(userID) {
    var data = {};
    data.userID = userID; 
    return $http({
      method: 'POST',
      url: '/api/user/get_user',
      data: data
    })
    .then(function(resp) {
    //  console.log(resp)
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

  var calcSeatsLeft = function(riders, seats) {

    seats_left = seats + 1 - riders; //adding 1 to account for driver as rider

  }

  var getSeatsLeft = function() {

    return seats_left;

  }



  return {
   getTrip: getTrip,
   getUser: getUser,
   getReviews: getReviews,
   getMessages: getMessages,
   calcSeatsLeft: calcSeatsLeft,
   getSeatsLeft: getSeatsLeft,
   runReload: runReload
  }
})


.factory('Riders', function($http) {

  var addRider = function(data) {
    return $http({
      method: 'POST',
      url: '/api/rider/add_rider',
      data: data
    })
  }

  var getTripRiders = function(tripID) {

    var data = {};
    data.tripID = tripID; 

    return $http({
      method: 'POST',
      url: '/api/rider/get_trip_riders',
      data: data
    }).then(function(resp) {
      return resp;
    })
  }


  var deleteRider = function(userID, tripID) {

    var data = {};
    data.userID = userID;
    data.tripID = tripID;

    return $http({
      method: 'POST',
      url: '/api/rider/delete_rider',
      data: data
    }).then(function() {
      return 'rider deleted';
    })


  }




  return {
    addRider: addRider,
    getTripRiders: getTripRiders,
    deleteRider: deleteRider
  }

});



