// Sets up main angular module and dependency injections
angular.module('ridehook', [
  //'ridehook.trips',
  'ridehook.messages',
  //'ridehook.auth',
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
    .when('/messages', {
     templateUrl: 'app/messages/messages.html',
     controller: 'MessagesController',
     authenticate: true
    })
    // .otherwise({
    //  redirectTo: '/'
    // });

 })
// .run(function ($rootScope, $location) {

// })
.controller('AppCtrl', function($scope, $mdDialog ) {

  $scope.showTabDialog = function(ev) {
    $mdDialog.show({
      controller: DialogController,
      templateUrl: 'tabDialog.tmpl.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose:true
    })
  };
});

function DialogController($scope, $mdDialog, $http) {
  $scope.hide = function() {
    $mdDialog.hide();
  };

  $scope.cancel = function() {
    $mdDialog.cancel();
  };

  $scope.postUser = function(information) {
    console.log(information);
   // $http.post('/data', information, config).then(successCallback, errorCallback);
    return $http({
      method: 'POST',
      url: '/data',
      data: information
    }).then(function (response){
      console.log('success', response.data)
          $mdDialog.hide(information);
    })

  };

   // $scope.getUser = function(information){
   //  console.log(information);
   //  return 

   };

}


