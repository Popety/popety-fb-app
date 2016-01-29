angular.module('popetyfbapp')

.controller('homeController', function ($scope, $http, ezfb) {
  ezfb.login(function (res) {
    console.log('5', res);
     /**
      * no manual $scope.$apply, I got that handled
      */
     if (res.authResponse) {
       updateLoginStatus(updateApiMe);
     }
   }, {scope: 'email,user_likes'});
  /**
   * Update loginStatus result
   */
  function updateLoginStatus (more) {
    ezfb.getLoginStatus(function (res) {
      $scope.loginStatus = res;
      console.log('19', res);
      (more || angular.noop)();
    });
  }

  /**
   * Update api('/me') result
   */
  function updateApiMe () {
    ezfb.api('/me', function (res) {
      $scope.apiMe = res;
    });
  }
});
