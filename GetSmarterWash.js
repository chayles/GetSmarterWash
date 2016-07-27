var app = angular.module("getSmarterWashApp",["ngRoute", "firebase"]);

app.config(function($routeProvider){
	$routeProvider.when("/", {
		controller: "SignInCtrl",
		templateUrl: "templates/signin.html"
	}).when("/Home",{
		controller: "HomeCtrl",
		templateUrl: "templates/home.html",
		// resolve: {
		// 	"currentAuth": function($firebaseAuth){
		// 		return $firebaseAuth().$requireSignIn();
		// 	}
		// }
	}).when("/MyAccount",{
		controller: "AccountCtrl",
		templateUrl: "templates/myaccount.html",
		// resolve: {
		// 	"currentAuth": function($firebaseAuth){
		// 		return $firebaseAuth().$requireSignIn();
		// 	}
		// }
	}).when("/MyWashes",{
		controller: "WashesCtrl",
		templateUrl: "templates/mywashes.html",
		// resolve: {
		// 	"currentAuth": function($firebaseAuth){
		// 		return $firebaseAuth().$requireSignIn();
		// 	}
		// }
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

app.controller("WashesCtrl", function($scope, $firebaseAuth, $routeParams){
	$scope.WashingHistory = true;
	$scope.Booking = false;
	$scope.openHistory = function(){
		$scope.WashingHistory = true;
		$scope.Booking = false;
	};
	$scope.openBookings = function(){
		$scope.WashingHistory = false;
		$scope.Booking = true;
	}
});
















