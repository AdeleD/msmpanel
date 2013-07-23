// jquery.msmpanel.js
// version : 1.0
// author : Adele Delamarche
// developped for : Mamasam (http://www.mamasam.com/)
// github.com/adeleD/msmpanel


// Panel object
var Panel = {
	init: function(options, elem) {
		this.elem  = elem;
		this.$elem = $(elem);
		this.state = 'closed';

		return this;
	}
};


;(function($) {

	var panel, state, opts, element, prevElement, body;

	$.fn.msmpanel = function(options) {

		if (!$(this).length) {
			return this;
		} else {

			$.fn.msmpanel.defaults = {
				position: "left",
				size: 280,
				state: "closed",
				duration: 250,
				mode: '',
				showCloseButton: false,
				onPanelOpen: function(el) {},
				onPanelClose: function(el) {}
			};
			opts = $.extend({}, $.fn.msmpanel.defaults, options);

			// prevent against multiple instantiations
			if (!$.data(this, 'msmpanel')) {
				return this.each(function() {

					$(this).on('click', function(e) {
						element = $(this);
						$.msmpanel.build();
						$.msmpanel.toggle();

						// Create a new panel object via the Prototypal Object.create
						var myPanel = Object.create(Panel);
						// Run the initialization function
						myPanel.init(opts, this);
						// Save the instance of the panel
						$.data(this, 'msmpanel', myPanel);

						e.preventDefault();
					});

				});
			}

		}

	};


	$.msmpanel = function() {
		return panel;
	};


	$.msmpanel.open = function(noWait) {
		var animation_options = {};
		animation_options[opts.position] = 0;



		if (noWait) {
			panel.show().addClass('loading').animate(animation_options, 250);
			state = 'opened';

			//if the animation mode is set to push, we move the body in relation to the panel
			//else the panel is overlayed on top of the body
			if (opts.mode == 'push') {
				//animate the body position in relation to the panel dimensions
				var body_options = {};
				body_options[opts.position] = opts.size + (typeof(opts.size) == 'number' ? 'px' : '');
				body.css('position', 'absolute').animate(body_options, 250);
				body.css('width', $(window).width());
			}
		} else {
			setTimeout((function() {
				panel.show().addClass('loading').animate(animation_options, 250);
				state = 'opened';

				//if the animation mode is set to push, we move the body in relation to the panel
				//else the panel is overlayed on top of the body
				if (opts.mode == 'push') {
					//animate the body position in relation to the panel dimensions
					var body_options = {};
					body_options[opts.position] = opts.size + (typeof(opts.size) == 'number' ? 'px' : '');
					body.css('position', 'absolute').animate(body_options, 250);
					body.css('width', $(window).width());
				}
			}), 200);
		}

		//get the target url
		var href = element.attr('href');
		//load the content from the target url, and update the panel html
		$('.slidepanel-wrapper', panel).empty().load(href, function(response, status, xhr) {
			panel.removeClass('loading');
			if (status == "error") {
				opts.onError(element, xhr);
			} else {
				opts.onPanelOpen(element);
			}
		});

		prevElement = element;
	};


	$.msmpanel.close = function() {
		var animation_options = {};

		if (opts.position == 'left' || opts.position == 'right') {
			animation_options[opts.position] = -(panel.width());
		} else if (opts.position == 'top' || opts.position == 'bottom') {
			animation_options[opts.position] = -(panel.height());
		}

		panel.animate(animation_options, 150, function() {
			panel.hide();
		});
		state = 'closed';

		//if the animation mode is push, move the document body back to it's original position
		if (opts.mode == 'push') {
			var body_options = {};
			body_options[opts.position] = '0' + (typeof(opts.size) == 'number' ? 'px' : '%');
			body.animate(body_options, 150, function(){
				body.css('width', '');
			});
		}

		opts.onPanelClose(prevElement);
	};


	$.msmpanel.toggle = function() {
		if (prevElement !== undefined) {
			if (element[0] != prevElement[0]) {
				if (state == 'opened') {
					$.msmpanel.close();
					$.msmpanel.open();
				} else {
					$.msmpanel.open(true);
				}
			} else if (element[0] == prevElement[0]) {
				if (state == 'opened') {
					$.msmpanel.close();
				} else {
					$.msmpanel.open(true);
				}
			}
		} else {
			$.msmpanel.open(true);
		}
	};


	$.msmpanel.build = function() {
		if (!panel) {
			body = $('body');
			panel = $('<div id="slidepanel" class="slidepanel"><div class="slidepanel-wrapper"></div></div>');
			body.append(panel);
			panel.hide().addClass('panel_' + opts.position);

			if (opts.mode == 'push') {
				panel.css('box-shadow', '2px 0px 10px 0px #cfcfcf inset');
			}

			//reset any defined a positions
			panel.css('left', '').css('right', '').css('top', '').css('bottom', '');

			//set a default top value for left and right orientations
			//and set the starting position based on element width
			if (opts.position == 'left' || opts.position == 'right') {
				panel.css('top', 0);
				panel.css('width', opts.size + (typeof(opts.size) == 'number' ? 'px' : ''));
				panel.css(opts.position, -(panel.width()));
			}

			//set a default left value for top and bottom orientations
			//and set the starting position based on element height
			if (opts.position == 'top' || opts.position == 'bottom') {
				panel.css('left', 0);
				panel.css('height', opts.size + (typeof(opts.size) == 'number' ? 'px' : ''));
				panel.css(opts.position, -(panel.height()));
			}


			if (opts.showCloseButton === true) {
				$('#slidepanel').prepend('<a href="#" class="slidepanel-close"><img src="/img/slidepanel-close.jpg"/></a>');
			}
		}
	};

})(jQuery);



// Make sure Object.create is available in the browser (for prototypal inheritance)
// Note this is not entirely equal to native Object.create, but compatible with our use-case
if (typeof Object.create !== 'function') {
		Object.create = function (o) {
			function F() {} // optionally move this outside the declaration and into a closure if you need more speed.
			F.prototype = o;
			return new F();
		};
}