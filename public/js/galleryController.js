angular.module('popetyfbapp')

.controller('galleryController', function($scope, $http, $timeout, store) {

  var loader = $("#loader-div");
  $scope.nextIndex = 5;
  $scope.prevIndex = 0;

  /**
   @function nextprevcondolist
   @returns retuns next or previous condolist
   @author sameer vedpathak
   @initialDate
   */
  $scope.count = 0; //for next prev count
  $scope.selectedLetter = null; // currently selected letter
  $scope.letter_total_condos = 0; // for no. of total condos from letter
  $scope.nextprevcondolist = function(btn) {
    var nextprevid;
    if (btn == 'next') {
      $scope.count++;
      nextprevid = {
        condo_last_id: $scope.lastid,
        condo_letter: $scope.selectedLetter
      };
    } else {
      $scope.count--;
      nextprevid = {
        condo_prev_id: $scope.prev_id,
        condo_letter: $scope.selectedLetter
      };
    }
    $http.post(baseurl + 'nextprevcondolist', nextprevid).success(function(res, req) {
      $scope.allcondolist = res;
      $scope.prev_id = res[0].condo_id;
      $scope.lastid = res[res.length - 1].condo_id;
    }).error(function(err) {
      console.log('Connection Problem..');
      $scope.nextprevcondolist_conn_msg = "Connection Problem..";
      $scope.shownextprevcondolist_conn_msg = true;
      $timeout(function() {
        $scope.shownextprevcondolist_conn_msg = false;
      }, 3000);
    });
  };


  /**
   @function getallcondolist
   @returns load letest condolist
   @author sameer vedpathak
   @initialDate
   */
  $scope.getallcondolist = function() {
    $http.get(baseurl + 'getallcondolist').success(function(res, req) {
      if (res.status === 0) {
        $scope.condolist_err_msg = "Error To Get Condo List";
        $scope.showcondolist_err_msg = true;
        $timeout(function() {
          $scope.showcondolist_err_msg = false;
        }, 3000);
      } else if (res.length !== 0){
        $scope.allcondolist = res;
        $scope.lastid = res[res.length - 1].condo_id;
      }
    }).error(function(err) {
      console.log("Connection Problem...");
    });
  };


  /**
   @function getcondoimages
   @returns list of images by condo_id
   @author sameer vedpathak
   @initialDate
   */

  $scope.images = [];

  $scope.getcondoimages = function(condoinfo) {
    loader.fadeIn(200);
    $scope.images = [];
    $scope.imagesobj = [];
    var condo_id = {
      condo_id: condoinfo.condo_id
    };
    $http.post(baseurl + 'getcondoimages', condo_id).success(function(res, req) {
      loader.hide();
      $scope.condoimagelist = res;
      for (var i = 0; i < $scope.condoimagelist.length; i++) {
        $scope.imagesobj.push($scope.condoimagelist[i].images);
      }
      var popup = $("#popup");
      popup.fadeIn(200);
    }).error(function(err) {
      console.log('Connection Problem..');
      $scope.connectionmsg = "Connection Problem..";
      $scope.showconnectionmsg = true;
      $timeout(function() {
        $scope.showconnectionmsg = false;
      }, 3000);
      loader.hide();
    });
  };

  $scope.paginationAlphabetical = [{
      letter: '0-9',
      id: 0,
      status: true,
      pageno: 0,
    }, {
      letter: 'A',
      id: 1,
      status: false,
      pageno: 0,
    }, {
      letter: 'B',
      id: 2,
      status: false,
      pageno: 0,
    }, {
      letter: 'C',
      id: 3,
      status: false,
      pageno: 0,
    }, {
      letter: 'D',
      id: 4,
      status: false,
      pageno: 0,
    }, {
      letter: 'E',
      id: 5,
      status: false,
      pageno: 0,
    }, {
      letter: 'F',
      id: 6,
      status: false,
      pageno: 0,
    }, {
      letter: 'G',
      id: 7,
      status: false,
      pageno: 0,
    }, {
      letter: 'H',
      id: 8,
      status: false,
      pageno: 0,
    }, {
      letter: 'I',
      id: 9,
      status: false,
      pageno: 0,
    }, {
      letter: 'J',
      id: 10,
      status: false,
      pageno: 0,
    }, {
      letter: 'K',
      id: 11,
      status: false,
      pageno: 0,
    }, {
      letter: 'L',
      id: 12,
      status: false,
      pageno: 0,
    }, {
      letter: 'M',
      id: 13,
      status: false,
      pageno: 0,
    }, {
      letter: 'N',
      id: 14,
      status: false,
      pageno: 0,
    }, {
      letter: 'O',
      id: 15,
      status: false,
      pageno: 0,
    }, {
      letter: 'P',
      id: 16,
      status: false,
      pageno: 0,
    }, {
      letter: 'Q',
      id: 17,
      status: false,
      pageno: 0,
    }, {
      letter: 'R',
      id: 18,
      status: false,
      pageno: 0,
    }, {
      letter: 'S',
      id: 19,
      status: false,
      pageno: 0,
    }, {
      letter: 'T',
      id: 20,
      status: false,
      pageno: 0,
    }, {
      letter: 'U',
      id: 21,
      status: false,
      pageno: 0,
    }, {
      letter: 'V',
      id: 22,
      status: false,
      pageno: 0,
    }, {
      letter: 'W',
      id: 23,
      status: false,
      pageno: 0,
    }, {
      letter: 'X',
      id: 24,
      status: false,
      pageno: 0,
    }, {
      letter: 'Y',
      id: 25,
      status: false,
      pageno: 0,
    }, {
      letter: 'Z',
      id: 26,
      status: false,
      pageno: 0,
    }

  ];
  $scope.getCondoListAlphabetically = function(page, pageno) {
    loader.fadeIn(200);
    for (var i = 0; i < $scope.paginationAlphabetical.length; i++) {
      $scope.paginationAlphabetical[i].status = false;
      $scope.paginationAlphabetical[i].pageno = 0;
    }
    $scope.count = 0;
    page.status = true;
    $scope.selectedLetter = page.letter;
    $http.post(baseurl + 'getAlphaNumericCondoList', page).success(function(res, req) {
      if (res.status === 0) {
        $scope.condolist_err_msg = "Error To Get Condo List";
        $scope.showcondolist_err_msg = true;
        $timeout(function() {
          $scope.showcondolist_err_msg = false;
        }, 3000);
        loader.hide();
      } else {
        //$scope.alphaAllcondolist = res;
        $scope.allcondolist = res.condolist;
        if (res.condolist.length > 0)
          $scope.lastid = res.condolist[res.condolist.length - 1].condo_id;
        $scope.letter_total_condos = res.letter_total_condos;
        loader.hide();
      }

    }).error(function(err) {
      console.log("Connection Problem...");
      loader.hide();
    });

  };

  $scope.getCondoListAlphabeticallyNextPrev = function(btn) {
    loader.fadeIn(200);
    if ($scope.count * 6 >= $scope.letter_total_condos) {
      $scope.count = 0;
    }
    var nextprevid;
    if (btn == 'next') {
      $scope.count++;
      nextprevid = {
        pageno: $scope.count,
        last_condo_id: $scope.lastid,
        letter: $scope.selectedLetter,
        status: true,
      };
    } else {
      $scope.count--;
      nextprevid = {
        pageno: $scope.count,
        condo_prev_id: $scope.lastid,
        status: true,
        condo_letter: $scope.selectedLetter
      };
    }

    $http.post(baseurl + 'getAlphaNumericCondoList', nextprevid).success(function(res, req) {
      if (res.status === 0) {
        $scope.condolist_err_msg = "Error To Get Condo List";
        $scope.showcondolist_err_msg = true;
        $timeout(function() {
          $scope.showcondolist_err_msg = false;
        }, 3000);
        loader.hide();
      } else {
        $scope.allcondolist = res.condolist;
        if (res.condolist.length > 0)
          $scope.lastid = res.condolist[res.condolist.length - 1].condo_id;
        $scope.letter_total_condos = res.letter_total_condos;
        loader.hide();
      }

    }).error(function(err) {
      console.log("Connection Problem...");
      loader.hide();
    });
  };


  $scope.vote = function(condo) {
    loader.fadeIn(200);
    var vote = {
      'condo_id': condo.condo_id,
      'user_id': store.get('user_id')
    };
    $http.post(baseurl + 'vote', vote).success(function(res, req) {
      if (res.status === 2) {
        var popup_1 = $("#popup-1");
        popup_1.fadeIn(200);
        for(var i = 0; i < $scope.allcondolist.length; i++){
          if($scope.allcondolist[i].condo_id === condo.condo_id){
            $scope.allcondolist[i].votes = $scope.allcondolist[i].votes + 1;
          }
        }
        loader.hide();
      } else if (res.status === 1) {
        loader.hide();
        var popup_3 = $("#popup-3");
        popup_3.fadeIn(200);
      }
    }).error(function(err) {
      loader.hide();
      console.log(err);
    });
  };

  $scope.share = function (condo) {
    // FB.ui({
    //   method: 'share',
    //   href: 'https://www.facebook.com/popetyworld/app/1623378827912092/',
    // }, function(response){
    //   console.log(response);
    // });
    // var condoData = {
    //   'condo_id': condo.condo_id
    // };
    // $http.post( baseurl + 'createImage', condoData).success(function (res, req) {
    //   if(res.status === 1){
    //     console.log(imageurl + '' + res.filename);
        FB.ui({
             method: 'feed',
             name: 'This is the content of the "name" field.',
             link: 'https://www.facebook.com/popetyworld/app/1623378827912092',
             picture: 'https://apps.popety.com/images/share_image.jpg',
             caption: 'Caption like which appear as title of the dialog box',
             description: 'Small description of the post',
             message: 'Test Feed'
         },function(response) {
             console.log(response);
            //  if (response && !response.error_message) {
            //    alert('Posting completed.');
            //  } else {
            //    alert('Error while posting.');
            //  }
         });
    //   }
    //   console.log(res);
    // }).error(function (err) {
    //   console.log(err);
    // });
  };

});
