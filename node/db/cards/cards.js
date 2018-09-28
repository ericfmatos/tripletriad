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

        var query = `SELECT A.*, to_json(D) as deck FROM ${pgClient.schema}.cards A inner join ${pgClient.schema}.decks D on a.deckid = D.deckid `;
        if (where.length) {
            query = query + ' WHERE ' +  where.join(" and ");
        }
        query = query + ';';


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

   
    addUserCards: function (data, err, done) {

        if (data && data.userid && data.user_cards && data.user_cards.length) {

            var conn = pgClient.execQuery(
                `select * from ${pgClient.schema}.fn_add_user_cards(${data.userid}, '${JSON.stringify(data.user_cards)}');`,
                _err => err(_err),
                _data => {
                    if (_data.rowCount && _data.rows && _data.rows.length && _data.rows[0] && _data.rows[0].fn_add_user_cards) {
                        var jsonRes = JSON.parse(_data.rows[0].fn_add_user_cards);
                        if (jsonRes && jsonRes.user_status) {
                            return done(jsonRes.user_status);
                        }
                    }
                    else {
                        return _err(new Error('no rows affected'));
                    }
                    
                }


            );

           
        }
    }
    

    
}
