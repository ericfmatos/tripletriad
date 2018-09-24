var pgClient = require("../connection");

module.exports = {

    getNextNotification: function (userid, err, done) {
        var conn = pgClient.createDBConnection();

        conn.connect(function (connErr){
            if (connErr) {
                err(connErr);
            }
            else {

                var query;

                query = `SELECT * FROM ${pgClient.schema}.notifications 
                         WHERE userid = ${userid} and read_date is NULL ORDER BY creation_date DESC limit 1;`;
                

                conn.query(query,  function(queryErr, result) {
                    if (queryErr) {
                        err(queryErr);
                    }
                    else {

                        conn.end(function(endErr) {
                            if (endErr) {
                                err(queryErr);
                            }
                            else {
                                if (result.rowCount == 0) {
                                    return done(null);
                                }
                                else {
                                    return done(result.rows[0]);
                                }
                            }

                        });
                    }
                } );
                
            }
        })
    },

    sendNotification: function(data, err, done) {
        var conn = pgClient.createDBConnection();

        conn.connect(function (connErr){
            if (connErr) {
                err(connErr);
            }
            else {

                var query;

                query = `INSERT INTO ${pgClient.schema}.notifications 
                            (userid, creation_date, title, message, expiration_date)
                        VALUES
                            (${data.userid}, now(), '${data.title}', '${data.message}', now() + interval '7 days');
                        `;
                

                conn.query(query,  function(queryErr, result) {
                    if (queryErr) {
                        err(queryErr);
                    }
                    else {

                        conn.end(function(endErr) {
                            if (endErr) {
                                err(queryErr);
                            }
                            else {
                                return done (data);
                            }

                        });
                    }
                } );
                
            }
        })
    },

    notificationRead: function (notificationid, err, done) {
        var conn = pgClient.createDBConnection();

        conn.connect(function (connErr){
            if (connErr) {
                err(connErr);
            }
            else {

                var query;

                query = `UPDATE ${pgClient.schema}.notifications 
                            SET read_date = now()
                        WHERE
                            notificationid = ${notificationid};`;
                

                conn.query(query,  function(queryErr, result) {
                    if (queryErr) {
                        err(queryErr);
                    }
                    else {

                        conn.end(function(endErr) {
                            if (endErr) {
                                err(queryErr);
                            }
                            else {
                                return done (notificationid);
                            }

                        });
                    }
                } );
                
            }
        })
    }

}