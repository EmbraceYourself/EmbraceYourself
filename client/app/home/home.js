angular.module('ridehook.home', [])

.controller('HomeController', function ($scope, $http, $location, searchResults){


	$scope.searchTrip = function(information){

		var date = information.depart_date;
		var day = date.getDate();
		var monthIndex = date.getMonth() + 1;
		var year = date.getFullYear();
		var newDepartDate = "" + monthIndex + "/" + day + "/" + year;
		information.depart_date = newDepartDate;


		return $http({
			method: 'POST',
			url: 'data/trips/findtrip',
			data: information
		})
		.then(function(resp){
			searchResults.results = resp.data;
		 	console.log(resp.data);
			// return resp.data;
			$location.url('/search');
		})
	}

});
