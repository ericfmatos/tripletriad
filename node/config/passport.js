// load all the things we need
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var logger = require('../core/logger');
// load up the user model
//var User       = require('../app/models/user');

// load the auth variables

var configAuth = require('./auth');

module.exports = function(passport) {

    

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
       done (null, id);
       /*
        User.findById(id, function(err, user) {
            done(err, user);
        });*/
    });

    // code for login (use('local-login', new LocalStategy))
    // code for signup (use('local-signup', new LocalStategy))
    // code for facebook (use('facebook', new FacebookStrategy))
    // code for twitter (use('twitter', new TwitterStrategy))

    // =========================================================================
    // GOOGLE ==================================================================
    // =========================================================================
    passport.use(new GoogleStrategy({

        clientID        : configAuth.googleAuth.clientID,
        clientSecret    : configAuth.googleAuth.clientSecret,
        callbackURL     : configAuth.googleAuth.callbackURL,

    },
    function(token, refreshToken, profile, done) {
//        return done(null, {profile:profile, token:token});

        // make the code asynchronous
        // User.findOne won't fire until we have all our data back from Google
        process.nextTick(function() {
            
            var dbUser = require('../db/user/user');
            dbUser.findUser(profile.id,
                err => { logger.critical(`could not find google user ${profile.id}`, { err, profile}) },
                res => {
                    if (!res) {
                        res = {
                            userid              : "",
                            name                : profile.displayName,
                            google_id           : profile.id,
                            email               : profile.emails[0].value,
                            google_token        : token,
                            gender              : profile.gender,
                            profile_photo_url   : profile.photos.length ? profile.photos[0].value : "",
                            language            : profile._json ? profile._json.language : ""
                            
                        };
                    }
                    return done(null, res);

                });


                    
        })
    }));

};

