var express = require('express');
var http = require('http');
var path = require('path');
var passport = require('passport');
var handlebars  = require('express-handlebars'), hbs;

//handlebars.registerPartial(path.join(__dirname, 'views/partials'));

var app = express();
 
app.set('port', 8081);
app.set('views', path.join(__dirname, 'views'));
 
var viewsDir =  path.join(__dirname, 'views');

var session = require('express-session');

// required for passport session
app.use(session({
  secret: 'N4qu&14$',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));



const publicPath = path.join(__dirname, '../views');

hbs = handlebars.create({
   defaultLayout: 'main',
   layoutsDir   :  path.join(viewsDir, 'layouts'),
   partialsDir  :  path.join( viewsDir, 'partials')
});
 
//app.engine('handlebars', handlebars({partialsDir: path.join(__dirname, 'views/partials')}));

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
 
app.use(express.static(path.join(__dirname, 'static')));


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

const _passport = require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());
// send app to router
require('./router')(app, passport);

