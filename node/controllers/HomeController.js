var controllerFunc = require('./common');


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
    
    if (user.userid) {
        controllerFunc.renderPage(response, user.language, user.gender, 'home/Home', user);
    }
    else {
        controllerFunc.renderPage(response, user.language, user.gender, 'home/NewUser', user);
    }
};

exports.SaveUser = function(request, response) {

    var curUser = request.session.passport.user;
    var newUser = request.body;

    for (var key in newUser) {
        curUser[key] = newUser[key];
    }

    var dbUser = require('../db/user/user');
    dbUser.saveUser(curUser, 
        err => response.err(err),
        data => { 
            request.session.passport.user = data;
            response.redirect('/profile');
        }
        );  

    
   
}


exports.Home = function(request, response) {
    response.render('home/Other');
};