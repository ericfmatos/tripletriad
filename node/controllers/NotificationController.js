var controllerFunc = require('./common');
var languageController = require('../core/language');
var dbNotification = require('../db/user/notifications');
var logger = require('../core/logger');


exports.GetMyNotifications = function(request, response){
    var curUser = request.session.passport.user;
    
    dbNotification.getMyNotifications(curUser.userid, 
        err => 
        { 
            response.status(500);
            logger.error(`could not send welcome notification to user ${data.userid}.`, {err, notificationData, data});
        },
        data => { 
            if (data) {
                return response.json(data);
            }
            else {
                return response.json({success: true});
            }
           
        }
        );  
    
};
 
exports.NotificationRead = function(request, response) {
    var notificaitonid = request.body;
    if (notificaitonid) {
        
        dbNotification.notificationRead(notificaitonid.notificationId, 
            err => 
            { 
                response.status(500);
                logger.critical(`could not set notificationid ${notificaitonid.notificationId} as read.`, {err, notificaitonid});
            },
            data => { 
                return response.json({success: true});
            }
            );  
    }
}

