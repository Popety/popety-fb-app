angular.module('popetyfbapp')

.controller('homeController', function ($scope, $http, ezfb) {

  ezfb.login(function (res) {
    console.log('5', res);
     /**
      * no manual $scope.$apply, I got that handled
      */
     if (res.authResponse) {
       updateLoginStatus(authResponse);
     }
   }, {scope: 'email,user_likes'});

  /**
   * Update loginStatus result
   */
  function updateLoginStatus (more) {
    $http.get("https://graph.facebook.com/v2.5/me", {
        params: {
          access_token: more.accessToken,
          fields: "id,name,email,gender,first_name,last_name,location,website,picture,relationship_status",
          format: "json"
        }
    }).then(function(result) {
      console.log('26', result);
    }, function(error) {
        console.log("There was a problem getting your profile.  Check the logs for details.");
    });
  }

  /**
   * Update api('/me') result
   */
  function updateApiMe () {
    ezfb.api('/me', function (res) {
      $scope.apiMe = res;
      console.log('30',res);
    });
  }
});
