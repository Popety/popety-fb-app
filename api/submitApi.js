var http = require('http');
// Require our module dependencies

var exec = require('child_process').exec;
var im = require('imagemagick');

var fs = require('fs-extra');

var flow = require('./flow-node.js')('tmp');
var util = require('util');
var mime = require('mime');

var env = process.env.NODE_ENV || 'dev';
var cfg = require('../config/config.' + env);

var db = cfg.connection;
var async = require("async");

var CRUD = require('mysql-crud');

var galleryCrud = CRUD(db, 'fb_condo_images');

var response;
// var waterMarkFile = '/home/apps/popety-fb-app/public/images/';
// var filePath = '/home/apps/popety-fb-app/temp/';
// var uploadPath = '/home/apps/popety-fb-app/tmp/';
var waterMarkFile = '/Users/nitin/Projects/popety-fb-app/public/images/';
var filePath = '/Users/nitin/Projects/popety-fb-app/temp/';
var uploadPath = '/Users/nitin/Projects/popety-fb-app/tmp/';

function decodeBase64Image(dataString, callback) {
  var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
    response = {};
  if (matches.length !== 3) {
    return new Error('Invalid input string');
  }
  response.type = matches[1];
  response.data = new Buffer(matches[2], 'base64');
  callback(response);
}

function watermark(imageData, callback) {
  // decodeBase64Image(imageData.image, function(result) {
    // var filename = Math.floor((Math.random() * 999999999999) + 1) + '.png';
    // fs.writeFile(filePath + "" + filename, result.data, function(error) {
    //   // fs.writeFile("/Users/nitin/Projects/popety-fb-app/temp/"+filename, result.data, function(error) {
    //   if (error) {
    //     response = {
    //       status: 0,
    //       message: 'INTERNAL SERVER ERROR'
    //     };
    //     callback(response);
    //   } else {
        // var newFile = filePath + "" + 'new_' + Math.floor((Math.random() * 99999999999) + 1)+'.png';
        // var command = [
        //   'composite',
        //   '-dissolve', '90%',
        //   '-gravity', 'center',
        //   '-quality', 100,
        //   waterMarkFile + 'watermark.png',
        //   uploadPath + imageData.name,
        //   newFile
        // ];
        // Join command array by a space character and then execute command
        // exec(command.join(' '), function(err, stdout, stderr) {
        //   if (err) {
        //     response = {
        //       status: 0,
        //       message: 'INTERNAL SERVER ERROR'
        //     };
        //     callback(response);
        //   } else {
            im.identify(uploadPath + imageData.name, function(err, features){
              if (err) {
                response = {
                  status: 0,
                  message: 'INTERNAL SERVER ERROR 77'
                };
                callback(response);
              }else {
                var height = features.height;
                var width = features.width;
                var type, diffwidth, diffheight;
                var newThumb = filePath +'thumb_'+Math.floor((Math.random() * 9999999999) + 1)+'.png';

                diffwidth = width / 360;
                diffheight = height / diffwidth;

                im.resize({
                  srcPath: uploadPath + imageData.name,
                  dstPath: newThumb,
                  width: 360,
                  height: diffheight
                }, function(err, stdout, stderr){
                  if (err){
                    console.log(err);
                    response = {
                      status: 0,
                      message: 'INTERNAL SERVER ERROR 98'
                    };
                    callback(response);
                  }else {
                    var newFileData = fs.readFileSync(uploadPath + imageData.name).toString("base64");
                    var newThumbData = fs.readFileSync(newThumb).toString("base64");
                    callback({
                      'original': 'data:image/png;base64,'+newFileData,
                      'thumb': 'data:image/png;base64,'+newThumbData
                    });
                  }
                });
              }
            });
        //   }
        // });
    //   }
    // });
  // });
}

exports.condoList = function(req, res) {
  var query = "select unit_name from srx_condo_details";
  db.query(query, function(err, rows) {
    if (err) {
      // No user with this name exists, respond back with a 401
      res.status(500);
      res.jsonp({
        "status": 500,
        "message": "Internal Server Error"
      });
    } else {
      res.jsonp(rows);
    }
  });
};

exports.uploadFile = function (req, res) {
  flow.post(req, function(status, filename, original_filename, identifier) {
    console.log('139 **********',req.body.flowChunkNumber, req.body.flowTotalChunks);
    if (status === 'done' && req.body.flowChunkNumber === req.body.flowTotalChunks) {
      var s = fs.createWriteStream(uploadPath + original_filename);
      flow.write(identifier, s, {end: true});
      s.on('finish', function () {
        res.status(200).send();
      });
    }else {
      res.status(200).send();
    }
  });
};

exports.condosubmit = function(req, res) {
  var query = "INSERT INTO fb_condo_list( user_id, user_name, mobile_no, condo_name, bedroom, created_on, edited_on) VALUES ('" + req.body.user_id + "','" + req.body.user_name + "'," + req.body.mobile_no + ",'" + req.body.condo_name + "','" + req.body.bedroom + "'," + cfg.timestamp() + "," + cfg.timestamp() + ")";
  db.query(query, function(err, rows) {
    if (err) {
      res.status(500);
      res.jsonp({
        "status": 500,
        "message": "Internal Server Error"
      });
    } else {
      async.each(req.body.fileNames, function(item, callback) {
        watermark(item, function(result) {
          if(result.status === 0){
            response = {
              status: 0,
              message: 'INTERNAL ERROR condo information.'
            };
            console.log(response);
          }else {
            galleryCrud.create({
              'condo_id': rows.insertId,
              'images': result.original,
              'thumb_images': result.thumb,
              'status': 0,
              'created_on': cfg.timestamp()
            }, function (error, vals) {
              if(vals.affectedRows === 1){
                response = {
                  status: 1,
                  message: 'Image Upload successfully.'
                };
                console.log(response);
              }else {
                response = {
                  status: 0,
                  message: 'INTERNAL ERROR condo information.'
                };
                console.log(response);
              }
            });
          }
          callback();
        });
      }, function(err) {
        if (!err) {
          response = {
            status: 1,
            message: 'Image Upload successfully.'
          };
          res.jsonp(response);
        } else {
          response = {
            status: 0,
            message: 'INTERNAL ERROR in Image Upload.'
          };
          res.jsonp(response);
        }
      });
    }
  });
};
