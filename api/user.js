var http = require('http');

var env = process.env.NODE_ENV || 'dev';
var cfg = require('../config/config.'+env);

var db = cfg.connection;
var CRUD = require('mysql-crud');

var userCrud = CRUD(db, 'user');

var response;

exports.register = function (req, res) {
  var user_data = req.body;
  userCrud.load({
    'user_email': user_data.email
  }, function (err, rows) {
    if(err){
      response = {
        'status': 0,
        'error': 'Internal Server Error'
      };
      res.jsonp(response);
    }else {
      if(rows.length === 1){
        response = {
          'status': 1,
          'user_id': rows[0].user_id,
          'error': 'Already Registered'
        };
        res.jsonp(response);
      }else if(rows.length === 0){
        userCrud.create({
          'user_email': user_data.email,
          'user_first_name': user_data.first_name,
          'user_last_name': user_data.last_name,
          'facebook_id': user_data.id,
          'gender': user_data.gender
        }, function (error, vals) {
          if(vals.affectedRows === 1){
            response = {
              'status': 2,
              'user_id': vals.insertId,
              'error': 'User Registered'
            };
            res.jsonp(response);
          }else {
            response = {
              'status': 0,
              'error': 'Internal Server Error'
            };
            res.jsonp(response);
          }
        });
      }
    }
  });
};
