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
