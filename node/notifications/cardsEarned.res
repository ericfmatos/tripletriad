module.exports = {
    
    getTexts : function(formData){
        return {

            'default':
            {
                'title'   : `You have received ${formData.cards.length} new cards!`,
                'message' :  `<p>Congratulations, ${formData.nickname}, you've got ${formData.cards.length} new cards: </p>
                              <div class="new-cards">
                                <ul>
                                   ${formatCards(formData.cards, {level: "level"})}
                                </ul>
                              </div>
                              `
            },

            'pt': {
                'title'   : `Você ganhou ${formData.cards.length} novas cartas!`,
                'message' :  `<p>Parabéns, ${formData.nickname}, você recebeu ${formData.cards.length} novas cartas: </p>
                              <div class="new-cards">
                                <ul>
                                   ${formatCards(formData.cards, {level: "nível"})}
                                </ul>
                              </div>
                              `
            },

            'es': {
                'title'   : `Ganaste ${formData.cards.length} novas cartas!`,
                'message' :  `<p>Parabéns, ${formData.nickname}, você recebeu ${formData.cards.length} nuevas cartas: </p>
                              <div class="new-cards">
                                <ul>
                                   ${formatCards(formData.cards, {level: "nivel"})}
                                </ul>
                              </div>
                              `

            }


        }
    
    }
}

function formatCards(cards, texts) {
    return cards.map(function (c){
        return `<li>
                  <div class="card">
                      <p class="card__header">
                        <span class="card__deck">${c.card.deck.name}</span>
                        <span class="card__level__caption>${texts.level}</span><span class="card__level__value">${c.card.level}</span>
                      </p>
                      <img src="/img/cards/${c.card.deck.folder}/${c.card.img}.png">
                      <div class="card__numbers">${c.numbers.map(function(n){return `<span>${n}</span>`})}</div>
                      <span class="card__name>${c.card.name}</span>
                  </div>
              </li>`  ; //TODO elementar
    });
}
