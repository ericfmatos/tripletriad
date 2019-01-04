var TTSocket = function(){

    var connection = null;
    var options = null;

    function onConnectionOpen() {
        if (options.onConnectionOpen) {
            options.onConnectionOpen();
        }
    }

    function onConnectionClose(){
        if (options.onConnectionClose) {
            options.onConnectionClose();
        }
    }

    function  onConnectionError(error){
        if (options.onConnectionError) {
            options.onConnectionError();
        }
    }

    function sendMessage(msg) {
        connection.send(msg);
    }

    function onMessageReceived(message) {
        if (options.onMessageReceived) {
            options.onMessageReceived(JSON.parse(message.data));
        }
    }



    var start = function(op, userid) {
        options = op;
        
        window.WebSocket = window.WebSocket || window.MozWebSocket;
        connection = new WebSocket(`ws://127.0.0.1:8081?userid=${userid}`); //TODO get real addr

        connection.onopen = function () {
            // connection is opened and ready to use
            console.log("open");
            onConnectionOpen();
        };

        connection.onclose = function (){ 
            console.log('close');
            onConnectionClose();
        }

        connection.onerror = function (error) {
            // an error occurred when sending/receiving data
            console.log("error");
            onConnectionError(error);
        };

        connection.onmessage = function (message) {
            console.log(message);
            onMessageReceived(message);
          };

   }

    return {
        start,
        sendMessage,

        
    }
}



var TTSocketPlay = function() {

    var userid = $("#userId").data("id");

    var matchData = {
        myScore : 5,
        otherScore : 5,
        cards: []
    };

    var mainSocket;

    var options;

    function sendMessage(msg, data) {
        mainSocket.sendMessage(JSON.stringify({
            header: {
                app:"tt",
                userid: userid,
                msg: msg
            },
            data: data
        }));
    }

    function cardsRequest() {
        var cards =  $(".card.toggled");
        sendMessage("cardsRes", $.map(cards, function(e){return e.dataset.id}));
        matchData.cards = cards;
    }

    function matchFinished() {
        disableMoveMyCards();
        //TODO
    }

    function disableMoveMyCards() {
        console.log('disable cards');
    }

    function otherTurn() {
        //show message
        disableMoveMyCards();
        console.log('show other  turn');
    }

    function enableMoveMyCards() {
        console.log('enable cards');
    }

    function myTurn() {
        //show message
        enableMoveMyCards();
        console.log('show my turn');
    }

    function flipCard(x, y, toMe) {
        //TODO
    }

    function updateScore() {
        console.log('update score '+ matchData.otherScore + 'x' + matchData.myScore );
    }

    function lostACard(x, y) {
        flipCard(x, y, false);
        matchData.otherScore++;
        matchData.myScore--;
        updateScore();
    }

    function gainedACard(x, y) {
        flipCard(x, y, true);
        matchData.otherScore--;
        matchData.myScore++;
        updateScore();
    }
    
    function displayVictory() {
        disableMoveMyCards();
        //TODO
    }

    function displayDefeat() {
        disableMoveMyCards();
        //TODO
    }

    function displayTie() {
        disableMoveMyCards();
        //TODO
    }

    function playACard(card, x, y) {
        sendMessage("playCard", {card, x, y});
    }

    function playerIsReady() {
        sendMessage("ready", {});
    }

    function matchIsAboutToStart(players) {
        if (options && options.startMatch) {

            var opponent  = null;
            for (var i = 0; i < players.length; i++) {
                if (players[i].id != userid) {
                    opponent = players[i];
                    break;
                }
            }

            options.startMatch(matchData.cards, opponent);
        }
        userid
                
            
    }

    function checkMsg(msg) {
        switch(msg.header.msg) {
            case "cardsReq":
                cardsRequest();
                break;

            case "error":
                console.log(msg.data);
                break;
                
            case "startMatch":
                matchIsAboutToStart(msg.data)    ;
                break;

            case "score":
                console.log("score: " + msg.data);
                break;

            case "playCardRes":
                console.log("cards played ok");
                break;

            case "matchFinished":
                matchFinished();
                break;

            case "otherTurn":
                otherTurn();
                break;

            case "yourTurn":
                myTurn();
                break;

            case "lostCard":
                lostACard(x, y);
                break;

            case "gainedCard":
                gainedACard(x,y);
                break;

            case "flipCard":
                //do nothing
                break;

            case "victory":
                displayVictory();
                break;

            case "lost":
                displayDefeat();
                break;

            case "tie":
                displayTie();
                break;
        }
    }

    var start = function(game, _options) {
        options = _options;

        mainSocket = TTSocket();
        mainSocket.start({
            onConnectionOpen: function() {
                sendMessage("start", "tutorial");
            },
            onConnectionClose:function() {
                matchFinished();
            },
            onConnectionError: function() {
                console.log("conn error");
            },
            onMessageReceived: function(msg) {
                checkMsg(msg);
            }
        }, userid);

        

    }
    return {
        start,
        playACard,
        playerIsReady
    }
}