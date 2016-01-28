angular.module('popetyfbapp')

.controller('galleryController', function($scope, $http, $timeout, $sce, $state, $document) {

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

  $scope.paginationAlphabetical = [
    {
      letter:'0-9',
      id:0,
      status:true,
    },
    {
      letter:'A',
      id:1,
      status:false,
    },{
      letter:'B',
      id:2,
      status:false,
    },{
      letter:'C',
      id:3,
      status:false,
    },{
      letter:'D',
      id:4,
      status:false,
    },{
      letter:'E',
      id:5,
      status:false,
    },{
      letter:'F',
      id:6,
      status:false,
    },{
      letter:'G',
      id:7,
      status:false,
    },
    {
      letter:'H',
      id:8,
      status:false,
    },{
      letter:'I',
      id:9,
      status:false,
    },{
      letter:'J',
      id:10,
      status:false,
    },{
      letter:'K',
      id:11,
      status:false,
    },{
      letter:'L',
      id:12,
      status:false,
    },{
      letter:'M',
      id:13,
      status:false,
    },{
      letter:'N',
      id:14,
      status:false,
    },{
      letter:'O',
      id:15,
      status:false,
    },{
      letter:'P',
      id:16,
      status:false,
    },{
      letter:'Q',
      id:17,
      status:false,
    },{
      letter:'R',
      id:18,
      status:false,
    },{
      letter:'S',
      id:19,
      status:false,
    },{
      letter:'T',
      id:20,
      status:false,
    },{
      letter:'U',
      id:21,
      status:false,
    },{
      letter:'V',
      id:22,
      status:false,
    },{
      letter:'W',
      id:23,
      status:false,
    },{
      letter:'X',
      id:24,
      status:false,
    },{
      letter:'Y',
      id:25,
      status:false,
    },{
      letter:'Z',
      id:26,
      status:false,
    }

  ];
  $scope.getCondoListAlphabetically = function (page) {
    console.log(page);
    page.status = true;
    $http.post(baseurl + 'getAlphaNumericCondoList', page).success(function(res, req) {
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

  $scope.vote = function (condo) {
    console.log(condo);
  };

});
