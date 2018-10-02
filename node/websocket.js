module.exports = function(app, httpServer){

    var http = require('http');

    var port = 58082;
    var webSocketServer = require('websocket').server;

    /*var httpServer = http.createServer(function(request, response) {
        // Not important for us. We're writing WebSocket server,
        // not HTTP server
        console.log((new Date()) + ' Received request for ' + request.url);
        response.writeHead(404);
        response.end();
      });

    httpServer.listen(port, function() {
        console.log("web socket Server is listening on port "+ port);
    });*/

    var wsServer = new webSocketServer({
        httpServer: httpServer,
        autoAcceptConnections: false
    });


    var clients = [];

    
    function originIsAllowed(origin) {
    // put logic here to detect whether the specified origin is allowed.
        return true;
    }

    

    wsServer.on('request', function(request) {
        console.log((new Date()) + ' Connection from origin '
            + request.origin + '.');
        
        if (!originIsAllowed(request.origin)) {
            // Make sure we only accept requests from an allowed origin
            request.reject();
            console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
            return;
        }
        var connection = request.accept(null, request.origin);


        var index = clients.push(connection) - 1;
        console.log((new Date()) + ' Connection accepted.');
        // user sent some message
        
        connection.on('message', function(message) {
            if (message.type === 'utf8') { // accept only text
                console.log('Received Message: ' + message.utf8Data);
                connection.sendUTF(message.utf8Data);
            }
        });
        
        // user disconnected
        connection.on('close', function(connection) {
            console.log((new Date()) + " Peer "
                + connection.remoteAddress + " disconnected.");
            // remove user from the list of connected clients
            clients.splice(index, 1);
        });
    });
}