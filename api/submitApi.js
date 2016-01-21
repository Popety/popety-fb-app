var http = require('http');

var cfg = require('../config');
var db = cfg.connection;


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
      console.log("err:",err);      
      res.status(500);
      res.jsonp({
        "status": 500,
        "message": "Internal Server Error"
      });
    }else {

      var responsedata = {
        status: true,
        record: rows,
        condo_id: rows.insertId,
        message: 'Condo Added successfully'
      }
      //res.jsonp(responsedata);

      var query1 = "INSERT INTO fb_condo_images ( condo_id,images, created_on) VALUES ('"+responsedata.condo_id+"','"+req.body.attachmentfile+"',"+cfg.timestamp()+")";
      db.query(query1, function (error,result) {
        
        res.jsonp(result);
      });
    }
  });
};

exports.getallcondolist = function (req, res) {
  var query1 = "SELECT fb_condo_list.condo_id,fb_condo_list.name,fb_condo_list.condo_name,fb_condo_images.images,fb_condo_images.image_id FROM fb_condo_list INNER JOIN fb_condo_images ON fb_condo_list.condo_id = fb_condo_images.condo_id";
  db.query(query1, function (err, rows) {
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

exports.getcondolistbyalphabet = function (req, res) {
  /*var query1 = "SELECT fb_condo_list.condo_id,fb_condo_list.name,fb_condo_list.condo_name,fb_condo_images.images,fb_condo_images.image_id FROM fb_condo_list INNER JOIN fb_condo_images ON fb_condo_list.condo_id = fb_condo_images.condo_id";
  db.query(query1, function (err, rows) {
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
  });*/
};