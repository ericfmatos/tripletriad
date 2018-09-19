var express = require('express');
var http = require('http');
var path = require('path');
var handlebars  = require('express-handlebars'), hbs;
var app = express();
 
app.set('port', 8081);
app.set('views', path.join(__dirname, 'views'));
 
var viewsDir =  path.join(__dirname, 'views');

const publicPath = path.join(__dirname, '../views');

hbs = handlebars.create({
   defaultLayout: 'main',
   layoutsDir   :  path.join(viewsDir, 'layouts')
});
 
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
 
app.use(express.static(path.join(__dirname, 'static')));


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

// send app to router
require('./router')(app);

