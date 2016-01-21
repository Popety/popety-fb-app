//for database connection
var mysql = require('mysql');

var config = {
  connection: mysql.createConnection({
                host     : 'n2.transparent.sg',
                user     : 'transparent',
                password : '10gXWOqeaf',
                database : 'transparent'
              }),

	timestamp: function() {
	  var UTCtimestamp = new Date();
	  return UTCtimestamp.getTime();
	}
};

module.exports = config;
