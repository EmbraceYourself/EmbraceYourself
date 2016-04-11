
angular.module('ridehook.profile', [])




.controller('ProfileController', function ($scope, $window, $location, $http, tripIDFactory) {

	$scope.loggedIn = $window.sessionStorage.id;
	$scope.profile_pic = $window.sessionStorage.pp;

	if ($window.sessionStorage.id){
	$scope.firstname = $window.sessionStorage.fn;
	//is there a biography?
	//if yes. populate
	//if no, empty string


	}

	$scope.pullProfileData = function(){

		return $http({
			method: 'POST',
			url: '/data/users/getProfileInfo',
			data: {userID: $window.sessionStorage.id}
		})
		.then(function(resp){
			console.log(tripIDFactory);
			$scope.city = resp.data[0].city;
			$scope.state = resp.data[0].state;
			$scope.biography = resp.data[0].biography;
		});
	};

	$scope.postBio = function(biography){
		if ($window.sessionStorage.id) {
			var information = {biography: biography, id: $window.sessionStorage.id};

			return $http({
				method: 'POST',
				url: 'data/users/profile',
				data: information
			})
			.then(function(resp){
			 	console.log(resp.data);
				// return resp.data;
			});
		}
	}

	$scope.pullProfileData();

//need function to get bio, send post with windows session id to get city and state
//need function to post bio


	// $scope.showEditableProfile = function(){
	// 	if ($window.sessionStorage.id){
	// $scope.firstname = $window.sessionStorage.fn;
	// $scope.biography = null;
	// 	} else{

	// 	}
	// };

	//if biography is null, then hide display form
	//if b




	$scope.getUserDisplay = function(data, req, res, client){

		var information = {
			biography: $scope.biography,
			id : $window.sessionStorage.id
		}
		return $http({
			method: 'POST',
			url: '/data/users/profile',
			data: information
		})
		.then(function(res){
			console.log("cat")
			console.log(res.data)
		});
	};


});
