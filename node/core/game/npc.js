"use strict";
const TTPlayer = require('./player');


module.exports = class TTNPC extends TTPlayer{

    
    setCards(cards) {
        //TODO
        this._cards = cards;
        this._match.playerReady(this._id);
    }

    startMatch() {
        //TODO
    }

    reqCards() {
        //TODO criar as cartas
        this.setCards([
            {
                userid: -1,
                cardid: 2,
                numbers: [1,2,3,4],
                data: {}
            },
            {
                userid: -1,
                cardid: 3,
                numbers: [1,2,3,4],
                data: {}
            },
            {
                userid: -1,
                cardid: 4,
                numbers: [1,2,3,4],
                data: {}
            },
            {
                userid: -1,
                cardid: 5,
                numbers: [1,2,3,4],
                data: {}
            },
            {
                userid: -1,
                cardid: 6,
                numbers: [1,2,3,4],
                data: {}
            },
    
        ]);
    }
}