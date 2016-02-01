var env = process.env.NODE_ENV || 'dev';
var cfg = require('../config/config.'+env);

var db = cfg.connection;
var CRUD = require('mysql-crud');

var voteCrud = CRUD(db, 'user_votes');

var response;

exports.vote = function (req, res) {
  var voteData = req.body;
  voteCrud.load({
    'user_id': voteData.user_id,
    'condo_id': voteData.condo_id
  }, function (error, vals) {
    if(error){
      response = {
        'status': 0,
        'error': 'Internal Server Error'
      };
      res.jsonp(response);
    }else if(vals.length === 1){
      response = {
        'status': 1,
        'message': 'ALready Voted'
      };
      res.jsonp(response);
    }else if(vals.length === 0){
      voteCrud.create({
        'user_id': voteData.user_id,
        'condo_id': voteData.condo_id
      }, function (err, rows) {
        if(rows.affectedRows === 1){
          response = {
            'status': 2,
            'message': 'Voted'
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
  });
};

exports.checkVote = function (req, res) {
  var voteData = req.body;
  voteCrud.load({
    'user_id': voteData.user_id,
    'condo_id': voteData.condo_id
  }, function (error, vals) {
    if(error){
      response = {
        'status': 0,
        'error': 'Internal Server Error'
      };
      res.jsonp(response);
    }else if(vals.length === 1){
      response = {
        'status': false,
        'message': 'ALready Voted'
      };
      res.jsonp(response);
    }else if(vals.length === 0){
      response = {
        'status': true,
        'message': 'ALready Voted'
      };
      res.jsonp(response);
    }
  });
};
