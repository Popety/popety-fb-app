
angular.module('popetyfbapp',['ui.router', 'angular-storage', 'MassAutoComplete', 'ngMessages', 'ngAnimate', 'SlideViewer', 'ngCsv', 'flow'])

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider

  .state('home', {
    url: "/home",
    templateUrl: "templates/home.html",
  })

  .state('tab', {
    url: "/tab",
    // authRequired : true,
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
.run(function($rootScope, $state, AuthService, $http, store) {
  $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
    if ( toState.authRequired ) {
      if( !store.get('isLogin') || store.get('isLogin') !== true ){
        event.preventDefault();
        AuthService.isAuthenticated = false;
        store.remove('isLogin');
        $state.go('home');
      }
    }
  });
})
.service('AuthService', function(store){
  FB.login(function(response) {
      if (response.authResponse) {
       FB.api('/me', {
           fields: 'id,email,gender,first_name,last_name'
       }, function(response) {
           if (!response || response.error) {
               alert('Error occured');
           } else {
               this.isAuthenticated = store.get('isLogin');
           }
       });
      } else {
       console.log('User cancelled login or did not fully authorize.');
      }
  });
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
               });
              } else {
               console.log('User cancelled login or did not fully authorize.');
              }
          });
          return deferred.promise;
        }

    };
});
