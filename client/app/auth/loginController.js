/**
 * Home Harmony Login
 * Controller for login page
 */
angular.module('homeHarmony.login',['firebase', 'ui.router'])

.controller('LoginCtrl', function ($scope, $location, UserAuth, $firebaseObject, $state, DButil) {
  // database reference
  var db = new Firebase("https://dazzling-inferno-3592.firebaseio.com");
  var houseMembersObj = {};
  var hasHouse = false;

  // TODO: add clear localsession cache function and add it to loginUser

  $scope.logInUser = function() {
    // clear input fields
    $('#loginEmailField').val('');
    $('#loginPasswordField').val('');

    UserAuth.login($scope.email, $scope.password, function (userEmail){  // send login info to Auth with this callback

      //try to factor this out as a separate named function "at some later date"

      // Query database for user info
      db.once("value", function(snapshot) {
        var totalDb = snapshot.val();
        var userDb = totalDb.users;
        console.log(userDb, 'uemail', userEmail)
        for (var userId in userDb){
        console.log(userDb[userId])
          if (userDb[userId].email === userEmail) {
            // Save id from database into local storage
            currentUserId = userId;
            localStorage.setItem("currentUserEmail", userEmail);
            localStorage.setItem("currentUserName", userDb[userId].firstname);
            localStorage.setItem("currentUserId", currentUserId);
            if (userDb[userId].house) {
              // Save house info locally and redirect to dashboard if user has a house
              hasHouse = true;
              currentHouseId = userDb[userId].house;
              localStorage.setItem("currentHouseId", currentHouseId);
              console.log('CHID ', currentHouseId);

              // Iterate through user database for members of the same house
              for (var userId2 in userDb) {
                if (userDb[userId2].house === currentHouseId) {  // add house index to the db "later"
                  // Save all members' first names plus last initial to 'houseMembersObj'
                  houseMembersObj[userId2] = userDb[userId2].firstname + " " + userDb[userId2].lastname[0];
                }
              }
              // Save this object stringified into local storage.
              localStorage.setItem("currentMembersObj", JSON.stringify(houseMembersObj));
              $state.go('dash.default');

            } else {
              // redirect to newHouse if user doesnt have a house yet
              $state.go('newHouse');
            }
          }

        }
        console.log(currentUserId, 'CUID');


      }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
      });
    });
  };
});
