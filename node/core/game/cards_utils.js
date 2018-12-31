/* CARD
userid: 63,
cardid:	2,
numbers:	[1,2,1,3],
data:	{},
card:{
    cardid:2,
    deckid:1,
    level:1,
    name:"Bite Bug",
    elementar:[],
    data:null,
    img:"TTBiteBug",
    rarity:0,
    deck:{
        deckid:1,
        name:"Final Fantasy VIII",
        data:null,
        folder:"ffviii",
        style:"ffviii"
    }
}*/

module.exports = {
    equals(cardA, cardB) {
        
        
        if (Object.keys(cardA).length == Object.keys(cardB).length) {
            for(key in cardA) { 
                if(cardA[key] != cardB[key]) {
                    return false;
                }
            }
        }
        else {
            return false;
        }

        return true;
    }
}