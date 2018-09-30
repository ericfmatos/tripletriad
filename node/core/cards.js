var dbCards = require('../db/cards/cards');
var notificationHandler = require ('./notification');
var commons = require('./common');
var logger = require('./logger');
var languageController = require('./language');

module.exports = {

    //user, count, level, deckid
    createCards: function( data, err, done ) {
        dbCards.listCardsFromDeck(
            {
                level   : data.level,
                deck    : data.deckid
            },
            _err => err(_err),
            _res => {

                var user_cards = [];

                var card;
                var user_card;
                for (var i = 0; i < data.count; i++){
                    if (!_res.length) {
                        break;
                    }

                    //TODO check rarity
                    card = _res.splice(commons.randomInt (0, _res.length-1),1);
                    if (card && card.length && card[0]) {
                        card = card[0];
                        user_card = {
                            "userid"    : data.user.userid,
                            "cardid"    : card.cardid,
                            "numbers"   : [],
                            "data"      : {},
                            "card"      : card
                        };

                        user_card = setCardNumbers(user_card, card);
                        user_cards.push(user_card);
                    }
                
                }

                if (user_cards && user_cards.length) {
                    dbCards.addUserCards(
                        {   userid: data.user.userid, 
                            user_cards: user_cards
                        },
                        _errCard => err(_errCard),
                        _data => {
                            data.user.current_status = _data.status;
                            data.user.current_level  = _data.level;

                            done(user_cards);

                            logger.info(`${user_cards.length} cards of ${data.count} successfully created for user ${data.user.userid}`, {data, user_cards});

                            var formData = {
                                nickname: data.user.nickname,
                                cards: user_cards
                            };

                            var texts = languageController.loadRes('../resources/cardsEarned.res', data.user.language, data.user.gender, formData) ;
                            var notificationData = {
                                userid: data.user.userid,
                                title: texts.title,
                                message: texts.message,
                                level:  notificationHandler.LEVEL.SIGN + notificationHandler.LEVEL.POPUP + notificationHandler.LEVEL.EMAIL
                            };
                            notificationHandler.sendNotification(
                                notificationData,
                                _notErr => { logger.error(`could not send new cards notification to user ${data.user.userid}.`, {_notErr, notificationData, _data}); return true; }, 
                                _data => { }// do nothing
                            )

                        }
                    );
                }

                
            }
        );
    },


}



function  setCardNumbers(user_card, card) {

    var numbers = [];

    if (card.level <= 10) {
        numbers[0] = card.level <= 3 ? 3 : card.level;
        numbers[1] = card.level <= 2 ? 2 : commons.randomInt(card.level / 2, card.level - 1);
        numbers[2] = card.level <= 2 ? 1 : commons.randomInt(card.level / 2, card.level - 1);
        numbers[3] = card.level <= 2 ? 1 : commons.randomInt(card.level / 2, card.level - 2);

        for (var i = 0; i < 4; i ++) {
            user_card.numbers[i] = numbers.splice(commons.randomInt(0, numbers.length-1),1);
        }
    }  else {
        //TODO
    }

    return user_card;


}