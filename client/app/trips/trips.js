angular.module('ridehook.trips', [])

.controller('TripsController', function ($scope, $http, $window) {
	$scope.trip = {};

	console.log($window.sessionStorage);

	$scope.createTrip = function () {

		//$cookies.put('user_id', '1337');

		var date = new Date($scope.trip.startDate);
        var day = date.getDate();
        var monthIndex = date.getMonth() + 1;
        var year = date.getFullYear();
        var newDepartDate = "" + monthIndex + "/" + day + "/" + year;
        $scope.trip.startDate = newDepartDate;
        console.log($scope.trip.startDate);

        date = new Date($scope.trip.endDate);
        day = date.getDate();
        monthIndex = date.getMonth() + 1;
        year = date.getFullYear();
        var newArriveDate = "" + monthIndex + "/" + day + "/" + year;
        $scope.trip.endDate = newArriveDate;
        console.log($scope.trip.endDate);

		var tripObj = {
			description: $scope.trip.description,
			pickup_point: $scope.trip.pickup,
			dropoff_point: $scope.trip.dropoff,
			depart_date: $scope.trip.startDate,//Date.parse($scope.trip.startDate),
			depart_time: $scope.trip.departHour + ':' + $scope.trip.departMinute + $scope.trip.departTimeperiod,
			arrival_date: $scope.trip.endDate,//Date.parse($scope.trip.endDate),
			arrival_time: $scope.trip.arriveHour + ':' + $scope.trip.arriveMinute + $scope.trip.arriveTimeperiod,
			seats: Number($scope.trip.seats),
			user_id: 1 // will reconfig this when we can get current user id from session
		};

		// new trip dummy data

		// var tripObj = {
		// 	description: 'Yosemite camping trip!',
		// 	pickup_point: 'San Francisco',
		// 	dropoff_point: 'Yosemite Valley',
		// 	depart_date: '1460098800000',
		// 	depart_time: '4:30PM',
		// 	arrive_date: '1460098800000',
		// 	arrive_time: '9:30PM',
		// 	seats: 4,
		// 	user_id: 1
		// };

		// console.log('seats', Number($scope.trip.seats), 'type: ', typeof Number($scope.trip.seats));
		// console.log('tripObj to send to server: ', tripObj);

		return $http({
			method: 'POST',
			url: '/data/trips/newtrip',
			data: tripObj

		})
		.then(function (resp) {
			console.log('Successful POST request: ', resp);
			return resp;
		});

	};
});
