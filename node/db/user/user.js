var pgClient = require("../connection");

module.exports = {

    findUser: function(google_id, err, done) {
        //execQuery: function(query, err, done) {
        var conn = pgClient.execQuery(

            `SELECT * FROM ${pgClient.schema}.users WHERE google_id = '${google_id}'`,
            _err => err(_err),
            _data => {
                if (_data.rowCount == 0) {
                    done(null);
                }
                else {
                    var data = _data.rows[0];
                    return done (data);
                }
            }


        );

        
    },

    saveUser: function(userData, err, done) {

        var query;


        if (userData.userid) {
            query = `UPDATE ${pgClient.schema}.users 
                        SET 
                             name       = '${userData.name}'
                            ,nickname   = '${userData.nickname}'
                            ,email      = '${userData.email}'
                            ,language   = '${userData.language}'
                            ,gender     = '${userData.gender}'
                     WHERE userid = ${userData.userid};`;
        }
        else {
            query = `INSERT INTO ${pgClient.schema}.users 
                        (name, nickname, google_id, email, google_token, gender, profile_photo_url, language)
                    VALUES
                        ('${userData.name}', '${userData.nickname}', '${userData.google_id}', '${userData.email}', '${userData.google_token}', 
                         '${userData.gender}', '${userData.profile_photo_url}', '${userData.language}')
                    RETURNING userid;
                    `
        }

        pgClient.execQuery(query, 
            _error => err(_error),
            result => {
                if (result.rowCount == 0) {
                    return done(null);
                }
                else {
                    if (!userData.userid) {
                        var data = result.rows[0];
                        userData.userid = parseInt(data.userid);
                    }
                    return done (userData);
                }
            }
        );

    },

    

    
}
