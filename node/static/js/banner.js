var Banner = {
    el : {},

    options: {},

    owner: {},

    refactor:function() {
        this.options.container.find(".banner--visible").each(function (i, a) { $(a).css("top",i*84 + (i == 0? 0 : 12)) });
    },

    show: function() {
        if (this.el) {
            var master = this;
            this.el.addClass("banner--visible");

            this.refactor();

            this.el.animate(
                {left: "10%"}, 
                { complete: function(){ 
                    if (master.options.onShow) {
                        master.options.onShow(master);
                    }
                }
            });
                
            if (this.options.timer) {
                setTimeout(function() {master.hide()}, this.options.timer);
            }
        }
    },

    hide: function() {
        if (this.el) {
            var master = this;
            this.el.removeClass("banner--visible");
            
            this.el.animate(
                {'left' : "100%"},
                { complete: function(){ 
                    master.refactor();
                    if (master.options.onHide) {
                        master.options.onHide(master);
                    }
                    if (master.options.destroyWhenHide) {
                        master.dispose();
                    }
                }
                }
            );
        }
    },

    dispose: function() {
        if (this.el) {
            this.el.remove();
        }
        this.el = undefined;
    },

    getElement() {
        return this.el;
    },

    init: function(options, owner) {
        this.owner = owner;
        this.options = {
            type     : options.type      || 'info',
            title    : options.title     || '',
            text     : options.text      || 'sample',
            timer    : options.timer     || 0,
            container: options.container || $("body") ,
            onShow   : options.onShow,
            onHide   : options.onHide,
            destroyWhenHide: options.destroyWhenHide,
            closable : options.closable
        };

        if (this.options.closable === undefined) {
            this.options.closable = true;
        }

        this.el = $(`<div class='banner banner--${this.options.type}'></div>`);
        
        if (this.options.closable) {
            var iClose = $('<i class="banner__close fa fa-close"></i>');
            this.el.append(iClose);
            var master = this;
            iClose.on("click", function() {
                master.hide();
            });
        }

        if (this.options.title) {
            this.el.append($(`<p class="banner__title">${this.options.title}</p>`));
        }
        this.el.append(`<span class="banner__text">${this.options.text}</span>`);
        
        this.options.container.append(this.el);


    }
};

$banner = function(options) {
    var banner = Object.create(Banner);
    banner.init(options, this);

    return {
        
        show: function ( ) {
            banner.show( );
        },

        hide: function( options ) {
            banner.hide(  );
        },

        dispose: function() {
            banner.dispose();
        }
        
    }
};
