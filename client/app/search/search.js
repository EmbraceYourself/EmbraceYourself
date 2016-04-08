// need to add to app.js -- routing and module

angular.module('ridehook.search', [])

.controller('SearchController', function ($scope, $location, searchResults, tripIDFactory){

  $scope.results = searchResults.results;
  $scope.tripID = tripIDFactory.tripID;

  if ($scope.results.length > 0) {
    $scope.from = $scope.results[0].pickup_point;
    $scope.to = $scope.results[0].dropoff_point;
    initMap($scope.from, $scope.to)
  }

  $scope.sendTrip = function(id) {
    tripIDFactory.tripID = id;
    // console.log("id: ", tripIDFactory.tripID);
    $location.url('/viewtrip');
  }
});
