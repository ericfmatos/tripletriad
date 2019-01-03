"use strict";
var fs = require('fs');
const MAX_PLAYERS = 2;

const MatchStatus = {
    WAITING_PLAYERS: 1,
    STARTING: 2,
    GAME_ON: 3,
    RESULTS: 4,
    FINISHED: 5
};

const TIMEOUT = 60000;
const MAX_CARDS_IN_GAME = 9;
const CARDS_PER_PLAYER = 5;

const   PlayCardResult =  {
    OK: 0,
    MATCH_NOT_STARTED: 1,
    UNKNOWN_PLAYER : 2,
    INVALID_POS: 3,
    POS_TAKEN: 4
}

class TTMatch {

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
        ]; // {player, card, x, y}
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
            player.reqCards(CARDS_PER_PLAYER);
        }
    }

    playerReady(id) {
        if (this._players[id]) {
            this._players[id].score = CARDS_PER_PLAYER;
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
        this.sendTurnToPlayers();
    }

    setTimeout(i) {
        var me = this;
        return setTimeout(function(x){ me.whenTimedOut(i); }, TIMEOUT);
    }

    startMatch() {
        this._turn = 0;
        this._turnPlayerId = null;
        this._status = MatchStatus.STARTING;
     
        this._startCountdown = this._playersIds.length;

        for (var i = 0; i < this._playersIds.length; i++) {
            var player = this._players[this._playersIds[i]];
            player.timeout = this.setTimeout(i);
            player.startMatch();
        } 

        

            
    }

    playerStarted(whoId) {
        if ( this._players[whoId] && this._status == MatchStatus.STARTING) {
            var player = this._players[whoId];
            if (player.timeout) {
                clearTimeout(player.timeout);
                player.timeout = null;
            }
            this._startCountdown--;
            player.score = CARDS_PER_PLAYER;
        }
        if (this._startCountdown == 0) {
            this.allPlayersReady_StartMatch();
        }
    }

    sendTurnToPlayers() {
        for (var i = 0; i < this._playersIds.length; i++) {
            var player = this._players[this._playersIds[i]];

            if (this._turn == i) {
                this._turnPlayerId = player.playerId;
                player.timeout = player.timeout = this.setTimeout(i);
                player.yourTurn();
            }
            else {
                player.otherTurn(player.id);
            }
        } 
    }

    allPlayersReady_StartMatch(){
        this._status = MatchStatus.GAME_ON;
        this._cardsInGame = 0;
        this.sendTurnToPlayers();
    }

    finish() {
        this._status = MatchStatus.FINISHED;
        for (var i = 0; i < this._playersIds.length; i++) {
            var player = this._players[this._playersIds[i]];
            if (player.timeout) {
                clearTimeout(player.timeout);
                player.timeout = null;
            }
            player.matchFinished();
            
        }
    }

    closeAbrupt(playerId) {
        if (this._players[playerId]) {
            var who = this._players[playerId];
            delete this._players[playerId];
            this.playerLeft(who);
        }
    }

    whenTimedOut(who) {
        var playerWhoLeft = null;
        for (var i = 0; i < this._playersIds.length; i++) {
            var player=  this._players[this._playersIds[i]];
            player.timeoutOccured(who == i); //naõ tá funcionando
            if (who == i) {
                playerWhoLeft = player;
            }
        }
        if (playerWhoLeft) {
            this.playerLeft(playerWhoLeft);
        }

    }

    playerLeft(player) {
        if (this._status == MatchStatus.GAME_ON) {
            if (player.timeout) {
                clearTimeout(player.timeout);
                player.timeout = null;
            }
            player.abandoned();
            this.finish();
        } else {
            delete this._players[player.id];
            this._playersIds = this._playersIds.filter(function(val, index) {
                return val != player.id;
            });

            if (this._players.count == 0) {
                this.finish();
            } else if (this._status == MatchStatus.STARTING) {
                this._playersToGo++;
                this._status = MatchStatus.WAITING_PLAYERS;
            }
        }
    }


  


    playCard(player, card, x, y) {
        if (this._status != MatchStatus.GAME_ON) {
            return PlayCardResult.MATCH_NOT_STARTED;
        }

        if (!this._players[player.id]) {
            return PlayCardResult.UNKNOWN_PLAYER; 
        }

        if (x < 0 || x > 2 || y < 0 || y > 2) {
            return PlayCardResult.INVALID_POS; 
        }

        var position = this._board[x][y];
        if (position) {
            return PlayCardResult.POS_TAKEN; 
        }

        this._board[y][x] = {player, card, x, y};
        player.removeCardFromHand(card);
        
        this.cardPlayed(x, y);

        var cellToCheck = null;

        //NMBERS: top, left, right, bottom.
        //TODO ELEMENTARS
        if (x > 0 && this._board[y][x-1]) {
            cellToCheck = this._board[y][x-1];

            if (cellToCheck.card.numbers[2] < card.numbers[1]) {
                this.flipCard(cellToCheck, player);
            }
        }

        if (x < 2 && this._board[y][x+1]) {
            cellToCheck = this._board[y][x+1];

            if (cellToCheck.card.numbers[1] < card.numbers[2]) {
                this.flipCard(cellToCheck, player);
            }
        }

        if (y > 0 && this._board[y-1][x]) {
            cellToCheck = this._board[y-1][x];

            if (cellToCheck.card.numbers[3] < card.numbers[0]) {
                this.flipCard(cellToCheck, player);
            }
        }

        if (y < 2 && this._board[y+1][x]) {
            cellToCheck = this._board[y+1][x];

            if (cellToCheck.card.numbers[0] < card.numbers[3]) {
                this.flipCard(cellToCheck, player);
            }
        }

    }

    cardPlayed(x, y) {
        var cell = this._board[y][x];//{player, card}
        for (var i = 0; i < this._playersIds.length; i++) {
            this._players[this._playersIds[i]].cardPlayed(x, y, cell.player.id, cell.card); 
        }
        this._cardsInGame++;

        //TODO check for end of game
        if (this._cardsInGame == MAX_CARDS_IN_GAME) {
            this.gameOver();
        }
        else {
            this.changeTurn();
        }
    }

    flipCard(cell, newPlayer) {
        var oldPlayer = cell.player;
        this.decPlayerScore(oldPlayer);
        cell.player = newPlayer;
        this.incPlayerScore(newPlayer);
        
        for (var i = 0; i < this._playersIds.length; i++) {
            this._players[this._playersIds[i]].flipCard(cell.x, cell.y, oldplayer.id, newPlayer.id); 
        }

    }

    decPlayerScore(player) {
        player.score--;
    }

    incPlayerScore(player) {
        player.score++;
    }

    gameOver() {
        this._status = MatchStatus.RESULTS;
        
        var winners =  this._players.sort((a, b) => a.score - b.score);

        var tie = [];
        var flag= true;
        var winnerScore = 0;
        for (var i = 0; i < winners.length; i++){
            var winner = winners[í];
            if (tie.length == 0) {
                tie.push(winner);
                winnerScore = winner.score;
            } else if (winner.score == winnerScore) {
                tie.push(winner);
            } else {
                break;
            }
        }

        switch (tie.length) {
            case 0:
                this.finish(); //NO ONE WINS
                break;
            case 1:
                this.victory(tie[0]);
                break;
            default:
                this.tie(tie);
                break;
        }


        switch (this._type) {
            case 'tutorial':
                this.finish();
                break;
        }

    }

    getPlayerCardsOnBoard(player) {
        var res = [];
        for (var y = 0; y < 3; y++) {
            for (var x = 0; x < 3; x++) {
                if (this._board[y][x].player.id == player.id) {
                    res.push(this._board[y][x].card);
                }
            }
        }
        return res;
    }

    victory(player) {
   

        player.victory(this.getPlayerCardsOnBoard(player));

     
        for (var i = 0; i < this._playersIds.length; i++) {
            var playerId = this._playersIds[i]; 
            if (playerId != player.id) {
                this._players[playerId].lost(player.id);
            }
        }        
    }
    
    tie (players) {
        playersIds = players.map(function(e) { return e.id});
        for (var i = 0; i < this._playersIds.length; i++) {
            var player = this._players[this._playersIds[i]]; 
            if (players.find(function(el, ix) {return el.id == player.id;}) >= 0) {
                player.tie(playersIds, this.getPlayerCardsOnBoard(player));
            } else {
                player.lost(playersIds);
            }
        }    
    }

}

module.exports = {TTMatch:TTMatch};

