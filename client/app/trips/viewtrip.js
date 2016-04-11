angular.module('ridehook.tripview', [])

.controller('ViewTripController', function($scope, $window, $route, ViewTrip, 
  tripIDFactory, Riders, authenticate, Messages) {


   $scope.trip = {};
   $scope.user = {};
   $scope.reviews = {};


  //define global variables for trip view controller
  var trip = $window.sessionStorage.currentTrip; //tripIDFactory.tripResult;


  var userID = $window.sessionStorage.id;
  var tripID = $window.sessionStorage.tripID; //tripIDFactory.tripID;


  var driver_user_id = null;
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

       driver_user_id = resp.data[0].user_id;

       $scope.trip = resp.data[0];
       $scope.trip.window = "Within 1 hour";
       $scope.trip.cargo = "1 suitcase";
       $scope.trip.seat_price = 35;
       $scope.user.profile_pic = "../../assets/profile_pics/126717412.jpg";

       num_seats = resp.data[0].seats
       console.log('about to get user....')

       $scope.changeRiderSeatStatus();

     }).then(function() {
       ViewTrip.getUser(driver_user_id).then(function(resp) {
         $scope.user = resp.data[0];
       }).then(function() {
        console.log('lets reload now')
        ViewTrip.runReload(console.log('inhere!!!'));
        console.log('did it work?')
       }).then(function() {
         ViewTrip.getReviews(driver_user_id)
         .then(function(data) {
            $scope.reviews = data.data;
            $scope.reviews.review_count = data.data.length;
            $scope.reviews.review_avg = $scope.calcAvgReviewStars(data.data);

            console.log(driver_user_id + ' reviews are: '+ $scope.reviews)
            console.log($scope.reviews)
         })

       });
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


  $scope.calcAvgReviewStars = function(reviews) {
    var starSum = reviews.reduce(function(accum, review) {
      return accum + review.review_stars;
    }, 0);
    console.log('starSum: ' + starSum);
    return starSum / reviews.length;
  }


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


  $scope.addMessage = function() {


    var message = {
      message_text: $scope.new_message.message_text,
      creator_id: userID,
      creator_display_name: $window.sessionStorage.function,
      responds_to: null,
      message_trip_id: tripID,
      responses: [],
      created_on: Date.now()
    }


    Messages.addMessage(message).then(function() {
      Messages.getMessages(tripID).then(function(resp) {

        console.log('resp.data is : ')

        console.log(resp.data)

        $scope.messages = resp.data;

      })
    })
  }

  $scope.addResponse = function(message_id, message_resp) {

    var newResponse;

    Messages.getMessage(message_id).then(function(resp) {
      if(resp.data[0].responses === "{}") {

        console.log('HELLS ZYES')

        newResponse = JSON.stringify([message_resp]);
        console.log(newResponse)


      } else {

        console.log('HELLS NO')


        //console.log(typeof JSON.parse(resp.data[0].responses))

        newResponse = resp.data[0].responses.push(message_resp)

        //newResponse = resp.data[0].responses.push(message_resp)

        console.log("The PUSHED RESULTS ARE....")
        console.log(newResponse)
      }

    }).then(function() {

      Messages.insertResponse(newResponse, message_id);
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

    var data = {};
    data.reviewed_userid = userID;

    return $http({
      method: 'POST',
      url: '/api/reviews/get_user_reviews',
      data: data
    })
    .then(function(resp) {
      return resp;
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

})



.factory('Messages', function($http) {


      // message_text VARCHAR(500), \
      // creator_id INT, \
      // creator_display_name VARCHAR(255), \
      // responds_to INT, \
      // message_trip_id INT, \
      // responses VARCHAR, \
      // modified_on VARCHAR(255)


  var addMessage = function(message) {

        console.log('message: ')
    console.log(message)

    return $http({
      method: 'POST',
      url: '/api/messages/add_message',
      data: message
    })
  }

  var getMessages = function(tripID) {

    var data = {};
    data.message_trip_id = tripID;

    console.log(data.message_trip_id)


    return $http({
      method: 'POST',
      url: '/api/messages/get_trip_messages',
      data: data
    })
  }

  var getMessage = function(message_id) {

    var data = {};
    data.message_id = message_id;

    return $http({
      method: 'POST',
      url: 'api/messages/get_message',
      data: data
    })
  }

  var insertResponse = function(responses, message_id) {
    var data = {};
    data.responses = responses;
    data.message_id = message_id;

    console.log('datat response')
    console.log(data)

    return $http({
      method: 'POST',
      url: 'api/messages/insert_response',
      data: data
    })


  }


  return {
    addMessage: addMessage,
    getMessages: getMessages,
    getMessage: getMessage,
    insertResponse: insertResponse
  }

});





