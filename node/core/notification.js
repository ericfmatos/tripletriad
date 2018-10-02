var dbNotification = require('../db/user/notifications');
var logger = require('./logger');

module.exports = {

    /*{
        userid,
        title,
        message,
        level
    }*/

    sendNotification: function(data, onErr, onDone) {
        
        var notificationData = {
            userid: data.userid,
            title: data.title.replace(/'/g, "''"),
            message: data.message.replace(/'/g, "''"),
            level: data.level
        };
        dbNotification.sendNotification(
            notificationData,
            err => {
                if (!onErr(err)) {
                    logger.error(`could not send notification to user ${data.userid}.`, {err, notificationData, data});
                }
            },
            _res => {
                onDone(_res); //notificationid;
                logger.info(`notification id ${_res.notificationid} level ${data.level} sent to userid ${data.userid}`, {data, notificationData, _res});
            }
        );
    },

    LEVEL: {
        NONE   : 0,
        SIGN   : 1,
        POPUP  : 2,
        EMAIL  : 4,
        POPOVER: 8
    }
}