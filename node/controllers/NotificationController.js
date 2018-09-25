var controllerFunc = require('./common');
var languageController = require('./language');
var dbNotification = require('../db/user/notifications');

exports.GetMyNotifications = function(request, response){
    var curUser = request.session.passport.user;
    
    dbNotification.getMyNotifications(curUser.userid, 
        err => 
        { 
            console.log(err);
            response.status(500);
        },
        data => { 
            if (data) {
                return response.json(data);
            }
            else {
                return response.status(200);
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
                console.log(err);
                response.status(500);
            },
            data => { 
                return response.status(200);
            }
            );  
    }
}

