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
        this._board = [
            [null, null, null],
            [null, null, null],
            [null, null, null],
        ];
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
        sendTurnToPlayers();
    }

    startMatch() {
        this._turn = 0;
        this._turnPlayerId = null;
        this._status = MatchStatus.STARTING;
        this._startCountdown = this._players.length;

        for (var i = 0; i < this._playersIds.length; i++) {
            var player = this._players[this._playersIds[i]];
            player.timeout = setTimeout(function(x){ whenTimedOut(i); }, TIMEOUT);
            player.startMatch();
        } 

            
    }

    playerStarted(whoId) {
        if ( this._players[whoId] && this._status == MatchStatus.STARTING) {
            var player = this._players[whoId];
            if (player.timeout) {
                clearTimeout(player.timeout);
            }
            this._startCountdown--;
        }
        if (this._startCountdown == 0) {
            this.allPlayersReady_StartMatch();
        }
    }

    sendTurnToPlayers() {
        for (var i = 0; i < this._playersIds.length; i++) {
            var player = this._players[this._playersIds[i]];
            player.timeout = setTimeout(function(x){ whenTimedOut(i); }, TIMEOUT);
            if (this._turn == i) {
                this._turnPlayerId = player.playerId;
                player.yourTurn();
            }
            else {
                player.otherTurn(player.id);
            }
        } 
    }

    allPlayersReady_StartMatch(){
        this._status = MatchStatus.GAME_ON;
        this.sendTurnToPlayers();
    }

    finish() {
        this._status = MatchStatus.FINISHED;
        for (var i = 0; i < this._playersIds.length; i++) {
            this._players[this._playersIds[i]].matchFinished();
        }
    }

    closeAbrupt() {
        this.finish();
    }

    whenTimedOut(who) {
        for (var i = 0; i < this._playersIds.length; i++) {
            this._players[this._playersIds[i]].timeout(who == i);
        }
        finish();
    }


    PlayCardResult =  {
        OK: 0,
        MATCH_NOT_STARTED: 1,
        UNKNOWN_PLAYER : 2,
        INVALID_POS: 3,
        POS_TAKEN: 4
    }


    playCard(player, card, x, y) {
        if (this._status != MatchStatus.GAME_ON) {
            return this.PlayCardResult.MATCH_NOT_STARTED; 
        }

        if (!this._players[player.id]) {
            return this.PlayCardResult.UNKNOWN_PLAYER; 
        }

        if (x < 0 || x > 2 || y < 0 || y > 2) {
            return this.PlayCardResult.INVALID_POS; 
        }

        var position = this._board[x][y];
        if (position) {
            return this.PlayCardResult.POS_TAKEN; 
        }

        this._board[y][x] = {player, card, x, y};
        player.removeCardFromHand(card);

        cardPlayed(x, y);
        
        var cellToCheck = null;

        //NMBERS: top, left, right, bottom.
        //TODO ELEMENTARS
        if (x > 0 && this._board[y][x-1]) {
            cellToCheck = this._board[y][x-1];

            if (cellToCheck.card.numbers[2] < card.numbers[1]) {
                flipCard(cellToCheck, player);
            }
        }

        if (x < 2 && this._board[y][x+1]) {
            cellToCheck = this._board[y][x+1];

            if (cellToCheck.card.numbers[1] < card.numbers[2]) {
                flipCard(cellToCheck, player);
            }
        }

        if (y > 0 && this._board[y-1][x]) {
            cellToCheck = this._board[y-1][x];

            if (cellToCheck.card.numbers[3] < card.numbers[0]) {
                flipCard(cellToCheck, player);
            }
        }

        if (y < 2 && this._board[y+1][x]) {
            cellToCheck = this._board[y+1][x];

            if (cellToCheck.card.numbers[0] < card.numbers[3]) {
                flipCard(cellToCheck, player);
            }
        }

    }

    cardPlayed(x, y) {
        var cell = this._board[y][x];//{player, card}
        for (var i = 0; i < this._playersIds.length; i++) {
            this._players[this._playersIds[i]].cardPlayed(x, y, cell.player.id, cell.card); 
        }

        //TODO check for end of game
        this.changeTurn();
    }

    flipCard(cell, newPlayer) {
        var oldPlayer = cell.player;
        oldPlayer.lostCard(cell.card, x, y);
        cell.player = newPlayer;
        newPlayer.gainCard(cell.card, x, y);
    }
}



