var http = require('http');
// Require our module dependencies

var exec = require('child_process').exec;
var im = require('imagemagick');

var fs = require('fs-extra');

var flow = require('./flow-node.js')('tmp');
var util = require('util');

var neuron = require('neuron');
var mime = require('mime');

var env = process.env.NODE_ENV || 'dev';
var cfg = require('../config/config.' + env);

var db = cfg.connection;
var async = require("async");

var CRUD = require('mysql-crud');

var galleryCrud = CRUD(db, 'fb_condo_images');

var manager = new neuron.JobManager();
var response;

// var waterMarkFile = '/home/apps/popety-fb-app/public/images/';
// var filePath = '/home/apps/popety-fb-app/temp/';
// var uploadPath = '/home/apps/popety-fb-app/tmp/';
var waterMarkFile = '/Users/nitin/Projects/popety-fb-app/public/images/';
var filePath = '/Users/nitin/Projects/popety-fb-app/temp/';
var uploadPath = '/Users/nitin/Projects/popety-fb-app/tmp/';

/*
 * 1st Priority job before editing unit data
 * Removing the images
 */
manager.addJob('add-watermark-thumb', {
  work: function(imageData, done) {
    console.log('in add image job');
    var newFile = filePath + "" + 'new_' + Math.floor((Math.random() * 99999999999) + 1)+'.png';
    var command = [
      'composite',
      '-dissolve', '90%',
      '-gravity', 'center',
      '-quality', 100,
      waterMarkFile + 'watermark.png',
      imageData.src,
      newFile
    ];
    // Join command array by a space character and then execute command
    exec(command.join(' '), function(err, stdout, stderr) {
      if (err) {
        response = {
          status: 0,
          message: 'INTERNAL SERVER ERROR'
        };
        console.log(response);
      } else {
        im.resize({
          srcPath: imageData.src,
          dstPath: imageData.newThumb,
          width: 360,
          height: imageData.height
        }, function(err, stdout, stderr){
          if (err){
            console.log(err);
            response = {
              status: 0,
              message: 'INTERNAL SERVER ERROR 98'
            };
            console.log(response);
          }else {
            var newThumbData = fs.readFileSync(imageData.newThumb).toString("base64");
            galleryCrud.create({
              'image_id': imageData.image_id,
            }, {
              'thumb_images': 'data:image/png;base64,'+newThumbData
            }, function (error, vals) {
              console.log(error);
              if(vals.affectedRows === 1){
                result.jobData.image_id = vals.insertId;
                response = {
                  status: 1,
                  message: 'Image Upload successfully.'
                };
                console.log(response);
                manager.enqueue("add-watermark-thumb", result.jobData);
              }else {
                response = {
                  status: 0,
                  message: 'INTERNAL ERROR condo information.'
                };
                console.log(response);
              }
            });
            // callback({
            //   'original': 'data:image/png;base64,'+newFileData,
            //   'thumb': 'data:image/png;base64,'+newThumbData
            // });
          }
        });
      }
    });
  }
});

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

                var resizeData = {
                  'height': diffheight,
                  'newThumb': filePath +'thumb_'+Math.floor((Math.random() * 9999999999) + 1)+'.png',
                  'src': uploadPath + imageData.name
                };

                var newFileData = fs.readFileSync(uploadPath + imageData.name).toString("base64");
                callback({
                  'original': 'data:image/png;base64,'+newFileData,
                  'jobData': resizeData
                });
              }
            });
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
          console.log(result);
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
              // 'thumb_images': result.thumb,
              'created_on': cfg.timestamp()
            }, function (error, vals) {
              console.log(error);
              if(vals.affectedRows === 1){
                result.jobData.image_id = vals.insertId;
                response = {
                  status: 1,
                  message: 'Image Upload successfully.'
                };
                console.log(response);
                manager.enqueue("add-watermark-thumb", result.jobData);
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
