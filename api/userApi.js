var http = require('http');

var env = process.env.NODE_ENV || 'dev';
var cfg = require('../config/config.'+env);

var db = cfg.connection;
var CRUD = require('mysql-crud');

var userCrud = CRUD(db, 'user');
var voteCrud = CRUD(db, 'user_votes');

var response;

// function getUserVotes(user_id, callback) {
//   voteCrud.load({
//     'user_id': user_id
//   }, function (err, vals) {
//     if(err){
//       response = {
//         'status': 0,
//         'error': 'Internal Server Error'
//       };
//       callback(response);
//     }else {
//       callback(vals);
//     }
//   });
// }

exports.register = function (req, res) {
  var userData = req.body;
  console.log('32',userData);
  if(userData.email){
    userCrud.load({
      'user_email': userData.email
    }, function (err, rows) {
      console.log('35', err);
      if(rows.length === 1){
          response = {
            'status': 1,
            'user_id': rows[0].user_id,
            'error': 'Already Registered'
          };
          res.jsonp(response);
      }else if(rows.length === 0){
        userCrud.create({
          'user_email': userData.email,
          'user_first_name': userData.first_name,
          'user_last_name': userData.last_name,
          'facebook_id': userData.id,
        }, function (error, vals) {
          console.log('64',error);
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
      }else {
        response = {
          'status': 0,
          'error': 'Internal Server Error'
        };
        res.jsonp(response);
      }
    });
  }else {
    response = {
      'status': 3,
      'error': 'No Email Address'
    };
    res.jsonp(response);
  }
};
