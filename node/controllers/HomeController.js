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
    response.pageInfo = {};
    response.pageInfo.title = 'Outro';

    response.render('home/Other');
};
