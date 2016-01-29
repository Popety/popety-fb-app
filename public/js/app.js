angular.module('popetyfbapp',['ui.router', 'MassAutoComplete','ngMessages','ngAnimate','SlideViewer','ngSanitize','ngCsv'])
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
