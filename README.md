# Dash - Yet Another jQuery Slider Plugin

A lightweight slider aimed at providing flexible configuration options.

Out-of-the-box, Dash offers clickable bullet navigation, next and prev controls, keyboard controls, slide callbacks and an available API.

## Future Development

The purpose behind Dash is to allow flexible configurations in regards to common sliders. Dash will evolve overtime with my future projects having slightly different requirements. Touch and responsive support is planned, as well as future additional configurations such as a carousel mode, different slide effects *(fade, slide)*, YouTube and Vimeo support, etc.

## Getting Started

Download the [production version][min] or the [development version][max], as well as the [compiled core css][css].

[min]: https://raw.github.com/joshuajones/dash/master/dist/dash.min.js
[max]: https://raw.github.com/joshuajones/dash/master/dist/dash.js
[css]: https://raw.github.com/joshuajones/dash/master/dist/dash.css

In your web page:

```html
<script src="jquery.js"></script>
<script src="dash.min.js"></script>
```

## Examples

To use Dash in it's simplest form, simply do the following:

```javascript
$('.slider-wrap').dash();
```

### Configuration Options

Of course Dash has a number of options you can alter. Defaults show below:

```javascript
$('.slider-wrap').dash({
  
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

  // Key Controls
  // Defaults to arrow keys
  keyControls: true,
  keymap: {
    prev: 37,
    next: 39,
    first: 38,
    last: 40
  },

  // Usability
  pauseOnHover: true

});
```

### Callbacks

Dash also comes with callback hooks:

```javascript
$('.slider-wrap').dash({
  before: function () {
    // Fires before the slide animation begins.
  },
  after: function () {
    // Fires after the slide animation has finished
  }
});
```

### API

For futher control over Dash, you can use Dash's API:

```javascript
var dashSlider = $('.slider-wrap').dash().data('api_dash');

$('button.next').on('click', dashSlider.next ); // Triggers next slide on any button with the class of next
```

The following Dash API is available:

- `next`: Triggers Dash to move forward one
- `prev`: Triggers Dash to move back one
- `goTo`: Triggers Dash to jump to a specific slide provided as a param

## Release History

* 2013-12-02   v0.1.0   Initial Dash jQuery Slider Plugin release 
