
angular.module('popetyfbapp',['ui.router', 'angular-storage', 'MassAutoComplete', 'ngMessages', 'ngAnimate', 'SlideViewer', 'ngCsv'])
// ezfb
.config(function($stateProvider, $urlRouterProvider) {
// ezfbProvider
  // ezfbProvider.setInitParams({
  //   // This is my FB app id for plunker demo app
  //   appId: '1623378827912092',
  //   status: true,
  //   version: 'v2.4'
  // });

  // Feasible config if the FB JS SDK script is already loaded
  // ezfbProvider.setLoadSDKFunction(function (ezfbAsyncInit) {
  //   ezfbAsyncInit();
  // });

  $stateProvider

  .state('home', {
    url: "/home",
    templateUrl: "templates/home.html",
  })

  .state('tab', {
    url: "/tab",
    authRequired : true,
    templateUrl: "templates/tab.html",
  })

  .state('tab.submit', {
    url: "/submit",
    authRequired : true,
    templateUrl: "templates/submit.html",
  })

  .state('tab.gallery', {
    url: "/gallery",
    authRequired : true,
    templateUrl: "templates/gallery.html",
  })

  .state('tab.winners', {
    url: "/winners",
    authRequired : true,
    templateUrl: "templates/winners.html",
  })

  .state('termsandcondition', {
    url: "/termsandcondition",
    templateUrl: "templates/terms.html",
  });

  $urlRouterProvider.otherwise('/home');

})

// ...
.factory('facebookService', function($q) {
    return {
        getUserData: function() {
            var deferred = $q.defer();
            FB.login(function(response) {
                if (response.authResponse) {
                 FB.api('/me', {
                     fields: 'id,email,gender,first_name,last_name'
                 }, function(response) {
                     if (!response || response.error) {
                         deferred.reject('Error occured');
                     } else {
                         deferred.resolve(response);
                     }
                     console.log(response);
                 });
                } else {
                 console.log('User cancelled login or did not fully authorize.');
                }
            });
            return deferred.promise;
        },
        checklikes: function () {
          var deferred = $q.defer();
          FB.login(function(response) {
              if (response.authResponse) {
               FB.api('/me/likes/637366066397414', function(response) {
                   if (!response || response.error) {
                       deferred.reject('Error occured');
                   } else {
                       deferred.resolve(response);
                   }
                   console.log(response);
               });
              } else {
               console.log('User cancelled login or did not fully authorize.');
              }
          });
          return deferred.promise;
        }

    }
})

.service('AuthService', function(store){
    this.isAuthenticated = store.get('login');
    console.log(store.get('login'));
    console.log( 'propertylogin meas us user logged in =' + this.isAuthenticated );
});
