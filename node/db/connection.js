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
    
        schema: pgConfig.pgConn.schema

}