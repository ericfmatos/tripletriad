var controllerFunc = require('./common');
var languageController = require('../core/language');
var gameConfig = require('../config/game');
var logger = require('../core/logger')
var notificationHandler = require('../core/notification');
var sessionHandler = require('../session-control');

exports.Index = function(request, response){

    controllerFunc.renderPage(
        {
            request,
            response,
            language : controllerFunc.matchLanguage(request.acceptsLanguages()),
            pageName : 'home/Index'
        }
    );
        
};
 

exports.Profile = function(request, response) {
    var user = request.session.passport.user;
    
    var renderData = {
        request,
        response,
        pageName : user.userid ? 'home/Profile' : 'home/NewUser'
    }


    controllerFunc.renderPage(renderData);

}


exports.Home = function(request, response){
    var user = request.session.passport.user;
    sessionHandler.newSession({user, session:request.session});


    if (user.userid) {
        controllerFunc.renderPage(
            {
                request,
                response,
                pageName : 'home/Home'
            }
        );

        logger.info(`userid ${user.userid} nick ${user.nickname} logged on`, {user});

        if (!user.current_status) {
            var cardHandler = require('../core/cards');
            
            //user, count, level, deckid
            cardHandler.createCards({
                user      : user,
                count     : gameConfig.initialCards.count,
                level     : gameConfig.initialCards.level,
                deckid    : gameConfig.initialCards.deckid,
                minrarity : gameConfig.initialCards.rarity,
                maxrarity : gameConfig.initialCards.rarity,
            },
            _err => logger.critical(`could not create cards for userid ${user.userid}`, {_err, user}), 
            _cards => {
                // do nothing...
                } 
            );
        }

    }
    else {
        controllerFunc.renderPage(
            {
                request,
                response,
                language : user.language, 
                gender   : user.gender, 
                pageName : 'home/NewUser'
            }
        );
            
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

                var texts = languageController.loadRes('../resources/newUser.res', data.language, data.gender, data) ;
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

