module.exports = {
    

    getTexts : function(formData){
        return {

            'default':
            {
                'title'   : `You have received ${formData.cards.length} new cards!`,
                'message' :  `<p>Congratulations, ${formData.nickname}, you've got ${formData.cards.length} new cards: </p>
                              <div class="new-cards">
                               
                                ${scriptToShowCards(formData.cards).text}

                              </div>
                              `
            },

            'pt': {
                'title'   : `Você ganhou ${formData.cards.length} novas cartas!`,
                'message' :  `<p>Parabéns, ${formData.nickname}, você recebeu ${formData.cards.length} novas cartas: </p>
                              <div class="new-cards">
                              
                               ${scriptToShowCards(formData.cards).text}

                              </div>
                              `
            },

            'es': {
                'title'   : `Ganaste ${formData.cards.length} novas cartas!`,
                'message' :  `<p>Parabéns, ${formData.nickname}, você recebeu ${formData.cards.length} nuevas cartas: </p>
                              <div class="new-cards">
                               
                                ${scriptToShowCards(formData.cards).text}

                              </div>
                              `

            }


        }
    
    }
}


function scriptToShowCards(cards) { 
    //TODO nao consegui fazer funcionar isso.
    return { text :
    ` 

        <script type="text/javascript">
        $.post('/cards/renderCards',
            ${JSON.stringify( cards) },
            function(data, status) {
                if (data) {
                    $(".new-cards").html(data);
                }
            });

        </script>`
    };
}