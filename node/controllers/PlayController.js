var logger = require('../core/logger');
var controllerFunc = require('./common');


exports.Tutorial = function(request, response){
    var user = request.session.passport.user;
    controllerFunc.renderPage(
        {
            request,
            response,
            language : user.language, 
            gender   : user.gender, 
            pageName : 'play/Tutorial',
            formData: { user } 
        }
    );
};
 