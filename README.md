MSMpanel
====================

A Javascript panel for your UI
---------------------

MSMpanel is an expandable panel.
The panel can be opened by clicking on any custom element of the page.
Thanks to options, you can choose to expand your panel over content or by pushing it.
For other options see section bellow.

### How to use ?

#### HTML code

`<a href="http://www.example.com/content-to-load.json" class="open">Open panel</a>`
The href attribute will be used to load content inside the panel.

#### Javascript code

`$('a.open').msmpanel({});`

### Options

You can use various options for your panel :
* position [String] - position of the panel. It can be : "top", "right", "bottom" or "left"
* size [Number] - the size for the panel
* state [String] - the initial state of the panel. It can be : "opened" or "closed"
* duration [Number] - duration time for the animation of the panel
* mode [String] - the way of expanding the panel. It can be : "push" or leave blank to open the panel over content
* showCloseButton [Boolean] - add close button to the panel. True or false
* onPanelOpen [Function] - a function called after panel was opened
* onPanelOpen [Function] - a function called after panel was closed

#### Default options are :
* position: "left",
* size: 280,
* state: "closed",
* duration: 250,
* mode: '',
* showCloseButton: false,
* onPanelOpen: function(el) {},
* onPanelClose: function(el) {}