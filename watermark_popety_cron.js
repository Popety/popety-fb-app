var http = require('http');
// Require our module dependencies

var exec = require('child_process').exec;
var im = require('imagemagick');

var fs = require('fs-extra');

var util = require('util');
var mime = require('mime');

var env = process.env.NODE_ENV || 'dev';
var cfg = require('./config/config.' + env);

var db = cfg.connection;
var async = require("async");

var CRUD = require('mysql-crud');

var galleryCrud = CRUD(db, 'fb_condo_images');

var response;
// var waterMarkFile = '/home/apps/popety-fb-app/public/images/';
// var filePath = '/home/apps/popety-fb-app/temp/';
// var uploadPath = '/home/apps/popety-fb-app/tmp/';

// var waterMarkFile = '/Users/nitin/Projects/popety-fb-app/public/images/';
// var filePath = '/Users/nitin/Projects/popety-fb-app/temp/';
// var uploadPath = '/Users/nitin/Projects/popety-fb-app/tmp/';

var waterMarkFile = '/home/transparent/popety-fb-app/public/images/';
var filePath = '/home/transparent/popety-fb-app/temp/';
var uploadPath = '/home/transparent/popety-fb-app/tmp/';

var cron = require('cron');

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

// Five Minute Cron
var fiveMinuteCron = cron.job('0 * * * * *', function(){
  console.log('cron started');
    galleryCrud.load({
      'status': 0,
    }, function (err, rows) {
      console.log(rows.length);
      console.log(err);
      if(err){
        response = {
          status: 0,
          message: 'INTERNAL SERVER ERROR 98'
        };
        console.log(response);
        callback();
      }else {
        async.each(rows, function (file, callback) {
          decodeBase64Image(file.thumb_images, function(result) {
            var filename = Math.floor((Math.random() * 999999999999) + 1) + '.png';
            fs.writeFile(filePath + filename, result.data, function(error) {
              if (error) {
                response = {
                  status: 0,
                  message: 'INTERNAL SERVER ERROR'
                };
                console.log(response);
                callback();
              } else {
                var newFile = filePath + 'new_' + Math.floor((Math.random() * 99999999999) + 1)+'.png';
                var command = [
                  'composite',
                  '-dissolve', '90%',
                  '-gravity', 'center',
                  '-quality', 100,
                  waterMarkFile + 'watermark.png',
                  filePath + filename,
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
                    callback();
                  } else {
                    var newThumbData = fs.readFileSync(newFile).toString("base64");
                    galleryCrud.update({
                      'image_id': file.image_id,
                    }, {
                      'thumb_images': 'data:image/png;base64,'+newThumbData,
                      'status': 1
                    }, function (err, rows) {
                      if(err){
                        response = {
                          status: 0,
                          message: 'INTERNAL SERVER ERROR 98'
                        };
                        console.log(response);
                      }else {
                        console.log('Successfully Watermarked the Image');
                      }
                      callback();
                    });
                  }
                });
              }
            });
          });
        }, function (err) {
          if(err){
            response = {
              status: 0,
              message: 'INTERNAL SERVER ERROR 98'
            };
            console.log(response);
          }else {
            console.log('Cron Successfully Done');
          }
        });
      }
    });
});

fiveMinuteCron.start();
