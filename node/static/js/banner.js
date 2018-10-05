var Banner = {
    el : {},

    options: {},

    owner: {},

    show: function() {
        this.el.animate({left: "10%"});
        var master=this;
        if (this.options.timer) {
            setTimeout(function() {master.hide()}, this.options.timer);
        }
    },

    hide: function() {
        this.el.animate({'margin-left' : "50%",
        'opacity' : '0'});
    },

    init: function(options, owner) {
        this.owner = owner;
        this.options = {
            type     : options.type      || 'info',
            title    : options.title     || '',
            text     : options.text      || 'sample',
            timer    : options.timer     || 0,
            closable : options.closable  || true,
            container: options.container || "body" 
        };
        this.el = $(`<div class='banner banner--${this.options.type}'></div>`);
        if (this.options.title) {
            this.el.append($(`<p class="banner__title">${this.options.title}</p>`));
        }
        this.el.append(`<span class="banner__text">${this.options.text}</span>`);
        if (this.options.closable) {
            var iClose = $('<i class="banner__close fa fa-close"></i>');
            this.el.append(iClose);
            var master = this;
            iClose.on("click", function() {
                master.hide();
            });
        }
        $(this.options.container).append(this.el);


    }
};

$.banner = function(options) {
    var banner = Object.create(Banner);
    banner.init(options, this);

    return {
        
        show: function ( ) {
            banner.show( );
        },

        hide: function( options ) {
            banner.hide(  );
        }
        
    }
};
