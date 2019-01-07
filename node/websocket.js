module.exports = function(app, httpServer){
    var http = require('http');
    var logger = require('./core/logger');
    var WebSocketServer = require('websocket').server;
    var passport = require('passport');
    var SessionHandler= require('./session-control');
    var TTWebSocket = require('./websockets/tt');

    var config = require('./config/server');
    var server = http.createServer(function(request, response) {
        // process HTTP request. Since we're writing just WebSockets
        // server we don't have to implement anything.
      });
      server.listen(config.webSocket.port, function() { }); //TODO read from config

    var wsServer = new WebSocketServer({
        httpServer: server
    });

    
    function originIsAllowed(origin, userid) {
        return SessionHandler.findSession(userid);
    }

    

    function runMessage(sessionData, jsonMessage) {

        if (jsonMessage.header) {

            if (jsonMessage.header.userid == sessionData.session.user.userid) {

                switch (jsonMessage.header.app) {
                    case "tt":
                        if (sessionData.protocol && sessionData.protocol != "tt") {
                            throw new Error(`cannot switch protocol from ${sessionData.protocol} to tt`);        
                        }
                        else {
                            sessionData.protocol = "tt";
                            return TTWebSocket.messageReceived(sessionData, jsonMessage);
                        }
                    default:
                        throw new Error(`invalid msg format. unknown app ${jsonMessage.header.app}`);    
                }
            } else {
                throw new Error("invalid msg. userid not the same as session");    
            }
        }
        else {
            throw new Error("invalid msg format. no header found");
        }
    }

    wsServer.sendGameMsg = function(sessionData, app, msg, data) {
        sessionData.connection.sendUTF(JSON.stringify({
            header: {
                app: app,
                userid: sessionData.session.session.userid,
                msg: msg
            },
            data: data
        }));
    }


    wsServer.on('request', function(request) {
        console.log((new Date()) + ' Connection from origin '
            + request.origin + '.');

        var userid = request.resourceURL.query.userid;
       
        var session = originIsAllowed(request.origin, userid);

        if (!session) {
            // Make sure we only accept requests from an allowed origin
            request.reject();
            console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
            return;
        }

        if (session.connection) {
            session.connection.close();
            session.connection = null;
        }

        var connection = request.accept(null, request.origin);
        session.connection = connection;
        
        var sessionData = { socket: this, connection, session };

        console.log((new Date()) + ' Connection accepted.');
        // user sent some message
    
        connection.on('message', function(message) {
            if (message.type === 'utf8') { // accept only text
                console.log('Received Message: ' + message.utf8Data);
                //connection.sendUTF(message.utf8Data);

                try {
                    runMessage (sessionData, JSON.parse(message.utf8Data));
                }
                catch (e){
                    logger.error("reading websocket message: " + e.message, {e,message});
                }

            }
            
        });
        


        // user disconnected
        connection.on('close', function(connection) {
            console.log((new Date()) + " Peer "
                + connection.origin + " disconnected.");
            // remove user from the list of connected clients
            
            if (sessionData) {
                switch (sessionData.protocol) {
                    case "tt":
                        TTWebSocket.closeAbrupt(sessionData);
                        break;
                }

                sessionData.session.connection = null;
            }

        });
    });
}