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



    renderPage: function(data) {
       //data:   response, language, gender, pageName, formData, resFile, layout

        data.response.pageInfo = languageController.loadRes(
            '../views/' + (data.resFile || data.pageName) + '.res',
            data.language,
            data.gender, 
            data.formData) || {};
        
        if (data.formData) {
            data.response.pageInfo.formData = data.formData;
        }
        if (data.layout) {
            data.response.pageInfo.layout =  data.layout;
        }

        data.response.render(data.pageName,  data.response.pageInfo);

    }
}