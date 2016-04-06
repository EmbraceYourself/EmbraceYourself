// title
// blurb
// pickup point - city (contact driver for details)
// date, time (calendar input widget?)
// car seats available
angular.module('ridehook.trips', [])

.controller('TripsController', function ($scope) {
	$scope.trip = {};

	$scope.createTrip = function () {
		console.log('pickup location is: ', $scope.trip.pickup)
	};
});