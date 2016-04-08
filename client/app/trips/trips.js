angular.module('ridehook.trips', [])

.controller('TripsController', function ($scope, $http, $window, $location) {
	$scope.trip = {};

  // console.log($window.sessionStorage);

  $scope.createTrip = function () {

    console.log('Start date format: ', $scope.trip.startDate.toLocaleDateString());
    console.log('End date format: ', $scope.trip.endDate.toLocaleDateString());

	var tripObj = {
		description: $scope.trip.description,
		pickup_point: $scope.trip.pickup,
		dropoff_point: $scope.trip.dropoff,
		depart_date: $scope.trip.startDate.toLocaleDateString(),
		depart_time: $scope.trip.departHour + ':' + $scope.trip.departMinute + $scope.trip.departTimeperiod,
		arrival_date: $scope.trip.endDate.toLocaleDateString(),
		arrival_time: $scope.trip.arriveHour + ':' + $scope.trip.arriveMinute + $scope.trip.arriveTimeperiod,
		seats: Number($scope.trip.seats),
		user_id: $window.sessionStorage.id
	};

    return $http({
      method: 'POST',
      url: '/data/trips/newtrip',
      data: tripObj
	})
	.then(function (resp) {
		console.log('Successful POST request: ', resp);
		// return resp;
		$location.url('/home');
	});

  };
});