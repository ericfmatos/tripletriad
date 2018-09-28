module.exports = {
    
    getTexts : function(formData){
        return {

            'default':
            {
                'title'   : 'Welcome',
                'message' :  `Welcome to Tríade Tripla, ${formData.name}!`,
            },

            'pt': {
                'male': {
                    'title'   : 'Bem-vindo',
                    'message' :  `Bem-vindo ao Tríade Tripla, ${formData.name}!`,

                },
                'female': {
                    'title'   : 'Bem-vinda',
                    'message' :  `Bem-vinda ao Tríade Tripla, ${formData.name}!`,
                },
            },

            'es': {
                 'male': {
                    'title'   : 'Bienvenido',
                    'message' :  `Bienvenido al Tríade Tripla, ${formData.name}!`,

                },
                'female': {
                    'title'   : 'Bienvenida',
                    'message' :  `Bienvenida al Tríade Tripla, ${formData.name}!`,
                },

            }


        }
    
    }
}