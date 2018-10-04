var TutorialHandler = function() {
    var elements = {};
    var texts = {};

    var toggledCards = [];



    function loadElements() {
        elements.decks = $("ul.decks");
        elements.deck_titles = $(".deck__title");
        elements.texts = $("#textSamples");
        elements.startGame = $(".user-may-start");
        elements.startGameButton =  elements.startGame.find("button");
    }

    function onCardClick(card) {

        

        var cardid = parseInt(card.data("id"));
        if (card.hasClass("toggled")) {
            card.removeClass("toggled");
            toggledCards.splice(toggledCards.indexOf(cardid), 1);
        }
        else {
            if (toggledCards.length < 5) {
                card.addClass("toggled");
                toggledCards.push(cardid);
            } else {
                Alerts({
                    messageText: texts.cannotMore5,
                    alertType: "danger",
                    okButtonText: texts.ok,
                    headerText: texts.cannot
                  });
            }
            
        }
        showCounter(card.closest(".deck"));


        if (toggledCards.length >= 5) {
            elements.startGame.removeClass("hidden");
        }
        else {
            elements.startGame.addClass("hidden");
        }
        
    }

    function onStartGame(el) {
        NotificationHandler.pause();
        Alerts({
            messageText: "vamos começar",
            alertType: "danger",
            okButtonText: texts.ok,
            headerText: texts.cannot
          });
    }

    function addListeners() {
        elements.decks.delegate(".card", "click", function() {
            onCardClick($(this));
        })

        Decks.setLoadDeckCallback(function(deck) {
            toggledCards.forEach(function(toggledCard) {
                deck.find(".card[data-id='" + toggledCard + "']").addClass("toggled");
            })
        });

        elements.startGameButton.on("click", function() {
            onStartGame($(this));
        });
    
    }

    function loadTexts() {
        texts.cardcounter = elements.texts.find("#sampleCardCounter").text();
        texts.cannotMore5 = elements.texts.find("#cannotMore5").text();
        texts.ok = elements.texts.find("#txtOk").text();
        texts.cannot = elements.texts.find("#txtCannot").text();
        texts.starting = {
            title : elements.texts.find("#tutorialStart").text(),
            desc : elements.texts.find("#startingDesc").text()
        };
    }


    function addNewElements() {
        elements.deck_titles.after($("<span class='card-counter'>" + texts.cardcounter + "</span>"));
    }


    function showCounter(deck) {
        var val = deck.find(".card.toggled").length;
        deck.find(".card-counter > span").text(val);
    }
    
    start = function() {
        loadElements();
        addListeners();
        loadTexts();

        addNewElements();

        $.toast(`<p>${texts.starting.title}</p>${texts.starting.desc}`);
    }


    return {
        start
    }
}();


$(document).ready(function() {
    TutorialHandler.start();
});
