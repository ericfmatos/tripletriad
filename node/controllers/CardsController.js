var controllerFunc = require('./common');
var languageController = require('../core/language');
var dbNotification = require('../db/user/notifications');
var logger = require('../core/logger');
var dbCards = require('../db/cards/cards');


exports.Index = function(request, response) {
    dbCards.listDecks(
        _err => logger.error(`could not list decks`, {_err}),
        decks =>   controllerFunc.renderPage(
            {
                request,
                response,
                pageName : 'home/Decks',
                formData: { decks } 
            })
    );
}


exports.ListUserCardsFromDeck = function(request, response) {
    var deckid = request.query.deckid;
    var user = request.session.passport.user;
    if (user && deckid) {
        dbCards.listUserCardsFromDeck(
            { userid: user.userid, deckid },
            _err => logger.error(`could not list user ${user.userid} cards`, {user, _err}),
            user_cards =>   {  
                
                controllerFunc.renderPage(
                {
                    request,
                    response,
                    pageName : 'home/Cards',
                    formData: { user_cards },
                    isPartial: true
                }) ;
            }
        )
    }
    else {
        response.status(500);
    }
}

exports.RenderCards = function(request, response){
      
    controllerFunc.renderPage(
        {
            request,
            response,
            pageName : 'home/Cards',
            formData: { user_cards: request.body.cards },
            isPartial: true
        }) ;
}

exports.Index2 = function(request, response){
    
    // response, language, gender, pageName, formData, resFile, layout

    dbCards.listUserCards(
        user.userid, 
        _err => logger.error(`could not list user ${user.userid} cards`, {user, _err}),
        user_cards =>   {  
//            var cardRes = require('../resources/cardDisplay.res');
            
            controllerFunc.renderPage(
            {
                request,
                response,
                pageName : 'home/Cards',
                //formData : {cards:  user_cards.map(function(c){return `<li>${cardRes.drawSingleCard(c).card}</li>`}).join("") },
                formData: { user_cards } 
            }) ;
        }
    );

    
};
 