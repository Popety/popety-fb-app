angular.module('popetyfbapp',['ui.router', 'MassAutoComplete','ngMessages','ngAnimate','SlideViewer'])

.directive('checkRequired', function(){
  return {
    require: 'ngModel',
    restrict: 'A',
    link: function (scope, element, attrs, ngModel) {
      ngModel.$validators.checkRequired = function (modelValue, viewValue) {
        var value = modelValue || viewValue;
        var match = scope.$eval(attrs.ngTrueValue) || true;
        return value && match === value;
      };
    }
  };
})

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider

  .state('home', {
    url: "/home",
    templateUrl: "templates/home.html",
  })

  .state('tab', {
    url: "/tab",
    templateUrl: "templates/tab.html",
  })

  .state('tab.submit', {
    url: "/submit",
    templateUrl: "templates/submit.html",
  })

  .state('tab.gallery', {
    url: "/gallery",
    templateUrl: "templates/gallery.html",
  })

  .state('tab.winners', {
    url: "/winners",
    templateUrl: "templates/winners.html",
  })

  .state('termsandcondition', {
    url: "/termsandcondition",
    templateUrl: "templates/terms.html",
  });

  $urlRouterProvider.otherwise('/home');

});
