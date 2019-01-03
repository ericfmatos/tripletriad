"use strict";
const TTPlayer = require('./player');


module.exports = class TTNPC extends TTPlayer{

    
    setCards(cards) {
        //TODO
        this._cards = cards;
        this._match.playerReady(this._id);
    }

    startMatch() {
        this._match.playerStarted(this._id);
    }

    reqCards(count) {
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

    matchFinished() {
        this._data.match = null;
        this._data.player = null;
    }


    otherTurn(who) {
        //do nothing
    }

    yourTurn() {
        //TODO play
    }

    cardPlayed(x, y, playerId, card ) {
        //TODO update my own internal board
    }


    lostCard(x, y){

    }

    ganiedCard(x, y){

    }

    flipCard(x, y, from, to) {
        if (from == this._id) {
            lostCard(x, y);
        } else if (to == this._id) {
            gainedCard(x,y);
        } else {
            //do nothing
        }

   }

   sendMessage(msg, data){
    //do nothing
    }

   abandoned() {
       //DO NOTHING
   }

    victory(myCards) {
    
    }

    lost(winnerId) {
        
    }

    tie(players, myCards) {
        
    }


}