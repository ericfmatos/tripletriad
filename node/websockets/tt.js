function sendMsg(session, msg, data) {
    session.socket.sendGameMsg(session, "tt", msg, data );
}

function startTutorial(session) {
    console.log('starting tutorial');
    session.session.user.liveStatus = 1; //STARTING
    sendMsg(session, "starting", "tutorial");
    //TODO Tutorial class.
}

function cannotStartGame(session, reason) {
    sendMsg(session, "error", {error: "cannot start game", code: 1, msg: reason});
}

function startGame(session, game){

    if (session.session.user.liveStatus != 0) { //USER is IDLE
        cannotStartGame(session, "user is not idle");
    } else {
    
        switch (game) {
            case 'tutorial':
                startTutorial(session);
                break;
        }
    }

}

module.exports = {


    messageReceived(session, msg) {
        switch (msg.header.msg) {
            case "start":
                startGame(session, msg.data);
                break;
            default:
                logger.warning("unknown message", jsonMessage);
                break;
        }
    
    }
}