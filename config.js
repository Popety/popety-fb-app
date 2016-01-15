//for database connection
var mysql = require('mysql');

config.connection = mysql.createConnection({
  host     : 'n2.transparent.sg',
  user     : 'transparent',
  password : '10gXWOqeaf',
  database : 'transparent'
});

module.exports = config;
