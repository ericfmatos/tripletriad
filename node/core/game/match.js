"use strict";

const MAX_PLAYERS = 2;

module.exports = class TTMatch {

        

        constructor(type) {
            this._players = {};
            this._type = type;
            this._playersToGo = MAX_PLAYERS;
            this._turn = NaN;
            this._playersIds = [];
        }

        get type() {
            return this._type;
        }

        start(){
        }

        addPlayer(id, player) {
            if (Object.keys(this._players).length >= MAX_PLAYERS) {
                throw new Error("too many players already");
            }
            else {
                this._players[id] = player;
                this._playersIds.push(id);
                player.reqCards();
            }
        }

        playerReady(id) {
            if (this._players[id]) {
                this._playersToGo--;
            }

            if (this._playersToGo == 0) {
                this.startMatch();
            }
        }

        getPlayerOfTurn(){
            return this._players[ Object.keys(this._players)[this._turn]];
        }

        changeTurn() {
            if (this._turn >= MAX_PLAYERS) {
                this._turn = 0;
            }
            else {
                this._turn++;
            }
        }

        startMatch() {
            this._turn = 0;
            //TODO send msg to all players

            for (var i = 0; i < this._playersIds.length; i++) {
                this._players[this._playersIds[i]].startMatch();
            }
        }

        closeAbrupt() {
            //TODO
        }

}

