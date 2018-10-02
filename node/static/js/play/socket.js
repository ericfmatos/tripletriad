var TTSocket = function(){

    var connection = null;

    function onConnectionOpen() {

    }

    function onConnectionClose(){

    }

    function  onConnectionError(error){

    }

    function sendMessage(msg) {
        connection.send(msg);
    }

    function onMessageReceived(message) {

    }


    var start = function() {
        window.WebSocket = window.WebSocket || window.MozWebSocket;
        connection = new WebSocket('ws://127.0.0.1:8081'); //TODO get real addr

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
        sendMessage
    }
}