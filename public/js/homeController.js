angular.module('popetyfbapp')

.controller('homeController', function ($scope, $http, ezfb) {

  // ezfb.login(function (res) {
  //    if(res.status === 'connected'){
  //      if (res.authResponse) {
  //        updateLoginStatus(res.authResponse);
  //      }
  //    }else {
  //      console.log('login');
  //    }
  //  }, {scope: 'email'});

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
