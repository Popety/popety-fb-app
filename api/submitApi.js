var http = require('http');

var cfg = require('../config');
var db = cfg.connection;
var async = require("async");



exports.condoList = function (req, res) {
  var query = "select unit_name from srx_condo_details";
  db.query(query, function (err, rows) {
    if(err){
      // No user with this name exists, respond back with a 401
      res.status(500);
      res.jsonp({
        "status": 500,
        "message": "Internal Server Error"
      });
    }else {
        res.jsonp(rows);
    }
  });
};


exports.condosubmit = function (req, res) {
  var query = "INSERT INTO fb_condo_list( name , mobile_no, condo_name, bedroom, created_on, edited_on) VALUES ('"+req.body.name+"',"+req.body.mobile_no+",'"+req.body.condo_name+"',"+req.body.bedroom+","+cfg.timestamp()+","+cfg.timestamp()+")";
  db.query(query, function (err, rows) {
    if(err){
      //console.log("err:",err);      
      res.status(500);
      res.jsonp({
        "status": 500,
        "message": "Internal Server Error"
      });
    }else {
       
        async.each( req.body.attachmentfile , function(item, callback){
          var query1 = "INSERT INTO fb_condo_images ( condo_id,images, created_on) VALUES ('"+rows.insertId+"','"+item+"',"+cfg.timestamp()+")";
          db.query( query1, function(err, images) {
            if(!err){
            
              var response = {
                status : 1,
                message : 'Image Upload successfully.'
              }
              
              
            }else{
              var response = {
                status : 0,
                message : 'INTERNAL ERROR condo information.'
              }
             
            }
            callback();
          });
        },
        function(err){
          if(!err){
             var response = {
                status : 1,
                message : 'Image Upload successfully.'
              }
            res.jsonp(response);
          }else{
            var response = {
              status : 0,
              message : 'INTERNAL ERROR in Image Upload.'
            }
            res.jsonp( response );
          }
       });

    }
  });
};
