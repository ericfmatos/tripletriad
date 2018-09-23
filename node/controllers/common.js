var languageController = require('./language');

module.exports =  {
    

    renderPage: function(response, language, gender, pageName, formData, resFile) {


        response.pageInfo = languageController.loadRes('../views/' + (resFile || pageName) + '.res',language, gender, formData) || {};
        if (formData) {
            response.pageInfo.formData = formData;
        }
        response.render(pageName, response.pageInfo);

    }
}