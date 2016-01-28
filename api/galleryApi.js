var http = require('http');

var env = process.env.NODE_ENV || 'dev';
var cfg = require('../config/config.'+env);

var db = cfg.connection;
var async = require("async");


exports.getallcondolist = function (req, res) {
  var condo_list_query = "SELECT * FROM fb_condo_list  ORDER by fb_condo_list.condo_id desc LIMIT 6 ";
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
          var condoimagedata="SELECT image_id, images, condo_id FROM fb_condo_images where condo_id = "+item.condo_id+" LIMIT 1";
          console.log(condoimagedata);
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
  //console.log("query:",condo_list_query);
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

exports.getcondoimages = function(req,res){
  //console.log("req body:",req.body);
  var condo_images_query = " SELECT * FROM fb_condo_images where condo_id = "+req.body.condo_id+"";
    db.query(condo_images_query, function(error,rows){
      if(error){
          res.status(500);
          res.jsonp({
            "status":500,
            "message": "Internal Server Error"
          });
        }else{

            res.jsonp(rows);
        }
    });
}
