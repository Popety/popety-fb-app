angular.module('popetyfbapp',['ui.router', 'MassAutoComplete'])

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider

  .state('home', {
    url: "/home",
    templateUrl: "templates/home.html",
    // controller: 'homeController'
  })

  .state('tab', {
    url: "/tab",
    templateUrl: "templates/tab.html",
    // controller: 'tabController'
  })

  .state('tab.submit', {
    url: "/submit",
    templateUrl: "templates/submit.html",
    controller: 'submitController'
  })

  .state('tab.gallery', {
    url: "/gallery",
    templateUrl: "templates/gallery.html",
    // controller: 'galleryController'
  })

  .state('tab.winners', {
    url: "/winners",
    templateUrl: "templates/winners.html",
    // controller: 'winnersController'
  });

  $urlRouterProvider.otherwise('/home');

});
