"use strict";
const TTPlayer = require('./player').TTPlayer


class TTNPC extends TTPlayer{

    
    setCards(cards) {
        //TODO
        this._cards = cards;
        this._match.playerReady(this._id);
    }

    startMatch() {
        this._board = [
            [null, null, null],
            [null, null, null],
            [null, null, null],
        ]; // {player, card, x, y}
        this._match.playerStarted(this._id);
    }

/*
userid: 63,
cardid:	2,
numbers:	[1,2,1,3],
data:	{},
card:{
    cardid:2,
    deckid:1,
    level:1,
    name:"Bite Bug",
    elementar:[],
    data:null,
    img:"TTBiteBug",
    rarity:0,
    deck:{
        deckid:1,
        name:"Final Fantasy VIII",
        data:null,
        folder:"ffviii",
        style:"ffviii"
    }
}
*/

    reqCards(count) {
        //TODO criar as cartas
        this.setCards([
            {
                userid: -1,
                cardid: 2,
                numbers: [1,2,3,4],
                data: {},
                card:{
                    cardid:2,
                    deckid:1,
                    level:1,
                    name:"Bite Bug",
                    elementar:[],
                    data:null,
                    img:"TTBiteBug",
                    rarity:0,
                    deck:{
                        deckid:1,
                        name:"Final Fantasy VIII",
                        data:null,
                        folder:"ffviii",
                        style:"ffviii"
                    }
                }
            },
            {
                userid: -1,
                cardid: 3,
                numbers: [1,2,3,4],
                data: {},
                card:{
                    cardid: 3,
                    data: null,
                    deck: {deckid: 1, name: "Final Fantasy VIII", data: null, folder: "ffviii", style: "ffviii"},
                    deckid: 1,
                    elementar: [],
                    img: "TTBlobra",
                    level: 1,
                    name: "Blobra",
                    rarity: 0
                }
            },
            {
                userid: -1,
                cardid: 5,
                numbers: [1,2,3,4],
                data: {},
                card:{
                    cardid:5,
                    deckid:1,
                    level:1,
                    name:"Caterchipillar",
                    elementar:[],
                    data:null,
                    img:"TTCaterchipillar",
                    rarity:0,
                    deck:{deckid:1,name:"Final Fantasy VIII",data:null,folder:"ffviii",style:"ffviii"}
                }
                
            },
            {
                userid: -1,
                cardid: 6,
                numbers: [1,2,3,4],
                data: {},
                card: {
                    cardid:6,
                    deckid:1,
                    level:1,
                    name:"Cockatrice",
                    elementar:[1],
                    data:null,
                    img:"TTCockatrice",
                    rarity:0,
                    deck:{deckid:1,name:"Final Fantasy VIII",data:null,folder:"ffviii",style:"ffviii"}
                }
            },
            {
                userid: -1,
                cardid: 7,
                numbers: [1,2,3,4],
                data: {},
                card:{
                    cardid:7,
                    deckid:1,
                    level:1,
                    name:"Fastitocalon F",
                    elementar:[2],
                    data:null,
                    img:"TTFastitocalonF",
                    rarity:0,
                    deck:{deckid:1,name:"Final Fantasy VIII",data:null,folder:"ffviii",style:"ffviii"}
                }
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
        //TODO play // for now, takes first card and places at first empty spot

        var card = this._cards[0];
        var spot = null;
        for (var y = 0; y < 3; y++) {
            for (var x = 0; x < 3; x++) {
                if (!this._board[y][x]) {
                    spot = {x, y};
                    break;
                }
            }
            if (spot) {
                break;
            }
        }
        if (spot && card) {
            this._match.playCard(this, card, spot.x, spot.y);
        }
    }

    cardPlayed(x, y, playerId, card ) {
        // update my own internal board
        this._board[y][x] = {card, playerId, x, y};
    }

    flipCard(x, y, from, to) {
        if (from == this._id) {
            this.lostCard(x, y, to);
        } else if (to == this._id) {
            this.gainedCard(x,y);
        } else {
            //do nothing
        }

   }

   lostCard(x, y, to){
        this._board[y][x].playerId = to;
   }

   gainedCard (x, y){
    this._board[y][x].playerId = this._id;
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

module.exports = {TTNPC:TTNPC};