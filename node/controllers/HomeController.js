var controllerFunc = require('./common');
var languageController = require('./language');

exports.Index = function(request, response){

    controllerFunc.renderPage(response, controllerFunc.matchLanguage(request.acceptsLanguages()), 'male', 'home/Index') ;

    
};
 

exports.Profile = function(request, response) {
    var user = request.session.passport.user;
    
    if (user.userid) {
        controllerFunc.renderPage(response, user.language, user.gender, 'home/Profile', user, 'home/NewUser');
    }
    else {
        controllerFunc.renderPage(response, user.language, user.gender, 'home/NewUser', user);
    }
}


exports.Home = function(request, response){
    var user = request.session.passport.user;
    
    if (user.userid) {
        controllerFunc.renderPage(response, user.language, user.gender, 'home/Home', user);
    }
    else {
        controllerFunc.renderPage(response, user.language, user.gender, 'home/NewUser', user);
    }
};


exports.SaveUser = function(request, response) {

    var curUser = request.session.passport.user;
    var newUser = request.body;

    for (var key in newUser) {
        curUser[key] = newUser[key];
    }

    var dbUser = require('../db/user/user');
    dbUser.saveUser(curUser, 
        err => 
        { 
            console.log(err);
            response.status(500);
        },
        data => { 
            request.session.passport.user = data;

            var texts = languageController.loadRes('./notifications/newUser.res', data.language, data.gender, data) ;

            var dbNotification = require('../db/user/notifications');
            dbNotification.sendNotification({
                userid: data.userid,
                title: texts.title,
                message: texts.message  
            },
            err => {
                console.log(err);
                response.redirect('/home');
            },
            data => {
                response.redirect('/home');
            })
           
        }
        );  

    
   
}

