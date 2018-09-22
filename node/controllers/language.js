module.exports = {
    loadRes: function(file, language, gender) {
        var fileData = require(file).texts;
        if (fileData) {
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

            

        }

        if (!res) {
            res = {};
        }

        return res;            

    }
}