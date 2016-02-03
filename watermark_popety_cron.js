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
var waterMarkFile = '/home/apps/popety-fb-app/public/images/';
var filePath = '/home/apps/popety-fb-app/temp/';
var uploadPath = '/home/apps/popety-fb-app/tmp/';
// var waterMarkFile = '/Users/nitin/Projects/popety-fb-app/public/images/';
// var filePath = '/Users/nitin/Projects/popety-fb-app/temp/';
// var uploadPath = '/Users/nitin/Projects/popety-fb-app/tmp/';
var cron = require('cron');
//var request = require('request');


// Five Minute Cron
var fiveMinuteCron = cron.job('0 */5 * * * *', function(){  
    var stoday = new Date();
    console.log(stoday.getTime());
});

fiveMinuteCron.start();