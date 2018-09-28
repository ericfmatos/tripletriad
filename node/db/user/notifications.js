var pgClient = require("../connection");

module.exports = {

    getMyNotifications: function (userid, err, done) {
        pgClient.execQuery(
            `SELECT * FROM ${pgClient.schema}.notifications 
            WHERE userid = ${userid} and read_date is NULL and now() <= expiration_date
            ORDER BY creation_date limit 1;`
            ,
            _err => err(_err),
            result => {
                if (result.rowCount == 0) {
                    return done(null);
                }
                else {
                    return done(result.rows);
                }
        });
    },


    sendNotification: function(data, err, done) {

        pgClient.execQuery(
                        `INSERT INTO ${pgClient.schema}.notifications 
                            (userid, creation_date, title, message, expiration_date, level)
                        VALUES
                            (${data.userid}, now(), '${data.title}', '${data.message}', now() + interval '7 days', ${(data.level || 0)})
                        RETURNING notificationid;
                        `,
            _err => err(_err),
            _res => {
                if (_res && _res.rowCount) {
                    done(_res.rows[0])
                } else {
                    done(null);
                }
            }
        );

    },

    notificationRead: function (notificationid, err, done) {

        pgClient.execQuery(
            `UPDATE ${pgClient.schema}.notifications 
                SET read_date = now()
            WHERE
                notificationid = ${notificationid};`,
            _err => err(_err),
            _res => done(notificationid)
        );
    }

}