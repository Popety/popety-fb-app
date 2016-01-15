angular.module('starter.controllers', [])

.controller('ReminderController', function($scope, $http, $state, store ,$stateParams,$location,$timeout) {

  $scope.init = function() {
    $scope.usersession = store.get('userDetail') || {};
     $scope.getreminders();

     if($stateParams){
      $scope.stateParams = $stateParams.todo_id;
      $scope.getreminderdetails($stateParams.todo_id); 
     }

  }

    $scope.IsVisible = false;

    $scope.ShowHide = function () {
      //If form is visible it will be hidden and vice versa.
      $scope.IsVisible = $scope.IsVisible ? false : true;
    }

  /**
    @function for addUpdateTodos
    @param {int} first - todo_id
    @author sameer vedpathak
    @initialDate
    @lastDate
  */

    $scope.addUpdateReminder = function(reminder,valid) {
      if(valid){
          if ($stateParams.todo_id)
            $scope.updateReminder(reminder);
          if ($stateParams.todo_id == '')
            $scope.addReminder(reminder);  
      }
      
    };

  /**
   @function addReminder
   @type post
   @author sameer Vedpathak
   @initialDate
   @lastDate
  */
    
    $scope.addReminder = function(reminder) {
      $scope.reminder = {
        todo_data : reminder.todo_data,
        user_id: $scope.usersession.userid,
        reminder_date:  $scope.datepickerObject.inputDate,
        reminder_time: $scope.time12hr
        //reminder_time: reminder.remindertime
      }
      console.log($scope.reminder);
      $http.post(baseUrl + 'addtodos',$scope.reminder).success(function(res, req) {
      if(res.status == true){
         
          $scope.reminderaddmsg = 'Reminder Added Successfully';
          $scope.showreminderaddmsg = true;
          // Simulate 2 seconds loading delay
          $timeout(function() {
            // Loadind done here - Show message for 3 more seconds.
            $timeout(function() {
              $scope.showreminderaddmsg = false;
            }, 3000);
              document.getElementById("addreminderform").reset();
             $state.go('tab.addreminder');
             $scope.IsVisible = false;
          }, 2000);
        $scope.getreminders();
      

        //$location.path('/tab/addreminder/');
      }else{
         console.log("Reminder Failes to Add");
      }
          
      }).error(function() {
        console.log("Connection Problem.");
      });

    }

  /**
   @function updateReminder
   @type post
   @author sameer Vedpathak
   @initialDate
   @lastDate
  */
  
    $scope.updateReminder = function(reminder,valid) {
      var tododata = {
        todo_data : reminder.todo_data,
        todo_id: $stateParams.todo_id,
        reminder_date:  $scope.datepickerObject.inputDate,
        reminder_time: $scope.timePickerObject.inputEpochTime
      }
      $http.post(baseUrl + 'updatetodos',tododata).success(function(res, req) {
        if(res.status == true){
          $scope.getreminders();
          $scope.reminderupdatemsg = 'Reminder Updated Successfully';
          $scope.showreminderupdatemsg = true;
          // Simulate 2 seconds loading delay
          $timeout(function() {
            // Loadind done here - Show message for 3 more seconds.
            $timeout(function() {
              $scope.showreminderupdatemsg = false;
            }, 3000);
             document.getElementById("addreminderform").reset();
             $location.path('/tab/addreminder/');
              //$scope.IsVisible = true;
              $scope.getreminders(); 
             //$scope.IsVisible = false;
          }, 2000);

        }else{
          console.log("Reminder Failed To Update");
        }
         $scope.IsVisible = false;
      }).error(function() {
        console.log("Connection Problem.");
      });
    }


   /**
     @function getreminders
     @type post
     @author sameer Vedpathak
     @initialDate
     @lastDate
   */
    $scope.getreminders = function() {

      var reminderdata = {
        user_id: $scope.usersession.userid
      }
      $http.post(baseUrl + 'gettodos',reminderdata).success(function(res, req) {
        $scope.reminderlist = res.record;
        console.log("reminderlist:",$scope.reminderlist);
        //console.log("$scope.reminderlist:",$scope.reminderlist);
      }).error(function() {
        console.log("Connection Problem.");
      });
    }

  /**
   @function getreminderdetails
   @type post
   @author sameer Vedpathak
   @initialDate
   @lastDate
  */
    $scope.getreminderdetails = function() {
      var tododata = {
        todo_id: $stateParams.todo_id
      }
      $http.post(baseUrl + 'gettododetails',tododata).success(function(res, req) {
        $scope.reminder = res.record[0];
      }).error(function() {
        console.log("Connection Problem.");
      });
    }

  /**
    @function deleteReminder
    @type post
    @author 
    @initialDate
    @lastDate
  */
    $scope.deleteReminder = function(reminder) {
      var reminderdata = {
        todo_id:reminder.todo_id
      }
      $http.post(baseUrl + 'deletetodo', reminderdata).success(function(res, req) {
         if( res.status == true ){
            // Remove the reminder from the reminderlist list
            for (var i in $scope.reminderlist) {
                if ($scope.reminderlist[i] == reminder) {
                    $scope.reminderlist.splice(i, 1);
                }
            }
            
            $scope.reminderdeletemsg = 'Reminder Deleted Successfully';
            $scope.showreminderdeletemsg = true;
              // Simulate 2 seconds loading delay
              $timeout(function() {
                // Loadind done here - Show message for 3 more seconds.
                $timeout(function() {
                  $scope.showreminderdeletemsg = false;
                }, 3000);
                 $location.path('/tab/addreminder/');
              }, 2000);

            $scope.getreminders();
          } else if(res.status === false){
            console.log("Failed To delete Reminder");
          }
      }).error(function() {
        console.log("Connection Problem.");
      });
    };

   $scope.datepickerObject = {
        titleLabel: 'Title',  //Optional
        todayLabel: 'Today',  //Optional
        closeLabel: 'Close',  //Optional
        setLabel: 'Set',  //Optional
        setButtonType : 'button-assertive',  //Optional
        todayButtonType : 'button-assertive',  //Optional
        closeButtonType : 'button-assertive',  //Optional
        inputDate: new Date(),  //Optional
        mondayFirst: true,  //Optional
        templateType: 'popup', //Optional
        showTodayButton: 'true', //Optional
        modalHeaderColor: 'bar-positive', //Optional
        modalFooterColor: 'bar-positive', //Optional
        callback: function (val) {  //Mandatory
          datePickerCallback(val);
          //console.log("val:",val);
        }
      };

      var datePickerCallback = function (val) {
          if (typeof(val) === 'undefined') {
            console.log('No date selected');
          } else {
            $scope.datepickerObject.inputDate = val;
            //console.log('Selected date is : ', val)
          }
      };

      $scope.timePickerObject = {
        inputEpochTime: ((new Date()).getHours() * 60 * 60),  //Optional
        step: 15,  //Optional
        format: 12,  //Optional
        titleLabel: '12-hour Format',  //Optional
        setLabel: 'Set',  //Optional
        closeLabel: 'Close',  //Optional
        setButtonType: 'button-positive',  //Optional
        closeButtonType: 'button-stable',  //Optional
        callback: function (val) {    //Mandatory
          timePickerCallback(val);
        }
      };
      
    /**** code for current time and with am/pm ***/

      var current_date = new Date();
      var hours = current_date.getHours();
      var minutes = current_date.getMinutes();
      var ampm = hours >= 12 ? 'pm' : 'am';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      minutes = minutes < 10 ? '0'+minutes : minutes;
      $scope.currenttime = hours + ':' + minutes + ' ' + ampm;

    /****   End of code for current time ***/
      

    function timePickerCallback(val) {
      if (typeof (val) === 'undefined') {
        console.log('Time not selected');
      } else {
        var selectedTime = new Date(val * 1000);
        //console.log("selectedTime:",selectedTime);
        $scope.remindertime = selectedTime.getUTCHours() + " : " + selectedTime.getUTCMinutes();
        //console.log("getUTCHours:",selectedTime.getUTCHours());
        var time24 = selectedTime.getUTCHours();
        suffix = time24 >= 12 ? "PM":"AM";
        time24 = ((time24 + 11) % 12 + 1);
        $scope.time12hr = time24 + ":" + selectedTime.getUTCMinutes() + " " + suffix;
        //console.log("$scope.time12hr:",$scope.time12hr);
        //console.log("$scope.timedata:",$scope.remindertime);
        //console.log('Selected epoch is : ', val, 'and the time is ', selectedTime.getUTCHours(), ':', selectedTime.getUTCMinutes(), 'in UTC');
      }
    }



})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
