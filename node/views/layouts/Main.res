module.exports = {
    
    getTexts : function(formData){
        return {

            'default':
            {
                'welcome'   : `Welcome, ${formData.name}`,
                'level'     : 'Level',
                'settings'  : 'Settings',
                'status'    : 'Status',
                'notifications' : 'Notifications',
                'logout'    : 'Sign Out',
                'profile'   : 'Profile',
                'points'    : 'Points',
            },

            'pt': {
                'male': {
                    'welcome'   : `Bem-vindo, ${formData.name}`
                },
                'female': {
                    'welcome'   : `Bem-vinda, ${formData.name}`
                },
                'level'     : 'Nível',
                'settings'  : 'Configurações',
                'status'    : 'Status',
                'notifications' : 'Notificações',
                'logout'    : 'Sair',
                'profile'   : 'Perfil',
                'points'    : 'Pontos',
 
            },

            'es': {
                'male': {
                    'welcome'   : `Bienvenido, ${formData.name}`
                },
                'female': {
                    'welcome'   : `Bienvenida, ${formData.name}`
                },
                'level'     : 'Nivel',
                'settings'  : 'Configuración',
                'status'    : 'Estatus',
                'notifications' : 'Notificaciones',
                'logout'    : 'Salir',
                'profile'   : 'Perfil',
                'points'    : 'Puntos',
 
            }


        }
    
    }
}