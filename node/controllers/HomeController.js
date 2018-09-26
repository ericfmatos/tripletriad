var controllerFunc = require('./common');
var languageController = require('./language');
var gameConfig = require('../config/game');

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

        if (!user.status) {
            var cardHandler = require('../core/cards');
            
            //user, count, level, deckid
            cardHandler.createCards({
                user    : user,
                count   : gameConfig.initialCards.count,
                level   : gameConfig.initialCards.level,
                deckid  : gameConfig.initialCards.deckid
            },
            _err => console.log(_err),
            _cards => {
                    console.log(_cards);
                    user.status = 1; //TODO
                } 
            );
        }

    }
    else {
        controllerFunc.renderPage(response, user.language, user.gender, 'home/NewUser', user);
    }
};


exports.SaveUser = function(request, response) {
    
    var curUser = request.session.passport.user;
    var isNew = !curUser.userid;
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
            response.redirect('/home');
            if (isNew) {

                var texts = languageController.loadRes('./notifications/newUser.res', data.language, data.gender, data) ;

                var dbNotification = require('../db/user/notifications');
                dbNotification.sendNotification(
                    {
                        userid: data.userid,
                        title: texts.title,
                        message: texts.message  ,
                        level: 7 //notification sign, popup and email
                    },
                    err => {
                        console.log(err);
                    },
                    data => {}
                );
            }
        }
        );  

    
   
}

