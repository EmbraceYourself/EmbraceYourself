// Sets up main angular module and dependency injections
angular.module('ridehook', [
  'ridehook.trips',
  'ridehook.messages',
  'ridehook.home',
  'ridehook.reviews',
  'ridehook.tripview',
  //'ridehook.auth',
  'ridehook.search',
  'ngRoute',
  'ngMaterial'
 ])
// Angular's within-the-page routing system (uses 'angular-route')
.config(function($routeProvider, $httpProvider) {
  $routeProvider
  //Each route binds a view (.html) and a controller to an endpoint (/signin)
    .when('/signin', {
     templateUrl: 'app/auth/signin.html',
     controller: 'AuthController'
    })
    .when('/signup', {
     templateUrl: 'app/auth/signup.html',
     controller: 'AuthController'
    })
    .when('/trips', {
     templateUrl: 'app/trips/trips.html',
     controller: 'TripsController',
     authenticate: true
    })
    .when('/viewtrip', {
     templateUrl: 'app/trips/viewtrip.html',
     controller: 'ViewTripController',
     authenticate: true
    })
    .when('/addreview', {
      templateUrl: 'app/reviews/addreview.html',
      controller: 'ReviewController',
      authenticate: true
    })
    .when('/userreviews', {
      templateUrl: 'app/reviews/userreviews.html',
      controller: 'ReviewController',
      authenticate: true
    })
    .when('/messages', {
     templateUrl: 'app/messages/messages.html',
     controller: 'MessagesController',
     authenticate: true
    })
    .when('/home', {
      templateUrl: 'app/home/home.html',
      controller: 'HomeController',
      authenticate: false
    })
    .when('/search', {
      templateUrl: 'app/search/search.html',
      controller: 'SearchController',
      authenticate: false
    })
    .otherwise({
     redirectTo: '/'
    });

 })
// .run(function ($rootScope, $location) {

// })

.factory('searchResults', function(){
 
//factory for search data to be saved from home and then accessed for search page
 var obj = {
  results: []
 }
 return obj;
})

//create factory that stores if user is logged in

.factory('loggedIn', function(){


   return loggedInBoolean = false;

 

})

.controller('AppCtrl', function ($scope, $mdDialog, loggedIn) {


  $scope.showSignUp = function(ev) {
    $mdDialog.show({
      controller: DialogController,
      templateUrl: 'tabDialog.tmpl.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose:true
    })
  };

  $scope.showSignIn = function(ev) {
    $mdDialog.show({
      controller: DialogController,
      templateUrl: 'tabDialog1.tmpl.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose:true
    })
  };

  function DialogController($scope, $mdDialog, $http) {

    $scope.hide = function() {
      $mdDialog.hide();
    };

    $scope.cancel = function() {
      $mdDialog.cancel();
    };


    $scope.newUser = function(information) {

      information = {
        username: information.username,
        password: information.password,
        first_name: 'Geralt',
        last_name: 'Of Rivia',
        age: 27,
        profile_pic: null,
        city: 'San Francisco',
        state: 'California',
        zip_code: 94103
      };

      console.log('info obj to POST to server: ', information);
     // $http.post('/data', information, config).then(successCallback, errorCallback);
      return $http({
        method: 'POST',
        url: '/data/users/signup',
        data: information
      }).then(function (response){
        console.log(response.data);
            $mdDialog.hide(information);
      });
    };

    $scope.loginUser = function(information){

      information = {
        username: information.username,
        password: information.password,
        first_name: 'Geralt',
        last_name: 'Of Rivia',
        age: 27,
        profile_pic: null,
        city: 'San Francisco',
        state: 'California',
        zip_code: 94103
      };

      return $http({
        method: 'POST',
        url: '/data/users/login',
        data: information
      }).then(function (response){
        if (response.status ===202){
          console.log("Username not valid.")
        } else{
          loggedIn.results = response;
          console.log(loggedIn.results);
          $scope.loggedInBoolean = true;
          console.log($scope.loggedInBoolean);
          $mdDialog.hide(information);
          // console.log(response)
         }
        // }
      }, function(err){
        console.log("error");
      });
    };
  }

});
