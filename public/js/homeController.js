angular.module('popetyfbapp')

.controller('homeController', function ($scope, $http, ezfb, $q) {

  // $scope.login = function () {
  //   console.log('hello');
    ezfb.login(function (res) {
      console.log(res);
       if(res.status === 'connected'){
         if (res.authResponse) {
           updateLoginStatus(res.authResponse);
         }
       }else {
         console.log('login');
       }
     }, {scope: 'email, user_likes'});
  // };

  /**
   * Update loginStatus result
   */
  function updateLoginStatus (more) {
    $q.all([
      ezfb.api('/me/likes/637366066397414')
    ])
    .then(function (resList) {
      if(resList[0].data.length === 1){
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
      // Runs after both api calls are done
      // resList[0]: FB.api('/me') response
      // resList[1]: FB.api('/me/likes') response
      $scope.apiRes = resList;
    });
    // $http.get("https://graph.facebook.com/v2.5/me/likes/1623378827912092", {
    //     params: {
    //       access_token: more.accessToken,
    //       format: "json"
    //     }
    // }).then(function(result) {
    //   console.log('26', result);
    // }, function(error) {
    //     console.log("There was a problem getting your profile.  Check the logs for details.");
    // });
  }

});
