angular.module('popetyfbapp')

.controller('homeController', function ($scope, $http, ezfb) {
    /**
     * Origin: FB.getLoginStatus
     */
    ezfb.getLoginStatus(function (res) {
      $scope.loginStatus = res;
      console.log('9', res);
      (more || angular.noop)();
    });

    /**
     * Origin: FB.api
     */
    ezfb.api('/me', function (res) {
      $scope.apiMe = res;
      console.log('18',res);
    });
});
