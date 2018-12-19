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
       sendMessage("cardsRes", $.map($(".card.toggled"), function(e){return e.dataset.id}));
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
                if (options && options.startMatch) {
                    options.startMatch();
                }
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
        start
    }
}