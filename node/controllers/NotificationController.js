var controllerFunc = require('./common');
var languageController = require('./language');

exports.ReadNext = function(request, response){
    var curUser = request.session.passport.user;
    
    var dbNotification = require('../db/user/notifications');
    dbNotification.getNextNotification(curUser.userid, 
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
                return response.json({});
            }
           
        }
        );  
    
};
 
exports.NotificationRead = function(request, response) {
    var notificaitonid = request.body;
    if (notificaitonid) {
        var dbNotification = require('../db/user/notifications');
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

