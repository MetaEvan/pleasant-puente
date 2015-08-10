angular.module('homeHarmony.newUser', ['firebase'])

.controller('NewUserCtrl', function ($scope, $location, $firebaseObject, UserAuth) {

  var db = new Firebase("https://dazzling-inferno-3592.firebaseio.com");

  $scope.addUser = function(){
    var userObj = {
      firstname: $scope.firstname,
      lastname: $scope.lastname,
      email: $scope.email  //unique
      // dateJoined: new Date()
      // house: houseId
    };
    UserAuth.newUser(userObj.email, $scope.password, function(userEmail){
      currentUser = userEmail;
      currentUserId = db.child('users').push(userObj);
    });
  };
  console.log($scope)
});
