angular.module('popetyfbapp')

.controller('submitController', function($scope, $http, $timeout, $sce, $state, store) {

  var loader = $("#loader-div");
  var filePopup = $("#file-popup");

  $scope.filenames = [];
  $scope.isFile = false;
  console.log($scope.isFile);
  $scope.userName = store.get('user_name');
  $scope.user_id = store.get('user_id');
  $scope.baseurl = baseurl + 'uploadFile';

  $scope.add = function (files, events, flow) {
    console.log(files);
    console.log(flow.files.length);
    console.log(flow);
    if(flow.files.length > 3){
      $scope.isFile = true;
    }else {
      $scope.isFile = false;
    }
    console.log($scope.isFile);
  };

  $scope.upload_1 = function (flow) {
    loader.fadeIn(200);
  };

  $scope.fileSuccess = function (flow, condodata) {
    async.each(flow.files, function (file, callback) {
      $scope.filenames.push({
        'name': file.name
      });
      callback();
    }, function (err) {
      if(err){
        console.log('error while adding the file name');
      }else {
          console.log($scope.filenames);
          var condoinfo = {
            user_name: store.get('user_name'),
            user_id: store.get('user_id'),
            mobile_no: condodata.mobile_no,
            bedroom: $scope.bedroomdata.selectedOption.name,
            condo_name: condodata.condo_name,
            fileNames: $scope.filenames
          };
          console.log(condoinfo);

          $http.post(baseurl + 'condosubmit', condoinfo).success(function(res, req) {
            console.log(res);
            if (res.status == 1) {
              $scope.condosuccessmsg = 'Condo Successfully Added.';
              $scope.showcondosuccessmsg = true;
              $timeout(function() {
                $scope.showcondosuccessmsg = false;
              }, 3000);
              document.getElementById("condofrm").reset();
              $scope.imagefiles = {};
              loader.hide();
              $state.go('tab.gallery');
            } else {
              $scope.submit_err_msg = "Condo Failed To Insert";
              $scope.showsubmit_err_msg = true;
              $timeout(function() {
                $scope.showsubmit_err_msg = false;
              }, 3000);
              loader.hide();
            }
          }).error(function(err) {
            loader.hide();
            console.log('Connection Problem..');
          });
      }
    });
  };

  $scope.bedroomdata = {
    availableOptions: [{
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
    }],
    selectedOption: {
      id: '1',
      name: 'Number Of Bedrooms'
    } //This sets the default value of the select in the ui
  };

  $http.get(baseurl + 'condoList').success(function(res, req) {
    if (res.length > 0) {

      var condos = res;
      $scope.Allcondo = res;

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
    console.log($scope.imagefiles);
    if (valid) {
      if ($scope.imagefiles.length < 4) {
        $scope.imagelimitmsg = 'Please Upload 4 Images';
        $scope.showimagelimitmsg = true;
        $timeout(function() {
          $scope.showimagelimitmsg = false;
        }, 3000);
      } else {
        loader.fadeIn(200);
        var condoinfo = {
          user_name: store.get('user_name'),
          user_id: store.get('user_id'),
          mobile_no: condodata.mobile_no,
          bedroom: $scope.bedroomdata.selectedOption.name,
          condo_name: condodata.condo_name,
          attachmentfile: $scope.imagefiles
        };

        $http.post(baseurl + 'condosubmit', condoinfo).success(function(res, req) {
          if (res.status == 1) {
            $scope.condosuccessmsg = 'Condo Successfully Added.';
            $scope.showcondosuccessmsg = true;
            $timeout(function() {
              $scope.showcondosuccessmsg = false;
            }, 3000);
            document.getElementById("condofrm").reset();
            $scope.imagefiles = {};
            loader.hide();
            $state.go('tab.gallery');
          } else {
            $scope.submit_err_msg = "Condo Failed To Insert";
            $scope.showsubmit_err_msg = true;
            $timeout(function() {
              $scope.showsubmit_err_msg = false;
            }, 3000);
            loader.hide();
          }
        }).error(function(err) {
          loader.hide();
          console.log('Connection Problem..');
        });
      }
    }

  };

  /**
   @function updateattachment
   @returns successful upload  message
   @author sameer vedpathak
   @initialDate
   */
  $scope.updateattachment = function(file_browse) {
    if(document.getElementById("file_browse1").files.length <= 10){
      angular.forEach(document.getElementById("file_browse1").files, function(file) {
        var fileDisplayArea = document.getElementById('fileDisplayArea');
        var newfile = file;
        var imageType = "image";

        if (newfile.type.match(imageType)) {
          var oFReader = new FileReader();
          oFReader.onload = function(oFREvent) {
            $scope.imagefiles.push({
              'image': oFReader.result
            });
            $scope.$apply();
          };
          oFReader.readAsDataURL(newfile);
        } else {
          $scope.filenotsupportmsg = "Please Select .jpeg Images Only";
          $scope.showfilenotsupportmsg = true;
          $timeout(function() {
            $scope.showfilenotsupportmsg = false;
          }, 3000);
        }
      });
    }else {
      filePopup.fadeIn(200);
    }
  };

  $scope.removeimage = function(img) {
    console.log(img);
    img.files.splice(1);
    console.log(img);
  };

  $scope.closePopup = function () {
    filePopup.hide();
  };

});
