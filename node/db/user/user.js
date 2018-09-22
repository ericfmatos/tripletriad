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
                                    return done ({
                                        x: 1
                                    });
                                }


                            }

                        });
                    }
                } );
            }
        })
}


    
}
