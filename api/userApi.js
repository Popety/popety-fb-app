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
  userCrud.load({
    'user_email': userData.email
  }, function (err, rows) {
    if(err){
      response = {
        'status': 0,
        'error': 'Internal Server Error'
      };
      res.jsonp(response);
    }else {
      if(rows.length === 1){
        // getUserVotes(rows[0].user_id, function (result) {
        //   if(result.status === 0){
        //     res.jsonp(result);
        //   }else {
            response = {
              'status': 1,
              'user_id': rows[0].user_id,
              // 'vote_list': result,
              'error': 'Already Registered'
            };
            res.jsonp(response);
        //   }
        // });
      }else if(rows.length === 0){
        userCrud.create({
          'user_email': userData.email,
          'user_first_name': userData.first_name,
          'user_last_name': userData.last_name,
          'facebook_id': userData.id,
          'gender': userData.gender
        }, function (error, vals) {
          if(vals.affectedRows === 1){
            // getUserVotes(vals.insertId, function (result) {
            //   if(result.status === 0){
            //     res.jsonp(result);
            //   }else {
                response = {
                  'status': 2,
                  'user_id': vals.insertId,
                  'error': 'User Registered'
                };
                res.jsonp(response);
              // }
            // });
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
