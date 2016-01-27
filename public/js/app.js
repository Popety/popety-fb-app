angular.module('popetyfbapp',['ui.router', 'MassAutoComplete','ngMessages','jkuri.gallery', 'ngFacebook','ngAnimate','SlideViewer'])

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

/*.run( function( $rootScope ) {
  // Load the facebook SDK asynchronously
  (function(){
     // If we've already installed the SDK, we're done
     if (document.getElementById('facebook-jssdk')) {return;}

     // Get the first script element, which we'll use to find the parent node
     var firstScriptElement = document.getElementsByTagName('script')[0];

     // Create a new script element and set its id
     var facebookJS = document.createElement('script'); 
     facebookJS.id = 'facebook-jssdk';

     // Set the new script's source to the source of the Facebook JS SDK
     facebookJS.src = '//connect.facebook.net/en_US/all.js';

     // Insert the Facebook JS SDK into the DOM
     firstScriptElement.parentNode.insertBefore(facebookJS, firstScriptElement);
   }());
})*/


.config(function($stateProvider, $urlRouterProvider,$facebookProvider) {

  $facebookProvider.setAppId('1623102964620661')

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
    //controller: 'submitController'
  })

  .state('tab.gallery', {
    url: "/gallery",
    templateUrl: "templates/gallery.html",
    // controller: 'galleryController'
  })
  .state('tab.galleryb', {
    url: "/galleryb",
    templateUrl: "templates/gallery_b.html",
    // controller: 'galleryController'
  })
  .state('tab.galleryc', {
    url: "/galleryc",
    templateUrl: "templates/gallery_c.html",
    // controller: 'galleryController'
  })
  .state('tab.galleryz', {
    url: "/galleryz",
    templateUrl: "templates/gallery_z.html",
    // controller: 'galleryController'
  })
  .state('tab.winners', {
    url: "/winners",
    templateUrl: "templates/winners.html",
    // controller: 'winnersController'
  })

  .state('fblogin', {
    url: "/fblogin",
    templateUrl: "templates/fblogin.html",
  });

  $urlRouterProvider.otherwise('/home');

});

angular
    .module('app', ['angularFileUpload'])
    .controller('AppController', function($scope, FileUploader) {
        $scope.uploader = new FileUploader();
    });
    

