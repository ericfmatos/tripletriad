"use strict";

var dbCards = require('../../db/cards/cards');

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
                    this.sendMessage("error", {src: "cardsReq", msg: _err});
                },
                _data => {
                    if (_data.length < CARDS_NUM) {
                        this._cards = [];
                        this.sendMessage("error", {src: "cardsReq", msg:"these are not your cards!"});
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
        }
    }

    startMatch() {
        this.sendMessage("startMatch", "");
    }

    matchFinished() {
        this._data.match = null;
        this._data.player = null;
        this.sendMessage("matchFinished", "");
    }

}