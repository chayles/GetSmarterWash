var app = angular.module("getSmarterWashApp",["ngRoute", "firebase"]);

app.config(function($routeProvider){
	$routeProvider.when("/", {
		controller: "SignInCtrl",
		templateUrl: "templates/signin.html"
	}).when("/Home",{
		controller: "HomeCtrl",
		templateUrl: "templates/home.html",
		resolve: {
			"currentAuth": function($firebaseAuth){
				return $firebaseAuth().$requireSignIn();
			}
		}
	}).when("/MyAccount",{
		controller: "AccountCtrl",
		templateUrl: "templates/myaccount.html",
		resolve: {
			"currentAuth": function($firebaseAuth){
				return $firebaseAuth().$requireSignIn();
			}
		}
	}).when("/MyWashes",{
		controller: "WashesCtrl",
		templateUrl: "templates/mywashes.html",
		resolve: {
			"currentAuth": function($firebaseAuth){
				return $firebaseAuth().$requireSignIn();
			}
		}
	}).when("/SignUp",{
		controller: "SignUpCtrl",
		templateUrl: "templates/signup.html"
	})
});

// app.run(["$rootScope", "$location", function($rootScope, $location) {
//   $rootScope.$on("$routeChangeError", function(event, next, previous, error) {
//     // We can catch the error thrown when the $requireSignIn promise is rejected
//     // and redirect the user back to the home page
//     if (error === "AUTH_REQUIRED") {
//       $location.path("/login");
//     }
//   });
// }]);

app.controller("SignUpCtrl", function($scope, $firebaseAuth, $window, $firebaseObject, $routeParams){
	$scope.signUp = function(){
			$scope.authObj = $firebaseAuth()
				console.log($scope.name, $scope.email, $scope.password);
				$scope.authObj.$createUserWithEmailAndPassword($scope.email, $scope.password)
				.then(function(firebaseUser) {
	    			
	    			console.log("User " + firebaseUser.uid + " created successfully!");
	    			var userRef = firebase.database().ref().child("users").child(firebaseUser.uid);
	    			$scope.users = $firebaseObject(userRef);
	    			$scope.users.name = $scope.name;
	    			$scope.users.email = $scope.email;
	    			$scope.users.$save();
	    			window.location.href="#/";

	  			}).catch(function(error) {
	   				console.error("Error: ", error);
	 			});
		}

		$scope.goLogIn = function(){
			window.location.href="#/";
		}
});

app.controller("SignInCtrl", function($scope, $firebaseAuth, $routeParams, $window){
	$scope.signIn = function(){
		console.log($scope.name, $scope.email, $scope.password);
		$scope.authObj = $firebaseAuth();
		$scope.authObj.$signInWithEmailAndPassword($scope.email, $scope.password)
		.then(function(firebaseUser) {
  			console.log("Signed in as:", firebaseUser.uid);

  			window.location.href = "#/Home";

		}).catch(function(error) {
  			console.error("Authentication failed:", error);
		});
	}

	$scope.goSignUp = function(){
		window.location.href="#/SignUp";
	}
});

app.controller("HomeCtrl", function($scope, $firebaseAuth, $routeParams){

});

app.controller("AccountCtrl", function($scope, $firebaseAuth, $routeParams){

});

app.controller("WashesCtrl", function($scope, $firebaseAuth, $routeParams, $firebaseObject, currentAuth, $firebaseArray){
	
	$scope.curuser_id = currentAuth.uid;
	var user_ref = firebase.database().ref().child("users").child($scope.curuser_id);
	$scope.currentUser = $firebaseObject(user_ref);

	// Picking tabs
	$scope.WashingHistory = true;
	$scope.Booking = false;
	$scope.openHistory = function(){
		$scope.WashingHistory = true;
		$scope.Booking = false;
	};
	$scope.openBookings = function(){
		$scope.WashingHistory = false;
		$scope.Booking = true;
	};

	// Calendar

	var apt_ref=firebase.database().ref().child("users").child($scope.curuser_id).child("userApts");
	$scope.userApts=$firebaseArray(apt_ref);
	console.log($scope.userApts);

	var all_apt_ref=firebase.database().ref().child("appointments");
	$scope.appointments=$firebaseObject(all_apt_ref);
	console.log($scope.appointments);

	$scope.currentDate = new Date();
	$scope.disabled = function(date, mode){
		return (mode === 'day' && (date.getDay() === 0 || date.getDay() === 6));
	}

	$( function() {
    	$( "#datepicker" ).datepicker({
    		minDate: 0,
    		beforeShowDay: nonWorkingDates
    	});
    	function nonWorkingDates(date){
	        var day = date.getDay(), Sunday = 0, Monday = 1, Tuesday = 2, Wednesday = 3, Thursday = 4, Friday = 5, Saturday = 6;
	        var closedDays = [[Sunday], [Saturday]];
	        for (var i = 0; i < closedDays.length; i++) {
	            if (day == closedDays[i][0]) {
	                return [false];
	            }

        	}
        	return [true];
    	}

  	} );

	$scope.requestApt = function(){
		// console.log($scope.currentUser);
		// console.log($scope.aptType.value);
		console.log($scope.date.value);

		// deciding cost of wash
		if ($scope.aptType.value === "externalWash"){
			$scope.washBalance = 60;
		} else {
			$scope.washBalance = 140;
		};

		// adding appointment to user
		$scope.userApts.$add({
			washType: $scope.aptType.value,
			washBalance: $scope.washBalance,
			washDate: $scope.date.value
		});

		// adding appointment info to Firebase
		$scope.appointments.type = $scope.aptType.value;

		$scope.appointments.$save();

		console.log($scope.appointments);
	
	};

});















