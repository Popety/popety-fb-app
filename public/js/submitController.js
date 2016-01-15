angular.module('popetyfbapp')

.controller('submitController', function ($scope, $http) {

  $http.get(baseurl + 'condoList').success(function (res, req) {
    console.log(res);
  }).error(function (err) {
    console.log(err);
  });

});
