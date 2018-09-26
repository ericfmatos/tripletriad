var pgClient = require("../connection");

module.exports = {

    listCardsFromDeck: function(data , err, done) {
        
        var where = [];
        if (data.level) {
            where.push(`A.level = ${data.level}`);
        }
        if (data.deck) {
            where.push(`A.deckid = ${data.deck}`);
        }

        var query = `SELECT * FROM ${pgClient.schema}.cards A `;
        if (where.length) {
            query = query + ' WHERE ' +  where.join(" and ");
        }


        var conn = pgClient.execQuery(
            query,
            _err => err(_err),
            _data => {
                if (_data.rowCount == 0) {
                    return done([]);
                }
                else {
                    return done (_data.rows);
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
                        userData.userid = data.userid;
                    }
                    return done (userData);
                }
            }
        );

    },

    

    
}
