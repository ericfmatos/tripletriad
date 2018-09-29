module.exports = {
    
    drawSingleCard : function(user_card){
        return {
            card:
            `<div class="card card-deck--${user_card.card.deck.style}">
                <p class="card__header">
                <span class="card__name">${user_card.card.name}</span>
                <span class="card__level__value">${user_card.card.level}</span>
                </p>
                <div class="card__img">
                <div class="card__numbers">${user_card.numbers.map(function(n){return `<span>${n}</span>`}).join("")}</div>
                <img src="/img/cards/${user_card.card.deck.folder}/${user_card.card.img}.png">
                </div>
                
                <span class="card__deck">${user_card.card.deck.name}</span>
            </div>`
        };//TODO elementar
    }        
}


/*
]<span class="card__level__caption">${texts.level}</span>
*/