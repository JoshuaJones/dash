/*! dash - v0.1.0 - 2013-12-13
* https://github.com/joshuajones/dash
* Copyright (c) 2013 Joshua Jones; Licensed MIT */
;(function($) {

  // Polyfill for .bind()
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind
  if (!Function.prototype.bind) {
    Function.prototype.bind = function (oThis) {
      if (typeof this !== "function") {
        throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
      }

      var aArgs = Array.prototype.slice.call(arguments, 1),
          fToBind = this,
          Fnop = function () {},
          fBound = function () {
            return fToBind.apply(this instanceof Fnop && oThis ? this : oThis, aArgs.concat(Array.prototype.slice.call(arguments)));
          };

      Fnop.prototype = this.prototype;
      fBound.prototype = new Fnop();

      return fBound;
    };
  }

  var name = "dash",
      defaults = {

        // Animation
        animationTime: 400,

        // Autoplay
        autoplay: false,

        // Navigation
        nav: true,
        navWrapClass: 'dash-nav',
        navItemClass: 'dash-nav-item',
        navItemActiveClass: 'dash-nav-item-active',

        // Arrows
        controls: true,
        controlsWrapClass: 'dash-controls',
        controlsLeftClass: 'dash-controls-left',
        controlsRightClass: 'dash-controls-right',

        // Deep Linking
        deepLinking: true,

        // Key Controls
        keyControls: true,
        keymap: {
          prev: 37,
          next: 39,
          first: 38,
          last: 40
        },

        // Usability
        pauseOnHover: true

      };

  function Dash (el, options) {
    var self = this;

    this.el = el;
    this.$el = $(el);
    this.settings = $.extend({}, defaults, options);

    this.wrapper = this.$el.children();
    this.slides = this.wrapper.children();
    this.currentSlide = 0;

    // Plugin Data
    this._defaults = defaults;
    this._name = name;

    // Run
    this.init();
    this.build();
    this.autoPlay();

    // deepLinking
    if (this.settings.deepLinking) { this.pageLoadSlide(); }

    // Plugin Hooks
    $.each(this.settings, function (key, val) {
      if (typeof val === 'function') {
        this.$el.on(key + '.dash', val);
      }
    }.bind(this));

    // API
    return {
      currentSlide: function() {
        return -(self.currentSlide-1);
      },
      next: function (callback) {
        self.slide(1, false, callback);
      },
      prev: function (callback) {
        self.slide(-1, false, callback);
      },
      goTo: function (distance, callback) {
        self.slide(distance-1, true, callback);
      },
      autoPlay: function () {
        self.autoPlay();
      },
      autoPause: function () {
        self.autoPause();
      }
    };
  }

  Dash.prototype = {
    init: function () {
      var keymap = this.settings.keymap;

      // Set Wrapper Width
      this.wrapper.width( this.slides.length * this.slides.width() );

      // Keyboard Controls
      if(this.settings.keyControls) {
        $(document).on('keyup', function (e) {
          if(e.keyCode === keymap.prev) { this.slide(-1, false); }
          if(e.keyCode === keymap.next) { this.slide(1, false); }
          if(e.keyCode === keymap.first) { this.slide(0, true); }
          if(e.keyCode === keymap.last) { this.slide(this.slides.length-1, true); }
        }.bind(this));
      }

      // pauseOnHover
      if(this.settings.pauseOnHover) {
        this.$el.add(this.nav).add(this.controls).on('mouseover mouseout', function (e) {
          this.autoPause();
          if (e.type === 'mouseout') { this.autoPlay(); }
        }.bind(this));
      }

    },
    build: function () {
      if (this.settings.nav) { this.nav(); }
      if (this.settings.controls) { this.controls(); }
    },
    nav: function () {
      if (this.slides.length > 1) {
        var nav,
            navItems,
            item;

        // Create Nav Wrap
        nav = this.navWrapper = $('<div />', {
          'class': this.settings.navWrapClass
        }).appendTo(this.el);

        // Create nav items
        for (var i = 0, len = this.slides.length; i < len; i++) {
          item = $('<span />', {
            'class': this.settings.navItemClass,
            'data-distance': i,
            'html': i
          }).appendTo(nav);
        }

        // Add active class
        navItems = nav.children();
        navItems.eq(0).addClass(this.settings.navItemActiveClass);

        // Add events
        navItems.on('click', function (e) {
          this.slide( $(e.target).data('distance'), true );
          e.preventDefault();
        }.bind(this) );

      }
    },
    controls: function () {
      if (this.slides.length > 1) {
        var controlsWrap,
            controls;

        // Create controls wrap
        controlsWrap = this.controlsWrapper = $('<div />', {
          'class': this.settings.controlsWrapClass
        }).appendTo(this.el);

        // Create prev/next controls
        controlsWrap.left = $('<span />', {
          'class': this.settings.controlsLeftClass,
          'data-distance': -1,
          'html': 'Prev'
        }).appendTo(controlsWrap);

        controlsWrap.right = $('<span />', {
          'class': this.settings.controlsRightClass,
          'data-distance': 1,
          'html': 'Next'
        }).appendTo(controlsWrap);

        // Add events
        controls = controlsWrap.children();
        controls.on('click', function (e) {
          this.slide( $(e.target).data('distance') );
          e.preventDefault();
        }.bind(this) );

      }
    },
    slide: function (distance, goTo, callback) {
      var goToVal = goTo || false,
          current = (goToVal) ? 0 : this.currentSlide,
          slidesLen = -(this.slides.length-1),
          hash,
          move;

      // Trigger Before Hook
      this.$el.trigger('before.dash');

      // Clear Auto
      this.autoPause();

      // The logic for where slides should go
      if ( current === 0 && distance === -1 ) {
        current = slidesLen;
      } else if ( current === slidesLen && distance === 1 ) {
        current = 0;
      } else {
        current = current + (-distance);
      }
      move = this.slides.width() * current + 'px';

      // Animate Slide
      this.wrapper.stop().animate({
        'margin-left': move
      }, this.animationTime, function () {
        // Trigger After Hook
        this.$el.trigger('after.dash');
      }.bind(this));

      // Update nav
      if (this.nav) {
        this.navWrapper.children().removeClass(this.settings.navItemActiveClass)
                                  .eq(-current).addClass(this.settings.navItemActiveClass);
      }

      // Update currentSlide value
      this.currentSlide = current;

      if ( (callback !== 'undefined') && (typeof callback === 'function') ) {
        callback();
      }

      // deepLinking url update without history addition
      if ( this.settings.deepLinking ) {
        hash = -(current-1);
        window.history.replaceState('', '', '#'+hash);
      }

      // Start auto
      this.autoPlay();
    },
    autoPlay: function () {
      if (this.settings.autoplay) {
        this.auto = setInterval(function () {
          this.slide(1);
        }.bind(this), this.settings.autoplay);
      }
    },
    autoPause: function () {
      if (this.settings.autoplay) {
        this.auto = clearInterval(this.auto);
      }
    },
    pageLoadSlide: function () {
      var num = document.location.hash.replace('#', '');

      if ( num !== '' && num <= this.slides.length && num > 0 ) {
        this.slide(num-1, true);
      }
    }
  };

  $.fn[name] = function (options) {
    return this.each(function () {
      if ( !$.data(this, "api_" + name) ) {
        $.data( this, "api_" + name, new Dash(this, options));
      }
    });
  };

}(jQuery));
