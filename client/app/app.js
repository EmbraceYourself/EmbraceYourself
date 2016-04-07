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
.factory('authInterceptor', function ($rootScope, $q, $window) {
  return {
    request: function (config) {
      config.headers = config.headers || {};
      if ($window.sessionStorage.token) {
        config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
      }
      return config;
    },
    response: function (response) {
      if (response.status === 401) {
        // handle the case where the user is not authenticated
      }
      return response || $q.when(response);
    }
  };
})
.config(function($routeProvider, $httpProvider) {
  $routeProvider
  //Each route binds a view (.html) and a controller to an endpoint (/signin)
    .when('/signin', {
     templateUrl: 'app/auth/signin.html',
     controller: 'AuthController',
     authenticate: true
    })
    .when('/signup', {
     templateUrl: 'app/auth/signup.html',
     controller: 'AuthController',
     authenticate: true
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
    .when('/search', {
     templateUrl: 'app/search/search.html',
     controller: 'TripsController',
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
      authenticate: true
    })
    .when('/search', {
      templateUrl: 'app/search/search.html',
      controller: 'SearchController',
      authenticate: false
    })
    .otherwise({
     redirectTo: '/'
    });

  $httpProvider.interceptors.push('authInterceptor');

 })
// .run(function ($rootScope, $location) {

// })

.factory('searchResults', function(){
 var sObj = {
  results: []
 }
 return sObj;
})

.factory('tripIDFactory', function(){
 var tObj = {
  tripID: null
 }
 return tObj;
})

.controller('AppCtrl', function ($scope, $mdDialog ) {

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

  function DialogController($scope, $mdDialog, $http, $window) {

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
        url: '/authenticate',
        data: information
      }).then(function (response){

      //   if (response.status ===202){
      //     console.log("Username not valid.")
      //   } else{
      //     console.log(response.data);
      //     $mdDialog.hide(information);
      //     // console.log(response)
      //    }
      //   // }
      // }, function(err){
      //   console.log("error");

        $window.sessionStorage.token = response.data.token;
        $window.sessionStorage.user_id = response.data.user_id;
        console.log('Success: ', response);

        return $http({
          method: 'POST',
          url: '/data/users/login/restricted',
          data: information
        }).then(function (response){
          console.log('Success: ', response);
          $mdDialog.hide(information);
        }, function (error) {
          console.log('Error: ', error);
        });

        //$mdDialog.hide(information);
      }, function (error) {
        delete $window.sessionStorage.token;
        delete $window.sessionStorage.user_id;
        console.log('Error: ', error);
      });

    };
  }

});
