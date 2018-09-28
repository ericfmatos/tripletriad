var controllerFunc = require('./common');
var languageController = require('./language');
var gameConfig = require('../config/game');
var logger = require('../core/logger')
var notificationHandler = require('../core/notification');

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

        logger.info(`userid ${user.userid} nick ${user.nickname} logged on`, {user});

        if (!user.current_status) {
            var cardHandler = require('../core/cards');
            
            //user, count, level, deckid
            cardHandler.createCards({
                user    : user,
                count   : gameConfig.initialCards.count,
                level   : gameConfig.initialCards.level,
                deckid  : gameConfig.initialCards.deckid
            },
            _err => logger.critical(`could not create cards for userid ${user.userid}`, {_err, user}), 
            _cards => {
                // do nothing...
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
            response.status(500);
            logger.critical(`could not save user.`, {err, curUser});
        },
        data => { 
            request.session.passport.user = data;
            response.redirect('/home');
            if (isNew) {

                var texts = languageController.loadRes('../notifications/newUser.res', data.language, data.gender, data) ;
                notificationHandler.sendNotification({
                    userid: data.userid,
                    title: texts.title,
                    message: texts.message,
                    level: notificationHandler.LEVEL.SIGN + notificationHandler.LEVEL.POPUP + notificationHandler.LEVEL.EMAIL
                },
                    _notErr => { logger.error(`could not send welcome notification to user ${data.userid}.`, {_notErr, notificationData, data}); return true; }, 
                    _data => { }// do nothing
                );
            }
        }
        );  

    
   
}

