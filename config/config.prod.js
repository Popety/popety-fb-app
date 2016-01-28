//for database connection
var mysql = require('mysql');
var config = module.exports = {};

config.port = 4444;

config.connection = mysql.createConnection({
  host: 'apps.popety.com',
  user: 'photocontest',
  password: '101gXWOqeaf',
  database: 'photocontest'
});

config.timestamp = function() {
    var UTCtimestamp = new Date();
    return UTCtimestamp.getTime();
};
