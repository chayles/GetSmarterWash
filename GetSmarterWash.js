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
	}).when("/Management",{
		controller: "ManagementCtrl",
		templateUrl: "templates/management.html",
		resolve: {
			"currentAuth": function($firebaseAuth){
				return $firebaseAuth().$requireSignIn();
			}
		}
	}).when("/ManagementSignUp",{
		controller: "MSignUpCtrl",
		templateUrl: "templates/m_signup.html"
	}).when("/ManagementSignIn",{
		controller: "MSignInCtrl",
		templateUrl: "templates/m_signin.html"
	})
});

app.run(["$rootScope", "$location", function($rootScope, $location) {
  $rootScope.$on("$routeChangeError", function(event, next, previous, error) {
    // We can catch the error thrown when the $requireSignIn promise is rejected
    // and redirect the user back to the home page
    if (error === "AUTH_REQUIRED") {
      $location.path("/login");
    }
  });
}]);

// Customer Sign Up/In

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
	    			$scope.users.role = "customer";
	    			$scope.users.balance = 0;
	    			$scope.users.$save();
	    			console.log($scope.users);
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
  			console.log("Signed in as:", firebaseUser);

   			window.location.href = "#/Home";

		}).catch(function(error) {
  			console.error("Authentication failed:", error);
		});
	}

	$scope.goSignUp = function(){
		window.location.href="#/SignUp";
	}
	$scope.goMSignUp = function(){
		window.location.href="#/ManagementSignUp";
	}

});

// Management Sign Up/In

app.controller("MSignUpCtrl", function($scope, $firebaseAuth, $window, $firebaseObject, $routeParams){
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
	    			$scope.users.role = "management";
	    			$scope.users.$save();
	    			window.location.href="#/ManagementSignIn";

	  			}).catch(function(error) {
	   				console.error("Error: ", error);
	 			});
		}

		$scope.goLogIn = function(){
			window.location.href="#/ManagementSignIn";
		}
});

app.controller("MSignInCtrl", function($scope, $firebaseAuth, $routeParams, $window){
	$scope.signIn = function(){
		console.log($scope.name, $scope.email, $scope.password);
		$scope.authObj = $firebaseAuth();
		$scope.authObj.$signInWithEmailAndPassword($scope.email, $scope.password)
		.then(function(firebaseUser) {
  			console.log("Signed in as:", firebaseUser);

   			window.location.href = "#/Management";

		}).catch(function(error) {
  			console.error("Authentication failed:", error);
		});
	}

	$scope.goMSignUp = function(){
		window.location.href="#/ManagementSignUp";
	}

});


// User interface
app.controller("HomeCtrl", function($scope, $firebaseAuth, $routeParams, currentAuth, $firebaseObject){
	$scope.curuser_id = currentAuth.uid;
	var user_ref = firebase.database().ref().child("users").child($scope.curuser_id);
	$scope.currentUser = $firebaseObject(user_ref);


});

app.controller("AccountCtrl", function($scope, $firebaseAuth, $routeParams, currentAuth, $firebaseObject, $firebaseArray){

	$scope.curuser_id = currentAuth.uid;
	var user_ref = firebase.database().ref().child("users").child($scope.curuser_id);
	$scope.users = $firebaseObject(user_ref);

	var apts_ref=firebase.database().ref().child("users").child($scope.curuser_id).child("userApts");
	$scope.userApts=$firebaseArray(apts_ref);


// Get account balance


	// $scope.getBalance = function(){
	// 	for (i=0; i<$scope.userApts.length; i++){
	// 		$scope.balance += $scope.userApts[i].washBalance;
	// 	}
	// 	console.log($scope.balance);
	// }

// Pay account balance
	$scope.payBalance = function(){
		
		console.log($scope.userApts);
		$scope.users.balance = 0;
		$scope.users.userApts=[];
		$scope.users.$save();


	}

});

app.controller("WashesCtrl", function($scope, $firebaseAuth, $routeParams, $firebaseObject, currentAuth, $firebaseArray){
	
	$scope.curuser_id = currentAuth.uid;
	var user_ref = firebase.database().ref().child("users").child($scope.curuser_id);
	$scope.users = $firebaseObject(user_ref);

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


	var all_apt_ref=firebase.database().ref().child("appointments");
	$scope.appointments=$firebaseArray(all_apt_ref);


	var wash_ref=firebase.database().ref().child("washTypes");
	$scope.washTypes=$firebaseArray(wash_ref);

	var wait_list_ref=firebase.database().ref().child("waitList");
	$scope.waitList=$firebaseArray(wait_list_ref);

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

		console.log($scope.date.value);
		var bookedApts = 0;
		$scope.tryAgain = false;
		$scope.appointmentConfirmed = false;
		$scope.alreadyBooked = false;

		var rightNow = Date.now();

		for (var i=0; i<$scope.appointments.length; i++){
			if ($scope.date.value === $scope.appointments[i].date){
				bookedApts += 1;
			}
		}

		if ($scope.userApts.length === 1){

			$scope.alreadyBooked = true;

		} else if (bookedApts < 5 && $scope.userApts.length === 0){
			// console.log(bookedApts);
			// console.log($scope.currentUser);
			// console.log($scope.aptType.value);
			// console.log($scope.date.value);
			for (var i=0; i<$scope.washTypes.length; i++){
				if ($scope.washTypes[i].name === $scope.aptType.value){
					$scope.aptCost = $scope.washTypes[i].cost;
				}
				console.log($scope.aptCost);
			}

			$scope.users.balance += $scope.aptCost;
			$scope.users.$save();
			// adding appointment to user
			$scope.userApts.$add({
				washType: $scope.aptType.value,
				washBalance: $scope.aptCost,
				washDate: $scope.date.value,
				washPaid: false
			});

			// adding appointment info to Firebase
			$scope.appointments.$add({
				type: $scope.aptType.value,
				cost: $scope.aptCost,
				id: currentAuth.uid,
				status: "pre-wash",
				date: $scope.date.value
			});

			$scope.appointments.$save();

			// Appointment Confirmation
			$scope.appointmentConfirmed = true;

		} else {
			$scope.tryAgain = true;

			for (var i=0; i<$scope.washTypes.length; i++){
				if ($scope.washTypes[i].name === $scope.aptType.value){
					$scope.aptCost = $scope.washTypes[i].cost;
				}
				console.log($scope.aptCost);
			}

			$scope.waitList.$add({
				type: $scope.aptType.value,
				cost: $scope.aptCost,
				id: currentAuth.uid,
				status: "wait-listed",
				date: $scope.date.value,
				createdAt: Date.now()
			});

			$scope.waitList.$save();
		}

	};

// Deleting an appointment

	$scope.deleteApt = function(type, date){
		console.log($scope.appointments);
		for (var i=0; i<$scope.appointments.length; i++){
			if ($scope.appointments[i].id === $scope.curuser_id){
				$scope.appointments.$remove($scope.appointments[i]);
			}
		}

		$scope.users.userApts = [];
		$scope.users.$save();
	}

});

// Management interface
app.controller("ManagementCtrl", function($scope, $firebaseAuth, $routeParams, $firebaseArray, $firebaseObject){
	
// Picking tabs
	$scope.WashesControl = true;
	$scope.WashesLog = false;

	$scope.openControl = function(){
		$scope.WashesControl = true;
		$scope.WashesLog = false;
	};
	$scope.openLog = function(){
		$scope.WashesControl = false;
		$scope.WashesLog = true;
	};

// Washes Control
	$scope.WashCreate = false;

	var wash_ref=firebase.database().ref().child("washTypes");
	$scope.washTypes=$firebaseArray(wash_ref);
	console.log($scope.washTypes);

	// Make new wash form appear and disappear
	$scope.newWash = function(){
		$scope.CreateWash = true;
	}

	$scope.doneCreating = function(){
		$scope.CreateWash = false;
	}

	// function for adding wash type to firebase
	$scope.createWash = function(){
		$scope.washTypes.$add({
			name: $scope.washName,
			cost: $scope.washCost,
			description: $scope.washDesc
		});

		$scope.washTypes.$save();

	}

// Washes Log

	var all_apt_ref=firebase.database().ref().child("appointments");
	$scope.appointments=$firebaseArray(all_apt_ref);

	var wait_list_ref=firebase.database().ref().child("waitList");
	$scope.waitList=$firebaseArray(wait_list_ref);

});













