var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var router = express.Router();
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

var app = express();

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));
// app.use(express.static(path.join(__dirname, 'mobile')));


// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}


app.use('/api', express.static(__dirname + '/api'));
app.use('/', express.static(__dirname + '/public'));
app.use('/temp', express.static(__dirname + '/temp'));

var submit = require('./api/submitApi');
var gallery = require('./api/galleryApi');
var user = require('./api/userApi');
var vote = require('./api/voteApi');

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//Submit Api
app.get('/api/condoList', submit.condoList);
app.post('/api/condosubmit', submit.condosubmit);
app.post('/api/uploadFile', multipartMiddleware, submit.uploadFile);

//Gallery Api
app.get('/api/getallcondolist',gallery.getallcondolist);
app.post('/api/nextprevcondolist',gallery.nextprevcondolist);
app.post('/api/getAlphaNumericCondoList',gallery.getAlphaNumericCondoList);
app.post('/api/getcondoimages',gallery.getcondoimages);

//User Api
app.post('/api/register', user.register);

//Vote Api
app.post('/api/vote', vote.vote);

app.post('/*', function(request, response) {
  response.redirect('/');
});

module.exports = app;
