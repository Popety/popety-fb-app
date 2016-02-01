angular.module('popetyfbapp')

.controller('homeController', function ($state, $scope, $http, $q, store, facebookService) {
  facebookService.checklikes().then(function(resList) {
       if(resList.data.length === 1){
         getUserData();
       }else {
         console.log('like the page');
       }
   });

   function getUserData() {
     facebookService.getUserData().then(function(response){
       $http.post( baseurl + 'register', response).success(function (res, req) {
         if(res.status === 1 || res.status === 2){
           store.set('login', true);
           store.set('user_id', res.user_id);
           store.set('user_email', response.email);
           $state.go('tab.submit');
         }
       }).error(function (err) {
         console.log(err);
       });
     });
   }

   FB.Event.subscribe('edge.create', function(response) {
     console.log('You liked the URL: ', response);
     getUserData();
   });

});
