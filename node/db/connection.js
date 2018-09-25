const { Client } = require('pg')

var pgConfig = require('./config');

    
module.exports =  {


    createDBConnection: function() {
        return new Client({
            host: pgConfig.pgConn.host, 
            port: pgConfig.pgConn.port,
            database: pgConfig.pgConn.db,
            user: pgConfig.pgConn.user,
            password: pgConfig.pgConn.password
        });
    },


    
    execActionAtPg: function(action, onError, onDone) {
        var conn = this.createDBConnection();
        conn.connect(function(connError){
            if (connError) {
                return onError(connError);
            }
            else {

                try {
                     action(conn, onError, onDone);
                }
                catch (_err) {
                    onError(_err);
                }

                conn.end(function(endErr) {
                    if (endErr) {
                        console.log('error closing conn: %1', endErr);
                    }
                });

            }
        });
    },


    execQuery: function(query, onError, onDone) {

        var conn = this.createDBConnection();
        conn.connect(function(connError){
            if (connError) {
                return onError(connError);
            }
            else {

                try {
                    conn.query(query, function(_errQuery, _resQuery) {
                        conn.end(function(endErr) {
                            if (endErr) {
                                console.log('error closing conn: %1', endErr);
                            }
                        });

                        onDone(_resQuery);
                    }) ;   
                }
                catch (_err) {
                    onError(_err);
                }

            }
        });
            
            
    },

    
    schema: pgConfig.pgConn.schema

}