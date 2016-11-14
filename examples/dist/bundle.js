require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Select = require('./Select');

var _Select2 = _interopRequireDefault(_Select);

var _utilsStripDiacritics = require('./utils/stripDiacritics');

var _utilsStripDiacritics2 = _interopRequireDefault(_utilsStripDiacritics);

var requestId = 0;

function initCache(cache) {
	if (cache && typeof cache !== 'object') {
		cache = {};
	}
	return cache ? cache : null;
}

function updateCache(cache, input, data) {
	if (!cache) return;
	cache[input] = data;
}

function getFromCache(cache, input) {
	if (!cache) return;
	for (var i = input.length; i >= 0; --i) {
		var cacheKey = input.slice(0, i);
		if (cache[cacheKey] && (input === cacheKey || cache[cacheKey].complete)) {
			return cache[cacheKey];
		}
	}
}

function thenPromise(promise, callback) {
	if (!promise || typeof promise.then !== 'function') return;
	return promise.then(function (data) {
		callback(null, data);
	}, function (err) {
		callback(err);
	});
}

var stringOrNode = _react2['default'].PropTypes.oneOfType([_react2['default'].PropTypes.string, _react2['default'].PropTypes.node]);

var Async = _react2['default'].createClass({
	displayName: 'Async',

	propTypes: {
		cache: _react2['default'].PropTypes.any, // object to use to cache results, can be null to disable cache
		children: _react2['default'].PropTypes.func, // Child function responsible for creating the inner Select component; (props: Object): PropTypes.element
		ignoreAccents: _react2['default'].PropTypes.bool, // whether to strip diacritics when filtering (shared with Select)
		ignoreCase: _react2['default'].PropTypes.bool, // whether to perform case-insensitive filtering (shared with Select)
		isLoading: _react2['default'].PropTypes.bool, // overrides the isLoading state when set to true
		loadOptions: _react2['default'].PropTypes.func.isRequired, // function to call to load options asynchronously
		loadingPlaceholder: _react2['default'].PropTypes.string, // replaces the placeholder while options are loading
		minimumInput: _react2['default'].PropTypes.number, // the minimum number of characters that trigger loadOptions
		noResultsText: stringOrNode, // placeholder displayed when there are no matching search results (shared with Select)
		onInputChange: _react2['default'].PropTypes.func, // onInputChange handler: function (inputValue) {}
		placeholder: stringOrNode, // field placeholder, displayed when there's no value (shared with Select)
		searchPromptText: stringOrNode, // label to prompt for search input
		searchingText: _react2['default'].PropTypes.string },
	// message to display while options are loading
	getDefaultProps: function getDefaultProps() {
		return {
			cache: true,
			ignoreAccents: true,
			ignoreCase: true,
			loadingPlaceholder: 'Loading...',
			minimumInput: 0,
			searchingText: 'Searching...',
			searchPromptText: 'Type to search'
		};
	},
	getInitialState: function getInitialState() {
		return {
			cache: initCache(this.props.cache),
			isLoading: false,
			options: []
		};
	},
	componentWillMount: function componentWillMount() {
		this._lastInput = '';
	},
	componentDidMount: function componentDidMount() {
		this.loadOptions('');
	},
	componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
		if (nextProps.cache !== this.props.cache) {
			this.setState({
				cache: initCache(nextProps.cache)
			});
		}
	},
	focus: function focus() {
		this.select.focus();
	},
	resetState: function resetState() {
		this._currentRequestId = -1;
		this.setState({
			isLoading: false,
			options: []
		});
	},
	getResponseHandler: function getResponseHandler(input) {
		var _this = this;

		var _requestId = this._currentRequestId = requestId++;
		return function (err, data) {
			if (err) throw err;
			if (!_this.isMounted()) return;
			updateCache(_this.state.cache, input, data);
			if (_requestId !== _this._currentRequestId) return;
			_this.setState({
				isLoading: false,
				options: data && data.options || []
			});
		};
	},
	loadOptions: function loadOptions(input) {
		if (this.props.onInputChange) {
			var nextState = this.props.onInputChange(input);
			// Note: != used deliberately here to catch undefined and null
			if (nextState != null) {
				input = '' + nextState;
			}
		}
		if (this.props.ignoreAccents) input = (0, _utilsStripDiacritics2['default'])(input);
		if (this.props.ignoreCase) input = input.toLowerCase();

		this._lastInput = input;
		if (input.length < this.props.minimumInput) {
			return this.resetState();
		}
		var cacheResult = getFromCache(this.state.cache, input);
		if (cacheResult && Array.isArray(cacheResult.options)) {
			return this.setState({
				options: cacheResult.options
			});
		}
		this.setState({
			isLoading: true
		});
		var responseHandler = this.getResponseHandler(input);
		var inputPromise = thenPromise(this.props.loadOptions(input, responseHandler), responseHandler);
		return inputPromise ? inputPromise.then(function () {
			return input;
		}) : input;
	},
	render: function render() {
		var _this2 = this;

		var _props = this.props;
		var _props$children = _props.children;
		var children = _props$children === undefined ? defaultChildren : _props$children;
		var noResultsText = _props.noResultsText;

		var restProps = _objectWithoutProperties(_props, ['children', 'noResultsText']);

		var _state = this.state;
		var isLoading = _state.isLoading;
		var options = _state.options;

		if (this.props.isLoading) isLoading = true;
		var placeholder = isLoading ? this.props.loadingPlaceholder : this.props.placeholder;
		if (isLoading) {
			noResultsText = this.props.searchingText;
		} else if (!options.length && this._lastInput.length < this.props.minimumInput) {
			noResultsText = this.props.searchPromptText;
		}

		var props = _extends({}, restProps, {
			isLoading: isLoading,
			noResultsText: noResultsText,
			onInputChange: this.loadOptions,
			options: options,
			placeholder: placeholder,
			ref: function ref(_ref) {
				_this2.select = _ref;
			}
		});

		return children(props);
	}
});

function defaultChildren(props) {
	return _react2['default'].createElement(_Select2['default'], props);
};

module.exports = Async;

},{"./Select":"react-select-plus","./utils/stripDiacritics":11,"react":undefined}],2:[function(require,module,exports){
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Select = require('./Select');

var _Select2 = _interopRequireDefault(_Select);

var AsyncCreatable = _react2['default'].createClass({
	displayName: 'AsyncCreatableSelect',

	render: function render() {
		var _this = this;

		return _react2['default'].createElement(
			_Select2['default'].Async,
			this.props,
			function (asyncProps) {
				return _react2['default'].createElement(
					_Select2['default'].Creatable,
					_this.props,
					function (creatableProps) {
						return _react2['default'].createElement(_Select2['default'], _extends({}, asyncProps, creatableProps, {
							onInputChange: function (input) {
								creatableProps.onInputChange(input);
								return asyncProps.onInputChange(input);
							},
							ref: function (ref) {
								creatableProps.ref(ref);
								asyncProps.ref(ref);
							}
						}));
					}
				);
			}
		);
	}
});

module.exports = AsyncCreatable;

},{"./Select":"react-select-plus","react":undefined}],3:[function(require,module,exports){
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Select = require('./Select');

var _Select2 = _interopRequireDefault(_Select);

var _utilsDefaultFilterOptions = require('./utils/defaultFilterOptions');

var _utilsDefaultFilterOptions2 = _interopRequireDefault(_utilsDefaultFilterOptions);

var _utilsDefaultMenuRenderer = require('./utils/defaultMenuRenderer');

var _utilsDefaultMenuRenderer2 = _interopRequireDefault(_utilsDefaultMenuRenderer);

var Creatable = _react2['default'].createClass({
	displayName: 'CreatableSelect',

	propTypes: {
		// Child function responsible for creating the inner Select component
		// This component can be used to compose HOCs (eg Creatable and Async)
		// (props: Object): PropTypes.element
		children: _react2['default'].PropTypes.func,

		// See Select.propTypes.filterOptions
		filterOptions: _react2['default'].PropTypes.any,

		// Searches for any matching option within the set of options.
		// This function prevents duplicate options from being created.
		// ({ option: Object, options: Array, labelKey: string, valueKey: string }): boolean
		isOptionUnique: _react2['default'].PropTypes.func,

		// Determines if the current input text represents a valid option.
		// ({ label: string }): boolean
		isValidNewOption: _react2['default'].PropTypes.func,

		// See Select.propTypes.menuRenderer
		menuRenderer: _react2['default'].PropTypes.any,

		// Factory to create new option.
		// ({ label: string, labelKey: string, valueKey: string }): Object
		newOptionCreator: _react2['default'].PropTypes.func,

		// See Select.propTypes.options
		options: _react2['default'].PropTypes.array,

		// Creates prompt/placeholder option text.
		// (filterText: string): string
		promptTextCreator: _react2['default'].PropTypes.func,

		// Decides if a keyDown event (eg its `keyCode`) should result in the creation of a new option.
		shouldKeyDownEventCreateNewOption: _react2['default'].PropTypes.func
	},

	// Default prop methods
	statics: {
		isOptionUnique: isOptionUnique,
		isValidNewOption: isValidNewOption,
		newOptionCreator: newOptionCreator,
		promptTextCreator: promptTextCreator,
		shouldKeyDownEventCreateNewOption: shouldKeyDownEventCreateNewOption
	},

	getDefaultProps: function getDefaultProps() {
		return {
			filterOptions: _utilsDefaultFilterOptions2['default'],
			isOptionUnique: isOptionUnique,
			isValidNewOption: isValidNewOption,
			menuRenderer: _utilsDefaultMenuRenderer2['default'],
			newOptionCreator: newOptionCreator,
			promptTextCreator: promptTextCreator,
			shouldKeyDownEventCreateNewOption: shouldKeyDownEventCreateNewOption
		};
	},

	createNewOption: function createNewOption() {
		var _props = this.props;
		var isValidNewOption = _props.isValidNewOption;
		var newOptionCreator = _props.newOptionCreator;
		var _props$options = _props.options;
		var options = _props$options === undefined ? [] : _props$options;
		var shouldKeyDownEventCreateNewOption = _props.shouldKeyDownEventCreateNewOption;

		if (isValidNewOption({ label: this.inputValue })) {
			var option = newOptionCreator({ label: this.inputValue, labelKey: this.labelKey, valueKey: this.valueKey });
			var _isOptionUnique = this.isOptionUnique({ option: option });

			// Don't add the same option twice.
			if (_isOptionUnique) {
				options.unshift(option);

				this.select.selectValue(option);
			}
		}
	},

	filterOptions: function filterOptions() {
		var _props2 = this.props;
		var filterOptions = _props2.filterOptions;
		var isValidNewOption = _props2.isValidNewOption;
		var options = _props2.options;
		var promptTextCreator = _props2.promptTextCreator;

		// TRICKY Check currently selected options as well.
		// Don't display a create-prompt for a value that's selected.
		// This covers async edge-cases where a newly-created Option isn't yet in the async-loaded array.
		var excludeOptions = arguments[2] || [];

		var filteredOptions = filterOptions.apply(undefined, arguments) || [];

		if (isValidNewOption({ label: this.inputValue })) {
			var _newOptionCreator = this.props.newOptionCreator;

			var option = _newOptionCreator({
				label: this.inputValue,
				labelKey: this.labelKey,
				valueKey: this.valueKey
			});

			// TRICKY Compare to all options (not just filtered options) in case option has already been selected).
			// For multi-selects, this would remove it from the filtered list.
			var _isOptionUnique2 = this.isOptionUnique({
				option: option,
				options: excludeOptions.concat(filteredOptions)
			});

			if (_isOptionUnique2) {
				var _prompt = promptTextCreator(this.inputValue);

				this._createPlaceholderOption = _newOptionCreator({
					label: _prompt,
					labelKey: this.labelKey,
					valueKey: this.valueKey
				});

				filteredOptions.unshift(this._createPlaceholderOption);
			}
		}

		return filteredOptions;
	},

	isOptionUnique: function isOptionUnique(_ref2) {
		var option = _ref2.option;
		var options = _ref2.options;
		var isOptionUnique = this.props.isOptionUnique;

		options = options || this.select.filterFlatOptions();

		return isOptionUnique({
			labelKey: this.labelKey,
			option: option,
			options: options,
			valueKey: this.valueKey
		});
	},

	menuRenderer: function menuRenderer(params) {
		var menuRenderer = this.props.menuRenderer;

		return menuRenderer(_extends({}, params, {
			onSelect: this.onOptionSelect
		}));
	},

	onInputChange: function onInputChange(input) {
		// This value may be needed in between Select mounts (when this.select is null)
		this.inputValue = input;
	},

	onInputKeyDown: function onInputKeyDown(event) {
		var shouldKeyDownEventCreateNewOption = this.props.shouldKeyDownEventCreateNewOption;

		var focusedOption = this.select.getFocusedOption();

		if (focusedOption && focusedOption === this._createPlaceholderOption && shouldKeyDownEventCreateNewOption({ keyCode: event.keyCode })) {
			this.createNewOption();

			// Prevent decorated Select from doing anything additional with this keyDown event
			event.preventDefault();
		}
	},

	onOptionSelect: function onOptionSelect(option, event) {
		if (option === this._createPlaceholderOption) {
			this.createNewOption();
		} else {
			this.select.selectValue(option);
		}
	},

	render: function render() {
		var _this = this;

		var _props3 = this.props;
		var _props3$children = _props3.children;
		var children = _props3$children === undefined ? defaultChildren : _props3$children;
		var newOptionCreator = _props3.newOptionCreator;
		var shouldKeyDownEventCreateNewOption = _props3.shouldKeyDownEventCreateNewOption;

		var restProps = _objectWithoutProperties(_props3, ['children', 'newOptionCreator', 'shouldKeyDownEventCreateNewOption']);

		var props = _extends({}, restProps, {
			allowCreate: true,
			filterOptions: this.filterOptions,
			menuRenderer: this.menuRenderer,
			onInputChange: this.onInputChange,
			onInputKeyDown: this.onInputKeyDown,
			ref: function ref(_ref) {
				_this.select = _ref;

				// These values may be needed in between Select mounts (when this.select is null)
				if (_ref) {
					_this.labelKey = _ref.props.labelKey;
					_this.valueKey = _ref.props.valueKey;
				}
			}
		});

		return children(props);
	}
});

function defaultChildren(props) {
	return _react2['default'].createElement(_Select2['default'], props);
};

function isOptionUnique(_ref3) {
	var option = _ref3.option;
	var options = _ref3.options;
	var labelKey = _ref3.labelKey;
	var valueKey = _ref3.valueKey;

	return options.filter(function (existingOption) {
		return existingOption[labelKey] === option[labelKey] || existingOption[valueKey] === option[valueKey];
	}).length === 0;
};

function isValidNewOption(_ref4) {
	var label = _ref4.label;

	return !!label;
};

function newOptionCreator(_ref5) {
	var label = _ref5.label;
	var labelKey = _ref5.labelKey;
	var valueKey = _ref5.valueKey;

	var option = {};
	option[valueKey] = label;
	option[labelKey] = label;
	option.className = 'Select-create-option-placeholder';
	return option;
};

function promptTextCreator(label) {
	return 'Create option "' + label + '"';
}

function shouldKeyDownEventCreateNewOption(_ref6) {
	var keyCode = _ref6.keyCode;

	switch (keyCode) {
		case 9: // TAB
		case 13: // ENTER
		case 188:
			// COMMA
			return true;
	}

	return false;
};

module.exports = Creatable;

},{"./Select":"react-select-plus","./utils/defaultFilterOptions":9,"./utils/defaultMenuRenderer":10,"react":undefined}],4:[function(require,module,exports){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var Dropdown = _react2['default'].createClass({
  displayName: 'Dropdown',

  propTypes: {
    children: _react2['default'].PropTypes.node
  },
  render: function render() {
    // This component adds no markup
    return this.props.children;
  }
});

module.exports = Dropdown;

},{"react":undefined}],5:[function(require,module,exports){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var Option = _react2['default'].createClass({
	displayName: 'Option',

	propTypes: {
		children: _react2['default'].PropTypes.node,
		className: _react2['default'].PropTypes.string, // className (based on mouse position)
		instancePrefix: _react2['default'].PropTypes.string.isRequired, // unique prefix for the ids (used for aria)
		isDisabled: _react2['default'].PropTypes.bool, // the option is disabled
		isFocused: _react2['default'].PropTypes.bool, // the option is focused
		isSelected: _react2['default'].PropTypes.bool, // the option is selected
		onFocus: _react2['default'].PropTypes.func, // method to handle mouseEnter on option element
		onSelect: _react2['default'].PropTypes.func, // method to handle click on option element
		onUnfocus: _react2['default'].PropTypes.func, // method to handle mouseLeave on option element
		option: _react2['default'].PropTypes.object.isRequired, // object that is base for that option
		optionIndex: _react2['default'].PropTypes.number },
	// index of the option, used to generate unique ids for aria
	blockEvent: function blockEvent(event) {
		event.preventDefault();
		event.stopPropagation();
		if (event.target.tagName !== 'A' || !('href' in event.target)) {
			return;
		}
		if (event.target.target) {
			window.open(event.target.href, event.target.target);
		} else {
			window.location.href = event.target.href;
		}
	},

	handleMouseDown: function handleMouseDown(event) {
		event.preventDefault();
		event.stopPropagation();
		this.props.onSelect(this.props.option, event);
	},

	handleMouseEnter: function handleMouseEnter(event) {
		this.onFocus(event);
	},

	handleMouseMove: function handleMouseMove(event) {
		this.onFocus(event);
	},

	handleTouchEnd: function handleTouchEnd(event) {
		// Check if the view is being dragged, In this case
		// we don't want to fire the click event (because the user only wants to scroll)
		if (this.dragging) return;

		this.handleMouseDown(event);
	},

	handleTouchMove: function handleTouchMove(event) {
		// Set a flag that the view is being dragged
		this.dragging = true;
	},

	handleTouchStart: function handleTouchStart(event) {
		// Set a flag that the view is not being dragged
		this.dragging = false;
	},

	onFocus: function onFocus(event) {
		if (!this.props.isFocused) {
			this.props.onFocus(this.props.option, event);
		}
	},
	render: function render() {
		var _props = this.props;
		var option = _props.option;
		var instancePrefix = _props.instancePrefix;
		var optionIndex = _props.optionIndex;

		var className = (0, _classnames2['default'])(this.props.className, option.className);

		return option.disabled ? _react2['default'].createElement(
			'div',
			{ className: className,
				onMouseDown: this.blockEvent,
				onClick: this.blockEvent },
			this.props.children
		) : _react2['default'].createElement(
			'div',
			{ className: className,
				style: option.style,
				role: 'option',
				onMouseDown: this.handleMouseDown,
				onMouseEnter: this.handleMouseEnter,
				onMouseMove: this.handleMouseMove,
				onTouchStart: this.handleTouchStart,
				onTouchMove: this.handleTouchMove,
				onTouchEnd: this.handleTouchEnd,
				id: instancePrefix + '-option-' + optionIndex,
				title: option.title },
			this.props.children
		);
	}
});

module.exports = Option;

},{"classnames":undefined,"react":undefined}],6:[function(require,module,exports){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var OptionGroup = _react2['default'].createClass({
	displayName: 'OptionGroup',

	propTypes: {
		children: _react2['default'].PropTypes.any,
		className: _react2['default'].PropTypes.string, // className (based on mouse position)
		isDisabled: _react2['default'].PropTypes.bool, // the option is disabled
		isFocused: _react2['default'].PropTypes.bool, // method to handle mouseEnter on option group label element
		isFocused: _react2['default'].PropTypes.bool, // the option group is focused
		isSelected: _react2['default'].PropTypes.bool, // the option group is selected
		label: _react2['default'].PropTypes.node, // the heading to show above the child options
		onFocus: _react2['default'].PropTypes.func, // provide the onFocus function to highlight if selectGroup
		onSelect: _react2['default'].PropTypes.func, // provide the onSelect function to select group if selectGroup
		option: _react2['default'].PropTypes.object.isRequired, // object that is base for that option group
		selectGroup: _react2['default'].PropTypes.bool },

	// option to allow Groups to be selected
	blockEvent: function blockEvent(event) {
		event.preventDefault();
		event.stopPropagation();
		if (event.target.tagName !== 'A' || !('href' in event.target)) {
			return;
		}
		if (event.target.target) {
			window.open(event.target.href, event.target.target);
		} else {
			window.location.href = event.target.href;
		}
	},

	handleMouseDown: function handleMouseDown(event) {
		var selectGroup = this.props.selectGroup;

		event.preventDefault();
		event.stopPropagation();
		if (selectGroup) this.props.onSelect(this.props.option, event);
	},

	handleMouseEnter: function handleMouseEnter(event) {
		var selectGroup = this.props.selectGroup;

		if (selectGroup) this.onFocus(event);
	},

	handleMouseMove: function handleMouseMove(event) {
		var selectGroup = this.props.selectGroup;

		if (selectGroup) this.onFocus(event);
	},

	handleTouchEnd: function handleTouchEnd(event) {
		// Check if the view is being dragged, In this case
		// we don't want to fire the click event (because the user only wants to scroll)
		if (this.dragging) return;

		this.handleMouseDown(event);
	},

	handleTouchMove: function handleTouchMove(event) {
		// Set a flag that the view is being dragged
		this.dragging = true;
	},

	handleTouchStart: function handleTouchStart(event) {
		// Set a flag that the view is not being dragged
		this.dragging = false;
	},

	onFocus: function onFocus(event) {
		if (!this.props.isFocused) {
			this.props.onFocus(this.props.option, event);
		}
	},

	render: function render() {
		var _props = this.props;
		var option = _props.option;
		var selectGroup = _props.selectGroup;
		var isFocused = _props.isFocused;
		var isDisabled = _props.isDisabled;

		var className = (0, _classnames2['default'])(this.props.className, option.className);

		var groupLabelClassName = (0, _classnames2['default'])({
			'Select-option-group-label': true,
			'Select-option-group-label-selectable': selectGroup,
			'is-focused': isFocused,
			'is-disabled': isDisabled
		});

		return option.disabled ? _react2['default'].createElement(
			'div',
			{ className: className,
				onMouseDown: this.blockEvent,
				onClick: this.blockEvent },
			this.props.children
		) : _react2['default'].createElement(
			'div',
			{ className: className,
				style: option.style,
				onMouseDown: this.handleMouseDown,

				onTouchStart: this.handleTouchStart,
				onTouchMove: this.handleTouchMove,
				onTouchEnd: this.handleTouchEnd,
				title: option.title },
			_react2['default'].createElement(
				'div',
				{
					className: groupLabelClassName,
					onMouseEnter: this.handleMouseEnter,
					onMouseMove: this.handleMouseMove
				},
				this.props.label
			),
			this.props.children
		);
	}
});

module.exports = OptionGroup;

},{"classnames":undefined,"react":undefined}],7:[function(require,module,exports){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var Value = _react2['default'].createClass({

	displayName: 'Value',

	propTypes: {
		children: _react2['default'].PropTypes.node,
		disabled: _react2['default'].PropTypes.bool, // disabled prop passed to ReactSelect
		id: _react2['default'].PropTypes.string, // Unique id for the value - used for aria
		onClick: _react2['default'].PropTypes.func, // method to handle click on value label
		onRemove: _react2['default'].PropTypes.func, // method to handle removal of the value
		value: _react2['default'].PropTypes.object.isRequired },

	// the option object for this value
	handleMouseDown: function handleMouseDown(event) {
		if (event.type === 'mousedown' && event.button !== 0) {
			return;
		}
		if (this.props.onClick) {
			event.stopPropagation();
			this.props.onClick(this.props.value, event);
			return;
		}
		if (this.props.value.href) {
			event.stopPropagation();
		}
	},

	onRemove: function onRemove(event) {
		event.preventDefault();
		event.stopPropagation();
		this.props.onRemove(this.props.value);
	},

	handleTouchEndRemove: function handleTouchEndRemove(event) {
		// Check if the view is being dragged, In this case
		// we don't want to fire the click event (because the user only wants to scroll)
		if (this.dragging) return;

		// Fire the mouse events
		this.onRemove(event);
	},

	handleTouchMove: function handleTouchMove(event) {
		// Set a flag that the view is being dragged
		this.dragging = true;
	},

	handleTouchStart: function handleTouchStart(event) {
		// Set a flag that the view is not being dragged
		this.dragging = false;
	},

	renderRemoveIcon: function renderRemoveIcon() {
		if (this.props.disabled || !this.props.onRemove) return;
		return _react2['default'].createElement(
			'span',
			{ className: 'Select-value-icon',
				'aria-hidden': 'true',
				onMouseDown: this.onRemove,
				onTouchEnd: this.handleTouchEndRemove,
				onTouchStart: this.handleTouchStart,
				onTouchMove: this.handleTouchMove },
			'×'
		);
	},

	renderLabel: function renderLabel() {
		var className = 'Select-value-label';
		return this.props.onClick || this.props.value.href ? _react2['default'].createElement(
			'a',
			{ className: className, href: this.props.value.href, target: this.props.value.target, onMouseDown: this.handleMouseDown, onTouchEnd: this.handleMouseDown },
			this.props.children
		) : _react2['default'].createElement(
			'span',
			{ className: className, role: 'option', 'aria-selected': 'true', id: this.props.id },
			this.props.children
		);
	},

	render: function render() {
		return _react2['default'].createElement(
			'div',
			{ className: (0, _classnames2['default'])('Select-value', this.props.value.className),
				style: this.props.value.style,
				title: this.props.value.title
			},
			this.renderRemoveIcon(),
			this.renderLabel()
		);
	}

});

module.exports = Value;

},{"classnames":undefined,"react":undefined}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports["default"] = arrowRenderer;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function arrowRenderer(_ref) {
	var onMouseDown = _ref.onMouseDown;

	return _react2["default"].createElement("span", {
		className: "Select-arrow",
		onMouseDown: onMouseDown
	});
}

;
module.exports = exports["default"];

},{"react":undefined}],9:[function(require,module,exports){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _stripDiacritics = require('./stripDiacritics');

var _stripDiacritics2 = _interopRequireDefault(_stripDiacritics);

function filterOptions(options, filterValue, excludeOptions, props) {
	var _this = this;

	if (props.ignoreAccents) {
		filterValue = (0, _stripDiacritics2['default'])(filterValue);
	}

	if (props.ignoreCase) {
		filterValue = filterValue.toLowerCase();
	}

	if (excludeOptions) excludeOptions = excludeOptions.map(function (i) {
		return i[props.valueKey];
	});

	return options.filter(function (option) {
		if (excludeOptions && excludeOptions.indexOf(option[props.valueKey]) > -1) {
			if (option.group && props.selectGroup) {
				option.group.options.splice(option);
			}
			return false;
		}
		if (props.filterOption) return props.filterOption.call(_this, option, filterValue);
		if (!filterValue) return true;
		var valueTest = String(option[props.valueKey]);
		var labelTest = String(option[props.labelKey]);
		if (props.ignoreAccents) {
			if (props.matchProp !== 'label') valueTest = (0, _stripDiacritics2['default'])(valueTest);
			if (props.matchProp !== 'value') labelTest = (0, _stripDiacritics2['default'])(labelTest);
		}
		if (props.ignoreCase) {
			if (props.matchProp !== 'label') valueTest = valueTest.toLowerCase();
			if (props.matchProp !== 'value') labelTest = labelTest.toLowerCase();
		}
		return props.matchPos === 'start' ? props.matchProp !== 'label' && valueTest.substr(0, filterValue.length) === filterValue || props.matchProp !== 'value' && labelTest.substr(0, filterValue.length) === filterValue : props.matchProp !== 'label' && valueTest.indexOf(filterValue) >= 0 || props.matchProp !== 'value' && labelTest.indexOf(filterValue) >= 0;
	});
}

module.exports = filterOptions;

},{"./stripDiacritics":11}],10:[function(require,module,exports){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function isGroup(option) {
	return option && Array.isArray(option.options);
}

function menuRenderer(_ref) {
	var focusedOption = _ref.focusedOption;
	var selectGroup = _ref.selectGroup;
	var instancePrefix = _ref.instancePrefix;
	var labelKey = _ref.labelKey;
	var onFocus = _ref.onFocus;
	var onOptionRef = _ref.onOptionRef;
	var onSelect = _ref.onSelect;
	var optionClassName = _ref.optionClassName;
	var optionComponent = _ref.optionComponent;
	var optionGroupComponent = _ref.optionGroupComponent;
	var optionRenderer = _ref.optionRenderer;
	var options = _ref.options;
	var valueArray = _ref.valueArray;
	var valueKey = _ref.valueKey;

	var OptionGroup = optionGroupComponent;
	var Option = optionComponent;
	var renderLabel = optionRenderer || this.getOptionLabel;

	var renderOptions = function renderOptions(optionsSubset) {
		return optionsSubset.map(function (option, i) {
			if (isGroup(option)) {
				var isFocused = option === focusedOption;

				var optionGroupClass = (0, _classnames2['default'])({
					'Select-option-group': true,
					'is-focused': isFocused,
					'is-disabled': option.disabled
				});

				return _react2['default'].createElement(
					OptionGroup,
					{
						className: optionGroupClass,
						isDisabled: option.disabled,
						isFocused: isFocused,
						key: 'option-group-' + i,
						label: renderLabel(option),
						onFocus: onFocus,
						onSelect: onSelect,
						option: option,
						optionIndex: i,
						selectGroup: selectGroup
					},
					renderOptions(option.options)
				);
			} else {
				var _ret = (function () {
					var isSelected = valueArray && valueArray.indexOf(option) > -1;
					var isFocused = option === focusedOption;
					var optionRef = isFocused ? 'focused' : null;
					var optionClass = (0, _classnames2['default'])(optionClassName, {
						'Select-option': true,
						'is-selected': isSelected,
						'is-focused': isFocused,
						'is-disabled': option.disabled
					});

					return {
						v: _react2['default'].createElement(
							Option,
							{
								className: optionClass,
								instancePrefix: instancePrefix,
								isDisabled: option.disabled,
								isFocused: isFocused,
								isSelected: isSelected,
								key: 'option-' + i + '-' + option[valueKey],
								onFocus: onFocus,
								onSelect: onSelect,
								option: option,
								optionIndex: i,
								ref: function (ref) {
									onOptionRef(ref, isFocused);
								}
							},
							renderLabel(option, i)
						)
					};
				})();

				if (typeof _ret === 'object') return _ret.v;
			}
		});
	};

	return renderOptions(options);
}

module.exports = menuRenderer;

},{"classnames":undefined,"react":undefined}],11:[function(require,module,exports){
'use strict';

var map = [{ 'base': 'A', 'letters': /[\u0041\u24B6\uFF21\u00C0\u00C1\u00C2\u1EA6\u1EA4\u1EAA\u1EA8\u00C3\u0100\u0102\u1EB0\u1EAE\u1EB4\u1EB2\u0226\u01E0\u00C4\u01DE\u1EA2\u00C5\u01FA\u01CD\u0200\u0202\u1EA0\u1EAC\u1EB6\u1E00\u0104\u023A\u2C6F]/g }, { 'base': 'AA', 'letters': /[\uA732]/g }, { 'base': 'AE', 'letters': /[\u00C6\u01FC\u01E2]/g }, { 'base': 'AO', 'letters': /[\uA734]/g }, { 'base': 'AU', 'letters': /[\uA736]/g }, { 'base': 'AV', 'letters': /[\uA738\uA73A]/g }, { 'base': 'AY', 'letters': /[\uA73C]/g }, { 'base': 'B', 'letters': /[\u0042\u24B7\uFF22\u1E02\u1E04\u1E06\u0243\u0182\u0181]/g }, { 'base': 'C', 'letters': /[\u0043\u24B8\uFF23\u0106\u0108\u010A\u010C\u00C7\u1E08\u0187\u023B\uA73E]/g }, { 'base': 'D', 'letters': /[\u0044\u24B9\uFF24\u1E0A\u010E\u1E0C\u1E10\u1E12\u1E0E\u0110\u018B\u018A\u0189\uA779]/g }, { 'base': 'DZ', 'letters': /[\u01F1\u01C4]/g }, { 'base': 'Dz', 'letters': /[\u01F2\u01C5]/g }, { 'base': 'E', 'letters': /[\u0045\u24BA\uFF25\u00C8\u00C9\u00CA\u1EC0\u1EBE\u1EC4\u1EC2\u1EBC\u0112\u1E14\u1E16\u0114\u0116\u00CB\u1EBA\u011A\u0204\u0206\u1EB8\u1EC6\u0228\u1E1C\u0118\u1E18\u1E1A\u0190\u018E]/g }, { 'base': 'F', 'letters': /[\u0046\u24BB\uFF26\u1E1E\u0191\uA77B]/g }, { 'base': 'G', 'letters': /[\u0047\u24BC\uFF27\u01F4\u011C\u1E20\u011E\u0120\u01E6\u0122\u01E4\u0193\uA7A0\uA77D\uA77E]/g }, { 'base': 'H', 'letters': /[\u0048\u24BD\uFF28\u0124\u1E22\u1E26\u021E\u1E24\u1E28\u1E2A\u0126\u2C67\u2C75\uA78D]/g }, { 'base': 'I', 'letters': /[\u0049\u24BE\uFF29\u00CC\u00CD\u00CE\u0128\u012A\u012C\u0130\u00CF\u1E2E\u1EC8\u01CF\u0208\u020A\u1ECA\u012E\u1E2C\u0197]/g }, { 'base': 'J', 'letters': /[\u004A\u24BF\uFF2A\u0134\u0248]/g }, { 'base': 'K', 'letters': /[\u004B\u24C0\uFF2B\u1E30\u01E8\u1E32\u0136\u1E34\u0198\u2C69\uA740\uA742\uA744\uA7A2]/g }, { 'base': 'L', 'letters': /[\u004C\u24C1\uFF2C\u013F\u0139\u013D\u1E36\u1E38\u013B\u1E3C\u1E3A\u0141\u023D\u2C62\u2C60\uA748\uA746\uA780]/g }, { 'base': 'LJ', 'letters': /[\u01C7]/g }, { 'base': 'Lj', 'letters': /[\u01C8]/g }, { 'base': 'M', 'letters': /[\u004D\u24C2\uFF2D\u1E3E\u1E40\u1E42\u2C6E\u019C]/g }, { 'base': 'N', 'letters': /[\u004E\u24C3\uFF2E\u01F8\u0143\u00D1\u1E44\u0147\u1E46\u0145\u1E4A\u1E48\u0220\u019D\uA790\uA7A4]/g }, { 'base': 'NJ', 'letters': /[\u01CA]/g }, { 'base': 'Nj', 'letters': /[\u01CB]/g }, { 'base': 'O', 'letters': /[\u004F\u24C4\uFF2F\u00D2\u00D3\u00D4\u1ED2\u1ED0\u1ED6\u1ED4\u00D5\u1E4C\u022C\u1E4E\u014C\u1E50\u1E52\u014E\u022E\u0230\u00D6\u022A\u1ECE\u0150\u01D1\u020C\u020E\u01A0\u1EDC\u1EDA\u1EE0\u1EDE\u1EE2\u1ECC\u1ED8\u01EA\u01EC\u00D8\u01FE\u0186\u019F\uA74A\uA74C]/g }, { 'base': 'OI', 'letters': /[\u01A2]/g }, { 'base': 'OO', 'letters': /[\uA74E]/g }, { 'base': 'OU', 'letters': /[\u0222]/g }, { 'base': 'P', 'letters': /[\u0050\u24C5\uFF30\u1E54\u1E56\u01A4\u2C63\uA750\uA752\uA754]/g }, { 'base': 'Q', 'letters': /[\u0051\u24C6\uFF31\uA756\uA758\u024A]/g }, { 'base': 'R', 'letters': /[\u0052\u24C7\uFF32\u0154\u1E58\u0158\u0210\u0212\u1E5A\u1E5C\u0156\u1E5E\u024C\u2C64\uA75A\uA7A6\uA782]/g }, { 'base': 'S', 'letters': /[\u0053\u24C8\uFF33\u1E9E\u015A\u1E64\u015C\u1E60\u0160\u1E66\u1E62\u1E68\u0218\u015E\u2C7E\uA7A8\uA784]/g }, { 'base': 'T', 'letters': /[\u0054\u24C9\uFF34\u1E6A\u0164\u1E6C\u021A\u0162\u1E70\u1E6E\u0166\u01AC\u01AE\u023E\uA786]/g }, { 'base': 'TZ', 'letters': /[\uA728]/g }, { 'base': 'U', 'letters': /[\u0055\u24CA\uFF35\u00D9\u00DA\u00DB\u0168\u1E78\u016A\u1E7A\u016C\u00DC\u01DB\u01D7\u01D5\u01D9\u1EE6\u016E\u0170\u01D3\u0214\u0216\u01AF\u1EEA\u1EE8\u1EEE\u1EEC\u1EF0\u1EE4\u1E72\u0172\u1E76\u1E74\u0244]/g }, { 'base': 'V', 'letters': /[\u0056\u24CB\uFF36\u1E7C\u1E7E\u01B2\uA75E\u0245]/g }, { 'base': 'VY', 'letters': /[\uA760]/g }, { 'base': 'W', 'letters': /[\u0057\u24CC\uFF37\u1E80\u1E82\u0174\u1E86\u1E84\u1E88\u2C72]/g }, { 'base': 'X', 'letters': /[\u0058\u24CD\uFF38\u1E8A\u1E8C]/g }, { 'base': 'Y', 'letters': /[\u0059\u24CE\uFF39\u1EF2\u00DD\u0176\u1EF8\u0232\u1E8E\u0178\u1EF6\u1EF4\u01B3\u024E\u1EFE]/g }, { 'base': 'Z', 'letters': /[\u005A\u24CF\uFF3A\u0179\u1E90\u017B\u017D\u1E92\u1E94\u01B5\u0224\u2C7F\u2C6B\uA762]/g }, { 'base': 'a', 'letters': /[\u0061\u24D0\uFF41\u1E9A\u00E0\u00E1\u00E2\u1EA7\u1EA5\u1EAB\u1EA9\u00E3\u0101\u0103\u1EB1\u1EAF\u1EB5\u1EB3\u0227\u01E1\u00E4\u01DF\u1EA3\u00E5\u01FB\u01CE\u0201\u0203\u1EA1\u1EAD\u1EB7\u1E01\u0105\u2C65\u0250]/g }, { 'base': 'aa', 'letters': /[\uA733]/g }, { 'base': 'ae', 'letters': /[\u00E6\u01FD\u01E3]/g }, { 'base': 'ao', 'letters': /[\uA735]/g }, { 'base': 'au', 'letters': /[\uA737]/g }, { 'base': 'av', 'letters': /[\uA739\uA73B]/g }, { 'base': 'ay', 'letters': /[\uA73D]/g }, { 'base': 'b', 'letters': /[\u0062\u24D1\uFF42\u1E03\u1E05\u1E07\u0180\u0183\u0253]/g }, { 'base': 'c', 'letters': /[\u0063\u24D2\uFF43\u0107\u0109\u010B\u010D\u00E7\u1E09\u0188\u023C\uA73F\u2184]/g }, { 'base': 'd', 'letters': /[\u0064\u24D3\uFF44\u1E0B\u010F\u1E0D\u1E11\u1E13\u1E0F\u0111\u018C\u0256\u0257\uA77A]/g }, { 'base': 'dz', 'letters': /[\u01F3\u01C6]/g }, { 'base': 'e', 'letters': /[\u0065\u24D4\uFF45\u00E8\u00E9\u00EA\u1EC1\u1EBF\u1EC5\u1EC3\u1EBD\u0113\u1E15\u1E17\u0115\u0117\u00EB\u1EBB\u011B\u0205\u0207\u1EB9\u1EC7\u0229\u1E1D\u0119\u1E19\u1E1B\u0247\u025B\u01DD]/g }, { 'base': 'f', 'letters': /[\u0066\u24D5\uFF46\u1E1F\u0192\uA77C]/g }, { 'base': 'g', 'letters': /[\u0067\u24D6\uFF47\u01F5\u011D\u1E21\u011F\u0121\u01E7\u0123\u01E5\u0260\uA7A1\u1D79\uA77F]/g }, { 'base': 'h', 'letters': /[\u0068\u24D7\uFF48\u0125\u1E23\u1E27\u021F\u1E25\u1E29\u1E2B\u1E96\u0127\u2C68\u2C76\u0265]/g }, { 'base': 'hv', 'letters': /[\u0195]/g }, { 'base': 'i', 'letters': /[\u0069\u24D8\uFF49\u00EC\u00ED\u00EE\u0129\u012B\u012D\u00EF\u1E2F\u1EC9\u01D0\u0209\u020B\u1ECB\u012F\u1E2D\u0268\u0131]/g }, { 'base': 'j', 'letters': /[\u006A\u24D9\uFF4A\u0135\u01F0\u0249]/g }, { 'base': 'k', 'letters': /[\u006B\u24DA\uFF4B\u1E31\u01E9\u1E33\u0137\u1E35\u0199\u2C6A\uA741\uA743\uA745\uA7A3]/g }, { 'base': 'l', 'letters': /[\u006C\u24DB\uFF4C\u0140\u013A\u013E\u1E37\u1E39\u013C\u1E3D\u1E3B\u017F\u0142\u019A\u026B\u2C61\uA749\uA781\uA747]/g }, { 'base': 'lj', 'letters': /[\u01C9]/g }, { 'base': 'm', 'letters': /[\u006D\u24DC\uFF4D\u1E3F\u1E41\u1E43\u0271\u026F]/g }, { 'base': 'n', 'letters': /[\u006E\u24DD\uFF4E\u01F9\u0144\u00F1\u1E45\u0148\u1E47\u0146\u1E4B\u1E49\u019E\u0272\u0149\uA791\uA7A5]/g }, { 'base': 'nj', 'letters': /[\u01CC]/g }, { 'base': 'o', 'letters': /[\u006F\u24DE\uFF4F\u00F2\u00F3\u00F4\u1ED3\u1ED1\u1ED7\u1ED5\u00F5\u1E4D\u022D\u1E4F\u014D\u1E51\u1E53\u014F\u022F\u0231\u00F6\u022B\u1ECF\u0151\u01D2\u020D\u020F\u01A1\u1EDD\u1EDB\u1EE1\u1EDF\u1EE3\u1ECD\u1ED9\u01EB\u01ED\u00F8\u01FF\u0254\uA74B\uA74D\u0275]/g }, { 'base': 'oi', 'letters': /[\u01A3]/g }, { 'base': 'ou', 'letters': /[\u0223]/g }, { 'base': 'oo', 'letters': /[\uA74F]/g }, { 'base': 'p', 'letters': /[\u0070\u24DF\uFF50\u1E55\u1E57\u01A5\u1D7D\uA751\uA753\uA755]/g }, { 'base': 'q', 'letters': /[\u0071\u24E0\uFF51\u024B\uA757\uA759]/g }, { 'base': 'r', 'letters': /[\u0072\u24E1\uFF52\u0155\u1E59\u0159\u0211\u0213\u1E5B\u1E5D\u0157\u1E5F\u024D\u027D\uA75B\uA7A7\uA783]/g }, { 'base': 's', 'letters': /[\u0073\u24E2\uFF53\u00DF\u015B\u1E65\u015D\u1E61\u0161\u1E67\u1E63\u1E69\u0219\u015F\u023F\uA7A9\uA785\u1E9B]/g }, { 'base': 't', 'letters': /[\u0074\u24E3\uFF54\u1E6B\u1E97\u0165\u1E6D\u021B\u0163\u1E71\u1E6F\u0167\u01AD\u0288\u2C66\uA787]/g }, { 'base': 'tz', 'letters': /[\uA729]/g }, { 'base': 'u', 'letters': /[\u0075\u24E4\uFF55\u00F9\u00FA\u00FB\u0169\u1E79\u016B\u1E7B\u016D\u00FC\u01DC\u01D8\u01D6\u01DA\u1EE7\u016F\u0171\u01D4\u0215\u0217\u01B0\u1EEB\u1EE9\u1EEF\u1EED\u1EF1\u1EE5\u1E73\u0173\u1E77\u1E75\u0289]/g }, { 'base': 'v', 'letters': /[\u0076\u24E5\uFF56\u1E7D\u1E7F\u028B\uA75F\u028C]/g }, { 'base': 'vy', 'letters': /[\uA761]/g }, { 'base': 'w', 'letters': /[\u0077\u24E6\uFF57\u1E81\u1E83\u0175\u1E87\u1E85\u1E98\u1E89\u2C73]/g }, { 'base': 'x', 'letters': /[\u0078\u24E7\uFF58\u1E8B\u1E8D]/g }, { 'base': 'y', 'letters': /[\u0079\u24E8\uFF59\u1EF3\u00FD\u0177\u1EF9\u0233\u1E8F\u00FF\u1EF7\u1E99\u1EF5\u01B4\u024F\u1EFF]/g }, { 'base': 'z', 'letters': /[\u007A\u24E9\uFF5A\u017A\u1E91\u017C\u017E\u1E93\u1E95\u01B6\u0225\u0240\u2C6C\uA763]/g }];

module.exports = function stripDiacritics(str) {
	for (var i = 0; i < map.length; i++) {
		str = str.replace(map[i].letters, map[i].base);
	}
	return str;
};

},{}],"react-select-plus":[function(require,module,exports){
/*!
  Copyright (c) 2016 Jed Watson.
  Licensed under the MIT License (MIT), see
  http://jedwatson.github.io/react-select
*/

'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _reactInputAutosize = require('react-input-autosize');

var _reactInputAutosize2 = _interopRequireDefault(_reactInputAutosize);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _utilsDefaultArrowRenderer = require('./utils/defaultArrowRenderer');

var _utilsDefaultArrowRenderer2 = _interopRequireDefault(_utilsDefaultArrowRenderer);

var _utilsDefaultFilterOptions = require('./utils/defaultFilterOptions');

var _utilsDefaultFilterOptions2 = _interopRequireDefault(_utilsDefaultFilterOptions);

var _utilsDefaultMenuRenderer = require('./utils/defaultMenuRenderer');

var _utilsDefaultMenuRenderer2 = _interopRequireDefault(_utilsDefaultMenuRenderer);

var _Async = require('./Async');

var _Async2 = _interopRequireDefault(_Async);

var _AsyncCreatable = require('./AsyncCreatable');

var _AsyncCreatable2 = _interopRequireDefault(_AsyncCreatable);

var _Creatable = require('./Creatable');

var _Creatable2 = _interopRequireDefault(_Creatable);

var _Dropdown = require('./Dropdown');

var _Dropdown2 = _interopRequireDefault(_Dropdown);

var _Option = require('./Option');

var _Option2 = _interopRequireDefault(_Option);

var _OptionGroup = require('./OptionGroup');

var _OptionGroup2 = _interopRequireDefault(_OptionGroup);

var _Value = require('./Value');

var _Value2 = _interopRequireDefault(_Value);

function clone(obj) {
	var copy = {};
	for (var attr in obj) {
		if (obj.hasOwnProperty(attr)) {
			copy[attr] = obj[attr];
		};
	}
	return copy;
}

function isGroup(option) {
	return option && Array.isArray(option.options);
}

function stringifyValue(value) {
	if (typeof value === 'string') {
		return value;
	} else if (typeof value === 'object') {
		return JSON.stringify(value);
	} else if (value || value === 0) {
		return String(value);
	} else {
		return '';
	}
}

var stringOrNode = _react2['default'].PropTypes.oneOfType([_react2['default'].PropTypes.string, _react2['default'].PropTypes.node]);

var instanceId = 1;

var invalidOptions = {};

var Select = _react2['default'].createClass({

	displayName: 'Select',

	propTypes: {
		addLabelText: _react2['default'].PropTypes.string, // placeholder displayed when you want to add a label on a multi-value input
		'aria-label': _react2['default'].PropTypes.string, // Aria label (for assistive tech)
		'aria-labelledby': _react2['default'].PropTypes.string, // HTML ID of an element that should be used as the label (for assistive tech)
		arrowRenderer: _react2['default'].PropTypes.func, // Create drop-down caret element
		autoBlur: _react2['default'].PropTypes.bool, // automatically blur the component when an option is selected
		autofocus: _react2['default'].PropTypes.bool, // autofocus the component on mount
		autosize: _react2['default'].PropTypes.bool, // whether to enable autosizing or not
		backspaceRemoves: _react2['default'].PropTypes.bool, // whether backspace removes an item if there is no text input
		backspaceToRemoveMessage: _react2['default'].PropTypes.string, // Message to use for screenreaders to press backspace to remove the current item - {label} is replaced with the item label
		className: _react2['default'].PropTypes.string, // className for the outer element
		clearAllText: stringOrNode, // title for the "clear" control when multi: true
		clearValueText: stringOrNode, // title for the "clear" control
		clearable: _react2['default'].PropTypes.bool, // should it be possible to reset value
		delimiter: _react2['default'].PropTypes.string, // delimiter to use to join multiple values for the hidden field value
		disabled: _react2['default'].PropTypes.bool, // whether the Select is disabled or not
		dropdownComponent: _react2['default'].PropTypes.func, // dropdown component to render the menu in
		escapeClearsValue: _react2['default'].PropTypes.bool, // whether escape clears the value when the menu is closed
		filterOption: _react2['default'].PropTypes.func, // method to filter a single option (option, filterString)
		filterOptions: _react2['default'].PropTypes.any, // boolean to enable default filtering or function to filter the options array ([options], filterString, [values])
		ignoreAccents: _react2['default'].PropTypes.bool, // whether to strip diacritics when filtering
		ignoreCase: _react2['default'].PropTypes.bool, // whether to perform case-insensitive filtering
		inputProps: _react2['default'].PropTypes.object, // custom attributes for the Input
		inputRenderer: _react2['default'].PropTypes.func, // returns a custom input component
		instanceId: _react2['default'].PropTypes.string, // set the components instanceId
		isLoading: _react2['default'].PropTypes.bool, // whether the Select is loading externally or not (such as options being loaded)
		isOpen: _react2['default'].PropTypes.bool, // whether the Select dropdown menu is open or not
		joinValues: _react2['default'].PropTypes.bool, // joins multiple values into a single form field with the delimiter (legacy mode)
		labelKey: _react2['default'].PropTypes.string, // path of the label value in option objects
		matchPos: _react2['default'].PropTypes.string, // (any|start) match the start or entire string when filtering
		matchProp: _react2['default'].PropTypes.string, // (any|label|value) which option property to filter on
		menuBuffer: _react2['default'].PropTypes.number, // optional buffer (in px) between the bottom of the viewport and the bottom of the menu
		menuContainerStyle: _react2['default'].PropTypes.object, // optional style to apply to the menu container
		menuRenderer: _react2['default'].PropTypes.func, // renders a custom menu with options
		menuStyle: _react2['default'].PropTypes.object, // optional style to apply to the menu
		multi: _react2['default'].PropTypes.bool, // multi-value input
		name: _react2['default'].PropTypes.string, // generates a hidden <input /> tag with this field name for html forms
		noResultsText: stringOrNode, // placeholder displayed when there are no matching search results
		onBlur: _react2['default'].PropTypes.func, // onBlur handler: function (event) {}
		onBlurResetsInput: _react2['default'].PropTypes.bool, // whether input is cleared on blur
		onChange: _react2['default'].PropTypes.func, // onChange handler: function (newValue) {}
		onClose: _react2['default'].PropTypes.func, // fires when the menu is closed
		onCloseResetsInput: _react2['default'].PropTypes.bool, // whether input is cleared when menu is closed through the arrow
		onFocus: _react2['default'].PropTypes.func, // onFocus handler: function (event) {}
		onInputChange: _react2['default'].PropTypes.func, // onInputChange handler: function (inputValue) {}
		onInputKeyDown: _react2['default'].PropTypes.func, // input keyDown handler: function (event) {}
		onMenuScrollToBottom: _react2['default'].PropTypes.func, // fires when the menu is scrolled to the bottom; can be used to paginate options
		onOpen: _react2['default'].PropTypes.func, // fires when the menu is opened
		onValueClick: _react2['default'].PropTypes.func, // onClick handler for value labels: function (value, event) {}
		openAfterFocus: _react2['default'].PropTypes.bool, // boolean to enable opening dropdown when focused
		openOnFocus: _react2['default'].PropTypes.bool, // always open options menu on focus
		optionClassName: _react2['default'].PropTypes.string, // additional class(es) to apply to the <Option /> elements
		optionComponent: _react2['default'].PropTypes.func, // option component to render in dropdown
		optionGroupComponent: _react2['default'].PropTypes.func, // option group component to render in dropdown
		optionRenderer: _react2['default'].PropTypes.func, // optionRenderer: function (option) {}
		options: _react2['default'].PropTypes.array, // array of options
		pageSize: _react2['default'].PropTypes.number, // number of entries to page when using page up/down keys
		placeholder: stringOrNode, // field placeholder, displayed when there's no value
		renderInvalidValues: _react2['default'].PropTypes.bool, // boolean to enable rendering values that do not match any options
		required: _react2['default'].PropTypes.bool, // applies HTML5 required attribute when needed
		resetValue: _react2['default'].PropTypes.any, // value to use when you clear the control
		scrollMenuIntoView: _react2['default'].PropTypes.bool, // boolean to enable the viewport to shift so that the full menu fully visible when engaged
		searchable: _react2['default'].PropTypes.bool, // whether to enable searching feature or not
		selectGroup: _react2['default'].PropTypes.bool, // boolean to allow selection of entrire Groups
		simpleValue: _react2['default'].PropTypes.bool, // pass the value to onChange as a simple value (legacy pre 1.0 mode), defaults to false
		style: _react2['default'].PropTypes.object, // optional style to apply to the control
		tabIndex: _react2['default'].PropTypes.string, // optional tab index of the control
		tabSelectsValue: _react2['default'].PropTypes.bool, // whether to treat tabbing out while focused to be value selection
		value: _react2['default'].PropTypes.any, // initial field value
		valueComponent: _react2['default'].PropTypes.func, // value component to render
		valueKey: _react2['default'].PropTypes.string, // path of the label value in option objects
		valueRenderer: _react2['default'].PropTypes.func, // valueRenderer: function (option) {}
		wrapperStyle: _react2['default'].PropTypes.object },

	// optional style to apply to the component wrapper
	statics: { Async: _Async2['default'], AsyncCreatable: _AsyncCreatable2['default'], Creatable: _Creatable2['default'] },

	getDefaultProps: function getDefaultProps() {
		return {
			addLabelText: 'Add "{label}"?',
			arrowRenderer: _utilsDefaultArrowRenderer2['default'],
			autosize: true,
			backspaceRemoves: true,
			backspaceToRemoveMessage: 'Press backspace to remove {label}',
			clearable: true,
			clearAllText: 'Clear all',
			clearValueText: 'Clear value',
			delimiter: ',',
			disabled: false,
			dropdownComponent: _Dropdown2['default'],
			escapeClearsValue: true,
			filterOptions: _utilsDefaultFilterOptions2['default'],
			ignoreAccents: true,
			ignoreCase: true,
			inputProps: {},
			isLoading: false,
			joinValues: false,
			labelKey: 'label',
			matchPos: 'any',
			matchProp: 'any',
			menuBuffer: 0,
			menuRenderer: _utilsDefaultMenuRenderer2['default'],
			multi: false,
			noResultsText: 'No results found',
			onBlurResetsInput: true,
			onCloseResetsInput: true,
			openAfterFocus: false,
			optionComponent: _Option2['default'],
			optionGroupComponent: _OptionGroup2['default'],
			pageSize: 5,
			placeholder: 'Select...',
			renderInvalidValues: false,
			required: false,
			scrollMenuIntoView: true,
			searchable: true,
			selectGroup: false,
			simpleValue: false,
			tabSelectsValue: true,
			valueComponent: _Value2['default'],
			valueKey: 'value'
		};
	},

	getInitialState: function getInitialState() {
		return {
			inputValue: '',
			isFocused: false,
			isOpen: false,
			isPseudoFocused: false,
			required: false
		};
	},

	componentWillMount: function componentWillMount() {
		this._flatOptions = this.flattenOptions(this.props.options);
		this._instancePrefix = 'react-select-' + (this.props.instanceId || ++instanceId) + '-';
		var valueArray = this.getValueArray(this.props.value);

		if (this.props.required) {
			this.setState({
				required: this.handleRequired(valueArray[0], this.props.multi)
			});
		}
	},

	componentDidMount: function componentDidMount() {
		if (this.props.autofocus) {
			this.focus();
		}
	},

	componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
		if (nextProps.options !== this.props.options) {
			this._flatOptions = this.flattenOptions(nextProps.options);
		}

		var valueArray = this.getValueArray(nextProps.value, nextProps);

		if (nextProps.required) {
			this.setState({
				required: this.handleRequired(valueArray[0], nextProps.multi)
			});
		}
	},

	componentWillUpdate: function componentWillUpdate(nextProps, nextState) {
		if (nextState.isOpen !== this.state.isOpen) {
			this.toggleTouchOutsideEvent(nextState.isOpen);
			var handler = nextState.isOpen ? nextProps.onOpen : nextProps.onClose;
			handler && handler();
		}
	},

	componentDidUpdate: function componentDidUpdate(prevProps, prevState) {
		// focus to the selected option
		if (this.menu && this.focused && this.state.isOpen && !this.hasScrolledToOption) {
			var focusedOptionNode = _reactDom2['default'].findDOMNode(this.focused);
			var focusedOptionPreviousSibling = focusedOptionNode.previousSibling;
			var focusedOptionParent = focusedOptionNode.parentElement;
			var menuNode = _reactDom2['default'].findDOMNode(this.menu);
			if (focusedOptionPreviousSibling) {
				menuNode.scrollTop = focusedOptionPreviousSibling.offsetTop;
			} else if (focusedOptionParent && focusedOptionParent === 'Select-menu') {
				menuNode.scrollTop = focusedOptionParent.offsetTop;
			} else {
				menuNode.scrollTop = focusedOptionNode.offsetTop;
			}
			this.hasScrolledToOption = true;
		} else if (!this.state.isOpen) {
			this.hasScrolledToOption = false;
		}

		if (this._scrollToFocusedOptionOnUpdate && this.focused && this.menu) {
			this._scrollToFocusedOptionOnUpdate = false;
			var focusedDOM = _reactDom2['default'].findDOMNode(this.focused);
			var menuDOM = _reactDom2['default'].findDOMNode(this.menu);
			var focusedRect = focusedDOM.getBoundingClientRect();
			var menuRect = menuDOM.getBoundingClientRect();
			if (focusedRect.bottom > menuRect.bottom || focusedRect.top < menuRect.top) {
				menuDOM.scrollTop = focusedDOM.offsetTop + focusedDOM.clientHeight - menuDOM.offsetHeight;
			}
		}
		if (this.props.scrollMenuIntoView && this.menuContainer) {
			var menuContainerRect = this.menuContainer.getBoundingClientRect();
			if (window.innerHeight < menuContainerRect.bottom + this.props.menuBuffer) {
				window.scrollBy(0, menuContainerRect.bottom + this.props.menuBuffer - window.innerHeight);
			}
		}
		if (prevProps.disabled !== this.props.disabled) {
			this.setState({ isFocused: false }); // eslint-disable-line react/no-did-update-set-state
			this.closeMenu();
		}
	},

	componentWillUnmount: function componentWillUnmount() {
		document.removeEventListener('touchstart', this.handleTouchOutside);
	},

	toggleTouchOutsideEvent: function toggleTouchOutsideEvent(enabled) {
		if (enabled) {
			document.addEventListener('touchstart', this.handleTouchOutside);
		} else {
			document.removeEventListener('touchstart', this.handleTouchOutside);
		}
	},

	handleTouchOutside: function handleTouchOutside(event) {
		// handle touch outside on ios to dismiss menu
		if (this.wrapper && !this.wrapper.contains(event.target) && this.menuContainer && !this.menuContainer.contains(event.target)) {
			this.closeMenu();
		}
	},

	focus: function focus() {
		if (!this.input) return;
		this.input.focus();

		if (this.props.openAfterFocus) {
			this.setState({
				isOpen: true
			});
		}
	},

	blurInput: function blurInput() {
		if (!this.input) return;
		this.input.blur();
	},

	handleTouchMove: function handleTouchMove(event) {
		// Set a flag that the view is being dragged
		this.dragging = true;
	},

	handleTouchStart: function handleTouchStart(event) {
		// Set a flag that the view is not being dragged
		this.dragging = false;
	},

	handleTouchEnd: function handleTouchEnd(event) {
		// Check if the view is being dragged, In this case
		// we don't want to fire the click event (because the user only wants to scroll)
		if (this.dragging) return;

		// Fire the mouse events
		this.handleMouseDown(event);
	},

	handleTouchEndClearValue: function handleTouchEndClearValue(event) {
		// Check if the view is being dragged, In this case
		// we don't want to fire the click event (because the user only wants to scroll)
		if (this.dragging) return;

		// Clear the value
		this.clearValue(event);
	},

	handleMouseDown: function handleMouseDown(event) {
		// if the event was triggered by a mousedown and not the primary
		// button, or if the component is disabled, ignore it.
		if (this.props.disabled || event.type === 'mousedown' && event.button !== 0) {
			return;
		}

		if (event.target.tagName === 'INPUT') {
			return;
		}

		// prevent default event handlers
		event.stopPropagation();
		event.preventDefault();

		// for the non-searchable select, toggle the menu
		if (!this.props.searchable) {
			this.focus();
			return this.setState({
				isOpen: !this.state.isOpen
			});
		}

		if (this.state.isFocused) {
			// On iOS, we can get into a state where we think the input is focused but it isn't really,
			// since iOS ignores programmatic calls to input.focus() that weren't triggered by a click event.
			// Call focus() again here to be safe.
			this.focus();

			var input = this.input;
			if (typeof input.getInput === 'function') {
				// Get the actual DOM input if the ref is an <AutosizeInput /> component
				input = input.getInput();
			}

			// clears the value so that the cursor will be at the end of input when the component re-renders
			input.value = '';

			// if the input is focused, ensure the menu is open
			this.setState({
				isOpen: true,
				isPseudoFocused: false
			});
		} else {
			// otherwise, focus the input and open the menu
			this._openAfterFocus = true;
			this.focus();
		}
	},

	handleMouseDownOnArrow: function handleMouseDownOnArrow(event) {
		// if the event was triggered by a mousedown and not the primary
		// button, or if the component is disabled, ignore it.
		if (this.props.disabled || event.type === 'mousedown' && event.button !== 0) {
			return;
		}
		// If the menu isn't open, let the event bubble to the main handleMouseDown
		if (!this.state.isOpen) {
			return;
		}
		// prevent default event handlers
		event.stopPropagation();
		event.preventDefault();
		// close the menu
		this.closeMenu();
	},

	handleMouseDownOnMenu: function handleMouseDownOnMenu(event) {
		// if the event was triggered by a mousedown and not the primary
		// button, or if the component is disabled, ignore it.
		if (this.props.disabled || event.type === 'mousedown' && event.button !== 0) {
			return;
		}
		event.stopPropagation();
		event.preventDefault();

		this._openAfterFocus = true;
		this.focus();
	},

	closeMenu: function closeMenu() {
		if (this.props.onCloseResetsInput) {
			this.setState({
				isOpen: false,
				isPseudoFocused: this.state.isFocused && !this.props.multi,
				inputValue: ''
			});
		} else {
			this.setState({
				isOpen: false,
				isPseudoFocused: this.state.isFocused && !this.props.multi,
				inputValue: this.state.inputValue
			});
		}
		this.hasScrolledToOption = false;
	},

	handleInputFocus: function handleInputFocus(event) {
		if (this.props.disabled) return;
		var isOpen = this.state.isOpen || this._openAfterFocus || this.props.openOnFocus;
		if (this.props.onFocus) {
			this.props.onFocus(event);
		}
		this.setState({
			isFocused: true,
			isOpen: isOpen
		});
		this._openAfterFocus = false;
	},

	handleInputBlur: function handleInputBlur(event) {
		// The check for menu.contains(activeElement) is necessary to prevent IE11's scrollbar from closing the menu in certain contexts.
		if (this.menu && (this.menu === document.activeElement || this.menu.contains(document.activeElement))) {
			this.focus();
			return;
		}

		if (this.props.onBlur) {
			this.props.onBlur(event);
		}
		var onBlurredState = {
			isFocused: false,
			isOpen: false,
			isPseudoFocused: false
		};
		if (this.props.onBlurResetsInput) {
			onBlurredState.inputValue = '';
		}
		this.setState(onBlurredState);
	},

	handleInputChange: function handleInputChange(event) {
		var newInputValue = event.target.value;

		if (this.state.inputValue !== event.target.value && this.props.onInputChange) {
			var nextState = this.props.onInputChange(newInputValue);
			// Note: != used deliberately here to catch undefined and null
			if (nextState != null && typeof nextState !== 'object') {
				newInputValue = '' + nextState;
			}
		}

		this.setState({
			isOpen: true,
			isPseudoFocused: false,
			inputValue: newInputValue
		});
	},

	handleKeyDown: function handleKeyDown(event) {
		if (this.props.disabled) return;

		if (typeof this.props.onInputKeyDown === 'function') {
			this.props.onInputKeyDown(event);
			if (event.defaultPrevented) {
				return;
			}
		}

		switch (event.keyCode) {
			case 8:
				// backspace
				if (!this.state.inputValue && this.props.backspaceRemoves) {
					event.preventDefault();
					this.popValue();
				}
				return;
			case 9:
				// tab
				if (event.shiftKey || !this.state.isOpen || !this.props.tabSelectsValue) {
					return;
				}
				this.selectFocusedOption();
				return;
			case 13:
				// enter
				if (!this.state.isOpen) return;
				event.stopPropagation();
				this.selectFocusedOption();
				break;
			case 27:
				// escape
				if (this.state.isOpen) {
					this.closeMenu();
					event.stopPropagation();
				} else if (this.props.clearable && this.props.escapeClearsValue) {
					this.clearValue(event);
					event.stopPropagation();
				}
				break;
			case 38:
				// up
				this.focusPreviousOption();
				break;
			case 40:
				// down
				this.focusNextOption();
				break;
			case 33:
				// page up
				this.focusPageUpOption();
				break;
			case 34:
				// page down
				this.focusPageDownOption();
				break;
			case 35:
				// end key
				this.focusEndOption();
				break;
			case 36:
				// home key
				this.focusStartOption();
				break;
			default:
				return;
		}
		event.preventDefault();
	},

	handleValueClick: function handleValueClick(option, event) {
		if (!this.props.onValueClick) return;
		this.props.onValueClick(option, event);
	},

	handleMenuScroll: function handleMenuScroll(event) {
		if (!this.props.onMenuScrollToBottom) return;
		var target = event.target;

		if (target.scrollHeight > target.offsetHeight && !(target.scrollHeight - target.offsetHeight - target.scrollTop)) {
			this.props.onMenuScrollToBottom();
		}
	},

	handleRequired: function handleRequired(value, multi) {
		if (!value) return true;
		return multi ? value.length === 0 : Object.keys(value).length === 0;
	},

	getOptionLabel: function getOptionLabel(op) {
		return op[this.props.labelKey];
	},

	/**
  * Turns a value into an array from the given options
  * @param	{String|Number|Array}	value		- the value of the select input
  * @param	{Object}		nextProps	- optionally specify the nextProps so the returned array uses the latest configuration
  * @returns	{Array}	the value of the select represented in an array
  */
	getValueArray: function getValueArray(value, nextProps) {
		var _this = this;

		/** support optionally passing in the `nextProps` so `componentWillReceiveProps` updates will function as expected */
		var props = typeof nextProps === 'object' ? nextProps : this.props;
		if (props.multi) {
			if (typeof value === 'string') value = value.split(props.delimiter);
			if (!Array.isArray(value)) {
				if (value === null || value === undefined) return [];
				value = [value];
			}
			return value.map(function (value) {
				return _this.expandValue(value, props);
			}).filter(function (i) {
				return i;
			});
		}
		var expandedValue = this.expandValue(value, props);
		return expandedValue ? [expandedValue] : [];
	},

	/**
  * Retrieve a value from the given options and valueKey
  * @param	{String|Number|Array}	value	- the selected value(s)
  * @param	{Object}		props	- the Select component's props (or nextProps)
  */
	expandValue: function expandValue(value, props) {
		if (typeof value !== 'string' && typeof value !== 'number') return value;
		var _props = this.props;
		var labelKey = _props.labelKey;
		var valueKey = _props.valueKey;
		var renderInvalidValues = _props.renderInvalidValues;

		var options = this._flatOptions;
		if (!options || value === '') return;
		for (var i = 0; i < options.length; i++) {
			if (options[i][valueKey] === value) return options[i];
		}

		// no matching option, return an invalid option if renderInvalidValues is enabled
		if (renderInvalidValues) {
			var _ref;

			invalidOptions[value] = invalidOptions[value] || (_ref = {
				invalid: true
			}, _defineProperty(_ref, labelKey, value), _defineProperty(_ref, valueKey, value), _ref);
			return invalidOptions[value];
		}
	},

	setValue: function setValue(value) {
		var _this2 = this;

		if (this.props.autoBlur) {
			this.blurInput();
		}
		if (!this.props.onChange) return;
		if (this.props.required) {
			var required = this.handleRequired(value, this.props.multi);
			this.setState({ required: required });
		}
		if (this.props.simpleValue && value) {
			value = this.props.multi ? value.map(function (i) {
				return i[_this2.props.valueKey];
			}).join(this.props.delimiter) : value[this.props.valueKey];
		}
		this.props.onChange(value);
	},

	selectValue: function selectValue(value) {
		var _this3 = this;

		//NOTE: update value in the callback to make sure the input value is empty so that there are no styling issues (Chrome had issue otherwise)
		this.hasScrolledToOption = false;
		if (this.props.multi) {
			this.setState({
				inputValue: '',
				focusedIndex: null
			}, function () {
				_this3.addValue(value);
			});
		} else {
			this.setState({
				isOpen: false,
				inputValue: '',
				isPseudoFocused: this.state.isFocused
			}, function () {
				_this3.setValue(value);
			});
		}
	},

	addValue: function addValue(value) {
		var valueArray = this.getValueArray(this.props.value);
		var values = value.options ? this.valuesForGroup(value.options) : value;
		this.setValue(valueArray.concat(values));
	},

	valuesForGroup: function valuesForGroup(ary) {
		var ret = [];
		for (var i = 0; i < ary.length; i++) {
			if (Array.isArray(ary[i].options)) {
				ret = ret.concat(this.valuesForGroup(ary[i].options));
			} else {
				ret.push(ary[i]);
			}
		}
		return ret;
	},

	popValue: function popValue() {
		var valueArray = this.getValueArray(this.props.value);
		if (!valueArray.length) return;
		if (valueArray[valueArray.length - 1].clearableValue === false) return;
		this.setValue(valueArray.slice(0, valueArray.length - 1));
	},

	removeValue: function removeValue(value) {
		var valueArray = this.getValueArray(this.props.value);
		this.setValue(valueArray.filter(function (i) {
			return i !== value;
		}));
		this.focus();
	},

	clearValue: function clearValue(event) {
		// if the event was triggered by a mousedown and not the primary
		// button, ignore it.
		if (event && event.type === 'mousedown' && event.button !== 0) {
			return;
		}
		event.stopPropagation();
		event.preventDefault();
		this.setValue(this.getResetValue());
		this.setState({
			isOpen: false,
			inputValue: ''
		}, this.focus);
	},

	getResetValue: function getResetValue() {
		if (this.props.resetValue !== undefined) {
			return this.props.resetValue;
		} else if (this.props.multi) {
			return [];
		} else {
			return null;
		}
	},

	focusOption: function focusOption(option) {
		this.setState({
			focusedOption: option
		});
	},

	focusNextOption: function focusNextOption() {
		this.focusAdjacentOption('next');
	},

	focusPreviousOption: function focusPreviousOption() {
		this.focusAdjacentOption('previous');
	},

	focusPageUpOption: function focusPageUpOption() {
		this.focusAdjacentOption('page_up');
	},

	focusPageDownOption: function focusPageDownOption() {
		this.focusAdjacentOption('page_down');
	},

	focusStartOption: function focusStartOption() {
		this.focusAdjacentOption('start');
	},

	focusEndOption: function focusEndOption() {
		this.focusAdjacentOption('end');
	},

	focusAdjacentOption: function focusAdjacentOption(dir) {
		var options = this._visibleOptions.map(function (option, index) {
			return { option: option, index: index };
		}).filter(function (option) {
			return !option.option.disabled;
		});
		this._scrollToFocusedOptionOnUpdate = true;
		if (!this.state.isOpen) {
			this.setState({
				isOpen: true,
				inputValue: '',
				focusedOption: this._focusedOption || options[dir === 'next' ? 0 : options.length - 1].option
			});
			return;
		}
		if (!options.length) return;
		var focusedIndex = -1;
		for (var i = 0; i < options.length; i++) {
			if (this._focusedOption === options[i].option) {
				focusedIndex = i;
				break;
			}
		}
		if (dir === 'next' && focusedIndex !== -1) {
			focusedIndex = (focusedIndex + 1) % options.length;
		} else if (dir === 'previous') {
			if (focusedIndex > 0) {
				focusedIndex = focusedIndex - 1;
			} else {
				focusedIndex = options.length - 1;
			}
		} else if (dir === 'start') {
			focusedIndex = 0;
		} else if (dir === 'end') {
			focusedIndex = options.length - 1;
		} else if (dir === 'page_up') {
			var potentialIndex = focusedIndex - this.props.pageSize;
			if (potentialIndex < 0) {
				focusedIndex = 0;
			} else {
				focusedIndex = potentialIndex;
			}
		} else if (dir === 'page_down') {
			var potentialIndex = focusedIndex + this.props.pageSize;
			if (potentialIndex > options.length - 1) {
				focusedIndex = options.length - 1;
			} else {
				focusedIndex = potentialIndex;
			}
		}

		if (focusedIndex === -1) {
			focusedIndex = 0;
		}

		this.setState({
			focusedIndex: options[focusedIndex].index,
			focusedOption: options[focusedIndex].option
		});
	},

	getFocusedOption: function getFocusedOption() {
		return this._focusedOption;
	},

	getInputValue: function getInputValue() {
		return this.state.inputValue;
	},

	selectFocusedOption: function selectFocusedOption() {
		if (this._focusedOption) {
			return this.selectValue(this._focusedOption);
		}
	},

	renderLoading: function renderLoading() {
		if (!this.props.isLoading) return;
		return _react2['default'].createElement(
			'span',
			{ className: 'Select-loading-zone', 'aria-hidden': 'true' },
			_react2['default'].createElement('span', { className: 'Select-loading' })
		);
	},

	renderValue: function renderValue(valueArray, isOpen) {
		var _this4 = this;

		var renderLabel = this.props.valueRenderer || this.getOptionLabel;
		var ValueComponent = this.props.valueComponent;
		if (!valueArray.length) {
			return !this.state.inputValue ? _react2['default'].createElement(
				'div',
				{ className: 'Select-placeholder' },
				this.props.placeholder
			) : null;
		}
		var onClick = this.props.onValueClick ? this.handleValueClick : null;
		if (this.props.multi) {
			return valueArray.map(function (value, i) {
				return _react2['default'].createElement(
					ValueComponent,
					{
						id: _this4._instancePrefix + '-value-' + i,
						instancePrefix: _this4._instancePrefix,
						disabled: _this4.props.disabled || value.clearableValue === false,
						key: 'value-' + i + '-' + value[_this4.props.valueKey],
						onClick: onClick,
						onRemove: _this4.removeValue,
						value: value
					},
					renderLabel(value, i),
					_react2['default'].createElement(
						'span',
						{ className: 'Select-aria-only' },
						' '
					)
				);
			});
		} else if (!this.state.inputValue) {
			if (isOpen) onClick = null;
			return _react2['default'].createElement(
				ValueComponent,
				{
					id: this._instancePrefix + '-value-item',
					disabled: this.props.disabled,
					instancePrefix: this._instancePrefix,
					onClick: onClick,
					value: valueArray[0]
				},
				renderLabel(valueArray[0])
			);
		}
	},

	renderInput: function renderInput(valueArray, focusedOptionIndex) {
		var _this5 = this;

		if (this.props.inputRenderer) {
			return this.props.inputRenderer();
		} else {
			var _classNames;

			var className = (0, _classnames2['default'])('Select-input', this.props.inputProps.className);
			var isOpen = !!this.state.isOpen;

			var ariaOwns = (0, _classnames2['default'])((_classNames = {}, _defineProperty(_classNames, this._instancePrefix + '-list', isOpen), _defineProperty(_classNames, this._instancePrefix + '-backspace-remove-message', this.props.multi && !this.props.disabled && this.state.isFocused && !this.state.inputValue), _classNames));

			// TODO: Check how this project includes Object.assign()
			var inputProps = _extends({}, this.props.inputProps, {
				role: 'combobox',
				'aria-expanded': '' + isOpen,
				'aria-owns': ariaOwns,
				'aria-haspopup': '' + isOpen,
				'aria-activedescendant': isOpen ? this._instancePrefix + '-option-' + focusedOptionIndex : this._instancePrefix + '-value',
				'aria-labelledby': this.props['aria-labelledby'],
				'aria-label': this.props['aria-label'],
				className: className,
				tabIndex: this.props.tabIndex,
				onBlur: this.handleInputBlur,
				onChange: this.handleInputChange,
				onFocus: this.handleInputFocus,
				ref: function ref(_ref2) {
					return _this5.input = _ref2;
				},
				required: this.state.required,
				value: this.state.inputValue
			});

			if (this.props.disabled || !this.props.searchable) {
				var _props$inputProps = this.props.inputProps;
				var inputClassName = _props$inputProps.inputClassName;

				var divProps = _objectWithoutProperties(_props$inputProps, ['inputClassName']);

				return _react2['default'].createElement('div', _extends({}, divProps, {
					role: 'combobox',
					'aria-expanded': isOpen,
					'aria-owns': isOpen ? this._instancePrefix + '-list' : this._instancePrefix + '-value',
					'aria-activedescendant': isOpen ? this._instancePrefix + '-option-' + focusedOptionIndex : this._instancePrefix + '-value',
					className: className,
					tabIndex: this.props.tabIndex || 0,
					onBlur: this.handleInputBlur,
					onFocus: this.handleInputFocus,
					ref: function (ref) {
						return _this5.input = ref;
					},
					'aria-readonly': '' + !!this.props.disabled,
					style: { border: 0, width: 1, display: 'inline-block' } }));
			}

			if (this.props.autosize) {
				return _react2['default'].createElement(_reactInputAutosize2['default'], _extends({}, inputProps, { minWidth: '5px' }));
			}
			return _react2['default'].createElement(
				'div',
				{ className: className },
				_react2['default'].createElement('input', inputProps)
			);
		}
	},

	renderClear: function renderClear() {
		if (!this.props.clearable || !this.props.value || this.props.value === 0 || this.props.multi && !this.props.value.length || this.props.disabled || this.props.isLoading) return;
		return _react2['default'].createElement(
			'span',
			{ className: 'Select-clear-zone', title: this.props.multi ? this.props.clearAllText : this.props.clearValueText,
				'aria-label': this.props.multi ? this.props.clearAllText : this.props.clearValueText,
				onMouseDown: this.clearValue,
				onTouchStart: this.handleTouchStart,
				onTouchMove: this.handleTouchMove,
				onTouchEnd: this.handleTouchEndClearValue
			},
			_react2['default'].createElement('span', { className: 'Select-clear', dangerouslySetInnerHTML: { __html: '&times;' } })
		);
	},

	renderArrow: function renderArrow() {
		var onMouseDown = this.handleMouseDownOnArrow;
		var arrow = this.props.arrowRenderer({ onMouseDown: onMouseDown });

		return _react2['default'].createElement(
			'span',
			{
				className: 'Select-arrow-zone',
				onMouseDown: onMouseDown
			},
			arrow
		);
	},

	filterFlatOptions: function filterFlatOptions(excludeOptions) {
		var filterValue = this.state.inputValue;
		var flatOptions = this._flatOptions;
		if (this.props.filterOptions) {
			// Maintain backwards compatibility with boolean attribute
			var filterOptions = typeof this.props.filterOptions === 'function' ? this.props.filterOptions : _utilsDefaultFilterOptions2['default'];

			return filterOptions(flatOptions, filterValue, excludeOptions, {
				filterOption: this.props.filterOption,
				ignoreAccents: this.props.ignoreAccents,
				ignoreCase: this.props.ignoreCase,
				labelKey: this.props.labelKey,
				matchPos: this.props.matchPos,
				matchProp: this.props.matchProp,
				valueKey: this.props.valueKey,
				selectGroup: this.props.selectGroup
			});
		} else {
			return flatOptions;
		}
	},

	flattenOptions: function flattenOptions(options, group) {
		if (!options) return [];
		var flatOptions = [];
		for (var i = 0; i < options.length; i++) {
			var optionCopy = clone(options[i]);
			optionCopy.isInTree = false;
			if (group) {
				optionCopy.group = group;
			}
			if (isGroup(optionCopy)) {

				optionCopy.isGroupHeading = true;
				optionCopy.value = optionCopy.label;
				if (this.props.selectGroup) flatOptions.push(optionCopy);
				flatOptions = flatOptions.concat(this.flattenOptions(optionCopy.options, optionCopy));
				optionCopy.options = [];
			} else {
				flatOptions.push(optionCopy);
			}
		}
		return flatOptions;
	},

	unflattenOptions: function unflattenOptions(flatOptions) {
		var groupedOptions = [];
		var parent = undefined,
		    child = undefined;

		// Remove all ancestor groups from the tree
		flatOptions.forEach(function (option) {
			option.isInTree = false;
			parent = option.group;
			while (parent) {
				parent.options = [];

				if (parent.isInTree) {
					parent.isInTree = false;
				}
				parent = parent.group;
			}
		});

		// Now reconstruct the options tree
		flatOptions.forEach(function (option) {
			child = option;
			parent = child.group;

			while (parent) {
				if (!child.isInTree) {
					parent.options.push(child);
					child.isInTree = true;
				}

				child = parent;
				parent = child.group;
			}
			if (!child.isInTree) {
				groupedOptions.push(child);
				child.isInTree = true;
			}
		});
		groupedOptions = this.removeEmptyGroups(groupedOptions);
		return groupedOptions;
	},

	removeEmptyGroups: function removeEmptyGroups(groupedOptions, groupHeading) {
		var _this6 = this;

		return groupedOptions.filter(function (item, index) {
			if (!item.isGroupHeading) return true;
			_this6.removeEmptyGroups(item.options, item);
			if (item.options.length > 0) return true;
			if (groupHeading) groupHeading.options.splice(index, 1);
			return false;
		});
	},

	onOptionRef: function onOptionRef(ref, isFocused) {
		if (isFocused) {
			this.focused = ref;
		}
	},

	renderMenu: function renderMenu(options, valueArray, focusedOption) {
		if (options && options.length) {
			return this.props.menuRenderer({
				focusedOption: focusedOption,
				focusOption: this.focusOption,
				instancePrefix: this._instancePrefix,
				labelKey: this.props.labelKey,
				onFocus: this.focusOption,
				onOptionRef: this.onOptionRef,
				onSelect: this.selectValue,
				optionClassName: this.props.optionClassName,
				optionComponent: this.props.optionComponent,
				optionGroupComponent: this.props.optionGroupComponent,
				optionRenderer: this.props.optionRenderer || this.getOptionLabel,
				options: options,
				selectValue: this.selectValue,
				selectGroup: this.props.selectGroup,
				valueArray: valueArray,
				valueKey: this.props.valueKey
			});
		} else if (this.props.noResultsText) {
			return _react2['default'].createElement(
				'div',
				{ className: 'Select-noresults' },
				this.props.noResultsText
			);
		} else {
			return null;
		}
	},

	renderHiddenField: function renderHiddenField(valueArray) {
		var _this7 = this;

		if (!this.props.name) return;
		if (this.props.joinValues) {
			var value = valueArray.map(function (i) {
				return stringifyValue(i[_this7.props.valueKey]);
			}).join(this.props.delimiter);
			return _react2['default'].createElement('input', {
				type: 'hidden',
				ref: function (ref) {
					return _this7.value = ref;
				},
				name: this.props.name,
				value: value,
				disabled: this.props.disabled });
		}
		return valueArray.map(function (item, index) {
			return _react2['default'].createElement('input', { key: 'hidden.' + index,
				type: 'hidden',
				ref: 'value' + index,
				name: _this7.props.name,
				value: stringifyValue(item[_this7.props.valueKey]),
				disabled: _this7.props.disabled });
		});
	},

	getFocusableOptionIndex: function getFocusableOptionIndex(selectedOption) {
		var options = this._visibleOptions;
		if (!options.length) return null;

		var focusedOption = this.state.focusedOption || selectedOption;
		if (focusedOption && !focusedOption.disabled) {
			var focusedOptionIndex = options.indexOf(focusedOption);
			if (focusedOptionIndex !== -1) {
				return focusedOptionIndex;
			}
		}

		for (var i = 0; i < options.length; i++) {
			if (!options[i].disabled) return i;
		}
		return null;
	},

	renderOuter: function renderOuter(options, valueArray, focusedOption) {
		var _this8 = this;

		var Dropdown = this.props.dropdownComponent;
		var menu = this.renderMenu(options, valueArray, focusedOption);
		if (!menu) {
			return null;
		}

		return _react2['default'].createElement(
			Dropdown,
			null,
			_react2['default'].createElement(
				'div',
				{ ref: function (ref) {
						return _this8.menuContainer = ref;
					}, className: 'Select-menu-outer', style: this.props.menuContainerStyle },
				_react2['default'].createElement(
					'div',
					{ ref: function (ref) {
							return _this8.menu = ref;
						}, role: 'listbox', className: 'Select-menu', id: this._instancePrefix + '-list',
						style: this.props.menuStyle,
						onScroll: this.handleMenuScroll,
						onMouseDown: this.handleMouseDownOnMenu },
					menu
				)
			)
		);
	},

	render: function render() {
		var _this9 = this;

		var valueArray = this.getValueArray(this.props.value);
		this._visibleOptions = this.filterFlatOptions(this.props.multi ? valueArray : null);
		var options = this.unflattenOptions(this._visibleOptions);

		var isOpen = typeof this.props.isOpen === 'boolean' ? this.props.isOpen : this.state.isOpen;
		if (this.props.multi && !options.length && valueArray.length && !this.state.inputValue) isOpen = false;
		var focusedOptionIndex = this.getFocusableOptionIndex(valueArray[0]);

		var focusedOption = null;
		if (focusedOptionIndex !== null) {
			focusedOption = this._focusedOption = this._visibleOptions[focusedOptionIndex];
		} else {
			focusedOption = this._focusedOption = null;
		}

		var className = (0, _classnames2['default'])('Select', this.props.className, {
			'Select--multi': this.props.multi,
			'Select--single': !this.props.multi,
			'is-disabled': this.props.disabled,
			'is-focused': this.state.isFocused,
			'is-loading': this.props.isLoading,
			'is-open': isOpen,
			'is-pseudo-focused': this.state.isPseudoFocused,
			'is-searchable': this.props.searchable,
			'has-value': valueArray.length
		});

		var removeMessage = null;
		if (this.props.multi && !this.props.disabled && valueArray.length && !this.state.inputValue && this.state.isFocused && this.props.backspaceRemoves) {
			removeMessage = _react2['default'].createElement(
				'span',
				{ id: this._instancePrefix + '-backspace-remove-message', className: 'Select-aria-only', 'aria-live': 'assertive' },
				this.props.backspaceToRemoveMessage.replace('{label}', valueArray[valueArray.length - 1][this.props.labelKey])
			);
		}

		return _react2['default'].createElement(
			'div',
			{ ref: function (ref) {
					return _this9.wrapper = ref;
				},
				className: className,
				style: this.props.wrapperStyle },
			this.renderHiddenField(valueArray),
			_react2['default'].createElement(
				'div',
				{ ref: function (ref) {
						return _this9.control = ref;
					},
					className: 'Select-control',
					style: this.props.style,
					onKeyDown: this.handleKeyDown,
					onMouseDown: this.handleMouseDown,
					onTouchEnd: this.handleTouchEnd,
					onTouchStart: this.handleTouchStart,
					onTouchMove: this.handleTouchMove
				},
				_react2['default'].createElement(
					'span',
					{ className: 'Select-multi-value-wrapper', id: this._instancePrefix + '-value' },
					this.renderValue(valueArray, isOpen),
					this.renderInput(valueArray, focusedOptionIndex)
				),
				removeMessage,
				this.renderLoading(),
				this.renderClear(),
				this.renderArrow()
			),
			isOpen ? this.renderOuter(options, !this.props.multi ? valueArray : null, focusedOption) : null
		);
	}

});

exports['default'] = Select;
module.exports = exports['default'];

},{"./Async":1,"./AsyncCreatable":2,"./Creatable":3,"./Dropdown":4,"./Option":5,"./OptionGroup":6,"./Value":7,"./utils/defaultArrowRenderer":8,"./utils/defaultFilterOptions":9,"./utils/defaultMenuRenderer":10,"classnames":undefined,"react":undefined,"react-dom":undefined,"react-input-autosize":undefined}]},{},[])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvc2JhdWNoL1dvcmtzcGFjZS9PU1MvcmVhY3Qtc2VsZWN0LXBsdXMvc3JjL0FzeW5jLmpzIiwiL1VzZXJzL3NiYXVjaC9Xb3Jrc3BhY2UvT1NTL3JlYWN0LXNlbGVjdC1wbHVzL3NyYy9Bc3luY0NyZWF0YWJsZS5qcyIsIi9Vc2Vycy9zYmF1Y2gvV29ya3NwYWNlL09TUy9yZWFjdC1zZWxlY3QtcGx1cy9zcmMvQ3JlYXRhYmxlLmpzIiwiL1VzZXJzL3NiYXVjaC9Xb3Jrc3BhY2UvT1NTL3JlYWN0LXNlbGVjdC1wbHVzL3NyYy9Ecm9wZG93bi5qcyIsIi9Vc2Vycy9zYmF1Y2gvV29ya3NwYWNlL09TUy9yZWFjdC1zZWxlY3QtcGx1cy9zcmMvT3B0aW9uLmpzIiwiL1VzZXJzL3NiYXVjaC9Xb3Jrc3BhY2UvT1NTL3JlYWN0LXNlbGVjdC1wbHVzL3NyYy9PcHRpb25Hcm91cC5qcyIsIi9Vc2Vycy9zYmF1Y2gvV29ya3NwYWNlL09TUy9yZWFjdC1zZWxlY3QtcGx1cy9zcmMvVmFsdWUuanMiLCIvVXNlcnMvc2JhdWNoL1dvcmtzcGFjZS9PU1MvcmVhY3Qtc2VsZWN0LXBsdXMvc3JjL3V0aWxzL2RlZmF1bHRBcnJvd1JlbmRlcmVyLmpzIiwiL1VzZXJzL3NiYXVjaC9Xb3Jrc3BhY2UvT1NTL3JlYWN0LXNlbGVjdC1wbHVzL3NyYy91dGlscy9kZWZhdWx0RmlsdGVyT3B0aW9ucy5qcyIsIi9Vc2Vycy9zYmF1Y2gvV29ya3NwYWNlL09TUy9yZWFjdC1zZWxlY3QtcGx1cy9zcmMvdXRpbHMvZGVmYXVsdE1lbnVSZW5kZXJlci5qcyIsIi9Vc2Vycy9zYmF1Y2gvV29ya3NwYWNlL09TUy9yZWFjdC1zZWxlY3QtcGx1cy9zcmMvdXRpbHMvc3RyaXBEaWFjcml0aWNzLmpzIiwiL1VzZXJzL3NiYXVjaC9Xb3Jrc3BhY2UvT1NTL3JlYWN0LXNlbGVjdC1wbHVzL3NyYy9TZWxlY3QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7OztxQkNBa0IsT0FBTzs7OztzQkFFTixVQUFVOzs7O29DQUNELHlCQUF5Qjs7OztBQUVyRCxJQUFJLFNBQVMsR0FBRyxDQUFDLENBQUM7O0FBRWxCLFNBQVMsU0FBUyxDQUFFLEtBQUssRUFBRTtBQUMxQixLQUFJLEtBQUssSUFBSSxPQUFPLEtBQUssS0FBSyxRQUFRLEVBQUU7QUFDdkMsT0FBSyxHQUFHLEVBQUUsQ0FBQztFQUNYO0FBQ0QsUUFBTyxLQUFLLEdBQUcsS0FBSyxHQUFHLElBQUksQ0FBQztDQUM1Qjs7QUFFRCxTQUFTLFdBQVcsQ0FBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRTtBQUN6QyxLQUFJLENBQUMsS0FBSyxFQUFFLE9BQU87QUFDbkIsTUFBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLElBQUksQ0FBQztDQUNwQjs7QUFFRCxTQUFTLFlBQVksQ0FBRSxLQUFLLEVBQUUsS0FBSyxFQUFFO0FBQ3BDLEtBQUksQ0FBQyxLQUFLLEVBQUUsT0FBTztBQUNuQixNQUFLLElBQUksQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRTtBQUN2QyxNQUFJLFFBQVEsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNqQyxNQUFJLEtBQUssQ0FBQyxRQUFRLENBQUMsS0FBSyxLQUFLLEtBQUssUUFBUSxJQUFJLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxRQUFRLENBQUEsQUFBQyxFQUFFO0FBQ3hFLFVBQU8sS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0dBQ3ZCO0VBQ0Q7Q0FDRDs7QUFFRCxTQUFTLFdBQVcsQ0FBRSxPQUFPLEVBQUUsUUFBUSxFQUFFO0FBQ3hDLEtBQUksQ0FBQyxPQUFPLElBQUksT0FBTyxPQUFPLENBQUMsSUFBSSxLQUFLLFVBQVUsRUFBRSxPQUFPO0FBQzNELFFBQU8sT0FBTyxDQUFDLElBQUksQ0FBQyxVQUFDLElBQUksRUFBSztBQUM3QixVQUFRLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0VBQ3JCLEVBQUUsVUFBQyxHQUFHLEVBQUs7QUFDWCxVQUFRLENBQUMsR0FBRyxDQUFDLENBQUM7RUFDZCxDQUFDLENBQUM7Q0FDSDs7QUFFRCxJQUFNLFlBQVksR0FBRyxtQkFBTSxTQUFTLENBQUMsU0FBUyxDQUFDLENBQzlDLG1CQUFNLFNBQVMsQ0FBQyxNQUFNLEVBQ3RCLG1CQUFNLFNBQVMsQ0FBQyxJQUFJLENBQ3BCLENBQUMsQ0FBQzs7QUFFSCxJQUFNLEtBQUssR0FBRyxtQkFBTSxXQUFXLENBQUM7OztBQUMvQixVQUFTLEVBQUU7QUFDVixPQUFLLEVBQUUsbUJBQU0sU0FBUyxDQUFDLEdBQUc7QUFDMUIsVUFBUSxFQUFFLG1CQUFNLFNBQVMsQ0FBQyxJQUFJO0FBQzlCLGVBQWEsRUFBRSxtQkFBTSxTQUFTLENBQUMsSUFBSTtBQUNuQyxZQUFVLEVBQUUsbUJBQU0sU0FBUyxDQUFDLElBQUk7QUFDaEMsV0FBUyxFQUFFLG1CQUFNLFNBQVMsQ0FBQyxJQUFJO0FBQy9CLGFBQVcsRUFBRSxtQkFBTSxTQUFTLENBQUMsSUFBSSxDQUFDLFVBQVU7QUFDNUMsb0JBQWtCLEVBQUUsbUJBQU0sU0FBUyxDQUFDLE1BQU07QUFDMUMsY0FBWSxFQUFFLG1CQUFNLFNBQVMsQ0FBQyxNQUFNO0FBQ3BDLGVBQWEsRUFBRSxZQUFZO0FBQzNCLGVBQWEsRUFBRSxtQkFBTSxTQUFTLENBQUMsSUFBSTtBQUNuQyxhQUFXLEVBQUUsWUFBWTtBQUN6QixrQkFBZ0IsRUFBRSxZQUFZO0FBQzlCLGVBQWEsRUFBRSxtQkFBTSxTQUFTLENBQUMsTUFBTSxFQUNyQzs7QUFDRCxnQkFBZSxFQUFDLDJCQUFHO0FBQ2xCLFNBQU87QUFDTixRQUFLLEVBQUUsSUFBSTtBQUNYLGdCQUFhLEVBQUUsSUFBSTtBQUNuQixhQUFVLEVBQUUsSUFBSTtBQUNoQixxQkFBa0IsRUFBRSxZQUFZO0FBQ2hDLGVBQVksRUFBRSxDQUFDO0FBQ2YsZ0JBQWEsRUFBRSxjQUFjO0FBQzdCLG1CQUFnQixFQUFFLGdCQUFnQjtHQUNsQyxDQUFDO0VBQ0Y7QUFDRCxnQkFBZSxFQUFDLDJCQUFHO0FBQ2xCLFNBQU87QUFDTixRQUFLLEVBQUUsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDO0FBQ2xDLFlBQVMsRUFBRSxLQUFLO0FBQ2hCLFVBQU8sRUFBRSxFQUFFO0dBQ1gsQ0FBQztFQUNGO0FBQ0QsbUJBQWtCLEVBQUMsOEJBQUc7QUFDckIsTUFBSSxDQUFDLFVBQVUsR0FBRyxFQUFFLENBQUM7RUFDckI7QUFDRCxrQkFBaUIsRUFBQyw2QkFBRztBQUNwQixNQUFJLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0VBQ3JCO0FBQ0QsMEJBQXlCLEVBQUMsbUNBQUMsU0FBUyxFQUFFO0FBQ3JDLE1BQUksU0FBUyxDQUFDLEtBQUssS0FBSyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRTtBQUN6QyxPQUFJLENBQUMsUUFBUSxDQUFDO0FBQ2IsU0FBSyxFQUFFLFNBQVMsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDO0lBQ2pDLENBQUMsQ0FBQztHQUNIO0VBQ0Q7QUFDRCxNQUFLLEVBQUMsaUJBQUc7QUFDUixNQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO0VBQ3BCO0FBQ0QsV0FBVSxFQUFDLHNCQUFHO0FBQ2IsTUFBSSxDQUFDLGlCQUFpQixHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQzVCLE1BQUksQ0FBQyxRQUFRLENBQUM7QUFDYixZQUFTLEVBQUUsS0FBSztBQUNoQixVQUFPLEVBQUUsRUFBRTtHQUNYLENBQUMsQ0FBQztFQUNIO0FBQ0QsbUJBQWtCLEVBQUMsNEJBQUMsS0FBSyxFQUFFOzs7QUFDMUIsTUFBSSxVQUFVLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixHQUFHLFNBQVMsRUFBRSxDQUFDO0FBQ3RELFNBQU8sVUFBQyxHQUFHLEVBQUUsSUFBSSxFQUFLO0FBQ3JCLE9BQUksR0FBRyxFQUFFLE1BQU0sR0FBRyxDQUFDO0FBQ25CLE9BQUksQ0FBQyxNQUFLLFNBQVMsRUFBRSxFQUFFLE9BQU87QUFDOUIsY0FBVyxDQUFDLE1BQUssS0FBSyxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDM0MsT0FBSSxVQUFVLEtBQUssTUFBSyxpQkFBaUIsRUFBRSxPQUFPO0FBQ2xELFNBQUssUUFBUSxDQUFDO0FBQ2IsYUFBUyxFQUFFLEtBQUs7QUFDaEIsV0FBTyxFQUFFLElBQUksSUFBSSxJQUFJLENBQUMsT0FBTyxJQUFJLEVBQUU7SUFDbkMsQ0FBQyxDQUFDO0dBQ0gsQ0FBQztFQUNGO0FBQ0QsWUFBVyxFQUFDLHFCQUFDLEtBQUssRUFBRTtBQUNuQixNQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxFQUFFO0FBQzdCLE9BQUksU0FBUyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDOztBQUVoRCxPQUFJLFNBQVMsSUFBSSxJQUFJLEVBQUU7QUFDdEIsU0FBSyxHQUFHLEVBQUUsR0FBRyxTQUFTLENBQUM7SUFDdkI7R0FDRDtBQUNELE1BQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLEVBQUUsS0FBSyxHQUFHLHVDQUFnQixLQUFLLENBQUMsQ0FBQztBQUM3RCxNQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxFQUFFLEtBQUssR0FBRyxLQUFLLENBQUMsV0FBVyxFQUFFLENBQUM7O0FBRXZELE1BQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDO0FBQ3hCLE1BQUksS0FBSyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksRUFBRTtBQUMzQyxVQUFPLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztHQUN6QjtBQUNELE1BQUksV0FBVyxHQUFHLFlBQVksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztBQUN4RCxNQUFJLFdBQVcsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsRUFBRTtBQUN0RCxVQUFPLElBQUksQ0FBQyxRQUFRLENBQUM7QUFDcEIsV0FBTyxFQUFFLFdBQVcsQ0FBQyxPQUFPO0lBQzVCLENBQUMsQ0FBQztHQUNIO0FBQ0QsTUFBSSxDQUFDLFFBQVEsQ0FBQztBQUNiLFlBQVMsRUFBRSxJQUFJO0dBQ2YsQ0FBQyxDQUFDO0FBQ0gsTUFBSSxlQUFlLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3JELE1BQUksWUFBWSxHQUFHLFdBQVcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxLQUFLLEVBQUUsZUFBZSxDQUFDLEVBQUUsZUFBZSxDQUFDLENBQUM7QUFDaEcsU0FBTyxZQUFZLEdBQUcsWUFBWSxDQUFDLElBQUksQ0FBQyxZQUFNO0FBQzdDLFVBQU8sS0FBSyxDQUFDO0dBQ2IsQ0FBQyxHQUFHLEtBQUssQ0FBQztFQUNYO0FBQ0QsT0FBTSxFQUFDLGtCQUFHOzs7ZUFLTCxJQUFJLENBQUMsS0FBSzsrQkFIYixRQUFRO01BQVIsUUFBUSxtQ0FBRyxlQUFlO01BQzFCLGFBQWEsVUFBYixhQUFhOztNQUNWLFNBQVM7O2VBRWdCLElBQUksQ0FBQyxLQUFLO01BQWpDLFNBQVMsVUFBVCxTQUFTO01BQUUsT0FBTyxVQUFQLE9BQU87O0FBQ3hCLE1BQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUUsU0FBUyxHQUFHLElBQUksQ0FBQztBQUMzQyxNQUFJLFdBQVcsR0FBRyxTQUFTLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxrQkFBa0IsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQztBQUNyRixNQUFJLFNBQVMsRUFBRTtBQUNkLGdCQUFhLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUM7R0FDekMsTUFBTSxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksRUFBRTtBQUMvRSxnQkFBYSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsZ0JBQWdCLENBQUM7R0FDNUM7O0FBRUQsTUFBTSxLQUFLLGdCQUNQLFNBQVM7QUFDWixZQUFTLEVBQVQsU0FBUztBQUNULGdCQUFhLEVBQWIsYUFBYTtBQUNiLGdCQUFhLEVBQUUsSUFBSSxDQUFDLFdBQVc7QUFDL0IsVUFBTyxFQUFQLE9BQU87QUFDUCxjQUFXLEVBQVgsV0FBVztBQUNYLE1BQUcsRUFBRSxhQUFDLElBQUcsRUFBSztBQUNiLFdBQUssTUFBTSxHQUFHLElBQUcsQ0FBQztJQUNsQjtJQUNELENBQUM7O0FBRUYsU0FBTyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7RUFDdkI7Q0FDRCxDQUFDLENBQUM7O0FBRUgsU0FBUyxlQUFlLENBQUUsS0FBSyxFQUFFO0FBQ2hDLFFBQ0Msc0RBQVksS0FBSyxDQUFJLENBQ3BCO0NBQ0YsQ0FBQzs7QUFFRixNQUFNLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQzs7Ozs7Ozs7O3FCQ3BMTCxPQUFPOzs7O3NCQUNOLFVBQVU7Ozs7QUFFN0IsSUFBTSxjQUFjLEdBQUcsbUJBQU0sV0FBVyxDQUFDO0FBQ3hDLFlBQVcsRUFBRSxzQkFBc0I7O0FBRW5DLE9BQU0sRUFBQyxrQkFBRzs7O0FBQ1QsU0FDQztBQUFDLHVCQUFPLEtBQUs7R0FBSyxJQUFJLENBQUMsS0FBSztHQUMxQixVQUFDLFVBQVU7V0FDWDtBQUFDLHlCQUFPLFNBQVM7S0FBSyxNQUFLLEtBQUs7S0FDOUIsVUFBQyxjQUFjO2FBQ2YsbUVBQ0ssVUFBVSxFQUNWLGNBQWM7QUFDbEIsb0JBQWEsRUFBRSxVQUFDLEtBQUssRUFBSztBQUN6QixzQkFBYyxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNwQyxlQUFPLFVBQVUsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDdkMsQUFBQztBQUNGLFVBQUcsRUFBRSxVQUFDLEdBQUcsRUFBSztBQUNiLHNCQUFjLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3hCLGtCQUFVLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3BCLEFBQUM7U0FDRDtNQUNGO0tBQ2lCO0lBQ25CO0dBQ2EsQ0FDZDtFQUNGO0NBQ0QsQ0FBQyxDQUFDOztBQUVILE1BQU0sQ0FBQyxPQUFPLEdBQUcsY0FBYyxDQUFDOzs7Ozs7Ozs7OztxQkNoQ2QsT0FBTzs7OztzQkFDTixVQUFVOzs7O3lDQUNJLDhCQUE4Qjs7Ozt3Q0FDL0IsNkJBQTZCOzs7O0FBRTdELElBQU0sU0FBUyxHQUFHLG1CQUFNLFdBQVcsQ0FBQztBQUNuQyxZQUFXLEVBQUUsaUJBQWlCOztBQUU5QixVQUFTLEVBQUU7Ozs7QUFJVixVQUFRLEVBQUUsbUJBQU0sU0FBUyxDQUFDLElBQUk7OztBQUc5QixlQUFhLEVBQUUsbUJBQU0sU0FBUyxDQUFDLEdBQUc7Ozs7O0FBS2xDLGdCQUFjLEVBQUUsbUJBQU0sU0FBUyxDQUFDLElBQUk7Ozs7QUFJbEMsa0JBQWdCLEVBQUUsbUJBQU0sU0FBUyxDQUFDLElBQUk7OztBQUd4QyxjQUFZLEVBQUUsbUJBQU0sU0FBUyxDQUFDLEdBQUc7Ozs7QUFJakMsa0JBQWdCLEVBQUUsbUJBQU0sU0FBUyxDQUFDLElBQUk7OztBQUd0QyxTQUFPLEVBQUUsbUJBQU0sU0FBUyxDQUFDLEtBQUs7Ozs7QUFJOUIsbUJBQWlCLEVBQUUsbUJBQU0sU0FBUyxDQUFDLElBQUk7OztBQUd2QyxtQ0FBaUMsRUFBRSxtQkFBTSxTQUFTLENBQUMsSUFBSTtFQUN2RDs7O0FBR0QsUUFBTyxFQUFFO0FBQ1IsZ0JBQWMsRUFBZCxjQUFjO0FBQ2Qsa0JBQWdCLEVBQWhCLGdCQUFnQjtBQUNoQixrQkFBZ0IsRUFBaEIsZ0JBQWdCO0FBQ2hCLG1CQUFpQixFQUFqQixpQkFBaUI7QUFDakIsbUNBQWlDLEVBQWpDLGlDQUFpQztFQUNqQzs7QUFFRCxnQkFBZSxFQUFDLDJCQUFHO0FBQ2xCLFNBQU87QUFDTixnQkFBYSx3Q0FBc0I7QUFDbkMsaUJBQWMsRUFBZCxjQUFjO0FBQ2QsbUJBQWdCLEVBQWhCLGdCQUFnQjtBQUNoQixlQUFZLHVDQUFxQjtBQUNqQyxtQkFBZ0IsRUFBaEIsZ0JBQWdCO0FBQ2hCLG9CQUFpQixFQUFqQixpQkFBaUI7QUFDakIsb0NBQWlDLEVBQWpDLGlDQUFpQztHQUNqQyxDQUFDO0VBQ0Y7O0FBRUQsZ0JBQWUsRUFBQywyQkFBRztlQU1kLElBQUksQ0FBQyxLQUFLO01BSmIsZ0JBQWdCLFVBQWhCLGdCQUFnQjtNQUNoQixnQkFBZ0IsVUFBaEIsZ0JBQWdCOzhCQUNoQixPQUFPO01BQVAsT0FBTyxrQ0FBRyxFQUFFO01BQ1osaUNBQWlDLFVBQWpDLGlDQUFpQzs7QUFHbEMsTUFBSSxnQkFBZ0IsQ0FBQyxFQUFFLEtBQUssRUFBRSxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUMsRUFBRTtBQUNqRCxPQUFNLE1BQU0sR0FBRyxnQkFBZ0IsQ0FBQyxFQUFFLEtBQUssRUFBRSxJQUFJLENBQUMsVUFBVSxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUSxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztBQUM5RyxPQUFNLGVBQWMsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLEVBQUUsTUFBTSxFQUFOLE1BQU0sRUFBRSxDQUFDLENBQUM7OztBQUd2RCxPQUFJLGVBQWMsRUFBRTtBQUNuQixXQUFPLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDOztBQUV4QixRQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNoQztHQUNEO0VBQ0Q7O0FBRUQsY0FBYSxFQUFDLHlCQUFZO2dCQUMrQyxJQUFJLENBQUMsS0FBSztNQUExRSxhQUFhLFdBQWIsYUFBYTtNQUFFLGdCQUFnQixXQUFoQixnQkFBZ0I7TUFBRSxPQUFPLFdBQVAsT0FBTztNQUFFLGlCQUFpQixXQUFqQixpQkFBaUI7Ozs7O0FBS25FLE1BQU0sY0FBYyxHQUFHLFVBQU8sQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDOztBQUV2QyxNQUFNLGVBQWUsR0FBRyxhQUFhLDRCQUFXLElBQUksRUFBRSxDQUFDOztBQUV2RCxNQUFJLGdCQUFnQixDQUFDLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQyxFQUFFO09BQ3pDLGlCQUFnQixHQUFLLElBQUksQ0FBQyxLQUFLLENBQS9CLGdCQUFnQjs7QUFFeEIsT0FBTSxNQUFNLEdBQUcsaUJBQWdCLENBQUM7QUFDL0IsU0FBSyxFQUFFLElBQUksQ0FBQyxVQUFVO0FBQ3RCLFlBQVEsRUFBRSxJQUFJLENBQUMsUUFBUTtBQUN2QixZQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVE7SUFDdkIsQ0FBQyxDQUFDOzs7O0FBSUgsT0FBTSxnQkFBYyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUM7QUFDMUMsVUFBTSxFQUFOLE1BQU07QUFDTixXQUFPLEVBQUUsY0FBYyxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUM7SUFDL0MsQ0FBQyxDQUFDOztBQUVILE9BQUksZ0JBQWMsRUFBRTtBQUNuQixRQUFNLE9BQU0sR0FBRyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7O0FBRWxELFFBQUksQ0FBQyx3QkFBd0IsR0FBRyxpQkFBZ0IsQ0FBQztBQUNoRCxVQUFLLEVBQUUsT0FBTTtBQUNiLGFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUTtBQUN2QixhQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVE7S0FDdkIsQ0FBQyxDQUFDOztBQUVILG1CQUFlLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO0lBQ3ZEO0dBQ0Q7O0FBRUQsU0FBTyxlQUFlLENBQUM7RUFDdkI7O0FBRUQsZUFBYyxFQUFDLHdCQUFDLEtBR2YsRUFBRTtNQUZGLE1BQU0sR0FEUyxLQUdmLENBRkEsTUFBTTtNQUNOLE9BQU8sR0FGUSxLQUdmLENBREEsT0FBTztNQUVDLGNBQWMsR0FBSyxJQUFJLENBQUMsS0FBSyxDQUE3QixjQUFjOztBQUV0QixTQUFPLEdBQUcsT0FBTyxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsaUJBQWlCLEVBQUUsQ0FBQzs7QUFFckQsU0FBTyxjQUFjLENBQUM7QUFDckIsV0FBUSxFQUFFLElBQUksQ0FBQyxRQUFRO0FBQ3ZCLFNBQU0sRUFBTixNQUFNO0FBQ04sVUFBTyxFQUFQLE9BQU87QUFDUCxXQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVE7R0FDdkIsQ0FBQyxDQUFDO0VBQ0g7O0FBRUQsYUFBWSxFQUFDLHNCQUFDLE1BQU0sRUFBRTtNQUNiLFlBQVksR0FBSyxJQUFJLENBQUMsS0FBSyxDQUEzQixZQUFZOztBQUVwQixTQUFPLFlBQVksY0FDZixNQUFNO0FBQ1QsV0FBUSxFQUFFLElBQUksQ0FBQyxjQUFjO0tBQzVCLENBQUM7RUFDSDs7QUFFRCxjQUFhLEVBQUMsdUJBQUMsS0FBSyxFQUFFOztBQUVyQixNQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQztFQUN4Qjs7QUFFRCxlQUFjLEVBQUMsd0JBQUMsS0FBSyxFQUFFO01BQ2QsaUNBQWlDLEdBQUssSUFBSSxDQUFDLEtBQUssQ0FBaEQsaUNBQWlDOztBQUN6QyxNQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLGdCQUFnQixFQUFFLENBQUM7O0FBRXJELE1BQ0MsYUFBYSxJQUNiLGFBQWEsS0FBSyxJQUFJLENBQUMsd0JBQXdCLElBQy9DLGlDQUFpQyxDQUFDLEVBQUUsT0FBTyxFQUFFLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQyxFQUM1RDtBQUNELE9BQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQzs7O0FBR3ZCLFFBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQztHQUN2QjtFQUNEOztBQUVELGVBQWMsRUFBQyx3QkFBQyxNQUFNLEVBQUUsS0FBSyxFQUFFO0FBQzlCLE1BQUksTUFBTSxLQUFLLElBQUksQ0FBQyx3QkFBd0IsRUFBRTtBQUM3QyxPQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7R0FDdkIsTUFBTTtBQUNOLE9BQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0dBQ2hDO0VBQ0Q7O0FBRUQsT0FBTSxFQUFDLGtCQUFHOzs7Z0JBTUwsSUFBSSxDQUFDLEtBQUs7aUNBSmIsUUFBUTtNQUFSLFFBQVEsb0NBQUcsZUFBZTtNQUMxQixnQkFBZ0IsV0FBaEIsZ0JBQWdCO01BQ2hCLGlDQUFpQyxXQUFqQyxpQ0FBaUM7O01BQzlCLFNBQVM7O0FBR2IsTUFBTSxLQUFLLGdCQUNQLFNBQVM7QUFDWixjQUFXLEVBQUUsSUFBSTtBQUNqQixnQkFBYSxFQUFFLElBQUksQ0FBQyxhQUFhO0FBQ2pDLGVBQVksRUFBRSxJQUFJLENBQUMsWUFBWTtBQUMvQixnQkFBYSxFQUFFLElBQUksQ0FBQyxhQUFhO0FBQ2pDLGlCQUFjLEVBQUUsSUFBSSxDQUFDLGNBQWM7QUFDbkMsTUFBRyxFQUFFLGFBQUMsSUFBRyxFQUFLO0FBQ2IsVUFBSyxNQUFNLEdBQUcsSUFBRyxDQUFDOzs7QUFHbEIsUUFBSSxJQUFHLEVBQUU7QUFDUixXQUFLLFFBQVEsR0FBRyxJQUFHLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQztBQUNuQyxXQUFLLFFBQVEsR0FBRyxJQUFHLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQztLQUNuQztJQUNEO0lBQ0QsQ0FBQzs7QUFFRixTQUFPLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztFQUN2QjtDQUNELENBQUMsQ0FBQzs7QUFFSCxTQUFTLGVBQWUsQ0FBRSxLQUFLLEVBQUU7QUFDaEMsUUFDQyxzREFBWSxLQUFLLENBQUksQ0FDcEI7Q0FDRixDQUFDOztBQUVGLFNBQVMsY0FBYyxDQUFFLEtBQXVDLEVBQUU7S0FBdkMsTUFBTSxHQUFSLEtBQXVDLENBQXJDLE1BQU07S0FBRSxPQUFPLEdBQWpCLEtBQXVDLENBQTdCLE9BQU87S0FBRSxRQUFRLEdBQTNCLEtBQXVDLENBQXBCLFFBQVE7S0FBRSxRQUFRLEdBQXJDLEtBQXVDLENBQVYsUUFBUTs7QUFDN0QsUUFBTyxPQUFPLENBQ1osTUFBTSxDQUFDLFVBQUMsY0FBYztTQUN0QixjQUFjLENBQUMsUUFBUSxDQUFDLEtBQUssTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUM3QyxjQUFjLENBQUMsUUFBUSxDQUFDLEtBQUssTUFBTSxDQUFDLFFBQVEsQ0FBQztFQUFBLENBQzdDLENBQ0EsTUFBTSxLQUFLLENBQUMsQ0FBQztDQUNmLENBQUM7O0FBRUYsU0FBUyxnQkFBZ0IsQ0FBRSxLQUFTLEVBQUU7S0FBVCxLQUFLLEdBQVAsS0FBUyxDQUFQLEtBQUs7O0FBQ2pDLFFBQU8sQ0FBQyxDQUFDLEtBQUssQ0FBQztDQUNmLENBQUM7O0FBRUYsU0FBUyxnQkFBZ0IsQ0FBRSxLQUE2QixFQUFFO0tBQTdCLEtBQUssR0FBUCxLQUE2QixDQUEzQixLQUFLO0tBQUUsUUFBUSxHQUFqQixLQUE2QixDQUFwQixRQUFRO0tBQUUsUUFBUSxHQUEzQixLQUE2QixDQUFWLFFBQVE7O0FBQ3JELEtBQU0sTUFBTSxHQUFHLEVBQUUsQ0FBQztBQUNsQixPQUFNLENBQUMsUUFBUSxDQUFDLEdBQUcsS0FBSyxDQUFDO0FBQ3hCLE9BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxLQUFLLENBQUM7QUFDekIsT0FBTSxDQUFDLFNBQVMsR0FBRyxrQ0FBa0MsQ0FBQztBQUN0RCxRQUFPLE1BQU0sQ0FBQztDQUNmLENBQUM7O0FBRUYsU0FBUyxpQkFBaUIsQ0FBRSxLQUFLLEVBQUU7QUFDbEMsNEJBQXlCLEtBQUssT0FBSTtDQUNsQzs7QUFFRCxTQUFTLGlDQUFpQyxDQUFFLEtBQVcsRUFBRTtLQUFYLE9BQU8sR0FBVCxLQUFXLENBQVQsT0FBTzs7QUFDcEQsU0FBUSxPQUFPO0FBQ2QsT0FBSyxDQUFDLENBQUM7QUFDUCxPQUFLLEVBQUUsQ0FBQztBQUNSLE9BQUssR0FBRzs7QUFDUCxVQUFPLElBQUksQ0FBQztBQUFBLEVBQ2I7O0FBRUQsUUFBTyxLQUFLLENBQUM7Q0FDYixDQUFDOztBQUVGLE1BQU0sQ0FBQyxPQUFPLEdBQUcsU0FBUyxDQUFDOzs7Ozs7O3FCQzlQVCxPQUFPOzs7O0FBRXpCLElBQU0sUUFBUSxHQUFHLG1CQUFNLFdBQVcsQ0FBQzs7O0FBQ2pDLFdBQVMsRUFBRTtBQUNULFlBQVEsRUFBRSxtQkFBTSxTQUFTLENBQUMsSUFBSTtHQUMvQjtBQUNELFFBQU0sRUFBQyxrQkFBRzs7QUFFUixXQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDO0dBQzVCO0NBQ0YsQ0FBQyxDQUFDOztBQUVILE1BQU0sQ0FBQyxPQUFPLEdBQUcsUUFBUSxDQUFDOzs7Ozs7O3FCQ1pSLE9BQU87Ozs7MEJBQ0YsWUFBWTs7OztBQUVuQyxJQUFNLE1BQU0sR0FBRyxtQkFBTSxXQUFXLENBQUM7OztBQUNoQyxVQUFTLEVBQUU7QUFDVixVQUFRLEVBQUUsbUJBQU0sU0FBUyxDQUFDLElBQUk7QUFDOUIsV0FBUyxFQUFFLG1CQUFNLFNBQVMsQ0FBQyxNQUFNO0FBQ2pDLGdCQUFjLEVBQUUsbUJBQU0sU0FBUyxDQUFDLE1BQU0sQ0FBQyxVQUFVO0FBQ2pELFlBQVUsRUFBRSxtQkFBTSxTQUFTLENBQUMsSUFBSTtBQUNoQyxXQUFTLEVBQUUsbUJBQU0sU0FBUyxDQUFDLElBQUk7QUFDL0IsWUFBVSxFQUFFLG1CQUFNLFNBQVMsQ0FBQyxJQUFJO0FBQ2hDLFNBQU8sRUFBRSxtQkFBTSxTQUFTLENBQUMsSUFBSTtBQUM3QixVQUFRLEVBQUUsbUJBQU0sU0FBUyxDQUFDLElBQUk7QUFDOUIsV0FBUyxFQUFFLG1CQUFNLFNBQVMsQ0FBQyxJQUFJO0FBQy9CLFFBQU0sRUFBRSxtQkFBTSxTQUFTLENBQUMsTUFBTSxDQUFDLFVBQVU7QUFDekMsYUFBVyxFQUFFLG1CQUFNLFNBQVMsQ0FBQyxNQUFNLEVBQ25DOztBQUNELFdBQVUsRUFBQyxvQkFBQyxLQUFLLEVBQUU7QUFDbEIsT0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO0FBQ3ZCLE9BQUssQ0FBQyxlQUFlLEVBQUUsQ0FBQztBQUN4QixNQUFJLEFBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxPQUFPLEtBQUssR0FBRyxJQUFLLEVBQUUsTUFBTSxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUEsQUFBQyxFQUFFO0FBQ2hFLFVBQU87R0FDUDtBQUNELE1BQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUU7QUFDeEIsU0FBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0dBQ3BELE1BQU07QUFDTixTQUFNLENBQUMsUUFBUSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztHQUN6QztFQUNEOztBQUVELGdCQUFlLEVBQUMseUJBQUMsS0FBSyxFQUFFO0FBQ3ZCLE9BQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQztBQUN2QixPQUFLLENBQUMsZUFBZSxFQUFFLENBQUM7QUFDeEIsTUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUM7RUFDOUM7O0FBRUQsaUJBQWdCLEVBQUMsMEJBQUMsS0FBSyxFQUFFO0FBQ3hCLE1BQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7RUFDcEI7O0FBRUQsZ0JBQWUsRUFBQyx5QkFBQyxLQUFLLEVBQUU7QUFDdkIsTUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztFQUNwQjs7QUFFRCxlQUFjLEVBQUEsd0JBQUMsS0FBSyxFQUFDOzs7QUFHcEIsTUFBRyxJQUFJLENBQUMsUUFBUSxFQUFFLE9BQU87O0FBRXpCLE1BQUksQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLENBQUM7RUFDNUI7O0FBRUQsZ0JBQWUsRUFBQyx5QkFBQyxLQUFLLEVBQUU7O0FBRXZCLE1BQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO0VBQ3JCOztBQUVELGlCQUFnQixFQUFDLDBCQUFDLEtBQUssRUFBRTs7QUFFeEIsTUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7RUFDdEI7O0FBRUQsUUFBTyxFQUFDLGlCQUFDLEtBQUssRUFBRTtBQUNmLE1BQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsRUFBRTtBQUMxQixPQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQztHQUM3QztFQUNEO0FBQ0QsT0FBTSxFQUFDLGtCQUFHO2VBQ3FDLElBQUksQ0FBQyxLQUFLO01BQWxELE1BQU0sVUFBTixNQUFNO01BQUUsY0FBYyxVQUFkLGNBQWM7TUFBRSxXQUFXLFVBQVgsV0FBVzs7QUFDekMsTUFBSSxTQUFTLEdBQUcsNkJBQVcsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDOztBQUVuRSxTQUFPLE1BQU0sQ0FBQyxRQUFRLEdBQ3JCOztLQUFLLFNBQVMsRUFBRSxTQUFTLEFBQUM7QUFDekIsZUFBVyxFQUFFLElBQUksQ0FBQyxVQUFVLEFBQUM7QUFDN0IsV0FBTyxFQUFFLElBQUksQ0FBQyxVQUFVLEFBQUM7R0FDeEIsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRO0dBQ2YsR0FFTjs7S0FBSyxTQUFTLEVBQUUsU0FBUyxBQUFDO0FBQ3pCLFNBQUssRUFBRSxNQUFNLENBQUMsS0FBSyxBQUFDO0FBQ3BCLFFBQUksRUFBQyxRQUFRO0FBQ1osZUFBVyxFQUFFLElBQUksQ0FBQyxlQUFlLEFBQUM7QUFDbkMsZ0JBQVksRUFBRSxJQUFJLENBQUMsZ0JBQWdCLEFBQUM7QUFDcEMsZUFBVyxFQUFFLElBQUksQ0FBQyxlQUFlLEFBQUM7QUFDbEMsZ0JBQVksRUFBRSxJQUFJLENBQUMsZ0JBQWdCLEFBQUM7QUFDcEMsZUFBVyxFQUFFLElBQUksQ0FBQyxlQUFlLEFBQUM7QUFDbEMsY0FBVSxFQUFFLElBQUksQ0FBQyxjQUFjLEFBQUM7QUFDaEMsTUFBRSxFQUFFLGNBQWMsR0FBRyxVQUFVLEdBQUcsV0FBVyxBQUFDO0FBQzlDLFNBQUssRUFBRSxNQUFNLENBQUMsS0FBSyxBQUFDO0dBQ25CLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUTtHQUNmLEFBQ04sQ0FBQztFQUNGO0NBQ0QsQ0FBQyxDQUFDOztBQUVILE1BQU0sQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDOzs7Ozs7O3FCQy9GTixPQUFPOzs7OzBCQUNGLFlBQVk7Ozs7QUFFbkMsSUFBTSxXQUFXLEdBQUcsbUJBQU0sV0FBVyxDQUFDOzs7QUFDckMsVUFBUyxFQUFFO0FBQ1YsVUFBUSxFQUFFLG1CQUFNLFNBQVMsQ0FBQyxHQUFHO0FBQzdCLFdBQVMsRUFBRSxtQkFBTSxTQUFTLENBQUMsTUFBTTtBQUNqQyxZQUFVLEVBQUUsbUJBQU0sU0FBUyxDQUFDLElBQUk7QUFDaEMsV0FBUyxFQUFFLG1CQUFNLFNBQVMsQ0FBQyxJQUFJO0FBQy9CLFdBQVMsRUFBRSxtQkFBTSxTQUFTLENBQUMsSUFBSTtBQUMvQixZQUFVLEVBQUUsbUJBQU0sU0FBUyxDQUFDLElBQUk7QUFDaEMsT0FBSyxFQUFFLG1CQUFNLFNBQVMsQ0FBQyxJQUFJO0FBQzNCLFNBQU8sRUFBRSxtQkFBTSxTQUFTLENBQUMsSUFBSTtBQUM3QixVQUFRLEVBQUUsbUJBQU0sU0FBUyxDQUFDLElBQUk7QUFDOUIsUUFBTSxFQUFFLG1CQUFNLFNBQVMsQ0FBQyxNQUFNLENBQUMsVUFBVTtBQUN6QyxhQUFXLEVBQUUsbUJBQU0sU0FBUyxDQUFDLElBQUksRUFDakM7OztBQUVELFdBQVUsRUFBQyxvQkFBQyxLQUFLLEVBQUU7QUFDbEIsT0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO0FBQ3ZCLE9BQUssQ0FBQyxlQUFlLEVBQUUsQ0FBQztBQUN4QixNQUFJLEFBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxPQUFPLEtBQUssR0FBRyxJQUFLLEVBQUUsTUFBTSxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUEsQUFBQyxFQUFFO0FBQ2hFLFVBQU87R0FDUDtBQUNELE1BQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUU7QUFDeEIsU0FBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0dBQ3BELE1BQU07QUFDTixTQUFNLENBQUMsUUFBUSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztHQUN6QztFQUNEOztBQUVELGdCQUFlLEVBQUMseUJBQUMsS0FBSyxFQUFFO01BQ2YsV0FBVyxHQUFLLElBQUksQ0FBQyxLQUFLLENBQTFCLFdBQVc7O0FBQ25CLE9BQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQztBQUN2QixPQUFLLENBQUMsZUFBZSxFQUFFLENBQUM7QUFDeEIsTUFBSSxXQUFXLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUM7RUFDL0Q7O0FBRUQsaUJBQWdCLEVBQUMsMEJBQUMsS0FBSyxFQUFFO01BQ2hCLFdBQVcsR0FBSyxJQUFJLENBQUMsS0FBSyxDQUExQixXQUFXOztBQUNuQixNQUFJLFdBQVcsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO0VBQ3JDOztBQUVELGdCQUFlLEVBQUMseUJBQUMsS0FBSyxFQUFFO01BQ2YsV0FBVyxHQUFLLElBQUksQ0FBQyxLQUFLLENBQTFCLFdBQVc7O0FBQ25CLE1BQUksV0FBVyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7RUFDckM7O0FBRUQsZUFBYyxFQUFBLHdCQUFDLEtBQUssRUFBQzs7O0FBR3BCLE1BQUcsSUFBSSxDQUFDLFFBQVEsRUFBRSxPQUFPOztBQUV6QixNQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDO0VBQzVCOztBQUVELGdCQUFlLEVBQUMseUJBQUMsS0FBSyxFQUFFOztBQUV2QixNQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztFQUNyQjs7QUFFRCxpQkFBZ0IsRUFBQywwQkFBQyxLQUFLLEVBQUU7O0FBRXhCLE1BQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO0VBQ3RCOztBQUVELFFBQU8sRUFBQyxpQkFBQyxLQUFLLEVBQUU7QUFDZixNQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUU7QUFDMUIsT0FBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUM7R0FDN0M7RUFDRDs7QUFFRCxPQUFNLEVBQUMsa0JBQUc7ZUFDNEMsSUFBSSxDQUFDLEtBQUs7TUFBekQsTUFBTSxVQUFOLE1BQU07TUFBRSxXQUFXLFVBQVgsV0FBVztNQUFFLFNBQVMsVUFBVCxTQUFTO01BQUUsVUFBVSxVQUFWLFVBQVU7O0FBQ2hELE1BQUksU0FBUyxHQUFHLDZCQUFXLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQzs7QUFFbkUsTUFBSSxtQkFBbUIsR0FBRyw2QkFBVztBQUNwQyw4QkFBMkIsRUFBRyxJQUFJO0FBQ2xDLHlDQUFzQyxFQUFFLFdBQVc7QUFDbkQsZUFBWSxFQUFFLFNBQVM7QUFDdkIsZ0JBQWEsRUFBRSxVQUFVO0dBQ3pCLENBQUMsQ0FBQzs7QUFFSCxTQUFPLE1BQU0sQ0FBQyxRQUFRLEdBQ3JCOztLQUFLLFNBQVMsRUFBRSxTQUFTLEFBQUM7QUFDekIsZUFBVyxFQUFFLElBQUksQ0FBQyxVQUFVLEFBQUM7QUFDN0IsV0FBTyxFQUFFLElBQUksQ0FBQyxVQUFVLEFBQUM7R0FDeEIsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRO0dBQ2YsR0FFTjs7S0FBSyxTQUFTLEVBQUUsU0FBUyxBQUFDO0FBQ3pCLFNBQUssRUFBRSxNQUFNLENBQUMsS0FBSyxBQUFDO0FBQ3BCLGVBQVcsRUFBRSxJQUFJLENBQUMsZUFBZSxBQUFDOztBQUVsQyxnQkFBWSxFQUFFLElBQUksQ0FBQyxnQkFBZ0IsQUFBQztBQUNwQyxlQUFXLEVBQUUsSUFBSSxDQUFDLGVBQWUsQUFBQztBQUNsQyxjQUFVLEVBQUUsSUFBSSxDQUFDLGNBQWMsQUFBQztBQUNoQyxTQUFLLEVBQUUsTUFBTSxDQUFDLEtBQUssQUFBQztHQUNwQjs7O0FBQ0MsY0FBUyxFQUFFLG1CQUFtQixBQUFDO0FBQy9CLGlCQUFZLEVBQUUsSUFBSSxDQUFDLGdCQUFnQixBQUFDO0FBQ3BDLGdCQUFXLEVBQUUsSUFBSSxDQUFDLGVBQWUsQUFBQzs7SUFFakMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLO0lBQ1o7R0FDTCxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVE7R0FDZixBQUNOLENBQUM7RUFDRjtDQUNELENBQUMsQ0FBQzs7QUFFSCxNQUFNLENBQUMsT0FBTyxHQUFHLFdBQVcsQ0FBQzs7Ozs7OztxQkMvR1gsT0FBTzs7OzswQkFDRixZQUFZOzs7O0FBRW5DLElBQU0sS0FBSyxHQUFHLG1CQUFNLFdBQVcsQ0FBQzs7QUFFL0IsWUFBVyxFQUFFLE9BQU87O0FBRXBCLFVBQVMsRUFBRTtBQUNWLFVBQVEsRUFBRSxtQkFBTSxTQUFTLENBQUMsSUFBSTtBQUM5QixVQUFRLEVBQUUsbUJBQU0sU0FBUyxDQUFDLElBQUk7QUFDOUIsSUFBRSxFQUFFLG1CQUFNLFNBQVMsQ0FBQyxNQUFNO0FBQzFCLFNBQU8sRUFBRSxtQkFBTSxTQUFTLENBQUMsSUFBSTtBQUM3QixVQUFRLEVBQUUsbUJBQU0sU0FBUyxDQUFDLElBQUk7QUFDOUIsT0FBSyxFQUFFLG1CQUFNLFNBQVMsQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUN4Qzs7O0FBRUQsZ0JBQWUsRUFBQyx5QkFBQyxLQUFLLEVBQUU7QUFDdkIsTUFBSSxLQUFLLENBQUMsSUFBSSxLQUFLLFdBQVcsSUFBSSxLQUFLLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtBQUNyRCxVQUFPO0dBQ1A7QUFDRCxNQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFO0FBQ3ZCLFFBQUssQ0FBQyxlQUFlLEVBQUUsQ0FBQztBQUN4QixPQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztBQUM1QyxVQUFPO0dBQ1A7QUFDRCxNQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRTtBQUMxQixRQUFLLENBQUMsZUFBZSxFQUFFLENBQUM7R0FDeEI7RUFDRDs7QUFFRCxTQUFRLEVBQUMsa0JBQUMsS0FBSyxFQUFFO0FBQ2hCLE9BQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQztBQUN2QixPQUFLLENBQUMsZUFBZSxFQUFFLENBQUM7QUFDeEIsTUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztFQUN0Qzs7QUFFRCxxQkFBb0IsRUFBQyw4QkFBQyxLQUFLLEVBQUM7OztBQUczQixNQUFHLElBQUksQ0FBQyxRQUFRLEVBQUUsT0FBTzs7O0FBR3pCLE1BQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7RUFDckI7O0FBRUQsZ0JBQWUsRUFBQyx5QkFBQyxLQUFLLEVBQUU7O0FBRXZCLE1BQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO0VBQ3JCOztBQUVELGlCQUFnQixFQUFDLDBCQUFDLEtBQUssRUFBRTs7QUFFeEIsTUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7RUFDdEI7O0FBRUQsaUJBQWdCLEVBQUMsNEJBQUc7QUFDbkIsTUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLE9BQU87QUFDeEQsU0FDQzs7S0FBTSxTQUFTLEVBQUMsbUJBQW1CO0FBQ2xDLG1CQUFZLE1BQU07QUFDbEIsZUFBVyxFQUFFLElBQUksQ0FBQyxRQUFRLEFBQUM7QUFDM0IsY0FBVSxFQUFFLElBQUksQ0FBQyxvQkFBb0IsQUFBQztBQUN0QyxnQkFBWSxFQUFFLElBQUksQ0FBQyxnQkFBZ0IsQUFBQztBQUNwQyxlQUFXLEVBQUUsSUFBSSxDQUFDLGVBQWUsQUFBQzs7R0FFNUIsQ0FDTjtFQUNGOztBQUVELFlBQVcsRUFBQyx1QkFBRztBQUNkLE1BQUksU0FBUyxHQUFHLG9CQUFvQixDQUFDO0FBQ3JDLFNBQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxHQUNqRDs7S0FBRyxTQUFTLEVBQUUsU0FBUyxBQUFDLEVBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQUFBQyxFQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLEFBQUMsRUFBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLGVBQWUsQUFBQyxFQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsZUFBZSxBQUFDO0dBQ3pKLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUTtHQUNqQixHQUVKOztLQUFNLFNBQVMsRUFBRSxTQUFTLEFBQUMsRUFBQyxJQUFJLEVBQUMsUUFBUSxFQUFDLGlCQUFjLE1BQU0sRUFBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLEFBQUM7R0FDL0UsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRO0dBQ2QsQUFDUCxDQUFDO0VBQ0Y7O0FBRUQsT0FBTSxFQUFDLGtCQUFHO0FBQ1QsU0FDQzs7S0FBSyxTQUFTLEVBQUUsNkJBQVcsY0FBYyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxBQUFDO0FBQ3RFLFNBQUssRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxLQUFLLEFBQUM7QUFDOUIsU0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEtBQUssQUFBQzs7R0FFN0IsSUFBSSxDQUFDLGdCQUFnQixFQUFFO0dBQ3ZCLElBQUksQ0FBQyxXQUFXLEVBQUU7R0FDZCxDQUNMO0VBQ0Y7O0NBRUQsQ0FBQyxDQUFDOztBQUVILE1BQU0sQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDOzs7Ozs7OztxQkM5RkMsYUFBYTs7OztxQkFGbkIsT0FBTzs7OztBQUVWLFNBQVMsYUFBYSxDQUFFLElBQWUsRUFBRTtLQUFmLFdBQVcsR0FBYixJQUFlLENBQWIsV0FBVzs7QUFDbkQsUUFDQztBQUNDLFdBQVMsRUFBQyxjQUFjO0FBQ3hCLGFBQVcsRUFBRSxXQUFXLEFBQUM7R0FDeEIsQ0FDRDtDQUNGOztBQUFBLENBQUM7Ozs7Ozs7OytCQ1QwQixtQkFBbUI7Ozs7QUFFL0MsU0FBUyxhQUFhLENBQUUsT0FBTyxFQUFFLFdBQVcsRUFBRSxjQUFjLEVBQUUsS0FBSyxFQUFFOzs7QUFDcEUsS0FBSSxLQUFLLENBQUMsYUFBYSxFQUFFO0FBQ3hCLGFBQVcsR0FBRyxrQ0FBZ0IsV0FBVyxDQUFDLENBQUM7RUFDM0M7O0FBRUQsS0FBSSxLQUFLLENBQUMsVUFBVSxFQUFFO0FBQ3JCLGFBQVcsR0FBRyxXQUFXLENBQUMsV0FBVyxFQUFFLENBQUM7RUFDeEM7O0FBRUQsS0FBSSxjQUFjLEVBQUUsY0FBYyxHQUFHLGNBQWMsQ0FBQyxHQUFHLENBQUMsVUFBQSxDQUFDO1NBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUM7RUFBQSxDQUFDLENBQUM7O0FBRWhGLFFBQU8sT0FBTyxDQUFDLE1BQU0sQ0FBQyxVQUFBLE1BQU0sRUFBSTtBQUMvQixNQUFJLGNBQWMsSUFBSSxjQUFjLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRTtBQUMxRSxPQUFJLE1BQU0sQ0FBQyxLQUFLLElBQUksS0FBSyxDQUFDLFdBQVcsRUFBRTtBQUN0QyxVQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDcEM7QUFDRCxVQUFPLEtBQUssQ0FBQztHQUNiO0FBQ0QsTUFBSSxLQUFLLENBQUMsWUFBWSxFQUFFLE9BQU8sS0FBSyxDQUFDLFlBQVksQ0FBQyxJQUFJLFFBQU8sTUFBTSxFQUFFLFdBQVcsQ0FBQyxDQUFDO0FBQ2xGLE1BQUksQ0FBQyxXQUFXLEVBQUUsT0FBTyxJQUFJLENBQUM7QUFDOUIsTUFBSSxTQUFTLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztBQUMvQyxNQUFJLFNBQVMsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO0FBQy9DLE1BQUksS0FBSyxDQUFDLGFBQWEsRUFBRTtBQUN4QixPQUFJLEtBQUssQ0FBQyxTQUFTLEtBQUssT0FBTyxFQUFFLFNBQVMsR0FBRyxrQ0FBZ0IsU0FBUyxDQUFDLENBQUM7QUFDeEUsT0FBSSxLQUFLLENBQUMsU0FBUyxLQUFLLE9BQU8sRUFBRSxTQUFTLEdBQUcsa0NBQWdCLFNBQVMsQ0FBQyxDQUFDO0dBQ3hFO0FBQ0QsTUFBSSxLQUFLLENBQUMsVUFBVSxFQUFFO0FBQ3JCLE9BQUksS0FBSyxDQUFDLFNBQVMsS0FBSyxPQUFPLEVBQUUsU0FBUyxHQUFHLFNBQVMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztBQUNyRSxPQUFJLEtBQUssQ0FBQyxTQUFTLEtBQUssT0FBTyxFQUFFLFNBQVMsR0FBRyxTQUFTLENBQUMsV0FBVyxFQUFFLENBQUM7R0FDckU7QUFDRCxTQUFPLEtBQUssQ0FBQyxRQUFRLEtBQUssT0FBTyxHQUNoQyxBQUFDLEtBQUssQ0FBQyxTQUFTLEtBQUssT0FBTyxJQUFJLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLFdBQVcsQ0FBQyxNQUFNLENBQUMsS0FBSyxXQUFXLElBQ3RGLEtBQUssQ0FBQyxTQUFTLEtBQUssT0FBTyxJQUFJLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLFdBQVcsQ0FBQyxNQUFNLENBQUMsS0FBSyxXQUFXLEFBQUMsR0FFeEYsQUFBQyxLQUFLLENBQUMsU0FBUyxLQUFLLE9BQU8sSUFBSSxTQUFTLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFDbEUsS0FBSyxDQUFDLFNBQVMsS0FBSyxPQUFPLElBQUksU0FBUyxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEFBQUMsQUFDcEUsQ0FBQztFQUNGLENBQUMsQ0FBQztDQUNIOztBQUVELE1BQU0sQ0FBQyxPQUFPLEdBQUcsYUFBYSxDQUFDOzs7Ozs7OzBCQzFDUixZQUFZOzs7O3FCQUNqQixPQUFPOzs7O0FBRXpCLFNBQVMsT0FBTyxDQUFFLE1BQU0sRUFBRTtBQUN6QixRQUFPLE1BQU0sSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztDQUMvQzs7QUFFRCxTQUFTLFlBQVksQ0FBRSxJQWV0QixFQUFFO0tBZEYsYUFBYSxHQURTLElBZXRCLENBZEEsYUFBYTtLQUNiLFdBQVcsR0FGVyxJQWV0QixDQWJBLFdBQVc7S0FDWCxjQUFjLEdBSFEsSUFldEIsQ0FaQSxjQUFjO0tBQ2QsUUFBUSxHQUpjLElBZXRCLENBWEEsUUFBUTtLQUNSLE9BQU8sR0FMZSxJQWV0QixDQVZBLE9BQU87S0FDUCxXQUFXLEdBTlcsSUFldEIsQ0FUQSxXQUFXO0tBQ1gsUUFBUSxHQVBjLElBZXRCLENBUkEsUUFBUTtLQUNSLGVBQWUsR0FSTyxJQWV0QixDQVBBLGVBQWU7S0FDZixlQUFlLEdBVE8sSUFldEIsQ0FOQSxlQUFlO0tBQ2Ysb0JBQW9CLEdBVkUsSUFldEIsQ0FMQSxvQkFBb0I7S0FDcEIsY0FBYyxHQVhRLElBZXRCLENBSkEsY0FBYztLQUNkLE9BQU8sR0FaZSxJQWV0QixDQUhBLE9BQU87S0FDUCxVQUFVLEdBYlksSUFldEIsQ0FGQSxVQUFVO0tBQ1YsUUFBUSxHQWRjLElBZXRCLENBREEsUUFBUTs7QUFFUixLQUFJLFdBQVcsR0FBRyxvQkFBb0IsQ0FBQztBQUN2QyxLQUFJLE1BQU0sR0FBRyxlQUFlLENBQUM7QUFDN0IsS0FBSSxXQUFXLEdBQUcsY0FBYyxJQUFJLElBQUksQ0FBQyxjQUFjLENBQUM7O0FBRXhELEtBQU0sYUFBYSxHQUFHLFNBQWhCLGFBQWEsQ0FBSSxhQUFhLEVBQUs7QUFDeEMsU0FBTyxhQUFhLENBQUMsR0FBRyxDQUFDLFVBQUMsTUFBTSxFQUFFLENBQUMsRUFBSztBQUN2QyxPQUFJLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRTtBQUNwQixRQUFJLFNBQVMsR0FBRyxNQUFNLEtBQUssYUFBYSxDQUFDOztBQUV6QyxRQUFJLGdCQUFnQixHQUFHLDZCQUFXO0FBQ2pDLDBCQUFxQixFQUFFLElBQUk7QUFDM0IsaUJBQVksRUFBRSxTQUFTO0FBQ3ZCLGtCQUFhLEVBQUUsTUFBTSxDQUFDLFFBQVE7S0FDOUIsQ0FBQyxDQUFDOztBQUVILFdBQ0M7QUFBQyxnQkFBVzs7QUFDWCxlQUFTLEVBQUUsZ0JBQWdCLEFBQUM7QUFDNUIsZ0JBQVUsRUFBRSxNQUFNLENBQUMsUUFBUSxBQUFDO0FBQzVCLGVBQVMsRUFBRSxTQUFTLEFBQUM7QUFDckIsU0FBRyxvQkFBa0IsQ0FBQyxBQUFHO0FBQ3pCLFdBQUssRUFBRSxXQUFXLENBQUMsTUFBTSxDQUFDLEFBQUM7QUFDM0IsYUFBTyxFQUFFLE9BQU8sQUFBQztBQUNqQixjQUFRLEVBQUUsUUFBUSxBQUFDO0FBQ25CLFlBQU0sRUFBRSxNQUFNLEFBQUM7QUFDZixpQkFBVyxFQUFFLENBQUMsQUFBQztBQUNmLGlCQUFXLEVBQUUsV0FBVyxBQUFDOztLQUV4QixhQUFhLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQztLQUNqQixDQUNiO0lBQ0YsTUFBTTs7QUFDTixTQUFJLFVBQVUsR0FBRyxVQUFVLElBQUksVUFBVSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUMvRCxTQUFJLFNBQVMsR0FBRyxNQUFNLEtBQUssYUFBYSxDQUFDO0FBQ3pDLFNBQUksU0FBUyxHQUFHLFNBQVMsR0FBRyxTQUFTLEdBQUcsSUFBSSxDQUFDO0FBQzdDLFNBQUksV0FBVyxHQUFHLDZCQUFXLGVBQWUsRUFBRTtBQUM3QyxxQkFBZSxFQUFFLElBQUk7QUFDckIsbUJBQWEsRUFBRSxVQUFVO0FBQ3pCLGtCQUFZLEVBQUUsU0FBUztBQUN2QixtQkFBYSxFQUFFLE1BQU0sQ0FBQyxRQUFRO01BQzlCLENBQUMsQ0FBQzs7QUFFSDtTQUNDO0FBQUMsYUFBTTs7QUFDTixpQkFBUyxFQUFFLFdBQVcsQUFBQztBQUN2QixzQkFBYyxFQUFFLGNBQWMsQUFBQztBQUMvQixrQkFBVSxFQUFFLE1BQU0sQ0FBQyxRQUFRLEFBQUM7QUFDNUIsaUJBQVMsRUFBRSxTQUFTLEFBQUM7QUFDckIsa0JBQVUsRUFBRSxVQUFVLEFBQUM7QUFDdkIsV0FBRyxjQUFZLENBQUMsU0FBSSxNQUFNLENBQUMsUUFBUSxDQUFDLEFBQUc7QUFDdkMsZUFBTyxFQUFFLE9BQU8sQUFBQztBQUNqQixnQkFBUSxFQUFFLFFBQVEsQUFBQztBQUNuQixjQUFNLEVBQUUsTUFBTSxBQUFDO0FBQ2YsbUJBQVcsRUFBRSxDQUFDLEFBQUM7QUFDZixXQUFHLEVBQUUsVUFBQSxHQUFHLEVBQUk7QUFBRSxvQkFBVyxDQUFDLEdBQUcsRUFBRSxTQUFTLENBQUMsQ0FBQztTQUFFLEFBQUM7O09BRTVDLFdBQVcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO09BQ2Y7T0FDUjs7OztJQUNGO0dBQ0QsQ0FBQyxDQUFDO0VBQ0gsQ0FBQzs7QUFFRixRQUFPLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQztDQUM5Qjs7QUFFRCxNQUFNLENBQUMsT0FBTyxHQUFHLFlBQVksQ0FBQzs7Ozs7QUN6RjlCLElBQUksR0FBRyxHQUFHLENBQ1QsRUFBRSxNQUFNLEVBQUMsR0FBRyxFQUFFLFNBQVMsRUFBQyxpTkFBaU4sRUFBRSxFQUMzTyxFQUFFLE1BQU0sRUFBQyxJQUFJLEVBQUMsU0FBUyxFQUFDLFdBQVcsRUFBRSxFQUNyQyxFQUFFLE1BQU0sRUFBQyxJQUFJLEVBQUMsU0FBUyxFQUFDLHVCQUF1QixFQUFFLEVBQ2pELEVBQUUsTUFBTSxFQUFDLElBQUksRUFBQyxTQUFTLEVBQUMsV0FBVyxFQUFFLEVBQ3JDLEVBQUUsTUFBTSxFQUFDLElBQUksRUFBQyxTQUFTLEVBQUMsV0FBVyxFQUFFLEVBQ3JDLEVBQUUsTUFBTSxFQUFDLElBQUksRUFBQyxTQUFTLEVBQUMsaUJBQWlCLEVBQUUsRUFDM0MsRUFBRSxNQUFNLEVBQUMsSUFBSSxFQUFDLFNBQVMsRUFBQyxXQUFXLEVBQUUsRUFDckMsRUFBRSxNQUFNLEVBQUMsR0FBRyxFQUFFLFNBQVMsRUFBQywyREFBMkQsRUFBRSxFQUNyRixFQUFFLE1BQU0sRUFBQyxHQUFHLEVBQUUsU0FBUyxFQUFDLDZFQUE2RSxFQUFFLEVBQ3ZHLEVBQUUsTUFBTSxFQUFDLEdBQUcsRUFBRSxTQUFTLEVBQUMseUZBQXlGLEVBQUUsRUFDbkgsRUFBRSxNQUFNLEVBQUMsSUFBSSxFQUFDLFNBQVMsRUFBQyxpQkFBaUIsRUFBRSxFQUMzQyxFQUFFLE1BQU0sRUFBQyxJQUFJLEVBQUMsU0FBUyxFQUFDLGlCQUFpQixFQUFFLEVBQzNDLEVBQUUsTUFBTSxFQUFDLEdBQUcsRUFBRSxTQUFTLEVBQUMseUxBQXlMLEVBQUUsRUFDbk4sRUFBRSxNQUFNLEVBQUMsR0FBRyxFQUFFLFNBQVMsRUFBQyx5Q0FBeUMsRUFBRSxFQUNuRSxFQUFFLE1BQU0sRUFBQyxHQUFHLEVBQUUsU0FBUyxFQUFDLCtGQUErRixFQUFFLEVBQ3pILEVBQUUsTUFBTSxFQUFDLEdBQUcsRUFBRSxTQUFTLEVBQUMseUZBQXlGLEVBQUUsRUFDbkgsRUFBRSxNQUFNLEVBQUMsR0FBRyxFQUFFLFNBQVMsRUFBQyw2SEFBNkgsRUFBRSxFQUN2SixFQUFFLE1BQU0sRUFBQyxHQUFHLEVBQUUsU0FBUyxFQUFDLG1DQUFtQyxFQUFFLEVBQzdELEVBQUUsTUFBTSxFQUFDLEdBQUcsRUFBRSxTQUFTLEVBQUMseUZBQXlGLEVBQUUsRUFDbkgsRUFBRSxNQUFNLEVBQUMsR0FBRyxFQUFFLFNBQVMsRUFBQyxpSEFBaUgsRUFBRSxFQUMzSSxFQUFFLE1BQU0sRUFBQyxJQUFJLEVBQUMsU0FBUyxFQUFDLFdBQVcsRUFBRSxFQUNyQyxFQUFFLE1BQU0sRUFBQyxJQUFJLEVBQUMsU0FBUyxFQUFDLFdBQVcsRUFBRSxFQUNyQyxFQUFFLE1BQU0sRUFBQyxHQUFHLEVBQUUsU0FBUyxFQUFDLHFEQUFxRCxFQUFFLEVBQy9FLEVBQUUsTUFBTSxFQUFDLEdBQUcsRUFBRSxTQUFTLEVBQUMscUdBQXFHLEVBQUUsRUFDL0gsRUFBRSxNQUFNLEVBQUMsSUFBSSxFQUFDLFNBQVMsRUFBQyxXQUFXLEVBQUUsRUFDckMsRUFBRSxNQUFNLEVBQUMsSUFBSSxFQUFDLFNBQVMsRUFBQyxXQUFXLEVBQUUsRUFDckMsRUFBRSxNQUFNLEVBQUMsR0FBRyxFQUFFLFNBQVMsRUFBQyx1UUFBdVEsRUFBRSxFQUNqUyxFQUFFLE1BQU0sRUFBQyxJQUFJLEVBQUMsU0FBUyxFQUFDLFdBQVcsRUFBRSxFQUNyQyxFQUFFLE1BQU0sRUFBQyxJQUFJLEVBQUMsU0FBUyxFQUFDLFdBQVcsRUFBRSxFQUNyQyxFQUFFLE1BQU0sRUFBQyxJQUFJLEVBQUMsU0FBUyxFQUFDLFdBQVcsRUFBRSxFQUNyQyxFQUFFLE1BQU0sRUFBQyxHQUFHLEVBQUUsU0FBUyxFQUFDLGlFQUFpRSxFQUFFLEVBQzNGLEVBQUUsTUFBTSxFQUFDLEdBQUcsRUFBRSxTQUFTLEVBQUMseUNBQXlDLEVBQUUsRUFDbkUsRUFBRSxNQUFNLEVBQUMsR0FBRyxFQUFFLFNBQVMsRUFBQywyR0FBMkcsRUFBRSxFQUNySSxFQUFFLE1BQU0sRUFBQyxHQUFHLEVBQUUsU0FBUyxFQUFDLDJHQUEyRyxFQUFFLEVBQ3JJLEVBQUUsTUFBTSxFQUFDLEdBQUcsRUFBRSxTQUFTLEVBQUMsK0ZBQStGLEVBQUUsRUFDekgsRUFBRSxNQUFNLEVBQUMsSUFBSSxFQUFDLFNBQVMsRUFBQyxXQUFXLEVBQUUsRUFDckMsRUFBRSxNQUFNLEVBQUMsR0FBRyxFQUFFLFNBQVMsRUFBQyxpTkFBaU4sRUFBRSxFQUMzTyxFQUFFLE1BQU0sRUFBQyxHQUFHLEVBQUUsU0FBUyxFQUFDLHFEQUFxRCxFQUFFLEVBQy9FLEVBQUUsTUFBTSxFQUFDLElBQUksRUFBQyxTQUFTLEVBQUMsV0FBVyxFQUFFLEVBQ3JDLEVBQUUsTUFBTSxFQUFDLEdBQUcsRUFBRSxTQUFTLEVBQUMsaUVBQWlFLEVBQUUsRUFDM0YsRUFBRSxNQUFNLEVBQUMsR0FBRyxFQUFFLFNBQVMsRUFBQyxtQ0FBbUMsRUFBRSxFQUM3RCxFQUFFLE1BQU0sRUFBQyxHQUFHLEVBQUUsU0FBUyxFQUFDLCtGQUErRixFQUFFLEVBQ3pILEVBQUUsTUFBTSxFQUFDLEdBQUcsRUFBRSxTQUFTLEVBQUMseUZBQXlGLEVBQUUsRUFDbkgsRUFBRSxNQUFNLEVBQUMsR0FBRyxFQUFFLFNBQVMsRUFBQyx1TkFBdU4sRUFBRSxFQUNqUCxFQUFFLE1BQU0sRUFBQyxJQUFJLEVBQUMsU0FBUyxFQUFDLFdBQVcsRUFBRSxFQUNyQyxFQUFFLE1BQU0sRUFBQyxJQUFJLEVBQUMsU0FBUyxFQUFDLHVCQUF1QixFQUFFLEVBQ2pELEVBQUUsTUFBTSxFQUFDLElBQUksRUFBQyxTQUFTLEVBQUMsV0FBVyxFQUFFLEVBQ3JDLEVBQUUsTUFBTSxFQUFDLElBQUksRUFBQyxTQUFTLEVBQUMsV0FBVyxFQUFFLEVBQ3JDLEVBQUUsTUFBTSxFQUFDLElBQUksRUFBQyxTQUFTLEVBQUMsaUJBQWlCLEVBQUUsRUFDM0MsRUFBRSxNQUFNLEVBQUMsSUFBSSxFQUFDLFNBQVMsRUFBQyxXQUFXLEVBQUUsRUFDckMsRUFBRSxNQUFNLEVBQUMsR0FBRyxFQUFFLFNBQVMsRUFBQywyREFBMkQsRUFBRSxFQUNyRixFQUFFLE1BQU0sRUFBQyxHQUFHLEVBQUUsU0FBUyxFQUFDLG1GQUFtRixFQUFFLEVBQzdHLEVBQUUsTUFBTSxFQUFDLEdBQUcsRUFBRSxTQUFTLEVBQUMseUZBQXlGLEVBQUUsRUFDbkgsRUFBRSxNQUFNLEVBQUMsSUFBSSxFQUFDLFNBQVMsRUFBQyxpQkFBaUIsRUFBRSxFQUMzQyxFQUFFLE1BQU0sRUFBQyxHQUFHLEVBQUUsU0FBUyxFQUFDLCtMQUErTCxFQUFFLEVBQ3pOLEVBQUUsTUFBTSxFQUFDLEdBQUcsRUFBRSxTQUFTLEVBQUMseUNBQXlDLEVBQUUsRUFDbkUsRUFBRSxNQUFNLEVBQUMsR0FBRyxFQUFFLFNBQVMsRUFBQywrRkFBK0YsRUFBRSxFQUN6SCxFQUFFLE1BQU0sRUFBQyxHQUFHLEVBQUUsU0FBUyxFQUFDLCtGQUErRixFQUFFLEVBQ3pILEVBQUUsTUFBTSxFQUFDLElBQUksRUFBQyxTQUFTLEVBQUMsV0FBVyxFQUFFLEVBQ3JDLEVBQUUsTUFBTSxFQUFDLEdBQUcsRUFBRSxTQUFTLEVBQUMsNkhBQTZILEVBQUUsRUFDdkosRUFBRSxNQUFNLEVBQUMsR0FBRyxFQUFFLFNBQVMsRUFBQyx5Q0FBeUMsRUFBRSxFQUNuRSxFQUFFLE1BQU0sRUFBQyxHQUFHLEVBQUUsU0FBUyxFQUFDLHlGQUF5RixFQUFFLEVBQ25ILEVBQUUsTUFBTSxFQUFDLEdBQUcsRUFBRSxTQUFTLEVBQUMsdUhBQXVILEVBQUUsRUFDakosRUFBRSxNQUFNLEVBQUMsSUFBSSxFQUFDLFNBQVMsRUFBQyxXQUFXLEVBQUUsRUFDckMsRUFBRSxNQUFNLEVBQUMsR0FBRyxFQUFFLFNBQVMsRUFBQyxxREFBcUQsRUFBRSxFQUMvRSxFQUFFLE1BQU0sRUFBQyxHQUFHLEVBQUUsU0FBUyxFQUFDLDJHQUEyRyxFQUFFLEVBQ3JJLEVBQUUsTUFBTSxFQUFDLElBQUksRUFBQyxTQUFTLEVBQUMsV0FBVyxFQUFFLEVBQ3JDLEVBQUUsTUFBTSxFQUFDLEdBQUcsRUFBRSxTQUFTLEVBQUMsdVFBQXVRLEVBQUUsRUFDalMsRUFBRSxNQUFNLEVBQUMsSUFBSSxFQUFDLFNBQVMsRUFBQyxXQUFXLEVBQUUsRUFDckMsRUFBRSxNQUFNLEVBQUMsSUFBSSxFQUFDLFNBQVMsRUFBQyxXQUFXLEVBQUUsRUFDckMsRUFBRSxNQUFNLEVBQUMsSUFBSSxFQUFDLFNBQVMsRUFBQyxXQUFXLEVBQUUsRUFDckMsRUFBRSxNQUFNLEVBQUMsR0FBRyxFQUFFLFNBQVMsRUFBQyxpRUFBaUUsRUFBRSxFQUMzRixFQUFFLE1BQU0sRUFBQyxHQUFHLEVBQUUsU0FBUyxFQUFDLHlDQUF5QyxFQUFFLEVBQ25FLEVBQUUsTUFBTSxFQUFDLEdBQUcsRUFBRSxTQUFTLEVBQUMsMkdBQTJHLEVBQUUsRUFDckksRUFBRSxNQUFNLEVBQUMsR0FBRyxFQUFFLFNBQVMsRUFBQyxpSEFBaUgsRUFBRSxFQUMzSSxFQUFFLE1BQU0sRUFBQyxHQUFHLEVBQUUsU0FBUyxFQUFDLHFHQUFxRyxFQUFFLEVBQy9ILEVBQUUsTUFBTSxFQUFDLElBQUksRUFBQyxTQUFTLEVBQUMsV0FBVyxFQUFFLEVBQ3JDLEVBQUUsTUFBTSxFQUFDLEdBQUcsRUFBRSxTQUFTLEVBQUMsaU5BQWlOLEVBQUUsRUFDM08sRUFBRSxNQUFNLEVBQUMsR0FBRyxFQUFFLFNBQVMsRUFBQyxxREFBcUQsRUFBRSxFQUMvRSxFQUFFLE1BQU0sRUFBQyxJQUFJLEVBQUMsU0FBUyxFQUFDLFdBQVcsRUFBRSxFQUNyQyxFQUFFLE1BQU0sRUFBQyxHQUFHLEVBQUUsU0FBUyxFQUFDLHVFQUF1RSxFQUFFLEVBQ2pHLEVBQUUsTUFBTSxFQUFDLEdBQUcsRUFBRSxTQUFTLEVBQUMsbUNBQW1DLEVBQUUsRUFDN0QsRUFBRSxNQUFNLEVBQUMsR0FBRyxFQUFFLFNBQVMsRUFBQyxxR0FBcUcsRUFBRSxFQUMvSCxFQUFFLE1BQU0sRUFBQyxHQUFHLEVBQUUsU0FBUyxFQUFDLHlGQUF5RixFQUFFLENBQ25ILENBQUM7O0FBRUYsTUFBTSxDQUFDLE9BQU8sR0FBRyxTQUFTLGVBQWUsQ0FBRSxHQUFHLEVBQUU7QUFDL0MsTUFBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDcEMsS0FBRyxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7RUFDL0M7QUFDRCxRQUFPLEdBQUcsQ0FBQztDQUNYLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O3FCQ3RGZ0IsT0FBTzs7Ozt3QkFDSixXQUFXOzs7O2tDQUNOLHNCQUFzQjs7OzswQkFDekIsWUFBWTs7Ozt5Q0FFRiw4QkFBOEI7Ozs7eUNBQzlCLDhCQUE4Qjs7Ozt3Q0FDL0IsNkJBQTZCOzs7O3FCQUUzQyxTQUFTOzs7OzhCQUNBLGtCQUFrQjs7Ozt5QkFDdkIsYUFBYTs7Ozt3QkFDZCxZQUFZOzs7O3NCQUNkLFVBQVU7Ozs7MkJBQ0wsZUFBZTs7OztxQkFDckIsU0FBUzs7OztBQUUzQixTQUFTLEtBQUssQ0FBQyxHQUFHLEVBQUU7QUFDbEIsS0FBTSxJQUFJLEdBQUcsRUFBRSxDQUFDO0FBQ2hCLE1BQUssSUFBSSxJQUFJLElBQUksR0FBRyxFQUFFO0FBQ3BCLE1BQUksR0FBRyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsRUFBRTtBQUM3QixPQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO0dBQ3ZCLENBQUM7RUFDSDtBQUNELFFBQU8sSUFBSSxDQUFDO0NBQ2I7O0FBRUQsU0FBUyxPQUFPLENBQUUsTUFBTSxFQUFFO0FBQ3pCLFFBQU8sTUFBTSxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0NBQy9DOztBQUVELFNBQVMsY0FBYyxDQUFFLEtBQUssRUFBRTtBQUMvQixLQUFJLE9BQU8sS0FBSyxLQUFLLFFBQVEsRUFBRTtBQUM5QixTQUFPLEtBQUssQ0FBQztFQUNiLE1BQU0sSUFBSSxPQUFPLEtBQUssS0FBSyxRQUFRLEVBQUU7QUFDckMsU0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO0VBQzdCLE1BQU0sSUFBSSxLQUFLLElBQUksS0FBSyxLQUFLLENBQUMsRUFBRTtBQUNoQyxTQUFPLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztFQUNyQixNQUFNO0FBQ04sU0FBTyxFQUFFLENBQUM7RUFDVjtDQUNEOztBQUVELElBQU0sWUFBWSxHQUFHLG1CQUFNLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FDOUMsbUJBQU0sU0FBUyxDQUFDLE1BQU0sRUFDdEIsbUJBQU0sU0FBUyxDQUFDLElBQUksQ0FDcEIsQ0FBQyxDQUFDOztBQUVILElBQUksVUFBVSxHQUFHLENBQUMsQ0FBQzs7QUFFbkIsSUFBTSxjQUFjLEdBQUcsRUFBRSxDQUFDOztBQUUxQixJQUFNLE1BQU0sR0FBRyxtQkFBTSxXQUFXLENBQUM7O0FBRWhDLFlBQVcsRUFBRSxRQUFROztBQUVyQixVQUFTLEVBQUU7QUFDVixjQUFZLEVBQUUsbUJBQU0sU0FBUyxDQUFDLE1BQU07QUFDcEMsY0FBWSxFQUFFLG1CQUFNLFNBQVMsQ0FBQyxNQUFNO0FBQ3BDLG1CQUFpQixFQUFFLG1CQUFNLFNBQVMsQ0FBQyxNQUFNO0FBQ3pDLGVBQWEsRUFBRSxtQkFBTSxTQUFTLENBQUMsSUFBSTtBQUNuQyxVQUFRLEVBQUUsbUJBQU0sU0FBUyxDQUFDLElBQUk7QUFDOUIsV0FBUyxFQUFFLG1CQUFNLFNBQVMsQ0FBQyxJQUFJO0FBQy9CLFVBQVEsRUFBRSxtQkFBTSxTQUFTLENBQUMsSUFBSTtBQUM5QixrQkFBZ0IsRUFBRSxtQkFBTSxTQUFTLENBQUMsSUFBSTtBQUN0QywwQkFBd0IsRUFBRSxtQkFBTSxTQUFTLENBQUMsTUFBTTtBQUNoRCxXQUFTLEVBQUUsbUJBQU0sU0FBUyxDQUFDLE1BQU07QUFDakMsY0FBWSxFQUFFLFlBQVk7QUFDMUIsZ0JBQWMsRUFBRSxZQUFZO0FBQzVCLFdBQVMsRUFBRSxtQkFBTSxTQUFTLENBQUMsSUFBSTtBQUMvQixXQUFTLEVBQUUsbUJBQU0sU0FBUyxDQUFDLE1BQU07QUFDakMsVUFBUSxFQUFFLG1CQUFNLFNBQVMsQ0FBQyxJQUFJO0FBQzlCLG1CQUFpQixFQUFFLG1CQUFNLFNBQVMsQ0FBQyxJQUFJO0FBQ3ZDLG1CQUFpQixFQUFFLG1CQUFNLFNBQVMsQ0FBQyxJQUFJO0FBQ3ZDLGNBQVksRUFBRSxtQkFBTSxTQUFTLENBQUMsSUFBSTtBQUNsQyxlQUFhLEVBQUUsbUJBQU0sU0FBUyxDQUFDLEdBQUc7QUFDbEMsZUFBYSxFQUFFLG1CQUFNLFNBQVMsQ0FBQyxJQUFJO0FBQ25DLFlBQVUsRUFBRSxtQkFBTSxTQUFTLENBQUMsSUFBSTtBQUNoQyxZQUFVLEVBQUUsbUJBQU0sU0FBUyxDQUFDLE1BQU07QUFDbEMsZUFBYSxFQUFFLG1CQUFNLFNBQVMsQ0FBQyxJQUFJO0FBQ25DLFlBQVUsRUFBRSxtQkFBTSxTQUFTLENBQUMsTUFBTTtBQUNsQyxXQUFTLEVBQUUsbUJBQU0sU0FBUyxDQUFDLElBQUk7QUFDL0IsUUFBTSxFQUFFLG1CQUFNLFNBQVMsQ0FBQyxJQUFJO0FBQzVCLFlBQVUsRUFBRSxtQkFBTSxTQUFTLENBQUMsSUFBSTtBQUNoQyxVQUFRLEVBQUUsbUJBQU0sU0FBUyxDQUFDLE1BQU07QUFDaEMsVUFBUSxFQUFFLG1CQUFNLFNBQVMsQ0FBQyxNQUFNO0FBQ2hDLFdBQVMsRUFBRSxtQkFBTSxTQUFTLENBQUMsTUFBTTtBQUNqQyxZQUFVLEVBQUUsbUJBQU0sU0FBUyxDQUFDLE1BQU07QUFDbEMsb0JBQWtCLEVBQUUsbUJBQU0sU0FBUyxDQUFDLE1BQU07QUFDMUMsY0FBWSxFQUFFLG1CQUFNLFNBQVMsQ0FBQyxJQUFJO0FBQ2xDLFdBQVMsRUFBRSxtQkFBTSxTQUFTLENBQUMsTUFBTTtBQUNqQyxPQUFLLEVBQUUsbUJBQU0sU0FBUyxDQUFDLElBQUk7QUFDM0IsTUFBSSxFQUFFLG1CQUFNLFNBQVMsQ0FBQyxNQUFNO0FBQzVCLGVBQWEsRUFBRSxZQUFZO0FBQzNCLFFBQU0sRUFBRSxtQkFBTSxTQUFTLENBQUMsSUFBSTtBQUM1QixtQkFBaUIsRUFBRSxtQkFBTSxTQUFTLENBQUMsSUFBSTtBQUN2QyxVQUFRLEVBQUUsbUJBQU0sU0FBUyxDQUFDLElBQUk7QUFDOUIsU0FBTyxFQUFFLG1CQUFNLFNBQVMsQ0FBQyxJQUFJO0FBQzdCLG9CQUFrQixFQUFFLG1CQUFNLFNBQVMsQ0FBQyxJQUFJO0FBQ3hDLFNBQU8sRUFBRSxtQkFBTSxTQUFTLENBQUMsSUFBSTtBQUM3QixlQUFhLEVBQUUsbUJBQU0sU0FBUyxDQUFDLElBQUk7QUFDbkMsZ0JBQWMsRUFBRSxtQkFBTSxTQUFTLENBQUMsSUFBSTtBQUNwQyxzQkFBb0IsRUFBRSxtQkFBTSxTQUFTLENBQUMsSUFBSTtBQUMxQyxRQUFNLEVBQUUsbUJBQU0sU0FBUyxDQUFDLElBQUk7QUFDNUIsY0FBWSxFQUFFLG1CQUFNLFNBQVMsQ0FBQyxJQUFJO0FBQ2xDLGdCQUFjLEVBQUUsbUJBQU0sU0FBUyxDQUFDLElBQUk7QUFDcEMsYUFBVyxFQUFFLG1CQUFNLFNBQVMsQ0FBQyxJQUFJO0FBQ2pDLGlCQUFlLEVBQUUsbUJBQU0sU0FBUyxDQUFDLE1BQU07QUFDdkMsaUJBQWUsRUFBRSxtQkFBTSxTQUFTLENBQUMsSUFBSTtBQUNyQyxzQkFBb0IsRUFBRSxtQkFBTSxTQUFTLENBQUMsSUFBSTtBQUMxQyxnQkFBYyxFQUFFLG1CQUFNLFNBQVMsQ0FBQyxJQUFJO0FBQ3BDLFNBQU8sRUFBRSxtQkFBTSxTQUFTLENBQUMsS0FBSztBQUM5QixVQUFRLEVBQUUsbUJBQU0sU0FBUyxDQUFDLE1BQU07QUFDaEMsYUFBVyxFQUFFLFlBQVk7QUFDekIscUJBQW1CLEVBQUUsbUJBQU0sU0FBUyxDQUFDLElBQUk7QUFDekMsVUFBUSxFQUFFLG1CQUFNLFNBQVMsQ0FBQyxJQUFJO0FBQzlCLFlBQVUsRUFBRSxtQkFBTSxTQUFTLENBQUMsR0FBRztBQUMvQixvQkFBa0IsRUFBRSxtQkFBTSxTQUFTLENBQUMsSUFBSTtBQUN4QyxZQUFVLEVBQUUsbUJBQU0sU0FBUyxDQUFDLElBQUk7QUFDOUIsYUFBVyxFQUFFLG1CQUFNLFNBQVMsQ0FBQyxJQUFJO0FBQ25DLGFBQVcsRUFBRSxtQkFBTSxTQUFTLENBQUMsSUFBSTtBQUNqQyxPQUFLLEVBQUUsbUJBQU0sU0FBUyxDQUFDLE1BQU07QUFDN0IsVUFBUSxFQUFFLG1CQUFNLFNBQVMsQ0FBQyxNQUFNO0FBQ2hDLGlCQUFlLEVBQUUsbUJBQU0sU0FBUyxDQUFDLElBQUk7QUFDckMsT0FBSyxFQUFFLG1CQUFNLFNBQVMsQ0FBQyxHQUFHO0FBQzFCLGdCQUFjLEVBQUUsbUJBQU0sU0FBUyxDQUFDLElBQUk7QUFDcEMsVUFBUSxFQUFFLG1CQUFNLFNBQVMsQ0FBQyxNQUFNO0FBQ2hDLGVBQWEsRUFBRSxtQkFBTSxTQUFTLENBQUMsSUFBSTtBQUNuQyxjQUFZLEVBQUUsbUJBQU0sU0FBUyxDQUFDLE1BQU0sRUFDcEM7OztBQUVELFFBQU8sRUFBRSxFQUFFLEtBQUssb0JBQUEsRUFBRSxjQUFjLDZCQUFBLEVBQUUsU0FBUyx3QkFBQSxFQUFFOztBQUU3QyxnQkFBZSxFQUFDLDJCQUFHO0FBQ2xCLFNBQU87QUFDTixlQUFZLEVBQUUsZ0JBQWdCO0FBQzlCLGdCQUFhLHdDQUFzQjtBQUNuQyxXQUFRLEVBQUUsSUFBSTtBQUNkLG1CQUFnQixFQUFFLElBQUk7QUFDdEIsMkJBQXdCLEVBQUUsbUNBQW1DO0FBQzdELFlBQVMsRUFBRSxJQUFJO0FBQ2YsZUFBWSxFQUFFLFdBQVc7QUFDekIsaUJBQWMsRUFBRSxhQUFhO0FBQzdCLFlBQVMsRUFBRSxHQUFHO0FBQ2QsV0FBUSxFQUFFLEtBQUs7QUFDZixvQkFBaUIsdUJBQVU7QUFDM0Isb0JBQWlCLEVBQUUsSUFBSTtBQUN2QixnQkFBYSx3Q0FBc0I7QUFDbkMsZ0JBQWEsRUFBRSxJQUFJO0FBQ25CLGFBQVUsRUFBRSxJQUFJO0FBQ2hCLGFBQVUsRUFBRSxFQUFFO0FBQ2QsWUFBUyxFQUFFLEtBQUs7QUFDaEIsYUFBVSxFQUFFLEtBQUs7QUFDakIsV0FBUSxFQUFFLE9BQU87QUFDakIsV0FBUSxFQUFFLEtBQUs7QUFDZixZQUFTLEVBQUUsS0FBSztBQUNoQixhQUFVLEVBQUUsQ0FBQztBQUNiLGVBQVksdUNBQXFCO0FBQ2pDLFFBQUssRUFBRSxLQUFLO0FBQ1osZ0JBQWEsRUFBRSxrQkFBa0I7QUFDakMsb0JBQWlCLEVBQUUsSUFBSTtBQUN2QixxQkFBa0IsRUFBRSxJQUFJO0FBQ3hCLGlCQUFjLEVBQUUsS0FBSztBQUNyQixrQkFBZSxxQkFBUTtBQUN2Qix1QkFBb0IsMEJBQWE7QUFDakMsV0FBUSxFQUFFLENBQUM7QUFDWCxjQUFXLEVBQUUsV0FBVztBQUN4QixzQkFBbUIsRUFBRSxLQUFLO0FBQzFCLFdBQVEsRUFBRSxLQUFLO0FBQ2YscUJBQWtCLEVBQUUsSUFBSTtBQUN4QixhQUFVLEVBQUUsSUFBSTtBQUNiLGNBQVcsRUFBRSxLQUFLO0FBQ3JCLGNBQVcsRUFBRSxLQUFLO0FBQ2xCLGtCQUFlLEVBQUUsSUFBSTtBQUNyQixpQkFBYyxvQkFBTztBQUNyQixXQUFRLEVBQUUsT0FBTztHQUNqQixDQUFDO0VBQ0Y7O0FBRUQsZ0JBQWUsRUFBQywyQkFBRztBQUNsQixTQUFPO0FBQ04sYUFBVSxFQUFFLEVBQUU7QUFDZCxZQUFTLEVBQUUsS0FBSztBQUNoQixTQUFNLEVBQUUsS0FBSztBQUNiLGtCQUFlLEVBQUUsS0FBSztBQUN0QixXQUFRLEVBQUUsS0FBSztHQUNmLENBQUM7RUFDRjs7QUFFRCxtQkFBa0IsRUFBQSw4QkFBRztBQUNwQixNQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUM1RCxNQUFJLENBQUMsZUFBZSxHQUFHLGVBQWUsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsSUFBSSxFQUFFLFVBQVUsQ0FBQSxBQUFDLEdBQUcsR0FBRyxDQUFDO0FBQ3ZGLE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQzs7QUFFeEQsTUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRTtBQUN4QixPQUFJLENBQUMsUUFBUSxDQUFDO0FBQ2IsWUFBUSxFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDO0lBQzlELENBQUMsQ0FBQztHQUNIO0VBQ0Q7O0FBRUQsa0JBQWlCLEVBQUMsNkJBQUc7QUFDcEIsTUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsRUFBRTtBQUN6QixPQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7R0FDYjtFQUNEOztBQUVELDBCQUF5QixFQUFBLG1DQUFDLFNBQVMsRUFBRTtBQUNwQyxNQUFJLFNBQVMsQ0FBQyxPQUFPLEtBQUssSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUU7QUFDN0MsT0FBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQztHQUMzRDs7QUFFRCxNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsU0FBUyxDQUFDLENBQUM7O0FBRWxFLE1BQUksU0FBUyxDQUFDLFFBQVEsRUFBRTtBQUN2QixPQUFJLENBQUMsUUFBUSxDQUFDO0FBQ2IsWUFBUSxFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxLQUFLLENBQUM7SUFDN0QsQ0FBQyxDQUFDO0dBQ0g7RUFDRDs7QUFFRCxvQkFBbUIsRUFBQyw2QkFBQyxTQUFTLEVBQUUsU0FBUyxFQUFFO0FBQzFDLE1BQUksU0FBUyxDQUFDLE1BQU0sS0FBSyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRTtBQUMzQyxPQUFJLENBQUMsdUJBQXVCLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQy9DLE9BQU0sT0FBTyxHQUFHLFNBQVMsQ0FBQyxNQUFNLEdBQUcsU0FBUyxDQUFDLE1BQU0sR0FBRyxTQUFTLENBQUMsT0FBTyxDQUFDO0FBQ3hFLFVBQU8sSUFBSSxPQUFPLEVBQUUsQ0FBQztHQUNyQjtFQUNEOztBQUVELG1CQUFrQixFQUFDLDRCQUFDLFNBQVMsRUFBRSxTQUFTLEVBQUU7O0FBRXpDLE1BQUksSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxDQUFDLG1CQUFtQixFQUFFO0FBQ2hGLE9BQUksaUJBQWlCLEdBQUcsc0JBQVMsV0FBVyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUN4RCxPQUFJLDRCQUE0QixHQUFHLGlCQUFpQixDQUFDLGVBQWUsQ0FBQztBQUNyRSxPQUFJLG1CQUFtQixHQUFHLGlCQUFpQixDQUFDLGFBQWEsQ0FBQztBQUMxRCxPQUFJLFFBQVEsR0FBRyxzQkFBUyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQy9DLE9BQUksNEJBQTRCLEVBQUU7QUFDaEMsWUFBUSxDQUFDLFNBQVMsR0FBRyw0QkFBNEIsQ0FBQyxTQUFTLENBQUM7SUFDN0QsTUFBTSxJQUFJLG1CQUFtQixJQUFJLG1CQUFtQixLQUFLLGFBQWEsRUFBRTtBQUN2RSxZQUFRLENBQUMsU0FBUyxHQUFHLG1CQUFtQixDQUFDLFNBQVMsQ0FBQztJQUNwRCxNQUFNO0FBQ0wsWUFBUSxDQUFDLFNBQVMsR0FBRyxpQkFBaUIsQ0FBQyxTQUFTLENBQUM7SUFDbEQ7QUFDSixPQUFJLENBQUMsbUJBQW1CLEdBQUcsSUFBSSxDQUFDO0dBQ2hDLE1BQU0sSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFO0FBQzlCLE9BQUksQ0FBQyxtQkFBbUIsR0FBRyxLQUFLLENBQUM7R0FDakM7O0FBRUQsTUFBSSxJQUFJLENBQUMsOEJBQThCLElBQUksSUFBSSxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFO0FBQ3JFLE9BQUksQ0FBQyw4QkFBOEIsR0FBRyxLQUFLLENBQUM7QUFDNUMsT0FBSSxVQUFVLEdBQUcsc0JBQVMsV0FBVyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUNwRCxPQUFJLE9BQU8sR0FBRyxzQkFBUyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzlDLE9BQUksV0FBVyxHQUFHLFVBQVUsQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO0FBQ3JELE9BQUksUUFBUSxHQUFHLE9BQU8sQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO0FBQy9DLE9BQUksV0FBVyxDQUFDLE1BQU0sR0FBRyxRQUFRLENBQUMsTUFBTSxJQUFJLFdBQVcsQ0FBQyxHQUFHLEdBQUcsUUFBUSxDQUFDLEdBQUcsRUFBRTtBQUMzRSxXQUFPLENBQUMsU0FBUyxHQUFJLFVBQVUsQ0FBQyxTQUFTLEdBQUcsVUFBVSxDQUFDLFlBQVksR0FBRyxPQUFPLENBQUMsWUFBWSxBQUFDLENBQUM7SUFDNUY7R0FDRDtBQUNELE1BQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxrQkFBa0IsSUFBSSxJQUFJLENBQUMsYUFBYSxFQUFFO0FBQ3hELE9BQUksaUJBQWlCLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO0FBQ25FLE9BQUksTUFBTSxDQUFDLFdBQVcsR0FBRyxpQkFBaUIsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLEVBQUU7QUFDMUUsVUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsaUJBQWlCLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxHQUFHLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUMxRjtHQUNEO0FBQ0QsTUFBSSxTQUFTLENBQUMsUUFBUSxLQUFLLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFO0FBQy9DLE9BQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztBQUNwQyxPQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7R0FDakI7RUFDRDs7QUFFRCxxQkFBb0IsRUFBQSxnQ0FBRztBQUN0QixVQUFRLENBQUMsbUJBQW1CLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0VBQ3BFOztBQUVELHdCQUF1QixFQUFBLGlDQUFDLE9BQU8sRUFBRTtBQUNoQyxNQUFJLE9BQU8sRUFBRTtBQUNaLFdBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUM7R0FDakUsTUFBTTtBQUNOLFdBQVEsQ0FBQyxtQkFBbUIsQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUM7R0FDcEU7RUFDRDs7QUFFRCxtQkFBa0IsRUFBQSw0QkFBQyxLQUFLLEVBQUU7O0FBRXpCLE1BQUksSUFBSSxDQUFDLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFDbEQsSUFBSSxDQUFDLGFBQWEsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBRTtBQUN2RSxPQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7R0FDakI7RUFDRDs7QUFFRCxNQUFLLEVBQUMsaUJBQUc7QUFDUixNQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxPQUFPO0FBQ3hCLE1BQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLENBQUM7O0FBRW5CLE1BQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxjQUFjLEVBQUU7QUFDOUIsT0FBSSxDQUFDLFFBQVEsQ0FBQztBQUNiLFVBQU0sRUFBRSxJQUFJO0lBQ1osQ0FBQyxDQUFDO0dBQ0g7RUFDRDs7QUFFRCxVQUFTLEVBQUEscUJBQUc7QUFDWCxNQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxPQUFPO0FBQ3hCLE1BQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7RUFDbEI7O0FBRUQsZ0JBQWUsRUFBQyx5QkFBQyxLQUFLLEVBQUU7O0FBRXZCLE1BQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO0VBQ3JCOztBQUVELGlCQUFnQixFQUFDLDBCQUFDLEtBQUssRUFBRTs7QUFFeEIsTUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7RUFDdEI7O0FBRUQsZUFBYyxFQUFDLHdCQUFDLEtBQUssRUFBRTs7O0FBR3RCLE1BQUcsSUFBSSxDQUFDLFFBQVEsRUFBRSxPQUFPOzs7QUFHekIsTUFBSSxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQztFQUM1Qjs7QUFFRCx5QkFBd0IsRUFBQyxrQ0FBQyxLQUFLLEVBQUU7OztBQUdoQyxNQUFHLElBQUksQ0FBQyxRQUFRLEVBQUUsT0FBTzs7O0FBR3pCLE1BQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7RUFDdkI7O0FBRUQsZ0JBQWUsRUFBQyx5QkFBQyxLQUFLLEVBQUU7OztBQUd2QixNQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxJQUFLLEtBQUssQ0FBQyxJQUFJLEtBQUssV0FBVyxJQUFJLEtBQUssQ0FBQyxNQUFNLEtBQUssQ0FBQyxBQUFDLEVBQUU7QUFDOUUsVUFBTztHQUNQOztBQUVELE1BQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxPQUFPLEtBQUssT0FBTyxFQUFFO0FBQ3JDLFVBQU87R0FDUDs7O0FBR0QsT0FBSyxDQUFDLGVBQWUsRUFBRSxDQUFDO0FBQ3hCLE9BQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQzs7O0FBR3ZCLE1BQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsRUFBRTtBQUMzQixPQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDYixVQUFPLElBQUksQ0FBQyxRQUFRLENBQUM7QUFDcEIsVUFBTSxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNO0lBQzFCLENBQUMsQ0FBQztHQUNIOztBQUVELE1BQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUU7Ozs7QUFJekIsT0FBSSxDQUFDLEtBQUssRUFBRSxDQUFDOztBQUViLE9BQUksS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7QUFDdkIsT0FBSSxPQUFPLEtBQUssQ0FBQyxRQUFRLEtBQUssVUFBVSxFQUFFOztBQUV6QyxTQUFLLEdBQUcsS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQ3pCOzs7QUFHRCxRQUFLLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQzs7O0FBR2pCLE9BQUksQ0FBQyxRQUFRLENBQUM7QUFDYixVQUFNLEVBQUUsSUFBSTtBQUNaLG1CQUFlLEVBQUUsS0FBSztJQUN0QixDQUFDLENBQUM7R0FDSCxNQUFNOztBQUVOLE9BQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDO0FBQzVCLE9BQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztHQUNiO0VBQ0Q7O0FBRUQsdUJBQXNCLEVBQUMsZ0NBQUMsS0FBSyxFQUFFOzs7QUFHOUIsTUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsSUFBSyxLQUFLLENBQUMsSUFBSSxLQUFLLFdBQVcsSUFBSSxLQUFLLENBQUMsTUFBTSxLQUFLLENBQUMsQUFBQyxFQUFFO0FBQzlFLFVBQU87R0FDUDs7QUFFRCxNQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUU7QUFDdkIsVUFBTztHQUNQOztBQUVELE9BQUssQ0FBQyxlQUFlLEVBQUUsQ0FBQztBQUN4QixPQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7O0FBRXZCLE1BQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztFQUNqQjs7QUFFRCxzQkFBcUIsRUFBQywrQkFBQyxLQUFLLEVBQUU7OztBQUc3QixNQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxJQUFLLEtBQUssQ0FBQyxJQUFJLEtBQUssV0FBVyxJQUFJLEtBQUssQ0FBQyxNQUFNLEtBQUssQ0FBQyxBQUFDLEVBQUU7QUFDOUUsVUFBTztHQUNQO0FBQ0QsT0FBSyxDQUFDLGVBQWUsRUFBRSxDQUFDO0FBQ3hCLE9BQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQzs7QUFFdkIsTUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUM7QUFDNUIsTUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO0VBQ2I7O0FBRUQsVUFBUyxFQUFDLHFCQUFHO0FBQ1osTUFBRyxJQUFJLENBQUMsS0FBSyxDQUFDLGtCQUFrQixFQUFFO0FBQ2pDLE9BQUksQ0FBQyxRQUFRLENBQUM7QUFDYixVQUFNLEVBQUUsS0FBSztBQUNiLG1CQUFlLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUs7QUFDMUQsY0FBVSxFQUFFLEVBQUU7SUFDZCxDQUFDLENBQUM7R0FDSCxNQUFNO0FBQ04sT0FBSSxDQUFDLFFBQVEsQ0FBQztBQUNiLFVBQU0sRUFBRSxLQUFLO0FBQ2IsbUJBQWUsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSztBQUMxRCxjQUFVLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVO0lBQ2pDLENBQUMsQ0FBQztHQUNIO0FBQ0QsTUFBSSxDQUFDLG1CQUFtQixHQUFHLEtBQUssQ0FBQztFQUNqQzs7QUFFRCxpQkFBZ0IsRUFBQywwQkFBQyxLQUFLLEVBQUU7QUFDeEIsTUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxPQUFPO0FBQ2hDLE1BQUksTUFBTSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxlQUFlLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUM7QUFDakYsTUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRTtBQUN2QixPQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztHQUMxQjtBQUNELE1BQUksQ0FBQyxRQUFRLENBQUM7QUFDYixZQUFTLEVBQUUsSUFBSTtBQUNmLFNBQU0sRUFBRSxNQUFNO0dBQ2QsQ0FBQyxDQUFDO0FBQ0gsTUFBSSxDQUFDLGVBQWUsR0FBRyxLQUFLLENBQUM7RUFDN0I7O0FBRUQsZ0JBQWUsRUFBQyx5QkFBQyxLQUFLLEVBQUU7O0FBRXZCLE1BQUksSUFBSSxDQUFDLElBQUksS0FBSyxJQUFJLENBQUMsSUFBSSxLQUFLLFFBQVEsQ0FBQyxhQUFhLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxDQUFBLEFBQUMsRUFBRTtBQUN0RyxPQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDYixVQUFPO0dBQ1A7O0FBRUQsTUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRTtBQUN0QixPQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztHQUN6QjtBQUNELE1BQUksY0FBYyxHQUFHO0FBQ3BCLFlBQVMsRUFBRSxLQUFLO0FBQ2hCLFNBQU0sRUFBRSxLQUFLO0FBQ2Isa0JBQWUsRUFBRSxLQUFLO0dBQ3RCLENBQUM7QUFDRixNQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsaUJBQWlCLEVBQUU7QUFDakMsaUJBQWMsQ0FBQyxVQUFVLEdBQUcsRUFBRSxDQUFDO0dBQy9CO0FBQ0QsTUFBSSxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsQ0FBQztFQUM5Qjs7QUFFRCxrQkFBaUIsRUFBQywyQkFBQyxLQUFLLEVBQUU7QUFDekIsTUFBSSxhQUFhLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUM7O0FBRXZDLE1BQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLEtBQUssS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLEVBQUU7QUFDN0UsT0FBSSxTQUFTLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDLENBQUM7O0FBRXhELE9BQUksU0FBUyxJQUFJLElBQUksSUFBSSxPQUFPLFNBQVMsS0FBSyxRQUFRLEVBQUU7QUFDdkQsaUJBQWEsR0FBRyxFQUFFLEdBQUcsU0FBUyxDQUFDO0lBQy9CO0dBQ0Q7O0FBRUQsTUFBSSxDQUFDLFFBQVEsQ0FBQztBQUNiLFNBQU0sRUFBRSxJQUFJO0FBQ1osa0JBQWUsRUFBRSxLQUFLO0FBQ3RCLGFBQVUsRUFBRSxhQUFhO0dBQ3pCLENBQUMsQ0FBQztFQUNIOztBQUVELGNBQWEsRUFBQyx1QkFBQyxLQUFLLEVBQUU7QUFDckIsTUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxPQUFPOztBQUVoQyxNQUFJLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxjQUFjLEtBQUssVUFBVSxFQUFFO0FBQ3BELE9BQUksQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ2pDLE9BQUksS0FBSyxDQUFDLGdCQUFnQixFQUFFO0FBQzNCLFdBQU87SUFDUDtHQUNEOztBQUVELFVBQVEsS0FBSyxDQUFDLE9BQU87QUFDcEIsUUFBSyxDQUFDOztBQUNMLFFBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLGdCQUFnQixFQUFFO0FBQzFELFVBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQztBQUN2QixTQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7S0FDaEI7QUFDRixXQUFPO0FBQUEsQUFDUCxRQUFLLENBQUM7O0FBQ0wsUUFBSSxLQUFLLENBQUMsUUFBUSxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLGVBQWUsRUFBRTtBQUN4RSxZQUFPO0tBQ1A7QUFDRCxRQUFJLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztBQUM1QixXQUFPO0FBQUEsQUFDUCxRQUFLLEVBQUU7O0FBQ04sUUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLE9BQU87QUFDL0IsU0FBSyxDQUFDLGVBQWUsRUFBRSxDQUFDO0FBQ3hCLFFBQUksQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO0FBQzVCLFVBQU07QUFBQSxBQUNOLFFBQUssRUFBRTs7QUFDTixRQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFO0FBQ3RCLFNBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztBQUNqQixVQUFLLENBQUMsZUFBZSxFQUFFLENBQUM7S0FDeEIsTUFBTSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsaUJBQWlCLEVBQUU7QUFDaEUsU0FBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUN2QixVQUFLLENBQUMsZUFBZSxFQUFFLENBQUM7S0FDeEI7QUFDRixVQUFNO0FBQUEsQUFDTixRQUFLLEVBQUU7O0FBQ04sUUFBSSxDQUFDLG1CQUFtQixFQUFFLENBQUM7QUFDNUIsVUFBTTtBQUFBLEFBQ04sUUFBSyxFQUFFOztBQUNOLFFBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztBQUN4QixVQUFNO0FBQUEsQUFDTixRQUFLLEVBQUU7O0FBQ04sUUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7QUFDMUIsVUFBTTtBQUFBLEFBQ04sUUFBSyxFQUFFOztBQUNOLFFBQUksQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO0FBQzVCLFVBQU07QUFBQSxBQUNOLFFBQUssRUFBRTs7QUFDTixRQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7QUFDdkIsVUFBTTtBQUFBLEFBQ04sUUFBSyxFQUFFOztBQUNOLFFBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO0FBQ3pCLFVBQU07QUFBQSxBQUNOO0FBQVMsV0FBTztBQUFBLEdBQ2hCO0FBQ0QsT0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO0VBQ3ZCOztBQUVELGlCQUFnQixFQUFDLDBCQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUU7QUFDaEMsTUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxFQUFFLE9BQU87QUFDckMsTUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDO0VBQ3ZDOztBQUVELGlCQUFnQixFQUFDLDBCQUFDLEtBQUssRUFBRTtBQUN4QixNQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxvQkFBb0IsRUFBRSxPQUFPO01BQ3ZDLE1BQU0sR0FBSyxLQUFLLENBQWhCLE1BQU07O0FBQ1osTUFBSSxNQUFNLENBQUMsWUFBWSxHQUFHLE1BQU0sQ0FBQyxZQUFZLElBQUksRUFBRSxNQUFNLENBQUMsWUFBWSxHQUFHLE1BQU0sQ0FBQyxZQUFZLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQSxBQUFDLEVBQUU7QUFDakgsT0FBSSxDQUFDLEtBQUssQ0FBQyxvQkFBb0IsRUFBRSxDQUFDO0dBQ2xDO0VBQ0Q7O0FBRUQsZUFBYyxFQUFDLHdCQUFDLEtBQUssRUFBRSxLQUFLLEVBQUU7QUFDN0IsTUFBSSxDQUFDLEtBQUssRUFBRSxPQUFPLElBQUksQ0FBQztBQUN4QixTQUFRLEtBQUssR0FBRyxLQUFLLENBQUMsTUFBTSxLQUFLLENBQUMsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUU7RUFDdEU7O0FBRUQsZUFBYyxFQUFDLHdCQUFDLEVBQUUsRUFBRTtBQUNuQixTQUFPLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0VBQy9COzs7Ozs7OztBQVFELGNBQWEsRUFBQyx1QkFBQyxLQUFLLEVBQUUsU0FBUyxFQUFFOzs7O0FBRWhDLE1BQU0sS0FBSyxHQUFHLE9BQU8sU0FBUyxLQUFLLFFBQVEsR0FBRyxTQUFTLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztBQUNyRSxNQUFJLEtBQUssQ0FBQyxLQUFLLEVBQUU7QUFDaEIsT0FBSSxPQUFPLEtBQUssS0FBSyxRQUFRLEVBQUUsS0FBSyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ3BFLE9BQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFO0FBQzFCLFFBQUksS0FBSyxLQUFLLElBQUksSUFBSSxLQUFLLEtBQUssU0FBUyxFQUFFLE9BQU8sRUFBRSxDQUFDO0FBQ3JELFNBQUssR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ2hCO0FBQ0QsVUFBTyxLQUFLLENBQUMsR0FBRyxDQUFDLFVBQUEsS0FBSztXQUFJLE1BQUssV0FBVyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUM7SUFBQSxDQUFDLENBQUMsTUFBTSxDQUFDLFVBQUEsQ0FBQztXQUFJLENBQUM7SUFBQSxDQUFDLENBQUM7R0FDekU7QUFDRCxNQUFJLGFBQWEsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztBQUNuRCxTQUFPLGFBQWEsR0FBRyxDQUFDLGFBQWEsQ0FBQyxHQUFHLEVBQUUsQ0FBQztFQUM1Qzs7Ozs7OztBQU9ELFlBQVcsRUFBQyxxQkFBQyxLQUFLLEVBQUUsS0FBSyxFQUFFO0FBQzFCLE1BQUksT0FBTyxLQUFLLEtBQUssUUFBUSxJQUFJLE9BQU8sS0FBSyxLQUFLLFFBQVEsRUFBRSxPQUFPLEtBQUssQ0FBQztlQUN2QixJQUFJLENBQUMsS0FBSztNQUF0RCxRQUFRLFVBQVIsUUFBUTtNQUFFLFFBQVEsVUFBUixRQUFRO01BQUUsbUJBQW1CLFVBQW5CLG1CQUFtQjs7QUFDN0MsTUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQztBQUNoQyxNQUFJLENBQUMsT0FBTyxJQUFJLEtBQUssS0FBSyxFQUFFLEVBQUUsT0FBTztBQUNyQyxPQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUN4QyxPQUFJLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsS0FBSyxLQUFLLEVBQUUsT0FBTyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7R0FDdEQ7OztBQUdELE1BQUksbUJBQW1CLEVBQUU7OztBQUN4QixpQkFBYyxDQUFDLEtBQUssQ0FBQyxHQUFHLGNBQWMsQ0FBQyxLQUFLLENBQUM7QUFDNUMsV0FBTyxFQUFFLElBQUk7NEJBQ1osUUFBUSxFQUFHLEtBQUsseUJBQ2hCLFFBQVEsRUFBRyxLQUFLLFFBQ2pCLENBQUM7QUFDQyxVQUFPLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQztHQUNoQztFQUNEOztBQUVELFNBQVEsRUFBQyxrQkFBQyxLQUFLLEVBQUU7OztBQUNoQixNQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFDO0FBQ3ZCLE9BQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztHQUNqQjtBQUNELE1BQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxPQUFPO0FBQ2pDLE1BQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUU7QUFDeEIsT0FBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUM5RCxPQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsUUFBUSxFQUFSLFFBQVEsRUFBRSxDQUFDLENBQUM7R0FDNUI7QUFDRCxNQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxJQUFJLEtBQUssRUFBRTtBQUNwQyxRQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxVQUFBLENBQUM7V0FBSSxDQUFDLENBQUMsT0FBSyxLQUFLLENBQUMsUUFBUSxDQUFDO0lBQUEsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0dBQzFIO0FBQ0QsTUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7RUFDM0I7O0FBRUQsWUFBVyxFQUFDLHFCQUFDLEtBQUssRUFBRTs7OztBQUVuQixNQUFJLENBQUMsbUJBQW1CLEdBQUcsS0FBSyxDQUFDO0FBQ2pDLE1BQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUU7QUFDckIsT0FBSSxDQUFDLFFBQVEsQ0FBQztBQUNiLGNBQVUsRUFBRSxFQUFFO0FBQ2QsZ0JBQVksRUFBRSxJQUFJO0lBQ2xCLEVBQUUsWUFBTTtBQUNSLFdBQUssUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3JCLENBQUMsQ0FBQztHQUNILE1BQU07QUFDTixPQUFJLENBQUMsUUFBUSxDQUFDO0FBQ2IsVUFBTSxFQUFFLEtBQUs7QUFDYixjQUFVLEVBQUUsRUFBRTtBQUNkLG1CQUFlLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTO0lBQ3JDLEVBQUUsWUFBTTtBQUNSLFdBQUssUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3JCLENBQUMsQ0FBQztHQUNIO0VBQ0Q7O0FBRUQsU0FBUSxFQUFDLGtCQUFDLEtBQUssRUFBRTtBQUNoQixNQUFJLFVBQVUsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDcEQsTUFBSSxNQUFNLEdBQUcsS0FBSyxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxLQUFLLENBQUM7QUFDMUUsTUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7RUFDekM7O0FBRUEsZUFBYyxFQUFDLHdCQUFDLEdBQUcsRUFBRTtBQUNyQixNQUFJLEdBQUcsR0FBRyxFQUFFLENBQUM7QUFDWCxPQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUNuQyxPQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFO0FBQ2pDLE9BQUcsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7SUFDdkQsTUFBTTtBQUNMLE9BQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDbEI7R0FDRjtBQUNELFNBQU8sR0FBRyxDQUFDO0VBQ1o7O0FBRUYsU0FBUSxFQUFDLG9CQUFHO0FBQ1gsTUFBSSxVQUFVLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3RELE1BQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFLE9BQU87QUFDL0IsTUFBSSxVQUFVLENBQUMsVUFBVSxDQUFDLE1BQU0sR0FBQyxDQUFDLENBQUMsQ0FBQyxjQUFjLEtBQUssS0FBSyxFQUFFLE9BQU87QUFDckUsTUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxVQUFVLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDMUQ7O0FBRUQsWUFBVyxFQUFDLHFCQUFDLEtBQUssRUFBRTtBQUNuQixNQUFJLFVBQVUsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDdEQsTUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLFVBQUEsQ0FBQztVQUFJLENBQUMsS0FBSyxLQUFLO0dBQUEsQ0FBQyxDQUFDLENBQUM7QUFDbkQsTUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO0VBQ2I7O0FBRUQsV0FBVSxFQUFDLG9CQUFDLEtBQUssRUFBRTs7O0FBR2xCLE1BQUksS0FBSyxJQUFJLEtBQUssQ0FBQyxJQUFJLEtBQUssV0FBVyxJQUFJLEtBQUssQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO0FBQzlELFVBQU87R0FDUDtBQUNELE9BQUssQ0FBQyxlQUFlLEVBQUUsQ0FBQztBQUN4QixPQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7QUFDdkIsTUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUMsQ0FBQztBQUNwQyxNQUFJLENBQUMsUUFBUSxDQUFDO0FBQ2IsU0FBTSxFQUFFLEtBQUs7QUFDYixhQUFVLEVBQUUsRUFBRTtHQUNkLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0VBQ2Y7O0FBRUQsY0FBYSxFQUFBLHlCQUFHO0FBQ2YsTUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsS0FBSyxTQUFTLEVBQUU7QUFDeEMsVUFBTyxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQztHQUM3QixNQUFNLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUU7QUFDNUIsVUFBTyxFQUFFLENBQUM7R0FDVixNQUFNO0FBQ04sVUFBTyxJQUFJLENBQUM7R0FDWjtFQUNEOztBQUVELFlBQVcsRUFBQyxxQkFBQyxNQUFNLEVBQUU7QUFDbEIsTUFBSSxDQUFDLFFBQVEsQ0FBQztBQUNmLGdCQUFhLEVBQUUsTUFBTTtHQUNyQixDQUFDLENBQUM7RUFDSDs7QUFFRCxnQkFBZSxFQUFDLDJCQUFHO0FBQ2xCLE1BQUksQ0FBQyxtQkFBbUIsQ0FBQyxNQUFNLENBQUMsQ0FBQztFQUNqQzs7QUFFRCxvQkFBbUIsRUFBQywrQkFBRztBQUN0QixNQUFJLENBQUMsbUJBQW1CLENBQUMsVUFBVSxDQUFDLENBQUM7RUFDckM7O0FBRUQsa0JBQWlCLEVBQUMsNkJBQUc7QUFDcEIsTUFBSSxDQUFDLG1CQUFtQixDQUFDLFNBQVMsQ0FBQyxDQUFDO0VBQ3BDOztBQUVELG9CQUFtQixFQUFDLCtCQUFHO0FBQ3RCLE1BQUksQ0FBQyxtQkFBbUIsQ0FBQyxXQUFXLENBQUMsQ0FBQztFQUN0Qzs7QUFFRCxpQkFBZ0IsRUFBQyw0QkFBRztBQUNuQixNQUFJLENBQUMsbUJBQW1CLENBQUMsT0FBTyxDQUFDLENBQUM7RUFDbEM7O0FBRUQsZUFBYyxFQUFDLDBCQUFHO0FBQ2pCLE1BQUksQ0FBQyxtQkFBbUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztFQUNoQzs7QUFFRCxvQkFBbUIsRUFBQyw2QkFBQyxHQUFHLEVBQUU7QUFDekIsTUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FDaEMsR0FBRyxDQUFDLFVBQUMsTUFBTSxFQUFFLEtBQUs7VUFBTSxFQUFFLE1BQU0sRUFBTixNQUFNLEVBQUUsS0FBSyxFQUFMLEtBQUssRUFBRTtHQUFDLENBQUMsQ0FDM0MsTUFBTSxDQUFDLFVBQUEsTUFBTTtVQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxRQUFRO0dBQUEsQ0FBQyxDQUFDO0FBQzVDLE1BQUksQ0FBQyw4QkFBOEIsR0FBRyxJQUFJLENBQUM7QUFDM0MsTUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFO0FBQ3ZCLE9BQUksQ0FBQyxRQUFRLENBQUM7QUFDYixVQUFNLEVBQUUsSUFBSTtBQUNaLGNBQVUsRUFBRSxFQUFFO0FBQ2QsaUJBQWEsRUFBRSxJQUFJLENBQUMsY0FBYyxJQUFJLE9BQU8sQ0FBQyxHQUFHLEtBQUssTUFBTSxHQUFHLENBQUMsR0FBRyxPQUFPLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLE1BQU07SUFDN0YsQ0FBQyxDQUFDO0FBQ0gsVUFBTztHQUNQO0FBQ0QsTUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsT0FBTztBQUM1QixNQUFJLFlBQVksR0FBRyxDQUFDLENBQUMsQ0FBQztBQUN0QixPQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUN4QyxPQUFJLElBQUksQ0FBQyxjQUFjLEtBQUssT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRTtBQUM5QyxnQkFBWSxHQUFHLENBQUMsQ0FBQztBQUNqQixVQUFNO0lBQ047R0FDRDtBQUNELE1BQUksR0FBRyxLQUFLLE1BQU0sSUFBSSxZQUFZLEtBQUssQ0FBQyxDQUFDLEVBQUc7QUFDM0MsZUFBWSxHQUFHLENBQUMsWUFBWSxHQUFHLENBQUMsQ0FBQSxHQUFJLE9BQU8sQ0FBQyxNQUFNLENBQUM7R0FDbkQsTUFBTSxJQUFJLEdBQUcsS0FBSyxVQUFVLEVBQUU7QUFDOUIsT0FBSSxZQUFZLEdBQUcsQ0FBQyxFQUFFO0FBQ3JCLGdCQUFZLEdBQUcsWUFBWSxHQUFHLENBQUMsQ0FBQztJQUNoQyxNQUFNO0FBQ04sZ0JBQVksR0FBRyxPQUFPLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztJQUNsQztHQUNELE1BQU0sSUFBSSxHQUFHLEtBQUssT0FBTyxFQUFFO0FBQzNCLGVBQVksR0FBRyxDQUFDLENBQUM7R0FDakIsTUFBTSxJQUFJLEdBQUcsS0FBSyxLQUFLLEVBQUU7QUFDekIsZUFBWSxHQUFHLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0dBQ2xDLE1BQU0sSUFBSSxHQUFHLEtBQUssU0FBUyxFQUFFO0FBQzdCLE9BQUksY0FBYyxHQUFHLFlBQVksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQztBQUN4RCxPQUFLLGNBQWMsR0FBRyxDQUFDLEVBQUc7QUFDekIsZ0JBQVksR0FBRyxDQUFDLENBQUM7SUFDakIsTUFBTTtBQUNOLGdCQUFZLEdBQUcsY0FBYyxDQUFDO0lBQzlCO0dBQ0QsTUFBTSxJQUFJLEdBQUcsS0FBSyxXQUFXLEVBQUU7QUFDL0IsT0FBSSxjQUFjLEdBQUcsWUFBWSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDO0FBQ3hELE9BQUssY0FBYyxHQUFHLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFHO0FBQzFDLGdCQUFZLEdBQUcsT0FBTyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7SUFDbEMsTUFBTTtBQUNOLGdCQUFZLEdBQUcsY0FBYyxDQUFDO0lBQzlCO0dBQ0Q7O0FBRUQsTUFBSSxZQUFZLEtBQUssQ0FBQyxDQUFDLEVBQUU7QUFDeEIsZUFBWSxHQUFHLENBQUMsQ0FBQztHQUNqQjs7QUFFRCxNQUFJLENBQUMsUUFBUSxDQUFDO0FBQ2IsZUFBWSxFQUFFLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQyxLQUFLO0FBQ3pDLGdCQUFhLEVBQUUsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDLE1BQU07R0FDM0MsQ0FBQyxDQUFDO0VBQ0g7O0FBRUQsaUJBQWdCLEVBQUMsNEJBQUc7QUFDbkIsU0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDO0VBQzNCOztBQUVELGNBQWEsRUFBQyx5QkFBRztBQUNoQixTQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDO0VBQzdCOztBQUVELG9CQUFtQixFQUFDLCtCQUFHO0FBQ3RCLE1BQUksSUFBSSxDQUFDLGNBQWMsRUFBRTtBQUN4QixVQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO0dBQzdDO0VBQ0Q7O0FBRUQsY0FBYSxFQUFDLHlCQUFHO0FBQ2hCLE1BQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsRUFBRSxPQUFPO0FBQ2xDLFNBQ0M7O0tBQU0sU0FBUyxFQUFDLHFCQUFxQixFQUFDLGVBQVksTUFBTTtHQUN2RCwyQ0FBTSxTQUFTLEVBQUMsZ0JBQWdCLEdBQUc7R0FDN0IsQ0FDTjtFQUNGOztBQUVELFlBQVcsRUFBQyxxQkFBQyxVQUFVLEVBQUUsTUFBTSxFQUFFOzs7QUFDaEMsTUFBSSxXQUFXLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLElBQUksSUFBSSxDQUFDLGNBQWMsQ0FBQztBQUNsRSxNQUFJLGNBQWMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQztBQUMvQyxNQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRTtBQUN2QixVQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLEdBQUc7O01BQUssU0FBUyxFQUFDLG9CQUFvQjtJQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVztJQUFPLEdBQUcsSUFBSSxDQUFDO0dBQzFHO0FBQ0QsTUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQztBQUNyRSxNQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFO0FBQ3JCLFVBQU8sVUFBVSxDQUFDLEdBQUcsQ0FBQyxVQUFDLEtBQUssRUFBRSxDQUFDLEVBQUs7QUFDbkMsV0FDQztBQUFDLG1CQUFjOztBQUNkLFFBQUUsRUFBRSxPQUFLLGVBQWUsR0FBRyxTQUFTLEdBQUcsQ0FBQyxBQUFDO0FBQ3pDLG9CQUFjLEVBQUUsT0FBSyxlQUFlLEFBQUM7QUFDckMsY0FBUSxFQUFFLE9BQUssS0FBSyxDQUFDLFFBQVEsSUFBSSxLQUFLLENBQUMsY0FBYyxLQUFLLEtBQUssQUFBQztBQUNoRSxTQUFHLGFBQVcsQ0FBQyxTQUFJLEtBQUssQ0FBQyxPQUFLLEtBQUssQ0FBQyxRQUFRLENBQUMsQUFBRztBQUNoRCxhQUFPLEVBQUUsT0FBTyxBQUFDO0FBQ2pCLGNBQVEsRUFBRSxPQUFLLFdBQVcsQUFBQztBQUMzQixXQUFLLEVBQUUsS0FBSyxBQUFDOztLQUVaLFdBQVcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO0tBQ3RCOztRQUFNLFNBQVMsRUFBQyxrQkFBa0I7O01BQWM7S0FDaEMsQ0FDaEI7SUFDRixDQUFDLENBQUM7R0FDSCxNQUFNLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsRUFBRTtBQUNsQyxPQUFJLE1BQU0sRUFBRSxPQUFPLEdBQUcsSUFBSSxDQUFDO0FBQzNCLFVBQ0M7QUFBQyxrQkFBYzs7QUFDZCxPQUFFLEVBQUUsSUFBSSxDQUFDLGVBQWUsR0FBRyxhQUFhLEFBQUM7QUFDekMsYUFBUSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxBQUFDO0FBQzlCLG1CQUFjLEVBQUUsSUFBSSxDQUFDLGVBQWUsQUFBQztBQUNyQyxZQUFPLEVBQUUsT0FBTyxBQUFDO0FBQ2pCLFVBQUssRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDLEFBQUM7O0lBRXBCLFdBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDWCxDQUNoQjtHQUNGO0VBQ0Q7O0FBRUQsWUFBVyxFQUFDLHFCQUFDLFVBQVUsRUFBRSxrQkFBa0IsRUFBRTs7O0FBQzVDLE1BQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLEVBQUU7QUFDN0IsVUFBTyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsRUFBRSxDQUFDO0dBQ2xDLE1BQU07OztBQUNOLE9BQUksU0FBUyxHQUFHLDZCQUFXLGNBQWMsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUM1RSxPQUFNLE1BQU0sR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUM7O0FBRW5DLE9BQU0sUUFBUSxHQUFHLDZFQUNmLElBQUksQ0FBQyxlQUFlLEdBQUcsT0FBTyxFQUFHLE1BQU0sZ0NBQ3ZDLElBQUksQ0FBQyxlQUFlLEdBQUcsMkJBQTJCLEVBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLElBQ2xFLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLElBQ3BCLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxJQUNwQixDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxnQkFDekIsQ0FBQzs7O0FBR0gsT0FBTSxVQUFVLEdBQUcsU0FBYyxFQUFFLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLEVBQUU7QUFDM0QsUUFBSSxFQUFFLFVBQVU7QUFDaEIsbUJBQWUsRUFBRSxFQUFFLEdBQUcsTUFBTTtBQUM1QixlQUFXLEVBQUUsUUFBUTtBQUNyQixtQkFBZSxFQUFFLEVBQUUsR0FBRyxNQUFNO0FBQzVCLDJCQUF1QixFQUFFLE1BQU0sR0FBRyxJQUFJLENBQUMsZUFBZSxHQUFHLFVBQVUsR0FBRyxrQkFBa0IsR0FBRyxJQUFJLENBQUMsZUFBZSxHQUFHLFFBQVE7QUFDMUgscUJBQWlCLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQztBQUNoRCxnQkFBWSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDO0FBQ3RDLGFBQVMsRUFBRSxTQUFTO0FBQ3BCLFlBQVEsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVE7QUFDN0IsVUFBTSxFQUFFLElBQUksQ0FBQyxlQUFlO0FBQzVCLFlBQVEsRUFBRSxJQUFJLENBQUMsaUJBQWlCO0FBQ2hDLFdBQU8sRUFBRSxJQUFJLENBQUMsZ0JBQWdCO0FBQzlCLE9BQUcsRUFBRSxhQUFBLEtBQUc7WUFBSSxPQUFLLEtBQUssR0FBRyxLQUFHO0tBQUE7QUFDNUIsWUFBUSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUTtBQUM3QixTQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVO0lBQzVCLENBQUMsQ0FBQzs7QUFFSCxPQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLEVBQUU7NEJBQ1YsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVO1FBQXJELGNBQWMscUJBQWQsY0FBYzs7UUFBSyxRQUFROztBQUNuQyxXQUNDLHFEQUNLLFFBQVE7QUFDWixTQUFJLEVBQUMsVUFBVTtBQUNmLHNCQUFlLE1BQU0sQUFBQztBQUN0QixrQkFBVyxNQUFNLEdBQUcsSUFBSSxDQUFDLGVBQWUsR0FBRyxPQUFPLEdBQUcsSUFBSSxDQUFDLGVBQWUsR0FBRyxRQUFRLEFBQUM7QUFDckYsOEJBQXVCLE1BQU0sR0FBRyxJQUFJLENBQUMsZUFBZSxHQUFHLFVBQVUsR0FBRyxrQkFBa0IsR0FBRyxJQUFJLENBQUMsZUFBZSxHQUFHLFFBQVEsQUFBQztBQUN6SCxjQUFTLEVBQUUsU0FBUyxBQUFDO0FBQ3JCLGFBQVEsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsSUFBSSxDQUFDLEFBQUM7QUFDbkMsV0FBTSxFQUFFLElBQUksQ0FBQyxlQUFlLEFBQUM7QUFDN0IsWUFBTyxFQUFFLElBQUksQ0FBQyxnQkFBZ0IsQUFBQztBQUMvQixRQUFHLEVBQUUsVUFBQSxHQUFHO2FBQUksT0FBSyxLQUFLLEdBQUcsR0FBRztNQUFBLEFBQUM7QUFDN0Isc0JBQWUsRUFBRSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQUFBQztBQUMxQyxVQUFLLEVBQUUsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsT0FBTyxFQUFDLGNBQWMsRUFBRSxBQUFDLElBQUUsQ0FDekQ7SUFDRjs7QUFFRCxPQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFO0FBQ3hCLFdBQ0MsK0VBQW1CLFVBQVUsSUFBRSxRQUFRLEVBQUMsS0FBSyxJQUFHLENBQy9DO0lBQ0Y7QUFDRCxVQUNDOztNQUFLLFNBQVMsRUFBRyxTQUFTLEFBQUU7SUFDM0IsMENBQVcsVUFBVSxDQUFJO0lBQ3BCLENBQ0w7R0FDRjtFQUNEOztBQUVELFlBQVcsRUFBQyx1QkFBRztBQUNkLE1BQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsSUFBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxLQUFLLENBQUMsQUFBQyxJQUFLLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxBQUFDLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUUsT0FBTztBQUNwTCxTQUNDOztLQUFNLFNBQVMsRUFBQyxtQkFBbUIsRUFBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxjQUFjLEFBQUM7QUFDakgsa0JBQVksSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxjQUFjLEFBQUM7QUFDbkYsZUFBVyxFQUFFLElBQUksQ0FBQyxVQUFVLEFBQUM7QUFDN0IsZ0JBQVksRUFBRSxJQUFJLENBQUMsZ0JBQWdCLEFBQUM7QUFDcEMsZUFBVyxFQUFFLElBQUksQ0FBQyxlQUFlLEFBQUM7QUFDbEMsY0FBVSxFQUFFLElBQUksQ0FBQyx3QkFBd0IsQUFBQzs7R0FFMUMsMkNBQU0sU0FBUyxFQUFDLGNBQWMsRUFBQyx1QkFBdUIsRUFBRSxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsQUFBQyxHQUFHO0dBQzNFLENBQ047RUFDRjs7QUFFRCxZQUFXLEVBQUMsdUJBQUc7QUFDZCxNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsc0JBQXNCLENBQUM7QUFDaEQsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsRUFBRSxXQUFXLEVBQVgsV0FBVyxFQUFFLENBQUMsQ0FBQzs7QUFFeEQsU0FDQzs7O0FBQ0MsYUFBUyxFQUFDLG1CQUFtQjtBQUM3QixlQUFXLEVBQUUsV0FBVyxBQUFDOztHQUV4QixLQUFLO0dBQ0EsQ0FDTjtFQUNGOztBQUVELGtCQUFpQixFQUFDLDJCQUFDLGNBQWMsRUFBRTtBQUNsQyxNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQztBQUN4QyxNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDO0FBQ3RDLE1BQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLEVBQUU7O0FBRTVCLE9BQU0sYUFBYSxHQUFHLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLEtBQUssVUFBVSxHQUNoRSxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEseUNBQ0osQ0FBQzs7QUFFekIsVUFBTyxhQUFhLENBQ2xCLFdBQVcsRUFDWCxXQUFXLEVBQ1gsY0FBYyxFQUNkO0FBQ0UsZ0JBQVksRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVk7QUFDckMsaUJBQWEsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWE7QUFDdkMsY0FBVSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVTtBQUNqQyxZQUFRLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRO0FBQzdCLFlBQVEsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVE7QUFDN0IsYUFBUyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUztBQUMvQixZQUFRLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRO0FBQzdCLGVBQVcsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVc7SUFDcEMsQ0FDRixDQUFDO0dBQ0wsTUFBTTtBQUNOLFVBQU8sV0FBVyxDQUFDO0dBQ25CO0VBQ0Q7O0FBRUQsZUFBYyxFQUFDLHdCQUFDLE9BQU8sRUFBRSxLQUFLLEVBQUU7QUFDN0IsTUFBSSxDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsQ0FBQztBQUN4QixNQUFJLFdBQVcsR0FBRyxFQUFFLENBQUM7QUFDckIsT0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFHLEVBQUU7QUFDeEMsT0FBTSxVQUFVLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3JDLGFBQVUsQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO0FBQzVCLE9BQUksS0FBSyxFQUFFO0FBQ1QsY0FBVSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7SUFDMUI7QUFDRCxPQUFJLE9BQU8sQ0FBQyxVQUFVLENBQUMsRUFBRTs7QUFFdkIsY0FBVSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUM7QUFDakMsY0FBVSxDQUFDLEtBQUssR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFDO0FBQ3BDLFFBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLEVBQUUsV0FBVyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUN6RCxlQUFXLEdBQUcsV0FBVyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxPQUFPLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQztBQUN0RixjQUFVLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztJQUN6QixNQUFNO0FBQ0wsZUFBVyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUM5QjtHQUNGO0FBQ0QsU0FBTyxXQUFXLENBQUM7RUFDckI7O0FBRUEsaUJBQWdCLEVBQUMsMEJBQUMsV0FBVyxFQUFFO0FBQzdCLE1BQUksY0FBYyxHQUFHLEVBQUUsQ0FBQztBQUN4QixNQUFJLE1BQU0sWUFBQTtNQUFFLEtBQUssWUFBQSxDQUFDOzs7QUFHbEIsYUFBVyxDQUFDLE9BQU8sQ0FBQyxVQUFDLE1BQU0sRUFBSztBQUM5QixTQUFNLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQztBQUN4QixTQUFNLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQztBQUN0QixVQUFPLE1BQU0sRUFBRTtBQUNiLFVBQU0sQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDOztBQUVwQixRQUFJLE1BQU0sQ0FBQyxRQUFRLEVBQUU7QUFDbkIsV0FBTSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7S0FDekI7QUFDRCxVQUFNLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQztJQUN2QjtHQUNGLENBQUMsQ0FBQzs7O0FBR0gsYUFBVyxDQUFDLE9BQU8sQ0FBQyxVQUFDLE1BQU0sRUFBSztBQUM5QixRQUFLLEdBQUcsTUFBTSxDQUFDO0FBQ2YsU0FBTSxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUM7O0FBRXJCLFVBQU8sTUFBTSxFQUFFO0FBQ2IsUUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUU7QUFDbkIsV0FBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDM0IsVUFBSyxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7S0FDdkI7O0FBRUQsU0FBSyxHQUFHLE1BQU0sQ0FBQztBQUNmLFVBQU0sR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDO0lBQ3RCO0FBQ0QsT0FBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUU7QUFDbkIsa0JBQWMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDM0IsU0FBSyxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7SUFDdkI7R0FDRixDQUFDLENBQUM7QUFDSCxnQkFBYyxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxjQUFjLENBQUMsQ0FBQztBQUN4RCxTQUFPLGNBQWMsQ0FBQztFQUN2Qjs7QUFFRCxrQkFBaUIsRUFBQywyQkFBQyxjQUFjLEVBQUUsWUFBWSxFQUFFOzs7QUFDL0MsU0FBTyxjQUFjLENBQUMsTUFBTSxDQUFDLFVBQUMsSUFBSSxFQUFFLEtBQUssRUFBSztBQUM1QyxPQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRSxPQUFPLElBQUksQ0FBQztBQUN0QyxVQUFLLGlCQUFpQixDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDM0MsT0FBSSxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUUsT0FBTyxJQUFJLENBQUM7QUFDekMsT0FBSSxZQUFZLEVBQUUsWUFBWSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ3hELFVBQU8sS0FBSyxDQUFDO0dBQ2QsQ0FBQyxDQUFDO0VBQ0o7O0FBRUYsWUFBVyxFQUFBLHFCQUFDLEdBQUcsRUFBRSxTQUFTLEVBQUU7QUFDM0IsTUFBSSxTQUFTLEVBQUU7QUFDZCxPQUFJLENBQUMsT0FBTyxHQUFHLEdBQUcsQ0FBQztHQUNuQjtFQUNEOztBQUVELFdBQVUsRUFBQyxvQkFBQyxPQUFPLEVBQUUsVUFBVSxFQUFFLGFBQWEsRUFBRTtBQUMvQyxNQUFJLE9BQU8sSUFBSSxPQUFPLENBQUMsTUFBTSxFQUFFO0FBQzlCLFVBQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUM7QUFDOUIsaUJBQWEsRUFBYixhQUFhO0FBQ1QsZUFBVyxFQUFFLElBQUksQ0FBQyxXQUFXO0FBQ2pDLGtCQUFjLEVBQUUsSUFBSSxDQUFDLGVBQWU7QUFDcEMsWUFBUSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUTtBQUM3QixXQUFPLEVBQUUsSUFBSSxDQUFDLFdBQVc7QUFDckIsZUFBVyxFQUFFLElBQUksQ0FBQyxXQUFXO0FBQ2pDLFlBQVEsRUFBRSxJQUFJLENBQUMsV0FBVztBQUMxQixtQkFBZSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsZUFBZTtBQUMzQyxtQkFBZSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsZUFBZTtBQUN2Qyx3QkFBb0IsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLG9CQUFvQjtBQUN6RCxrQkFBYyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsY0FBYyxJQUFJLElBQUksQ0FBQyxjQUFjO0FBQ2hFLFdBQU8sRUFBUCxPQUFPO0FBQ0gsZUFBVyxFQUFFLElBQUksQ0FBQyxXQUFXO0FBQzdCLGVBQVcsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVc7QUFDdkMsY0FBVSxFQUFWLFVBQVU7QUFDVixZQUFRLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRO0lBQzdCLENBQUMsQ0FBQztHQUNILE1BQU0sSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsRUFBRTtBQUNwQyxVQUNDOztNQUFLLFNBQVMsRUFBQyxrQkFBa0I7SUFDL0IsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhO0lBQ3BCLENBQ0w7R0FDRixNQUFNO0FBQ04sVUFBTyxJQUFJLENBQUM7R0FDWjtFQUNEOztBQUVELGtCQUFpQixFQUFDLDJCQUFDLFVBQVUsRUFBRTs7O0FBQzlCLE1BQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxPQUFPO0FBQzdCLE1BQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLEVBQUU7QUFDMUIsT0FBSSxLQUFLLEdBQUcsVUFBVSxDQUFDLEdBQUcsQ0FBQyxVQUFBLENBQUM7V0FBSSxjQUFjLENBQUMsQ0FBQyxDQUFDLE9BQUssS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQUEsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ25HLFVBQ0M7QUFDQyxRQUFJLEVBQUMsUUFBUTtBQUNiLE9BQUcsRUFBRSxVQUFBLEdBQUc7WUFBSSxPQUFLLEtBQUssR0FBRyxHQUFHO0tBQUEsQUFBQztBQUM3QixRQUFJLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEFBQUM7QUFDdEIsU0FBSyxFQUFFLEtBQUssQUFBQztBQUNiLFlBQVEsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQUFBQyxHQUFHLENBQ2pDO0dBQ0Y7QUFDRCxTQUFPLFVBQVUsQ0FBQyxHQUFHLENBQUMsVUFBQyxJQUFJLEVBQUUsS0FBSztVQUNqQyw0Q0FBTyxHQUFHLEVBQUUsU0FBUyxHQUFHLEtBQUssQUFBQztBQUM3QixRQUFJLEVBQUMsUUFBUTtBQUNiLE9BQUcsRUFBRSxPQUFPLEdBQUcsS0FBSyxBQUFDO0FBQ3JCLFFBQUksRUFBRSxPQUFLLEtBQUssQ0FBQyxJQUFJLEFBQUM7QUFDdEIsU0FBSyxFQUFFLGNBQWMsQ0FBQyxJQUFJLENBQUMsT0FBSyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQUFBQztBQUNqRCxZQUFRLEVBQUUsT0FBSyxLQUFLLENBQUMsUUFBUSxBQUFDLEdBQUc7R0FDbEMsQ0FBQyxDQUFDO0VBQ0g7O0FBRUQsd0JBQXVCLEVBQUMsaUNBQUMsY0FBYyxFQUFFO0FBQ3hDLE1BQUksT0FBTyxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUM7QUFDbkMsTUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsT0FBTyxJQUFJLENBQUM7O0FBRWpDLE1BQUksYUFBYSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxJQUFJLGNBQWMsQ0FBQztBQUMvRCxNQUFJLGFBQWEsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLEVBQUU7QUFDN0MsT0FBTSxrQkFBa0IsR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBQzFELE9BQUksa0JBQWtCLEtBQUssQ0FBQyxDQUFDLEVBQUU7QUFDOUIsV0FBTyxrQkFBa0IsQ0FBQztJQUMxQjtHQUNEOztBQUVELE9BQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQ3hDLE9BQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0dBQ25DO0FBQ0QsU0FBTyxJQUFJLENBQUM7RUFDWjs7QUFFRCxZQUFXLEVBQUMscUJBQUMsT0FBTyxFQUFFLFVBQVUsRUFBRSxhQUFhLEVBQUU7OztBQUM5QyxNQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLGlCQUFpQixDQUFDO0FBQzlDLE1BQUksSUFBSSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLFVBQVUsRUFBRSxhQUFhLENBQUMsQ0FBQztBQUMvRCxNQUFJLENBQUMsSUFBSSxFQUFFO0FBQ1YsVUFBTyxJQUFJLENBQUM7R0FDWjs7QUFFRCxTQUNJO0FBQUMsV0FBUTs7R0FDUDs7TUFBSyxHQUFHLEVBQUUsVUFBQSxHQUFHO2FBQUksT0FBSyxhQUFhLEdBQUcsR0FBRztNQUFBLEFBQUMsRUFBQyxTQUFTLEVBQUMsbUJBQW1CLEVBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsa0JBQWtCLEFBQUM7SUFDNUc7O09BQUssR0FBRyxFQUFFLFVBQUEsR0FBRztjQUFJLE9BQUssSUFBSSxHQUFHLEdBQUc7T0FBQSxBQUFDLEVBQUMsSUFBSSxFQUFDLFNBQVMsRUFBQyxTQUFTLEVBQUMsYUFBYSxFQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsZUFBZSxHQUFHLE9BQU8sQUFBQztBQUN2RyxXQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLEFBQUM7QUFDNUIsY0FBUSxFQUFFLElBQUksQ0FBQyxnQkFBZ0IsQUFBQztBQUNoQyxpQkFBVyxFQUFFLElBQUksQ0FBQyxxQkFBcUIsQUFBQztLQUMxQyxJQUFJO0tBQ0Q7SUFDRjtHQUNHLENBQ2I7RUFDRjs7QUFFRCxPQUFNLEVBQUMsa0JBQUc7OztBQUNQLE1BQUksVUFBVSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUN4RCxNQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxVQUFVLEdBQUcsSUFBSSxDQUFDLENBQUM7QUFDbEYsTUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQzs7QUFFNUQsTUFBSSxNQUFNLEdBQUcsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sS0FBSyxTQUFTLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUM7QUFDNUYsTUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLElBQUksVUFBVSxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxFQUFFLE1BQU0sR0FBRyxLQUFLLENBQUM7QUFDdkcsTUFBTSxrQkFBa0IsR0FBRyxJQUFJLENBQUMsdUJBQXVCLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7O0FBRXZFLE1BQUksYUFBYSxHQUFHLElBQUksQ0FBQztBQUN6QixNQUFJLGtCQUFrQixLQUFLLElBQUksRUFBRTtBQUNoQyxnQkFBYSxHQUFHLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0dBQy9FLE1BQU07QUFDTixnQkFBYSxHQUFHLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDO0dBQzNDOztBQUVELE1BQUksU0FBUyxHQUFHLDZCQUFXLFFBQVEsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsRUFBRTtBQUMxRCxrQkFBZSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSztBQUNqQyxtQkFBZ0IsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSztBQUNuQyxnQkFBYSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUTtBQUNsQyxlQUFZLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTO0FBQ2xDLGVBQVksRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVM7QUFDbEMsWUFBUyxFQUFFLE1BQU07QUFDakIsc0JBQW1CLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxlQUFlO0FBQy9DLGtCQUFlLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVO0FBQ3RDLGNBQVcsRUFBRSxVQUFVLENBQUMsTUFBTTtHQUM5QixDQUFDLENBQUM7O0FBRUgsTUFBSSxhQUFhLEdBQUcsSUFBSSxDQUFDO0FBQ3pCLE1BQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLElBQ25CLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLElBQ3BCLFVBQVUsQ0FBQyxNQUFNLElBQ2pCLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLElBQ3RCLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxJQUNwQixJQUFJLENBQUMsS0FBSyxDQUFDLGdCQUFnQixFQUFFO0FBQzdCLGdCQUFhLEdBQ1o7O01BQU0sRUFBRSxFQUFFLElBQUksQ0FBQyxlQUFlLEdBQUcsMkJBQTJCLEFBQUMsRUFBQyxTQUFTLEVBQUMsa0JBQWtCLEVBQUMsYUFBVSxXQUFXO0lBQzlHLElBQUksQ0FBQyxLQUFLLENBQUMsd0JBQXdCLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxVQUFVLENBQUMsVUFBVSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ3pHLEFBQ1AsQ0FBQztHQUNGOztBQUVELFNBQ0M7O0tBQUssR0FBRyxFQUFFLFVBQUEsR0FBRztZQUFJLE9BQUssT0FBTyxHQUFHLEdBQUc7S0FBQSxBQUFDO0FBQ2xDLGFBQVMsRUFBRSxTQUFTLEFBQUM7QUFDckIsU0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxBQUFDO0dBQy9CLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxVQUFVLENBQUM7R0FDbkM7O01BQUssR0FBRyxFQUFFLFVBQUEsR0FBRzthQUFJLE9BQUssT0FBTyxHQUFHLEdBQUc7TUFBQSxBQUFDO0FBQ25DLGNBQVMsRUFBQyxnQkFBZ0I7QUFDMUIsVUFBSyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxBQUFDO0FBQ3hCLGNBQVMsRUFBRSxJQUFJLENBQUMsYUFBYSxBQUFDO0FBQzlCLGdCQUFXLEVBQUUsSUFBSSxDQUFDLGVBQWUsQUFBQztBQUNsQyxlQUFVLEVBQUUsSUFBSSxDQUFDLGNBQWMsQUFBQztBQUNoQyxpQkFBWSxFQUFFLElBQUksQ0FBQyxnQkFBZ0IsQUFBQztBQUNwQyxnQkFBVyxFQUFFLElBQUksQ0FBQyxlQUFlLEFBQUM7O0lBRWxDOztPQUFNLFNBQVMsRUFBQyw0QkFBNEIsRUFBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLGVBQWUsR0FBRyxRQUFRLEFBQUM7S0FDL0UsSUFBSSxDQUFDLFdBQVcsQ0FBQyxVQUFVLEVBQUUsTUFBTSxDQUFDO0tBQ3BDLElBQUksQ0FBQyxXQUFXLENBQUMsVUFBVSxFQUFFLGtCQUFrQixDQUFDO0tBQzNDO0lBQ04sYUFBYTtJQUNiLElBQUksQ0FBQyxhQUFhLEVBQUU7SUFDcEIsSUFBSSxDQUFDLFdBQVcsRUFBRTtJQUNsQixJQUFJLENBQUMsV0FBVyxFQUFFO0lBQ2Q7R0FDTCxNQUFNLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxVQUFVLEdBQUcsSUFBSSxFQUFFLGFBQWEsQ0FBQyxHQUFHLElBQUk7R0FDM0YsQ0FDTDtFQUNGOztDQUVELENBQUMsQ0FBQzs7cUJBRVksTUFBTSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuXG5pbXBvcnQgU2VsZWN0IGZyb20gJy4vU2VsZWN0JztcbmltcG9ydCBzdHJpcERpYWNyaXRpY3MgZnJvbSAnLi91dGlscy9zdHJpcERpYWNyaXRpY3MnO1xuXG5sZXQgcmVxdWVzdElkID0gMDtcblxuZnVuY3Rpb24gaW5pdENhY2hlIChjYWNoZSkge1xuXHRpZiAoY2FjaGUgJiYgdHlwZW9mIGNhY2hlICE9PSAnb2JqZWN0Jykge1xuXHRcdGNhY2hlID0ge307XG5cdH1cblx0cmV0dXJuIGNhY2hlID8gY2FjaGUgOiBudWxsO1xufVxuXG5mdW5jdGlvbiB1cGRhdGVDYWNoZSAoY2FjaGUsIGlucHV0LCBkYXRhKSB7XG5cdGlmICghY2FjaGUpIHJldHVybjtcblx0Y2FjaGVbaW5wdXRdID0gZGF0YTtcbn1cblxuZnVuY3Rpb24gZ2V0RnJvbUNhY2hlIChjYWNoZSwgaW5wdXQpIHtcblx0aWYgKCFjYWNoZSkgcmV0dXJuO1xuXHRmb3IgKGxldCBpID0gaW5wdXQubGVuZ3RoOyBpID49IDA7IC0taSkge1xuXHRcdGxldCBjYWNoZUtleSA9IGlucHV0LnNsaWNlKDAsIGkpO1xuXHRcdGlmIChjYWNoZVtjYWNoZUtleV0gJiYgKGlucHV0ID09PSBjYWNoZUtleSB8fCBjYWNoZVtjYWNoZUtleV0uY29tcGxldGUpKSB7XG5cdFx0XHRyZXR1cm4gY2FjaGVbY2FjaGVLZXldO1xuXHRcdH1cblx0fVxufVxuXG5mdW5jdGlvbiB0aGVuUHJvbWlzZSAocHJvbWlzZSwgY2FsbGJhY2spIHtcblx0aWYgKCFwcm9taXNlIHx8IHR5cGVvZiBwcm9taXNlLnRoZW4gIT09ICdmdW5jdGlvbicpIHJldHVybjtcblx0cmV0dXJuIHByb21pc2UudGhlbigoZGF0YSkgPT4ge1xuXHRcdGNhbGxiYWNrKG51bGwsIGRhdGEpO1xuXHR9LCAoZXJyKSA9PiB7XG5cdFx0Y2FsbGJhY2soZXJyKTtcblx0fSk7XG59XG5cbmNvbnN0IHN0cmluZ09yTm9kZSA9IFJlYWN0LlByb3BUeXBlcy5vbmVPZlR5cGUoW1xuXHRSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuXHRSZWFjdC5Qcm9wVHlwZXMubm9kZVxuXSk7XG5cbmNvbnN0IEFzeW5jID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXHRwcm9wVHlwZXM6IHtcblx0XHRjYWNoZTogUmVhY3QuUHJvcFR5cGVzLmFueSwgICAgICAgICAgICAgICAgICAgICAvLyBvYmplY3QgdG8gdXNlIHRvIGNhY2hlIHJlc3VsdHMsIGNhbiBiZSBudWxsIHRvIGRpc2FibGUgY2FjaGVcblx0XHRjaGlsZHJlbjogUmVhY3QuUHJvcFR5cGVzLmZ1bmMsXHRcdFx0XHRcdFx0XHRcdFx0Ly8gQ2hpbGQgZnVuY3Rpb24gcmVzcG9uc2libGUgZm9yIGNyZWF0aW5nIHRoZSBpbm5lciBTZWxlY3QgY29tcG9uZW50OyAocHJvcHM6IE9iamVjdCk6IFByb3BUeXBlcy5lbGVtZW50XG5cdFx0aWdub3JlQWNjZW50czogUmVhY3QuUHJvcFR5cGVzLmJvb2wsICAgICAgICAgICAgLy8gd2hldGhlciB0byBzdHJpcCBkaWFjcml0aWNzIHdoZW4gZmlsdGVyaW5nIChzaGFyZWQgd2l0aCBTZWxlY3QpXG5cdFx0aWdub3JlQ2FzZTogUmVhY3QuUHJvcFR5cGVzLmJvb2wsICAgICAgICAgICAgICAgLy8gd2hldGhlciB0byBwZXJmb3JtIGNhc2UtaW5zZW5zaXRpdmUgZmlsdGVyaW5nIChzaGFyZWQgd2l0aCBTZWxlY3QpXG5cdFx0aXNMb2FkaW5nOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbCwgICAgICAgICAgICAgICAgLy8gb3ZlcnJpZGVzIHRoZSBpc0xvYWRpbmcgc3RhdGUgd2hlbiBzZXQgdG8gdHJ1ZVxuXHRcdGxvYWRPcHRpb25zOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLCAgIC8vIGZ1bmN0aW9uIHRvIGNhbGwgdG8gbG9hZCBvcHRpb25zIGFzeW5jaHJvbm91c2x5XG5cdFx0bG9hZGluZ1BsYWNlaG9sZGVyOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLCAgICAgLy8gcmVwbGFjZXMgdGhlIHBsYWNlaG9sZGVyIHdoaWxlIG9wdGlvbnMgYXJlIGxvYWRpbmdcblx0XHRtaW5pbXVtSW5wdXQ6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIsICAgICAgICAgICAvLyB0aGUgbWluaW11bSBudW1iZXIgb2YgY2hhcmFjdGVycyB0aGF0IHRyaWdnZXIgbG9hZE9wdGlvbnNcblx0XHRub1Jlc3VsdHNUZXh0OiBzdHJpbmdPck5vZGUsICAgICAgICAgICAgICAgICAgICAvLyBwbGFjZWhvbGRlciBkaXNwbGF5ZWQgd2hlbiB0aGVyZSBhcmUgbm8gbWF0Y2hpbmcgc2VhcmNoIHJlc3VsdHMgKHNoYXJlZCB3aXRoIFNlbGVjdClcblx0XHRvbklucHV0Q2hhbmdlOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYywgICAgICAgICAgICAvLyBvbklucHV0Q2hhbmdlIGhhbmRsZXI6IGZ1bmN0aW9uIChpbnB1dFZhbHVlKSB7fVxuXHRcdHBsYWNlaG9sZGVyOiBzdHJpbmdPck5vZGUsICAgICAgICAgICAgICAgICAgICAgIC8vIGZpZWxkIHBsYWNlaG9sZGVyLCBkaXNwbGF5ZWQgd2hlbiB0aGVyZSdzIG5vIHZhbHVlIChzaGFyZWQgd2l0aCBTZWxlY3QpXG5cdFx0c2VhcmNoUHJvbXB0VGV4dDogc3RyaW5nT3JOb2RlLCAgIFx0XHRcdFx0XHQgICAgLy8gbGFiZWwgdG8gcHJvbXB0IGZvciBzZWFyY2ggaW5wdXRcblx0XHRzZWFyY2hpbmdUZXh0OiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLCAgICAgICAgICAvLyBtZXNzYWdlIHRvIGRpc3BsYXkgd2hpbGUgb3B0aW9ucyBhcmUgbG9hZGluZ1xuXHR9LFxuXHRnZXREZWZhdWx0UHJvcHMgKCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRjYWNoZTogdHJ1ZSxcblx0XHRcdGlnbm9yZUFjY2VudHM6IHRydWUsXG5cdFx0XHRpZ25vcmVDYXNlOiB0cnVlLFxuXHRcdFx0bG9hZGluZ1BsYWNlaG9sZGVyOiAnTG9hZGluZy4uLicsXG5cdFx0XHRtaW5pbXVtSW5wdXQ6IDAsXG5cdFx0XHRzZWFyY2hpbmdUZXh0OiAnU2VhcmNoaW5nLi4uJyxcblx0XHRcdHNlYXJjaFByb21wdFRleHQ6ICdUeXBlIHRvIHNlYXJjaCcsXG5cdFx0fTtcblx0fSxcblx0Z2V0SW5pdGlhbFN0YXRlICgpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0Y2FjaGU6IGluaXRDYWNoZSh0aGlzLnByb3BzLmNhY2hlKSxcblx0XHRcdGlzTG9hZGluZzogZmFsc2UsXG5cdFx0XHRvcHRpb25zOiBbXSxcblx0XHR9O1xuXHR9LFxuXHRjb21wb25lbnRXaWxsTW91bnQgKCkge1xuXHRcdHRoaXMuX2xhc3RJbnB1dCA9ICcnO1xuXHR9LFxuXHRjb21wb25lbnREaWRNb3VudCAoKSB7XG5cdFx0dGhpcy5sb2FkT3B0aW9ucygnJyk7XG5cdH0sXG5cdGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMgKG5leHRQcm9wcykge1xuXHRcdGlmIChuZXh0UHJvcHMuY2FjaGUgIT09IHRoaXMucHJvcHMuY2FjaGUpIHtcblx0XHRcdHRoaXMuc2V0U3RhdGUoe1xuXHRcdFx0XHRjYWNoZTogaW5pdENhY2hlKG5leHRQcm9wcy5jYWNoZSksXG5cdFx0XHR9KTtcblx0XHR9XG5cdH0sXG5cdGZvY3VzICgpIHtcblx0XHR0aGlzLnNlbGVjdC5mb2N1cygpO1xuXHR9LFxuXHRyZXNldFN0YXRlICgpIHtcblx0XHR0aGlzLl9jdXJyZW50UmVxdWVzdElkID0gLTE7XG5cdFx0dGhpcy5zZXRTdGF0ZSh7XG5cdFx0XHRpc0xvYWRpbmc6IGZhbHNlLFxuXHRcdFx0b3B0aW9uczogW10sXG5cdFx0fSk7XG5cdH0sXG5cdGdldFJlc3BvbnNlSGFuZGxlciAoaW5wdXQpIHtcblx0XHRsZXQgX3JlcXVlc3RJZCA9IHRoaXMuX2N1cnJlbnRSZXF1ZXN0SWQgPSByZXF1ZXN0SWQrKztcblx0XHRyZXR1cm4gKGVyciwgZGF0YSkgPT4ge1xuXHRcdFx0aWYgKGVycikgdGhyb3cgZXJyO1xuXHRcdFx0aWYgKCF0aGlzLmlzTW91bnRlZCgpKSByZXR1cm47XG5cdFx0XHR1cGRhdGVDYWNoZSh0aGlzLnN0YXRlLmNhY2hlLCBpbnB1dCwgZGF0YSk7XG5cdFx0XHRpZiAoX3JlcXVlc3RJZCAhPT0gdGhpcy5fY3VycmVudFJlcXVlc3RJZCkgcmV0dXJuO1xuXHRcdFx0dGhpcy5zZXRTdGF0ZSh7XG5cdFx0XHRcdGlzTG9hZGluZzogZmFsc2UsXG5cdFx0XHRcdG9wdGlvbnM6IGRhdGEgJiYgZGF0YS5vcHRpb25zIHx8IFtdLFxuXHRcdFx0fSk7XG5cdFx0fTtcblx0fSxcblx0bG9hZE9wdGlvbnMgKGlucHV0KSB7XG5cdFx0aWYgKHRoaXMucHJvcHMub25JbnB1dENoYW5nZSkge1xuXHRcdFx0bGV0IG5leHRTdGF0ZSA9IHRoaXMucHJvcHMub25JbnB1dENoYW5nZShpbnB1dCk7XG5cdFx0XHQvLyBOb3RlOiAhPSB1c2VkIGRlbGliZXJhdGVseSBoZXJlIHRvIGNhdGNoIHVuZGVmaW5lZCBhbmQgbnVsbFxuXHRcdFx0aWYgKG5leHRTdGF0ZSAhPSBudWxsKSB7XG5cdFx0XHRcdGlucHV0ID0gJycgKyBuZXh0U3RhdGU7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmICh0aGlzLnByb3BzLmlnbm9yZUFjY2VudHMpIGlucHV0ID0gc3RyaXBEaWFjcml0aWNzKGlucHV0KTtcblx0XHRpZiAodGhpcy5wcm9wcy5pZ25vcmVDYXNlKSBpbnB1dCA9IGlucHV0LnRvTG93ZXJDYXNlKCk7XG5cblx0XHR0aGlzLl9sYXN0SW5wdXQgPSBpbnB1dDtcblx0XHRpZiAoaW5wdXQubGVuZ3RoIDwgdGhpcy5wcm9wcy5taW5pbXVtSW5wdXQpIHtcblx0XHRcdHJldHVybiB0aGlzLnJlc2V0U3RhdGUoKTtcblx0XHR9XG5cdFx0bGV0IGNhY2hlUmVzdWx0ID0gZ2V0RnJvbUNhY2hlKHRoaXMuc3RhdGUuY2FjaGUsIGlucHV0KTtcblx0XHRpZiAoY2FjaGVSZXN1bHQgJiYgQXJyYXkuaXNBcnJheShjYWNoZVJlc3VsdC5vcHRpb25zKSkge1xuXHRcdFx0cmV0dXJuIHRoaXMuc2V0U3RhdGUoe1xuXHRcdFx0XHRvcHRpb25zOiBjYWNoZVJlc3VsdC5vcHRpb25zLFxuXHRcdFx0fSk7XG5cdFx0fVxuXHRcdHRoaXMuc2V0U3RhdGUoe1xuXHRcdFx0aXNMb2FkaW5nOiB0cnVlLFxuXHRcdH0pO1xuXHRcdGxldCByZXNwb25zZUhhbmRsZXIgPSB0aGlzLmdldFJlc3BvbnNlSGFuZGxlcihpbnB1dCk7XG5cdFx0bGV0IGlucHV0UHJvbWlzZSA9IHRoZW5Qcm9taXNlKHRoaXMucHJvcHMubG9hZE9wdGlvbnMoaW5wdXQsIHJlc3BvbnNlSGFuZGxlciksIHJlc3BvbnNlSGFuZGxlcik7XG5cdFx0cmV0dXJuIGlucHV0UHJvbWlzZSA/IGlucHV0UHJvbWlzZS50aGVuKCgpID0+IHtcblx0XHRcdHJldHVybiBpbnB1dDtcblx0XHR9KSA6IGlucHV0O1xuXHR9LFxuXHRyZW5kZXIgKCkge1xuXHRcdGxldCB7XG5cdFx0XHRjaGlsZHJlbiA9IGRlZmF1bHRDaGlsZHJlbixcblx0XHRcdG5vUmVzdWx0c1RleHQsXG5cdFx0XHQuLi5yZXN0UHJvcHNcblx0XHR9ID0gdGhpcy5wcm9wcztcblx0XHRsZXQgeyBpc0xvYWRpbmcsIG9wdGlvbnMgfSA9IHRoaXMuc3RhdGU7XG5cdFx0aWYgKHRoaXMucHJvcHMuaXNMb2FkaW5nKSBpc0xvYWRpbmcgPSB0cnVlO1xuXHRcdGxldCBwbGFjZWhvbGRlciA9IGlzTG9hZGluZyA/IHRoaXMucHJvcHMubG9hZGluZ1BsYWNlaG9sZGVyIDogdGhpcy5wcm9wcy5wbGFjZWhvbGRlcjtcblx0XHRpZiAoaXNMb2FkaW5nKSB7XG5cdFx0XHRub1Jlc3VsdHNUZXh0ID0gdGhpcy5wcm9wcy5zZWFyY2hpbmdUZXh0O1xuXHRcdH0gZWxzZSBpZiAoIW9wdGlvbnMubGVuZ3RoICYmIHRoaXMuX2xhc3RJbnB1dC5sZW5ndGggPCB0aGlzLnByb3BzLm1pbmltdW1JbnB1dCkge1xuXHRcdFx0bm9SZXN1bHRzVGV4dCA9IHRoaXMucHJvcHMuc2VhcmNoUHJvbXB0VGV4dDtcblx0XHR9XG5cblx0XHRjb25zdCBwcm9wcyA9IHtcblx0XHRcdC4uLnJlc3RQcm9wcyxcblx0XHRcdGlzTG9hZGluZyxcblx0XHRcdG5vUmVzdWx0c1RleHQsXG5cdFx0XHRvbklucHV0Q2hhbmdlOiB0aGlzLmxvYWRPcHRpb25zLFxuXHRcdFx0b3B0aW9ucyxcblx0XHRcdHBsYWNlaG9sZGVyLFxuXHRcdFx0cmVmOiAocmVmKSA9PiB7XG5cdFx0XHRcdHRoaXMuc2VsZWN0ID0gcmVmO1xuXHRcdFx0fVxuXHRcdH07XG5cblx0XHRyZXR1cm4gY2hpbGRyZW4ocHJvcHMpO1xuXHR9XG59KTtcblxuZnVuY3Rpb24gZGVmYXVsdENoaWxkcmVuIChwcm9wcykge1xuXHRyZXR1cm4gKFxuXHRcdDxTZWxlY3Qgey4uLnByb3BzfSAvPlxuXHQpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBBc3luYztcbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgU2VsZWN0IGZyb20gJy4vU2VsZWN0JztcblxuY29uc3QgQXN5bmNDcmVhdGFibGUgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cdGRpc3BsYXlOYW1lOiAnQXN5bmNDcmVhdGFibGVTZWxlY3QnLFxuXG5cdHJlbmRlciAoKSB7XG5cdFx0cmV0dXJuIChcblx0XHRcdDxTZWxlY3QuQXN5bmMgey4uLnRoaXMucHJvcHN9PlxuXHRcdFx0XHR7KGFzeW5jUHJvcHMpID0+IChcblx0XHRcdFx0XHQ8U2VsZWN0LkNyZWF0YWJsZSB7Li4udGhpcy5wcm9wc30+XG5cdFx0XHRcdFx0XHR7KGNyZWF0YWJsZVByb3BzKSA9PiAoXG5cdFx0XHRcdFx0XHRcdDxTZWxlY3Rcblx0XHRcdFx0XHRcdFx0XHR7Li4uYXN5bmNQcm9wc31cblx0XHRcdFx0XHRcdFx0XHR7Li4uY3JlYXRhYmxlUHJvcHN9XG5cdFx0XHRcdFx0XHRcdFx0b25JbnB1dENoYW5nZT17KGlucHV0KSA9PiB7XG5cdFx0XHRcdFx0XHRcdFx0XHRjcmVhdGFibGVQcm9wcy5vbklucHV0Q2hhbmdlKGlucHV0KTtcblx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiBhc3luY1Byb3BzLm9uSW5wdXRDaGFuZ2UoaW5wdXQpO1xuXHRcdFx0XHRcdFx0XHRcdH19XG5cdFx0XHRcdFx0XHRcdFx0cmVmPXsocmVmKSA9PiB7XG5cdFx0XHRcdFx0XHRcdFx0XHRjcmVhdGFibGVQcm9wcy5yZWYocmVmKTtcblx0XHRcdFx0XHRcdFx0XHRcdGFzeW5jUHJvcHMucmVmKHJlZik7XG5cdFx0XHRcdFx0XHRcdFx0fX1cblx0XHRcdFx0XHRcdFx0Lz5cblx0XHRcdFx0XHRcdCl9XG5cdFx0XHRcdFx0PC9TZWxlY3QuQ3JlYXRhYmxlPlxuXHRcdFx0XHQpfVxuXHRcdFx0PC9TZWxlY3QuQXN5bmM+XG5cdFx0KTtcblx0fVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gQXN5bmNDcmVhdGFibGU7XG4iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFNlbGVjdCBmcm9tICcuL1NlbGVjdCc7XG5pbXBvcnQgZGVmYXVsdEZpbHRlck9wdGlvbnMgZnJvbSAnLi91dGlscy9kZWZhdWx0RmlsdGVyT3B0aW9ucyc7XG5pbXBvcnQgZGVmYXVsdE1lbnVSZW5kZXJlciBmcm9tICcuL3V0aWxzL2RlZmF1bHRNZW51UmVuZGVyZXInO1xuXG5jb25zdCBDcmVhdGFibGUgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cdGRpc3BsYXlOYW1lOiAnQ3JlYXRhYmxlU2VsZWN0JyxcblxuXHRwcm9wVHlwZXM6IHtcblx0XHQvLyBDaGlsZCBmdW5jdGlvbiByZXNwb25zaWJsZSBmb3IgY3JlYXRpbmcgdGhlIGlubmVyIFNlbGVjdCBjb21wb25lbnRcblx0XHQvLyBUaGlzIGNvbXBvbmVudCBjYW4gYmUgdXNlZCB0byBjb21wb3NlIEhPQ3MgKGVnIENyZWF0YWJsZSBhbmQgQXN5bmMpXG5cdFx0Ly8gKHByb3BzOiBPYmplY3QpOiBQcm9wVHlwZXMuZWxlbWVudFxuXHRcdGNoaWxkcmVuOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYyxcblxuXHRcdC8vIFNlZSBTZWxlY3QucHJvcFR5cGVzLmZpbHRlck9wdGlvbnNcblx0XHRmaWx0ZXJPcHRpb25zOiBSZWFjdC5Qcm9wVHlwZXMuYW55LFxuXG5cdFx0Ly8gU2VhcmNoZXMgZm9yIGFueSBtYXRjaGluZyBvcHRpb24gd2l0aGluIHRoZSBzZXQgb2Ygb3B0aW9ucy5cblx0XHQvLyBUaGlzIGZ1bmN0aW9uIHByZXZlbnRzIGR1cGxpY2F0ZSBvcHRpb25zIGZyb20gYmVpbmcgY3JlYXRlZC5cblx0XHQvLyAoeyBvcHRpb246IE9iamVjdCwgb3B0aW9uczogQXJyYXksIGxhYmVsS2V5OiBzdHJpbmcsIHZhbHVlS2V5OiBzdHJpbmcgfSk6IGJvb2xlYW5cblx0XHRpc09wdGlvblVuaXF1ZTogUmVhY3QuUHJvcFR5cGVzLmZ1bmMsXG5cbiAgICAvLyBEZXRlcm1pbmVzIGlmIHRoZSBjdXJyZW50IGlucHV0IHRleHQgcmVwcmVzZW50cyBhIHZhbGlkIG9wdGlvbi5cbiAgICAvLyAoeyBsYWJlbDogc3RyaW5nIH0pOiBib29sZWFuXG4gICAgaXNWYWxpZE5ld09wdGlvbjogUmVhY3QuUHJvcFR5cGVzLmZ1bmMsXG5cblx0XHQvLyBTZWUgU2VsZWN0LnByb3BUeXBlcy5tZW51UmVuZGVyZXJcblx0XHRtZW51UmVuZGVyZXI6IFJlYWN0LlByb3BUeXBlcy5hbnksXG5cbiAgICAvLyBGYWN0b3J5IHRvIGNyZWF0ZSBuZXcgb3B0aW9uLlxuICAgIC8vICh7IGxhYmVsOiBzdHJpbmcsIGxhYmVsS2V5OiBzdHJpbmcsIHZhbHVlS2V5OiBzdHJpbmcgfSk6IE9iamVjdFxuXHRcdG5ld09wdGlvbkNyZWF0b3I6IFJlYWN0LlByb3BUeXBlcy5mdW5jLFxuXG5cdFx0Ly8gU2VlIFNlbGVjdC5wcm9wVHlwZXMub3B0aW9uc1xuXHRcdG9wdGlvbnM6IFJlYWN0LlByb3BUeXBlcy5hcnJheSxcblxuICAgIC8vIENyZWF0ZXMgcHJvbXB0L3BsYWNlaG9sZGVyIG9wdGlvbiB0ZXh0LlxuICAgIC8vIChmaWx0ZXJUZXh0OiBzdHJpbmcpOiBzdHJpbmdcblx0XHRwcm9tcHRUZXh0Q3JlYXRvcjogUmVhY3QuUHJvcFR5cGVzLmZ1bmMsXG5cblx0XHQvLyBEZWNpZGVzIGlmIGEga2V5RG93biBldmVudCAoZWcgaXRzIGBrZXlDb2RlYCkgc2hvdWxkIHJlc3VsdCBpbiB0aGUgY3JlYXRpb24gb2YgYSBuZXcgb3B0aW9uLlxuXHRcdHNob3VsZEtleURvd25FdmVudENyZWF0ZU5ld09wdGlvbjogUmVhY3QuUHJvcFR5cGVzLmZ1bmMsXG5cdH0sXG5cblx0Ly8gRGVmYXVsdCBwcm9wIG1ldGhvZHNcblx0c3RhdGljczoge1xuXHRcdGlzT3B0aW9uVW5pcXVlLFxuXHRcdGlzVmFsaWROZXdPcHRpb24sXG5cdFx0bmV3T3B0aW9uQ3JlYXRvcixcblx0XHRwcm9tcHRUZXh0Q3JlYXRvcixcblx0XHRzaG91bGRLZXlEb3duRXZlbnRDcmVhdGVOZXdPcHRpb25cblx0fSxcblxuXHRnZXREZWZhdWx0UHJvcHMgKCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRmaWx0ZXJPcHRpb25zOiBkZWZhdWx0RmlsdGVyT3B0aW9ucyxcblx0XHRcdGlzT3B0aW9uVW5pcXVlLFxuXHRcdFx0aXNWYWxpZE5ld09wdGlvbixcblx0XHRcdG1lbnVSZW5kZXJlcjogZGVmYXVsdE1lbnVSZW5kZXJlcixcblx0XHRcdG5ld09wdGlvbkNyZWF0b3IsXG5cdFx0XHRwcm9tcHRUZXh0Q3JlYXRvcixcblx0XHRcdHNob3VsZEtleURvd25FdmVudENyZWF0ZU5ld09wdGlvbixcblx0XHR9O1xuXHR9LFxuXG5cdGNyZWF0ZU5ld09wdGlvbiAoKSB7XG5cdFx0Y29uc3Qge1xuXHRcdFx0aXNWYWxpZE5ld09wdGlvbixcblx0XHRcdG5ld09wdGlvbkNyZWF0b3IsXG5cdFx0XHRvcHRpb25zID0gW10sXG5cdFx0XHRzaG91bGRLZXlEb3duRXZlbnRDcmVhdGVOZXdPcHRpb25cblx0XHR9ID0gdGhpcy5wcm9wcztcblxuXHRcdGlmIChpc1ZhbGlkTmV3T3B0aW9uKHsgbGFiZWw6IHRoaXMuaW5wdXRWYWx1ZSB9KSkge1xuXHRcdFx0Y29uc3Qgb3B0aW9uID0gbmV3T3B0aW9uQ3JlYXRvcih7IGxhYmVsOiB0aGlzLmlucHV0VmFsdWUsIGxhYmVsS2V5OiB0aGlzLmxhYmVsS2V5LCB2YWx1ZUtleTogdGhpcy52YWx1ZUtleSB9KTtcblx0XHRcdGNvbnN0IGlzT3B0aW9uVW5pcXVlID0gdGhpcy5pc09wdGlvblVuaXF1ZSh7IG9wdGlvbiB9KTtcblxuXHRcdFx0Ly8gRG9uJ3QgYWRkIHRoZSBzYW1lIG9wdGlvbiB0d2ljZS5cblx0XHRcdGlmIChpc09wdGlvblVuaXF1ZSkge1xuXHRcdFx0XHRvcHRpb25zLnVuc2hpZnQob3B0aW9uKTtcblxuXHRcdFx0XHR0aGlzLnNlbGVjdC5zZWxlY3RWYWx1ZShvcHRpb24pO1xuXHRcdFx0fVxuXHRcdH1cblx0fSxcblxuXHRmaWx0ZXJPcHRpb25zICguLi5wYXJhbXMpIHtcblx0XHRjb25zdCB7IGZpbHRlck9wdGlvbnMsIGlzVmFsaWROZXdPcHRpb24sIG9wdGlvbnMsIHByb21wdFRleHRDcmVhdG9yIH0gPSB0aGlzLnByb3BzO1xuXG5cdFx0Ly8gVFJJQ0tZIENoZWNrIGN1cnJlbnRseSBzZWxlY3RlZCBvcHRpb25zIGFzIHdlbGwuXG5cdFx0Ly8gRG9uJ3QgZGlzcGxheSBhIGNyZWF0ZS1wcm9tcHQgZm9yIGEgdmFsdWUgdGhhdCdzIHNlbGVjdGVkLlxuXHRcdC8vIFRoaXMgY292ZXJzIGFzeW5jIGVkZ2UtY2FzZXMgd2hlcmUgYSBuZXdseS1jcmVhdGVkIE9wdGlvbiBpc24ndCB5ZXQgaW4gdGhlIGFzeW5jLWxvYWRlZCBhcnJheS5cblx0XHRjb25zdCBleGNsdWRlT3B0aW9ucyA9IHBhcmFtc1syXSB8fCBbXTtcblxuXHRcdGNvbnN0IGZpbHRlcmVkT3B0aW9ucyA9IGZpbHRlck9wdGlvbnMoLi4ucGFyYW1zKSB8fCBbXTtcblxuXHRcdGlmIChpc1ZhbGlkTmV3T3B0aW9uKHsgbGFiZWw6IHRoaXMuaW5wdXRWYWx1ZSB9KSkge1xuXHRcdFx0Y29uc3QgeyBuZXdPcHRpb25DcmVhdG9yIH0gPSB0aGlzLnByb3BzO1xuXG5cdFx0XHRjb25zdCBvcHRpb24gPSBuZXdPcHRpb25DcmVhdG9yKHtcblx0XHRcdFx0bGFiZWw6IHRoaXMuaW5wdXRWYWx1ZSxcblx0XHRcdFx0bGFiZWxLZXk6IHRoaXMubGFiZWxLZXksXG5cdFx0XHRcdHZhbHVlS2V5OiB0aGlzLnZhbHVlS2V5XG5cdFx0XHR9KTtcblxuXHRcdFx0Ly8gVFJJQ0tZIENvbXBhcmUgdG8gYWxsIG9wdGlvbnMgKG5vdCBqdXN0IGZpbHRlcmVkIG9wdGlvbnMpIGluIGNhc2Ugb3B0aW9uIGhhcyBhbHJlYWR5IGJlZW4gc2VsZWN0ZWQpLlxuXHRcdFx0Ly8gRm9yIG11bHRpLXNlbGVjdHMsIHRoaXMgd291bGQgcmVtb3ZlIGl0IGZyb20gdGhlIGZpbHRlcmVkIGxpc3QuXG5cdFx0XHRjb25zdCBpc09wdGlvblVuaXF1ZSA9IHRoaXMuaXNPcHRpb25VbmlxdWUoe1xuXHRcdFx0XHRvcHRpb24sXG5cdFx0XHRcdG9wdGlvbnM6IGV4Y2x1ZGVPcHRpb25zLmNvbmNhdChmaWx0ZXJlZE9wdGlvbnMpXG5cdFx0XHR9KTtcblxuXHRcdFx0aWYgKGlzT3B0aW9uVW5pcXVlKSB7XG5cdFx0XHRcdGNvbnN0IHByb21wdCA9IHByb21wdFRleHRDcmVhdG9yKHRoaXMuaW5wdXRWYWx1ZSk7XG5cblx0XHRcdFx0dGhpcy5fY3JlYXRlUGxhY2Vob2xkZXJPcHRpb24gPSBuZXdPcHRpb25DcmVhdG9yKHtcblx0XHRcdFx0XHRsYWJlbDogcHJvbXB0LFxuXHRcdFx0XHRcdGxhYmVsS2V5OiB0aGlzLmxhYmVsS2V5LFxuXHRcdFx0XHRcdHZhbHVlS2V5OiB0aGlzLnZhbHVlS2V5XG5cdFx0XHRcdH0pO1xuXG5cdFx0XHRcdGZpbHRlcmVkT3B0aW9ucy51bnNoaWZ0KHRoaXMuX2NyZWF0ZVBsYWNlaG9sZGVyT3B0aW9uKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gZmlsdGVyZWRPcHRpb25zO1xuXHR9LFxuXG5cdGlzT3B0aW9uVW5pcXVlICh7XG5cdFx0b3B0aW9uLFxuXHRcdG9wdGlvbnNcblx0fSkge1xuXHRcdGNvbnN0IHsgaXNPcHRpb25VbmlxdWUgfSA9IHRoaXMucHJvcHM7XG5cblx0XHRvcHRpb25zID0gb3B0aW9ucyB8fCB0aGlzLnNlbGVjdC5maWx0ZXJGbGF0T3B0aW9ucygpO1xuXG5cdFx0cmV0dXJuIGlzT3B0aW9uVW5pcXVlKHtcblx0XHRcdGxhYmVsS2V5OiB0aGlzLmxhYmVsS2V5LFxuXHRcdFx0b3B0aW9uLFxuXHRcdFx0b3B0aW9ucyxcblx0XHRcdHZhbHVlS2V5OiB0aGlzLnZhbHVlS2V5XG5cdFx0fSk7XG5cdH0sXG5cblx0bWVudVJlbmRlcmVyIChwYXJhbXMpIHtcblx0XHRjb25zdCB7IG1lbnVSZW5kZXJlciB9ID0gdGhpcy5wcm9wcztcblxuXHRcdHJldHVybiBtZW51UmVuZGVyZXIoe1xuXHRcdFx0Li4ucGFyYW1zLFxuXHRcdFx0b25TZWxlY3Q6IHRoaXMub25PcHRpb25TZWxlY3Rcblx0XHR9KTtcblx0fSxcblxuXHRvbklucHV0Q2hhbmdlIChpbnB1dCkge1xuXHRcdC8vIFRoaXMgdmFsdWUgbWF5IGJlIG5lZWRlZCBpbiBiZXR3ZWVuIFNlbGVjdCBtb3VudHMgKHdoZW4gdGhpcy5zZWxlY3QgaXMgbnVsbClcblx0XHR0aGlzLmlucHV0VmFsdWUgPSBpbnB1dDtcblx0fSxcblxuXHRvbklucHV0S2V5RG93biAoZXZlbnQpIHtcblx0XHRjb25zdCB7IHNob3VsZEtleURvd25FdmVudENyZWF0ZU5ld09wdGlvbiB9ID0gdGhpcy5wcm9wcztcblx0XHRjb25zdCBmb2N1c2VkT3B0aW9uID0gdGhpcy5zZWxlY3QuZ2V0Rm9jdXNlZE9wdGlvbigpO1xuXG5cdFx0aWYgKFxuXHRcdFx0Zm9jdXNlZE9wdGlvbiAmJlxuXHRcdFx0Zm9jdXNlZE9wdGlvbiA9PT0gdGhpcy5fY3JlYXRlUGxhY2Vob2xkZXJPcHRpb24gJiZcblx0XHRcdHNob3VsZEtleURvd25FdmVudENyZWF0ZU5ld09wdGlvbih7IGtleUNvZGU6IGV2ZW50LmtleUNvZGUgfSlcblx0XHQpIHtcblx0XHRcdHRoaXMuY3JlYXRlTmV3T3B0aW9uKCk7XG5cblx0XHRcdC8vIFByZXZlbnQgZGVjb3JhdGVkIFNlbGVjdCBmcm9tIGRvaW5nIGFueXRoaW5nIGFkZGl0aW9uYWwgd2l0aCB0aGlzIGtleURvd24gZXZlbnRcblx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0fVxuXHR9LFxuXG5cdG9uT3B0aW9uU2VsZWN0IChvcHRpb24sIGV2ZW50KSB7XG5cdFx0aWYgKG9wdGlvbiA9PT0gdGhpcy5fY3JlYXRlUGxhY2Vob2xkZXJPcHRpb24pIHtcblx0XHRcdHRoaXMuY3JlYXRlTmV3T3B0aW9uKCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMuc2VsZWN0LnNlbGVjdFZhbHVlKG9wdGlvbik7XG5cdFx0fVxuXHR9LFxuXG5cdHJlbmRlciAoKSB7XG5cdFx0Y29uc3Qge1xuXHRcdFx0Y2hpbGRyZW4gPSBkZWZhdWx0Q2hpbGRyZW4sXG5cdFx0XHRuZXdPcHRpb25DcmVhdG9yLFxuXHRcdFx0c2hvdWxkS2V5RG93bkV2ZW50Q3JlYXRlTmV3T3B0aW9uLFxuXHRcdFx0Li4ucmVzdFByb3BzXG5cdFx0fSA9IHRoaXMucHJvcHM7XG5cblx0XHRjb25zdCBwcm9wcyA9IHtcblx0XHRcdC4uLnJlc3RQcm9wcyxcblx0XHRcdGFsbG93Q3JlYXRlOiB0cnVlLFxuXHRcdFx0ZmlsdGVyT3B0aW9uczogdGhpcy5maWx0ZXJPcHRpb25zLFxuXHRcdFx0bWVudVJlbmRlcmVyOiB0aGlzLm1lbnVSZW5kZXJlcixcblx0XHRcdG9uSW5wdXRDaGFuZ2U6IHRoaXMub25JbnB1dENoYW5nZSxcblx0XHRcdG9uSW5wdXRLZXlEb3duOiB0aGlzLm9uSW5wdXRLZXlEb3duLFxuXHRcdFx0cmVmOiAocmVmKSA9PiB7XG5cdFx0XHRcdHRoaXMuc2VsZWN0ID0gcmVmO1xuXG5cdFx0XHRcdC8vIFRoZXNlIHZhbHVlcyBtYXkgYmUgbmVlZGVkIGluIGJldHdlZW4gU2VsZWN0IG1vdW50cyAod2hlbiB0aGlzLnNlbGVjdCBpcyBudWxsKVxuXHRcdFx0XHRpZiAocmVmKSB7XG5cdFx0XHRcdFx0dGhpcy5sYWJlbEtleSA9IHJlZi5wcm9wcy5sYWJlbEtleTtcblx0XHRcdFx0XHR0aGlzLnZhbHVlS2V5ID0gcmVmLnByb3BzLnZhbHVlS2V5O1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fTtcblxuXHRcdHJldHVybiBjaGlsZHJlbihwcm9wcyk7XG5cdH1cbn0pO1xuXG5mdW5jdGlvbiBkZWZhdWx0Q2hpbGRyZW4gKHByb3BzKSB7XG5cdHJldHVybiAoXG5cdFx0PFNlbGVjdCB7Li4ucHJvcHN9IC8+XG5cdCk7XG59O1xuXG5mdW5jdGlvbiBpc09wdGlvblVuaXF1ZSAoeyBvcHRpb24sIG9wdGlvbnMsIGxhYmVsS2V5LCB2YWx1ZUtleSB9KSB7XG5cdHJldHVybiBvcHRpb25zXG5cdFx0LmZpbHRlcigoZXhpc3RpbmdPcHRpb24pID0+XG5cdFx0XHRleGlzdGluZ09wdGlvbltsYWJlbEtleV0gPT09IG9wdGlvbltsYWJlbEtleV0gfHxcblx0XHRcdGV4aXN0aW5nT3B0aW9uW3ZhbHVlS2V5XSA9PT0gb3B0aW9uW3ZhbHVlS2V5XVxuXHRcdClcblx0XHQubGVuZ3RoID09PSAwO1xufTtcblxuZnVuY3Rpb24gaXNWYWxpZE5ld09wdGlvbiAoeyBsYWJlbCB9KSB7XG5cdHJldHVybiAhIWxhYmVsO1xufTtcblxuZnVuY3Rpb24gbmV3T3B0aW9uQ3JlYXRvciAoeyBsYWJlbCwgbGFiZWxLZXksIHZhbHVlS2V5IH0pIHtcblx0Y29uc3Qgb3B0aW9uID0ge307XG5cdG9wdGlvblt2YWx1ZUtleV0gPSBsYWJlbDtcbiBcdG9wdGlvbltsYWJlbEtleV0gPSBsYWJlbDtcbiBcdG9wdGlvbi5jbGFzc05hbWUgPSAnU2VsZWN0LWNyZWF0ZS1vcHRpb24tcGxhY2Vob2xkZXInO1xuIFx0cmV0dXJuIG9wdGlvbjtcbn07XG5cbmZ1bmN0aW9uIHByb21wdFRleHRDcmVhdG9yIChsYWJlbCkge1xuXHRyZXR1cm4gYENyZWF0ZSBvcHRpb24gXCIke2xhYmVsfVwiYDtcbn1cblxuZnVuY3Rpb24gc2hvdWxkS2V5RG93bkV2ZW50Q3JlYXRlTmV3T3B0aW9uICh7IGtleUNvZGUgfSkge1xuXHRzd2l0Y2ggKGtleUNvZGUpIHtcblx0XHRjYXNlIDk6ICAgLy8gVEFCXG5cdFx0Y2FzZSAxMzogIC8vIEVOVEVSXG5cdFx0Y2FzZSAxODg6IC8vIENPTU1BXG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXG5cdHJldHVybiBmYWxzZTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQ3JlYXRhYmxlO1xuIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcblxuY29uc3QgRHJvcGRvd24gPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIHByb3BUeXBlczoge1xuICAgIGNoaWxkcmVuOiBSZWFjdC5Qcm9wVHlwZXMubm9kZSxcbiAgfSxcbiAgcmVuZGVyICgpIHtcbiAgICAvLyBUaGlzIGNvbXBvbmVudCBhZGRzIG5vIG1hcmt1cFxuICAgIHJldHVybiB0aGlzLnByb3BzLmNoaWxkcmVuO1xuICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBEcm9wZG93bjtcbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgY2xhc3NOYW1lcyBmcm9tICdjbGFzc25hbWVzJztcblxuY29uc3QgT3B0aW9uID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXHRwcm9wVHlwZXM6IHtcblx0XHRjaGlsZHJlbjogUmVhY3QuUHJvcFR5cGVzLm5vZGUsXG5cdFx0Y2xhc3NOYW1lOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLCAgICAgICAgICAgICAvLyBjbGFzc05hbWUgKGJhc2VkIG9uIG1vdXNlIHBvc2l0aW9uKVxuXHRcdGluc3RhbmNlUHJlZml4OiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsICAvLyB1bmlxdWUgcHJlZml4IGZvciB0aGUgaWRzICh1c2VkIGZvciBhcmlhKVxuXHRcdGlzRGlzYWJsZWQ6IFJlYWN0LlByb3BUeXBlcy5ib29sLCAgICAgICAgICAgICAgLy8gdGhlIG9wdGlvbiBpcyBkaXNhYmxlZFxuXHRcdGlzRm9jdXNlZDogUmVhY3QuUHJvcFR5cGVzLmJvb2wsICAgICAgICAgICAgICAgLy8gdGhlIG9wdGlvbiBpcyBmb2N1c2VkXG5cdFx0aXNTZWxlY3RlZDogUmVhY3QuUHJvcFR5cGVzLmJvb2wsICAgICAgICAgICAgICAvLyB0aGUgb3B0aW9uIGlzIHNlbGVjdGVkXG5cdFx0b25Gb2N1czogUmVhY3QuUHJvcFR5cGVzLmZ1bmMsICAgICAgICAgICAgICAgICAvLyBtZXRob2QgdG8gaGFuZGxlIG1vdXNlRW50ZXIgb24gb3B0aW9uIGVsZW1lbnRcblx0XHRvblNlbGVjdDogUmVhY3QuUHJvcFR5cGVzLmZ1bmMsICAgICAgICAgICAgICAgIC8vIG1ldGhvZCB0byBoYW5kbGUgY2xpY2sgb24gb3B0aW9uIGVsZW1lbnRcblx0XHRvblVuZm9jdXM6IFJlYWN0LlByb3BUeXBlcy5mdW5jLCAgICAgICAgICAgICAgIC8vIG1ldGhvZCB0byBoYW5kbGUgbW91c2VMZWF2ZSBvbiBvcHRpb24gZWxlbWVudFxuXHRcdG9wdGlvbjogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLCAgICAgLy8gb2JqZWN0IHRoYXQgaXMgYmFzZSBmb3IgdGhhdCBvcHRpb25cblx0XHRvcHRpb25JbmRleDogUmVhY3QuUHJvcFR5cGVzLm51bWJlciwgICAgICAgICAgIC8vIGluZGV4IG9mIHRoZSBvcHRpb24sIHVzZWQgdG8gZ2VuZXJhdGUgdW5pcXVlIGlkcyBmb3IgYXJpYVxuXHR9LFxuXHRibG9ja0V2ZW50IChldmVudCkge1xuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdFx0aWYgKChldmVudC50YXJnZXQudGFnTmFtZSAhPT0gJ0EnKSB8fCAhKCdocmVmJyBpbiBldmVudC50YXJnZXQpKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdGlmIChldmVudC50YXJnZXQudGFyZ2V0KSB7XG5cdFx0XHR3aW5kb3cub3BlbihldmVudC50YXJnZXQuaHJlZiwgZXZlbnQudGFyZ2V0LnRhcmdldCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gZXZlbnQudGFyZ2V0LmhyZWY7XG5cdFx0fVxuXHR9LFxuXG5cdGhhbmRsZU1vdXNlRG93biAoZXZlbnQpIHtcblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXHRcdHRoaXMucHJvcHMub25TZWxlY3QodGhpcy5wcm9wcy5vcHRpb24sIGV2ZW50KTtcblx0fSxcblxuXHRoYW5kbGVNb3VzZUVudGVyIChldmVudCkge1xuXHRcdHRoaXMub25Gb2N1cyhldmVudCk7XG5cdH0sXG5cblx0aGFuZGxlTW91c2VNb3ZlIChldmVudCkge1xuXHRcdHRoaXMub25Gb2N1cyhldmVudCk7XG5cdH0sXG5cblx0aGFuZGxlVG91Y2hFbmQoZXZlbnQpe1xuXHRcdC8vIENoZWNrIGlmIHRoZSB2aWV3IGlzIGJlaW5nIGRyYWdnZWQsIEluIHRoaXMgY2FzZVxuXHRcdC8vIHdlIGRvbid0IHdhbnQgdG8gZmlyZSB0aGUgY2xpY2sgZXZlbnQgKGJlY2F1c2UgdGhlIHVzZXIgb25seSB3YW50cyB0byBzY3JvbGwpXG5cdFx0aWYodGhpcy5kcmFnZ2luZykgcmV0dXJuO1xuXG5cdFx0dGhpcy5oYW5kbGVNb3VzZURvd24oZXZlbnQpO1xuXHR9LFxuXG5cdGhhbmRsZVRvdWNoTW92ZSAoZXZlbnQpIHtcblx0XHQvLyBTZXQgYSBmbGFnIHRoYXQgdGhlIHZpZXcgaXMgYmVpbmcgZHJhZ2dlZFxuXHRcdHRoaXMuZHJhZ2dpbmcgPSB0cnVlO1xuXHR9LFxuXG5cdGhhbmRsZVRvdWNoU3RhcnQgKGV2ZW50KSB7XG5cdFx0Ly8gU2V0IGEgZmxhZyB0aGF0IHRoZSB2aWV3IGlzIG5vdCBiZWluZyBkcmFnZ2VkXG5cdFx0dGhpcy5kcmFnZ2luZyA9IGZhbHNlO1xuXHR9LFxuXG5cdG9uRm9jdXMgKGV2ZW50KSB7XG5cdFx0aWYgKCF0aGlzLnByb3BzLmlzRm9jdXNlZCkge1xuXHRcdFx0dGhpcy5wcm9wcy5vbkZvY3VzKHRoaXMucHJvcHMub3B0aW9uLCBldmVudCk7XG5cdFx0fVxuXHR9LFxuXHRyZW5kZXIgKCkge1xuXHRcdHZhciB7IG9wdGlvbiwgaW5zdGFuY2VQcmVmaXgsIG9wdGlvbkluZGV4IH0gPSB0aGlzLnByb3BzO1xuXHRcdHZhciBjbGFzc05hbWUgPSBjbGFzc05hbWVzKHRoaXMucHJvcHMuY2xhc3NOYW1lLCBvcHRpb24uY2xhc3NOYW1lKTtcblxuXHRcdHJldHVybiBvcHRpb24uZGlzYWJsZWQgPyAoXG5cdFx0XHQ8ZGl2IGNsYXNzTmFtZT17Y2xhc3NOYW1lfVxuXHRcdFx0XHRvbk1vdXNlRG93bj17dGhpcy5ibG9ja0V2ZW50fVxuXHRcdFx0XHRvbkNsaWNrPXt0aGlzLmJsb2NrRXZlbnR9PlxuXHRcdFx0XHR7dGhpcy5wcm9wcy5jaGlsZHJlbn1cblx0XHRcdDwvZGl2PlxuXHRcdCkgOiAoXG5cdFx0XHQ8ZGl2IGNsYXNzTmFtZT17Y2xhc3NOYW1lfVxuXHRcdFx0XHRzdHlsZT17b3B0aW9uLnN0eWxlfVxuXHRcdFx0XHRyb2xlPVwib3B0aW9uXCJcblx0XHRcdFx0IG9uTW91c2VEb3duPXt0aGlzLmhhbmRsZU1vdXNlRG93bn1cblx0XHRcdFx0b25Nb3VzZUVudGVyPXt0aGlzLmhhbmRsZU1vdXNlRW50ZXJ9XG5cdFx0XHRcdG9uTW91c2VNb3ZlPXt0aGlzLmhhbmRsZU1vdXNlTW92ZX1cblx0XHRcdFx0b25Ub3VjaFN0YXJ0PXt0aGlzLmhhbmRsZVRvdWNoU3RhcnR9XG5cdFx0XHRcdG9uVG91Y2hNb3ZlPXt0aGlzLmhhbmRsZVRvdWNoTW92ZX1cblx0XHRcdFx0b25Ub3VjaEVuZD17dGhpcy5oYW5kbGVUb3VjaEVuZH1cblx0XHRcdFx0aWQ9e2luc3RhbmNlUHJlZml4ICsgJy1vcHRpb24tJyArIG9wdGlvbkluZGV4fVxuXHRcdFx0XHR0aXRsZT17b3B0aW9uLnRpdGxlfT5cblx0XHRcdFx0e3RoaXMucHJvcHMuY2hpbGRyZW59XG5cdFx0XHQ8L2Rpdj5cblx0XHQpO1xuXHR9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBPcHRpb247XG4iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IGNsYXNzTmFtZXMgZnJvbSAnY2xhc3NuYW1lcyc7XG5cbmNvbnN0IE9wdGlvbkdyb3VwID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXHRwcm9wVHlwZXM6IHtcblx0XHRjaGlsZHJlbjogUmVhY3QuUHJvcFR5cGVzLmFueSxcblx0XHRjbGFzc05hbWU6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsICAgICAgICAgIC8vIGNsYXNzTmFtZSAoYmFzZWQgb24gbW91c2UgcG9zaXRpb24pXG5cdFx0aXNEaXNhYmxlZDogUmVhY3QuUHJvcFR5cGVzLmJvb2wsICAgICAgICAgICAgICAvLyB0aGUgb3B0aW9uIGlzIGRpc2FibGVkXG5cdFx0aXNGb2N1c2VkOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbCxcdFx0XHRcdFx0XHQvLyBtZXRob2QgdG8gaGFuZGxlIG1vdXNlRW50ZXIgb24gb3B0aW9uIGdyb3VwIGxhYmVsIGVsZW1lbnRcblx0XHRpc0ZvY3VzZWQ6IFJlYWN0LlByb3BUeXBlcy5ib29sLCAgICAgICAgICAgIC8vIHRoZSBvcHRpb24gZ3JvdXAgaXMgZm9jdXNlZFxuXHRcdGlzU2VsZWN0ZWQ6IFJlYWN0LlByb3BUeXBlcy5ib29sLCAgICAgICAgICAgLy8gdGhlIG9wdGlvbiBncm91cCBpcyBzZWxlY3RlZFxuXHRcdGxhYmVsOiBSZWFjdC5Qcm9wVHlwZXMubm9kZSwgICAgICAgICAgICAgICAgLy8gdGhlIGhlYWRpbmcgdG8gc2hvdyBhYm92ZSB0aGUgY2hpbGQgb3B0aW9uc1xuXHRcdG9uRm9jdXM6IFJlYWN0LlByb3BUeXBlcy5mdW5jLFx0XHRcdFx0XHRcdCBcdC8vIHByb3ZpZGUgdGhlIG9uRm9jdXMgZnVuY3Rpb24gdG8gaGlnaGxpZ2h0IGlmIHNlbGVjdEdyb3VwXG5cdFx0b25TZWxlY3Q6IFJlYWN0LlByb3BUeXBlcy5mdW5jLFx0XHRcdFx0XHRcdFx0Ly8gcHJvdmlkZSB0aGUgb25TZWxlY3QgZnVuY3Rpb24gdG8gc2VsZWN0IGdyb3VwIGlmIHNlbGVjdEdyb3VwXG5cdFx0b3B0aW9uOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsICAvLyBvYmplY3QgdGhhdCBpcyBiYXNlIGZvciB0aGF0IG9wdGlvbiBncm91cFxuXHRcdHNlbGVjdEdyb3VwOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbCxcdFx0XHRcdCAgLy8gb3B0aW9uIHRvIGFsbG93IEdyb3VwcyB0byBiZSBzZWxlY3RlZFxuXHR9LFxuXG5cdGJsb2NrRXZlbnQgKGV2ZW50KSB7XG5cdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblx0XHRpZiAoKGV2ZW50LnRhcmdldC50YWdOYW1lICE9PSAnQScpIHx8ICEoJ2hyZWYnIGluIGV2ZW50LnRhcmdldCkpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0aWYgKGV2ZW50LnRhcmdldC50YXJnZXQpIHtcblx0XHRcdHdpbmRvdy5vcGVuKGV2ZW50LnRhcmdldC5ocmVmLCBldmVudC50YXJnZXQudGFyZ2V0KTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0d2luZG93LmxvY2F0aW9uLmhyZWYgPSBldmVudC50YXJnZXQuaHJlZjtcblx0XHR9XG5cdH0sXG5cblx0aGFuZGxlTW91c2VEb3duIChldmVudCkge1xuXHRcdGNvbnN0IHsgc2VsZWN0R3JvdXAgfSA9IHRoaXMucHJvcHM7XG5cdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblx0XHRpZiAoc2VsZWN0R3JvdXApIHRoaXMucHJvcHMub25TZWxlY3QodGhpcy5wcm9wcy5vcHRpb24sIGV2ZW50KTtcblx0fSxcblxuXHRoYW5kbGVNb3VzZUVudGVyIChldmVudCkge1xuXHRcdGNvbnN0IHsgc2VsZWN0R3JvdXAgfSA9IHRoaXMucHJvcHM7XG5cdFx0aWYgKHNlbGVjdEdyb3VwKSB0aGlzLm9uRm9jdXMoZXZlbnQpO1xuXHR9LFxuXG5cdGhhbmRsZU1vdXNlTW92ZSAoZXZlbnQpIHtcblx0XHRjb25zdCB7IHNlbGVjdEdyb3VwIH0gPSB0aGlzLnByb3BzO1xuXHRcdGlmIChzZWxlY3RHcm91cCkgdGhpcy5vbkZvY3VzKGV2ZW50KTtcblx0fSxcblxuXHRoYW5kbGVUb3VjaEVuZChldmVudCl7XG5cdFx0Ly8gQ2hlY2sgaWYgdGhlIHZpZXcgaXMgYmVpbmcgZHJhZ2dlZCwgSW4gdGhpcyBjYXNlXG5cdFx0Ly8gd2UgZG9uJ3Qgd2FudCB0byBmaXJlIHRoZSBjbGljayBldmVudCAoYmVjYXVzZSB0aGUgdXNlciBvbmx5IHdhbnRzIHRvIHNjcm9sbClcblx0XHRpZih0aGlzLmRyYWdnaW5nKSByZXR1cm47XG5cblx0XHR0aGlzLmhhbmRsZU1vdXNlRG93bihldmVudCk7XG5cdH0sXG5cblx0aGFuZGxlVG91Y2hNb3ZlIChldmVudCkge1xuXHRcdC8vIFNldCBhIGZsYWcgdGhhdCB0aGUgdmlldyBpcyBiZWluZyBkcmFnZ2VkXG5cdFx0dGhpcy5kcmFnZ2luZyA9IHRydWU7XG5cdH0sXG5cblx0aGFuZGxlVG91Y2hTdGFydCAoZXZlbnQpIHtcblx0XHQvLyBTZXQgYSBmbGFnIHRoYXQgdGhlIHZpZXcgaXMgbm90IGJlaW5nIGRyYWdnZWRcblx0XHR0aGlzLmRyYWdnaW5nID0gZmFsc2U7XG5cdH0sXG5cblx0b25Gb2N1cyAoZXZlbnQpIHtcblx0XHRpZiAoIXRoaXMucHJvcHMuaXNGb2N1c2VkKSB7XG5cdFx0XHR0aGlzLnByb3BzLm9uRm9jdXModGhpcy5wcm9wcy5vcHRpb24sIGV2ZW50KTtcblx0XHR9XG5cdH0sXG5cblx0cmVuZGVyICgpIHtcblx0XHR2YXIgeyBvcHRpb24sIHNlbGVjdEdyb3VwLCBpc0ZvY3VzZWQsIGlzRGlzYWJsZWQgfSA9IHRoaXMucHJvcHM7XG5cdFx0dmFyIGNsYXNzTmFtZSA9IGNsYXNzTmFtZXModGhpcy5wcm9wcy5jbGFzc05hbWUsIG9wdGlvbi5jbGFzc05hbWUpO1xuXG5cdFx0dmFyIGdyb3VwTGFiZWxDbGFzc05hbWUgPSBjbGFzc05hbWVzKHtcblx0XHRcdCdTZWxlY3Qtb3B0aW9uLWdyb3VwLWxhYmVsJzogIHRydWUsXG5cdFx0XHQnU2VsZWN0LW9wdGlvbi1ncm91cC1sYWJlbC1zZWxlY3RhYmxlJzogc2VsZWN0R3JvdXAsXG5cdFx0XHQnaXMtZm9jdXNlZCc6IGlzRm9jdXNlZCxcblx0XHRcdCdpcy1kaXNhYmxlZCc6IGlzRGlzYWJsZWQsXG5cdFx0fSk7XG5cblx0XHRyZXR1cm4gb3B0aW9uLmRpc2FibGVkID8gKFxuXHRcdFx0PGRpdiBjbGFzc05hbWU9e2NsYXNzTmFtZX1cblx0XHRcdFx0b25Nb3VzZURvd249e3RoaXMuYmxvY2tFdmVudH1cblx0XHRcdFx0b25DbGljaz17dGhpcy5ibG9ja0V2ZW50fT5cblx0XHRcdFx0e3RoaXMucHJvcHMuY2hpbGRyZW59XG5cdFx0XHQ8L2Rpdj5cblx0XHQpIDogKFxuXHRcdFx0PGRpdiBjbGFzc05hbWU9e2NsYXNzTmFtZX1cblx0XHRcdFx0c3R5bGU9e29wdGlvbi5zdHlsZX1cblx0XHRcdFx0b25Nb3VzZURvd249e3RoaXMuaGFuZGxlTW91c2VEb3dufVxuXG5cdFx0XHRcdG9uVG91Y2hTdGFydD17dGhpcy5oYW5kbGVUb3VjaFN0YXJ0fVxuXHRcdFx0XHRvblRvdWNoTW92ZT17dGhpcy5oYW5kbGVUb3VjaE1vdmV9XG5cdFx0XHRcdG9uVG91Y2hFbmQ9e3RoaXMuaGFuZGxlVG91Y2hFbmR9XG5cdFx0XHRcdHRpdGxlPXtvcHRpb24udGl0bGV9PlxuXHRcdFx0XHQ8ZGl2XG5cdFx0XHRcdFx0Y2xhc3NOYW1lPXtncm91cExhYmVsQ2xhc3NOYW1lfVxuXHRcdFx0XHRcdG9uTW91c2VFbnRlcj17dGhpcy5oYW5kbGVNb3VzZUVudGVyfVxuXHRcdFx0XHRcdG9uTW91c2VNb3ZlPXt0aGlzLmhhbmRsZU1vdXNlTW92ZX1cblx0XHRcdFx0PlxuXHRcdFx0XHRcdHt0aGlzLnByb3BzLmxhYmVsfVxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0e3RoaXMucHJvcHMuY2hpbGRyZW59XG5cdFx0XHQ8L2Rpdj5cblx0XHQpO1xuXHR9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBPcHRpb25Hcm91cDtcbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgY2xhc3NOYW1lcyBmcm9tICdjbGFzc25hbWVzJztcblxuY29uc3QgVmFsdWUgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cblx0ZGlzcGxheU5hbWU6ICdWYWx1ZScsXG5cblx0cHJvcFR5cGVzOiB7XG5cdFx0Y2hpbGRyZW46IFJlYWN0LlByb3BUeXBlcy5ub2RlLFxuXHRcdGRpc2FibGVkOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbCwgICAgICAgICAgICAgICAvLyBkaXNhYmxlZCBwcm9wIHBhc3NlZCB0byBSZWFjdFNlbGVjdFxuXHRcdGlkOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLCAgICAgICAgICAgICAgICAgICAvLyBVbmlxdWUgaWQgZm9yIHRoZSB2YWx1ZSAtIHVzZWQgZm9yIGFyaWFcblx0XHRvbkNsaWNrOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYywgICAgICAgICAgICAgICAgLy8gbWV0aG9kIHRvIGhhbmRsZSBjbGljayBvbiB2YWx1ZSBsYWJlbFxuXHRcdG9uUmVtb3ZlOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYywgICAgICAgICAgICAgICAvLyBtZXRob2QgdG8gaGFuZGxlIHJlbW92YWwgb2YgdGhlIHZhbHVlXG5cdFx0dmFsdWU6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCwgICAgIC8vIHRoZSBvcHRpb24gb2JqZWN0IGZvciB0aGlzIHZhbHVlXG5cdH0sXG5cblx0aGFuZGxlTW91c2VEb3duIChldmVudCkge1xuXHRcdGlmIChldmVudC50eXBlID09PSAnbW91c2Vkb3duJyAmJiBldmVudC5idXR0b24gIT09IDApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0aWYgKHRoaXMucHJvcHMub25DbGljaykge1xuXHRcdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdFx0XHR0aGlzLnByb3BzLm9uQ2xpY2sodGhpcy5wcm9wcy52YWx1ZSwgZXZlbnQpO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHRpZiAodGhpcy5wcm9wcy52YWx1ZS5ocmVmKSB7XG5cdFx0XHRldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblx0XHR9XG5cdH0sXG5cblx0b25SZW1vdmUgKGV2ZW50KSB7XG5cdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblx0XHR0aGlzLnByb3BzLm9uUmVtb3ZlKHRoaXMucHJvcHMudmFsdWUpO1xuXHR9LFxuXG5cdGhhbmRsZVRvdWNoRW5kUmVtb3ZlIChldmVudCl7XG5cdFx0Ly8gQ2hlY2sgaWYgdGhlIHZpZXcgaXMgYmVpbmcgZHJhZ2dlZCwgSW4gdGhpcyBjYXNlXG5cdFx0Ly8gd2UgZG9uJ3Qgd2FudCB0byBmaXJlIHRoZSBjbGljayBldmVudCAoYmVjYXVzZSB0aGUgdXNlciBvbmx5IHdhbnRzIHRvIHNjcm9sbClcblx0XHRpZih0aGlzLmRyYWdnaW5nKSByZXR1cm47XG5cblx0XHQvLyBGaXJlIHRoZSBtb3VzZSBldmVudHNcblx0XHR0aGlzLm9uUmVtb3ZlKGV2ZW50KTtcblx0fSxcblxuXHRoYW5kbGVUb3VjaE1vdmUgKGV2ZW50KSB7XG5cdFx0Ly8gU2V0IGEgZmxhZyB0aGF0IHRoZSB2aWV3IGlzIGJlaW5nIGRyYWdnZWRcblx0XHR0aGlzLmRyYWdnaW5nID0gdHJ1ZTtcblx0fSxcblxuXHRoYW5kbGVUb3VjaFN0YXJ0IChldmVudCkge1xuXHRcdC8vIFNldCBhIGZsYWcgdGhhdCB0aGUgdmlldyBpcyBub3QgYmVpbmcgZHJhZ2dlZFxuXHRcdHRoaXMuZHJhZ2dpbmcgPSBmYWxzZTtcblx0fSxcblxuXHRyZW5kZXJSZW1vdmVJY29uICgpIHtcblx0XHRpZiAodGhpcy5wcm9wcy5kaXNhYmxlZCB8fCAhdGhpcy5wcm9wcy5vblJlbW92ZSkgcmV0dXJuO1xuXHRcdHJldHVybiAoXG5cdFx0XHQ8c3BhbiBjbGFzc05hbWU9XCJTZWxlY3QtdmFsdWUtaWNvblwiXG5cdFx0XHRcdGFyaWEtaGlkZGVuPVwidHJ1ZVwiXG5cdFx0XHRcdG9uTW91c2VEb3duPXt0aGlzLm9uUmVtb3ZlfVxuXHRcdFx0XHRvblRvdWNoRW5kPXt0aGlzLmhhbmRsZVRvdWNoRW5kUmVtb3ZlfVxuXHRcdFx0XHRvblRvdWNoU3RhcnQ9e3RoaXMuaGFuZGxlVG91Y2hTdGFydH1cblx0XHRcdFx0b25Ub3VjaE1vdmU9e3RoaXMuaGFuZGxlVG91Y2hNb3ZlfT5cblx0XHRcdFx0JnRpbWVzO1xuXHRcdFx0PC9zcGFuPlxuXHRcdCk7XG5cdH0sXG5cblx0cmVuZGVyTGFiZWwgKCkge1xuXHRcdGxldCBjbGFzc05hbWUgPSAnU2VsZWN0LXZhbHVlLWxhYmVsJztcblx0XHRyZXR1cm4gdGhpcy5wcm9wcy5vbkNsaWNrIHx8IHRoaXMucHJvcHMudmFsdWUuaHJlZiA/IChcblx0XHRcdDxhIGNsYXNzTmFtZT17Y2xhc3NOYW1lfSBocmVmPXt0aGlzLnByb3BzLnZhbHVlLmhyZWZ9IHRhcmdldD17dGhpcy5wcm9wcy52YWx1ZS50YXJnZXR9IG9uTW91c2VEb3duPXt0aGlzLmhhbmRsZU1vdXNlRG93bn0gb25Ub3VjaEVuZD17dGhpcy5oYW5kbGVNb3VzZURvd259PlxuXHRcdFx0XHR7dGhpcy5wcm9wcy5jaGlsZHJlbn1cblx0XHRcdDwvYT5cblx0XHQpIDogKFxuXHRcdFx0PHNwYW4gY2xhc3NOYW1lPXtjbGFzc05hbWV9IHJvbGU9XCJvcHRpb25cIiBhcmlhLXNlbGVjdGVkPVwidHJ1ZVwiIGlkPXt0aGlzLnByb3BzLmlkfT5cblx0XHRcdFx0e3RoaXMucHJvcHMuY2hpbGRyZW59XG5cdFx0XHQ8L3NwYW4+XG5cdFx0KTtcblx0fSxcblxuXHRyZW5kZXIgKCkge1xuXHRcdHJldHVybiAoXG5cdFx0XHQ8ZGl2IGNsYXNzTmFtZT17Y2xhc3NOYW1lcygnU2VsZWN0LXZhbHVlJywgdGhpcy5wcm9wcy52YWx1ZS5jbGFzc05hbWUpfVxuXHRcdFx0XHRzdHlsZT17dGhpcy5wcm9wcy52YWx1ZS5zdHlsZX1cblx0XHRcdFx0dGl0bGU9e3RoaXMucHJvcHMudmFsdWUudGl0bGV9XG5cdFx0XHRcdD5cblx0XHRcdFx0e3RoaXMucmVuZGVyUmVtb3ZlSWNvbigpfVxuXHRcdFx0XHR7dGhpcy5yZW5kZXJMYWJlbCgpfVxuXHRcdFx0PC9kaXY+XG5cdFx0KTtcblx0fVxuXG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBWYWx1ZTtcbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGFycm93UmVuZGVyZXIgKHsgb25Nb3VzZURvd24gfSkge1xuXHRyZXR1cm4gKFxuXHRcdDxzcGFuXG5cdFx0XHRjbGFzc05hbWU9XCJTZWxlY3QtYXJyb3dcIlxuXHRcdFx0b25Nb3VzZURvd249e29uTW91c2VEb3dufVxuXHRcdC8+XG5cdCk7XG59O1xuIiwiaW1wb3J0IHN0cmlwRGlhY3JpdGljcyBmcm9tICcuL3N0cmlwRGlhY3JpdGljcyc7XG5cbmZ1bmN0aW9uIGZpbHRlck9wdGlvbnMgKG9wdGlvbnMsIGZpbHRlclZhbHVlLCBleGNsdWRlT3B0aW9ucywgcHJvcHMpIHtcblx0aWYgKHByb3BzLmlnbm9yZUFjY2VudHMpIHtcblx0XHRmaWx0ZXJWYWx1ZSA9IHN0cmlwRGlhY3JpdGljcyhmaWx0ZXJWYWx1ZSk7XG5cdH1cblxuXHRpZiAocHJvcHMuaWdub3JlQ2FzZSkge1xuXHRcdGZpbHRlclZhbHVlID0gZmlsdGVyVmFsdWUudG9Mb3dlckNhc2UoKTtcblx0fVxuXG5cdGlmIChleGNsdWRlT3B0aW9ucykgZXhjbHVkZU9wdGlvbnMgPSBleGNsdWRlT3B0aW9ucy5tYXAoaSA9PiBpW3Byb3BzLnZhbHVlS2V5XSk7XG5cblx0cmV0dXJuIG9wdGlvbnMuZmlsdGVyKG9wdGlvbiA9PiB7XG5cdFx0aWYgKGV4Y2x1ZGVPcHRpb25zICYmIGV4Y2x1ZGVPcHRpb25zLmluZGV4T2Yob3B0aW9uW3Byb3BzLnZhbHVlS2V5XSkgPiAtMSkge1xuXHRcdFx0aWYgKG9wdGlvbi5ncm91cCAmJiBwcm9wcy5zZWxlY3RHcm91cCkge1xuXHRcdFx0XHRvcHRpb24uZ3JvdXAub3B0aW9ucy5zcGxpY2Uob3B0aW9uKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cdFx0aWYgKHByb3BzLmZpbHRlck9wdGlvbikgcmV0dXJuIHByb3BzLmZpbHRlck9wdGlvbi5jYWxsKHRoaXMsIG9wdGlvbiwgZmlsdGVyVmFsdWUpO1xuXHRcdGlmICghZmlsdGVyVmFsdWUpIHJldHVybiB0cnVlO1xuXHRcdHZhciB2YWx1ZVRlc3QgPSBTdHJpbmcob3B0aW9uW3Byb3BzLnZhbHVlS2V5XSk7XG5cdFx0dmFyIGxhYmVsVGVzdCA9IFN0cmluZyhvcHRpb25bcHJvcHMubGFiZWxLZXldKTtcblx0XHRpZiAocHJvcHMuaWdub3JlQWNjZW50cykge1xuXHRcdFx0aWYgKHByb3BzLm1hdGNoUHJvcCAhPT0gJ2xhYmVsJykgdmFsdWVUZXN0ID0gc3RyaXBEaWFjcml0aWNzKHZhbHVlVGVzdCk7XG5cdFx0XHRpZiAocHJvcHMubWF0Y2hQcm9wICE9PSAndmFsdWUnKSBsYWJlbFRlc3QgPSBzdHJpcERpYWNyaXRpY3MobGFiZWxUZXN0KTtcblx0XHR9XG5cdFx0aWYgKHByb3BzLmlnbm9yZUNhc2UpIHtcblx0XHRcdGlmIChwcm9wcy5tYXRjaFByb3AgIT09ICdsYWJlbCcpIHZhbHVlVGVzdCA9IHZhbHVlVGVzdC50b0xvd2VyQ2FzZSgpO1xuXHRcdFx0aWYgKHByb3BzLm1hdGNoUHJvcCAhPT0gJ3ZhbHVlJykgbGFiZWxUZXN0ID0gbGFiZWxUZXN0LnRvTG93ZXJDYXNlKCk7XG5cdFx0fVxuXHRcdHJldHVybiBwcm9wcy5tYXRjaFBvcyA9PT0gJ3N0YXJ0JyA/IChcblx0XHRcdChwcm9wcy5tYXRjaFByb3AgIT09ICdsYWJlbCcgJiYgdmFsdWVUZXN0LnN1YnN0cigwLCBmaWx0ZXJWYWx1ZS5sZW5ndGgpID09PSBmaWx0ZXJWYWx1ZSkgfHxcblx0XHRcdChwcm9wcy5tYXRjaFByb3AgIT09ICd2YWx1ZScgJiYgbGFiZWxUZXN0LnN1YnN0cigwLCBmaWx0ZXJWYWx1ZS5sZW5ndGgpID09PSBmaWx0ZXJWYWx1ZSlcblx0XHQpIDogKFxuXHRcdFx0KHByb3BzLm1hdGNoUHJvcCAhPT0gJ2xhYmVsJyAmJiB2YWx1ZVRlc3QuaW5kZXhPZihmaWx0ZXJWYWx1ZSkgPj0gMCkgfHxcblx0XHRcdChwcm9wcy5tYXRjaFByb3AgIT09ICd2YWx1ZScgJiYgbGFiZWxUZXN0LmluZGV4T2YoZmlsdGVyVmFsdWUpID49IDApXG5cdFx0KTtcblx0fSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZmlsdGVyT3B0aW9ucztcbiIsImltcG9ydCBjbGFzc05hbWVzIGZyb20gJ2NsYXNzbmFtZXMnO1xuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcblxuZnVuY3Rpb24gaXNHcm91cCAob3B0aW9uKSB7XG5cdHJldHVybiBvcHRpb24gJiYgQXJyYXkuaXNBcnJheShvcHRpb24ub3B0aW9ucyk7XG59XG5cbmZ1bmN0aW9uIG1lbnVSZW5kZXJlciAoe1xuXHRmb2N1c2VkT3B0aW9uLFxuXHRzZWxlY3RHcm91cCxcblx0aW5zdGFuY2VQcmVmaXgsXG5cdGxhYmVsS2V5LFxuXHRvbkZvY3VzLFxuXHRvbk9wdGlvblJlZixcblx0b25TZWxlY3QsXG5cdG9wdGlvbkNsYXNzTmFtZSxcblx0b3B0aW9uQ29tcG9uZW50LFxuXHRvcHRpb25Hcm91cENvbXBvbmVudCxcblx0b3B0aW9uUmVuZGVyZXIsXG5cdG9wdGlvbnMsXG5cdHZhbHVlQXJyYXksXG5cdHZhbHVlS2V5LFxufSkge1xuXHRsZXQgT3B0aW9uR3JvdXAgPSBvcHRpb25Hcm91cENvbXBvbmVudDtcblx0bGV0IE9wdGlvbiA9IG9wdGlvbkNvbXBvbmVudDtcblx0bGV0IHJlbmRlckxhYmVsID0gb3B0aW9uUmVuZGVyZXIgfHwgdGhpcy5nZXRPcHRpb25MYWJlbDtcblxuXHRjb25zdCByZW5kZXJPcHRpb25zID0gKG9wdGlvbnNTdWJzZXQpID0+IHtcblx0XHRyZXR1cm4gb3B0aW9uc1N1YnNldC5tYXAoKG9wdGlvbiwgaSkgPT4ge1xuXHRcdFx0aWYgKGlzR3JvdXAob3B0aW9uKSkge1xuXHRcdFx0XHRsZXQgaXNGb2N1c2VkID0gb3B0aW9uID09PSBmb2N1c2VkT3B0aW9uO1xuXG5cdFx0XHRcdGxldCBvcHRpb25Hcm91cENsYXNzID0gY2xhc3NOYW1lcyh7XG5cdFx0XHRcdFx0J1NlbGVjdC1vcHRpb24tZ3JvdXAnOiB0cnVlLFxuXHRcdFx0XHRcdCdpcy1mb2N1c2VkJzogaXNGb2N1c2VkLFxuXHRcdFx0XHRcdCdpcy1kaXNhYmxlZCc6IG9wdGlvbi5kaXNhYmxlZCxcblx0XHRcdFx0fSk7XG5cblx0XHRcdFx0cmV0dXJuIChcblx0XHRcdFx0XHQ8T3B0aW9uR3JvdXBcblx0XHRcdFx0XHRcdGNsYXNzTmFtZT17b3B0aW9uR3JvdXBDbGFzc31cblx0XHRcdFx0XHRcdGlzRGlzYWJsZWQ9e29wdGlvbi5kaXNhYmxlZH1cblx0XHRcdFx0XHRcdGlzRm9jdXNlZD17aXNGb2N1c2VkfVxuXHRcdFx0XHRcdFx0a2V5PXtgb3B0aW9uLWdyb3VwLSR7aX1gfVxuXHRcdFx0XHRcdFx0bGFiZWw9e3JlbmRlckxhYmVsKG9wdGlvbil9XG5cdFx0XHRcdFx0XHRvbkZvY3VzPXtvbkZvY3VzfVxuXHRcdFx0XHRcdFx0b25TZWxlY3Q9e29uU2VsZWN0fVxuXHRcdFx0XHRcdFx0b3B0aW9uPXtvcHRpb259XG5cdFx0XHRcdFx0XHRvcHRpb25JbmRleD17aX1cblx0XHRcdFx0XHRcdHNlbGVjdEdyb3VwPXtzZWxlY3RHcm91cH1cblx0XHRcdFx0XHRcdD5cblx0XHRcdFx0XHRcdHtyZW5kZXJPcHRpb25zKG9wdGlvbi5vcHRpb25zKX1cblx0XHRcdFx0XHQ8L09wdGlvbkdyb3VwPlxuXHRcdFx0XHQpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0bGV0IGlzU2VsZWN0ZWQgPSB2YWx1ZUFycmF5ICYmIHZhbHVlQXJyYXkuaW5kZXhPZihvcHRpb24pID4gLTE7XG5cdFx0XHRcdGxldCBpc0ZvY3VzZWQgPSBvcHRpb24gPT09IGZvY3VzZWRPcHRpb247XG5cdFx0XHRcdGxldCBvcHRpb25SZWYgPSBpc0ZvY3VzZWQgPyAnZm9jdXNlZCcgOiBudWxsO1xuXHRcdFx0XHRsZXQgb3B0aW9uQ2xhc3MgPSBjbGFzc05hbWVzKG9wdGlvbkNsYXNzTmFtZSwge1xuXHRcdFx0XHRcdCdTZWxlY3Qtb3B0aW9uJzogdHJ1ZSxcblx0XHRcdFx0XHQnaXMtc2VsZWN0ZWQnOiBpc1NlbGVjdGVkLFxuXHRcdFx0XHRcdCdpcy1mb2N1c2VkJzogaXNGb2N1c2VkLFxuXHRcdFx0XHRcdCdpcy1kaXNhYmxlZCc6IG9wdGlvbi5kaXNhYmxlZCxcblx0XHRcdFx0fSk7XG5cblx0XHRcdFx0cmV0dXJuIChcblx0XHRcdFx0XHQ8T3B0aW9uXG5cdFx0XHRcdFx0XHRjbGFzc05hbWU9e29wdGlvbkNsYXNzfVxuXHRcdFx0XHRcdFx0aW5zdGFuY2VQcmVmaXg9e2luc3RhbmNlUHJlZml4fVxuXHRcdFx0XHRcdFx0aXNEaXNhYmxlZD17b3B0aW9uLmRpc2FibGVkfVxuXHRcdFx0XHRcdFx0aXNGb2N1c2VkPXtpc0ZvY3VzZWR9XG5cdFx0XHRcdFx0XHRpc1NlbGVjdGVkPXtpc1NlbGVjdGVkfVxuXHRcdFx0XHRcdFx0a2V5PXtgb3B0aW9uLSR7aX0tJHtvcHRpb25bdmFsdWVLZXldfWB9XG5cdFx0XHRcdFx0XHRvbkZvY3VzPXtvbkZvY3VzfVxuXHRcdFx0XHRcdFx0b25TZWxlY3Q9e29uU2VsZWN0fVxuXHRcdFx0XHRcdFx0b3B0aW9uPXtvcHRpb259XG5cdFx0XHRcdFx0XHRvcHRpb25JbmRleD17aX1cblx0XHRcdFx0XHRcdHJlZj17cmVmID0+IHsgb25PcHRpb25SZWYocmVmLCBpc0ZvY3VzZWQpOyB9fVxuXHRcdFx0XHRcdD5cblx0XHRcdFx0XHRcdHtyZW5kZXJMYWJlbChvcHRpb24sIGkpfVxuXHRcdFx0XHRcdDwvT3B0aW9uPlxuXHRcdFx0XHQpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9O1xuXG5cdHJldHVybiByZW5kZXJPcHRpb25zKG9wdGlvbnMpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG1lbnVSZW5kZXJlcjtcbiIsInZhciBtYXAgPSBbXG5cdHsgJ2Jhc2UnOidBJywgJ2xldHRlcnMnOi9bXFx1MDA0MVxcdTI0QjZcXHVGRjIxXFx1MDBDMFxcdTAwQzFcXHUwMEMyXFx1MUVBNlxcdTFFQTRcXHUxRUFBXFx1MUVBOFxcdTAwQzNcXHUwMTAwXFx1MDEwMlxcdTFFQjBcXHUxRUFFXFx1MUVCNFxcdTFFQjJcXHUwMjI2XFx1MDFFMFxcdTAwQzRcXHUwMURFXFx1MUVBMlxcdTAwQzVcXHUwMUZBXFx1MDFDRFxcdTAyMDBcXHUwMjAyXFx1MUVBMFxcdTFFQUNcXHUxRUI2XFx1MUUwMFxcdTAxMDRcXHUwMjNBXFx1MkM2Rl0vZyB9LFxuXHR7ICdiYXNlJzonQUEnLCdsZXR0ZXJzJzovW1xcdUE3MzJdL2cgfSxcblx0eyAnYmFzZSc6J0FFJywnbGV0dGVycyc6L1tcXHUwMEM2XFx1MDFGQ1xcdTAxRTJdL2cgfSxcblx0eyAnYmFzZSc6J0FPJywnbGV0dGVycyc6L1tcXHVBNzM0XS9nIH0sXG5cdHsgJ2Jhc2UnOidBVScsJ2xldHRlcnMnOi9bXFx1QTczNl0vZyB9LFxuXHR7ICdiYXNlJzonQVYnLCdsZXR0ZXJzJzovW1xcdUE3MzhcXHVBNzNBXS9nIH0sXG5cdHsgJ2Jhc2UnOidBWScsJ2xldHRlcnMnOi9bXFx1QTczQ10vZyB9LFxuXHR7ICdiYXNlJzonQicsICdsZXR0ZXJzJzovW1xcdTAwNDJcXHUyNEI3XFx1RkYyMlxcdTFFMDJcXHUxRTA0XFx1MUUwNlxcdTAyNDNcXHUwMTgyXFx1MDE4MV0vZyB9LFxuXHR7ICdiYXNlJzonQycsICdsZXR0ZXJzJzovW1xcdTAwNDNcXHUyNEI4XFx1RkYyM1xcdTAxMDZcXHUwMTA4XFx1MDEwQVxcdTAxMENcXHUwMEM3XFx1MUUwOFxcdTAxODdcXHUwMjNCXFx1QTczRV0vZyB9LFxuXHR7ICdiYXNlJzonRCcsICdsZXR0ZXJzJzovW1xcdTAwNDRcXHUyNEI5XFx1RkYyNFxcdTFFMEFcXHUwMTBFXFx1MUUwQ1xcdTFFMTBcXHUxRTEyXFx1MUUwRVxcdTAxMTBcXHUwMThCXFx1MDE4QVxcdTAxODlcXHVBNzc5XS9nIH0sXG5cdHsgJ2Jhc2UnOidEWicsJ2xldHRlcnMnOi9bXFx1MDFGMVxcdTAxQzRdL2cgfSxcblx0eyAnYmFzZSc6J0R6JywnbGV0dGVycyc6L1tcXHUwMUYyXFx1MDFDNV0vZyB9LFxuXHR7ICdiYXNlJzonRScsICdsZXR0ZXJzJzovW1xcdTAwNDVcXHUyNEJBXFx1RkYyNVxcdTAwQzhcXHUwMEM5XFx1MDBDQVxcdTFFQzBcXHUxRUJFXFx1MUVDNFxcdTFFQzJcXHUxRUJDXFx1MDExMlxcdTFFMTRcXHUxRTE2XFx1MDExNFxcdTAxMTZcXHUwMENCXFx1MUVCQVxcdTAxMUFcXHUwMjA0XFx1MDIwNlxcdTFFQjhcXHUxRUM2XFx1MDIyOFxcdTFFMUNcXHUwMTE4XFx1MUUxOFxcdTFFMUFcXHUwMTkwXFx1MDE4RV0vZyB9LFxuXHR7ICdiYXNlJzonRicsICdsZXR0ZXJzJzovW1xcdTAwNDZcXHUyNEJCXFx1RkYyNlxcdTFFMUVcXHUwMTkxXFx1QTc3Ql0vZyB9LFxuXHR7ICdiYXNlJzonRycsICdsZXR0ZXJzJzovW1xcdTAwNDdcXHUyNEJDXFx1RkYyN1xcdTAxRjRcXHUwMTFDXFx1MUUyMFxcdTAxMUVcXHUwMTIwXFx1MDFFNlxcdTAxMjJcXHUwMUU0XFx1MDE5M1xcdUE3QTBcXHVBNzdEXFx1QTc3RV0vZyB9LFxuXHR7ICdiYXNlJzonSCcsICdsZXR0ZXJzJzovW1xcdTAwNDhcXHUyNEJEXFx1RkYyOFxcdTAxMjRcXHUxRTIyXFx1MUUyNlxcdTAyMUVcXHUxRTI0XFx1MUUyOFxcdTFFMkFcXHUwMTI2XFx1MkM2N1xcdTJDNzVcXHVBNzhEXS9nIH0sXG5cdHsgJ2Jhc2UnOidJJywgJ2xldHRlcnMnOi9bXFx1MDA0OVxcdTI0QkVcXHVGRjI5XFx1MDBDQ1xcdTAwQ0RcXHUwMENFXFx1MDEyOFxcdTAxMkFcXHUwMTJDXFx1MDEzMFxcdTAwQ0ZcXHUxRTJFXFx1MUVDOFxcdTAxQ0ZcXHUwMjA4XFx1MDIwQVxcdTFFQ0FcXHUwMTJFXFx1MUUyQ1xcdTAxOTddL2cgfSxcblx0eyAnYmFzZSc6J0onLCAnbGV0dGVycyc6L1tcXHUwMDRBXFx1MjRCRlxcdUZGMkFcXHUwMTM0XFx1MDI0OF0vZyB9LFxuXHR7ICdiYXNlJzonSycsICdsZXR0ZXJzJzovW1xcdTAwNEJcXHUyNEMwXFx1RkYyQlxcdTFFMzBcXHUwMUU4XFx1MUUzMlxcdTAxMzZcXHUxRTM0XFx1MDE5OFxcdTJDNjlcXHVBNzQwXFx1QTc0MlxcdUE3NDRcXHVBN0EyXS9nIH0sXG5cdHsgJ2Jhc2UnOidMJywgJ2xldHRlcnMnOi9bXFx1MDA0Q1xcdTI0QzFcXHVGRjJDXFx1MDEzRlxcdTAxMzlcXHUwMTNEXFx1MUUzNlxcdTFFMzhcXHUwMTNCXFx1MUUzQ1xcdTFFM0FcXHUwMTQxXFx1MDIzRFxcdTJDNjJcXHUyQzYwXFx1QTc0OFxcdUE3NDZcXHVBNzgwXS9nIH0sXG5cdHsgJ2Jhc2UnOidMSicsJ2xldHRlcnMnOi9bXFx1MDFDN10vZyB9LFxuXHR7ICdiYXNlJzonTGonLCdsZXR0ZXJzJzovW1xcdTAxQzhdL2cgfSxcblx0eyAnYmFzZSc6J00nLCAnbGV0dGVycyc6L1tcXHUwMDREXFx1MjRDMlxcdUZGMkRcXHUxRTNFXFx1MUU0MFxcdTFFNDJcXHUyQzZFXFx1MDE5Q10vZyB9LFxuXHR7ICdiYXNlJzonTicsICdsZXR0ZXJzJzovW1xcdTAwNEVcXHUyNEMzXFx1RkYyRVxcdTAxRjhcXHUwMTQzXFx1MDBEMVxcdTFFNDRcXHUwMTQ3XFx1MUU0NlxcdTAxNDVcXHUxRTRBXFx1MUU0OFxcdTAyMjBcXHUwMTlEXFx1QTc5MFxcdUE3QTRdL2cgfSxcblx0eyAnYmFzZSc6J05KJywnbGV0dGVycyc6L1tcXHUwMUNBXS9nIH0sXG5cdHsgJ2Jhc2UnOidOaicsJ2xldHRlcnMnOi9bXFx1MDFDQl0vZyB9LFxuXHR7ICdiYXNlJzonTycsICdsZXR0ZXJzJzovW1xcdTAwNEZcXHUyNEM0XFx1RkYyRlxcdTAwRDJcXHUwMEQzXFx1MDBENFxcdTFFRDJcXHUxRUQwXFx1MUVENlxcdTFFRDRcXHUwMEQ1XFx1MUU0Q1xcdTAyMkNcXHUxRTRFXFx1MDE0Q1xcdTFFNTBcXHUxRTUyXFx1MDE0RVxcdTAyMkVcXHUwMjMwXFx1MDBENlxcdTAyMkFcXHUxRUNFXFx1MDE1MFxcdTAxRDFcXHUwMjBDXFx1MDIwRVxcdTAxQTBcXHUxRURDXFx1MUVEQVxcdTFFRTBcXHUxRURFXFx1MUVFMlxcdTFFQ0NcXHUxRUQ4XFx1MDFFQVxcdTAxRUNcXHUwMEQ4XFx1MDFGRVxcdTAxODZcXHUwMTlGXFx1QTc0QVxcdUE3NENdL2cgfSxcblx0eyAnYmFzZSc6J09JJywnbGV0dGVycyc6L1tcXHUwMUEyXS9nIH0sXG5cdHsgJ2Jhc2UnOidPTycsJ2xldHRlcnMnOi9bXFx1QTc0RV0vZyB9LFxuXHR7ICdiYXNlJzonT1UnLCdsZXR0ZXJzJzovW1xcdTAyMjJdL2cgfSxcblx0eyAnYmFzZSc6J1AnLCAnbGV0dGVycyc6L1tcXHUwMDUwXFx1MjRDNVxcdUZGMzBcXHUxRTU0XFx1MUU1NlxcdTAxQTRcXHUyQzYzXFx1QTc1MFxcdUE3NTJcXHVBNzU0XS9nIH0sXG5cdHsgJ2Jhc2UnOidRJywgJ2xldHRlcnMnOi9bXFx1MDA1MVxcdTI0QzZcXHVGRjMxXFx1QTc1NlxcdUE3NThcXHUwMjRBXS9nIH0sXG5cdHsgJ2Jhc2UnOidSJywgJ2xldHRlcnMnOi9bXFx1MDA1MlxcdTI0QzdcXHVGRjMyXFx1MDE1NFxcdTFFNThcXHUwMTU4XFx1MDIxMFxcdTAyMTJcXHUxRTVBXFx1MUU1Q1xcdTAxNTZcXHUxRTVFXFx1MDI0Q1xcdTJDNjRcXHVBNzVBXFx1QTdBNlxcdUE3ODJdL2cgfSxcblx0eyAnYmFzZSc6J1MnLCAnbGV0dGVycyc6L1tcXHUwMDUzXFx1MjRDOFxcdUZGMzNcXHUxRTlFXFx1MDE1QVxcdTFFNjRcXHUwMTVDXFx1MUU2MFxcdTAxNjBcXHUxRTY2XFx1MUU2MlxcdTFFNjhcXHUwMjE4XFx1MDE1RVxcdTJDN0VcXHVBN0E4XFx1QTc4NF0vZyB9LFxuXHR7ICdiYXNlJzonVCcsICdsZXR0ZXJzJzovW1xcdTAwNTRcXHUyNEM5XFx1RkYzNFxcdTFFNkFcXHUwMTY0XFx1MUU2Q1xcdTAyMUFcXHUwMTYyXFx1MUU3MFxcdTFFNkVcXHUwMTY2XFx1MDFBQ1xcdTAxQUVcXHUwMjNFXFx1QTc4Nl0vZyB9LFxuXHR7ICdiYXNlJzonVFonLCdsZXR0ZXJzJzovW1xcdUE3MjhdL2cgfSxcblx0eyAnYmFzZSc6J1UnLCAnbGV0dGVycyc6L1tcXHUwMDU1XFx1MjRDQVxcdUZGMzVcXHUwMEQ5XFx1MDBEQVxcdTAwREJcXHUwMTY4XFx1MUU3OFxcdTAxNkFcXHUxRTdBXFx1MDE2Q1xcdTAwRENcXHUwMURCXFx1MDFEN1xcdTAxRDVcXHUwMUQ5XFx1MUVFNlxcdTAxNkVcXHUwMTcwXFx1MDFEM1xcdTAyMTRcXHUwMjE2XFx1MDFBRlxcdTFFRUFcXHUxRUU4XFx1MUVFRVxcdTFFRUNcXHUxRUYwXFx1MUVFNFxcdTFFNzJcXHUwMTcyXFx1MUU3NlxcdTFFNzRcXHUwMjQ0XS9nIH0sXG5cdHsgJ2Jhc2UnOidWJywgJ2xldHRlcnMnOi9bXFx1MDA1NlxcdTI0Q0JcXHVGRjM2XFx1MUU3Q1xcdTFFN0VcXHUwMUIyXFx1QTc1RVxcdTAyNDVdL2cgfSxcblx0eyAnYmFzZSc6J1ZZJywnbGV0dGVycyc6L1tcXHVBNzYwXS9nIH0sXG5cdHsgJ2Jhc2UnOidXJywgJ2xldHRlcnMnOi9bXFx1MDA1N1xcdTI0Q0NcXHVGRjM3XFx1MUU4MFxcdTFFODJcXHUwMTc0XFx1MUU4NlxcdTFFODRcXHUxRTg4XFx1MkM3Ml0vZyB9LFxuXHR7ICdiYXNlJzonWCcsICdsZXR0ZXJzJzovW1xcdTAwNThcXHUyNENEXFx1RkYzOFxcdTFFOEFcXHUxRThDXS9nIH0sXG5cdHsgJ2Jhc2UnOidZJywgJ2xldHRlcnMnOi9bXFx1MDA1OVxcdTI0Q0VcXHVGRjM5XFx1MUVGMlxcdTAwRERcXHUwMTc2XFx1MUVGOFxcdTAyMzJcXHUxRThFXFx1MDE3OFxcdTFFRjZcXHUxRUY0XFx1MDFCM1xcdTAyNEVcXHUxRUZFXS9nIH0sXG5cdHsgJ2Jhc2UnOidaJywgJ2xldHRlcnMnOi9bXFx1MDA1QVxcdTI0Q0ZcXHVGRjNBXFx1MDE3OVxcdTFFOTBcXHUwMTdCXFx1MDE3RFxcdTFFOTJcXHUxRTk0XFx1MDFCNVxcdTAyMjRcXHUyQzdGXFx1MkM2QlxcdUE3NjJdL2cgfSxcblx0eyAnYmFzZSc6J2EnLCAnbGV0dGVycyc6L1tcXHUwMDYxXFx1MjREMFxcdUZGNDFcXHUxRTlBXFx1MDBFMFxcdTAwRTFcXHUwMEUyXFx1MUVBN1xcdTFFQTVcXHUxRUFCXFx1MUVBOVxcdTAwRTNcXHUwMTAxXFx1MDEwM1xcdTFFQjFcXHUxRUFGXFx1MUVCNVxcdTFFQjNcXHUwMjI3XFx1MDFFMVxcdTAwRTRcXHUwMURGXFx1MUVBM1xcdTAwRTVcXHUwMUZCXFx1MDFDRVxcdTAyMDFcXHUwMjAzXFx1MUVBMVxcdTFFQURcXHUxRUI3XFx1MUUwMVxcdTAxMDVcXHUyQzY1XFx1MDI1MF0vZyB9LFxuXHR7ICdiYXNlJzonYWEnLCdsZXR0ZXJzJzovW1xcdUE3MzNdL2cgfSxcblx0eyAnYmFzZSc6J2FlJywnbGV0dGVycyc6L1tcXHUwMEU2XFx1MDFGRFxcdTAxRTNdL2cgfSxcblx0eyAnYmFzZSc6J2FvJywnbGV0dGVycyc6L1tcXHVBNzM1XS9nIH0sXG5cdHsgJ2Jhc2UnOidhdScsJ2xldHRlcnMnOi9bXFx1QTczN10vZyB9LFxuXHR7ICdiYXNlJzonYXYnLCdsZXR0ZXJzJzovW1xcdUE3MzlcXHVBNzNCXS9nIH0sXG5cdHsgJ2Jhc2UnOidheScsJ2xldHRlcnMnOi9bXFx1QTczRF0vZyB9LFxuXHR7ICdiYXNlJzonYicsICdsZXR0ZXJzJzovW1xcdTAwNjJcXHUyNEQxXFx1RkY0MlxcdTFFMDNcXHUxRTA1XFx1MUUwN1xcdTAxODBcXHUwMTgzXFx1MDI1M10vZyB9LFxuXHR7ICdiYXNlJzonYycsICdsZXR0ZXJzJzovW1xcdTAwNjNcXHUyNEQyXFx1RkY0M1xcdTAxMDdcXHUwMTA5XFx1MDEwQlxcdTAxMERcXHUwMEU3XFx1MUUwOVxcdTAxODhcXHUwMjNDXFx1QTczRlxcdTIxODRdL2cgfSxcblx0eyAnYmFzZSc6J2QnLCAnbGV0dGVycyc6L1tcXHUwMDY0XFx1MjREM1xcdUZGNDRcXHUxRTBCXFx1MDEwRlxcdTFFMERcXHUxRTExXFx1MUUxM1xcdTFFMEZcXHUwMTExXFx1MDE4Q1xcdTAyNTZcXHUwMjU3XFx1QTc3QV0vZyB9LFxuXHR7ICdiYXNlJzonZHonLCdsZXR0ZXJzJzovW1xcdTAxRjNcXHUwMUM2XS9nIH0sXG5cdHsgJ2Jhc2UnOidlJywgJ2xldHRlcnMnOi9bXFx1MDA2NVxcdTI0RDRcXHVGRjQ1XFx1MDBFOFxcdTAwRTlcXHUwMEVBXFx1MUVDMVxcdTFFQkZcXHUxRUM1XFx1MUVDM1xcdTFFQkRcXHUwMTEzXFx1MUUxNVxcdTFFMTdcXHUwMTE1XFx1MDExN1xcdTAwRUJcXHUxRUJCXFx1MDExQlxcdTAyMDVcXHUwMjA3XFx1MUVCOVxcdTFFQzdcXHUwMjI5XFx1MUUxRFxcdTAxMTlcXHUxRTE5XFx1MUUxQlxcdTAyNDdcXHUwMjVCXFx1MDFERF0vZyB9LFxuXHR7ICdiYXNlJzonZicsICdsZXR0ZXJzJzovW1xcdTAwNjZcXHUyNEQ1XFx1RkY0NlxcdTFFMUZcXHUwMTkyXFx1QTc3Q10vZyB9LFxuXHR7ICdiYXNlJzonZycsICdsZXR0ZXJzJzovW1xcdTAwNjdcXHUyNEQ2XFx1RkY0N1xcdTAxRjVcXHUwMTFEXFx1MUUyMVxcdTAxMUZcXHUwMTIxXFx1MDFFN1xcdTAxMjNcXHUwMUU1XFx1MDI2MFxcdUE3QTFcXHUxRDc5XFx1QTc3Rl0vZyB9LFxuXHR7ICdiYXNlJzonaCcsICdsZXR0ZXJzJzovW1xcdTAwNjhcXHUyNEQ3XFx1RkY0OFxcdTAxMjVcXHUxRTIzXFx1MUUyN1xcdTAyMUZcXHUxRTI1XFx1MUUyOVxcdTFFMkJcXHUxRTk2XFx1MDEyN1xcdTJDNjhcXHUyQzc2XFx1MDI2NV0vZyB9LFxuXHR7ICdiYXNlJzonaHYnLCdsZXR0ZXJzJzovW1xcdTAxOTVdL2cgfSxcblx0eyAnYmFzZSc6J2knLCAnbGV0dGVycyc6L1tcXHUwMDY5XFx1MjREOFxcdUZGNDlcXHUwMEVDXFx1MDBFRFxcdTAwRUVcXHUwMTI5XFx1MDEyQlxcdTAxMkRcXHUwMEVGXFx1MUUyRlxcdTFFQzlcXHUwMUQwXFx1MDIwOVxcdTAyMEJcXHUxRUNCXFx1MDEyRlxcdTFFMkRcXHUwMjY4XFx1MDEzMV0vZyB9LFxuXHR7ICdiYXNlJzonaicsICdsZXR0ZXJzJzovW1xcdTAwNkFcXHUyNEQ5XFx1RkY0QVxcdTAxMzVcXHUwMUYwXFx1MDI0OV0vZyB9LFxuXHR7ICdiYXNlJzonaycsICdsZXR0ZXJzJzovW1xcdTAwNkJcXHUyNERBXFx1RkY0QlxcdTFFMzFcXHUwMUU5XFx1MUUzM1xcdTAxMzdcXHUxRTM1XFx1MDE5OVxcdTJDNkFcXHVBNzQxXFx1QTc0M1xcdUE3NDVcXHVBN0EzXS9nIH0sXG5cdHsgJ2Jhc2UnOidsJywgJ2xldHRlcnMnOi9bXFx1MDA2Q1xcdTI0REJcXHVGRjRDXFx1MDE0MFxcdTAxM0FcXHUwMTNFXFx1MUUzN1xcdTFFMzlcXHUwMTNDXFx1MUUzRFxcdTFFM0JcXHUwMTdGXFx1MDE0MlxcdTAxOUFcXHUwMjZCXFx1MkM2MVxcdUE3NDlcXHVBNzgxXFx1QTc0N10vZyB9LFxuXHR7ICdiYXNlJzonbGonLCdsZXR0ZXJzJzovW1xcdTAxQzldL2cgfSxcblx0eyAnYmFzZSc6J20nLCAnbGV0dGVycyc6L1tcXHUwMDZEXFx1MjREQ1xcdUZGNERcXHUxRTNGXFx1MUU0MVxcdTFFNDNcXHUwMjcxXFx1MDI2Rl0vZyB9LFxuXHR7ICdiYXNlJzonbicsICdsZXR0ZXJzJzovW1xcdTAwNkVcXHUyNEREXFx1RkY0RVxcdTAxRjlcXHUwMTQ0XFx1MDBGMVxcdTFFNDVcXHUwMTQ4XFx1MUU0N1xcdTAxNDZcXHUxRTRCXFx1MUU0OVxcdTAxOUVcXHUwMjcyXFx1MDE0OVxcdUE3OTFcXHVBN0E1XS9nIH0sXG5cdHsgJ2Jhc2UnOiduaicsJ2xldHRlcnMnOi9bXFx1MDFDQ10vZyB9LFxuXHR7ICdiYXNlJzonbycsICdsZXR0ZXJzJzovW1xcdTAwNkZcXHUyNERFXFx1RkY0RlxcdTAwRjJcXHUwMEYzXFx1MDBGNFxcdTFFRDNcXHUxRUQxXFx1MUVEN1xcdTFFRDVcXHUwMEY1XFx1MUU0RFxcdTAyMkRcXHUxRTRGXFx1MDE0RFxcdTFFNTFcXHUxRTUzXFx1MDE0RlxcdTAyMkZcXHUwMjMxXFx1MDBGNlxcdTAyMkJcXHUxRUNGXFx1MDE1MVxcdTAxRDJcXHUwMjBEXFx1MDIwRlxcdTAxQTFcXHUxRUREXFx1MUVEQlxcdTFFRTFcXHUxRURGXFx1MUVFM1xcdTFFQ0RcXHUxRUQ5XFx1MDFFQlxcdTAxRURcXHUwMEY4XFx1MDFGRlxcdTAyNTRcXHVBNzRCXFx1QTc0RFxcdTAyNzVdL2cgfSxcblx0eyAnYmFzZSc6J29pJywnbGV0dGVycyc6L1tcXHUwMUEzXS9nIH0sXG5cdHsgJ2Jhc2UnOidvdScsJ2xldHRlcnMnOi9bXFx1MDIyM10vZyB9LFxuXHR7ICdiYXNlJzonb28nLCdsZXR0ZXJzJzovW1xcdUE3NEZdL2cgfSxcblx0eyAnYmFzZSc6J3AnLCAnbGV0dGVycyc6L1tcXHUwMDcwXFx1MjRERlxcdUZGNTBcXHUxRTU1XFx1MUU1N1xcdTAxQTVcXHUxRDdEXFx1QTc1MVxcdUE3NTNcXHVBNzU1XS9nIH0sXG5cdHsgJ2Jhc2UnOidxJywgJ2xldHRlcnMnOi9bXFx1MDA3MVxcdTI0RTBcXHVGRjUxXFx1MDI0QlxcdUE3NTdcXHVBNzU5XS9nIH0sXG5cdHsgJ2Jhc2UnOidyJywgJ2xldHRlcnMnOi9bXFx1MDA3MlxcdTI0RTFcXHVGRjUyXFx1MDE1NVxcdTFFNTlcXHUwMTU5XFx1MDIxMVxcdTAyMTNcXHUxRTVCXFx1MUU1RFxcdTAxNTdcXHUxRTVGXFx1MDI0RFxcdTAyN0RcXHVBNzVCXFx1QTdBN1xcdUE3ODNdL2cgfSxcblx0eyAnYmFzZSc6J3MnLCAnbGV0dGVycyc6L1tcXHUwMDczXFx1MjRFMlxcdUZGNTNcXHUwMERGXFx1MDE1QlxcdTFFNjVcXHUwMTVEXFx1MUU2MVxcdTAxNjFcXHUxRTY3XFx1MUU2M1xcdTFFNjlcXHUwMjE5XFx1MDE1RlxcdTAyM0ZcXHVBN0E5XFx1QTc4NVxcdTFFOUJdL2cgfSxcblx0eyAnYmFzZSc6J3QnLCAnbGV0dGVycyc6L1tcXHUwMDc0XFx1MjRFM1xcdUZGNTRcXHUxRTZCXFx1MUU5N1xcdTAxNjVcXHUxRTZEXFx1MDIxQlxcdTAxNjNcXHUxRTcxXFx1MUU2RlxcdTAxNjdcXHUwMUFEXFx1MDI4OFxcdTJDNjZcXHVBNzg3XS9nIH0sXG5cdHsgJ2Jhc2UnOid0eicsJ2xldHRlcnMnOi9bXFx1QTcyOV0vZyB9LFxuXHR7ICdiYXNlJzondScsICdsZXR0ZXJzJzovW1xcdTAwNzVcXHUyNEU0XFx1RkY1NVxcdTAwRjlcXHUwMEZBXFx1MDBGQlxcdTAxNjlcXHUxRTc5XFx1MDE2QlxcdTFFN0JcXHUwMTZEXFx1MDBGQ1xcdTAxRENcXHUwMUQ4XFx1MDFENlxcdTAxREFcXHUxRUU3XFx1MDE2RlxcdTAxNzFcXHUwMUQ0XFx1MDIxNVxcdTAyMTdcXHUwMUIwXFx1MUVFQlxcdTFFRTlcXHUxRUVGXFx1MUVFRFxcdTFFRjFcXHUxRUU1XFx1MUU3M1xcdTAxNzNcXHUxRTc3XFx1MUU3NVxcdTAyODldL2cgfSxcblx0eyAnYmFzZSc6J3YnLCAnbGV0dGVycyc6L1tcXHUwMDc2XFx1MjRFNVxcdUZGNTZcXHUxRTdEXFx1MUU3RlxcdTAyOEJcXHVBNzVGXFx1MDI4Q10vZyB9LFxuXHR7ICdiYXNlJzondnknLCdsZXR0ZXJzJzovW1xcdUE3NjFdL2cgfSxcblx0eyAnYmFzZSc6J3cnLCAnbGV0dGVycyc6L1tcXHUwMDc3XFx1MjRFNlxcdUZGNTdcXHUxRTgxXFx1MUU4M1xcdTAxNzVcXHUxRTg3XFx1MUU4NVxcdTFFOThcXHUxRTg5XFx1MkM3M10vZyB9LFxuXHR7ICdiYXNlJzoneCcsICdsZXR0ZXJzJzovW1xcdTAwNzhcXHUyNEU3XFx1RkY1OFxcdTFFOEJcXHUxRThEXS9nIH0sXG5cdHsgJ2Jhc2UnOid5JywgJ2xldHRlcnMnOi9bXFx1MDA3OVxcdTI0RThcXHVGRjU5XFx1MUVGM1xcdTAwRkRcXHUwMTc3XFx1MUVGOVxcdTAyMzNcXHUxRThGXFx1MDBGRlxcdTFFRjdcXHUxRTk5XFx1MUVGNVxcdTAxQjRcXHUwMjRGXFx1MUVGRl0vZyB9LFxuXHR7ICdiYXNlJzoneicsICdsZXR0ZXJzJzovW1xcdTAwN0FcXHUyNEU5XFx1RkY1QVxcdTAxN0FcXHUxRTkxXFx1MDE3Q1xcdTAxN0VcXHUxRTkzXFx1MUU5NVxcdTAxQjZcXHUwMjI1XFx1MDI0MFxcdTJDNkNcXHVBNzYzXS9nIH0sXG5dO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHN0cmlwRGlhY3JpdGljcyAoc3RyKSB7XG5cdGZvciAodmFyIGkgPSAwOyBpIDwgbWFwLmxlbmd0aDsgaSsrKSB7XG5cdFx0c3RyID0gc3RyLnJlcGxhY2UobWFwW2ldLmxldHRlcnMsIG1hcFtpXS5iYXNlKTtcblx0fVxuXHRyZXR1cm4gc3RyO1xufTtcbiIsIi8qIVxuICBDb3B5cmlnaHQgKGMpIDIwMTYgSmVkIFdhdHNvbi5cbiAgTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlIChNSVQpLCBzZWVcbiAgaHR0cDovL2plZHdhdHNvbi5naXRodWIuaW8vcmVhY3Qtc2VsZWN0XG4qL1xuXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFJlYWN0RE9NIGZyb20gJ3JlYWN0LWRvbSc7XG5pbXBvcnQgQXV0b3NpemVJbnB1dCBmcm9tICdyZWFjdC1pbnB1dC1hdXRvc2l6ZSc7XG5pbXBvcnQgY2xhc3NOYW1lcyBmcm9tICdjbGFzc25hbWVzJztcblxuaW1wb3J0IGRlZmF1bHRBcnJvd1JlbmRlcmVyIGZyb20gJy4vdXRpbHMvZGVmYXVsdEFycm93UmVuZGVyZXInO1xuaW1wb3J0IGRlZmF1bHRGaWx0ZXJPcHRpb25zIGZyb20gJy4vdXRpbHMvZGVmYXVsdEZpbHRlck9wdGlvbnMnO1xuaW1wb3J0IGRlZmF1bHRNZW51UmVuZGVyZXIgZnJvbSAnLi91dGlscy9kZWZhdWx0TWVudVJlbmRlcmVyJztcblxuaW1wb3J0IEFzeW5jIGZyb20gJy4vQXN5bmMnO1xuaW1wb3J0IEFzeW5jQ3JlYXRhYmxlIGZyb20gJy4vQXN5bmNDcmVhdGFibGUnO1xuaW1wb3J0IENyZWF0YWJsZSBmcm9tICcuL0NyZWF0YWJsZSc7XG5pbXBvcnQgRHJvcGRvd24gZnJvbSAnLi9Ecm9wZG93bic7XG5pbXBvcnQgT3B0aW9uIGZyb20gJy4vT3B0aW9uJztcbmltcG9ydCBPcHRpb25Hcm91cCBmcm9tICcuL09wdGlvbkdyb3VwJztcbmltcG9ydCBWYWx1ZSBmcm9tICcuL1ZhbHVlJztcblxuZnVuY3Rpb24gY2xvbmUob2JqKSB7XG4gIGNvbnN0IGNvcHkgPSB7fTtcbiAgZm9yIChsZXQgYXR0ciBpbiBvYmopIHtcbiAgICBpZiAob2JqLmhhc093blByb3BlcnR5KGF0dHIpKSB7XG4gICAgXHRjb3B5W2F0dHJdID0gb2JqW2F0dHJdO1xuICAgIH07XG4gIH1cbiAgcmV0dXJuIGNvcHk7XG59XG5cbmZ1bmN0aW9uIGlzR3JvdXAgKG9wdGlvbikge1xuXHRyZXR1cm4gb3B0aW9uICYmIEFycmF5LmlzQXJyYXkob3B0aW9uLm9wdGlvbnMpO1xufVxuXG5mdW5jdGlvbiBzdHJpbmdpZnlWYWx1ZSAodmFsdWUpIHtcblx0aWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpIHtcblx0XHRyZXR1cm4gdmFsdWU7XG5cdH0gZWxzZSBpZiAodHlwZW9mIHZhbHVlID09PSAnb2JqZWN0Jykge1xuXHRcdHJldHVybiBKU09OLnN0cmluZ2lmeSh2YWx1ZSk7XG5cdH0gZWxzZSBpZiAodmFsdWUgfHwgdmFsdWUgPT09IDApIHtcblx0XHRyZXR1cm4gU3RyaW5nKHZhbHVlKTtcblx0fSBlbHNlIHtcblx0XHRyZXR1cm4gJyc7XG5cdH1cbn1cblxuY29uc3Qgc3RyaW5nT3JOb2RlID0gUmVhY3QuUHJvcFR5cGVzLm9uZU9mVHlwZShbXG5cdFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG5cdFJlYWN0LlByb3BUeXBlcy5ub2RlXG5dKTtcblxubGV0IGluc3RhbmNlSWQgPSAxO1xuXG5jb25zdCBpbnZhbGlkT3B0aW9ucyA9IHt9O1xuXG5jb25zdCBTZWxlY3QgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cblx0ZGlzcGxheU5hbWU6ICdTZWxlY3QnLFxuXG5cdHByb3BUeXBlczoge1xuXHRcdGFkZExhYmVsVGV4dDogUmVhY3QuUHJvcFR5cGVzLnN0cmluZywgICAgICAgLy8gcGxhY2Vob2xkZXIgZGlzcGxheWVkIHdoZW4geW91IHdhbnQgdG8gYWRkIGEgbGFiZWwgb24gYSBtdWx0aS12YWx1ZSBpbnB1dFxuXHRcdCdhcmlhLWxhYmVsJzogUmVhY3QuUHJvcFR5cGVzLnN0cmluZywgICAgICAgLy8gQXJpYSBsYWJlbCAoZm9yIGFzc2lzdGl2ZSB0ZWNoKVxuXHRcdCdhcmlhLWxhYmVsbGVkYnknOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFx0Ly8gSFRNTCBJRCBvZiBhbiBlbGVtZW50IHRoYXQgc2hvdWxkIGJlIHVzZWQgYXMgdGhlIGxhYmVsIChmb3IgYXNzaXN0aXZlIHRlY2gpXG5cdFx0YXJyb3dSZW5kZXJlcjogUmVhY3QuUHJvcFR5cGVzLmZ1bmMsIFx0XHRcdFx0Ly8gQ3JlYXRlIGRyb3AtZG93biBjYXJldCBlbGVtZW50XG5cdFx0YXV0b0JsdXI6IFJlYWN0LlByb3BUeXBlcy5ib29sLCAgICAgICAgICAgICAvLyBhdXRvbWF0aWNhbGx5IGJsdXIgdGhlIGNvbXBvbmVudCB3aGVuIGFuIG9wdGlvbiBpcyBzZWxlY3RlZFxuXHRcdGF1dG9mb2N1czogUmVhY3QuUHJvcFR5cGVzLmJvb2wsICAgICAgICAgICAgLy8gYXV0b2ZvY3VzIHRoZSBjb21wb25lbnQgb24gbW91bnRcblx0XHRhdXRvc2l6ZTogUmVhY3QuUHJvcFR5cGVzLmJvb2wsICAgICAgICAgICAgIC8vIHdoZXRoZXIgdG8gZW5hYmxlIGF1dG9zaXppbmcgb3Igbm90XG5cdFx0YmFja3NwYWNlUmVtb3ZlczogUmVhY3QuUHJvcFR5cGVzLmJvb2wsICAgICAvLyB3aGV0aGVyIGJhY2tzcGFjZSByZW1vdmVzIGFuIGl0ZW0gaWYgdGhlcmUgaXMgbm8gdGV4dCBpbnB1dFxuXHRcdGJhY2tzcGFjZVRvUmVtb3ZlTWVzc2FnZTogUmVhY3QuUHJvcFR5cGVzLnN0cmluZywgIC8vIE1lc3NhZ2UgdG8gdXNlIGZvciBzY3JlZW5yZWFkZXJzIHRvIHByZXNzIGJhY2tzcGFjZSB0byByZW1vdmUgdGhlIGN1cnJlbnQgaXRlbSAtIHtsYWJlbH0gaXMgcmVwbGFjZWQgd2l0aCB0aGUgaXRlbSBsYWJlbFxuXHRcdGNsYXNzTmFtZTogUmVhY3QuUHJvcFR5cGVzLnN0cmluZywgICAgICAgICAgLy8gY2xhc3NOYW1lIGZvciB0aGUgb3V0ZXIgZWxlbWVudFxuXHRcdGNsZWFyQWxsVGV4dDogc3RyaW5nT3JOb2RlLCAgICAgICAgICAgICAgICAgLy8gdGl0bGUgZm9yIHRoZSBcImNsZWFyXCIgY29udHJvbCB3aGVuIG11bHRpOiB0cnVlXG5cdFx0Y2xlYXJWYWx1ZVRleHQ6IHN0cmluZ09yTm9kZSwgICAgICAgICAgICAgICAvLyB0aXRsZSBmb3IgdGhlIFwiY2xlYXJcIiBjb250cm9sXG5cdFx0Y2xlYXJhYmxlOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbCwgICAgICAgICAgICAvLyBzaG91bGQgaXQgYmUgcG9zc2libGUgdG8gcmVzZXQgdmFsdWVcblx0XHRkZWxpbWl0ZXI6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsICAgICAgICAgIC8vIGRlbGltaXRlciB0byB1c2UgdG8gam9pbiBtdWx0aXBsZSB2YWx1ZXMgZm9yIHRoZSBoaWRkZW4gZmllbGQgdmFsdWVcblx0XHRkaXNhYmxlZDogUmVhY3QuUHJvcFR5cGVzLmJvb2wsICAgICAgICAgICAgIC8vIHdoZXRoZXIgdGhlIFNlbGVjdCBpcyBkaXNhYmxlZCBvciBub3Rcblx0XHRkcm9wZG93bkNvbXBvbmVudDogUmVhY3QuUHJvcFR5cGVzLmZ1bmMsICAgIC8vIGRyb3Bkb3duIGNvbXBvbmVudCB0byByZW5kZXIgdGhlIG1lbnUgaW5cblx0XHRlc2NhcGVDbGVhcnNWYWx1ZTogUmVhY3QuUHJvcFR5cGVzLmJvb2wsICAgIC8vIHdoZXRoZXIgZXNjYXBlIGNsZWFycyB0aGUgdmFsdWUgd2hlbiB0aGUgbWVudSBpcyBjbG9zZWRcblx0XHRmaWx0ZXJPcHRpb246IFJlYWN0LlByb3BUeXBlcy5mdW5jLCAgICAgICAgIC8vIG1ldGhvZCB0byBmaWx0ZXIgYSBzaW5nbGUgb3B0aW9uIChvcHRpb24sIGZpbHRlclN0cmluZylcblx0XHRmaWx0ZXJPcHRpb25zOiBSZWFjdC5Qcm9wVHlwZXMuYW55LCAgICAgICAgIC8vIGJvb2xlYW4gdG8gZW5hYmxlIGRlZmF1bHQgZmlsdGVyaW5nIG9yIGZ1bmN0aW9uIHRvIGZpbHRlciB0aGUgb3B0aW9ucyBhcnJheSAoW29wdGlvbnNdLCBmaWx0ZXJTdHJpbmcsIFt2YWx1ZXNdKVxuXHRcdGlnbm9yZUFjY2VudHM6IFJlYWN0LlByb3BUeXBlcy5ib29sLCAgICAgICAgLy8gd2hldGhlciB0byBzdHJpcCBkaWFjcml0aWNzIHdoZW4gZmlsdGVyaW5nXG5cdFx0aWdub3JlQ2FzZTogUmVhY3QuUHJvcFR5cGVzLmJvb2wsICAgICAgICAgICAvLyB3aGV0aGVyIHRvIHBlcmZvcm0gY2FzZS1pbnNlbnNpdGl2ZSBmaWx0ZXJpbmdcblx0XHRpbnB1dFByb3BzOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LCAgICAgICAgIC8vIGN1c3RvbSBhdHRyaWJ1dGVzIGZvciB0aGUgSW5wdXRcblx0XHRpbnB1dFJlbmRlcmVyOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYywgICAgICAgIC8vIHJldHVybnMgYSBjdXN0b20gaW5wdXQgY29tcG9uZW50XG5cdFx0aW5zdGFuY2VJZDogUmVhY3QuUHJvcFR5cGVzLnN0cmluZywgICAgICAgICAvLyBzZXQgdGhlIGNvbXBvbmVudHMgaW5zdGFuY2VJZFxuXHRcdGlzTG9hZGluZzogUmVhY3QuUHJvcFR5cGVzLmJvb2wsICAgICAgICAgICAgLy8gd2hldGhlciB0aGUgU2VsZWN0IGlzIGxvYWRpbmcgZXh0ZXJuYWxseSBvciBub3QgKHN1Y2ggYXMgb3B0aW9ucyBiZWluZyBsb2FkZWQpXG5cdFx0aXNPcGVuOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbCwgICAgICAgICAgICAgICAvLyB3aGV0aGVyIHRoZSBTZWxlY3QgZHJvcGRvd24gbWVudSBpcyBvcGVuIG9yIG5vdFxuXHRcdGpvaW5WYWx1ZXM6IFJlYWN0LlByb3BUeXBlcy5ib29sLCAgICAgICAgICAgLy8gam9pbnMgbXVsdGlwbGUgdmFsdWVzIGludG8gYSBzaW5nbGUgZm9ybSBmaWVsZCB3aXRoIHRoZSBkZWxpbWl0ZXIgKGxlZ2FjeSBtb2RlKVxuXHRcdGxhYmVsS2V5OiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLCAgICAgICAgICAgLy8gcGF0aCBvZiB0aGUgbGFiZWwgdmFsdWUgaW4gb3B0aW9uIG9iamVjdHNcblx0XHRtYXRjaFBvczogUmVhY3QuUHJvcFR5cGVzLnN0cmluZywgICAgICAgICAgIC8vIChhbnl8c3RhcnQpIG1hdGNoIHRoZSBzdGFydCBvciBlbnRpcmUgc3RyaW5nIHdoZW4gZmlsdGVyaW5nXG5cdFx0bWF0Y2hQcm9wOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLCAgICAgICAgICAvLyAoYW55fGxhYmVsfHZhbHVlKSB3aGljaCBvcHRpb24gcHJvcGVydHkgdG8gZmlsdGVyIG9uXG5cdFx0bWVudUJ1ZmZlcjogUmVhY3QuUHJvcFR5cGVzLm51bWJlciwgICAgICAgICAvLyBvcHRpb25hbCBidWZmZXIgKGluIHB4KSBiZXR3ZWVuIHRoZSBib3R0b20gb2YgdGhlIHZpZXdwb3J0IGFuZCB0aGUgYm90dG9tIG9mIHRoZSBtZW51XG5cdFx0bWVudUNvbnRhaW5lclN0eWxlOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LCAvLyBvcHRpb25hbCBzdHlsZSB0byBhcHBseSB0byB0aGUgbWVudSBjb250YWluZXJcblx0XHRtZW51UmVuZGVyZXI6IFJlYWN0LlByb3BUeXBlcy5mdW5jLCAgICAgICAgIC8vIHJlbmRlcnMgYSBjdXN0b20gbWVudSB3aXRoIG9wdGlvbnNcblx0XHRtZW51U3R5bGU6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QsICAgICAgICAgIC8vIG9wdGlvbmFsIHN0eWxlIHRvIGFwcGx5IHRvIHRoZSBtZW51XG5cdFx0bXVsdGk6IFJlYWN0LlByb3BUeXBlcy5ib29sLCAgICAgICAgICAgICAgICAvLyBtdWx0aS12YWx1ZSBpbnB1dFxuXHRcdG5hbWU6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsICAgICAgICAgICAgICAgLy8gZ2VuZXJhdGVzIGEgaGlkZGVuIDxpbnB1dCAvPiB0YWcgd2l0aCB0aGlzIGZpZWxkIG5hbWUgZm9yIGh0bWwgZm9ybXNcblx0XHRub1Jlc3VsdHNUZXh0OiBzdHJpbmdPck5vZGUsICAgICAgICAgICAgICAgIC8vIHBsYWNlaG9sZGVyIGRpc3BsYXllZCB3aGVuIHRoZXJlIGFyZSBubyBtYXRjaGluZyBzZWFyY2ggcmVzdWx0c1xuXHRcdG9uQmx1cjogUmVhY3QuUHJvcFR5cGVzLmZ1bmMsICAgICAgICAgICAgICAgLy8gb25CbHVyIGhhbmRsZXI6IGZ1bmN0aW9uIChldmVudCkge31cblx0XHRvbkJsdXJSZXNldHNJbnB1dDogUmVhY3QuUHJvcFR5cGVzLmJvb2wsICAgIC8vIHdoZXRoZXIgaW5wdXQgaXMgY2xlYXJlZCBvbiBibHVyXG5cdFx0b25DaGFuZ2U6IFJlYWN0LlByb3BUeXBlcy5mdW5jLCAgICAgICAgICAgICAvLyBvbkNoYW5nZSBoYW5kbGVyOiBmdW5jdGlvbiAobmV3VmFsdWUpIHt9XG5cdFx0b25DbG9zZTogUmVhY3QuUHJvcFR5cGVzLmZ1bmMsICAgICAgICAgICAgICAvLyBmaXJlcyB3aGVuIHRoZSBtZW51IGlzIGNsb3NlZFxuXHRcdG9uQ2xvc2VSZXNldHNJbnB1dDogUmVhY3QuUHJvcFR5cGVzLmJvb2wsXHRcdC8vIHdoZXRoZXIgaW5wdXQgaXMgY2xlYXJlZCB3aGVuIG1lbnUgaXMgY2xvc2VkIHRocm91Z2ggdGhlIGFycm93XG5cdFx0b25Gb2N1czogUmVhY3QuUHJvcFR5cGVzLmZ1bmMsICAgICAgICAgICAgICAvLyBvbkZvY3VzIGhhbmRsZXI6IGZ1bmN0aW9uIChldmVudCkge31cblx0XHRvbklucHV0Q2hhbmdlOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYywgICAgICAgIC8vIG9uSW5wdXRDaGFuZ2UgaGFuZGxlcjogZnVuY3Rpb24gKGlucHV0VmFsdWUpIHt9XG5cdFx0b25JbnB1dEtleURvd246IFJlYWN0LlByb3BUeXBlcy5mdW5jLCAgICAgICAvLyBpbnB1dCBrZXlEb3duIGhhbmRsZXI6IGZ1bmN0aW9uIChldmVudCkge31cblx0XHRvbk1lbnVTY3JvbGxUb0JvdHRvbTogUmVhY3QuUHJvcFR5cGVzLmZ1bmMsIC8vIGZpcmVzIHdoZW4gdGhlIG1lbnUgaXMgc2Nyb2xsZWQgdG8gdGhlIGJvdHRvbTsgY2FuIGJlIHVzZWQgdG8gcGFnaW5hdGUgb3B0aW9uc1xuXHRcdG9uT3BlbjogUmVhY3QuUHJvcFR5cGVzLmZ1bmMsICAgICAgICAgICAgICAgLy8gZmlyZXMgd2hlbiB0aGUgbWVudSBpcyBvcGVuZWRcblx0XHRvblZhbHVlQ2xpY2s6IFJlYWN0LlByb3BUeXBlcy5mdW5jLCAgICAgICAgIC8vIG9uQ2xpY2sgaGFuZGxlciBmb3IgdmFsdWUgbGFiZWxzOiBmdW5jdGlvbiAodmFsdWUsIGV2ZW50KSB7fVxuXHRcdG9wZW5BZnRlckZvY3VzOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbCwgICAgICAgLy8gYm9vbGVhbiB0byBlbmFibGUgb3BlbmluZyBkcm9wZG93biB3aGVuIGZvY3VzZWRcblx0XHRvcGVuT25Gb2N1czogUmVhY3QuUHJvcFR5cGVzLmJvb2wsICAgICAgICAgIC8vIGFsd2F5cyBvcGVuIG9wdGlvbnMgbWVudSBvbiBmb2N1c1xuXHRcdG9wdGlvbkNsYXNzTmFtZTogUmVhY3QuUHJvcFR5cGVzLnN0cmluZywgICAgLy8gYWRkaXRpb25hbCBjbGFzcyhlcykgdG8gYXBwbHkgdG8gdGhlIDxPcHRpb24gLz4gZWxlbWVudHNcblx0XHRvcHRpb25Db21wb25lbnQ6IFJlYWN0LlByb3BUeXBlcy5mdW5jLCAgICAgIC8vIG9wdGlvbiBjb21wb25lbnQgdG8gcmVuZGVyIGluIGRyb3Bkb3duXG5cdFx0b3B0aW9uR3JvdXBDb21wb25lbnQ6IFJlYWN0LlByb3BUeXBlcy5mdW5jLCAvLyBvcHRpb24gZ3JvdXAgY29tcG9uZW50IHRvIHJlbmRlciBpbiBkcm9wZG93blxuXHRcdG9wdGlvblJlbmRlcmVyOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYywgICAgICAgLy8gb3B0aW9uUmVuZGVyZXI6IGZ1bmN0aW9uIChvcHRpb24pIHt9XG5cdFx0b3B0aW9uczogUmVhY3QuUHJvcFR5cGVzLmFycmF5LCAgICAgICAgICAgICAvLyBhcnJheSBvZiBvcHRpb25zXG5cdFx0cGFnZVNpemU6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIsICAgICAgICAgICAvLyBudW1iZXIgb2YgZW50cmllcyB0byBwYWdlIHdoZW4gdXNpbmcgcGFnZSB1cC9kb3duIGtleXNcblx0XHRwbGFjZWhvbGRlcjogc3RyaW5nT3JOb2RlLCAgICAgICAgICAgICAgICAgIC8vIGZpZWxkIHBsYWNlaG9sZGVyLCBkaXNwbGF5ZWQgd2hlbiB0aGVyZSdzIG5vIHZhbHVlXG5cdFx0cmVuZGVySW52YWxpZFZhbHVlczogUmVhY3QuUHJvcFR5cGVzLmJvb2wsICAvLyBib29sZWFuIHRvIGVuYWJsZSByZW5kZXJpbmcgdmFsdWVzIHRoYXQgZG8gbm90IG1hdGNoIGFueSBvcHRpb25zXG5cdFx0cmVxdWlyZWQ6IFJlYWN0LlByb3BUeXBlcy5ib29sLCAgICAgICAgICAgICAvLyBhcHBsaWVzIEhUTUw1IHJlcXVpcmVkIGF0dHJpYnV0ZSB3aGVuIG5lZWRlZFxuXHRcdHJlc2V0VmFsdWU6IFJlYWN0LlByb3BUeXBlcy5hbnksICAgICAgICAgICAgLy8gdmFsdWUgdG8gdXNlIHdoZW4geW91IGNsZWFyIHRoZSBjb250cm9sXG5cdFx0c2Nyb2xsTWVudUludG9WaWV3OiBSZWFjdC5Qcm9wVHlwZXMuYm9vbCwgICAvLyBib29sZWFuIHRvIGVuYWJsZSB0aGUgdmlld3BvcnQgdG8gc2hpZnQgc28gdGhhdCB0aGUgZnVsbCBtZW51IGZ1bGx5IHZpc2libGUgd2hlbiBlbmdhZ2VkXG5cdFx0c2VhcmNoYWJsZTogUmVhY3QuUHJvcFR5cGVzLmJvb2wsICAgICAgICAgICAvLyB3aGV0aGVyIHRvIGVuYWJsZSBzZWFyY2hpbmcgZmVhdHVyZSBvciBub3RcbiAgICBzZWxlY3RHcm91cDogUmVhY3QuUHJvcFR5cGVzLmJvb2wsICAgICAgICAgIC8vIGJvb2xlYW4gdG8gYWxsb3cgc2VsZWN0aW9uIG9mIGVudHJpcmUgR3JvdXBzXG5cdFx0c2ltcGxlVmFsdWU6IFJlYWN0LlByb3BUeXBlcy5ib29sLCAgICAgICAgICAvLyBwYXNzIHRoZSB2YWx1ZSB0byBvbkNoYW5nZSBhcyBhIHNpbXBsZSB2YWx1ZSAobGVnYWN5IHByZSAxLjAgbW9kZSksIGRlZmF1bHRzIHRvIGZhbHNlXG5cdFx0c3R5bGU6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QsICAgICAgICAgICAgICAvLyBvcHRpb25hbCBzdHlsZSB0byBhcHBseSB0byB0aGUgY29udHJvbFxuXHRcdHRhYkluZGV4OiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLCAgICAgICAgICAgLy8gb3B0aW9uYWwgdGFiIGluZGV4IG9mIHRoZSBjb250cm9sXG5cdFx0dGFiU2VsZWN0c1ZhbHVlOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbCwgICAgICAvLyB3aGV0aGVyIHRvIHRyZWF0IHRhYmJpbmcgb3V0IHdoaWxlIGZvY3VzZWQgdG8gYmUgdmFsdWUgc2VsZWN0aW9uXG5cdFx0dmFsdWU6IFJlYWN0LlByb3BUeXBlcy5hbnksICAgICAgICAgICAgICAgICAvLyBpbml0aWFsIGZpZWxkIHZhbHVlXG5cdFx0dmFsdWVDb21wb25lbnQ6IFJlYWN0LlByb3BUeXBlcy5mdW5jLCAgICAgICAvLyB2YWx1ZSBjb21wb25lbnQgdG8gcmVuZGVyXG5cdFx0dmFsdWVLZXk6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsICAgICAgICAgICAvLyBwYXRoIG9mIHRoZSBsYWJlbCB2YWx1ZSBpbiBvcHRpb24gb2JqZWN0c1xuXHRcdHZhbHVlUmVuZGVyZXI6IFJlYWN0LlByb3BUeXBlcy5mdW5jLCAgICAgICAgLy8gdmFsdWVSZW5kZXJlcjogZnVuY3Rpb24gKG9wdGlvbikge31cblx0XHR3cmFwcGVyU3R5bGU6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QsICAgICAgIC8vIG9wdGlvbmFsIHN0eWxlIHRvIGFwcGx5IHRvIHRoZSBjb21wb25lbnQgd3JhcHBlclxuXHR9LFxuXG5cdHN0YXRpY3M6IHsgQXN5bmMsIEFzeW5jQ3JlYXRhYmxlLCBDcmVhdGFibGUgfSxcblxuXHRnZXREZWZhdWx0UHJvcHMgKCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRhZGRMYWJlbFRleHQ6ICdBZGQgXCJ7bGFiZWx9XCI/Jyxcblx0XHRcdGFycm93UmVuZGVyZXI6IGRlZmF1bHRBcnJvd1JlbmRlcmVyLFxuXHRcdFx0YXV0b3NpemU6IHRydWUsXG5cdFx0XHRiYWNrc3BhY2VSZW1vdmVzOiB0cnVlLFxuXHRcdFx0YmFja3NwYWNlVG9SZW1vdmVNZXNzYWdlOiAnUHJlc3MgYmFja3NwYWNlIHRvIHJlbW92ZSB7bGFiZWx9Jyxcblx0XHRcdGNsZWFyYWJsZTogdHJ1ZSxcblx0XHRcdGNsZWFyQWxsVGV4dDogJ0NsZWFyIGFsbCcsXG5cdFx0XHRjbGVhclZhbHVlVGV4dDogJ0NsZWFyIHZhbHVlJyxcblx0XHRcdGRlbGltaXRlcjogJywnLFxuXHRcdFx0ZGlzYWJsZWQ6IGZhbHNlLFxuXHRcdFx0ZHJvcGRvd25Db21wb25lbnQ6IERyb3Bkb3duLFxuXHRcdFx0ZXNjYXBlQ2xlYXJzVmFsdWU6IHRydWUsXG5cdFx0XHRmaWx0ZXJPcHRpb25zOiBkZWZhdWx0RmlsdGVyT3B0aW9ucyxcblx0XHRcdGlnbm9yZUFjY2VudHM6IHRydWUsXG5cdFx0XHRpZ25vcmVDYXNlOiB0cnVlLFxuXHRcdFx0aW5wdXRQcm9wczoge30sXG5cdFx0XHRpc0xvYWRpbmc6IGZhbHNlLFxuXHRcdFx0am9pblZhbHVlczogZmFsc2UsXG5cdFx0XHRsYWJlbEtleTogJ2xhYmVsJyxcblx0XHRcdG1hdGNoUG9zOiAnYW55Jyxcblx0XHRcdG1hdGNoUHJvcDogJ2FueScsXG5cdFx0XHRtZW51QnVmZmVyOiAwLFxuXHRcdFx0bWVudVJlbmRlcmVyOiBkZWZhdWx0TWVudVJlbmRlcmVyLFxuXHRcdFx0bXVsdGk6IGZhbHNlLFxuXHRcdFx0bm9SZXN1bHRzVGV4dDogJ05vIHJlc3VsdHMgZm91bmQnLFxuXHRcdFx0b25CbHVyUmVzZXRzSW5wdXQ6IHRydWUsXG5cdFx0XHRvbkNsb3NlUmVzZXRzSW5wdXQ6IHRydWUsXG5cdFx0XHRvcGVuQWZ0ZXJGb2N1czogZmFsc2UsXG5cdFx0XHRvcHRpb25Db21wb25lbnQ6IE9wdGlvbixcblx0XHRcdG9wdGlvbkdyb3VwQ29tcG9uZW50OiBPcHRpb25Hcm91cCxcblx0XHRcdHBhZ2VTaXplOiA1LFxuXHRcdFx0cGxhY2Vob2xkZXI6ICdTZWxlY3QuLi4nLFxuXHRcdFx0cmVuZGVySW52YWxpZFZhbHVlczogZmFsc2UsXG5cdFx0XHRyZXF1aXJlZDogZmFsc2UsXG5cdFx0XHRzY3JvbGxNZW51SW50b1ZpZXc6IHRydWUsXG5cdFx0XHRzZWFyY2hhYmxlOiB0cnVlLFxuICAgICAgc2VsZWN0R3JvdXA6IGZhbHNlLFxuXHRcdFx0c2ltcGxlVmFsdWU6IGZhbHNlLFxuXHRcdFx0dGFiU2VsZWN0c1ZhbHVlOiB0cnVlLFxuXHRcdFx0dmFsdWVDb21wb25lbnQ6IFZhbHVlLFxuXHRcdFx0dmFsdWVLZXk6ICd2YWx1ZScsXG5cdFx0fTtcblx0fSxcblxuXHRnZXRJbml0aWFsU3RhdGUgKCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRpbnB1dFZhbHVlOiAnJyxcblx0XHRcdGlzRm9jdXNlZDogZmFsc2UsXG5cdFx0XHRpc09wZW46IGZhbHNlLFxuXHRcdFx0aXNQc2V1ZG9Gb2N1c2VkOiBmYWxzZSxcblx0XHRcdHJlcXVpcmVkOiBmYWxzZSxcblx0XHR9O1xuXHR9LFxuXG5cdGNvbXBvbmVudFdpbGxNb3VudCgpIHtcblx0XHR0aGlzLl9mbGF0T3B0aW9ucyA9IHRoaXMuZmxhdHRlbk9wdGlvbnModGhpcy5wcm9wcy5vcHRpb25zKTtcblx0XHR0aGlzLl9pbnN0YW5jZVByZWZpeCA9ICdyZWFjdC1zZWxlY3QtJyArICh0aGlzLnByb3BzLmluc3RhbmNlSWQgfHwgKytpbnN0YW5jZUlkKSArICctJztcblx0XHRjb25zdCB2YWx1ZUFycmF5ID0gdGhpcy5nZXRWYWx1ZUFycmF5KHRoaXMucHJvcHMudmFsdWUpO1xuXG5cdFx0aWYgKHRoaXMucHJvcHMucmVxdWlyZWQpIHtcblx0XHRcdHRoaXMuc2V0U3RhdGUoe1xuXHRcdFx0XHRyZXF1aXJlZDogdGhpcy5oYW5kbGVSZXF1aXJlZCh2YWx1ZUFycmF5WzBdLCB0aGlzLnByb3BzLm11bHRpKSxcblx0XHRcdH0pO1xuXHRcdH1cblx0fSxcblxuXHRjb21wb25lbnREaWRNb3VudCAoKSB7XG5cdFx0aWYgKHRoaXMucHJvcHMuYXV0b2ZvY3VzKSB7XG5cdFx0XHR0aGlzLmZvY3VzKCk7XG5cdFx0fVxuXHR9LFxuXG5cdGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMobmV4dFByb3BzKSB7XG5cdFx0aWYgKG5leHRQcm9wcy5vcHRpb25zICE9PSB0aGlzLnByb3BzLm9wdGlvbnMpIHtcblx0XHRcdHRoaXMuX2ZsYXRPcHRpb25zID0gdGhpcy5mbGF0dGVuT3B0aW9ucyhuZXh0UHJvcHMub3B0aW9ucyk7XG5cdFx0fVxuXG5cdFx0Y29uc3QgdmFsdWVBcnJheSA9IHRoaXMuZ2V0VmFsdWVBcnJheShuZXh0UHJvcHMudmFsdWUsIG5leHRQcm9wcyk7XG5cblx0XHRpZiAobmV4dFByb3BzLnJlcXVpcmVkKSB7XG5cdFx0XHR0aGlzLnNldFN0YXRlKHtcblx0XHRcdFx0cmVxdWlyZWQ6IHRoaXMuaGFuZGxlUmVxdWlyZWQodmFsdWVBcnJheVswXSwgbmV4dFByb3BzLm11bHRpKSxcblx0XHRcdH0pO1xuXHRcdH1cblx0fSxcblxuXHRjb21wb25lbnRXaWxsVXBkYXRlIChuZXh0UHJvcHMsIG5leHRTdGF0ZSkge1xuXHRcdGlmIChuZXh0U3RhdGUuaXNPcGVuICE9PSB0aGlzLnN0YXRlLmlzT3Blbikge1xuXHRcdFx0dGhpcy50b2dnbGVUb3VjaE91dHNpZGVFdmVudChuZXh0U3RhdGUuaXNPcGVuKTtcblx0XHRcdGNvbnN0IGhhbmRsZXIgPSBuZXh0U3RhdGUuaXNPcGVuID8gbmV4dFByb3BzLm9uT3BlbiA6IG5leHRQcm9wcy5vbkNsb3NlO1xuXHRcdFx0aGFuZGxlciAmJiBoYW5kbGVyKCk7XG5cdFx0fVxuXHR9LFxuXG5cdGNvbXBvbmVudERpZFVwZGF0ZSAocHJldlByb3BzLCBwcmV2U3RhdGUpIHtcblx0XHQvLyBmb2N1cyB0byB0aGUgc2VsZWN0ZWQgb3B0aW9uXG5cdFx0aWYgKHRoaXMubWVudSAmJiB0aGlzLmZvY3VzZWQgJiYgdGhpcy5zdGF0ZS5pc09wZW4gJiYgIXRoaXMuaGFzU2Nyb2xsZWRUb09wdGlvbikge1xuXHRcdFx0bGV0IGZvY3VzZWRPcHRpb25Ob2RlID0gUmVhY3RET00uZmluZERPTU5vZGUodGhpcy5mb2N1c2VkKTtcbiAgICAgIGxldCBmb2N1c2VkT3B0aW9uUHJldmlvdXNTaWJsaW5nID0gZm9jdXNlZE9wdGlvbk5vZGUucHJldmlvdXNTaWJsaW5nO1xuICAgICAgbGV0IGZvY3VzZWRPcHRpb25QYXJlbnQgPSBmb2N1c2VkT3B0aW9uTm9kZS5wYXJlbnRFbGVtZW50O1xuICAgICAgbGV0IG1lbnVOb2RlID0gUmVhY3RET00uZmluZERPTU5vZGUodGhpcy5tZW51KTtcbiAgICAgIGlmIChmb2N1c2VkT3B0aW9uUHJldmlvdXNTaWJsaW5nKSB7XG4gICAgICAgIG1lbnVOb2RlLnNjcm9sbFRvcCA9IGZvY3VzZWRPcHRpb25QcmV2aW91c1NpYmxpbmcub2Zmc2V0VG9wO1xuICAgICAgfSBlbHNlIGlmIChmb2N1c2VkT3B0aW9uUGFyZW50ICYmIGZvY3VzZWRPcHRpb25QYXJlbnQgPT09ICdTZWxlY3QtbWVudScpIHtcbiAgICAgICAgbWVudU5vZGUuc2Nyb2xsVG9wID0gZm9jdXNlZE9wdGlvblBhcmVudC5vZmZzZXRUb3A7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBtZW51Tm9kZS5zY3JvbGxUb3AgPSBmb2N1c2VkT3B0aW9uTm9kZS5vZmZzZXRUb3A7XG4gICAgICB9XG5cdFx0XHR0aGlzLmhhc1Njcm9sbGVkVG9PcHRpb24gPSB0cnVlO1xuXHRcdH0gZWxzZSBpZiAoIXRoaXMuc3RhdGUuaXNPcGVuKSB7XG5cdFx0XHR0aGlzLmhhc1Njcm9sbGVkVG9PcHRpb24gPSBmYWxzZTtcblx0XHR9XG5cblx0XHRpZiAodGhpcy5fc2Nyb2xsVG9Gb2N1c2VkT3B0aW9uT25VcGRhdGUgJiYgdGhpcy5mb2N1c2VkICYmIHRoaXMubWVudSkge1xuXHRcdFx0dGhpcy5fc2Nyb2xsVG9Gb2N1c2VkT3B0aW9uT25VcGRhdGUgPSBmYWxzZTtcblx0XHRcdHZhciBmb2N1c2VkRE9NID0gUmVhY3RET00uZmluZERPTU5vZGUodGhpcy5mb2N1c2VkKTtcblx0XHRcdHZhciBtZW51RE9NID0gUmVhY3RET00uZmluZERPTU5vZGUodGhpcy5tZW51KTtcblx0XHRcdHZhciBmb2N1c2VkUmVjdCA9IGZvY3VzZWRET00uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cdFx0XHR2YXIgbWVudVJlY3QgPSBtZW51RE9NLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXHRcdFx0aWYgKGZvY3VzZWRSZWN0LmJvdHRvbSA+IG1lbnVSZWN0LmJvdHRvbSB8fCBmb2N1c2VkUmVjdC50b3AgPCBtZW51UmVjdC50b3ApIHtcblx0XHRcdFx0bWVudURPTS5zY3JvbGxUb3AgPSAoZm9jdXNlZERPTS5vZmZzZXRUb3AgKyBmb2N1c2VkRE9NLmNsaWVudEhlaWdodCAtIG1lbnVET00ub2Zmc2V0SGVpZ2h0KTtcblx0XHRcdH1cblx0XHR9XG5cdFx0aWYgKHRoaXMucHJvcHMuc2Nyb2xsTWVudUludG9WaWV3ICYmIHRoaXMubWVudUNvbnRhaW5lcikge1xuXHRcdFx0dmFyIG1lbnVDb250YWluZXJSZWN0ID0gdGhpcy5tZW51Q29udGFpbmVyLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXHRcdFx0aWYgKHdpbmRvdy5pbm5lckhlaWdodCA8IG1lbnVDb250YWluZXJSZWN0LmJvdHRvbSArIHRoaXMucHJvcHMubWVudUJ1ZmZlcikge1xuXHRcdFx0XHR3aW5kb3cuc2Nyb2xsQnkoMCwgbWVudUNvbnRhaW5lclJlY3QuYm90dG9tICsgdGhpcy5wcm9wcy5tZW51QnVmZmVyIC0gd2luZG93LmlubmVySGVpZ2h0KTtcblx0XHRcdH1cblx0XHR9XG5cdFx0aWYgKHByZXZQcm9wcy5kaXNhYmxlZCAhPT0gdGhpcy5wcm9wcy5kaXNhYmxlZCkge1xuXHRcdFx0dGhpcy5zZXRTdGF0ZSh7IGlzRm9jdXNlZDogZmFsc2UgfSk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgcmVhY3Qvbm8tZGlkLXVwZGF0ZS1zZXQtc3RhdGVcblx0XHRcdHRoaXMuY2xvc2VNZW51KCk7XG5cdFx0fVxuXHR9LFxuXG5cdGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xuXHRcdGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCB0aGlzLmhhbmRsZVRvdWNoT3V0c2lkZSk7XG5cdH0sXG5cblx0dG9nZ2xlVG91Y2hPdXRzaWRlRXZlbnQoZW5hYmxlZCkge1xuXHRcdGlmIChlbmFibGVkKSB7XG5cdFx0XHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgdGhpcy5oYW5kbGVUb3VjaE91dHNpZGUpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgdGhpcy5oYW5kbGVUb3VjaE91dHNpZGUpO1xuXHRcdH1cblx0fSxcblxuXHRoYW5kbGVUb3VjaE91dHNpZGUoZXZlbnQpIHtcblx0XHQvLyBoYW5kbGUgdG91Y2ggb3V0c2lkZSBvbiBpb3MgdG8gZGlzbWlzcyBtZW51XG5cdFx0aWYgKHRoaXMud3JhcHBlciAmJiAhdGhpcy53cmFwcGVyLmNvbnRhaW5zKGV2ZW50LnRhcmdldCkgJiZcbiAgICAgICAgdGhpcy5tZW51Q29udGFpbmVyICYmICF0aGlzLm1lbnVDb250YWluZXIuY29udGFpbnMoZXZlbnQudGFyZ2V0KSkge1xuXHRcdFx0dGhpcy5jbG9zZU1lbnUoKTtcblx0XHR9XG5cdH0sXG5cblx0Zm9jdXMgKCkge1xuXHRcdGlmICghdGhpcy5pbnB1dCkgcmV0dXJuO1xuXHRcdHRoaXMuaW5wdXQuZm9jdXMoKTtcblxuXHRcdGlmICh0aGlzLnByb3BzLm9wZW5BZnRlckZvY3VzKSB7XG5cdFx0XHR0aGlzLnNldFN0YXRlKHtcblx0XHRcdFx0aXNPcGVuOiB0cnVlLFxuXHRcdFx0fSk7XG5cdFx0fVxuXHR9LFxuXG5cdGJsdXJJbnB1dCgpIHtcblx0XHRpZiAoIXRoaXMuaW5wdXQpIHJldHVybjtcblx0XHR0aGlzLmlucHV0LmJsdXIoKTtcblx0fSxcblxuXHRoYW5kbGVUb3VjaE1vdmUgKGV2ZW50KSB7XG5cdFx0Ly8gU2V0IGEgZmxhZyB0aGF0IHRoZSB2aWV3IGlzIGJlaW5nIGRyYWdnZWRcblx0XHR0aGlzLmRyYWdnaW5nID0gdHJ1ZTtcblx0fSxcblxuXHRoYW5kbGVUb3VjaFN0YXJ0IChldmVudCkge1xuXHRcdC8vIFNldCBhIGZsYWcgdGhhdCB0aGUgdmlldyBpcyBub3QgYmVpbmcgZHJhZ2dlZFxuXHRcdHRoaXMuZHJhZ2dpbmcgPSBmYWxzZTtcblx0fSxcblxuXHRoYW5kbGVUb3VjaEVuZCAoZXZlbnQpIHtcblx0XHQvLyBDaGVjayBpZiB0aGUgdmlldyBpcyBiZWluZyBkcmFnZ2VkLCBJbiB0aGlzIGNhc2Vcblx0XHQvLyB3ZSBkb24ndCB3YW50IHRvIGZpcmUgdGhlIGNsaWNrIGV2ZW50IChiZWNhdXNlIHRoZSB1c2VyIG9ubHkgd2FudHMgdG8gc2Nyb2xsKVxuXHRcdGlmKHRoaXMuZHJhZ2dpbmcpIHJldHVybjtcblxuXHRcdC8vIEZpcmUgdGhlIG1vdXNlIGV2ZW50c1xuXHRcdHRoaXMuaGFuZGxlTW91c2VEb3duKGV2ZW50KTtcblx0fSxcblxuXHRoYW5kbGVUb3VjaEVuZENsZWFyVmFsdWUgKGV2ZW50KSB7XG5cdFx0Ly8gQ2hlY2sgaWYgdGhlIHZpZXcgaXMgYmVpbmcgZHJhZ2dlZCwgSW4gdGhpcyBjYXNlXG5cdFx0Ly8gd2UgZG9uJ3Qgd2FudCB0byBmaXJlIHRoZSBjbGljayBldmVudCAoYmVjYXVzZSB0aGUgdXNlciBvbmx5IHdhbnRzIHRvIHNjcm9sbClcblx0XHRpZih0aGlzLmRyYWdnaW5nKSByZXR1cm47XG5cblx0XHQvLyBDbGVhciB0aGUgdmFsdWVcblx0XHR0aGlzLmNsZWFyVmFsdWUoZXZlbnQpO1xuXHR9LFxuXG5cdGhhbmRsZU1vdXNlRG93biAoZXZlbnQpIHtcblx0XHQvLyBpZiB0aGUgZXZlbnQgd2FzIHRyaWdnZXJlZCBieSBhIG1vdXNlZG93biBhbmQgbm90IHRoZSBwcmltYXJ5XG5cdFx0Ly8gYnV0dG9uLCBvciBpZiB0aGUgY29tcG9uZW50IGlzIGRpc2FibGVkLCBpZ25vcmUgaXQuXG5cdFx0aWYgKHRoaXMucHJvcHMuZGlzYWJsZWQgfHwgKGV2ZW50LnR5cGUgPT09ICdtb3VzZWRvd24nICYmIGV2ZW50LmJ1dHRvbiAhPT0gMCkpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRpZiAoZXZlbnQudGFyZ2V0LnRhZ05hbWUgPT09ICdJTlBVVCcpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHQvLyBwcmV2ZW50IGRlZmF1bHQgZXZlbnQgaGFuZGxlcnNcblx0XHRldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0Ly8gZm9yIHRoZSBub24tc2VhcmNoYWJsZSBzZWxlY3QsIHRvZ2dsZSB0aGUgbWVudVxuXHRcdGlmICghdGhpcy5wcm9wcy5zZWFyY2hhYmxlKSB7XG5cdFx0XHR0aGlzLmZvY3VzKCk7XG5cdFx0XHRyZXR1cm4gdGhpcy5zZXRTdGF0ZSh7XG5cdFx0XHRcdGlzT3BlbjogIXRoaXMuc3RhdGUuaXNPcGVuLFxuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXMuc3RhdGUuaXNGb2N1c2VkKSB7XG5cdFx0XHQvLyBPbiBpT1MsIHdlIGNhbiBnZXQgaW50byBhIHN0YXRlIHdoZXJlIHdlIHRoaW5rIHRoZSBpbnB1dCBpcyBmb2N1c2VkIGJ1dCBpdCBpc24ndCByZWFsbHksXG5cdFx0XHQvLyBzaW5jZSBpT1MgaWdub3JlcyBwcm9ncmFtbWF0aWMgY2FsbHMgdG8gaW5wdXQuZm9jdXMoKSB0aGF0IHdlcmVuJ3QgdHJpZ2dlcmVkIGJ5IGEgY2xpY2sgZXZlbnQuXG5cdFx0XHQvLyBDYWxsIGZvY3VzKCkgYWdhaW4gaGVyZSB0byBiZSBzYWZlLlxuXHRcdFx0dGhpcy5mb2N1cygpO1xuXG5cdFx0XHRsZXQgaW5wdXQgPSB0aGlzLmlucHV0O1xuXHRcdFx0aWYgKHR5cGVvZiBpbnB1dC5nZXRJbnB1dCA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0XHQvLyBHZXQgdGhlIGFjdHVhbCBET00gaW5wdXQgaWYgdGhlIHJlZiBpcyBhbiA8QXV0b3NpemVJbnB1dCAvPiBjb21wb25lbnRcblx0XHRcdFx0aW5wdXQgPSBpbnB1dC5nZXRJbnB1dCgpO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBjbGVhcnMgdGhlIHZhbHVlIHNvIHRoYXQgdGhlIGN1cnNvciB3aWxsIGJlIGF0IHRoZSBlbmQgb2YgaW5wdXQgd2hlbiB0aGUgY29tcG9uZW50IHJlLXJlbmRlcnNcblx0XHRcdGlucHV0LnZhbHVlID0gJyc7XG5cblx0XHRcdC8vIGlmIHRoZSBpbnB1dCBpcyBmb2N1c2VkLCBlbnN1cmUgdGhlIG1lbnUgaXMgb3BlblxuXHRcdFx0dGhpcy5zZXRTdGF0ZSh7XG5cdFx0XHRcdGlzT3BlbjogdHJ1ZSxcblx0XHRcdFx0aXNQc2V1ZG9Gb2N1c2VkOiBmYWxzZSxcblx0XHRcdH0pO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQvLyBvdGhlcndpc2UsIGZvY3VzIHRoZSBpbnB1dCBhbmQgb3BlbiB0aGUgbWVudVxuXHRcdFx0dGhpcy5fb3BlbkFmdGVyRm9jdXMgPSB0cnVlO1xuXHRcdFx0dGhpcy5mb2N1cygpO1xuXHRcdH1cblx0fSxcblxuXHRoYW5kbGVNb3VzZURvd25PbkFycm93IChldmVudCkge1xuXHRcdC8vIGlmIHRoZSBldmVudCB3YXMgdHJpZ2dlcmVkIGJ5IGEgbW91c2Vkb3duIGFuZCBub3QgdGhlIHByaW1hcnlcblx0XHQvLyBidXR0b24sIG9yIGlmIHRoZSBjb21wb25lbnQgaXMgZGlzYWJsZWQsIGlnbm9yZSBpdC5cblx0XHRpZiAodGhpcy5wcm9wcy5kaXNhYmxlZCB8fCAoZXZlbnQudHlwZSA9PT0gJ21vdXNlZG93bicgJiYgZXZlbnQuYnV0dG9uICE9PSAwKSkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHQvLyBJZiB0aGUgbWVudSBpc24ndCBvcGVuLCBsZXQgdGhlIGV2ZW50IGJ1YmJsZSB0byB0aGUgbWFpbiBoYW5kbGVNb3VzZURvd25cblx0XHRpZiAoIXRoaXMuc3RhdGUuaXNPcGVuKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdC8vIHByZXZlbnQgZGVmYXVsdCBldmVudCBoYW5kbGVyc1xuXHRcdGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0Ly8gY2xvc2UgdGhlIG1lbnVcblx0XHR0aGlzLmNsb3NlTWVudSgpO1xuXHR9LFxuXG5cdGhhbmRsZU1vdXNlRG93bk9uTWVudSAoZXZlbnQpIHtcblx0XHQvLyBpZiB0aGUgZXZlbnQgd2FzIHRyaWdnZXJlZCBieSBhIG1vdXNlZG93biBhbmQgbm90IHRoZSBwcmltYXJ5XG5cdFx0Ly8gYnV0dG9uLCBvciBpZiB0aGUgY29tcG9uZW50IGlzIGRpc2FibGVkLCBpZ25vcmUgaXQuXG5cdFx0aWYgKHRoaXMucHJvcHMuZGlzYWJsZWQgfHwgKGV2ZW50LnR5cGUgPT09ICdtb3VzZWRvd24nICYmIGV2ZW50LmJ1dHRvbiAhPT0gMCkpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuXHRcdHRoaXMuX29wZW5BZnRlckZvY3VzID0gdHJ1ZTtcblx0XHR0aGlzLmZvY3VzKCk7XG5cdH0sXG5cblx0Y2xvc2VNZW51ICgpIHtcblx0XHRpZih0aGlzLnByb3BzLm9uQ2xvc2VSZXNldHNJbnB1dCkge1xuXHRcdFx0dGhpcy5zZXRTdGF0ZSh7XG5cdFx0XHRcdGlzT3BlbjogZmFsc2UsXG5cdFx0XHRcdGlzUHNldWRvRm9jdXNlZDogdGhpcy5zdGF0ZS5pc0ZvY3VzZWQgJiYgIXRoaXMucHJvcHMubXVsdGksXG5cdFx0XHRcdGlucHV0VmFsdWU6ICcnXG5cdFx0XHR9KTtcblx0XHR9XHRlbHNlIHtcblx0XHRcdHRoaXMuc2V0U3RhdGUoe1xuXHRcdFx0XHRpc09wZW46IGZhbHNlLFxuXHRcdFx0XHRpc1BzZXVkb0ZvY3VzZWQ6IHRoaXMuc3RhdGUuaXNGb2N1c2VkICYmICF0aGlzLnByb3BzLm11bHRpLFxuXHRcdFx0XHRpbnB1dFZhbHVlOiB0aGlzLnN0YXRlLmlucHV0VmFsdWVcblx0XHRcdH0pO1xuXHRcdH1cblx0XHR0aGlzLmhhc1Njcm9sbGVkVG9PcHRpb24gPSBmYWxzZTtcblx0fSxcblxuXHRoYW5kbGVJbnB1dEZvY3VzIChldmVudCkge1xuXHRcdGlmICh0aGlzLnByb3BzLmRpc2FibGVkKSByZXR1cm47XG5cdFx0dmFyIGlzT3BlbiA9IHRoaXMuc3RhdGUuaXNPcGVuIHx8IHRoaXMuX29wZW5BZnRlckZvY3VzIHx8IHRoaXMucHJvcHMub3Blbk9uRm9jdXM7XG5cdFx0aWYgKHRoaXMucHJvcHMub25Gb2N1cykge1xuXHRcdFx0dGhpcy5wcm9wcy5vbkZvY3VzKGV2ZW50KTtcblx0XHR9XG5cdFx0dGhpcy5zZXRTdGF0ZSh7XG5cdFx0XHRpc0ZvY3VzZWQ6IHRydWUsXG5cdFx0XHRpc09wZW46IGlzT3BlblxuXHRcdH0pO1xuXHRcdHRoaXMuX29wZW5BZnRlckZvY3VzID0gZmFsc2U7XG5cdH0sXG5cblx0aGFuZGxlSW5wdXRCbHVyIChldmVudCkge1xuXHRcdC8vIFRoZSBjaGVjayBmb3IgbWVudS5jb250YWlucyhhY3RpdmVFbGVtZW50KSBpcyBuZWNlc3NhcnkgdG8gcHJldmVudCBJRTExJ3Mgc2Nyb2xsYmFyIGZyb20gY2xvc2luZyB0aGUgbWVudSBpbiBjZXJ0YWluIGNvbnRleHRzLlxuXHRcdGlmICh0aGlzLm1lbnUgJiYgKHRoaXMubWVudSA9PT0gZG9jdW1lbnQuYWN0aXZlRWxlbWVudCB8fCB0aGlzLm1lbnUuY29udGFpbnMoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCkpKSB7XG5cdFx0XHR0aGlzLmZvY3VzKCk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXMucHJvcHMub25CbHVyKSB7XG5cdFx0XHR0aGlzLnByb3BzLm9uQmx1cihldmVudCk7XG5cdFx0fVxuXHRcdHZhciBvbkJsdXJyZWRTdGF0ZSA9IHtcblx0XHRcdGlzRm9jdXNlZDogZmFsc2UsXG5cdFx0XHRpc09wZW46IGZhbHNlLFxuXHRcdFx0aXNQc2V1ZG9Gb2N1c2VkOiBmYWxzZSxcblx0XHR9O1xuXHRcdGlmICh0aGlzLnByb3BzLm9uQmx1clJlc2V0c0lucHV0KSB7XG5cdFx0XHRvbkJsdXJyZWRTdGF0ZS5pbnB1dFZhbHVlID0gJyc7XG5cdFx0fVxuXHRcdHRoaXMuc2V0U3RhdGUob25CbHVycmVkU3RhdGUpO1xuXHR9LFxuXG5cdGhhbmRsZUlucHV0Q2hhbmdlIChldmVudCkge1xuXHRcdGxldCBuZXdJbnB1dFZhbHVlID0gZXZlbnQudGFyZ2V0LnZhbHVlO1xuXG5cdFx0aWYgKHRoaXMuc3RhdGUuaW5wdXRWYWx1ZSAhPT0gZXZlbnQudGFyZ2V0LnZhbHVlICYmIHRoaXMucHJvcHMub25JbnB1dENoYW5nZSkge1xuXHRcdFx0bGV0IG5leHRTdGF0ZSA9IHRoaXMucHJvcHMub25JbnB1dENoYW5nZShuZXdJbnB1dFZhbHVlKTtcblx0XHRcdC8vIE5vdGU6ICE9IHVzZWQgZGVsaWJlcmF0ZWx5IGhlcmUgdG8gY2F0Y2ggdW5kZWZpbmVkIGFuZCBudWxsXG5cdFx0XHRpZiAobmV4dFN0YXRlICE9IG51bGwgJiYgdHlwZW9mIG5leHRTdGF0ZSAhPT0gJ29iamVjdCcpIHtcblx0XHRcdFx0bmV3SW5wdXRWYWx1ZSA9ICcnICsgbmV4dFN0YXRlO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHRoaXMuc2V0U3RhdGUoe1xuXHRcdFx0aXNPcGVuOiB0cnVlLFxuXHRcdFx0aXNQc2V1ZG9Gb2N1c2VkOiBmYWxzZSxcblx0XHRcdGlucHV0VmFsdWU6IG5ld0lucHV0VmFsdWVcblx0XHR9KTtcblx0fSxcblxuXHRoYW5kbGVLZXlEb3duIChldmVudCkge1xuXHRcdGlmICh0aGlzLnByb3BzLmRpc2FibGVkKSByZXR1cm47XG5cblx0XHRpZiAodHlwZW9mIHRoaXMucHJvcHMub25JbnB1dEtleURvd24gPT09ICdmdW5jdGlvbicpIHtcblx0XHRcdHRoaXMucHJvcHMub25JbnB1dEtleURvd24oZXZlbnQpO1xuXHRcdFx0aWYgKGV2ZW50LmRlZmF1bHRQcmV2ZW50ZWQpIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHN3aXRjaCAoZXZlbnQua2V5Q29kZSkge1xuXHRcdFx0Y2FzZSA4OiAvLyBiYWNrc3BhY2Vcblx0XHRcdFx0aWYgKCF0aGlzLnN0YXRlLmlucHV0VmFsdWUgJiYgdGhpcy5wcm9wcy5iYWNrc3BhY2VSZW1vdmVzKSB7XG5cdFx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0XHR0aGlzLnBvcFZhbHVlKCk7XG5cdFx0XHRcdH1cblx0XHRcdHJldHVybjtcblx0XHRcdGNhc2UgOTogLy8gdGFiXG5cdFx0XHRcdGlmIChldmVudC5zaGlmdEtleSB8fCAhdGhpcy5zdGF0ZS5pc09wZW4gfHwgIXRoaXMucHJvcHMudGFiU2VsZWN0c1ZhbHVlKSB7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHRoaXMuc2VsZWN0Rm9jdXNlZE9wdGlvbigpO1xuXHRcdFx0cmV0dXJuO1xuXHRcdFx0Y2FzZSAxMzogLy8gZW50ZXJcblx0XHRcdFx0aWYgKCF0aGlzLnN0YXRlLmlzT3BlbikgcmV0dXJuO1xuXHRcdFx0XHRldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblx0XHRcdFx0dGhpcy5zZWxlY3RGb2N1c2VkT3B0aW9uKCk7XG5cdFx0XHRicmVhaztcblx0XHRcdGNhc2UgMjc6IC8vIGVzY2FwZVxuXHRcdFx0XHRpZiAodGhpcy5zdGF0ZS5pc09wZW4pIHtcblx0XHRcdFx0XHR0aGlzLmNsb3NlTWVudSgpO1xuXHRcdFx0XHRcdGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXHRcdFx0XHR9IGVsc2UgaWYgKHRoaXMucHJvcHMuY2xlYXJhYmxlICYmIHRoaXMucHJvcHMuZXNjYXBlQ2xlYXJzVmFsdWUpIHtcblx0XHRcdFx0XHR0aGlzLmNsZWFyVmFsdWUoZXZlbnQpO1xuXHRcdFx0XHRcdGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXHRcdFx0XHR9XG5cdFx0XHRicmVhaztcblx0XHRcdGNhc2UgMzg6IC8vIHVwXG5cdFx0XHRcdHRoaXMuZm9jdXNQcmV2aW91c09wdGlvbigpO1xuXHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIDQwOiAvLyBkb3duXG5cdFx0XHRcdHRoaXMuZm9jdXNOZXh0T3B0aW9uKCk7XG5cdFx0XHRicmVhaztcblx0XHRcdGNhc2UgMzM6IC8vIHBhZ2UgdXBcblx0XHRcdFx0dGhpcy5mb2N1c1BhZ2VVcE9wdGlvbigpO1xuXHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIDM0OiAvLyBwYWdlIGRvd25cblx0XHRcdFx0dGhpcy5mb2N1c1BhZ2VEb3duT3B0aW9uKCk7XG5cdFx0XHRicmVhaztcblx0XHRcdGNhc2UgMzU6IC8vIGVuZCBrZXlcblx0XHRcdFx0dGhpcy5mb2N1c0VuZE9wdGlvbigpO1xuXHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIDM2OiAvLyBob21lIGtleVxuXHRcdFx0XHR0aGlzLmZvY3VzU3RhcnRPcHRpb24oKTtcblx0XHRcdGJyZWFrO1xuXHRcdFx0ZGVmYXVsdDogcmV0dXJuO1xuXHRcdH1cblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHR9LFxuXG5cdGhhbmRsZVZhbHVlQ2xpY2sgKG9wdGlvbiwgZXZlbnQpIHtcblx0XHRpZiAoIXRoaXMucHJvcHMub25WYWx1ZUNsaWNrKSByZXR1cm47XG5cdFx0dGhpcy5wcm9wcy5vblZhbHVlQ2xpY2sob3B0aW9uLCBldmVudCk7XG5cdH0sXG5cblx0aGFuZGxlTWVudVNjcm9sbCAoZXZlbnQpIHtcblx0XHRpZiAoIXRoaXMucHJvcHMub25NZW51U2Nyb2xsVG9Cb3R0b20pIHJldHVybjtcblx0XHRsZXQgeyB0YXJnZXQgfSA9IGV2ZW50O1xuXHRcdGlmICh0YXJnZXQuc2Nyb2xsSGVpZ2h0ID4gdGFyZ2V0Lm9mZnNldEhlaWdodCAmJiAhKHRhcmdldC5zY3JvbGxIZWlnaHQgLSB0YXJnZXQub2Zmc2V0SGVpZ2h0IC0gdGFyZ2V0LnNjcm9sbFRvcCkpIHtcblx0XHRcdHRoaXMucHJvcHMub25NZW51U2Nyb2xsVG9Cb3R0b20oKTtcblx0XHR9XG5cdH0sXG5cblx0aGFuZGxlUmVxdWlyZWQgKHZhbHVlLCBtdWx0aSkge1xuXHRcdGlmICghdmFsdWUpIHJldHVybiB0cnVlO1xuXHRcdHJldHVybiAobXVsdGkgPyB2YWx1ZS5sZW5ndGggPT09IDAgOiBPYmplY3Qua2V5cyh2YWx1ZSkubGVuZ3RoID09PSAwKTtcblx0fSxcblxuXHRnZXRPcHRpb25MYWJlbCAob3ApIHtcblx0XHRyZXR1cm4gb3BbdGhpcy5wcm9wcy5sYWJlbEtleV07XG5cdH0sXG5cblx0LyoqXG5cdCAqIFR1cm5zIGEgdmFsdWUgaW50byBhbiBhcnJheSBmcm9tIHRoZSBnaXZlbiBvcHRpb25zXG5cdCAqIEBwYXJhbVx0e1N0cmluZ3xOdW1iZXJ8QXJyYXl9XHR2YWx1ZVx0XHQtIHRoZSB2YWx1ZSBvZiB0aGUgc2VsZWN0IGlucHV0XG5cdCAqIEBwYXJhbVx0e09iamVjdH1cdFx0bmV4dFByb3BzXHQtIG9wdGlvbmFsbHkgc3BlY2lmeSB0aGUgbmV4dFByb3BzIHNvIHRoZSByZXR1cm5lZCBhcnJheSB1c2VzIHRoZSBsYXRlc3QgY29uZmlndXJhdGlvblxuXHQgKiBAcmV0dXJuc1x0e0FycmF5fVx0dGhlIHZhbHVlIG9mIHRoZSBzZWxlY3QgcmVwcmVzZW50ZWQgaW4gYW4gYXJyYXlcblx0ICovXG5cdGdldFZhbHVlQXJyYXkgKHZhbHVlLCBuZXh0UHJvcHMpIHtcblx0XHQvKiogc3VwcG9ydCBvcHRpb25hbGx5IHBhc3NpbmcgaW4gdGhlIGBuZXh0UHJvcHNgIHNvIGBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzYCB1cGRhdGVzIHdpbGwgZnVuY3Rpb24gYXMgZXhwZWN0ZWQgKi9cblx0XHRjb25zdCBwcm9wcyA9IHR5cGVvZiBuZXh0UHJvcHMgPT09ICdvYmplY3QnID8gbmV4dFByb3BzIDogdGhpcy5wcm9wcztcblx0XHRpZiAocHJvcHMubXVsdGkpIHtcblx0XHRcdGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB2YWx1ZSA9IHZhbHVlLnNwbGl0KHByb3BzLmRlbGltaXRlcik7XG5cdFx0XHRpZiAoIUFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG5cdFx0XHRcdGlmICh2YWx1ZSA9PT0gbnVsbCB8fCB2YWx1ZSA9PT0gdW5kZWZpbmVkKSByZXR1cm4gW107XG5cdFx0XHRcdHZhbHVlID0gW3ZhbHVlXTtcblx0XHRcdH1cblx0XHRcdHJldHVybiB2YWx1ZS5tYXAodmFsdWUgPT4gdGhpcy5leHBhbmRWYWx1ZSh2YWx1ZSwgcHJvcHMpKS5maWx0ZXIoaSA9PiBpKTtcblx0XHR9XG5cdFx0dmFyIGV4cGFuZGVkVmFsdWUgPSB0aGlzLmV4cGFuZFZhbHVlKHZhbHVlLCBwcm9wcyk7XG5cdFx0cmV0dXJuIGV4cGFuZGVkVmFsdWUgPyBbZXhwYW5kZWRWYWx1ZV0gOiBbXTtcblx0fSxcblxuXHQvKipcblx0ICogUmV0cmlldmUgYSB2YWx1ZSBmcm9tIHRoZSBnaXZlbiBvcHRpb25zIGFuZCB2YWx1ZUtleVxuXHQgKiBAcGFyYW1cdHtTdHJpbmd8TnVtYmVyfEFycmF5fVx0dmFsdWVcdC0gdGhlIHNlbGVjdGVkIHZhbHVlKHMpXG5cdCAqIEBwYXJhbVx0e09iamVjdH1cdFx0cHJvcHNcdC0gdGhlIFNlbGVjdCBjb21wb25lbnQncyBwcm9wcyAob3IgbmV4dFByb3BzKVxuXHQgKi9cblx0ZXhwYW5kVmFsdWUgKHZhbHVlLCBwcm9wcykge1xuXHRcdGlmICh0eXBlb2YgdmFsdWUgIT09ICdzdHJpbmcnICYmIHR5cGVvZiB2YWx1ZSAhPT0gJ251bWJlcicpIHJldHVybiB2YWx1ZTtcblx0XHRsZXQgeyBsYWJlbEtleSwgdmFsdWVLZXksIHJlbmRlckludmFsaWRWYWx1ZXMgfSA9IHRoaXMucHJvcHM7XG5cdFx0bGV0IG9wdGlvbnMgPSB0aGlzLl9mbGF0T3B0aW9ucztcblx0XHRpZiAoIW9wdGlvbnMgfHwgdmFsdWUgPT09ICcnKSByZXR1cm47XG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBvcHRpb25zLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRpZiAob3B0aW9uc1tpXVt2YWx1ZUtleV0gPT09IHZhbHVlKSByZXR1cm4gb3B0aW9uc1tpXTtcblx0XHR9XG5cblx0XHQvLyBubyBtYXRjaGluZyBvcHRpb24sIHJldHVybiBhbiBpbnZhbGlkIG9wdGlvbiBpZiByZW5kZXJJbnZhbGlkVmFsdWVzIGlzIGVuYWJsZWRcblx0XHRpZiAocmVuZGVySW52YWxpZFZhbHVlcykge1xuXHRcdFx0aW52YWxpZE9wdGlvbnNbdmFsdWVdID0gaW52YWxpZE9wdGlvbnNbdmFsdWVdIHx8IHtcblx0XHRcdFx0aW52YWxpZDogdHJ1ZSxcblx0XHRcdFx0W2xhYmVsS2V5XTogdmFsdWUsXG5cdFx0XHRcdFt2YWx1ZUtleV06IHZhbHVlXG5cdFx0XHR9O1xuICAgICAgcmV0dXJuIGludmFsaWRPcHRpb25zW3ZhbHVlXTtcblx0XHR9XG5cdH0sXG5cblx0c2V0VmFsdWUgKHZhbHVlKSB7XG5cdFx0aWYgKHRoaXMucHJvcHMuYXV0b0JsdXIpe1xuXHRcdFx0dGhpcy5ibHVySW5wdXQoKTtcblx0XHR9XG5cdFx0aWYgKCF0aGlzLnByb3BzLm9uQ2hhbmdlKSByZXR1cm47XG5cdFx0aWYgKHRoaXMucHJvcHMucmVxdWlyZWQpIHtcblx0XHRcdGNvbnN0IHJlcXVpcmVkID0gdGhpcy5oYW5kbGVSZXF1aXJlZCh2YWx1ZSwgdGhpcy5wcm9wcy5tdWx0aSk7XG5cdFx0XHR0aGlzLnNldFN0YXRlKHsgcmVxdWlyZWQgfSk7XG5cdFx0fVxuXHRcdGlmICh0aGlzLnByb3BzLnNpbXBsZVZhbHVlICYmIHZhbHVlKSB7XG5cdFx0XHR2YWx1ZSA9IHRoaXMucHJvcHMubXVsdGkgPyB2YWx1ZS5tYXAoaSA9PiBpW3RoaXMucHJvcHMudmFsdWVLZXldKS5qb2luKHRoaXMucHJvcHMuZGVsaW1pdGVyKSA6IHZhbHVlW3RoaXMucHJvcHMudmFsdWVLZXldO1xuXHRcdH1cblx0XHR0aGlzLnByb3BzLm9uQ2hhbmdlKHZhbHVlKTtcblx0fSxcblxuXHRzZWxlY3RWYWx1ZSAodmFsdWUpIHtcblx0XHQvL05PVEU6IHVwZGF0ZSB2YWx1ZSBpbiB0aGUgY2FsbGJhY2sgdG8gbWFrZSBzdXJlIHRoZSBpbnB1dCB2YWx1ZSBpcyBlbXB0eSBzbyB0aGF0IHRoZXJlIGFyZSBubyBzdHlsaW5nIGlzc3VlcyAoQ2hyb21lIGhhZCBpc3N1ZSBvdGhlcndpc2UpXG5cdFx0dGhpcy5oYXNTY3JvbGxlZFRvT3B0aW9uID0gZmFsc2U7XG5cdFx0aWYgKHRoaXMucHJvcHMubXVsdGkpIHtcblx0XHRcdHRoaXMuc2V0U3RhdGUoe1xuXHRcdFx0XHRpbnB1dFZhbHVlOiAnJyxcblx0XHRcdFx0Zm9jdXNlZEluZGV4OiBudWxsXG5cdFx0XHR9LCAoKSA9PiB7XG5cdFx0XHRcdHRoaXMuYWRkVmFsdWUodmFsdWUpO1xuXHRcdFx0fSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMuc2V0U3RhdGUoe1xuXHRcdFx0XHRpc09wZW46IGZhbHNlLFxuXHRcdFx0XHRpbnB1dFZhbHVlOiAnJyxcblx0XHRcdFx0aXNQc2V1ZG9Gb2N1c2VkOiB0aGlzLnN0YXRlLmlzRm9jdXNlZCxcblx0XHRcdH0sICgpID0+IHtcblx0XHRcdFx0dGhpcy5zZXRWYWx1ZSh2YWx1ZSk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdH0sXG5cblx0YWRkVmFsdWUgKHZhbHVlKSB7XG5cdFx0dmFyIHZhbHVlQXJyYXkgPSB0aGlzLmdldFZhbHVlQXJyYXkodGhpcy5wcm9wcy52YWx1ZSk7XG4gICAgdmFyIHZhbHVlcyA9IHZhbHVlLm9wdGlvbnMgPyB0aGlzLnZhbHVlc0Zvckdyb3VwKHZhbHVlLm9wdGlvbnMpIDogdmFsdWU7XG5cdFx0dGhpcy5zZXRWYWx1ZSh2YWx1ZUFycmF5LmNvbmNhdCh2YWx1ZXMpKTtcblx0fSxcblxuICB2YWx1ZXNGb3JHcm91cCAoYXJ5KSB7XG5cdFx0dmFyIHJldCA9IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJ5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoQXJyYXkuaXNBcnJheShhcnlbaV0ub3B0aW9ucykpIHtcbiAgICAgICAgcmV0ID0gcmV0LmNvbmNhdCh0aGlzLnZhbHVlc0Zvckdyb3VwKGFyeVtpXS5vcHRpb25zKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXQucHVzaChhcnlbaV0pO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmV0O1xuICB9LFxuXG5cdHBvcFZhbHVlICgpIHtcblx0XHR2YXIgdmFsdWVBcnJheSA9IHRoaXMuZ2V0VmFsdWVBcnJheSh0aGlzLnByb3BzLnZhbHVlKTtcblx0XHRpZiAoIXZhbHVlQXJyYXkubGVuZ3RoKSByZXR1cm47XG5cdFx0aWYgKHZhbHVlQXJyYXlbdmFsdWVBcnJheS5sZW5ndGgtMV0uY2xlYXJhYmxlVmFsdWUgPT09IGZhbHNlKSByZXR1cm47XG5cdFx0dGhpcy5zZXRWYWx1ZSh2YWx1ZUFycmF5LnNsaWNlKDAsIHZhbHVlQXJyYXkubGVuZ3RoIC0gMSkpO1xuXHR9LFxuXG5cdHJlbW92ZVZhbHVlICh2YWx1ZSkge1xuXHRcdHZhciB2YWx1ZUFycmF5ID0gdGhpcy5nZXRWYWx1ZUFycmF5KHRoaXMucHJvcHMudmFsdWUpO1xuXHRcdHRoaXMuc2V0VmFsdWUodmFsdWVBcnJheS5maWx0ZXIoaSA9PiBpICE9PSB2YWx1ZSkpO1xuXHRcdHRoaXMuZm9jdXMoKTtcblx0fSxcblxuXHRjbGVhclZhbHVlIChldmVudCkge1xuXHRcdC8vIGlmIHRoZSBldmVudCB3YXMgdHJpZ2dlcmVkIGJ5IGEgbW91c2Vkb3duIGFuZCBub3QgdGhlIHByaW1hcnlcblx0XHQvLyBidXR0b24sIGlnbm9yZSBpdC5cblx0XHRpZiAoZXZlbnQgJiYgZXZlbnQudHlwZSA9PT0gJ21vdXNlZG93bicgJiYgZXZlbnQuYnV0dG9uICE9PSAwKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0dGhpcy5zZXRWYWx1ZSh0aGlzLmdldFJlc2V0VmFsdWUoKSk7XG5cdFx0dGhpcy5zZXRTdGF0ZSh7XG5cdFx0XHRpc09wZW46IGZhbHNlLFxuXHRcdFx0aW5wdXRWYWx1ZTogJycsXG5cdFx0fSwgdGhpcy5mb2N1cyk7XG5cdH0sXG5cblx0Z2V0UmVzZXRWYWx1ZSgpIHtcblx0XHRpZiAodGhpcy5wcm9wcy5yZXNldFZhbHVlICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdHJldHVybiB0aGlzLnByb3BzLnJlc2V0VmFsdWU7XG5cdFx0fSBlbHNlIGlmICh0aGlzLnByb3BzLm11bHRpKSB7XG5cdFx0XHRyZXR1cm4gW107XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybiBudWxsO1xuXHRcdH1cblx0fSxcblxuXHRmb2N1c09wdGlvbiAob3B0aW9uKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG5cdFx0XHRmb2N1c2VkT3B0aW9uOiBvcHRpb24sXG5cdFx0fSk7XG5cdH0sXG5cblx0Zm9jdXNOZXh0T3B0aW9uICgpIHtcblx0XHR0aGlzLmZvY3VzQWRqYWNlbnRPcHRpb24oJ25leHQnKTtcblx0fSxcblxuXHRmb2N1c1ByZXZpb3VzT3B0aW9uICgpIHtcblx0XHR0aGlzLmZvY3VzQWRqYWNlbnRPcHRpb24oJ3ByZXZpb3VzJyk7XG5cdH0sXG5cblx0Zm9jdXNQYWdlVXBPcHRpb24gKCkge1xuXHRcdHRoaXMuZm9jdXNBZGphY2VudE9wdGlvbigncGFnZV91cCcpO1xuXHR9LFxuXG5cdGZvY3VzUGFnZURvd25PcHRpb24gKCkge1xuXHRcdHRoaXMuZm9jdXNBZGphY2VudE9wdGlvbigncGFnZV9kb3duJyk7XG5cdH0sXG5cblx0Zm9jdXNTdGFydE9wdGlvbiAoKSB7XG5cdFx0dGhpcy5mb2N1c0FkamFjZW50T3B0aW9uKCdzdGFydCcpO1xuXHR9LFxuXG5cdGZvY3VzRW5kT3B0aW9uICgpIHtcblx0XHR0aGlzLmZvY3VzQWRqYWNlbnRPcHRpb24oJ2VuZCcpO1xuXHR9LFxuXG5cdGZvY3VzQWRqYWNlbnRPcHRpb24gKGRpcikge1xuXHRcdHZhciBvcHRpb25zID0gdGhpcy5fdmlzaWJsZU9wdGlvbnNcblx0XHRcdC5tYXAoKG9wdGlvbiwgaW5kZXgpID0+ICh7IG9wdGlvbiwgaW5kZXggfSkpXG5cdFx0XHQuZmlsdGVyKG9wdGlvbiA9PiAhb3B0aW9uLm9wdGlvbi5kaXNhYmxlZCk7XG5cdFx0dGhpcy5fc2Nyb2xsVG9Gb2N1c2VkT3B0aW9uT25VcGRhdGUgPSB0cnVlO1xuXHRcdGlmICghdGhpcy5zdGF0ZS5pc09wZW4pIHtcblx0XHRcdHRoaXMuc2V0U3RhdGUoe1xuXHRcdFx0XHRpc09wZW46IHRydWUsXG5cdFx0XHRcdGlucHV0VmFsdWU6ICcnLFxuXHRcdFx0XHRmb2N1c2VkT3B0aW9uOiB0aGlzLl9mb2N1c2VkT3B0aW9uIHx8IG9wdGlvbnNbZGlyID09PSAnbmV4dCcgPyAwIDogb3B0aW9ucy5sZW5ndGggLSAxXS5vcHRpb25cblx0XHRcdH0pO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHRpZiAoIW9wdGlvbnMubGVuZ3RoKSByZXR1cm47XG5cdFx0dmFyIGZvY3VzZWRJbmRleCA9IC0xO1xuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgb3B0aW9ucy5sZW5ndGg7IGkrKykge1xuXHRcdFx0aWYgKHRoaXMuX2ZvY3VzZWRPcHRpb24gPT09IG9wdGlvbnNbaV0ub3B0aW9uKSB7XG5cdFx0XHRcdGZvY3VzZWRJbmRleCA9IGk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRpZiAoZGlyID09PSAnbmV4dCcgJiYgZm9jdXNlZEluZGV4ICE9PSAtMSApIHtcblx0XHRcdGZvY3VzZWRJbmRleCA9IChmb2N1c2VkSW5kZXggKyAxKSAlIG9wdGlvbnMubGVuZ3RoO1xuXHRcdH0gZWxzZSBpZiAoZGlyID09PSAncHJldmlvdXMnKSB7XG5cdFx0XHRpZiAoZm9jdXNlZEluZGV4ID4gMCkge1xuXHRcdFx0XHRmb2N1c2VkSW5kZXggPSBmb2N1c2VkSW5kZXggLSAxO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Zm9jdXNlZEluZGV4ID0gb3B0aW9ucy5sZW5ndGggLSAxO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSBpZiAoZGlyID09PSAnc3RhcnQnKSB7XG5cdFx0XHRmb2N1c2VkSW5kZXggPSAwO1xuXHRcdH0gZWxzZSBpZiAoZGlyID09PSAnZW5kJykge1xuXHRcdFx0Zm9jdXNlZEluZGV4ID0gb3B0aW9ucy5sZW5ndGggLSAxO1xuXHRcdH0gZWxzZSBpZiAoZGlyID09PSAncGFnZV91cCcpIHtcblx0XHRcdHZhciBwb3RlbnRpYWxJbmRleCA9IGZvY3VzZWRJbmRleCAtIHRoaXMucHJvcHMucGFnZVNpemU7XG5cdFx0XHRpZiAoIHBvdGVudGlhbEluZGV4IDwgMCApIHtcblx0XHRcdFx0Zm9jdXNlZEluZGV4ID0gMDtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGZvY3VzZWRJbmRleCA9IHBvdGVudGlhbEluZGV4O1xuXHRcdFx0fVxuXHRcdH0gZWxzZSBpZiAoZGlyID09PSAncGFnZV9kb3duJykge1xuXHRcdFx0dmFyIHBvdGVudGlhbEluZGV4ID0gZm9jdXNlZEluZGV4ICsgdGhpcy5wcm9wcy5wYWdlU2l6ZTtcblx0XHRcdGlmICggcG90ZW50aWFsSW5kZXggPiBvcHRpb25zLmxlbmd0aCAtIDEgKSB7XG5cdFx0XHRcdGZvY3VzZWRJbmRleCA9IG9wdGlvbnMubGVuZ3RoIC0gMTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGZvY3VzZWRJbmRleCA9IHBvdGVudGlhbEluZGV4O1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmIChmb2N1c2VkSW5kZXggPT09IC0xKSB7XG5cdFx0XHRmb2N1c2VkSW5kZXggPSAwO1xuXHRcdH1cblxuXHRcdHRoaXMuc2V0U3RhdGUoe1xuXHRcdFx0Zm9jdXNlZEluZGV4OiBvcHRpb25zW2ZvY3VzZWRJbmRleF0uaW5kZXgsXG5cdFx0XHRmb2N1c2VkT3B0aW9uOiBvcHRpb25zW2ZvY3VzZWRJbmRleF0ub3B0aW9uXG5cdFx0fSk7XG5cdH0sXG5cblx0Z2V0Rm9jdXNlZE9wdGlvbiAoKSB7XG5cdFx0cmV0dXJuIHRoaXMuX2ZvY3VzZWRPcHRpb247XG5cdH0sXG5cblx0Z2V0SW5wdXRWYWx1ZSAoKSB7XG5cdFx0cmV0dXJuIHRoaXMuc3RhdGUuaW5wdXRWYWx1ZTtcblx0fSxcblxuXHRzZWxlY3RGb2N1c2VkT3B0aW9uICgpIHtcblx0XHRpZiAodGhpcy5fZm9jdXNlZE9wdGlvbikge1xuXHRcdFx0cmV0dXJuIHRoaXMuc2VsZWN0VmFsdWUodGhpcy5fZm9jdXNlZE9wdGlvbik7XG5cdFx0fVxuXHR9LFxuXG5cdHJlbmRlckxvYWRpbmcgKCkge1xuXHRcdGlmICghdGhpcy5wcm9wcy5pc0xvYWRpbmcpIHJldHVybjtcblx0XHRyZXR1cm4gKFxuXHRcdFx0PHNwYW4gY2xhc3NOYW1lPVwiU2VsZWN0LWxvYWRpbmctem9uZVwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPlxuXHRcdFx0XHQ8c3BhbiBjbGFzc05hbWU9XCJTZWxlY3QtbG9hZGluZ1wiIC8+XG5cdFx0XHQ8L3NwYW4+XG5cdFx0KTtcblx0fSxcblxuXHRyZW5kZXJWYWx1ZSAodmFsdWVBcnJheSwgaXNPcGVuKSB7XG5cdFx0bGV0IHJlbmRlckxhYmVsID0gdGhpcy5wcm9wcy52YWx1ZVJlbmRlcmVyIHx8IHRoaXMuZ2V0T3B0aW9uTGFiZWw7XG5cdFx0bGV0IFZhbHVlQ29tcG9uZW50ID0gdGhpcy5wcm9wcy52YWx1ZUNvbXBvbmVudDtcblx0XHRpZiAoIXZhbHVlQXJyYXkubGVuZ3RoKSB7XG5cdFx0XHRyZXR1cm4gIXRoaXMuc3RhdGUuaW5wdXRWYWx1ZSA/IDxkaXYgY2xhc3NOYW1lPVwiU2VsZWN0LXBsYWNlaG9sZGVyXCI+e3RoaXMucHJvcHMucGxhY2Vob2xkZXJ9PC9kaXY+IDogbnVsbDtcblx0XHR9XG5cdFx0bGV0IG9uQ2xpY2sgPSB0aGlzLnByb3BzLm9uVmFsdWVDbGljayA/IHRoaXMuaGFuZGxlVmFsdWVDbGljayA6IG51bGw7XG5cdFx0aWYgKHRoaXMucHJvcHMubXVsdGkpIHtcblx0XHRcdHJldHVybiB2YWx1ZUFycmF5Lm1hcCgodmFsdWUsIGkpID0+IHtcblx0XHRcdFx0cmV0dXJuIChcblx0XHRcdFx0XHQ8VmFsdWVDb21wb25lbnRcblx0XHRcdFx0XHRcdGlkPXt0aGlzLl9pbnN0YW5jZVByZWZpeCArICctdmFsdWUtJyArIGl9XG5cdFx0XHRcdFx0XHRpbnN0YW5jZVByZWZpeD17dGhpcy5faW5zdGFuY2VQcmVmaXh9XG5cdFx0XHRcdFx0XHRkaXNhYmxlZD17dGhpcy5wcm9wcy5kaXNhYmxlZCB8fCB2YWx1ZS5jbGVhcmFibGVWYWx1ZSA9PT0gZmFsc2V9XG5cdFx0XHRcdFx0XHRrZXk9e2B2YWx1ZS0ke2l9LSR7dmFsdWVbdGhpcy5wcm9wcy52YWx1ZUtleV19YH1cblx0XHRcdFx0XHRcdG9uQ2xpY2s9e29uQ2xpY2t9XG5cdFx0XHRcdFx0XHRvblJlbW92ZT17dGhpcy5yZW1vdmVWYWx1ZX1cblx0XHRcdFx0XHRcdHZhbHVlPXt2YWx1ZX1cblx0XHRcdFx0XHQ+XG5cdFx0XHRcdFx0XHR7cmVuZGVyTGFiZWwodmFsdWUsIGkpfVxuXHRcdFx0XHRcdFx0PHNwYW4gY2xhc3NOYW1lPVwiU2VsZWN0LWFyaWEtb25seVwiPiZuYnNwOzwvc3Bhbj5cblx0XHRcdFx0XHQ8L1ZhbHVlQ29tcG9uZW50PlxuXHRcdFx0XHQpO1xuXHRcdFx0fSk7XG5cdFx0fSBlbHNlIGlmICghdGhpcy5zdGF0ZS5pbnB1dFZhbHVlKSB7XG5cdFx0XHRpZiAoaXNPcGVuKSBvbkNsaWNrID0gbnVsbDtcblx0XHRcdHJldHVybiAoXG5cdFx0XHRcdDxWYWx1ZUNvbXBvbmVudFxuXHRcdFx0XHRcdGlkPXt0aGlzLl9pbnN0YW5jZVByZWZpeCArICctdmFsdWUtaXRlbSd9XG5cdFx0XHRcdFx0ZGlzYWJsZWQ9e3RoaXMucHJvcHMuZGlzYWJsZWR9XG5cdFx0XHRcdFx0aW5zdGFuY2VQcmVmaXg9e3RoaXMuX2luc3RhbmNlUHJlZml4fVxuXHRcdFx0XHRcdG9uQ2xpY2s9e29uQ2xpY2t9XG5cdFx0XHRcdFx0dmFsdWU9e3ZhbHVlQXJyYXlbMF19XG5cdFx0XHRcdD5cblx0XHRcdFx0XHR7cmVuZGVyTGFiZWwodmFsdWVBcnJheVswXSl9XG5cdFx0XHRcdDwvVmFsdWVDb21wb25lbnQ+XG5cdFx0XHQpO1xuXHRcdH1cblx0fSxcblxuXHRyZW5kZXJJbnB1dCAodmFsdWVBcnJheSwgZm9jdXNlZE9wdGlvbkluZGV4KSB7XG5cdFx0aWYgKHRoaXMucHJvcHMuaW5wdXRSZW5kZXJlcikge1xuXHRcdFx0cmV0dXJuIHRoaXMucHJvcHMuaW5wdXRSZW5kZXJlcigpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR2YXIgY2xhc3NOYW1lID0gY2xhc3NOYW1lcygnU2VsZWN0LWlucHV0JywgdGhpcy5wcm9wcy5pbnB1dFByb3BzLmNsYXNzTmFtZSk7XG5cdFx0XHRjb25zdCBpc09wZW4gPSAhIXRoaXMuc3RhdGUuaXNPcGVuO1xuXG5cdFx0XHRjb25zdCBhcmlhT3ducyA9IGNsYXNzTmFtZXMoe1xuXHRcdFx0XHRbdGhpcy5faW5zdGFuY2VQcmVmaXggKyAnLWxpc3QnXTogaXNPcGVuLFxuXHRcdFx0XHRbdGhpcy5faW5zdGFuY2VQcmVmaXggKyAnLWJhY2tzcGFjZS1yZW1vdmUtbWVzc2FnZSddOiB0aGlzLnByb3BzLm11bHRpXG5cdFx0XHRcdFx0JiYgIXRoaXMucHJvcHMuZGlzYWJsZWRcblx0XHRcdFx0XHQmJiB0aGlzLnN0YXRlLmlzRm9jdXNlZFxuXHRcdFx0XHRcdCYmICF0aGlzLnN0YXRlLmlucHV0VmFsdWVcblx0XHRcdH0pO1xuXG5cdFx0XHQvLyBUT0RPOiBDaGVjayBob3cgdGhpcyBwcm9qZWN0IGluY2x1ZGVzIE9iamVjdC5hc3NpZ24oKVxuXHRcdFx0Y29uc3QgaW5wdXRQcm9wcyA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMucHJvcHMuaW5wdXRQcm9wcywge1xuXHRcdFx0XHRyb2xlOiAnY29tYm9ib3gnLFxuXHRcdFx0XHQnYXJpYS1leHBhbmRlZCc6ICcnICsgaXNPcGVuLFxuXHRcdFx0XHQnYXJpYS1vd25zJzogYXJpYU93bnMsXG5cdFx0XHRcdCdhcmlhLWhhc3BvcHVwJzogJycgKyBpc09wZW4sXG5cdFx0XHRcdCdhcmlhLWFjdGl2ZWRlc2NlbmRhbnQnOiBpc09wZW4gPyB0aGlzLl9pbnN0YW5jZVByZWZpeCArICctb3B0aW9uLScgKyBmb2N1c2VkT3B0aW9uSW5kZXggOiB0aGlzLl9pbnN0YW5jZVByZWZpeCArICctdmFsdWUnLFxuXHRcdFx0XHQnYXJpYS1sYWJlbGxlZGJ5JzogdGhpcy5wcm9wc1snYXJpYS1sYWJlbGxlZGJ5J10sXG5cdFx0XHRcdCdhcmlhLWxhYmVsJzogdGhpcy5wcm9wc1snYXJpYS1sYWJlbCddLFxuXHRcdFx0XHRjbGFzc05hbWU6IGNsYXNzTmFtZSxcblx0XHRcdFx0dGFiSW5kZXg6IHRoaXMucHJvcHMudGFiSW5kZXgsXG5cdFx0XHRcdG9uQmx1cjogdGhpcy5oYW5kbGVJbnB1dEJsdXIsXG5cdFx0XHRcdG9uQ2hhbmdlOiB0aGlzLmhhbmRsZUlucHV0Q2hhbmdlLFxuXHRcdFx0XHRvbkZvY3VzOiB0aGlzLmhhbmRsZUlucHV0Rm9jdXMsXG5cdFx0XHRcdHJlZjogcmVmID0+IHRoaXMuaW5wdXQgPSByZWYsXG5cdFx0XHRcdHJlcXVpcmVkOiB0aGlzLnN0YXRlLnJlcXVpcmVkLFxuXHRcdFx0XHR2YWx1ZTogdGhpcy5zdGF0ZS5pbnB1dFZhbHVlXG5cdFx0XHR9KTtcblxuXHRcdFx0aWYgKHRoaXMucHJvcHMuZGlzYWJsZWQgfHwgIXRoaXMucHJvcHMuc2VhcmNoYWJsZSkge1xuXHRcdFx0XHRjb25zdCB7IGlucHV0Q2xhc3NOYW1lLCAuLi5kaXZQcm9wcyB9ID0gdGhpcy5wcm9wcy5pbnB1dFByb3BzO1xuXHRcdFx0XHRyZXR1cm4gKFxuXHRcdFx0XHRcdDxkaXZcblx0XHRcdFx0XHRcdHsuLi5kaXZQcm9wc31cblx0XHRcdFx0XHRcdHJvbGU9XCJjb21ib2JveFwiXG5cdFx0XHRcdFx0XHRhcmlhLWV4cGFuZGVkPXtpc09wZW59XG5cdFx0XHRcdFx0XHRhcmlhLW93bnM9e2lzT3BlbiA/IHRoaXMuX2luc3RhbmNlUHJlZml4ICsgJy1saXN0JyA6IHRoaXMuX2luc3RhbmNlUHJlZml4ICsgJy12YWx1ZSd9XG5cdFx0XHRcdFx0XHRhcmlhLWFjdGl2ZWRlc2NlbmRhbnQ9e2lzT3BlbiA/IHRoaXMuX2luc3RhbmNlUHJlZml4ICsgJy1vcHRpb24tJyArIGZvY3VzZWRPcHRpb25JbmRleCA6IHRoaXMuX2luc3RhbmNlUHJlZml4ICsgJy12YWx1ZSd9XG5cdFx0XHRcdFx0XHRjbGFzc05hbWU9e2NsYXNzTmFtZX1cblx0XHRcdFx0XHRcdHRhYkluZGV4PXt0aGlzLnByb3BzLnRhYkluZGV4IHx8IDB9XG5cdFx0XHRcdFx0XHRvbkJsdXI9e3RoaXMuaGFuZGxlSW5wdXRCbHVyfVxuXHRcdFx0XHRcdFx0b25Gb2N1cz17dGhpcy5oYW5kbGVJbnB1dEZvY3VzfVxuXHRcdFx0XHRcdFx0cmVmPXtyZWYgPT4gdGhpcy5pbnB1dCA9IHJlZn1cblx0XHRcdFx0XHRcdGFyaWEtcmVhZG9ubHk9eycnICsgISF0aGlzLnByb3BzLmRpc2FibGVkfVxuXHRcdFx0XHRcdFx0c3R5bGU9e3sgYm9yZGVyOiAwLCB3aWR0aDogMSwgZGlzcGxheTonaW5saW5lLWJsb2NrJyB9fS8+XG5cdFx0XHRcdCk7XG5cdFx0XHR9XG5cblx0XHRcdGlmICh0aGlzLnByb3BzLmF1dG9zaXplKSB7XG5cdFx0XHRcdHJldHVybiAoXG5cdFx0XHRcdFx0PEF1dG9zaXplSW5wdXQgey4uLmlucHV0UHJvcHN9IG1pbldpZHRoPVwiNXB4XCIgLz5cblx0XHRcdFx0KTtcblx0XHRcdH1cblx0XHRcdHJldHVybiAoXG5cdFx0XHRcdDxkaXYgY2xhc3NOYW1lPXsgY2xhc3NOYW1lIH0+XG5cdFx0XHRcdFx0PGlucHV0IHsuLi5pbnB1dFByb3BzfSAvPlxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdCk7XG5cdFx0fVxuXHR9LFxuXG5cdHJlbmRlckNsZWFyICgpIHtcblx0XHRpZiAoIXRoaXMucHJvcHMuY2xlYXJhYmxlIHx8ICghdGhpcy5wcm9wcy52YWx1ZSB8fCB0aGlzLnByb3BzLnZhbHVlID09PSAwKSB8fCAodGhpcy5wcm9wcy5tdWx0aSAmJiAhdGhpcy5wcm9wcy52YWx1ZS5sZW5ndGgpIHx8IHRoaXMucHJvcHMuZGlzYWJsZWQgfHwgdGhpcy5wcm9wcy5pc0xvYWRpbmcpIHJldHVybjtcblx0XHRyZXR1cm4gKFxuXHRcdFx0PHNwYW4gY2xhc3NOYW1lPVwiU2VsZWN0LWNsZWFyLXpvbmVcIiB0aXRsZT17dGhpcy5wcm9wcy5tdWx0aSA/IHRoaXMucHJvcHMuY2xlYXJBbGxUZXh0IDogdGhpcy5wcm9wcy5jbGVhclZhbHVlVGV4dH1cblx0XHRcdFx0YXJpYS1sYWJlbD17dGhpcy5wcm9wcy5tdWx0aSA/IHRoaXMucHJvcHMuY2xlYXJBbGxUZXh0IDogdGhpcy5wcm9wcy5jbGVhclZhbHVlVGV4dH1cblx0XHRcdFx0b25Nb3VzZURvd249e3RoaXMuY2xlYXJWYWx1ZX1cblx0XHRcdFx0b25Ub3VjaFN0YXJ0PXt0aGlzLmhhbmRsZVRvdWNoU3RhcnR9XG5cdFx0XHRcdG9uVG91Y2hNb3ZlPXt0aGlzLmhhbmRsZVRvdWNoTW92ZX1cblx0XHRcdFx0b25Ub3VjaEVuZD17dGhpcy5oYW5kbGVUb3VjaEVuZENsZWFyVmFsdWV9XG5cdFx0XHQ+XG5cdFx0XHRcdDxzcGFuIGNsYXNzTmFtZT1cIlNlbGVjdC1jbGVhclwiIGRhbmdlcm91c2x5U2V0SW5uZXJIVE1MPXt7IF9faHRtbDogJyZ0aW1lczsnIH19IC8+XG5cdFx0XHQ8L3NwYW4+XG5cdFx0KTtcblx0fSxcblxuXHRyZW5kZXJBcnJvdyAoKSB7XG5cdFx0Y29uc3Qgb25Nb3VzZURvd24gPSB0aGlzLmhhbmRsZU1vdXNlRG93bk9uQXJyb3c7XG5cdFx0Y29uc3QgYXJyb3cgPSB0aGlzLnByb3BzLmFycm93UmVuZGVyZXIoeyBvbk1vdXNlRG93biB9KTtcblxuXHRcdHJldHVybiAoXG5cdFx0XHQ8c3BhblxuXHRcdFx0XHRjbGFzc05hbWU9XCJTZWxlY3QtYXJyb3ctem9uZVwiXG5cdFx0XHRcdG9uTW91c2VEb3duPXtvbk1vdXNlRG93bn1cblx0XHRcdD5cblx0XHRcdFx0e2Fycm93fVxuXHRcdFx0PC9zcGFuPlxuXHRcdCk7XG5cdH0sXG5cblx0ZmlsdGVyRmxhdE9wdGlvbnMgKGV4Y2x1ZGVPcHRpb25zKSB7XG5cdFx0Y29uc3QgZmlsdGVyVmFsdWUgPSB0aGlzLnN0YXRlLmlucHV0VmFsdWU7XG4gICAgY29uc3QgZmxhdE9wdGlvbnMgPSB0aGlzLl9mbGF0T3B0aW9ucztcbiAgICBpZiAodGhpcy5wcm9wcy5maWx0ZXJPcHRpb25zKSB7XG4gICAgICAvLyBNYWludGFpbiBiYWNrd2FyZHMgY29tcGF0aWJpbGl0eSB3aXRoIGJvb2xlYW4gYXR0cmlidXRlXG4gICAgICBjb25zdCBmaWx0ZXJPcHRpb25zID0gdHlwZW9mIHRoaXMucHJvcHMuZmlsdGVyT3B0aW9ucyA9PT0gJ2Z1bmN0aW9uJ1xuICAgICAgICA/IHRoaXMucHJvcHMuZmlsdGVyT3B0aW9uc1xuICAgICAgICA6IGRlZmF1bHRGaWx0ZXJPcHRpb25zO1xuXG4gICAgICByZXR1cm4gZmlsdGVyT3B0aW9ucyhcbiAgICAgICAgZmxhdE9wdGlvbnMsXG4gICAgICAgIGZpbHRlclZhbHVlLFxuICAgICAgICBleGNsdWRlT3B0aW9ucyxcbiAgICAgICAge1xuICAgICAgICAgIGZpbHRlck9wdGlvbjogdGhpcy5wcm9wcy5maWx0ZXJPcHRpb24sXG4gICAgICAgICAgaWdub3JlQWNjZW50czogdGhpcy5wcm9wcy5pZ25vcmVBY2NlbnRzLFxuICAgICAgICAgIGlnbm9yZUNhc2U6IHRoaXMucHJvcHMuaWdub3JlQ2FzZSxcbiAgICAgICAgICBsYWJlbEtleTogdGhpcy5wcm9wcy5sYWJlbEtleSxcbiAgICAgICAgICBtYXRjaFBvczogdGhpcy5wcm9wcy5tYXRjaFBvcyxcbiAgICAgICAgICBtYXRjaFByb3A6IHRoaXMucHJvcHMubWF0Y2hQcm9wLFxuICAgICAgICAgIHZhbHVlS2V5OiB0aGlzLnByb3BzLnZhbHVlS2V5LFxuICAgICAgICAgIHNlbGVjdEdyb3VwOiB0aGlzLnByb3BzLnNlbGVjdEdyb3VwLFxuICAgICAgICB9XG4gICAgICApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4gZmxhdE9wdGlvbnM7XG5cdFx0fVxuXHR9LFxuXG5cdGZsYXR0ZW5PcHRpb25zIChvcHRpb25zLCBncm91cCkge1xuICAgIGlmICghb3B0aW9ucykgcmV0dXJuIFtdO1xuICAgIGxldCBmbGF0T3B0aW9ucyA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgb3B0aW9ucy5sZW5ndGg7IGkgKyspIHtcbiAgICAgIGNvbnN0IG9wdGlvbkNvcHkgPSBjbG9uZShvcHRpb25zW2ldKTtcbiAgICAgIG9wdGlvbkNvcHkuaXNJblRyZWUgPSBmYWxzZTtcbiAgICAgIGlmIChncm91cCkge1xuICAgICAgICBvcHRpb25Db3B5Lmdyb3VwID0gZ3JvdXA7XG4gICAgICB9XG4gICAgICBpZiAoaXNHcm91cChvcHRpb25Db3B5KSkge1xuXG4gICAgICAgIG9wdGlvbkNvcHkuaXNHcm91cEhlYWRpbmcgPSB0cnVlO1xuICAgICAgICBvcHRpb25Db3B5LnZhbHVlID0gb3B0aW9uQ29weS5sYWJlbDtcbiAgICAgICAgaWYgKHRoaXMucHJvcHMuc2VsZWN0R3JvdXApIGZsYXRPcHRpb25zLnB1c2gob3B0aW9uQ29weSk7XG4gICAgICAgIGZsYXRPcHRpb25zID0gZmxhdE9wdGlvbnMuY29uY2F0KHRoaXMuZmxhdHRlbk9wdGlvbnMob3B0aW9uQ29weS5vcHRpb25zLCBvcHRpb25Db3B5KSk7XG4gICAgICAgIG9wdGlvbkNvcHkub3B0aW9ucyA9IFtdO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZmxhdE9wdGlvbnMucHVzaChvcHRpb25Db3B5KTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZsYXRPcHRpb25zO1xuXHR9LFxuXG4gIHVuZmxhdHRlbk9wdGlvbnMgKGZsYXRPcHRpb25zKSB7XG4gICAgbGV0IGdyb3VwZWRPcHRpb25zID0gW107XG4gICAgbGV0IHBhcmVudCwgY2hpbGQ7XG5cbiAgICAvLyBSZW1vdmUgYWxsIGFuY2VzdG9yIGdyb3VwcyBmcm9tIHRoZSB0cmVlXG4gICAgZmxhdE9wdGlvbnMuZm9yRWFjaCgob3B0aW9uKSA9PiB7XG4gICAgICBvcHRpb24uaXNJblRyZWUgPSBmYWxzZTtcbiAgICAgIHBhcmVudCA9IG9wdGlvbi5ncm91cDtcbiAgICAgIHdoaWxlIChwYXJlbnQpIHtcbiAgICAgICAgcGFyZW50Lm9wdGlvbnMgPSBbXTtcblxuICAgICAgICBpZiAocGFyZW50LmlzSW5UcmVlKSB7XG4gICAgICAgICAgcGFyZW50LmlzSW5UcmVlID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgcGFyZW50ID0gcGFyZW50Lmdyb3VwO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gTm93IHJlY29uc3RydWN0IHRoZSBvcHRpb25zIHRyZWVcbiAgICBmbGF0T3B0aW9ucy5mb3JFYWNoKChvcHRpb24pID0+IHtcbiAgICAgIGNoaWxkID0gb3B0aW9uO1xuICAgICAgcGFyZW50ID0gY2hpbGQuZ3JvdXA7XG5cbiAgICAgIHdoaWxlIChwYXJlbnQpIHtcbiAgICAgICAgaWYgKCFjaGlsZC5pc0luVHJlZSkge1xuICAgICAgICAgIHBhcmVudC5vcHRpb25zLnB1c2goY2hpbGQpO1xuICAgICAgICAgIGNoaWxkLmlzSW5UcmVlID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNoaWxkID0gcGFyZW50O1xuICAgICAgICBwYXJlbnQgPSBjaGlsZC5ncm91cDtcbiAgICAgIH1cbiAgICAgIGlmICghY2hpbGQuaXNJblRyZWUpIHtcbiAgICAgICAgZ3JvdXBlZE9wdGlvbnMucHVzaChjaGlsZCk7XG4gICAgICAgIGNoaWxkLmlzSW5UcmVlID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBncm91cGVkT3B0aW9ucyA9IHRoaXMucmVtb3ZlRW1wdHlHcm91cHMoZ3JvdXBlZE9wdGlvbnMpO1xuICAgIHJldHVybiBncm91cGVkT3B0aW9ucztcbiAgfSxcblxuICByZW1vdmVFbXB0eUdyb3VwcyAoZ3JvdXBlZE9wdGlvbnMsIGdyb3VwSGVhZGluZykge1xuICAgIHJldHVybiBncm91cGVkT3B0aW9ucy5maWx0ZXIoKGl0ZW0sIGluZGV4KSA9PiB7XG4gICAgICBpZiAoIWl0ZW0uaXNHcm91cEhlYWRpbmcpIHJldHVybiB0cnVlO1xuICAgICAgdGhpcy5yZW1vdmVFbXB0eUdyb3VwcyhpdGVtLm9wdGlvbnMsIGl0ZW0pO1xuICAgICAgaWYgKGl0ZW0ub3B0aW9ucy5sZW5ndGggPiAwKSByZXR1cm4gdHJ1ZTtcbiAgICAgIGlmIChncm91cEhlYWRpbmcpIGdyb3VwSGVhZGluZy5vcHRpb25zLnNwbGljZShpbmRleCwgMSk7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSk7XG4gIH0sXG5cblx0b25PcHRpb25SZWYocmVmLCBpc0ZvY3VzZWQpIHtcblx0XHRpZiAoaXNGb2N1c2VkKSB7XG5cdFx0XHR0aGlzLmZvY3VzZWQgPSByZWY7XG5cdFx0fVxuXHR9LFxuXG5cdHJlbmRlck1lbnUgKG9wdGlvbnMsIHZhbHVlQXJyYXksIGZvY3VzZWRPcHRpb24pIHtcblx0XHRpZiAob3B0aW9ucyAmJiBvcHRpb25zLmxlbmd0aCkge1xuXHRcdFx0cmV0dXJuIHRoaXMucHJvcHMubWVudVJlbmRlcmVyKHtcblx0XHRcdFx0Zm9jdXNlZE9wdGlvbixcbiAgICAgICAgZm9jdXNPcHRpb246IHRoaXMuZm9jdXNPcHRpb24sXG5cdFx0XHRcdGluc3RhbmNlUHJlZml4OiB0aGlzLl9pbnN0YW5jZVByZWZpeCxcblx0XHRcdFx0bGFiZWxLZXk6IHRoaXMucHJvcHMubGFiZWxLZXksXG5cdFx0XHRcdG9uRm9jdXM6IHRoaXMuZm9jdXNPcHRpb24sXG4gICAgICAgIG9uT3B0aW9uUmVmOiB0aGlzLm9uT3B0aW9uUmVmLFxuXHRcdFx0XHRvblNlbGVjdDogdGhpcy5zZWxlY3RWYWx1ZSxcblx0XHRcdFx0b3B0aW9uQ2xhc3NOYW1lOiB0aGlzLnByb3BzLm9wdGlvbkNsYXNzTmFtZSxcblx0XHRcdFx0b3B0aW9uQ29tcG9uZW50OiB0aGlzLnByb3BzLm9wdGlvbkNvbXBvbmVudCxcbiAgICAgICAgb3B0aW9uR3JvdXBDb21wb25lbnQ6IHRoaXMucHJvcHMub3B0aW9uR3JvdXBDb21wb25lbnQsXG5cdFx0XHRcdG9wdGlvblJlbmRlcmVyOiB0aGlzLnByb3BzLm9wdGlvblJlbmRlcmVyIHx8IHRoaXMuZ2V0T3B0aW9uTGFiZWwsXG5cdFx0XHRcdG9wdGlvbnMsXG4gICAgICAgIHNlbGVjdFZhbHVlOiB0aGlzLnNlbGVjdFZhbHVlLFxuICAgICAgICBzZWxlY3RHcm91cDogdGhpcy5wcm9wcy5zZWxlY3RHcm91cCxcblx0XHRcdFx0dmFsdWVBcnJheSxcblx0XHRcdFx0dmFsdWVLZXk6IHRoaXMucHJvcHMudmFsdWVLZXksXG5cdFx0XHR9KTtcblx0XHR9IGVsc2UgaWYgKHRoaXMucHJvcHMubm9SZXN1bHRzVGV4dCkge1xuXHRcdFx0cmV0dXJuIChcblx0XHRcdFx0PGRpdiBjbGFzc05hbWU9XCJTZWxlY3Qtbm9yZXN1bHRzXCI+XG5cdFx0XHRcdFx0e3RoaXMucHJvcHMubm9SZXN1bHRzVGV4dH1cblx0XHRcdFx0PC9kaXY+XG5cdFx0XHQpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4gbnVsbDtcblx0XHR9XG5cdH0sXG5cblx0cmVuZGVySGlkZGVuRmllbGQgKHZhbHVlQXJyYXkpIHtcblx0XHRpZiAoIXRoaXMucHJvcHMubmFtZSkgcmV0dXJuO1xuXHRcdGlmICh0aGlzLnByb3BzLmpvaW5WYWx1ZXMpIHtcblx0XHRcdGxldCB2YWx1ZSA9IHZhbHVlQXJyYXkubWFwKGkgPT4gc3RyaW5naWZ5VmFsdWUoaVt0aGlzLnByb3BzLnZhbHVlS2V5XSkpLmpvaW4odGhpcy5wcm9wcy5kZWxpbWl0ZXIpO1xuXHRcdFx0cmV0dXJuIChcblx0XHRcdFx0PGlucHV0XG5cdFx0XHRcdFx0dHlwZT1cImhpZGRlblwiXG5cdFx0XHRcdFx0cmVmPXtyZWYgPT4gdGhpcy52YWx1ZSA9IHJlZn1cblx0XHRcdFx0XHRuYW1lPXt0aGlzLnByb3BzLm5hbWV9XG5cdFx0XHRcdFx0dmFsdWU9e3ZhbHVlfVxuXHRcdFx0XHRcdGRpc2FibGVkPXt0aGlzLnByb3BzLmRpc2FibGVkfSAvPlxuXHRcdFx0KTtcblx0XHR9XG5cdFx0cmV0dXJuIHZhbHVlQXJyYXkubWFwKChpdGVtLCBpbmRleCkgPT4gKFxuXHRcdFx0PGlucHV0IGtleT17J2hpZGRlbi4nICsgaW5kZXh9XG5cdFx0XHRcdHR5cGU9XCJoaWRkZW5cIlxuXHRcdFx0XHRyZWY9eyd2YWx1ZScgKyBpbmRleH1cblx0XHRcdFx0bmFtZT17dGhpcy5wcm9wcy5uYW1lfVxuXHRcdFx0XHR2YWx1ZT17c3RyaW5naWZ5VmFsdWUoaXRlbVt0aGlzLnByb3BzLnZhbHVlS2V5XSl9XG5cdFx0XHRcdGRpc2FibGVkPXt0aGlzLnByb3BzLmRpc2FibGVkfSAvPlxuXHRcdCkpO1xuXHR9LFxuXG5cdGdldEZvY3VzYWJsZU9wdGlvbkluZGV4IChzZWxlY3RlZE9wdGlvbikge1xuXHRcdHZhciBvcHRpb25zID0gdGhpcy5fdmlzaWJsZU9wdGlvbnM7XG5cdFx0aWYgKCFvcHRpb25zLmxlbmd0aCkgcmV0dXJuIG51bGw7XG5cblx0XHRsZXQgZm9jdXNlZE9wdGlvbiA9IHRoaXMuc3RhdGUuZm9jdXNlZE9wdGlvbiB8fCBzZWxlY3RlZE9wdGlvbjtcblx0XHRpZiAoZm9jdXNlZE9wdGlvbiAmJiAhZm9jdXNlZE9wdGlvbi5kaXNhYmxlZCkge1xuXHRcdFx0Y29uc3QgZm9jdXNlZE9wdGlvbkluZGV4ID0gb3B0aW9ucy5pbmRleE9mKGZvY3VzZWRPcHRpb24pO1xuXHRcdFx0aWYgKGZvY3VzZWRPcHRpb25JbmRleCAhPT0gLTEpIHtcblx0XHRcdFx0cmV0dXJuIGZvY3VzZWRPcHRpb25JbmRleDtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IG9wdGlvbnMubGVuZ3RoOyBpKyspIHtcblx0XHRcdGlmICghb3B0aW9uc1tpXS5kaXNhYmxlZCkgcmV0dXJuIGk7XG5cdFx0fVxuXHRcdHJldHVybiBudWxsO1xuXHR9LFxuXG5cdHJlbmRlck91dGVyIChvcHRpb25zLCB2YWx1ZUFycmF5LCBmb2N1c2VkT3B0aW9uKSB7XG4gICAgbGV0IERyb3Bkb3duID0gdGhpcy5wcm9wcy5kcm9wZG93bkNvbXBvbmVudDtcblx0XHRsZXQgbWVudSA9IHRoaXMucmVuZGVyTWVudShvcHRpb25zLCB2YWx1ZUFycmF5LCBmb2N1c2VkT3B0aW9uKTtcblx0XHRpZiAoIW1lbnUpIHtcblx0XHRcdHJldHVybiBudWxsO1xuXHRcdH1cblxuXHRcdHJldHVybiAoXG4gICAgICA8RHJvcGRvd24+XG4gICAgICAgIDxkaXYgcmVmPXtyZWYgPT4gdGhpcy5tZW51Q29udGFpbmVyID0gcmVmfSBjbGFzc05hbWU9XCJTZWxlY3QtbWVudS1vdXRlclwiIHN0eWxlPXt0aGlzLnByb3BzLm1lbnVDb250YWluZXJTdHlsZX0+XG4gICAgICAgICAgPGRpdiByZWY9e3JlZiA9PiB0aGlzLm1lbnUgPSByZWZ9IHJvbGU9XCJsaXN0Ym94XCIgY2xhc3NOYW1lPVwiU2VsZWN0LW1lbnVcIiBpZD17dGhpcy5faW5zdGFuY2VQcmVmaXggKyAnLWxpc3QnfVxuICAgICAgICAgICAgICAgc3R5bGU9e3RoaXMucHJvcHMubWVudVN0eWxlfVxuICAgICAgICAgICAgICAgb25TY3JvbGw9e3RoaXMuaGFuZGxlTWVudVNjcm9sbH1cbiAgICAgICAgICAgICAgIG9uTW91c2VEb3duPXt0aGlzLmhhbmRsZU1vdXNlRG93bk9uTWVudX0+XG4gICAgICAgICAgICB7bWVudX1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L0Ryb3Bkb3duPlxuXHRcdCk7XG5cdH0sXG5cblx0cmVuZGVyICgpIHtcbiAgICBsZXQgdmFsdWVBcnJheSA9IHRoaXMuZ2V0VmFsdWVBcnJheSh0aGlzLnByb3BzLnZhbHVlKTtcblx0XHR0aGlzLl92aXNpYmxlT3B0aW9ucyA9IHRoaXMuZmlsdGVyRmxhdE9wdGlvbnModGhpcy5wcm9wcy5tdWx0aSA/IHZhbHVlQXJyYXkgOiBudWxsKTtcbiAgICBsZXQgb3B0aW9ucyA9IHRoaXMudW5mbGF0dGVuT3B0aW9ucyh0aGlzLl92aXNpYmxlT3B0aW9ucyk7XG5cblx0XHRsZXQgaXNPcGVuID0gdHlwZW9mIHRoaXMucHJvcHMuaXNPcGVuID09PSAnYm9vbGVhbicgPyB0aGlzLnByb3BzLmlzT3BlbiA6IHRoaXMuc3RhdGUuaXNPcGVuO1xuXHRcdGlmICh0aGlzLnByb3BzLm11bHRpICYmICFvcHRpb25zLmxlbmd0aCAmJiB2YWx1ZUFycmF5Lmxlbmd0aCAmJiAhdGhpcy5zdGF0ZS5pbnB1dFZhbHVlKSBpc09wZW4gPSBmYWxzZTtcblx0XHRjb25zdCBmb2N1c2VkT3B0aW9uSW5kZXggPSB0aGlzLmdldEZvY3VzYWJsZU9wdGlvbkluZGV4KHZhbHVlQXJyYXlbMF0pO1xuXG5cdFx0bGV0IGZvY3VzZWRPcHRpb24gPSBudWxsO1xuXHRcdGlmIChmb2N1c2VkT3B0aW9uSW5kZXggIT09IG51bGwpIHtcblx0XHRcdGZvY3VzZWRPcHRpb24gPSB0aGlzLl9mb2N1c2VkT3B0aW9uID0gdGhpcy5fdmlzaWJsZU9wdGlvbnNbZm9jdXNlZE9wdGlvbkluZGV4XTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Zm9jdXNlZE9wdGlvbiA9IHRoaXMuX2ZvY3VzZWRPcHRpb24gPSBudWxsO1xuXHRcdH1cblxuXHRcdGxldCBjbGFzc05hbWUgPSBjbGFzc05hbWVzKCdTZWxlY3QnLCB0aGlzLnByb3BzLmNsYXNzTmFtZSwge1xuXHRcdFx0J1NlbGVjdC0tbXVsdGknOiB0aGlzLnByb3BzLm11bHRpLFxuXHRcdFx0J1NlbGVjdC0tc2luZ2xlJzogIXRoaXMucHJvcHMubXVsdGksXG5cdFx0XHQnaXMtZGlzYWJsZWQnOiB0aGlzLnByb3BzLmRpc2FibGVkLFxuXHRcdFx0J2lzLWZvY3VzZWQnOiB0aGlzLnN0YXRlLmlzRm9jdXNlZCxcblx0XHRcdCdpcy1sb2FkaW5nJzogdGhpcy5wcm9wcy5pc0xvYWRpbmcsXG5cdFx0XHQnaXMtb3Blbic6IGlzT3Blbixcblx0XHRcdCdpcy1wc2V1ZG8tZm9jdXNlZCc6IHRoaXMuc3RhdGUuaXNQc2V1ZG9Gb2N1c2VkLFxuXHRcdFx0J2lzLXNlYXJjaGFibGUnOiB0aGlzLnByb3BzLnNlYXJjaGFibGUsXG5cdFx0XHQnaGFzLXZhbHVlJzogdmFsdWVBcnJheS5sZW5ndGgsXG5cdFx0fSk7XG5cblx0XHRsZXQgcmVtb3ZlTWVzc2FnZSA9IG51bGw7XG5cdFx0aWYgKHRoaXMucHJvcHMubXVsdGkgJiZcblx0XHRcdCF0aGlzLnByb3BzLmRpc2FibGVkICYmXG5cdFx0XHR2YWx1ZUFycmF5Lmxlbmd0aCAmJlxuXHRcdFx0IXRoaXMuc3RhdGUuaW5wdXRWYWx1ZSAmJlxuXHRcdFx0dGhpcy5zdGF0ZS5pc0ZvY3VzZWQgJiZcblx0XHRcdHRoaXMucHJvcHMuYmFja3NwYWNlUmVtb3Zlcykge1xuXHRcdFx0cmVtb3ZlTWVzc2FnZSA9IChcblx0XHRcdFx0PHNwYW4gaWQ9e3RoaXMuX2luc3RhbmNlUHJlZml4ICsgJy1iYWNrc3BhY2UtcmVtb3ZlLW1lc3NhZ2UnfSBjbGFzc05hbWU9XCJTZWxlY3QtYXJpYS1vbmx5XCIgYXJpYS1saXZlPVwiYXNzZXJ0aXZlXCI+XG5cdFx0XHRcdFx0e3RoaXMucHJvcHMuYmFja3NwYWNlVG9SZW1vdmVNZXNzYWdlLnJlcGxhY2UoJ3tsYWJlbH0nLCB2YWx1ZUFycmF5W3ZhbHVlQXJyYXkubGVuZ3RoIC0gMV1bdGhpcy5wcm9wcy5sYWJlbEtleV0pfVxuXHRcdFx0XHQ8L3NwYW4+XG5cdFx0XHQpO1xuXHRcdH1cblxuXHRcdHJldHVybiAoXG5cdFx0XHQ8ZGl2IHJlZj17cmVmID0+IHRoaXMud3JhcHBlciA9IHJlZn1cblx0XHRcdFx0IGNsYXNzTmFtZT17Y2xhc3NOYW1lfVxuXHRcdFx0XHQgc3R5bGU9e3RoaXMucHJvcHMud3JhcHBlclN0eWxlfT5cblx0XHRcdFx0e3RoaXMucmVuZGVySGlkZGVuRmllbGQodmFsdWVBcnJheSl9XG5cdFx0XHRcdDxkaXYgcmVmPXtyZWYgPT4gdGhpcy5jb250cm9sID0gcmVmfVxuXHRcdFx0XHRcdGNsYXNzTmFtZT1cIlNlbGVjdC1jb250cm9sXCJcblx0XHRcdFx0XHRzdHlsZT17dGhpcy5wcm9wcy5zdHlsZX1cblx0XHRcdFx0XHRvbktleURvd249e3RoaXMuaGFuZGxlS2V5RG93bn1cblx0XHRcdFx0XHRvbk1vdXNlRG93bj17dGhpcy5oYW5kbGVNb3VzZURvd259XG5cdFx0XHRcdFx0b25Ub3VjaEVuZD17dGhpcy5oYW5kbGVUb3VjaEVuZH1cblx0XHRcdFx0XHRvblRvdWNoU3RhcnQ9e3RoaXMuaGFuZGxlVG91Y2hTdGFydH1cblx0XHRcdFx0XHRvblRvdWNoTW92ZT17dGhpcy5oYW5kbGVUb3VjaE1vdmV9XG5cdFx0XHRcdD5cblx0XHRcdFx0XHQ8c3BhbiBjbGFzc05hbWU9XCJTZWxlY3QtbXVsdGktdmFsdWUtd3JhcHBlclwiIGlkPXt0aGlzLl9pbnN0YW5jZVByZWZpeCArICctdmFsdWUnfT5cblx0XHRcdFx0XHRcdHt0aGlzLnJlbmRlclZhbHVlKHZhbHVlQXJyYXksIGlzT3Blbil9XG5cdFx0XHRcdFx0XHR7dGhpcy5yZW5kZXJJbnB1dCh2YWx1ZUFycmF5LCBmb2N1c2VkT3B0aW9uSW5kZXgpfVxuXHRcdFx0XHRcdDwvc3Bhbj5cblx0XHRcdFx0XHR7cmVtb3ZlTWVzc2FnZX1cblx0XHRcdFx0XHR7dGhpcy5yZW5kZXJMb2FkaW5nKCl9XG5cdFx0XHRcdFx0e3RoaXMucmVuZGVyQ2xlYXIoKX1cblx0XHRcdFx0XHR7dGhpcy5yZW5kZXJBcnJvdygpfVxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0e2lzT3BlbiA/IHRoaXMucmVuZGVyT3V0ZXIob3B0aW9ucywgIXRoaXMucHJvcHMubXVsdGkgPyB2YWx1ZUFycmF5IDogbnVsbCwgZm9jdXNlZE9wdGlvbikgOiBudWxsfVxuXHRcdFx0PC9kaXY+XG5cdFx0KTtcblx0fVxuXG59KTtcblxuZXhwb3J0IGRlZmF1bHQgU2VsZWN0O1xuIl19
