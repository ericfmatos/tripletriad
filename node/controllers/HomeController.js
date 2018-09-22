exports.Index = function(request, response){
    response.pageInfo = {};
    response.pageInfo.title = 'Tríade Tripla';
    
    response.render('home/Index', response.pageInfo);
};
 
exports.Other = function(request, response){
    response.pageInfo = {};
    response.pageInfo.title = 'Outro';

    response.render('home/Other');
};


exports.Profile = function(request, response){
    var user = request.session.passport.user;
    var resOp = require('./language');
    if (user.userid) {
        
        response.render('home/Other');
    }
    else {
        response.pageInfo = resOp.loadRes('../views/home/res/NewUser',user.language, user.gender);
    
        response.render('home/NewUser', response.pageInfo);
    }
};
