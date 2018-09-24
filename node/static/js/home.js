var HomeHandler = function() {


    var elements = {};

    var getNextNotification =  function () {
        $.get('/notification/next', function(data, status) {
            console.log(data);
            console.log(status);
        })   ;
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
        
    }

    function addListeners() {
        
    }

    function startTimer(){
        setInterval(getNextNotification, 10000);
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
    HomeHandler.start();
});



