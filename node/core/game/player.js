"use strict";

var dbCards = require('../../db/cards/cards');
var cardsUtils = require('./cards_utils');


var USER_STATUS = {
    IDLE: 0,
    WAITING: 1,
    CARD_SELECT: 2,
    READY: 3
};

const   PlayCardResult =  {
    OK: 0,
    MATCH_NOT_STARTED: 1,
    UNKNOWN_PLAYER : 2,
    INVALID_POS: 3,
    POS_TAKEN: 4
}


class TTPlayer {

    constructor (id, match, userData, sendMsgFunc) {
        this._id = id;
        this._match = match;
        this._data = userData;
        this._sendMsg = sendMsgFunc;
        this._cards = [];
        this._status = USER_STATUS.IDLE;
        this._score = 0;
        this._timeout = null;
        this._cardsToSet = 0;
    }


    sendMessage(msg, data){
        this._sendMsg(this._data, msg, data);
    }

    get status() {
        return this._status;
    }

    get id() {
        return this._id;
    }

    get score() {
        return this._score;
    }

    set score(val)  {
        this._score = val;
        this.sendMessage("score", this._score);
    }

    get timeout() {
        return this._timeout;
    }

    set timeout(val) {
        this._timeout = val;
    }


    reqCards(count) {
        if (this._cards.length < count) {
            this.sendMessage("cardsReq", { type: this._match.type, count});
            this._cardsToSet = count;
            this._status = USER_STATUS.CARD_SELECT;
        }
    }

    setCards(cards) {
        
        if (cards.length < this._cardsToSet) {
            this._cards = [];
            this.reqCards();    
        }
        else {

            dbCards.listUsersCardsById(this._id, cards, 
                _err => {
                    this.sendMessage("error", {src: "cardsReq", code: 1, msg: _err});
                },
                _data => {
                    if (_data.length < this._cardsToSet) {
                        this._cards = [];
                        this.sendMessage("error", {src: "cardsReq", code: 2, msg:"these are not your cards!"});
                        this.reqCards();
                    }
                    else {
                        this._cards = _data;
                        this._status = USER_STATUS.WAITING;
                        this._match.playerReady(this._id);
                    }
                }
            )
          
        }
    }

    handleMsg(msg) {
        switch(msg.header.msg) {
            case "cardsRes":
                this.setCards(msg.data);
                break;

            case "ready":
                this.playerIsReady();
                break;

            case "playCard":
                this.playCard(msg.data);
                break;
        }
    }

    checkCardInHand(card) {
        for (var i = 0; i < this._cards.length; i++) {
            if (cardsUtils.equals( this._cards[i], card)) {
                return true;
            }
        }
        return false;
    }

    playCard(play) {
        if (this._match) {
        
            if (checkCardInHand(play.card)) {
                switch( this._match.playCard(this, play.card, play.x, play.y) ) {
                    case PlayCardResult.OK:
                        this.sendMessage("playCardRes", "ok");
                        break;

                    case PlayCardResult.MATCH_NOT_STARTED:
                        this.sendMessage("error", {src: "playCard", code: 3, msg:"this match has not started yet."});    
                        break;

                    case PlayCardResult.UNKNOWN_PLAYER:
                        this.sendMessage("error", {src: "playCard", code: 4, msg:"this player is not in a match."});    
                        break;

                    case PlayCardResult.INVALID_POS:
                        this.sendMessage("error", {src: "playCard", code: 5, msg:"this position is not valid."});    
                        break;
                    
                    case PlayCardResult.POS_TAKEN:
                        this.sendMessage("error", {src: "playCard", code: 6, msg:"this position is already taken."});    
                        break;
                }
            }
            else {
                this.sendMessage("error", {src: "playCard", code: 1, msg:"you do not have this card in your hand."});
            }
        } else {
            this.sendMessage("error", {src: "playCard", code:2, msg:"you are not in match."});
        }

    }

    startMatch() {
        this.sendMessage("startMatch", "");
    }

    matchFinished() {
        this._match = null;
        this._player = null;
        this.sendMessage("matchFinished", "");

        this._data.session.user.match = null;
        this._data.session.user.player = null;

        this._data.connection.close();
    }

    playerIsReady() {
        if (this._match) {
            this._match.playerStarted(this._id);
        }
    }

    otherTurn(who) {
        this.sendMessage("otherTurn", who);
    }

    yourTurn() {
        this.sendMessage("yourTurn", "");
    }

    removeCardFromHand(card) {
        var pos = -1;
        for (var i = 0; i < this._cards.length; i++) {
            if (cardsUtils.equals( this._cards[i], card)) {
                pos = i;
            }
        }

        if (pos >= 0) {
            this._cards.splice(pos, 1);
        }
    }


   flipCard(x, y, from, to) {
        if (from == this._id) {
            this.sendMessage("lostCard", {x, y, to});
        } else if (to == this._id) {
            this.sendMessage("gainedCard", {x, y, from});
        } else {
            this.sendMessage("flipCard", {x, y, from, to});
        }

   }

   abandoned() {
        this._data.session.user.match = null;
        this._data.session.user.player = null;
       //TODO
   }

   victory(myCards) {
        this.sendMessage("victory", myCards);
   }

   lost(winnerId) {
        this.sendMessage("lost", winnerId);
   }

   tie(players, myCards) {
        this.sendMessage("tie", {players, myCards});
   }

   timeoutOccured() {
    this.sendMessage("error", {src: "none", code: 1, msg: "timeout"});
   }

}

module.exports = {TTPlayer:TTPlayer};