//for database connection
var mysql = require('mysql');
var config = module.exports = {};

config.port = 9999;

config.connection = mysql.createPool({
    host: 'n2.transparent.sg',
    user: 'transparent',
    password: '10gXWOqeaf',
    database: 'photocontest'
});

config.timestamp = function() {
    var UTCtimestamp = new Date();
    return UTCtimestamp.getTime();
};
