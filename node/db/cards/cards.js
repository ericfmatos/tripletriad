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

   
    addUserCards: function (data, err, done) {

        if (data) {
            var values = [];
            data.map(_card => {
                values.push(`(${_card.userid}, ${_card.cardid}, ${_card.numbers}, ${(_card.data ? '' + _card.data + '' : 'NULL')})`);
            });

            var query = `INSERT INTO ${pgClient.schema}.user_cards (userid, cardid, numbers, data) VALUES ${values.join(',')}`;
            

            var conn = pgClient.execQuery(
                query,
                _err => err(_err),
                _data => {
                    return done(_data.rowCount);
                }


            );
        }
    }
    

    
}
