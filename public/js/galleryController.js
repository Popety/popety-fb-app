angular.module('popetyfbapp')

.controller('galleryController', function($scope, $http, $timeout, $sce, $state, $document) {

  $scope.init = function() {
    $scope.getallcondolist();
    this.tab = 2;
  };

  this.tab = 2;

  this.setTab = function(tabId) {
    this.tab = tabId;
  };

  this.isSet = function(tabId) {
    return this.tab === tabId;
  };

  /**
   @function nextprevcondolist
   @returns retuns next or previous condolist
   @author sameer vedpathak
   @initialDate
   */
  $scope.count = 0;
  $scope.nextprevcondolist = function(btn) {
    if (btn == 'next') {
      $scope.count++;
      var nextprevid = {
        condo_last_id: $scope.lastid
      }
    } else {
      $scope.count--;
      var nextprevid = {
        condo_prev_id: $scope.prev_id
      }
    }
    $http.post(baseurl + 'nextprevcondolist', nextprevid).success(function(res, req) {
      $scope.allcondolist = res;
      $scope.prev_id = res[0].condo_id;
      $scope.lastid = res[res.length - 1].condo_id;
    }).error(function(err){
       console.log('Connection Problem..');
        $scope.nextprevcondolist_conn_msg = "Connection Problem..";
        $scope.shownextprevcondolist_conn_msg = true;
        $timeout(function() {
          $scope.shownextprevcondolist_conn_msg = false;
        }, 3000);
    });
  }

  /**
   @function getallcondolist
   @returns load letest condolist
   @author sameer vedpathak
   @initialDate
   */
  $scope.getallcondolist = function() {
      $http.get(baseurl + 'getallcondolist').success(function(res, req) {
        if(status = 0){
          $scope.condolist_err_msg = "Error To Get Condo List";
          $scope.showcondolist_err_msg = true;
          $timeout(function() {
            $scope.showcondolist_err_msg = false;
          }, 3000);
        }else{
          $scope.allcondolist = res;
          $scope.lastid = res[res.length - 1].condo_id;
        }
        
      }).error(function(err){
          console.log("Connection Problem...")
          
      });
    }
    //$scope.getallcondolist();


  /**
   @function getcondoimages
   @returns list of images by condo_id
   @author sameer vedpathak
   @initialDate
   */
  
  $scope.images = [];

  $scope.getcondoimages = function(condoinfo) {
    $scope.images = [];
    $scope.imagesobj = [];
    var condo_id = {
      condo_id: condoinfo.condo_id
    }
    $http.post(baseurl + 'getcondoimages', condo_id).success(function(res, req) {
      $scope.condoimagelist = res;
      for (var i = 0; i < $scope.condoimagelist.length; i++) {
        //$scope.images.push({thumb: $scope.condoimagelist[i].images, img: $scope.condoimagelist[i].images, description: 'Image 1'});
        $scope.imagesobj.push($scope.condoimagelist[i].images);
      }
      $scope.slides = [{
        Title: "First"
      }, {
        Title: "Second"
      }, {
        Title: "Third"
      }];
    }).error(function(err){
        console.log('Connection Problem..');
        $scope.connectionmsg = "Connection Problem..";
        $scope.showconnectionmsg = true;
          $timeout(function() {
            $scope.showconnectionmsg = false;
          }, 3000);

    });
  }

});
