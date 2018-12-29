"use strict";

const MAX_PLAYERS = 2;

const MatchStatus = {
    WAITING_PLAYERS: 1,
    STARTING: 2,
    GAME_ON: 3,
    RESULTS: 4,
    FINISHED: 5
};

const TIMEOUT = 60000;

module.exports = class TTMatch {

        

        constructor(type) {
            this._players = {};
            this._type = type;
            this._playersToGo = MAX_PLAYERS;
            this._turn = NaN;
            this._playersIds = [];
            this._status = MatchStatus.WAITING_PLAYERS;
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
            this._status = MatchStatus.STARTING;

            for (var i = 0; i < this._playersIds.length; i++) {
                var player = this._players[this._playersIds[i]];
                player.timeout = setTimeout(function(x){ whenTimedOut(i); }, TIMEOUT);
                player.startMatch();
            } 

                
        }

        playerReady(who) {
            
        }

        finish() {
            this._status = MatchStatus.FINISHED;
            for (var i = 0; i < this._playersIds.length; i++) {
                this._players[this._playersIds[i]].matchFinished();
            }
        }

        closeAbrupt() {
            //TODO
        }

        whenTimedOut(who) {
            for (var i = 0; i < this._playersIds.length; i++) {
                this._players[this._playersIds[i]].timeout(who == i);
            }
            finish();
        }

}

