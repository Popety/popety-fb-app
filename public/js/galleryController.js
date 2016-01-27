      //      console.log("onlyimages:",$scope.onlyimages); 
angular.module('popetyfbapp')

.controller('galleryController', function ($scope, $http, $timeout, $sce , $state,$document) {
  
  
    this.tab = 2;
    
    this.setTab = function (tabId) {
        this.tab = tabId;
    };

    this.isSet = function (tabId) {
        return this.tab === tabId;
    };

  /**
   @function nextprevcondolist
   @returns retuns next or previous condolist
   @author sameer vedpathak
   @initialDate 
   */
    $scope.count = 0; 
  $scope.nextprevcondolist = function(btn){
    if(btn == 'next'){
      $scope.count ++;
      var nextprevid = { 
        condo_last_id : $scope.lastid
      }
    }else{ 
       $scope.count --;
      var nextprevid = {
        condo_prev_id : $scope.prev_id
      }
    }
    $http.post(baseurl + 'nextprevcondolist',nextprevid).success(function(res, req){
        $scope.allcondolist = res;
        $scope.prev_id = res[0].condo_id;
        $scope.lastid = res[res.length - 1].condo_id; 
    });
  } 

  /**
   @function getallcondolist
   @returns load letest condolist
   @author sameer vedpathak
   @initialDate 
   */
  $scope.getallcondolist = function(){
    $http.get(baseurl + 'getallcondolist').success(function(res, req){
      $scope.allcondolist = res;
      console.log(res); 
      $scope.lastid = res[res.length - 1].condo_id;
    });
  }



  /**
   @function getcondoimages
   @returns list of images by condo_id
   @author sameer vedpathak
   @initialDate 
   */
  // var self = this;
 $scope.images = [];

  $scope.getcondoimages = function(condoinfo){
    $scope.images = [];
    var condo_id = {
      condo_id : condoinfo.condo_id
    }
    $http.post(baseurl + 'getcondoimages',condo_id).success(function(res,req){
      $scope.condoimagelist = res;
      for (var i = 0; i < $scope.condoimagelist.length; i++) {
              $scope.images.push({thumb: $scope.condoimagelist[i].images, img: $scope.condoimagelist[i].images, description: 'Image 1'});
      }

      });
  }

});
  


