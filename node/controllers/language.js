module.exports = {

    languagesAccepted: ['pt', 'es', 'en', 'en', 'it', 'fr'],


    loadRes: function(file, language, gender, formData) {
        var fileData = require(file);
        if (fileData) {
            if (formData && fileData.getTexts) {
                fileData.texts = fileData.getTexts(formData);
            }



            if (fileData.texts) {
                fileData = fileData.texts;
                var def = fileData.default;
                
                var res = fileData[language];
                var resFallback = {};
                var langFallbackTemp = language.split("_");
                if (langFallbackTemp.length) {
                    var langFallback = langFallbackTemp[0];
                    if (langFallbackTemp && fileData[langFallback]) {
                        resFallback = fileData[langFallback];
                    }
                }
                
                if (!res) {
                    res = {}
                }

                var resNeutralGender = res;
                var resFallbackNeutralGender = resFallback;

                if (res[gender]) {
                    res = res[gender];
                    for (var key in resNeutralGender) {
                        if (typeof(resNeutralGender[key]) !== "object" && !res[key]) {
                            res[key] = resNeutralGender[key];
                        }
                    }
                }
                if (resFallback[gender]) {
                    resFallback = resFallback[gender];
                    for (var key in resFallback) {
                        if (typeof(resFallback[key]) !== "object" && !res[key]) {
                            res[key] = resFallback[key];
                        }
                    }
                }
                if (resFallbackNeutralGender) {
                    for (var key in resFallbackNeutralGender) {
                        if (typeof(resFallbackNeutralGender[key]) !== "object" && !res[key]) {
                            res[key] = resFallbackNeutralGender[key];
                        }
                    }
                }

                if (def) {
                    for (var key in def) {
                        if (!res[key]) {
                            res[key] = def[key];
                        }
                    }
                }

            
            }

        }
        if (!res) {
            res = {};
        }

        return res;            

    }
}