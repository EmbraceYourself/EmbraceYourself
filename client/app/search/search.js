// need to add to app.js -- routing and module

angular.module('ridehook.search', [])

.controller('SearchController', function ($scope, $location, $window, searchResults, tripIDFactory){

  $scope.results = searchResults.results;
  console.log("search results: ", $scope.results);

  if ($scope.results.length > 0) {
    $scope.from = $scope.results[0].pickup_point;
    $scope.to = $scope.results[0].dropoff_point;
    initMap($scope.from, $scope.to);
  }

  $scope.sendTrip = function(id, result) {
    // stores the id in the tripID factory for ben's /viewtrip
    tripIDFactory.tripID = id;
    tripIDFactory.tripResult = result;
    $window.sessionStorage.tripID = id;
    $window.sessionStorage.currentTrip = result;

    // console.log("tripID: ", tripIDFactory.tripID);
    // console.log("tripResult: ", tripIDFactory.tripResult);
    $location.url('/viewtrip');
  }
  // console.log("$scope.results: ", $scope.results);
});
