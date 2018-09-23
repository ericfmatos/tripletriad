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
                'play'      : 'Play!',
                'cards'     : 'My Cards',
                'exchange'  : 'Exchange My Points',
                'shop'      : 'Shop'
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
                'play'      : 'Jogar!',
                'cards'     : 'Minhas cartas',
                'exchange'  : 'Trocar meus pontos',
                'shop'      : 'Loja'

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
                'play'      : 'Jugar!',
                'cards'     : 'Mis cartas',
                'exchange'  : 'Canjear mis puntos',
                'shop'      : 'Tienda'

            }


        }
    
    }
}