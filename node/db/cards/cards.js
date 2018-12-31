var pgClient = require("../connection");

module.exports = {

    listDecks: function(err, done) {
        pgClient.simpleQuery( `SELECT * FROM ${pgClient.schema}.decks order by name;`,
            _err => err(_err),
            _data => done(_data)
        );

    },

    listUserDecks: function (userid, err, done) {
        pgClient.simpleQuery( `SELECT * FROM ${pgClient.schema}.decks WHERE deckid in 
                                    (select deckid from ${pgClient.schema}.cards a inner join ${pgClient.schema}.user_cards b on a.cardid = b.cardid and 
                                        b.userid = ${userid}
                                    ) 
                               order by name;`,
            _err => err(_err),
            _data => done(_data)
        );

    },

    listAvailCardsFromDeck: function (data, err, done){
        var where = [];
        if (data.level) {
            where.push(`A.level = ${data.level}`);
        }
        if (data.deck) {
            where.push(`A.deckid = ${data.deck}`);
        }
        if (data.minrarity) {
            where.push(`A.rarity >= ${data.minrarity}`);
        }
        if (data.maxrarity) {
            where.push(`A.rarity <= ${data.maxrarity}`);
        }
        if (data.userid) {
            where.push(`A.cardid not in (select cardid from ${pgClient.schema}.user_cards where userid = ${data.userid})`);
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
                        return err(new Error('no rows affected'));
                    }
                    
                }


            );

           
        }
    },

    listUserCardsFromDeck:  function(data , err, done) {
        var query = `select a.*, row_to_json(b) as card from ${pgClient.schema}.user_cards a inner join
                            (select card.*, row_to_json(deck) as deck from ${pgClient.schema}.cards card 
                            inner join ${pgClient.schema}.decks deck on card.deckid = deck.deckid 
                            where deck.deckid = ${data.deckid}) b
                            on a.cardid = b.cardid
                            where a.userid = ${data.userid} 
                    order by a.cardid;`;

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
/*
OUTPUT:
userid: 63,
cardid:	2,
numbers:	[1,2,1,3],
data:	{},
card:{
    cardid:2,
    deckid:1,
    level:1,
    name:"Bite Bug",
    elementar:[],
    data:null,
    img:"TTBiteBug",
    rarity:0,
    deck:{
        deckid:1,
        name:"Final Fantasy VIII",
        data:null,
        folder:"ffviii",
        style:"ffviii"
    }
}
*/
    listUsersCardsById: function (userId, cardsIds, err, done) {
        //var query = `select * from ${pgClient.schema}.user_cards where userid = ${userId} and cardid in (${cardsIds.join(",")})`;
        var query = `select a.*, row_to_json(b) as card from ${pgClient.schema}.user_cards a inner join
                        (select card.*, row_to_json(deck) as deck from ${pgClient.schema}.cards card 
                        inner join ${pgClient.schema}.decks deck on card.deckid = deck.deckid) b
                        on a.cardid = b.cardid
                        WHERE a.userid = ${userid}
                        AND a.cardid in (${cardsIds.join(",")});`;
        
        var conn = pgClient.execQuery(
            query,
            _err => err(_err),
            _data => {
               return done (_data.rows);
            }
        );
    },

    listUserCards: function(userid, err, done) {

        var query = `select a.*, row_to_json(b) as card from ${pgClient.schema}.user_cards a inner join
                            (select card.*, row_to_json(deck) as deck from ${pgClient.schema}.cards card 
                            inner join ${pgClient.schema}.decks deck on card.deckid = deck.deckid) b
                            on a.cardid = b.cardid
                            WHERE a.userid = ${userid}
                    order by a.cardid;`;

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


    }    

    
}
