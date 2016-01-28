//for database connection
var mysql = require('mysql');
var config = module.exports = {};

config.port = 9999;

config.connection = mysql.createConnection({
    host: 'n2.transparent.sg',
    user: 'transparent',
    password: '10gXWOqeaf',
    database: 'popety_fbapp'
});

config.timestamp = function() {
    var UTCtimestamp = new Date();
    return UTCtimestamp.getTime();
};
