angular.module('popetyfbapp')

.controller('homeController', function ($state, $scope, $http, ezfb, $q, store, AuthService) {

  $scope.fb_submit = function () {
    console.log('hello');
    ezfb.login(function (res) {
       if(res.status === 'connected'){
         if (res.authResponse) {
           updateLoginStatus(res.authResponse);
         }
       }else {
         console.log('login');
       }
     }, {scope: 'email, user_likes'});
  };

  // FB.init({
  //   appId      : '1623378827912092',
  //   xfbml      : false,
  //   version    : 'v2.5',
  //   status     : true
  // });
FB.Event.subscribe('edge.create', function(response) { console.log('You liked the URL: ', response); });
  /**
   * Update loginStatus result
   */
  function updateLoginStatus (more) {
    $q.all([
      ezfb.api('/me/likes/637366066397414')
    ]).then(function (resList) {
      if(resList[0].data.length === 1){
        $http.get("https://graph.facebook.com/v2.5/me", {
            params: {
              access_token: more.accessToken,
              fields: "id,name,email,gender,first_name,last_name,location,website,picture,relationship_status",
              format: "json"
            }
        }).then(function(result) {
          $http.post( baseurl + 'register', result.data).success(function (res, req) {
            if(res.status === 1 || res.status === 2){
              store.set('login', true);
              store.set('user_id', res.user_id);
              store.set('user_email', result.data.email);
              $state.go('tab.submit');
            }
          }).error(function (err) {
            console.log(err);
          });
          console.log('26', result);
        }, function(error) {
            console.log("There was a problem getting your profile.  Check the logs for details.");
        });
      }
    });
  }

});
