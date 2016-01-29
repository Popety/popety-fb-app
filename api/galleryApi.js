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
  console.log(req.body);

  if(req.body.condo_last_id)
  {
    var conditionpart = "condo_id < "+req.body.condo_last_id+" ORDER BY condo_id DESC";
  }else
  {
    var conditionpart = "condo_id > "+req.body.condo_prev_id+" ORDER BY condo_id ASC";
  }

  var condo_list_query = " SELECT * FROM fb_condo_list WHERE "+conditionpart+" LIMIT 6";
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

exports.getAlphaNumericCondoList = function (req, res) {
  //console.log(req.body);

  if(req.body.id==0){
    var where_part = "fb_condo_list.condo_name RLIKE '^[0-9]'";
  }
  else
  {
    var where_part = "fb_condo_list.condo_name LIKE '"+req.body.letter+"%'";
  }
  if(req.body.pageno == 0)
  {
    var limit_part = "LIMIT 0,6";
  }
  if(req.body.pageno>0)
  {
    req.body.pageno = parseInt(req.body.pageno)*6;
    var limit_part = "LIMIT "+req.body.pageno+",6"; 
  }
  db.query("SELECT COUNT(condo_id) as all_letter_condos FROM fb_condo_list WHERE "+where_part , function(err , countrow){
      console.log(countrow[0].all_letter_condos);
      var condo_list_query = "SELECT * FROM fb_condo_list WHERE "+where_part+" ORDER BY fb_condo_list.condo_name desc "+limit_part;
      console.log(condo_list_query);
      db.query(condo_list_query , function(err , rows){
        if(err){
          res.status(500);
          res.jsonp({
            "status":500,
            "message": "Internal Server Error"
          });
        }else{
            //console.log(rows);
            var data=[];
            async.each( rows , function(item, callback){
              var condoimagedata="SELECT image_id, images, condo_id FROM fb_condo_images where condo_id = "+item.condo_id+" LIMIT 1";
              //console.log(condoimagedata);
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
                var response = {
                  status : 1,
                  message : 'Success.',
                  condolist: data,
                  letter_total_condos:countrow[0].all_letter_condos,
                }
                res.jsonp( response );
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
  })

};