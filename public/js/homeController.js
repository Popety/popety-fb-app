angular.module('popetyfbapp')

.controller('homeController', function ($state, $stateParams, $scope, $http, $q, store, facebookService) {
  var popup_4 = $("#popup-4");
  var loader = $("#loader-div");

    $scope.getUserData = function () {
      loader.fadeIn(200);
      facebookService.getUserData().then(function(response){
        $http.post( baseurl + 'register', response).success(function (res, req) {
          if(res.status === 1 || res.status === 2){
            store.set('login', true);
            store.set('user_id', res.user_id);
            store.set('user_email', response.email);
            store.set('user_name', response.first_name + ' ' + response.last_name);
            $state.go('tab.submit');
          }else if(res.status === 3 || res.status === 0){
            popup_4.fadeIn(200);
          }
          loader.hide();
        }).error(function (err) {
          console.log(err);
        });
      });
    };

    $scope.closePopup = function () {
      popup_4.hide();
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
