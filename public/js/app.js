
angular.module('popetyfbapp',['ui.router', 'angular-storage', 'MassAutoComplete', 'ngMessages', 'ngAnimate', 'SlideViewer', 'ngCsv', 'flow'])

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('home', {
    url: "/home",
    templateUrl: "templates/contest_over.html",
   });
  // .state('home', {
  //   url: "/home",
  //   templateUrl: "templates/home.html",
  // })

  // .state('tab', {
  //   url: "/tab",
  //   // authRequired : true,
  //   templateUrl: "templates/tab.html",
  // })

  // .state('tab.submit', {
  //   url: "/submit",
  //   authRequired : true,
  //   templateUrl: "templates/submit.html",
  // })

  // .state('tab.gallery', {
  //   url: "/gallery",
  //   authRequired : true,
  //   templateUrl: "templates/gallery.html",
  // })

  // .state('tab.winners', {
  //   url: "/winners",
  //   authRequired : true,
  //   templateUrl: "templates/winners.html",
  // })

  // .state('termsandcondition', {
  //   url: "/termsandcondition",
  //   templateUrl: "templates/terms.html",
  // });

  $urlRouterProvider.otherwise('/home');

})
.run(function($rootScope, $state, AuthService, $http, store, facebookService) {
  $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
    var popup_4 = $("#popup-4");
    var loader = $("#loader-div");

    if ( toState.authRequired ) {
      if( !store.get('isLogin') || store.get('isLogin') !== true || !store.get('user_id') ){
        facebookService.getUserData().then(function(response){
          loader.fadeIn(200);
          $http.post( baseurl + 'register', response).success(function (res, req) {
            if(res.status === 1 || res.status === 2){
              store.set('isLogin', true);
              store.set('user_id', res.user_id);
              if(response.email) store.set('user_email', response.email);
              store.set('user_name', response.first_name + ' ' + response.last_name);
              AuthService.isAuthenticated = store.get('isLogin');
            }else if(res.status === 0){
              popup_4.fadeIn(200);
              $state.go('home');
            }
            loader.hide();
          }).error(function (err) {
            loader.hide();
            event.preventDefault();
            AuthService.isAuthenticated = false;
            store.remove('isLogin');
            $state.go('home');
            console.log(err);
          });
        });
      }
    }
  });
})
.service('AuthService', function(store){
     this.isAuthenticated = store.get('isLogin');
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
