Decks = function() {

    var elements = {};

    var loadDeckCallback = function() {

    }


    function showDeck(deckData, deckid) {
        

        $.get('/cards/listMyCardsFromDeck?deckid=' + deckid, function(data, status) {
            if (data) {

                deckData.html(data);

                deckData.removeClass("hidden");
                
                loadDeckCallback(deckData.closest(".deck"));
                
            }
        });
    }

    function hideDeck(deckData) {
        deckData.addClass("hidden");
    }

    function onDeckTitleClick(deckTitle) {
        var thisDeck = deckTitle.closest(".deck");
        var deckData = thisDeck.find(".deck__data");

        if (deckData.hasClass("hidden")) {
            showDeck(deckData, thisDeck.data("id"));
        }
        else {
            hideDeck(deckData);
        }

    }


    function loadElements(){
        elements.decks = $("ul.decks");
    }

    function addListeners(){    
        elements.decks.delegate("> li .deck__title", "click", function() {
            onDeckTitleClick($(this));
        })
    }

    var setLoadDeckCallback = function(v) {
        loadDeckCallback = v;
    }


    var start = function() {
        loadElements();
        addListeners();
    }

    return {
        start,
        setLoadDeckCallback
    }
}();




$(document).ready(function() {
    Decks.start();
});
