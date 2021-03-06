"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _videoJs = require('video.js');

var _videoJs2 = _interopRequireDefault(_videoJs);

var QualitySelector = (function () {
	function QualitySelector(player) {
		_classCallCheck(this, QualitySelector);

		this.player = player;
		this.sources = [];
		this.callback = undefined;
		this.containerDropdownElement = undefined;
		this.defaults = {};
	}

	/**
  * A video.js plugin.
  *
  * In the plugin function, the value of `this` is a video.js `Player`
  * instance. You cannot rely on the player being in a "ready" state here,
  * depending on how the plugin is invoked. This may or may not be important
  * to you; if not, remove the wait for "ready"!
  *
  * @function qualityselector
  * @param    {Object} [options={}]
  *           An object of options left to the plugin author to define.
  */

	/**
  * event on selected the quality
  */

	_createClass(QualitySelector, [{
		key: "onQualitySelect",
		value: function onQualitySelect(quality) {
			var _this = this;

			if (this.callback) {
				this.callback(quality);
			};

			if (this.sources) {
				// tries to find the source with this quality
				var source = this.sources.find(function (source) {
					return source.format == quality.code;
				});

				if (source) {
					this.player.src({ src: source.src, type: source.type });

					this.player.on("loadedmetadata", function () {
						_this.player.play();
					});
				}
			}

			this.onToggleDropdown();
		}
	}, {
		key: "onToggleDropdown",

		/**
   * show or hide the dropdown
   */
		value: function onToggleDropdown() {
			if (this.containerDropdownElement.className.indexOf("show") == -1) {
				this.containerDropdownElement.className += " show";
			} else {
				this.containerDropdownElement.className = this.containerDropdownElement.className.replace(" show", "");
			}
		}
	}, {
		key: "onPlayerReady",

		/**
   * Function to invoke when the player is ready.
   *
   * This is a great place for your plugin to initialize itself. When this
   * function is called, the player will have its DOM and child components
   * in place.
   *
   * @function onPlayerReady
   * @param    {Player} player
   * @param    {Object} [options={}]
   */
		value: function onPlayerReady(options) {
			var _this2 = this;

			this.containerDropdownElement = document.createElement("div");
			this.containerDropdownElement.className = "vjs-quality-dropdown";

			var containerElement = document.createElement("div");
			containerElement.className = "vjs-quality-container";

			var buttonElement = document.createElement("button");
			buttonElement.className = "vjs-brand-quality-link";
			buttonElement.onclick = function (event) {
				return _this2.onToggleDropdown(event);
			};
			buttonElement.innerText = options.text || "Quality";

			var ulElement = document.createElement("ul");

			if (!options.formats) {
				options.formats = [{ code: 'auto', name: 'Auto' }];
			}

			if (options.onFormatSelected) {
				this.callback = options.onFormatSelected;
			}

			if (options.sources) {
				this.sources = options.sources;
			}

			options.formats.map(function (format) {
				var liElement = document.createElement("li");

				var linkElement = document.createElement("a");
				linkElement.innerText = format.name;
				linkElement.setAttribute("href", "#");
				linkElement.addEventListener("click", function (event) {
					event.preventDefault();
					_this2.onQualitySelect(format);
				});

				liElement.appendChild(linkElement);
				ulElement.appendChild(liElement);
			});

			this.containerDropdownElement.appendChild(ulElement);
			containerElement.appendChild(this.containerDropdownElement);
			containerElement.appendChild(buttonElement);

			this.player.controlBar.el().insertBefore(containerElement, this.player.controlBar.fullscreenToggle.el());

			this.player.addClass('vjs-qualityselector');
		}
	}]);

	return QualitySelector;
})();

var qualityselector = function qualityselector(options) {
	var _this3 = this;

	this.ready(function () {
		var player = _this3;
		var qualityControl = new QualitySelector(player);
		qualityControl.onPlayerReady(_videoJs2["default"].mergeOptions(qualityControl.defaults, options));
	});
};

// Register the plugin with video.js.
_videoJs2["default"].registerPlugin('qualityselector', qualityselector);

// Include the version number.
qualityselector.VERSION = '__VERSION__';

exports["default"] = qualityselector;
module.exports = exports["default"];