var Common = function(){

    var fillForm = function() {
        var form = $("form");
        if (form.length) {
            var d = form.find("select[data-val]");
            for (var i = 0; i <  d.length ; i ++ ) {
                var dropdown = $(d[i]);
            
                dropdown.val(dropdown.attr("data-val"));
            }
        }
    }

    return {
        fillForm
    }
}();


$(document).ready(function() {
    Common.fillForm();
});

