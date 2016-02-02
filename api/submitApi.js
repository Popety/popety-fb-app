var http = require('http');
// Require our module dependencies
var exec = require('child_process').exec;
var fs = require('fs-extra');

var util = require('util');
var mime = require('mime');

var env = process.env.NODE_ENV || 'dev';
var cfg = require('../config/config.' + env);

var db = cfg.connection;
var async = require("async");

var response;

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

function watermark(image, callback) {
  decodeBase64Image(image, function(result) {
    var filename = Math.floor((Math.random() * 999999999999) + 1) + '.png';
    fs.writeFile("/home/apps/popety-fb-app/temp/" + filename, result.data, function(error) {
      // fs.writeFile("/Users/nitin/Projects/popety-fb-app/temp/"+filename, result.data, function(error) {
      if (error) {
        response = {
          status: 0,
          message: 'INTERNAL SERVER ERROR'
        };
        res.jsonp(response);
      } else {
        var newFile = '/home/apps/popety-fb-app/temp/new_' + Math.floor((Math.random() * 9999) + 1) + filename;
        console.log(newFile);
        var command = [
          'composite',
          '-dissolve', '90%',
          '-gravity', 'center',
          '-quality', 100,
          '/home/apps/popety-fb-app/temp/watermark.png',
          '/home/apps/popety-fb-app/temp/' + filename,
          newFile
        ];
        // Join command array by a space character and then execute command
        exec(command.join(' '), function(err, stdout, stderr) {
          if (err) {
            response = {
              status: 0,
              message: 'INTERNAL SERVER ERROR'
            };
            callback(response);
          } else {
            var data = fs.readFileSync(newFile).toString("base64");
            var base64 = util.format("data:%s;base64,%s", mime.lookup(newFile), data);
            callback(base64);
          }
        });
      }
    });
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
      async.each(req.body.attachmentfile, function(item, callback) {
        watermark(item, function(result) {
          var query1 = "INSERT INTO fb_condo_images ( condo_id,images, created_on) VALUES ('" + rows.insertId + "','" + result + "'," + cfg.timestamp() + ")";
          db.query(query1, function(err, images) {
            if (!err) {
              response = {
                status: 1,
                message: 'Image Upload successfully.'
              };
            } else {
              response = {
                status: 0,
                message: 'INTERNAL ERROR condo information.'
              };
            }
            callback();
          });
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
