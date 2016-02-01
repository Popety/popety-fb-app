angular.module('popetyfbapp')

.controller('galleryController', function($scope, $http, $timeout, store) {

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
      } else {
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
    $scope.images = [];
    $scope.imagesobj = [];
    var condo_id = {
      condo_id: condoinfo.condo_id
    };
    $http.post(baseurl + 'getcondoimages', condo_id).success(function(res, req) {
      $scope.condoimagelist = res;
      for (var i = 0; i < $scope.condoimagelist.length; i++) {
        $scope.imagesobj.push($scope.condoimagelist[i].images);
      }
    }).error(function(err) {
      console.log('Connection Problem..');
      $scope.connectionmsg = "Connection Problem..";
      $scope.showconnectionmsg = true;
      $timeout(function() {
        $scope.showconnectionmsg = false;
      }, 3000);

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
    console.log(page);
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
      } else {
        console.log(res);
        //$scope.alphaAllcondolist = res;
        $scope.allcondolist = res.condolist;
        if (res.condolist.length > 0)
          $scope.lastid = res.condolist[res.condolist.length - 1].condo_id;
        console.log($scope.lastid);
        $scope.letter_total_condos = res.letter_total_condos;
      }

    }).error(function(err) {
      console.log("Connection Problem...");
    });

  };

  $scope.getCondoListAlphabeticallyNextPrev = function(btn) {
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
    console.log(nextprevid);
    $http.post(baseurl + 'getAlphaNumericCondoList', nextprevid).success(function(res, req) {
      if (res.status === 0) {
        $scope.condolist_err_msg = "Error To Get Condo List";
        $scope.showcondolist_err_msg = true;
        $timeout(function() {
          $scope.showcondolist_err_msg = false;
        }, 3000);
      } else {
        console.log(res);
        //$scope.alphaAllcondolist = res;
        $scope.allcondolist = res.condolist;
        if (res.condolist.length > 0)
          $scope.lastid = res.condolist[res.condolist.length - 1].condo_id;
        console.log($scope.lastid);
        $scope.letter_total_condos = res.letter_total_condos;
      }

    }).error(function(err) {
      console.log("Connection Problem...");
    });
  };

  $scope.checkVote = function (condo){
    var voteData = {
      'condo_id': condo.condo_id,
      'user_id': store.get('user_id')
    };
    $http.post(baseurl + 'checkVote', voteData).success(function(res, req) {
      console.log(res);
      // if (res.status === 2) {
      //   console.log('voted');
      // } else if (res.status === 1) {
      //   console.log('already voted');
      // }
    }).error(function(err) {
      console.log(err);
    });
    return false;
  };

  $scope.vote = function(condo) {
    var vote = {
      'condo_id': condo.condo_id,
      'user_id': store.get('user_id')
    };
    $http.post(baseurl + 'vote', vote).success(function(res, req) {
      if (res.status === 2) {
        console.log('voted');
      } else if (res.status === 1) {
        console.log('already voted');
      }
    }).error(function(err) {
      console.log(err);
    });
  };

});
