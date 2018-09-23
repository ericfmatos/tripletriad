var languageController = require('./language');

module.exports =  {
    

    renderPage: function(response, language, gender, pageName, formData) {


        response.pageInfo = languageController.loadRes('../views/' + pageName + '.res',language, gender) || {};
        if (formData) {
            response.pageInfo.formData = formData;
        }
        response.render(pageName, response.pageInfo);

    }
}