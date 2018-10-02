var languageController = require('../core/language');

const DEF_LANGUAGE = "en";
const DEF_GENDER   = "male"; //TODO

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
       //data:   request, response, pageName, formData, resFile, layout

       data.response.pageInfo = {};

       
        /*data.response.pageInfo = languageController.loadRes(
            '../views/' + (data.resFile || data.pageName) + '.res',
            data.language,
            data.gender, 
            data.formData) || {};
        */
        if (data.formData) {
            data.response.pageInfo.formData = data.formData;
        }
        else {
            data.response.pageInfo.formData = {};
        }

        if (data.isPartial) {
            data.response.pageInfo.layout = false;
        }
       
        var user = {};

        if (data.request && data.request.session && data.request.session.passport && data.request.session.passport.user) {
            user = data.request.session.passport.user;
            data.response.pageInfo.formData.user = user;
        }
   

        data.response.pageInfo._settings = {
            language: data.language || user.language || DEF_LANGUAGE,
            gender  : data.gender   || user.gender   || DEF_GENDER
        }

        data.response.render(data.pageName,  data.response.pageInfo);

    }
}