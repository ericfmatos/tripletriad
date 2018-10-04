
var HomeHandler = function() {


    var elements = {};


    function toogleBoxToggle(box) {
        box.find("ul").toggleClass("hidden");
    }

    function loadElements() {
        elements.toggleBox = $(".toggle-box a");
    }

    function addListeners() {
        elements.toggleBox.on("click", function(){
            toogleBoxToggle($(this).closest(".toggle-box"));
        })
    }


    var start = function() {
        loadElements();
        addListeners();

    }

    return  {
        start
    }

    
}();


$(document).ready(function() {
    HomeHandler.start();
});



