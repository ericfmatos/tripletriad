module.exports = {
    
    getTexts : function(formData){
        return {

            'default':
            {
                'welcome'   : `Welcome, ${formData.name}`,
            },

            'pt': {
                'male': {
                    'welcome'   : `Bem-vindo, ${formData.name}`
                },
                'female': {
                    'welcome'   : `Bem-vinda, ${formData.name}`
                },
            },

            'es': {
                'male': {
                    'welcome'   : `Bienvenido, ${formData.name}`
                },
                'female': {
                    'welcome'   : `Bienvenida, ${formData.name}`
                },
            }


        }
    
    }
}