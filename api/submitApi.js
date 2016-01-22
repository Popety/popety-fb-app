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
 /* var query1 = "SELECT fb_condo_list.condo_id,fb_condo_list.name,fb_condo_list.condo_name,fb_condo_images.images,fb_condo_images.image_id FROM fb_condo_list INNER JOIN fb_condo_images ON fb_condo_list.condo_id = fb_condo_images.condo_id ORDER By fb_condo_list.condo_id DESC LIMIT 6";
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
  //var condo_list_query = "SELECT * FROM fb_condo_list ORDER by condo_id desc LIMIT 6";
  var condo_list_query = "SELECT * FROM fb_condo_list ORDER by condo_id desc LIMIT 6";
  db.query(condo_list_query , function(err , rows){
    if(err){
      res.status(500);
      res.jsonp({
        "status":500,
        "message": "Internal Server Error"   
      });
    }else{
      
        var data=[];
        async.each( rows , function(item, callback){
          var condoimagedata="SELECT image_id, images, condo_id FROM fb_condo_images where condo_id = "+item.condo_id+"";
          db.query( condoimagedata, function(err, condolist ) {
            if(!err){
              
                for (var i = 0; i < condolist.length; i++) {
                    item['condolist'] = condolist[i];
                    //condolist[i].condo_id=item.condo_id;
                };
              
              data.push(item);
              callback();
            }else{
              var response = {
                status : 0,
                message : 'INTERNAL ERROR condo information.'
              }
             
            }
          });
        },
        function(err){
          if(!err){
            res.jsonp( data );
          }else{
            var response = {
              status : 0,
              message : 'INTERNAL ERROR condo information.'
            }
            res.jsonp( response );
          }
       });

    }
    
  })
  
};

exports.nextprevcondolist = function (req, res) {
  if(req.body.condo_last_id)
  {
    //console.log("condo_last_id");
    var conditionpart = "condo_id < "+req.body.condo_last_id+" ORDER BY condo_id DESC";   
  }else
  {
    //console.log("condo_prev_id");
    var conditionpart = "condo_id > "+req.body.condo_prev_id+" ORDER BY condo_id ASC";
  
  }
  
  var condo_list_query = " SELECT * FROM fb_condo_list WHERE "+conditionpart+" LIMIT 6";
  console.log("query:",condo_list_query);
  db.query(condo_list_query , function(err , rows){
    if(err){
      res.status(500);
      res.jsonp({
        "status":500,
        "message": "Internal Server Error"   
      });
    }else{
      
        var data=[];
        async.each( rows , function(item, callback){
          var condoimagedata="SELECT image_id, images, condo_id FROM fb_condo_images where condo_id = "+item.condo_id+"";
          db.query( condoimagedata, function(err, condolist ) {
            if(!err){
              
                for (var i = 0; i < condolist.length; i++) {
                    item['condolist'] = condolist[i];
                };
              
              data.push(item);
              callback();
            }else{
              var response = {
                status : 0,
                message : 'INTERNAL ERROR to get condo information.'
              }
             
            }
          });
        },
        function(err){
          if(!err){
            res.jsonp( data );
          }else{
            var response = {
              status : 0,
              message : 'INTERNAL ERROR to get condo information.'
            }
            res.jsonp( response );
          }
       });

    }
    
  })
};
