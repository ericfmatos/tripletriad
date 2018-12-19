var logger = require('../core/logger');
var controllerFunc = require('./common');
var dbCards = require('../db/cards/cards');

exports.Board = function(request, response) {
    var user = request.session.passport.user;
    if (user && user.userid) {
        controllerFunc.renderPage(
        {
            request,
            response,
            language : user.language, 
            gender   : user.gender, 
            pageName : 'play/Board',
            formData: { user } ,
            isPartial: true
        });
    }
}

exports.Tutorial = function(request, response){
    var user = request.session.passport.user;
    if (user && user.userid) {
        dbCards.listUserDecks(
            user.userid,
            _err => logger.error(`could not list user decks`, {_err}),
            decks =>    controllerFunc.renderPage(
                {
                    request,
                    response,
                    language : user.language, 
                    gender   : user.gender, 
                    pageName : 'play/Tutorial',
                    formData: { user, decks } 
                }
            )
        );
    }
    
};
 