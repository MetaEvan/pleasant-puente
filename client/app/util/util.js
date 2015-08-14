angular.module('homeHarmony.util', ['firebase'])

.factory('DButil', function(){
  var db = new Firebase("https://dazzling-inferno-3592.firebaseio.com");
  return {


    getUserIdFromEmail: function(userEmail, cb){
      db.once("value", function(snapshot) {
        var usersDb = snapshot.val().users;
        var resultId = 'DEFAULT_USER_ID';
        for (uid in usersDb){
          if (usersDb[uid].email === userEmail){
            resultId = uid;
          }
        }
        cb(resultId);
      }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
      });
    },

    populateEmailDb: function(){
      var emailDbObj = {};  //build up data in this to send to db all at once
      var currentDate = Date.parse(new Date());
      var ONE_DAY = 86400000;
      db.once("value", function(snapshot) {
        var houseDb = snapshot.val().houses;
        for (var prop in houseDb){
          for (var prop2 in houseDb[prop].expenses){
            var thisExpense = houseDb[prop].expenses[prop2];
            if (currentDate - Date.parse(thisExpense.dueDate) < ONE_DAY * 7
              && currentDate - Date.parse(thisExpense.dueDate) > ONE_DAY * -14
              && !thisExpense.paid){
              thisTask.type = "expense";
              emailDbObj[thisExpense.member].todos = emailDbObj[thisExpense.member].todos || [];
              emailDbObj[thisExpense.member].todos.push(thisExpense);
            }
          }
          for (var prop2 in houseDb[prop].tasks){
            var thisTask = houseDb[prop].tasks[prop2];
            if (currentDate - Date.parse(thisTask.dueDate) < ONE_DAY
              && currentDate - Date.parse(thisTask.dueDate) > ONE_DAY * -7
              && !thisTask.paid){
              thisTask.type = "task";
              emailDbObj[thisTask.member].todos = emailDbObj[thisTask.member].todos || [];
              emailDbObj[thisTask.member].todos.push(thisTask);
            }
          }

        }
      })
    }
  };
});
