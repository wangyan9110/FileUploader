
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var file=require('./routes/file');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser({
    uploadDir:__dirname+'/public/temp'
}));
app.use(express.limit('5mb'));
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);
app.get('/file',file.index);
app.get('/file/index',file.index);
app.all('/file/uploader',file.uploader);

/*
var ndir = require('ndir');
var mod = require('express/node_modules/connect/node_modules/formidable');
var upload_path = path.join(path.dirname(__dirname), 'public/temp');
ndir.mkdir(upload_path, function (err) {
    if (err) {
        throw err;
    }
    mod.IncomingForm.UPLOAD_DIR = upload_path;
});*/

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
