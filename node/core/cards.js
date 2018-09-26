var dbCards = require('../db/cards/cards');

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

                    card = _res.splice(random(0, _res.length-1),1);
                    if (card && card.length && card[0]) {
                        card = card[0];
                        user_card = {
                            userid  : data.user.userid,
                            cardid  : card.cardid,
                            numbers : [],
                            data    : {}
                        };

                        user_card = setCardNumbers(user_card, card);
                        user_cards.push(user_card);
                    }
                }
                return done(user_cards);
            }
        );
    },


}

function random(a,b) {
    return Math.random() + (b-a) + a;
}


function  setCardNumbers(user_card, card) {

    var numbers = [];

    if (card.level <= 10) {
        numbers[0] = card.level <= 3 ? 3 : card.level;
        numbers[1] = card.level <= 2 ? 2 : random(card.level / 2, card.level - 1);
        numbers[2] = card.level <= 2 ? 1 : random(card.level / 2, card.level - 1);
        numbers[3] = card.level <= 2 ? 1 : random(card.level / 2, card.level - 2);

        for (var i = 0; i < 4; i ++) {
            user_card.numbers[i] = numbers.splice(random(0, numbers.length-1),1);
        }
    }  else {
        //TODO
    }

    return user_card;


}