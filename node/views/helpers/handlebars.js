var register = function(Handlebars) {
    var helpers = {
    
        cardRank: function(rank) {
            if (rank < 10) {
                return rank
            } else {
                switch(rank) {
                    case 10: return 'A';
                    case 11: return 'B';
                    case 12: return 'C';
                    case 13: return 'D';
                    case 14: return 'E';
                    case 15: return 'F';
                    case 16: return 'G';
                    case 17: return 'H';
                    case 18: return 'I';
                    case 19: return 'J';
                    case 20: return 'K';
                }
            }
        },
        
        jsonStringify: function(obj) {
            return JSON.stringify(obj);
        }
    };

    if (Handlebars && typeof Handlebars.registerHelper === "function") {
        for (var prop in helpers) {
            Handlebars.registerHelper(prop, helpers[prop]);
        }
    } else {
        return helpers;
    }

};

module.exports.register = register;
module.exports.helpers = register(null); 