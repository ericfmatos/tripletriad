"use strict";

var dbCards = require('../../db/cards/cards');
var cardsUtils = require('./cards_utils');


var USER_STATUS = {
    IDLE: 0,
    WAITING: 1,
    CARD_SELECT: 2,
    READY: 3
};


const CARDS_NUM = 5;

module.exports = class TTPlayer {



    constructor (id, match, userData, sendMsgFunc) {
        this._id = id;
        this._match = match;
        this._data = userData;
        this._sendMsg = sendMsgFunc;
        this._cards = [];
        this._status = USER_STATUS.IDLE;
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


    reqCards() {
        if (this._cards.length < CARDS_NUM) {
            this.sendMessage("cardsReq", this._match.type);
            this._status = USER_STATUS.CARD_SELECT;
        }
    }

    setCards(cards) {
        
        if (cards.length < CARDS_NUM) {
            this._cards = [];
            this.reqCards();    
        }
        else {

            dbCards.listUsersCardsById(this._id, cards, 
                _err => {
                    this.sendMessage("error", {src: "cardsReq", code: 1, msg: _err});
                },
                _data => {
                    if (_data.length < CARDS_NUM) {
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
                switch( this._match.playCard(this, play.card, play.X, play.Y) ) {
                    case this._match.PlayCardResult.OK:
                        this.sendMessage("playCardRes", "ok");
                        break;

                    case this._match.PlayCardResult.MATCH_NOT_STARTED:
                        this.sendMessage("error", {src: "playCard", code: 3, msg:"this match has not started yet."});    
                        break;

                    case this._match.PlayCardResult.UNKNOWN_PLAYER:
                        this.sendMessage("error", {src: "playCard", code: 4, msg:"this player is not in a match."});    
                        break;

                    case this._match.PlayCardResult.INVALID_POS:
                        this.sendMessage("error", {src: "playCard", code: 5, msg:"this position is not valid."});    
                        break;
                    
                    case this._match.PlayCardResult.POS_TAKEN:
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
        this._data.match = null;
        this._data.player = null;
        this.sendMessage("matchFinished", "");

        this._data.connection.close();
    }

    playerIsReady() {
        if (this._data.match) {
            this._data.match.playerStarted(this._id);
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

}