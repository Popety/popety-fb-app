angular.module('popetyfbapp')

.controller('submitController', function ($scope, $http) {

  $http.get(baseurl + 'condoList').success(function (res, req) {
    if(res.length > 0){
      console.log(res);
      var condos = res;

      function suggest_condos(term) {
         var q = term.toLowerCase().trim(),
             results = [];

         for (var i = 0; i < condos.length; i++) {
           var condo = condos[i];
           if (condo.unit_name.toLowerCase().indexOf(q) !== -1)
             results.push({
               value: condo.unit_name,
               // Pass the object as well. Can be any property name.
               obj: condo,
               label: $sce.trustAsHtml(
                 '<div class="row">' +
                 ' <div class="col-xs-5">' +
                 '  <i class="fa fa-user"></i>' +
                 '  <strong>' + highlight(condo.unit_name,term) + '</strong>'+
                 ' </div>' +
                 ' <div class="col-xs-7 text-right text-muted">' +
                 '  <small>' + highlight(condo.unit_name,term) + '</small>' +
                 ' </div>' +
                 '</div>'
               )
             });
         }
         return results;
      }

      $scope.ac_options_condos = {
        suggest: suggest_condos,
        on_select: function (selected) {
          $scope.selected_condo = selected.obj;
          console.log($scope.selected_condo);
        }
      };
    }
  }).error(function (err) {
    console.log(err);
  });

});
