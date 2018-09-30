
var NotificationHandler = function() {


    const NOTIFICATION_LEVEL = {
        NOTHING: 0,
        SIGN: 1,
        POPUP: 2,
        EMAIL: 3
    };

    var elements = {};

    function removeNotificationSign() {

    }

    function showNotificationSign() {

    }

    function notificationShown(data) {
        setNotificationRead(data.notificationid);
    }

    function notificationHidden(data) {
        getMyUpdates();
    }

    var getMyUpdates =  function () {
        $.get('/notification/updates', function(data, status) {
            var showPopup = null;
            if (data) {
                elements.user_notifications.text(data.length);

                var toShowNotificationSign = false;
                

                for (var i = 0; i < data.length; i++) {
                    var thisNote = data[i];
                    if (!toShowNotificationSign && (thisNote.level & NOTIFICATION_LEVEL.SIGN)) {
                        toShowNotificationSign = true;
                    }
                    if (!showPopup && (thisNote.level & NOTIFICATION_LEVEL.POPUP)) {
                        showPopup = thisNote;
                    }

                    if (toShowNotificationSign && showPopup) {
                        break;
                    }
                }


                if (toShowNotificationSign) {
                    showNotificationSign();
                }

                if (showPopup) {
                    popupDialog.show(showPopup.title, showPopup.message, showPopup, { 
                        onShown: notificationShown,
                        onHide : notificationHidden
                    });
                }

            }
            else {
                elements.user_notifications.text("0");
                removeNotificationSign();
            }
        });
    }

    function setNotificationRead (notificationId) {
        $.post('/notification/setRead',
            {notificationId},
            function(data, status) {
                console.log(data);
                console.log(status);
            });
    }


    function loadElements() {
        elements.user_notifications = $("#user_notifications");
    }

    function addListeners() {
        
    }

    function timerExecution() {
        if (!popupDialog.isVisible()) {
            getMyUpdates();
        }
    }

    function startTimer(){
        timerExecution();
        setInterval(timerExecution, 10000);
    }

    var start = function() {
        loadElements();
        addListeners();

        startTimer();
    }

    return  {
        start
    }

    
}();


$(document).ready(function() {
    NotificationHandler.start();
});



