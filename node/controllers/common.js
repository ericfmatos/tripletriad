var languageController = require('./language');

module.exports =  {
    
    matchLanguage: function(browserLanguages) {
        for (var i = 0; i < browserLanguages.length; i++) {
            var temp = browserLanguages[i];
            if (temp.indexOf('_') >= 0) {
                temp = temp.substring(0, temp.indexOf('_'));
            }
            else if (temp.indexOf('-') >= 0) {
                temp = temp.substring(0, temp.indexOf('-'));
            }
    
            if (languageController.languagesAccepted.indexOf(temp) >= 0) {
                return temp;
            }
        }

        return 'en';
    },



    renderPage: function(response, language, gender, pageName, formData, resFile) {


        response.pageInfo = languageController.loadRes('../views/' + (resFile || pageName) + '.res',language, gender, formData) || {};
        if (formData) {
            response.pageInfo.formData = formData;
        }
        response.render(pageName, response.pageInfo);

    }
}