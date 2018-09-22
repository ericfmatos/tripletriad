var pgClient = require("../connection");

module.exports = {

    findUser: function(google_id, err, done) {

        var conn = pgClient.createDBConnection();

        conn.connect(function (connErr){
            if (connErr) {
                err(connErr);
            }
            else {
                conn.query(`SELECT * FROM ${pgClient.schema}.users WHERE google_id = '${google_id}'`,  function(queryErr, result) {
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
                                    done(null);
                                }
                                else {
                                    var data = result.rows[0];
                                    return done (data);
                                }


                            }

                        });
                    }
                } );
            }
        });

        
    },

    saveUser: function(userData, err, done) {

        var conn = pgClient.createDBConnection();

        conn.connect(function (connErr){
            if (connErr) {
                err(connErr);
            }
            else {

                var query;


                if (userData.userid) {
                    //TODO update user
                }
                else {
                    query = `INSERT INTO ${pgClient.schema}.users 
                                (name, google_id, email, google_token, gender, profile_photo_url, language)
                            VALUES
                                ('${userData.name}', '${userData.google_id}', '${userData.email}', '${userData.google_token}', '${userData.gender}',
                                 '${userData.profile_photo_url}', '${userData.language}')
                            RETURNING userid;
                            `
                }
                if (query) {

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
                                        var data = result.rows[0];
                                        userData.userid = data.userid;
                                        return done (userData);
                                    }


                                }

                            });
                        }
                    } );
                } else {
                    conn.end(function(endErr) {
                        if (endErr) {
                            err(queryErr);
                        }
                        else {
                            return done(null);
                        }
                    })
                }
            }
        })
    }

    
}
