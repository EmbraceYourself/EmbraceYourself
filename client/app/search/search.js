// need to add to app.js -- routing and module

angular.module('ridehook.search', [])

.controller('SearchController', function ($scope, $http, searchResults){

  $scope.results = searchResults.results;

	$scope.filterTrips = function(information){
	};

});
