var controllerFunc = require('./common');
var languageController = require('./language');
var dbNotification = require('../db/user/notifications');
var logger = require('../core/logger');
var dbCards = require('../db/cards/cards');

exports.Index = function(request, response){
    var user = request.session.passport.user;
    // response, language, gender, pageName, formData, resFile, layout
    dbCards.listUserCards(
        user.userid, 
        _err => logger.error(`could not list user ${user.userid} cards`, {user, _err}),
        user_cards =>   {  
            var cardRes = require('../resources/cardDisplay.res');
            
            controllerFunc.renderPage(
            {
                response,
                language : user.language, 
                gender   : user.gender, 
                pageName : 'home/Cards',
                formData : {cards:  user_cards.map(function(c){return `<li>${cardRes.drawSingleCard(c).card}</li>`}).join("") },
                layout   : 'LoggedOn'
            }) ;
        }
    );

    
};
 