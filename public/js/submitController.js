angular.module('popetyfbapp')

.controller('submitController', function($scope, $http, $timeout, $sce, $state, $document) {


  this.tab = 1;
  $scope.active1 = true;
  $scope.active2 = false;
  $scope.active3 = false;
  this.setTab = function(tabId) {
    this.tab = tabId;
  };

  this.isSet = function(tabId) {
    if (tabId == 1)
      $scope.active1 = true;

    if (tabId == 2)
      $scope.active2 = true;

    if (tabId == 3)
      $scope.active3 = true;
    return this.tab === tabId;
  };

  $scope.bedroomdata = {
    availableOptions: [

      {
        id: '1',
        name: 'Number Of Bedrooms'
      }, {
        id: '2',
        name: 'Studio'
      }, {
        id: '3',
        name: '1-bedroom'
      }, {
        id: '4',
        name: '2-bedroom'
      }, {
        id: '5',
        name: '3-bedroom'
      }, {
        id: '6',
        name: '4-bedroom'
      }
    ],
    selectedOption: {
      id: '1',
      name: 'Number Of Bedrooms'
    } //This sets the default value of the select in the ui
  };

  $http.get(baseurl + 'condoList').success(function(res, req) {
    if (res.length > 0) {

      var condos = res;

      function suggest_condos(term) {
        var q = term.toLowerCase().trim(),
          results = [];
        var limit = 10;
        for (var i = 0; i < condos.length; i++) {
          var condo = condos[i];
          if (condo.unit_name.toLowerCase().indexOf(q) !== -1) {
            if (results.length == limit)
              break;
            results.push({
              value: condo.unit_name,
              // Pass the object as well. Can be any property name.
              obj: condo,
              label: $sce.trustAsHtml(
                '<div style="padding:0;" class="row">' +
                ' <div class="col-xs-5">' +
                '  <i class="fa fa-user"></i>' +
                '  <strong>' + condo.unit_name, term + '</strong>' +
                ' </div>' +
                ' <div class="col-xs-7 text-right text-muted">' +
                '  <small>' + condo.unit_name, term + '</small>' +
                ' </div>' +
                '</div>'
              )
            });
          }
        }
        return results;
      }

      $scope.ac_options_condos = {
        suggest: suggest_condos,
        on_select: function(selected) {
          $scope.selected_condo = selected.obj;
          console.log($scope.selected_condo);
        }
      };
    }
  }).error(function(err) {
    console.log(err);
  });

  /**
   @function condosubmit
   @returns success message
   @author sameer vedpathak
   @initialDate
   */

  $scope.condosubmit = function(condodata, valid) {

    if (valid && $scope.imagefiles != '') {
      if ($scope.imagefiles.length < 4) {
        $scope.imagelimitmsg = 'select more than 4 images';
        $scope.showimagelimitmsg = true;
        $timeout(function() {
          $timeout(function() {
            $scope.showimagelimitmsg = false;
          }, 3000);

        }, 2000);
      } else {
        var condoinfo = {
          name: "Harold french",
          mobile_no: condodata.mobile_no,
          bedroom: $scope.bedroomdata.selectedOption.name,
          condo_name: condodata.condo_name,
          attachmentfile: $scope.imagefiles
        }

        //console.log("condoinfo:",condoinfo);
        $http.post(baseurl + 'condosubmit', condoinfo).success(function(res, req) {
          $scope.condosuccessmsg = 'Condo Successfully Added.';
          $scope.showcondosuccessmsg = true;
          $timeout(function() {
            $timeout(function() {
              $scope.showcondosuccessmsg = false;
            }, 3000);
          }, 2000);
          document.getElementById("condofrm").reset();
          $scope.imagefiles = {};
        });

      }


    } else {
      $scope.imgcompulsorymsg = 'Images Compulsory';
      $scope.showimgcompulsorymsg = true;
      $timeout(function() {
        $timeout(function() {
          $scope.showimgcompulsorymsg = false;
        }, 3000);

      }, 2000);

    }

  };

  /**
   @function updateattachment
   @returns successful upload  message
   @author sameer vedpathak
   @initialDate
   */
  $scope.imagefiles = [];
  $scope.updateattachment = function(file_browse) {

    angular.forEach(document.getElementById("file_browse1").files, function(file) {

      var fileDisplayArea = document.getElementById('fileDisplayArea');
      var newfile = file;
      var imageType = "image";

      if (newfile.type.match(imageType)) {
        var oFReader = new FileReader();
        oFReader.onload = function(oFREvent) {
          $scope.imagefiles.push(oFReader.result);
          $scope.$apply();
        };
        oFReader.readAsDataURL(newfile);
      } else {
        //fileDisplayArea.innerHTML = "File not supported!"
        $scope.filenotsupportmsg = "Please Select .jpeg Images Only";
        $scope.showfilenotsupportmsg = true;
        $timeout(function() {
          $timeout(function() {
            $scope.showfilenotsupportmsg = false;
          }, 3000);
        }, 2000);
      }

    });
  };

  $scope.removeimage = function(img) {
    console.log($scope.imagefiles.indexOf(img));
    $scope.imagefiles.splice($scope.imagefiles.indexOf(img), 1);
  };

});
