var TutorialHandler = function() {
    var elements = {};
    var texts = {};

    var toggledCards = [];

    var socket;

    var banners = {
        initial: {},
         noMoreThan5Alert : {},
         play: {}
    }


    function loadElements() {
        elements.decks = $("ul.decks");
        elements.deck_titles = $(".deck__title");
        elements.texts = $("#textSamples");
        elements.startGame = $(".user-may-start");
        elements.startGameButton =  elements.startGame.find("button");
        elements.handTrail = $(".hand-trail");
    }

    function showPointer(where) {
        elements.handTrail.insertAfter(where);
        elements.handTrail.removeClass("hidden");
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
                banners.noMoreThan5Alert.show();
            }
            
        }
        showCounter(card.closest(".deck"));


        if (toggledCards.length >= 5) {
            elements.startGame.removeClass("hidden");
            banners.initial.hide();
            banners.play.show();
        }
        else {
            elements.startGame.addClass("hidden");
            banners.initial.show();
            banners.play.hide();
        }
        
    }

    function startMatch() {
        console.log("chegou onde tinha que chegar");
        $('.modal-body').load('/play/board',function(){
            $('#tutorialModal').modal({show:true, backdrop: 'static', keyboard:false});
        });
    }

    function onStartGame(el) {
        NotificationHandler.pause();
        socket = TTSocketPlay();
        socket.start("tutorial", {
            startMatch: startMatch
        });//?
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
        texts.play = {
            title: elements.texts.find("#play").text(),
            desc: elements.texts.find("#userMayStart").text()
        }
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

       banners.initial = $banner({type: 'success', closable: false, title: texts.starting.title, text: texts.starting.desc, destroyWhenHide: false, container: $(".banner-container")});
       banners.initial.show();

       banners.noMoreThan5Alert = $banner({type: 'danger', timer:5000, closable: true, title: texts.cannot, text: texts.cannotMore5,  destroyWhenHide: false, container: $(".banner-container")});

       banners.play = $banner({type: 'success', closable:false, title: texts.play.title, text: texts.play.desc, destroyWhenHide: false, container: $(".banner-container")});


       showPointer($(".deck__title"));

       //TODO banner play!
    }


    return {
        start
    }
}();


$(document).ready(function() {
    TutorialHandler.start();
});
