
var HomeController = require('./controllers/HomeController');
 


// Routes
module.exports = function(app, passport){

    var bodyParser = require('body-parser');
    app.use( bodyParser.json() );       // to support JSON-encoded bodies
    app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
      extended: true
    })); 
    

    //var authPassport = require('/config/passport')(passport);
    // Main Routes
     
    app.get('/', HomeController.Index);
    app.get('/other', HomeController.Other); 
    app.get('/profile', isLoggedIn,  HomeController.Profile);

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });


    app.post('/create_user', isLoggedIn, HomeController.SaveUser);

   // =====================================
    // GOOGLE ROUTES =======================
    // =====================================
    // send to google to do the authentication
    // profile gets us their basic information including their name
    // email gets their emails
    app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));
    
    // the callback after google has authenticated the user
    app.get('/auth/google/callback',
            passport.authenticate('google', {
                    successRedirect : '/profile',
                    failureRedirect : '/'
            }));
    
};


// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
    
        // if user is authenticated in the session, carry on
        if (req.isAuthenticated())
            return next();
    
        // if they aren't redirect them to the home page
        res.redirect('/');
    }
    