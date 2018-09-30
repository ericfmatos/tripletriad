var pgClient = require("../connection");

module.exports = {

    logError: function(data, err, done) {
        
        var query = `INSERT INTO ${pgClient.schema}.log (log_level, message, json_data) 
                    values
                    (${data.level}, '${data.message}', '${JSON.stringify((data.data || {}))}');`;

        var conn = pgClient.execQuery(
            query,
            _err => err(_err),
            _data => {
                done(_data.rows);
            }


        );

        
    },

   
    
}