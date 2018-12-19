const TTMatch = require('../core/game/match');
const TTPlayer = require('../core/game/player');
const TTNPC = require('../core/game/npc');

var  sendMsg = function(userData, msg, data) {
    userData.socket.sendGameMsg(userData, "tt", msg, data );
}

function startTutorial(data) {
    console.log('starting tutorial');
    
    var match =  new TTMatch("tutorial");
    data.session.user.match = match;
    
    var player1 = new TTPlayer(data.session.user.userid, match, data, sendMsg);
    data.session.user.player = player1;

    match.addPlayer(data.session.user.userid, player1);

    var player2 = new TTNPC(-1, match, data, sendMsg);
    match.addPlayer(-1, player2);
    //TODO Tutorial class.
}


function cannotStartGame(data, reason) {
    sendMsg(data, "error", {error: "cannot start game", code: 1, msg: reason});
}

function startGame(data, game){

    if (data.session.user.match) { //USER is in match
        cannotStartGame(data, "user is not idle");
    } else {
    
        switch (game) {
            case 'tutorial':
                startTutorial(data);
                break;
        }
    }

}

module.exports = {


    messageReceived(data, msg) {
        switch (msg.header.msg) {
            case "start":
                startGame(data, msg.data);
                break;
            default:
                if (data.session.user.player) {
                    data.session.user.player.handleMsg(msg);
                }
                break;
        }
    
    },

    closeAbrupt(data) {
        if (data.session.user.match && data.session.user.match instanceof TTMatch){
            data.session.user.match.closeAbrupt();
            data.session.user.match = null;
        }
        if(data.session.user.player) {
            data.session.user.player = null;
        }
    }
}