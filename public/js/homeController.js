angular.module('popetyfbapp')

.controller('homeController', function ($state, $stateParams, $scope, $http, $q, store, facebookService) {

    $scope.getUserData = function () {
      facebookService.getUserData().then(function(response){
        $http.post( baseurl + 'register', response).success(function (res, req) {
          if(res.status === 1 || res.status === 2){
            store.set('login', true);
            store.set('user_id', res.user_id);
            store.set('user_email', response.email);
            store.set('user_name', response.first_name + ' ' + response.last_name);
            $state.go('tab.submit');
          }
        }).error(function (err) {
          console.log(err);
        });
      });
    };
  // facebookService.checklikes().then(function(resList) {
  //   console.log(resList);
  //      if(resList.data.length === 1){
  //        getUserData();
  //      }else {
  //        console.log('like the page');
  //      }
  //  });

  //  FB.Event.subscribe('edge.create', function(response) {
  //    console.log('You liked the URL: ', response);
  //    getUserData();
  //  });

});
