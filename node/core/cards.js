var dbCards = require('../db/cards/cards');

module.exports = {

    //user, count, level, deckid
    setCardNumbers: function(user_card, card) {

        //user_card.numbers[0] = ;
    },



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
                    if (card) {

                        user_card = {
                            userid  : data.user.userid,
                            cardid  : card.cardid,
                            numbers : [],
                            data    : {}
                        };

                        this.setCardNumbers(user_card, card);
                        
                    }
                }
            }
        );
    },


}

function random(a,b) {
    return Math.random() + (b-a) + a;
}