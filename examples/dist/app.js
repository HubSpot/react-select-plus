require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/* eslint react/prop-types: 0 */

'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _reactSelectPlus = require('react-select-plus');

var _reactSelectPlus2 = _interopRequireDefault(_reactSelectPlus);

var _componentsContributors = require('./components/Contributors');

var _componentsContributors2 = _interopRequireDefault(_componentsContributors);

var _componentsCustomComponents = require('./components/CustomComponents');

var _componentsCustomComponents2 = _interopRequireDefault(_componentsCustomComponents);

var _componentsCustomRender = require('./components/CustomRender');

var _componentsCustomRender2 = _interopRequireDefault(_componentsCustomRender);

var _componentsGroupedOptionsField = require('./components/GroupedOptionsField');

var _componentsGroupedOptionsField2 = _interopRequireDefault(_componentsGroupedOptionsField);

var _componentsMultiselect = require('./components/Multiselect');

var _componentsMultiselect2 = _interopRequireDefault(_componentsMultiselect);

var _componentsNumericSelect = require('./components/NumericSelect');

var _componentsNumericSelect2 = _interopRequireDefault(_componentsNumericSelect);

var _componentsStates = require('./components/States');

var _componentsStates2 = _interopRequireDefault(_componentsStates);

_reactDom2['default'].render(_react2['default'].createElement(
	'div',
	null,
	_react2['default'].createElement(_componentsStates2['default'], { label: 'States', searchable: true }),
	_react2['default'].createElement(_componentsMultiselect2['default'], { label: 'Multiselect' }),
	_react2['default'].createElement(_componentsContributors2['default'], { label: 'Contributors (Async)' }),
	_react2['default'].createElement(_componentsNumericSelect2['default'], { label: 'Numeric Values' }),
	_react2['default'].createElement(_componentsGroupedOptionsField2['default'], { label: 'Option Groups' }),
	_react2['default'].createElement(_componentsCustomRender2['default'], { label: 'Custom Render Methods' }),
	_react2['default'].createElement(_componentsCustomComponents2['default'], { label: 'Custom Placeholder, Option and Value Components' })
), document.getElementById('example'));
/*
<SelectedValuesField label="Option Creation (tags mode)" options={FLAVOURS} allowCreate hint="Enter a value that's NOT in the list, then hit return" />
*/

},{"./components/Contributors":2,"./components/CustomComponents":3,"./components/CustomRender":4,"./components/GroupedOptionsField":5,"./components/Multiselect":6,"./components/NumericSelect":7,"./components/States":8,"react":undefined,"react-dom":undefined,"react-select-plus":undefined}],2:[function(require,module,exports){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactSelectPlus = require('react-select-plus');

var _reactSelectPlus2 = _interopRequireDefault(_reactSelectPlus);

var CONTRIBUTORS = require('../data/contributors');
var MAX_CONTRIBUTORS = 6;
var ASYNC_DELAY = 500;

var Contributors = _react2['default'].createClass({
	displayName: 'Contributors',
	propTypes: {
		label: _react2['default'].PropTypes.string
	},
	getInitialState: function getInitialState() {
		return {
			multi: true,
			value: [CONTRIBUTORS[0]]
		};
	},
	onChange: function onChange(value) {
		this.setState({
			value: value
		});
	},
	switchToMulti: function switchToMulti() {
		this.setState({
			multi: true,
			value: [this.state.value]
		});
	},
	switchToSingle: function switchToSingle() {
		this.setState({
			multi: false,
			value: this.state.value[0]
		});
	},
	getContributors: function getContributors(input, callback) {
		input = input.toLowerCase();
		var options = CONTRIBUTORS.filter(function (i) {
			return i.github.substr(0, input.length) === input;
		});
		var data = {
			options: options.slice(0, MAX_CONTRIBUTORS),
			complete: options.length <= MAX_CONTRIBUTORS
		};
		setTimeout(function () {
			callback(null, data);
		}, ASYNC_DELAY);
	},
	gotoContributor: function gotoContributor(value, event) {
		window.open('https://github.com/' + value.github);
	},
	render: function render() {
		return _react2['default'].createElement(
			'div',
			{ className: 'section' },
			_react2['default'].createElement(
				'h3',
				{ className: 'section-heading' },
				this.props.label
			),
			_react2['default'].createElement(_reactSelectPlus2['default'].Async, { multi: this.state.multi, value: this.state.value, onChange: this.onChange, onValueClick: this.gotoContributor, valueKey: 'github', labelKey: 'name', loadOptions: this.getContributors }),
			_react2['default'].createElement(
				'div',
				{ className: 'checkbox-list' },
				_react2['default'].createElement(
					'label',
					{ className: 'checkbox' },
					_react2['default'].createElement('input', { type: 'radio', className: 'checkbox-control', checked: this.state.multi, onChange: this.switchToMulti }),
					_react2['default'].createElement(
						'span',
						{ className: 'checkbox-label' },
						'Multiselect'
					)
				),
				_react2['default'].createElement(
					'label',
					{ className: 'checkbox' },
					_react2['default'].createElement('input', { type: 'radio', className: 'checkbox-control', checked: !this.state.multi, onChange: this.switchToSingle }),
					_react2['default'].createElement(
						'span',
						{ className: 'checkbox-label' },
						'Single Value'
					)
				)
			),
			_react2['default'].createElement(
				'div',
				{ className: 'hint' },
				'This example implements custom label and value properties, async options and opens the github profiles in a new window when values are clicked'
			)
		);
	}
});

module.exports = Contributors;

},{"../data/contributors":9,"react":undefined,"react-select-plus":undefined}],3:[function(require,module,exports){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactSelectPlus = require('react-select-plus');

var _reactSelectPlus2 = _interopRequireDefault(_reactSelectPlus);

var _reactGravatar = require('react-gravatar');

var _reactGravatar2 = _interopRequireDefault(_reactGravatar);

var USERS = require('../data/users');
var GRAVATAR_SIZE = 15;

var GravatarOption = _react2['default'].createClass({
	displayName: 'GravatarOption',

	propTypes: {
		children: _react2['default'].PropTypes.node,
		className: _react2['default'].PropTypes.string,
		isDisabled: _react2['default'].PropTypes.bool,
		isFocused: _react2['default'].PropTypes.bool,
		isSelected: _react2['default'].PropTypes.bool,
		onFocus: _react2['default'].PropTypes.func,
		onSelect: _react2['default'].PropTypes.func,
		onUnfocus: _react2['default'].PropTypes.func,
		option: _react2['default'].PropTypes.object.isRequired
	},
	handleMouseDown: function handleMouseDown(event) {
		event.preventDefault();
		event.stopPropagation();
		this.props.onSelect(this.props.option, event);
	},
	handleMouseEnter: function handleMouseEnter(event) {
		this.props.onFocus(this.props.option, event);
	},
	handleMouseMove: function handleMouseMove(event) {
		if (this.props.isFocused) return;
		this.props.onFocus(this.props.option, event);
	},
	handleMouseLeave: function handleMouseLeave(event) {
		this.props.onUnfocus(this.props.option, event);
	},
	render: function render() {
		var gravatarStyle = {
			borderRadius: 3,
			display: 'inline-block',
			marginRight: 10,
			position: 'relative',
			top: -2,
			verticalAlign: 'middle'
		};
		return _react2['default'].createElement(
			'div',
			{ className: this.props.className,
				onMouseDown: this.handleMouseDown,
				onMouseEnter: this.handleMouseEnter,
				onMouseMove: this.handleMouseMove,
				onMouseLeave: this.handleMouseLeave,
				title: this.props.option.title },
			_react2['default'].createElement(_reactGravatar2['default'], { email: this.props.option.email, size: GRAVATAR_SIZE, style: gravatarStyle }),
			this.props.children
		);
	}
});

var GravatarValue = _react2['default'].createClass({
	displayName: 'GravatarValue',

	propTypes: {
		children: _react2['default'].PropTypes.node,
		placeholder: _react2['default'].PropTypes.string,
		value: _react2['default'].PropTypes.object
	},
	render: function render() {
		var gravatarStyle = {
			borderRadius: 3,
			display: 'inline-block',
			marginRight: 10,
			position: 'relative',
			top: -2,
			verticalAlign: 'middle'
		};
		return _react2['default'].createElement(
			'div',
			{ className: 'Select-value', title: this.props.value.title },
			_react2['default'].createElement(
				'span',
				{ className: 'Select-value-label' },
				_react2['default'].createElement(_reactGravatar2['default'], { email: this.props.value.email, size: GRAVATAR_SIZE, style: gravatarStyle }),
				this.props.children
			)
		);
	}
});

var UsersField = _react2['default'].createClass({
	displayName: 'UsersField',

	propTypes: {
		hint: _react2['default'].PropTypes.string,
		label: _react2['default'].PropTypes.string
	},
	getInitialState: function getInitialState() {
		return {};
	},
	setValue: function setValue(value) {
		this.setState({ value: value });
	},
	render: function render() {
		var placeholder = _react2['default'].createElement(
			'span',
			null,
			'☺ Select User'
		);

		return _react2['default'].createElement(
			'div',
			{ className: 'section' },
			_react2['default'].createElement(
				'h3',
				{ className: 'section-heading' },
				this.props.label
			),
			_react2['default'].createElement(_reactSelectPlus2['default'], {
				onChange: this.setValue,
				optionComponent: GravatarOption,
				options: USERS,
				placeholder: placeholder,
				value: this.state.value,
				valueComponent: GravatarValue
			}),
			_react2['default'].createElement(
				'div',
				{ className: 'hint' },
				'This example implements custom Option and Value components to render a Gravatar image for each user based on their email. It also demonstrates rendering HTML elements as the placeholder.'
			)
		);
	}
});

module.exports = UsersField;

},{"../data/users":11,"react":undefined,"react-gravatar":15,"react-select-plus":undefined}],4:[function(require,module,exports){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactSelectPlus = require('react-select-plus');

var _reactSelectPlus2 = _interopRequireDefault(_reactSelectPlus);

var DisabledUpsellOptions = _react2['default'].createClass({
	displayName: 'DisabledUpsellOptions',
	propTypes: {
		label: _react2['default'].PropTypes.string
	},
	getInitialState: function getInitialState() {
		return {};
	},
	setValue: function setValue(value) {
		this.setState({ value: value });
		console.log('Support level selected:', value.label);
	},
	renderLink: function renderLink() {
		return _react2['default'].createElement(
			'a',
			{ style: { marginLeft: 5 }, href: '/upgrade', target: '_blank' },
			'Upgrade here!'
		);
	},
	renderOption: function renderOption(option) {
		return _react2['default'].createElement(
			'span',
			{ style: { color: option.color } },
			option.label,
			' ',
			option.link
		);
	},
	renderValue: function renderValue(option) {
		return _react2['default'].createElement(
			'strong',
			{ style: { color: option.color } },
			option.label
		);
	},
	render: function render() {
		var options = [{ label: 'Basic customer support', value: 'basic', color: '#E31864' }, { label: 'Premium customer support', value: 'premium', color: '#6216A3' }, { label: 'Pro customer support', value: 'pro', disabled: true, link: this.renderLink() }];
		return _react2['default'].createElement(
			'div',
			{ className: 'section' },
			_react2['default'].createElement(
				'h3',
				{ className: 'section-heading' },
				this.props.label
			),
			_react2['default'].createElement(_reactSelectPlus2['default'], {
				placeholder: 'Select your support level',
				options: options,
				optionRenderer: this.renderOption,
				onChange: this.setValue,
				value: this.state.value,
				valueRenderer: this.renderValue
			}),
			_react2['default'].createElement(
				'div',
				{ className: 'hint' },
				'This demonstates custom render methods and links in disabled options'
			)
		);
	}
});
module.exports = DisabledUpsellOptions;

},{"react":undefined,"react-select-plus":undefined}],5:[function(require,module,exports){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactSelectPlus = require('react-select-plus');

var _reactSelectPlus2 = _interopRequireDefault(_reactSelectPlus);

var ops = [{
	label: 'Black',
	value: 'black'
}, {
	label: 'Primary Colors',
	options: [{
		label: 'Yellow',
		value: 'yellow'
	}, {
		label: 'Red',
		value: 'red'
	}, {
		label: 'Blue',
		value: 'blue'
	}]
}, {
	label: 'Secondary Colors',
	options: [{
		label: 'Orange',
		value: 'orange'
	}, {
		label: 'Purple',
		options: [{
			label: 'Light Purple',
			value: 'light_purple'
		}, {
			label: 'Medium Purple',
			value: 'medium_purple'
		}, {
			label: 'Dark Purple',
			value: 'dark_purple'
		}]
	}, {
		label: 'Green',
		value: 'green'
	}]
}, {
	label: 'White',
	value: 'white'
}];

var GroupedOptionsField = _react2['default'].createClass({
	displayName: 'GroupedOptionsField',
	propTypes: {
		delimiter: _react2['default'].PropTypes.string,
		label: _react2['default'].PropTypes.string,
		multi: _react2['default'].PropTypes.bool
	},

	getInitialState: function getInitialState() {
		return {
			value: null
		};
	},

	onChange: function onChange(value) {
		this.setState({ value: value });
		console.log('Option Groups Select value changed to', value);
	},

	render: function render() {
		return _react2['default'].createElement(
			'div',
			{ className: 'section' },
			_react2['default'].createElement(
				'h3',
				{ className: 'section-heading' },
				this.props.label
			),
			_react2['default'].createElement(_reactSelectPlus2['default'], {
				onChange: this.onChange,
				options: ops,
				placeholder: 'Select a color',
				value: this.state.value })
		);
	}
});

module.exports = GroupedOptionsField;

},{"react":undefined,"react-select-plus":undefined}],6:[function(require,module,exports){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactSelectPlus = require('react-select-plus');

var _reactSelectPlus2 = _interopRequireDefault(_reactSelectPlus);

var FLAVOURS = [{ label: 'Chocolate', value: 'chocolate' }, { label: 'Vanilla', value: 'vanilla' }, { label: 'Strawberry', value: 'strawberry' }, { label: 'Caramel', value: 'caramel' }, { label: 'Cookies and Cream', value: 'cookiescream' }, { label: 'Peppermint', value: 'peppermint' }];

var WHY_WOULD_YOU = [{ label: 'Chocolate (are you crazy?)', value: 'chocolate', disabled: true }].concat(FLAVOURS.slice(1));

var MultiSelectField = _react2['default'].createClass({
	displayName: 'MultiSelectField',
	propTypes: {
		label: _react2['default'].PropTypes.string
	},
	getInitialState: function getInitialState() {
		return {
			disabled: false,
			crazy: false,
			options: FLAVOURS,
			value: []
		};
	},
	handleSelectChange: function handleSelectChange(value) {
		console.log('You\'ve selected:', value);
		this.setState({ value: value });
	},
	toggleDisabled: function toggleDisabled(e) {
		this.setState({ disabled: e.target.checked });
	},
	toggleChocolate: function toggleChocolate(e) {
		var crazy = e.target.checked;
		this.setState({
			crazy: crazy,
			options: crazy ? WHY_WOULD_YOU : FLAVOURS
		});
	},
	render: function render() {
		return _react2['default'].createElement(
			'div',
			{ className: 'section' },
			_react2['default'].createElement(
				'h3',
				{ className: 'section-heading' },
				this.props.label
			),
			_react2['default'].createElement(_reactSelectPlus2['default'], { multi: true, simpleValue: true, disabled: this.state.disabled, value: this.state.value, placeholder: 'Select your favourite(s)', options: this.state.options, onChange: this.handleSelectChange }),
			_react2['default'].createElement(
				'div',
				{ className: 'checkbox-list' },
				_react2['default'].createElement(
					'label',
					{ className: 'checkbox' },
					_react2['default'].createElement('input', { type: 'checkbox', className: 'checkbox-control', checked: this.state.disabled, onChange: this.toggleDisabled }),
					_react2['default'].createElement(
						'span',
						{ className: 'checkbox-label' },
						'Disable the control'
					)
				),
				_react2['default'].createElement(
					'label',
					{ className: 'checkbox' },
					_react2['default'].createElement('input', { type: 'checkbox', className: 'checkbox-control', checked: this.state.crazy, onChange: this.toggleChocolate }),
					_react2['default'].createElement(
						'span',
						{ className: 'checkbox-label' },
						'I don\'t like Chocolate (disabled the option)'
					)
				)
			)
		);
	}
});

module.exports = MultiSelectField;

},{"react":undefined,"react-select-plus":undefined}],7:[function(require,module,exports){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactSelectPlus = require('react-select-plus');

var _reactSelectPlus2 = _interopRequireDefault(_reactSelectPlus);

var ValuesAsNumbersField = _react2['default'].createClass({
	displayName: 'ValuesAsNumbersField',
	propTypes: {
		label: _react2['default'].PropTypes.string
	},
	getInitialState: function getInitialState() {
		return {
			options: [{ value: 10, label: 'Ten' }, { value: 11, label: 'Eleven' }, { value: 12, label: 'Twelve' }, { value: 23, label: 'Twenty-three' }, { value: 24, label: 'Twenty-four' }],
			matchPos: 'any',
			matchValue: true,
			matchLabel: true,
			value: null,
			multi: false
		};
	},
	onChangeMatchStart: function onChangeMatchStart(event) {
		this.setState({
			matchPos: event.target.checked ? 'start' : 'any'
		});
	},
	onChangeMatchValue: function onChangeMatchValue(event) {
		this.setState({
			matchValue: event.target.checked
		});
	},
	onChangeMatchLabel: function onChangeMatchLabel(event) {
		this.setState({
			matchLabel: event.target.checked
		});
	},
	onChange: function onChange(value) {
		this.setState({ value: value });
		console.log('Numeric Select value changed to', value);
	},
	onChangeMulti: function onChangeMulti(event) {
		this.setState({
			multi: event.target.checked
		});
	},
	render: function render() {
		var matchProp = 'any';
		if (this.state.matchLabel && !this.state.matchValue) {
			matchProp = 'label';
		}
		if (!this.state.matchLabel && this.state.matchValue) {
			matchProp = 'value';
		}
		return _react2['default'].createElement(
			'div',
			{ className: 'section' },
			_react2['default'].createElement(
				'h3',
				{ className: 'section-heading' },
				this.props.label
			),
			_react2['default'].createElement(_reactSelectPlus2['default'], {
				matchPos: this.state.matchPos,
				matchProp: matchProp,
				multi: this.state.multi,
				onChange: this.onChange,
				options: this.state.options,
				simpleValue: true,
				value: this.state.value
			}),
			_react2['default'].createElement(
				'div',
				{ className: 'checkbox-list' },
				_react2['default'].createElement(
					'label',
					{ className: 'checkbox' },
					_react2['default'].createElement('input', { type: 'checkbox', className: 'checkbox-control', checked: this.state.multi, onChange: this.onChangeMulti }),
					_react2['default'].createElement(
						'span',
						{ className: 'checkbox-label' },
						'Multi-Select'
					)
				),
				_react2['default'].createElement(
					'label',
					{ className: 'checkbox' },
					_react2['default'].createElement('input', { type: 'checkbox', className: 'checkbox-control', checked: this.state.matchValue, onChange: this.onChangeMatchValue }),
					_react2['default'].createElement(
						'span',
						{ className: 'checkbox-label' },
						'Match value only'
					)
				),
				_react2['default'].createElement(
					'label',
					{ className: 'checkbox' },
					_react2['default'].createElement('input', { type: 'checkbox', className: 'checkbox-control', checked: this.state.matchLabel, onChange: this.onChangeMatchLabel }),
					_react2['default'].createElement(
						'span',
						{ className: 'checkbox-label' },
						'Match label only'
					)
				),
				_react2['default'].createElement(
					'label',
					{ className: 'checkbox' },
					_react2['default'].createElement('input', { type: 'checkbox', className: 'checkbox-control', checked: this.state.matchPos === 'start', onChange: this.onChangeMatchStart }),
					_react2['default'].createElement(
						'span',
						{ className: 'checkbox-label' },
						'Only include matches from the start of the string'
					)
				)
			),
			_react2['default'].createElement(
				'div',
				{ className: 'hint' },
				'This example uses simple numeric values'
			)
		);
	}
});

module.exports = ValuesAsNumbersField;

},{"react":undefined,"react-select-plus":undefined}],8:[function(require,module,exports){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactSelectPlus = require('react-select-plus');

var _reactSelectPlus2 = _interopRequireDefault(_reactSelectPlus);

var STATES = require('../data/states');

var StatesField = _react2['default'].createClass({
	displayName: 'StatesField',
	propTypes: {
		label: _react2['default'].PropTypes.string,
		searchable: _react2['default'].PropTypes.bool
	},
	getDefaultProps: function getDefaultProps() {
		return {
			label: 'States:',
			searchable: true
		};
	},
	getInitialState: function getInitialState() {
		return {
			country: 'AU',
			disabled: false,
			searchable: this.props.searchable,
			selectValue: 'new-south-wales',
			clearable: true
		};
	},
	switchCountry: function switchCountry(e) {
		var newCountry = e.target.value;
		console.log('Country changed to ' + newCountry);
		this.setState({
			country: newCountry,
			selectValue: null
		});
	},
	updateValue: function updateValue(newValue) {
		console.log('State changed to ' + newValue);
		this.setState({
			selectValue: newValue
		});
	},
	focusStateSelect: function focusStateSelect() {
		this.refs.stateSelect.focus();
	},
	toggleCheckbox: function toggleCheckbox(e) {
		var newState = {};
		newState[e.target.name] = e.target.checked;
		this.setState(newState);
	},
	render: function render() {
		var options = STATES[this.state.country];
		return _react2['default'].createElement(
			'div',
			{ className: 'section' },
			_react2['default'].createElement(
				'h3',
				{ className: 'section-heading' },
				this.props.label
			),
			_react2['default'].createElement(_reactSelectPlus2['default'], { ref: 'stateSelect', autofocus: true, options: options, simpleValue: true, clearable: this.state.clearable, name: 'selected-state', disabled: this.state.disabled, value: this.state.selectValue, onChange: this.updateValue, searchable: this.state.searchable }),
			_react2['default'].createElement(
				'div',
				{ style: { marginTop: 14 } },
				_react2['default'].createElement(
					'button',
					{ type: 'button', onClick: this.focusStateSelect },
					'Focus Select'
				),
				_react2['default'].createElement(
					'label',
					{ className: 'checkbox', style: { marginLeft: 10 } },
					_react2['default'].createElement('input', { type: 'checkbox', className: 'checkbox-control', name: 'searchable', checked: this.state.searchable, onChange: this.toggleCheckbox }),
					_react2['default'].createElement(
						'span',
						{ className: 'checkbox-label' },
						'Searchable'
					)
				),
				_react2['default'].createElement(
					'label',
					{ className: 'checkbox', style: { marginLeft: 10 } },
					_react2['default'].createElement('input', { type: 'checkbox', className: 'checkbox-control', name: 'disabled', checked: this.state.disabled, onChange: this.toggleCheckbox }),
					_react2['default'].createElement(
						'span',
						{ className: 'checkbox-label' },
						'Disabled'
					)
				),
				_react2['default'].createElement(
					'label',
					{ className: 'checkbox', style: { marginLeft: 10 } },
					_react2['default'].createElement('input', { type: 'checkbox', className: 'checkbox-control', name: 'clearable', checked: this.state.clearable, onChange: this.toggleCheckbox }),
					_react2['default'].createElement(
						'span',
						{ className: 'checkbox-label' },
						'Clearable'
					)
				)
			),
			_react2['default'].createElement(
				'div',
				{ className: 'checkbox-list' },
				_react2['default'].createElement(
					'label',
					{ className: 'checkbox' },
					_react2['default'].createElement('input', { type: 'radio', className: 'checkbox-control', checked: this.state.country === 'AU', value: 'AU', onChange: this.switchCountry }),
					_react2['default'].createElement(
						'span',
						{ className: 'checkbox-label' },
						'Australia'
					)
				),
				_react2['default'].createElement(
					'label',
					{ className: 'checkbox' },
					_react2['default'].createElement('input', { type: 'radio', className: 'checkbox-control', checked: this.state.country === 'US', value: 'US', onChange: this.switchCountry }),
					_react2['default'].createElement(
						'span',
						{ className: 'checkbox-label' },
						'United States'
					)
				)
			)
		);
	}
});

module.exports = StatesField;

},{"../data/states":10,"react":undefined,"react-select-plus":undefined}],9:[function(require,module,exports){
'use strict';

module.exports = [{ github: 'jedwatson', name: 'Jed Watson' }, { github: 'bruderstein', name: 'Dave Brotherstone' }, { github: 'jossmac', name: 'Joss Mackison' }, { github: 'jniechcial', name: 'Jakub Niechciał' }, { github: 'craigdallimore', name: 'Craig Dallimore' }, { github: 'julen', name: 'Julen Ruiz Aizpuru' }, { github: 'dcousens', name: 'Daniel Cousens' }, { github: 'jgautsch', name: 'Jon Gautsch' }, { github: 'dmitry-smirnov', name: 'Dmitry Smirnov' }, { github: 'trevorburnham', name: 'Trevor Burnham' }];

},{}],10:[function(require,module,exports){
'use strict';

exports.AU = [{ value: 'australian-capital-territory', label: 'Australian Capital Territory', className: 'State-ACT' }, { value: 'new-south-wales', label: 'New South Wales', className: 'State-NSW' }, { value: 'victoria', label: 'Victoria', className: 'State-Vic' }, { value: 'queensland', label: 'Queensland', className: 'State-Qld' }, { value: 'western-australia', label: 'Western Australia', className: 'State-WA' }, { value: 'south-australia', label: 'South Australia', className: 'State-SA' }, { value: 'tasmania', label: 'Tasmania', className: 'State-Tas' }, { value: 'northern-territory', label: 'Northern Territory', className: 'State-NT' }];

exports.US = [{ value: 'AL', label: 'Alabama', disabled: true }, { value: 'AK', label: 'Alaska' }, { value: 'AS', label: 'American Samoa' }, { value: 'AZ', label: 'Arizona' }, { value: 'AR', label: 'Arkansas' }, { value: 'CA', label: 'California' }, { value: 'CO', label: 'Colorado' }, { value: 'CT', label: 'Connecticut' }, { value: 'DE', label: 'Delaware' }, { value: 'DC', label: 'District Of Columbia' }, { value: 'FM', label: 'Federated States Of Micronesia' }, { value: 'FL', label: 'Florida' }, { value: 'GA', label: 'Georgia' }, { value: 'GU', label: 'Guam' }, { value: 'HI', label: 'Hawaii' }, { value: 'ID', label: 'Idaho' }, { value: 'IL', label: 'Illinois' }, { value: 'IN', label: 'Indiana' }, { value: 'IA', label: 'Iowa' }, { value: 'KS', label: 'Kansas' }, { value: 'KY', label: 'Kentucky' }, { value: 'LA', label: 'Louisiana' }, { value: 'ME', label: 'Maine' }, { value: 'MH', label: 'Marshall Islands' }, { value: 'MD', label: 'Maryland' }, { value: 'MA', label: 'Massachusetts' }, { value: 'MI', label: 'Michigan' }, { value: 'MN', label: 'Minnesota' }, { value: 'MS', label: 'Mississippi' }, { value: 'MO', label: 'Missouri' }, { value: 'MT', label: 'Montana' }, { value: 'NE', label: 'Nebraska' }, { value: 'NV', label: 'Nevada' }, { value: 'NH', label: 'New Hampshire' }, { value: 'NJ', label: 'New Jersey' }, { value: 'NM', label: 'New Mexico' }, { value: 'NY', label: 'New York' }, { value: 'NC', label: 'North Carolina' }, { value: 'ND', label: 'North Dakota' }, { value: 'MP', label: 'Northern Mariana Islands' }, { value: 'OH', label: 'Ohio' }, { value: 'OK', label: 'Oklahoma' }, { value: 'OR', label: 'Oregon' }, { value: 'PW', label: 'Palau' }, { value: 'PA', label: 'Pennsylvania' }, { value: 'PR', label: 'Puerto Rico' }, { value: 'RI', label: 'Rhode Island' }, { value: 'SC', label: 'South Carolina' }, { value: 'SD', label: 'South Dakota' }, { value: 'TN', label: 'Tennessee' }, { value: 'TX', label: 'Texas' }, { value: 'UT', label: 'Utah' }, { value: 'VT', label: 'Vermont' }, { value: 'VI', label: 'Virgin Islands' }, { value: 'VA', label: 'Virginia' }, { value: 'WA', label: 'Washington' }, { value: 'WV', label: 'West Virginia' }, { value: 'WI', label: 'Wisconsin' }, { value: 'WY', label: 'Wyoming' }];

},{}],11:[function(require,module,exports){
'use strict';

module.exports = [{ value: 'John Smith', label: 'John Smith', email: 'john@smith.com' }, { value: 'Merry Jane', label: 'Merry Jane', email: 'merry@jane.com' }, { value: 'Stan Hoper', label: 'Stan Hoper', email: 'stan@hoper.com' }];

},{}],12:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

// If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

module.exports = function(qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  var regexp = /\+/g;
  qs = qs.split(sep);

  var maxKeys = 1000;
  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }

  var len = qs.length;
  // maxKeys <= 0 means that we should not limit keys count
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr, vstr, k, v;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);

    if (!hasOwnProperty(obj, k)) {
      obj[k] = v;
    } else if (isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

},{}],13:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

var stringifyPrimitive = function(v) {
  switch (typeof v) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v : '';

    default:
      return '';
  }
};

module.exports = function(obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';
  if (obj === null) {
    obj = undefined;
  }

  if (typeof obj === 'object') {
    return map(objectKeys(obj), function(k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
      if (isArray(obj[k])) {
        return map(obj[k], function(v) {
          return ks + encodeURIComponent(stringifyPrimitive(v));
        }).join(sep);
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
      }
    }).join(sep);

  }

  if (!name) return '';
  return encodeURIComponent(stringifyPrimitive(name)) + eq +
         encodeURIComponent(stringifyPrimitive(obj));
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

function map (xs, f) {
  if (xs.map) return xs.map(f);
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    res.push(f(xs[i], i));
  }
  return res;
}

var objectKeys = Object.keys || function (obj) {
  var res = [];
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
  }
  return res;
};

},{}],14:[function(require,module,exports){
'use strict';

exports.decode = exports.parse = require('./decode');
exports.encode = exports.stringify = require('./encode');

},{"./decode":12,"./encode":13}],15:[function(require,module,exports){
// Generated by CoffeeScript 1.10.0
var React, isRetina, md5, querystring;

React = require('react');

md5 = require('md5');

querystring = require('querystring');

isRetina = require('is-retina');

module.exports = React.createClass({
  displayName: 'Gravatar',
  propTypes: {
    email: React.PropTypes.string,
    md5: React.PropTypes.string,
    size: React.PropTypes.number,
    rating: React.PropTypes.string,
    https: React.PropTypes.bool,
    "default": React.PropTypes.string,
    className: React.PropTypes.string
  },
  getDefaultProps: function() {
    return {
      size: 50,
      rating: 'g',
      https: false,
      "default": "retro",
      className: ""
    };
  },
  render: function() {
    var base, hash, modernBrowser, query, retinaQuery, retinaSrc, src;
    base = this.props.https ? "https://secure.gravatar.com/avatar/" : 'http://www.gravatar.com/avatar/';
    query = querystring.stringify({
      s: this.props.size,
      r: this.props.rating,
      d: this.props["default"]
    });
    retinaQuery = querystring.stringify({
      s: this.props.size * 2,
      r: this.props.rating,
      d: this.props["default"]
    });
    if (this.props.md5) {
      hash = this.props.md5;
    } else if (this.props.email) {
      hash = md5(this.props.email);
    } else {
      console.warn('Gravatar image can not be fetched. Either the "email" or "md5" prop must be specified.');
      return React.createElement("script", null);
    }
    src = base + hash + "?" + query;
    retinaSrc = base + hash + "?" + retinaQuery;
    modernBrowser = true;
    if (typeof window !== "undefined" && window !== null) {
      modernBrowser = 'srcset' in document.createElement('img');
    }
    if (!modernBrowser && isRetina()) {
      return React.createElement("img", React.__spread({
        "style": this.props.style,
        "className": "react-gravatar " + this.props.className,
        "src": retinaSrc,
        "height": this.props.size,
        "width": this.props.size
      }, this.props));
    } else {
      return React.createElement("img", React.__spread({
        "style": this.props.style,
        "className": "react-gravatar " + this.props.className,
        "src": src,
        "srcSet": retinaSrc + " 2x",
        "height": this.props.size,
        "width": this.props.size
      }, this.props));
    }
  }
});

},{"is-retina":16,"md5":17,"querystring":14,"react":undefined}],16:[function(require,module,exports){
module.exports = function() {
  var mediaQuery;
  if (typeof window !== "undefined" && window !== null) {
    mediaQuery = "(-webkit-min-device-pixel-ratio: 1.25), (min--moz-device-pixel-ratio: 1.25), (-o-min-device-pixel-ratio: 5/4), (min-resolution: 1.25dppx)";
    if (window.devicePixelRatio > 1.25) {
      return true;
    }
    if (window.matchMedia && window.matchMedia(mediaQuery).matches) {
      return true;
    }
  }
  return false;
};

},{}],17:[function(require,module,exports){
(function(){
  var crypt = require('crypt'),
      utf8 = require('charenc').utf8,
      isBuffer = require('is-buffer'),
      bin = require('charenc').bin,

  // The core
  md5 = function (message, options) {
    // Convert to byte array
    if (message.constructor == String)
      if (options && options.encoding === 'binary')
        message = bin.stringToBytes(message);
      else
        message = utf8.stringToBytes(message);
    else if (isBuffer(message))
      message = Array.prototype.slice.call(message, 0);
    else if (!Array.isArray(message))
      message = message.toString();
    // else, assume byte array already

    var m = crypt.bytesToWords(message),
        l = message.length * 8,
        a =  1732584193,
        b = -271733879,
        c = -1732584194,
        d =  271733878;

    // Swap endian
    for (var i = 0; i < m.length; i++) {
      m[i] = ((m[i] <<  8) | (m[i] >>> 24)) & 0x00FF00FF |
             ((m[i] << 24) | (m[i] >>>  8)) & 0xFF00FF00;
    }

    // Padding
    m[l >>> 5] |= 0x80 << (l % 32);
    m[(((l + 64) >>> 9) << 4) + 14] = l;

    // Method shortcuts
    var FF = md5._ff,
        GG = md5._gg,
        HH = md5._hh,
        II = md5._ii;

    for (var i = 0; i < m.length; i += 16) {

      var aa = a,
          bb = b,
          cc = c,
          dd = d;

      a = FF(a, b, c, d, m[i+ 0],  7, -680876936);
      d = FF(d, a, b, c, m[i+ 1], 12, -389564586);
      c = FF(c, d, a, b, m[i+ 2], 17,  606105819);
      b = FF(b, c, d, a, m[i+ 3], 22, -1044525330);
      a = FF(a, b, c, d, m[i+ 4],  7, -176418897);
      d = FF(d, a, b, c, m[i+ 5], 12,  1200080426);
      c = FF(c, d, a, b, m[i+ 6], 17, -1473231341);
      b = FF(b, c, d, a, m[i+ 7], 22, -45705983);
      a = FF(a, b, c, d, m[i+ 8],  7,  1770035416);
      d = FF(d, a, b, c, m[i+ 9], 12, -1958414417);
      c = FF(c, d, a, b, m[i+10], 17, -42063);
      b = FF(b, c, d, a, m[i+11], 22, -1990404162);
      a = FF(a, b, c, d, m[i+12],  7,  1804603682);
      d = FF(d, a, b, c, m[i+13], 12, -40341101);
      c = FF(c, d, a, b, m[i+14], 17, -1502002290);
      b = FF(b, c, d, a, m[i+15], 22,  1236535329);

      a = GG(a, b, c, d, m[i+ 1],  5, -165796510);
      d = GG(d, a, b, c, m[i+ 6],  9, -1069501632);
      c = GG(c, d, a, b, m[i+11], 14,  643717713);
      b = GG(b, c, d, a, m[i+ 0], 20, -373897302);
      a = GG(a, b, c, d, m[i+ 5],  5, -701558691);
      d = GG(d, a, b, c, m[i+10],  9,  38016083);
      c = GG(c, d, a, b, m[i+15], 14, -660478335);
      b = GG(b, c, d, a, m[i+ 4], 20, -405537848);
      a = GG(a, b, c, d, m[i+ 9],  5,  568446438);
      d = GG(d, a, b, c, m[i+14],  9, -1019803690);
      c = GG(c, d, a, b, m[i+ 3], 14, -187363961);
      b = GG(b, c, d, a, m[i+ 8], 20,  1163531501);
      a = GG(a, b, c, d, m[i+13],  5, -1444681467);
      d = GG(d, a, b, c, m[i+ 2],  9, -51403784);
      c = GG(c, d, a, b, m[i+ 7], 14,  1735328473);
      b = GG(b, c, d, a, m[i+12], 20, -1926607734);

      a = HH(a, b, c, d, m[i+ 5],  4, -378558);
      d = HH(d, a, b, c, m[i+ 8], 11, -2022574463);
      c = HH(c, d, a, b, m[i+11], 16,  1839030562);
      b = HH(b, c, d, a, m[i+14], 23, -35309556);
      a = HH(a, b, c, d, m[i+ 1],  4, -1530992060);
      d = HH(d, a, b, c, m[i+ 4], 11,  1272893353);
      c = HH(c, d, a, b, m[i+ 7], 16, -155497632);
      b = HH(b, c, d, a, m[i+10], 23, -1094730640);
      a = HH(a, b, c, d, m[i+13],  4,  681279174);
      d = HH(d, a, b, c, m[i+ 0], 11, -358537222);
      c = HH(c, d, a, b, m[i+ 3], 16, -722521979);
      b = HH(b, c, d, a, m[i+ 6], 23,  76029189);
      a = HH(a, b, c, d, m[i+ 9],  4, -640364487);
      d = HH(d, a, b, c, m[i+12], 11, -421815835);
      c = HH(c, d, a, b, m[i+15], 16,  530742520);
      b = HH(b, c, d, a, m[i+ 2], 23, -995338651);

      a = II(a, b, c, d, m[i+ 0],  6, -198630844);
      d = II(d, a, b, c, m[i+ 7], 10,  1126891415);
      c = II(c, d, a, b, m[i+14], 15, -1416354905);
      b = II(b, c, d, a, m[i+ 5], 21, -57434055);
      a = II(a, b, c, d, m[i+12],  6,  1700485571);
      d = II(d, a, b, c, m[i+ 3], 10, -1894986606);
      c = II(c, d, a, b, m[i+10], 15, -1051523);
      b = II(b, c, d, a, m[i+ 1], 21, -2054922799);
      a = II(a, b, c, d, m[i+ 8],  6,  1873313359);
      d = II(d, a, b, c, m[i+15], 10, -30611744);
      c = II(c, d, a, b, m[i+ 6], 15, -1560198380);
      b = II(b, c, d, a, m[i+13], 21,  1309151649);
      a = II(a, b, c, d, m[i+ 4],  6, -145523070);
      d = II(d, a, b, c, m[i+11], 10, -1120210379);
      c = II(c, d, a, b, m[i+ 2], 15,  718787259);
      b = II(b, c, d, a, m[i+ 9], 21, -343485551);

      a = (a + aa) >>> 0;
      b = (b + bb) >>> 0;
      c = (c + cc) >>> 0;
      d = (d + dd) >>> 0;
    }

    return crypt.endian([a, b, c, d]);
  };

  // Auxiliary functions
  md5._ff  = function (a, b, c, d, x, s, t) {
    var n = a + (b & c | ~b & d) + (x >>> 0) + t;
    return ((n << s) | (n >>> (32 - s))) + b;
  };
  md5._gg  = function (a, b, c, d, x, s, t) {
    var n = a + (b & d | c & ~d) + (x >>> 0) + t;
    return ((n << s) | (n >>> (32 - s))) + b;
  };
  md5._hh  = function (a, b, c, d, x, s, t) {
    var n = a + (b ^ c ^ d) + (x >>> 0) + t;
    return ((n << s) | (n >>> (32 - s))) + b;
  };
  md5._ii  = function (a, b, c, d, x, s, t) {
    var n = a + (c ^ (b | ~d)) + (x >>> 0) + t;
    return ((n << s) | (n >>> (32 - s))) + b;
  };

  // Package private blocksize
  md5._blocksize = 16;
  md5._digestsize = 16;

  module.exports = function (message, options) {
    if(typeof message == 'undefined')
      return;

    var digestbytes = crypt.wordsToBytes(md5(message, options));
    return options && options.asBytes ? digestbytes :
        options && options.asString ? bin.bytesToString(digestbytes) :
        crypt.bytesToHex(digestbytes);
  };

})();

},{"charenc":18,"crypt":19,"is-buffer":20}],18:[function(require,module,exports){
var charenc = {
  // UTF-8 encoding
  utf8: {
    // Convert a string to a byte array
    stringToBytes: function(str) {
      return charenc.bin.stringToBytes(unescape(encodeURIComponent(str)));
    },

    // Convert a byte array to a string
    bytesToString: function(bytes) {
      return decodeURIComponent(escape(charenc.bin.bytesToString(bytes)));
    }
  },

  // Binary encoding
  bin: {
    // Convert a string to a byte array
    stringToBytes: function(str) {
      for (var bytes = [], i = 0; i < str.length; i++)
        bytes.push(str.charCodeAt(i) & 0xFF);
      return bytes;
    },

    // Convert a byte array to a string
    bytesToString: function(bytes) {
      for (var str = [], i = 0; i < bytes.length; i++)
        str.push(String.fromCharCode(bytes[i]));
      return str.join('');
    }
  }
};

module.exports = charenc;

},{}],19:[function(require,module,exports){
(function() {
  var base64map
      = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',

  crypt = {
    // Bit-wise rotation left
    rotl: function(n, b) {
      return (n << b) | (n >>> (32 - b));
    },

    // Bit-wise rotation right
    rotr: function(n, b) {
      return (n << (32 - b)) | (n >>> b);
    },

    // Swap big-endian to little-endian and vice versa
    endian: function(n) {
      // If number given, swap endian
      if (n.constructor == Number) {
        return crypt.rotl(n, 8) & 0x00FF00FF | crypt.rotl(n, 24) & 0xFF00FF00;
      }

      // Else, assume array and swap all items
      for (var i = 0; i < n.length; i++)
        n[i] = crypt.endian(n[i]);
      return n;
    },

    // Generate an array of any length of random bytes
    randomBytes: function(n) {
      for (var bytes = []; n > 0; n--)
        bytes.push(Math.floor(Math.random() * 256));
      return bytes;
    },

    // Convert a byte array to big-endian 32-bit words
    bytesToWords: function(bytes) {
      for (var words = [], i = 0, b = 0; i < bytes.length; i++, b += 8)
        words[b >>> 5] |= bytes[i] << (24 - b % 32);
      return words;
    },

    // Convert big-endian 32-bit words to a byte array
    wordsToBytes: function(words) {
      for (var bytes = [], b = 0; b < words.length * 32; b += 8)
        bytes.push((words[b >>> 5] >>> (24 - b % 32)) & 0xFF);
      return bytes;
    },

    // Convert a byte array to a hex string
    bytesToHex: function(bytes) {
      for (var hex = [], i = 0; i < bytes.length; i++) {
        hex.push((bytes[i] >>> 4).toString(16));
        hex.push((bytes[i] & 0xF).toString(16));
      }
      return hex.join('');
    },

    // Convert a hex string to a byte array
    hexToBytes: function(hex) {
      for (var bytes = [], c = 0; c < hex.length; c += 2)
        bytes.push(parseInt(hex.substr(c, 2), 16));
      return bytes;
    },

    // Convert a byte array to a base-64 string
    bytesToBase64: function(bytes) {
      for (var base64 = [], i = 0; i < bytes.length; i += 3) {
        var triplet = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];
        for (var j = 0; j < 4; j++)
          if (i * 8 + j * 6 <= bytes.length * 8)
            base64.push(base64map.charAt((triplet >>> 6 * (3 - j)) & 0x3F));
          else
            base64.push('=');
      }
      return base64.join('');
    },

    // Convert a base-64 string to a byte array
    base64ToBytes: function(base64) {
      // Remove non-base-64 characters
      base64 = base64.replace(/[^A-Z0-9+\/]/ig, '');

      for (var bytes = [], i = 0, imod4 = 0; i < base64.length;
          imod4 = ++i % 4) {
        if (imod4 == 0) continue;
        bytes.push(((base64map.indexOf(base64.charAt(i - 1))
            & (Math.pow(2, -2 * imod4 + 8) - 1)) << (imod4 * 2))
            | (base64map.indexOf(base64.charAt(i)) >>> (6 - imod4 * 2)));
      }
      return bytes;
    }
  };

  module.exports = crypt;
})();

},{}],20:[function(require,module,exports){
/**
 * Determine if an object is Buffer
 *
 * Author:   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * License:  MIT
 *
 * `npm install is-buffer`
 */

module.exports = function (obj) {
  return !!(
    obj != null &&
    obj.constructor &&
    typeof obj.constructor.isBuffer === 'function' &&
    obj.constructor.isBuffer(obj)
  )
}

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9yZWFjdC1jb21wb25lbnQtZ3VscC10YXNrcy9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL1VzZXJzL3RidXJuaGFtL2Rldi9zcmMvcmVhY3Qtc2VsZWN0LXBsdXMvZXhhbXBsZXMvc3JjL2FwcC5qcyIsIi9Vc2Vycy90YnVybmhhbS9kZXYvc3JjL3JlYWN0LXNlbGVjdC1wbHVzL2V4YW1wbGVzL3NyYy9jb21wb25lbnRzL0NvbnRyaWJ1dG9ycy5qcyIsIi9Vc2Vycy90YnVybmhhbS9kZXYvc3JjL3JlYWN0LXNlbGVjdC1wbHVzL2V4YW1wbGVzL3NyYy9jb21wb25lbnRzL0N1c3RvbUNvbXBvbmVudHMuanMiLCIvVXNlcnMvdGJ1cm5oYW0vZGV2L3NyYy9yZWFjdC1zZWxlY3QtcGx1cy9leGFtcGxlcy9zcmMvY29tcG9uZW50cy9DdXN0b21SZW5kZXIuanMiLCIvVXNlcnMvdGJ1cm5oYW0vZGV2L3NyYy9yZWFjdC1zZWxlY3QtcGx1cy9leGFtcGxlcy9zcmMvY29tcG9uZW50cy9Hcm91cGVkT3B0aW9uc0ZpZWxkLmpzIiwiL1VzZXJzL3RidXJuaGFtL2Rldi9zcmMvcmVhY3Qtc2VsZWN0LXBsdXMvZXhhbXBsZXMvc3JjL2NvbXBvbmVudHMvTXVsdGlzZWxlY3QuanMiLCIvVXNlcnMvdGJ1cm5oYW0vZGV2L3NyYy9yZWFjdC1zZWxlY3QtcGx1cy9leGFtcGxlcy9zcmMvY29tcG9uZW50cy9OdW1lcmljU2VsZWN0LmpzIiwiL1VzZXJzL3RidXJuaGFtL2Rldi9zcmMvcmVhY3Qtc2VsZWN0LXBsdXMvZXhhbXBsZXMvc3JjL2NvbXBvbmVudHMvU3RhdGVzLmpzIiwiL1VzZXJzL3RidXJuaGFtL2Rldi9zcmMvcmVhY3Qtc2VsZWN0LXBsdXMvZXhhbXBsZXMvc3JjL2RhdGEvY29udHJpYnV0b3JzLmpzIiwiL1VzZXJzL3RidXJuaGFtL2Rldi9zcmMvcmVhY3Qtc2VsZWN0LXBsdXMvZXhhbXBsZXMvc3JjL2RhdGEvc3RhdGVzLmpzIiwiL1VzZXJzL3RidXJuaGFtL2Rldi9zcmMvcmVhY3Qtc2VsZWN0LXBsdXMvZXhhbXBsZXMvc3JjL2RhdGEvdXNlcnMuanMiLCJub2RlX21vZHVsZXMvcmVhY3QtY29tcG9uZW50LWd1bHAtdGFza3Mvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL3F1ZXJ5c3RyaW5nLWVzMy9kZWNvZGUuanMiLCJub2RlX21vZHVsZXMvcmVhY3QtY29tcG9uZW50LWd1bHAtdGFza3Mvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL3F1ZXJ5c3RyaW5nLWVzMy9lbmNvZGUuanMiLCJub2RlX21vZHVsZXMvcmVhY3QtY29tcG9uZW50LWd1bHAtdGFza3Mvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL3F1ZXJ5c3RyaW5nLWVzMy9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9yZWFjdC1ncmF2YXRhci9kaXN0L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3JlYWN0LWdyYXZhdGFyL25vZGVfbW9kdWxlcy9pcy1yZXRpbmEvaW5kZXguanMiLCJub2RlX21vZHVsZXMvcmVhY3QtZ3JhdmF0YXIvbm9kZV9tb2R1bGVzL21kNS9tZDUuanMiLCJub2RlX21vZHVsZXMvcmVhY3QtZ3JhdmF0YXIvbm9kZV9tb2R1bGVzL21kNS9ub2RlX21vZHVsZXMvY2hhcmVuYy9jaGFyZW5jLmpzIiwibm9kZV9tb2R1bGVzL3JlYWN0LWdyYXZhdGFyL25vZGVfbW9kdWxlcy9tZDUvbm9kZV9tb2R1bGVzL2NyeXB0L2NyeXB0LmpzIiwibm9kZV9tb2R1bGVzL3JlYWN0LWdyYXZhdGFyL25vZGVfbW9kdWxlcy9tZDUvbm9kZV9tb2R1bGVzL2lzLWJ1ZmZlci9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7OztxQkNFa0IsT0FBTzs7Ozt3QkFDSixXQUFXOzs7OytCQUNiLG1CQUFtQjs7OztzQ0FFYiwy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RUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLEVBQy9CLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsVUFBVSxFQUFFLEVBQ2xDLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFLEVBQ2pDLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLEVBQzlCLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLEVBQ2hDLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsVUFBVSxFQUFFLEVBQ2xDLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsV0FBVyxFQUFFLEVBQ25DLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLEVBQy9CLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsa0JBQWtCLEVBQUUsRUFDMUMsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxVQUFVLEVBQUUsRUFDbEMsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxlQUFlLEVBQUUsRUFDdkMsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxVQUFVLEVBQUUsRUFDbEMsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxXQUFXLEVBQUUsRUFDbkMsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxhQUFhLEVBQUUsRUFDckMsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxVQUFVLEVBQUUsRUFDbEMsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUUsRUFDakMsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxVQUFVLEVBQUUsRUFDbEMsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsRUFDaEMs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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qIGVzbGludCByZWFjdC9wcm9wLXR5cGVzOiAwICovXG5cbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUmVhY3RET00gZnJvbSAncmVhY3QtZG9tJztcbmltcG9ydCBTZWxlY3QgZnJvbSAncmVhY3Qtc2VsZWN0LXBsdXMnO1xuXG5pbXBvcnQgQ29udHJpYnV0b3JzIGZyb20gJy4vY29tcG9uZW50cy9Db250cmlidXRvcnMnO1xuaW1wb3J0IEN1c3RvbUNvbXBvbmVudHMgZnJvbSAnLi9jb21wb25lbnRzL0N1c3RvbUNvbXBvbmVudHMnO1xuaW1wb3J0IEN1c3RvbVJlbmRlciBmcm9tICcuL2NvbXBvbmVudHMvQ3VzdG9tUmVuZGVyJztcbmltcG9ydCBHcm91cGVkT3B0aW9uc0ZpZWxkIGZyb20gJy4vY29tcG9uZW50cy9Hcm91cGVkT3B0aW9uc0ZpZWxkJztcbmltcG9ydCBNdWx0aXNlbGVjdCBmcm9tICcuL2NvbXBvbmVudHMvTXVsdGlzZWxlY3QnO1xuaW1wb3J0IE51bWVyaWNTZWxlY3QgZnJvbSAnLi9jb21wb25lbnRzL051bWVyaWNTZWxlY3QnO1xuaW1wb3J0IFN0YXRlcyBmcm9tICcuL2NvbXBvbmVudHMvU3RhdGVzJztcblxuUmVhY3RET00ucmVuZGVyKFxuXHQ8ZGl2PlxuXHRcdDxTdGF0ZXMgbGFiZWw9XCJTdGF0ZXNcIiBzZWFyY2hhYmxlIC8+XG5cdFx0PE11bHRpc2VsZWN0IGxhYmVsPVwiTXVsdGlzZWxlY3RcIiAvPlxuXHRcdDxDb250cmlidXRvcnMgbGFiZWw9XCJDb250cmlidXRvcnMgKEFzeW5jKVwiIC8+XG5cdFx0PE51bWVyaWNTZWxlY3QgbGFiZWw9XCJOdW1lcmljIFZhbHVlc1wiIC8+XG5cdFx0PEdyb3VwZWRPcHRpb25zRmllbGQgbGFiZWw9XCJPcHRpb24gR3JvdXBzXCIgLz5cblx0XHQ8Q3VzdG9tUmVuZGVyIGxhYmVsPVwiQ3VzdG9tIFJlbmRlciBNZXRob2RzXCIvPlxuXHRcdDxDdXN0b21Db21wb25lbnRzIGxhYmVsPVwiQ3VzdG9tIFBsYWNlaG9sZGVyLCBPcHRpb24gYW5kIFZhbHVlIENvbXBvbmVudHNcIiAvPlxuXHRcdHsvKlxuXHRcdDxTZWxlY3RlZFZhbHVlc0ZpZWxkIGxhYmVsPVwiT3B0aW9uIENyZWF0aW9uICh0YWdzIG1vZGUpXCIgb3B0aW9ucz17RkxBVk9VUlN9IGFsbG93Q3JlYXRlIGhpbnQ9XCJFbnRlciBhIHZhbHVlIHRoYXQncyBOT1QgaW4gdGhlIGxpc3QsIHRoZW4gaGl0IHJldHVyblwiIC8+XG5cdFx0Ki99XG5cdDwvZGl2Pixcblx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2V4YW1wbGUnKVxuKTtcbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgU2VsZWN0IGZyb20gJ3JlYWN0LXNlbGVjdC1wbHVzJztcblxuY29uc3QgQ09OVFJJQlVUT1JTID0gcmVxdWlyZSgnLi4vZGF0YS9jb250cmlidXRvcnMnKTtcbmNvbnN0IE1BWF9DT05UUklCVVRPUlMgPSA2O1xuY29uc3QgQVNZTkNfREVMQVkgPSA1MDA7XG5cbmNvbnN0IENvbnRyaWJ1dG9ycyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblx0ZGlzcGxheU5hbWU6ICdDb250cmlidXRvcnMnLFxuXHRwcm9wVHlwZXM6IHtcblx0XHRsYWJlbDogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcblx0fSxcblx0Z2V0SW5pdGlhbFN0YXRlICgpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0bXVsdGk6IHRydWUsXG5cdFx0XHR2YWx1ZTogW0NPTlRSSUJVVE9SU1swXV0sXG5cdFx0fTtcblx0fSxcblx0b25DaGFuZ2UgKHZhbHVlKSB7XG5cdFx0dGhpcy5zZXRTdGF0ZSh7XG5cdFx0XHR2YWx1ZTogdmFsdWUsXG5cdFx0fSk7XG5cdH0sXG5cdHN3aXRjaFRvTXVsdGkgKCkge1xuXHRcdHRoaXMuc2V0U3RhdGUoe1xuXHRcdFx0bXVsdGk6IHRydWUsXG5cdFx0XHR2YWx1ZTogW3RoaXMuc3RhdGUudmFsdWVdLFxuXHRcdH0pO1xuXHR9LFxuXHRzd2l0Y2hUb1NpbmdsZSAoKSB7XG5cdFx0dGhpcy5zZXRTdGF0ZSh7XG5cdFx0XHRtdWx0aTogZmFsc2UsXG5cdFx0XHR2YWx1ZTogdGhpcy5zdGF0ZS52YWx1ZVswXSxcblx0XHR9KTtcblx0fSxcblx0Z2V0Q29udHJpYnV0b3JzIChpbnB1dCwgY2FsbGJhY2spIHtcblx0XHRpbnB1dCA9IGlucHV0LnRvTG93ZXJDYXNlKCk7XG5cdFx0dmFyIG9wdGlvbnMgPSBDT05UUklCVVRPUlMuZmlsdGVyKGkgPT4ge1xuXHRcdFx0cmV0dXJuIGkuZ2l0aHViLnN1YnN0cigwLCBpbnB1dC5sZW5ndGgpID09PSBpbnB1dDtcblx0XHR9KTtcblx0XHR2YXIgZGF0YSA9IHtcblx0XHRcdG9wdGlvbnM6IG9wdGlvbnMuc2xpY2UoMCwgTUFYX0NPTlRSSUJVVE9SUyksXG5cdFx0XHRjb21wbGV0ZTogb3B0aW9ucy5sZW5ndGggPD0gTUFYX0NPTlRSSUJVVE9SUyxcblx0XHR9O1xuXHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG5cdFx0XHRjYWxsYmFjayhudWxsLCBkYXRhKTtcblx0XHR9LCBBU1lOQ19ERUxBWSk7XG5cdH0sXG5cdGdvdG9Db250cmlidXRvciAodmFsdWUsIGV2ZW50KSB7XG5cdFx0d2luZG93Lm9wZW4oJ2h0dHBzOi8vZ2l0aHViLmNvbS8nICsgdmFsdWUuZ2l0aHViKTtcblx0fSxcblx0cmVuZGVyICgpIHtcblx0XHRyZXR1cm4gKFxuXHRcdFx0PGRpdiBjbGFzc05hbWU9XCJzZWN0aW9uXCI+XG5cdFx0XHRcdDxoMyBjbGFzc05hbWU9XCJzZWN0aW9uLWhlYWRpbmdcIj57dGhpcy5wcm9wcy5sYWJlbH08L2gzPlxuXHRcdFx0XHQ8U2VsZWN0LkFzeW5jIG11bHRpPXt0aGlzLnN0YXRlLm11bHRpfSB2YWx1ZT17dGhpcy5zdGF0ZS52YWx1ZX0gb25DaGFuZ2U9e3RoaXMub25DaGFuZ2V9IG9uVmFsdWVDbGljaz17dGhpcy5nb3RvQ29udHJpYnV0b3J9IHZhbHVlS2V5PVwiZ2l0aHViXCIgbGFiZWxLZXk9XCJuYW1lXCIgbG9hZE9wdGlvbnM9e3RoaXMuZ2V0Q29udHJpYnV0b3JzfSAvPlxuXHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT1cImNoZWNrYm94LWxpc3RcIj5cblx0XHRcdFx0XHQ8bGFiZWwgY2xhc3NOYW1lPVwiY2hlY2tib3hcIj5cblx0XHRcdFx0XHRcdDxpbnB1dCB0eXBlPVwicmFkaW9cIiBjbGFzc05hbWU9XCJjaGVja2JveC1jb250cm9sXCIgY2hlY2tlZD17dGhpcy5zdGF0ZS5tdWx0aX0gb25DaGFuZ2U9e3RoaXMuc3dpdGNoVG9NdWx0aX0vPlxuXHRcdFx0XHRcdFx0PHNwYW4gY2xhc3NOYW1lPVwiY2hlY2tib3gtbGFiZWxcIj5NdWx0aXNlbGVjdDwvc3Bhbj5cblx0XHRcdFx0XHQ8L2xhYmVsPlxuXHRcdFx0XHRcdDxsYWJlbCBjbGFzc05hbWU9XCJjaGVja2JveFwiPlxuXHRcdFx0XHRcdFx0PGlucHV0IHR5cGU9XCJyYWRpb1wiIGNsYXNzTmFtZT1cImNoZWNrYm94LWNvbnRyb2xcIiBjaGVja2VkPXshdGhpcy5zdGF0ZS5tdWx0aX0gb25DaGFuZ2U9e3RoaXMuc3dpdGNoVG9TaW5nbGV9Lz5cblx0XHRcdFx0XHRcdDxzcGFuIGNsYXNzTmFtZT1cImNoZWNrYm94LWxhYmVsXCI+U2luZ2xlIFZhbHVlPC9zcGFuPlxuXHRcdFx0XHRcdDwvbGFiZWw+XG5cdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT1cImhpbnRcIj5UaGlzIGV4YW1wbGUgaW1wbGVtZW50cyBjdXN0b20gbGFiZWwgYW5kIHZhbHVlIHByb3BlcnRpZXMsIGFzeW5jIG9wdGlvbnMgYW5kIG9wZW5zIHRoZSBnaXRodWIgcHJvZmlsZXMgaW4gYSBuZXcgd2luZG93IHdoZW4gdmFsdWVzIGFyZSBjbGlja2VkPC9kaXY+XG5cdFx0XHQ8L2Rpdj5cblx0XHQpO1xuXHR9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBDb250cmlidXRvcnM7XG4iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFNlbGVjdCBmcm9tICdyZWFjdC1zZWxlY3QtcGx1cyc7XG5pbXBvcnQgR3JhdmF0YXIgZnJvbSAncmVhY3QtZ3JhdmF0YXInO1xuXG5jb25zdCBVU0VSUyA9IHJlcXVpcmUoJy4uL2RhdGEvdXNlcnMnKTtcbmNvbnN0IEdSQVZBVEFSX1NJWkUgPSAxNTtcblxuY29uc3QgR3JhdmF0YXJPcHRpb24gPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cdHByb3BUeXBlczoge1xuXHRcdGNoaWxkcmVuOiBSZWFjdC5Qcm9wVHlwZXMubm9kZSxcblx0XHRjbGFzc05hbWU6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG5cdFx0aXNEaXNhYmxlZDogUmVhY3QuUHJvcFR5cGVzLmJvb2wsXG5cdFx0aXNGb2N1c2VkOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbCxcblx0XHRpc1NlbGVjdGVkOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbCxcblx0XHRvbkZvY3VzOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYyxcblx0XHRvblNlbGVjdDogUmVhY3QuUHJvcFR5cGVzLmZ1bmMsXG5cdFx0b25VbmZvY3VzOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYyxcblx0XHRvcHRpb246IFJlYWN0LlByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcblx0fSxcblx0aGFuZGxlTW91c2VEb3duIChldmVudCkge1xuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdFx0dGhpcy5wcm9wcy5vblNlbGVjdCh0aGlzLnByb3BzLm9wdGlvbiwgZXZlbnQpO1xuXHR9LFxuXHRoYW5kbGVNb3VzZUVudGVyIChldmVudCkge1xuXHRcdHRoaXMucHJvcHMub25Gb2N1cyh0aGlzLnByb3BzLm9wdGlvbiwgZXZlbnQpO1xuXHR9LFxuXHRoYW5kbGVNb3VzZU1vdmUgKGV2ZW50KSB7XG5cdFx0aWYgKHRoaXMucHJvcHMuaXNGb2N1c2VkKSByZXR1cm47XG5cdFx0dGhpcy5wcm9wcy5vbkZvY3VzKHRoaXMucHJvcHMub3B0aW9uLCBldmVudCk7XG5cdH0sXG5cdGhhbmRsZU1vdXNlTGVhdmUgKGV2ZW50KSB7XG5cdFx0dGhpcy5wcm9wcy5vblVuZm9jdXModGhpcy5wcm9wcy5vcHRpb24sIGV2ZW50KTtcblx0fSxcblx0cmVuZGVyICgpIHtcblx0XHRsZXQgZ3JhdmF0YXJTdHlsZSA9IHtcblx0XHRcdGJvcmRlclJhZGl1czogMyxcblx0XHRcdGRpc3BsYXk6ICdpbmxpbmUtYmxvY2snLFxuXHRcdFx0bWFyZ2luUmlnaHQ6IDEwLFxuXHRcdFx0cG9zaXRpb246ICdyZWxhdGl2ZScsXG5cdFx0XHR0b3A6IC0yLFxuXHRcdFx0dmVydGljYWxBbGlnbjogJ21pZGRsZScsXG5cdFx0fTtcblx0XHRyZXR1cm4gKFxuXHRcdFx0PGRpdiBjbGFzc05hbWU9e3RoaXMucHJvcHMuY2xhc3NOYW1lfVxuXHRcdFx0XHRvbk1vdXNlRG93bj17dGhpcy5oYW5kbGVNb3VzZURvd259XG5cdFx0XHRcdG9uTW91c2VFbnRlcj17dGhpcy5oYW5kbGVNb3VzZUVudGVyfVxuXHRcdFx0XHRvbk1vdXNlTW92ZT17dGhpcy5oYW5kbGVNb3VzZU1vdmV9XG5cdFx0XHRcdG9uTW91c2VMZWF2ZT17dGhpcy5oYW5kbGVNb3VzZUxlYXZlfVxuXHRcdFx0XHR0aXRsZT17dGhpcy5wcm9wcy5vcHRpb24udGl0bGV9PlxuXHRcdFx0XHQ8R3JhdmF0YXIgZW1haWw9e3RoaXMucHJvcHMub3B0aW9uLmVtYWlsfSBzaXplPXtHUkFWQVRBUl9TSVpFfSBzdHlsZT17Z3JhdmF0YXJTdHlsZX0gLz5cblx0XHRcdFx0e3RoaXMucHJvcHMuY2hpbGRyZW59XG5cdFx0XHQ8L2Rpdj5cblx0XHQpO1xuXHR9XG59KTtcblxuY29uc3QgR3JhdmF0YXJWYWx1ZSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblx0cHJvcFR5cGVzOiB7XG5cdFx0Y2hpbGRyZW46IFJlYWN0LlByb3BUeXBlcy5ub2RlLFxuXHRcdHBsYWNlaG9sZGVyOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuXHRcdHZhbHVlOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0XG5cdH0sXG5cdHJlbmRlciAoKSB7XG5cdFx0dmFyIGdyYXZhdGFyU3R5bGUgPSB7XG5cdFx0XHRib3JkZXJSYWRpdXM6IDMsXG5cdFx0XHRkaXNwbGF5OiAnaW5saW5lLWJsb2NrJyxcblx0XHRcdG1hcmdpblJpZ2h0OiAxMCxcblx0XHRcdHBvc2l0aW9uOiAncmVsYXRpdmUnLFxuXHRcdFx0dG9wOiAtMixcblx0XHRcdHZlcnRpY2FsQWxpZ246ICdtaWRkbGUnLFxuXHRcdH07XG5cdFx0cmV0dXJuIChcblx0XHRcdDxkaXYgY2xhc3NOYW1lPVwiU2VsZWN0LXZhbHVlXCIgdGl0bGU9e3RoaXMucHJvcHMudmFsdWUudGl0bGV9PlxuXHRcdFx0XHQ8c3BhbiBjbGFzc05hbWU9XCJTZWxlY3QtdmFsdWUtbGFiZWxcIj5cblx0XHRcdFx0XHQ8R3JhdmF0YXIgZW1haWw9e3RoaXMucHJvcHMudmFsdWUuZW1haWx9IHNpemU9e0dSQVZBVEFSX1NJWkV9IHN0eWxlPXtncmF2YXRhclN0eWxlfSAvPlxuXHRcdFx0XHRcdHt0aGlzLnByb3BzLmNoaWxkcmVufVxuXHRcdFx0XHQ8L3NwYW4+XG5cdFx0XHQ8L2Rpdj5cblx0XHQpO1xuXHR9XG59KTtcblxuY29uc3QgVXNlcnNGaWVsZCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblx0cHJvcFR5cGVzOiB7XG5cdFx0aGludDogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcblx0XHRsYWJlbDogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcblx0fSxcblx0Z2V0SW5pdGlhbFN0YXRlICgpIHtcblx0XHRyZXR1cm4ge307XG5cdH0sXG5cdHNldFZhbHVlICh2YWx1ZSkge1xuXHRcdHRoaXMuc2V0U3RhdGUoeyB2YWx1ZSB9KTtcblx0fSxcblx0cmVuZGVyICgpIHtcblx0XHR2YXIgcGxhY2Vob2xkZXIgPSA8c3Bhbj4mIzk3ODY7IFNlbGVjdCBVc2VyPC9zcGFuPjtcblxuXHRcdHJldHVybiAoXG5cdFx0XHQ8ZGl2IGNsYXNzTmFtZT1cInNlY3Rpb25cIj5cblx0XHRcdFx0PGgzIGNsYXNzTmFtZT1cInNlY3Rpb24taGVhZGluZ1wiPnt0aGlzLnByb3BzLmxhYmVsfTwvaDM+XG5cdFx0XHRcdDxTZWxlY3Rcblx0XHRcdFx0XHRvbkNoYW5nZT17dGhpcy5zZXRWYWx1ZX1cblx0XHRcdFx0XHRvcHRpb25Db21wb25lbnQ9e0dyYXZhdGFyT3B0aW9ufVxuXHRcdFx0XHRcdG9wdGlvbnM9e1VTRVJTfVxuXHRcdFx0XHRcdHBsYWNlaG9sZGVyPXtwbGFjZWhvbGRlcn1cblx0XHRcdFx0XHR2YWx1ZT17dGhpcy5zdGF0ZS52YWx1ZX1cblx0XHRcdFx0XHR2YWx1ZUNvbXBvbmVudD17R3JhdmF0YXJWYWx1ZX1cblx0XHRcdFx0XHQvPlxuXHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT1cImhpbnRcIj5cblx0XHRcdFx0XHRUaGlzIGV4YW1wbGUgaW1wbGVtZW50cyBjdXN0b20gT3B0aW9uIGFuZCBWYWx1ZSBjb21wb25lbnRzIHRvIHJlbmRlciBhIEdyYXZhdGFyIGltYWdlIGZvciBlYWNoIHVzZXIgYmFzZWQgb24gdGhlaXIgZW1haWwuXG5cdFx0XHRcdFx0SXQgYWxzbyBkZW1vbnN0cmF0ZXMgcmVuZGVyaW5nIEhUTUwgZWxlbWVudHMgYXMgdGhlIHBsYWNlaG9sZGVyLlxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdDwvZGl2PlxuXHRcdCk7XG5cdH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFVzZXJzRmllbGQ7XG4iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFNlbGVjdCBmcm9tICdyZWFjdC1zZWxlY3QtcGx1cyc7XG5cbnZhciBEaXNhYmxlZFVwc2VsbE9wdGlvbnMgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cdGRpc3BsYXlOYW1lOiAnRGlzYWJsZWRVcHNlbGxPcHRpb25zJyxcblx0cHJvcFR5cGVzOiB7XG5cdFx0bGFiZWw6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG5cdH0sXG5cdGdldEluaXRpYWxTdGF0ZSAoKSB7XG5cdFx0cmV0dXJuIHt9O1xuXHR9LFxuXHRzZXRWYWx1ZSAodmFsdWUpIHtcblx0XHR0aGlzLnNldFN0YXRlKHsgdmFsdWUgfSk7XG5cdFx0Y29uc29sZS5sb2coJ1N1cHBvcnQgbGV2ZWwgc2VsZWN0ZWQ6JywgdmFsdWUubGFiZWwpO1xuXHR9LFxuXHRyZW5kZXJMaW5rOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gPGEgc3R5bGU9e3sgbWFyZ2luTGVmdDogNSB9fSBocmVmPVwiL3VwZ3JhZGVcIiB0YXJnZXQ9XCJfYmxhbmtcIj5VcGdyYWRlIGhlcmUhPC9hPjtcblx0fSxcblx0cmVuZGVyT3B0aW9uOiBmdW5jdGlvbihvcHRpb24pIHtcblx0XHRyZXR1cm4gPHNwYW4gc3R5bGU9e3sgY29sb3I6IG9wdGlvbi5jb2xvciB9fT57b3B0aW9uLmxhYmVsfSB7b3B0aW9uLmxpbmt9PC9zcGFuPjtcblx0fSxcblx0cmVuZGVyVmFsdWU6IGZ1bmN0aW9uKG9wdGlvbikge1xuXHRcdHJldHVybiA8c3Ryb25nIHN0eWxlPXt7IGNvbG9yOiBvcHRpb24uY29sb3IgfX0+e29wdGlvbi5sYWJlbH08L3N0cm9uZz47XG5cdH0sXG5cdHJlbmRlcjogZnVuY3Rpb24oKSB7XG5cdFx0dmFyIG9wdGlvbnMgPSBbXG5cdFx0XHR7IGxhYmVsOiAnQmFzaWMgY3VzdG9tZXIgc3VwcG9ydCcsIHZhbHVlOiAnYmFzaWMnLCBjb2xvcjogJyNFMzE4NjQnIH0sXG5cdFx0XHR7IGxhYmVsOiAnUHJlbWl1bSBjdXN0b21lciBzdXBwb3J0JywgdmFsdWU6ICdwcmVtaXVtJywgY29sb3I6ICcjNjIxNkEzJyB9LFxuXHRcdFx0eyBsYWJlbDogJ1BybyBjdXN0b21lciBzdXBwb3J0JywgdmFsdWU6ICdwcm8nLCBkaXNhYmxlZDogdHJ1ZSwgbGluazogdGhpcy5yZW5kZXJMaW5rKCkgfSxcblx0XHRdO1xuXHRcdHJldHVybiAoXG5cdFx0XHQ8ZGl2IGNsYXNzTmFtZT1cInNlY3Rpb25cIj5cblx0XHRcdFx0PGgzIGNsYXNzTmFtZT1cInNlY3Rpb24taGVhZGluZ1wiPnt0aGlzLnByb3BzLmxhYmVsfTwvaDM+XG5cdFx0XHRcdDxTZWxlY3Rcblx0XHRcdFx0XHRwbGFjZWhvbGRlcj1cIlNlbGVjdCB5b3VyIHN1cHBvcnQgbGV2ZWxcIlxuXHRcdFx0XHRcdG9wdGlvbnM9e29wdGlvbnN9XG5cdFx0XHRcdFx0b3B0aW9uUmVuZGVyZXI9e3RoaXMucmVuZGVyT3B0aW9ufVxuXHRcdFx0XHRcdG9uQ2hhbmdlPXt0aGlzLnNldFZhbHVlfVxuXHRcdFx0XHRcdHZhbHVlPXt0aGlzLnN0YXRlLnZhbHVlfVxuXHRcdFx0XHRcdHZhbHVlUmVuZGVyZXI9e3RoaXMucmVuZGVyVmFsdWV9XG5cdFx0XHRcdFx0Lz5cblx0XHRcdFx0PGRpdiBjbGFzc05hbWU9XCJoaW50XCI+VGhpcyBkZW1vbnN0YXRlcyBjdXN0b20gcmVuZGVyIG1ldGhvZHMgYW5kIGxpbmtzIGluIGRpc2FibGVkIG9wdGlvbnM8L2Rpdj5cblx0XHRcdDwvZGl2PlxuXHRcdCk7XG5cdH1cbn0pO1xubW9kdWxlLmV4cG9ydHMgPSBEaXNhYmxlZFVwc2VsbE9wdGlvbnM7XG4iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFNlbGVjdCBmcm9tICdyZWFjdC1zZWxlY3QtcGx1cyc7XG5cbnZhciBvcHMgPSBbe1xuXHRsYWJlbDogJ0JsYWNrJyxcblx0dmFsdWU6ICdibGFjaycsXG59LCB7XG5cdGxhYmVsOiAnUHJpbWFyeSBDb2xvcnMnLFxuXHRvcHRpb25zOiBbe1xuXHRcdGxhYmVsOiAnWWVsbG93Jyxcblx0XHR2YWx1ZTogJ3llbGxvdydcblx0fSwge1xuXHRcdGxhYmVsOiAnUmVkJyxcblx0XHR2YWx1ZTogJ3JlZCdcblx0fSwge1xuXHRcdGxhYmVsOiAnQmx1ZScsXG5cdFx0dmFsdWU6ICdibHVlJ1xuXHR9XVxufSwge1xuXHRsYWJlbDogJ1NlY29uZGFyeSBDb2xvcnMnLFxuXHRvcHRpb25zOiBbe1xuXHRcdGxhYmVsOiAnT3JhbmdlJyxcblx0XHR2YWx1ZTogJ29yYW5nZSdcblx0fSwge1xuXHRcdGxhYmVsOiAnUHVycGxlJyxcblx0XHRvcHRpb25zOiBbe1xuXHRcdFx0bGFiZWw6ICdMaWdodCBQdXJwbGUnLFxuXHRcdFx0dmFsdWU6ICdsaWdodF9wdXJwbGUnXG5cdFx0fSwge1xuXHRcdFx0bGFiZWw6ICdNZWRpdW0gUHVycGxlJyxcblx0XHRcdHZhbHVlOiAnbWVkaXVtX3B1cnBsZSdcblx0XHR9LCB7XG5cdFx0XHRsYWJlbDogJ0RhcmsgUHVycGxlJyxcblx0XHRcdHZhbHVlOiAnZGFya19wdXJwbGUnXG5cdFx0fV1cblx0fSwge1xuXHRcdGxhYmVsOiAnR3JlZW4nLFxuXHRcdHZhbHVlOiAnZ3JlZW4nXG5cdH1dXG59LCB7XG5cdGxhYmVsOiAnV2hpdGUnLFxuXHR2YWx1ZTogJ3doaXRlJyxcbn1dO1xuXG52YXIgR3JvdXBlZE9wdGlvbnNGaWVsZCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblx0ZGlzcGxheU5hbWU6ICdHcm91cGVkT3B0aW9uc0ZpZWxkJyxcblx0cHJvcFR5cGVzOiB7XG5cdFx0ZGVsaW1pdGVyOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuXHRcdGxhYmVsOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuXHRcdG11bHRpOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbCxcblx0fSxcblxuXHRnZXRJbml0aWFsU3RhdGUgKCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHR2YWx1ZTogbnVsbCxcblx0XHR9O1xuXHR9LFxuXG5cdG9uQ2hhbmdlKHZhbHVlKSB7XG5cdFx0dGhpcy5zZXRTdGF0ZSh7IHZhbHVlIH0pO1xuXHRcdGNvbnNvbGUubG9nKCdPcHRpb24gR3JvdXBzIFNlbGVjdCB2YWx1ZSBjaGFuZ2VkIHRvJywgdmFsdWUpO1xuXHR9LFxuXG5cdHJlbmRlciAoKSB7XG5cdFx0cmV0dXJuIChcblx0XHRcdDxkaXYgY2xhc3NOYW1lPVwic2VjdGlvblwiPlxuXHRcdFx0XHQ8aDMgY2xhc3NOYW1lPVwic2VjdGlvbi1oZWFkaW5nXCI+e3RoaXMucHJvcHMubGFiZWx9PC9oMz5cblx0XHRcdFx0PFNlbGVjdFxuXHRcdFx0XHRcdG9uQ2hhbmdlPXt0aGlzLm9uQ2hhbmdlfVxuXHRcdFx0XHRcdG9wdGlvbnM9e29wc31cblx0XHRcdFx0XHRwbGFjZWhvbGRlcj1cIlNlbGVjdCBhIGNvbG9yXCJcblx0XHRcdFx0XHR2YWx1ZT17dGhpcy5zdGF0ZS52YWx1ZX0gLz5cblx0XHRcdDwvZGl2PlxuXHRcdCk7XG5cdH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEdyb3VwZWRPcHRpb25zRmllbGQ7XG4iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFNlbGVjdCBmcm9tICdyZWFjdC1zZWxlY3QtcGx1cyc7XG5cbmNvbnN0IEZMQVZPVVJTID0gW1xuXHR7IGxhYmVsOiAnQ2hvY29sYXRlJywgdmFsdWU6ICdjaG9jb2xhdGUnIH0sXG5cdHsgbGFiZWw6ICdWYW5pbGxhJywgdmFsdWU6ICd2YW5pbGxhJyB9LFxuXHR7IGxhYmVsOiAnU3RyYXdiZXJyeScsIHZhbHVlOiAnc3RyYXdiZXJyeScgfSxcblx0eyBsYWJlbDogJ0NhcmFtZWwnLCB2YWx1ZTogJ2NhcmFtZWwnIH0sXG5cdHsgbGFiZWw6ICdDb29raWVzIGFuZCBDcmVhbScsIHZhbHVlOiAnY29va2llc2NyZWFtJyB9LFxuXHR7IGxhYmVsOiAnUGVwcGVybWludCcsIHZhbHVlOiAncGVwcGVybWludCcgfSxcbl07XG5cbmNvbnN0IFdIWV9XT1VMRF9ZT1UgPSBbXG5cdHsgbGFiZWw6ICdDaG9jb2xhdGUgKGFyZSB5b3UgY3Jhenk/KScsIHZhbHVlOiAnY2hvY29sYXRlJywgZGlzYWJsZWQ6IHRydWUgfSxcbl0uY29uY2F0KEZMQVZPVVJTLnNsaWNlKDEpKTtcblxudmFyIE11bHRpU2VsZWN0RmllbGQgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cdGRpc3BsYXlOYW1lOiAnTXVsdGlTZWxlY3RGaWVsZCcsXG5cdHByb3BUeXBlczoge1xuXHRcdGxhYmVsOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuXHR9LFxuXHRnZXRJbml0aWFsU3RhdGUgKCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRkaXNhYmxlZDogZmFsc2UsXG5cdFx0XHRjcmF6eTogZmFsc2UsXG5cdFx0XHRvcHRpb25zOiBGTEFWT1VSUyxcblx0XHRcdHZhbHVlOiBbXSxcblx0XHR9O1xuXHR9LFxuXHRoYW5kbGVTZWxlY3RDaGFuZ2UgKHZhbHVlKSB7XG5cdFx0Y29uc29sZS5sb2coJ1lvdVxcJ3ZlIHNlbGVjdGVkOicsIHZhbHVlKTtcblx0XHR0aGlzLnNldFN0YXRlKHsgdmFsdWUgfSk7XG5cdH0sXG5cdHRvZ2dsZURpc2FibGVkIChlKSB7XG5cdFx0dGhpcy5zZXRTdGF0ZSh7IGRpc2FibGVkOiBlLnRhcmdldC5jaGVja2VkIH0pO1xuXHR9LFxuXHR0b2dnbGVDaG9jb2xhdGUgKGUpIHtcblx0XHRsZXQgY3JhenkgPSBlLnRhcmdldC5jaGVja2VkO1xuXHRcdHRoaXMuc2V0U3RhdGUoe1xuXHRcdFx0Y3Jhenk6IGNyYXp5LFxuXHRcdFx0b3B0aW9uczogY3JhenkgPyBXSFlfV09VTERfWU9VIDogRkxBVk9VUlMsXG5cdFx0fSk7XG5cdH0sXG5cdHJlbmRlciAoKSB7XG5cdFx0cmV0dXJuIChcblx0XHRcdDxkaXYgY2xhc3NOYW1lPVwic2VjdGlvblwiPlxuXHRcdFx0XHQ8aDMgY2xhc3NOYW1lPVwic2VjdGlvbi1oZWFkaW5nXCI+e3RoaXMucHJvcHMubGFiZWx9PC9oMz5cblx0XHRcdFx0PFNlbGVjdCBtdWx0aSBzaW1wbGVWYWx1ZSBkaXNhYmxlZD17dGhpcy5zdGF0ZS5kaXNhYmxlZH0gdmFsdWU9e3RoaXMuc3RhdGUudmFsdWV9IHBsYWNlaG9sZGVyPVwiU2VsZWN0IHlvdXIgZmF2b3VyaXRlKHMpXCIgb3B0aW9ucz17dGhpcy5zdGF0ZS5vcHRpb25zfSBvbkNoYW5nZT17dGhpcy5oYW5kbGVTZWxlY3RDaGFuZ2V9IC8+XG5cblx0XHRcdFx0PGRpdiBjbGFzc05hbWU9XCJjaGVja2JveC1saXN0XCI+XG5cdFx0XHRcdFx0PGxhYmVsIGNsYXNzTmFtZT1cImNoZWNrYm94XCI+XG5cdFx0XHRcdFx0XHQ8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgY2xhc3NOYW1lPVwiY2hlY2tib3gtY29udHJvbFwiIGNoZWNrZWQ9e3RoaXMuc3RhdGUuZGlzYWJsZWR9IG9uQ2hhbmdlPXt0aGlzLnRvZ2dsZURpc2FibGVkfSAvPlxuXHRcdFx0XHRcdFx0PHNwYW4gY2xhc3NOYW1lPVwiY2hlY2tib3gtbGFiZWxcIj5EaXNhYmxlIHRoZSBjb250cm9sPC9zcGFuPlxuXHRcdFx0XHRcdDwvbGFiZWw+XG5cdFx0XHRcdFx0PGxhYmVsIGNsYXNzTmFtZT1cImNoZWNrYm94XCI+XG5cdFx0XHRcdFx0XHQ8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgY2xhc3NOYW1lPVwiY2hlY2tib3gtY29udHJvbFwiIGNoZWNrZWQ9e3RoaXMuc3RhdGUuY3Jhenl9IG9uQ2hhbmdlPXt0aGlzLnRvZ2dsZUNob2NvbGF0ZX0gLz5cblx0XHRcdFx0XHRcdDxzcGFuIGNsYXNzTmFtZT1cImNoZWNrYm94LWxhYmVsXCI+SSBkb24ndCBsaWtlIENob2NvbGF0ZSAoZGlzYWJsZWQgdGhlIG9wdGlvbik8L3NwYW4+XG5cdFx0XHRcdFx0PC9sYWJlbD5cblx0XHRcdFx0PC9kaXY+XG5cdFx0XHQ8L2Rpdj5cblx0XHQpO1xuXHR9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBNdWx0aVNlbGVjdEZpZWxkO1xuIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBTZWxlY3QgZnJvbSAncmVhY3Qtc2VsZWN0LXBsdXMnO1xuXG52YXIgVmFsdWVzQXNOdW1iZXJzRmllbGQgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cdGRpc3BsYXlOYW1lOiAnVmFsdWVzQXNOdW1iZXJzRmllbGQnLFxuXHRwcm9wVHlwZXM6IHtcblx0XHRsYWJlbDogUmVhY3QuUHJvcFR5cGVzLnN0cmluZ1xuXHR9LFxuXHRnZXRJbml0aWFsU3RhdGUgKCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRvcHRpb25zOiBbXG5cdFx0XHRcdHsgdmFsdWU6IDEwLCBsYWJlbDogJ1RlbicgfSxcblx0XHRcdFx0eyB2YWx1ZTogMTEsIGxhYmVsOiAnRWxldmVuJyB9LFxuXHRcdFx0XHR7IHZhbHVlOiAxMiwgbGFiZWw6ICdUd2VsdmUnIH0sXG5cdFx0XHRcdHsgdmFsdWU6IDIzLCBsYWJlbDogJ1R3ZW50eS10aHJlZScgfSxcblx0XHRcdFx0eyB2YWx1ZTogMjQsIGxhYmVsOiAnVHdlbnR5LWZvdXInIH1cblx0XHRcdF0sXG5cdFx0XHRtYXRjaFBvczogJ2FueScsXG5cdFx0XHRtYXRjaFZhbHVlOiB0cnVlLFxuXHRcdFx0bWF0Y2hMYWJlbDogdHJ1ZSxcblx0XHRcdHZhbHVlOiBudWxsLFxuXHRcdFx0bXVsdGk6IGZhbHNlXG5cdFx0fTtcblx0fSxcblx0b25DaGFuZ2VNYXRjaFN0YXJ0KGV2ZW50KSB7XG5cdFx0dGhpcy5zZXRTdGF0ZSh7XG5cdFx0XHRtYXRjaFBvczogZXZlbnQudGFyZ2V0LmNoZWNrZWQgPyAnc3RhcnQnIDogJ2FueSdcblx0XHR9KTtcblx0fSxcblx0b25DaGFuZ2VNYXRjaFZhbHVlKGV2ZW50KSB7XG5cdFx0dGhpcy5zZXRTdGF0ZSh7XG5cdFx0XHRtYXRjaFZhbHVlOiBldmVudC50YXJnZXQuY2hlY2tlZFxuXHRcdH0pO1xuXHR9LFxuXHRvbkNoYW5nZU1hdGNoTGFiZWwoZXZlbnQpIHtcblx0XHR0aGlzLnNldFN0YXRlKHtcblx0XHRcdG1hdGNoTGFiZWw6IGV2ZW50LnRhcmdldC5jaGVja2VkXG5cdFx0fSk7XG5cdH0sXG5cdG9uQ2hhbmdlKHZhbHVlKSB7XG5cdFx0dGhpcy5zZXRTdGF0ZSh7IHZhbHVlIH0pO1xuXHRcdGNvbnNvbGUubG9nKCdOdW1lcmljIFNlbGVjdCB2YWx1ZSBjaGFuZ2VkIHRvJywgdmFsdWUpO1xuXHR9LFxuXHRvbkNoYW5nZU11bHRpKGV2ZW50KSB7XG5cdFx0dGhpcy5zZXRTdGF0ZSh7XG5cdFx0XHRtdWx0aTogZXZlbnQudGFyZ2V0LmNoZWNrZWRcblx0XHR9KTtcblx0fSxcblx0cmVuZGVyICgpIHtcblx0XHR2YXIgbWF0Y2hQcm9wID0gJ2FueSc7XG5cdFx0aWYgKHRoaXMuc3RhdGUubWF0Y2hMYWJlbCAmJiAhdGhpcy5zdGF0ZS5tYXRjaFZhbHVlKSB7XG5cdFx0XHRtYXRjaFByb3AgPSAnbGFiZWwnO1xuXHRcdH1cblx0XHRpZiAoIXRoaXMuc3RhdGUubWF0Y2hMYWJlbCAmJiB0aGlzLnN0YXRlLm1hdGNoVmFsdWUpIHtcblx0XHRcdG1hdGNoUHJvcCA9ICd2YWx1ZSc7XG5cdFx0fVxuXHRcdHJldHVybiAoXG5cdFx0XHQ8ZGl2IGNsYXNzTmFtZT1cInNlY3Rpb25cIj5cblx0XHRcdFx0PGgzIGNsYXNzTmFtZT1cInNlY3Rpb24taGVhZGluZ1wiPnt0aGlzLnByb3BzLmxhYmVsfTwvaDM+XG5cdFx0XHRcdDxTZWxlY3Rcblx0XHRcdFx0XHRtYXRjaFBvcz17dGhpcy5zdGF0ZS5tYXRjaFBvc31cblx0XHRcdFx0XHRtYXRjaFByb3A9e21hdGNoUHJvcH1cblx0XHRcdFx0XHRtdWx0aT17dGhpcy5zdGF0ZS5tdWx0aX1cblx0XHRcdFx0XHRvbkNoYW5nZT17dGhpcy5vbkNoYW5nZX1cblx0XHRcdFx0XHRvcHRpb25zPXt0aGlzLnN0YXRlLm9wdGlvbnN9XG5cdFx0XHRcdFx0c2ltcGxlVmFsdWVcblx0XHRcdFx0XHR2YWx1ZT17dGhpcy5zdGF0ZS52YWx1ZX1cblx0XHRcdFx0XHQvPlxuXHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT1cImNoZWNrYm94LWxpc3RcIj5cblx0XHRcdFx0XHQ8bGFiZWwgY2xhc3NOYW1lPVwiY2hlY2tib3hcIj5cblx0XHRcdFx0XHRcdDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBjbGFzc05hbWU9XCJjaGVja2JveC1jb250cm9sXCIgY2hlY2tlZD17dGhpcy5zdGF0ZS5tdWx0aX0gb25DaGFuZ2U9e3RoaXMub25DaGFuZ2VNdWx0aX0gLz5cblx0XHRcdFx0XHRcdDxzcGFuIGNsYXNzTmFtZT1cImNoZWNrYm94LWxhYmVsXCI+TXVsdGktU2VsZWN0PC9zcGFuPlxuXHRcdFx0XHRcdDwvbGFiZWw+XG5cdFx0XHRcdFx0PGxhYmVsIGNsYXNzTmFtZT1cImNoZWNrYm94XCI+XG5cdFx0XHRcdFx0XHQ8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgY2xhc3NOYW1lPVwiY2hlY2tib3gtY29udHJvbFwiIGNoZWNrZWQ9e3RoaXMuc3RhdGUubWF0Y2hWYWx1ZX0gb25DaGFuZ2U9e3RoaXMub25DaGFuZ2VNYXRjaFZhbHVlfSAvPlxuXHRcdFx0XHRcdFx0PHNwYW4gY2xhc3NOYW1lPVwiY2hlY2tib3gtbGFiZWxcIj5NYXRjaCB2YWx1ZSBvbmx5PC9zcGFuPlxuXHRcdFx0XHRcdDwvbGFiZWw+XG5cdFx0XHRcdFx0PGxhYmVsIGNsYXNzTmFtZT1cImNoZWNrYm94XCI+XG5cdFx0XHRcdFx0XHQ8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgY2xhc3NOYW1lPVwiY2hlY2tib3gtY29udHJvbFwiIGNoZWNrZWQ9e3RoaXMuc3RhdGUubWF0Y2hMYWJlbH0gb25DaGFuZ2U9e3RoaXMub25DaGFuZ2VNYXRjaExhYmVsfSAvPlxuXHRcdFx0XHRcdFx0PHNwYW4gY2xhc3NOYW1lPVwiY2hlY2tib3gtbGFiZWxcIj5NYXRjaCBsYWJlbCBvbmx5PC9zcGFuPlxuXHRcdFx0XHRcdDwvbGFiZWw+XG5cdFx0XHRcdFx0PGxhYmVsIGNsYXNzTmFtZT1cImNoZWNrYm94XCI+XG5cdFx0XHRcdFx0XHQ8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgY2xhc3NOYW1lPVwiY2hlY2tib3gtY29udHJvbFwiIGNoZWNrZWQ9e3RoaXMuc3RhdGUubWF0Y2hQb3MgPT09ICdzdGFydCd9IG9uQ2hhbmdlPXt0aGlzLm9uQ2hhbmdlTWF0Y2hTdGFydH0gLz5cblx0XHRcdFx0XHRcdDxzcGFuIGNsYXNzTmFtZT1cImNoZWNrYm94LWxhYmVsXCI+T25seSBpbmNsdWRlIG1hdGNoZXMgZnJvbSB0aGUgc3RhcnQgb2YgdGhlIHN0cmluZzwvc3Bhbj5cblx0XHRcdFx0XHQ8L2xhYmVsPlxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0PGRpdiBjbGFzc05hbWU9XCJoaW50XCI+VGhpcyBleGFtcGxlIHVzZXMgc2ltcGxlIG51bWVyaWMgdmFsdWVzPC9kaXY+XG5cdFx0XHQ8L2Rpdj5cblx0XHQpO1xuXHR9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBWYWx1ZXNBc051bWJlcnNGaWVsZDtcbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgU2VsZWN0IGZyb20gJ3JlYWN0LXNlbGVjdC1wbHVzJztcblxuY29uc3QgU1RBVEVTID0gcmVxdWlyZSgnLi4vZGF0YS9zdGF0ZXMnKTtcblxudmFyIFN0YXRlc0ZpZWxkID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXHRkaXNwbGF5TmFtZTogJ1N0YXRlc0ZpZWxkJyxcblx0cHJvcFR5cGVzOiB7XG5cdFx0bGFiZWw6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG5cdFx0c2VhcmNoYWJsZTogUmVhY3QuUHJvcFR5cGVzLmJvb2wsXG5cdH0sXG5cdGdldERlZmF1bHRQcm9wcyAoKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdGxhYmVsOiAnU3RhdGVzOicsXG5cdFx0XHRzZWFyY2hhYmxlOiB0cnVlLFxuXHRcdH07XG5cdH0sXG5cdGdldEluaXRpYWxTdGF0ZSAoKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdGNvdW50cnk6ICdBVScsXG5cdFx0XHRkaXNhYmxlZDogZmFsc2UsXG5cdFx0XHRzZWFyY2hhYmxlOiB0aGlzLnByb3BzLnNlYXJjaGFibGUsXG5cdFx0XHRzZWxlY3RWYWx1ZTogJ25ldy1zb3V0aC13YWxlcycsXG5cdFx0XHRjbGVhcmFibGU6IHRydWUsXG5cdFx0fTtcblx0fSxcblx0c3dpdGNoQ291bnRyeSAoZSkge1xuXHRcdHZhciBuZXdDb3VudHJ5ID0gZS50YXJnZXQudmFsdWU7XG5cdFx0Y29uc29sZS5sb2coJ0NvdW50cnkgY2hhbmdlZCB0byAnICsgbmV3Q291bnRyeSk7XG5cdFx0dGhpcy5zZXRTdGF0ZSh7XG5cdFx0XHRjb3VudHJ5OiBuZXdDb3VudHJ5LFxuXHRcdFx0c2VsZWN0VmFsdWU6IG51bGxcblx0XHR9KTtcblx0fSxcblx0dXBkYXRlVmFsdWUgKG5ld1ZhbHVlKSB7XG5cdFx0Y29uc29sZS5sb2coJ1N0YXRlIGNoYW5nZWQgdG8gJyArIG5ld1ZhbHVlKTtcblx0XHR0aGlzLnNldFN0YXRlKHtcblx0XHRcdHNlbGVjdFZhbHVlOiBuZXdWYWx1ZVxuXHRcdH0pO1xuXHR9LFxuXHRmb2N1c1N0YXRlU2VsZWN0ICgpIHtcblx0XHR0aGlzLnJlZnMuc3RhdGVTZWxlY3QuZm9jdXMoKTtcblx0fSxcblx0dG9nZ2xlQ2hlY2tib3ggKGUpIHtcblx0XHRsZXQgbmV3U3RhdGUgPSB7fTtcblx0XHRuZXdTdGF0ZVtlLnRhcmdldC5uYW1lXSA9IGUudGFyZ2V0LmNoZWNrZWQ7XG5cdFx0dGhpcy5zZXRTdGF0ZShuZXdTdGF0ZSk7XG5cdH0sXG5cdHJlbmRlciAoKSB7XG5cdFx0dmFyIG9wdGlvbnMgPSBTVEFURVNbdGhpcy5zdGF0ZS5jb3VudHJ5XTtcblx0XHRyZXR1cm4gKFxuXHRcdFx0PGRpdiBjbGFzc05hbWU9XCJzZWN0aW9uXCI+XG5cdFx0XHRcdDxoMyBjbGFzc05hbWU9XCJzZWN0aW9uLWhlYWRpbmdcIj57dGhpcy5wcm9wcy5sYWJlbH08L2gzPlxuXHRcdFx0XHQ8U2VsZWN0IHJlZj1cInN0YXRlU2VsZWN0XCIgYXV0b2ZvY3VzIG9wdGlvbnM9e29wdGlvbnN9IHNpbXBsZVZhbHVlIGNsZWFyYWJsZT17dGhpcy5zdGF0ZS5jbGVhcmFibGV9IG5hbWU9XCJzZWxlY3RlZC1zdGF0ZVwiIGRpc2FibGVkPXt0aGlzLnN0YXRlLmRpc2FibGVkfSB2YWx1ZT17dGhpcy5zdGF0ZS5zZWxlY3RWYWx1ZX0gb25DaGFuZ2U9e3RoaXMudXBkYXRlVmFsdWV9IHNlYXJjaGFibGU9e3RoaXMuc3RhdGUuc2VhcmNoYWJsZX0gLz5cblxuXHRcdFx0XHQ8ZGl2IHN0eWxlPXt7IG1hcmdpblRvcDogMTQgfX0+XG5cdFx0XHRcdFx0PGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgb25DbGljaz17dGhpcy5mb2N1c1N0YXRlU2VsZWN0fT5Gb2N1cyBTZWxlY3Q8L2J1dHRvbj5cblx0XHRcdFx0XHQ8bGFiZWwgY2xhc3NOYW1lPVwiY2hlY2tib3hcIiBzdHlsZT17eyBtYXJnaW5MZWZ0OiAxMCB9fT5cblx0XHRcdFx0XHRcdDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBjbGFzc05hbWU9XCJjaGVja2JveC1jb250cm9sXCIgbmFtZT1cInNlYXJjaGFibGVcIiBjaGVja2VkPXt0aGlzLnN0YXRlLnNlYXJjaGFibGV9IG9uQ2hhbmdlPXt0aGlzLnRvZ2dsZUNoZWNrYm94fS8+XG5cdFx0XHRcdFx0XHQ8c3BhbiBjbGFzc05hbWU9XCJjaGVja2JveC1sYWJlbFwiPlNlYXJjaGFibGU8L3NwYW4+XG5cdFx0XHRcdFx0PC9sYWJlbD5cblx0XHRcdFx0XHQ8bGFiZWwgY2xhc3NOYW1lPVwiY2hlY2tib3hcIiBzdHlsZT17eyBtYXJnaW5MZWZ0OiAxMCB9fT5cblx0XHRcdFx0XHRcdDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBjbGFzc05hbWU9XCJjaGVja2JveC1jb250cm9sXCIgbmFtZT1cImRpc2FibGVkXCIgY2hlY2tlZD17dGhpcy5zdGF0ZS5kaXNhYmxlZH0gb25DaGFuZ2U9e3RoaXMudG9nZ2xlQ2hlY2tib3h9Lz5cblx0XHRcdFx0XHRcdDxzcGFuIGNsYXNzTmFtZT1cImNoZWNrYm94LWxhYmVsXCI+RGlzYWJsZWQ8L3NwYW4+XG5cdFx0XHRcdFx0PC9sYWJlbD5cblx0XHRcdFx0XHQ8bGFiZWwgY2xhc3NOYW1lPVwiY2hlY2tib3hcIiBzdHlsZT17eyBtYXJnaW5MZWZ0OiAxMCB9fT5cblx0XHRcdFx0XHRcdDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBjbGFzc05hbWU9XCJjaGVja2JveC1jb250cm9sXCIgbmFtZT1cImNsZWFyYWJsZVwiIGNoZWNrZWQ9e3RoaXMuc3RhdGUuY2xlYXJhYmxlfSBvbkNoYW5nZT17dGhpcy50b2dnbGVDaGVja2JveH0vPlxuXHRcdFx0XHRcdFx0PHNwYW4gY2xhc3NOYW1lPVwiY2hlY2tib3gtbGFiZWxcIj5DbGVhcmFibGU8L3NwYW4+XG5cdFx0XHRcdFx0PC9sYWJlbD5cblx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdDxkaXYgY2xhc3NOYW1lPVwiY2hlY2tib3gtbGlzdFwiPlxuXHRcdFx0XHRcdDxsYWJlbCBjbGFzc05hbWU9XCJjaGVja2JveFwiPlxuXHRcdFx0XHRcdFx0PGlucHV0IHR5cGU9XCJyYWRpb1wiIGNsYXNzTmFtZT1cImNoZWNrYm94LWNvbnRyb2xcIiBjaGVja2VkPXt0aGlzLnN0YXRlLmNvdW50cnkgPT09ICdBVSd9IHZhbHVlPVwiQVVcIiBvbkNoYW5nZT17dGhpcy5zd2l0Y2hDb3VudHJ5fS8+XG5cdFx0XHRcdFx0XHQ8c3BhbiBjbGFzc05hbWU9XCJjaGVja2JveC1sYWJlbFwiPkF1c3RyYWxpYTwvc3Bhbj5cblx0XHRcdFx0XHQ8L2xhYmVsPlxuXHRcdFx0XHRcdDxsYWJlbCBjbGFzc05hbWU9XCJjaGVja2JveFwiPlxuXHRcdFx0XHRcdFx0PGlucHV0IHR5cGU9XCJyYWRpb1wiIGNsYXNzTmFtZT1cImNoZWNrYm94LWNvbnRyb2xcIiBjaGVja2VkPXt0aGlzLnN0YXRlLmNvdW50cnkgPT09ICdVUyd9IHZhbHVlPVwiVVNcIiBvbkNoYW5nZT17dGhpcy5zd2l0Y2hDb3VudHJ5fS8+XG5cdFx0XHRcdFx0XHQ8c3BhbiBjbGFzc05hbWU9XCJjaGVja2JveC1sYWJlbFwiPlVuaXRlZCBTdGF0ZXM8L3NwYW4+XG5cdFx0XHRcdFx0PC9sYWJlbD5cblx0XHRcdFx0PC9kaXY+XG5cdFx0XHQ8L2Rpdj5cblx0XHQpO1xuXHR9XG59KTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IFN0YXRlc0ZpZWxkO1xuIiwibW9kdWxlLmV4cG9ydHMgPSBbXG5cdHsgZ2l0aHViOiAnamVkd2F0c29uJywgbmFtZTogJ0plZCBXYXRzb24nIH0sXG5cdHsgZ2l0aHViOiAnYnJ1ZGVyc3RlaW4nLCBuYW1lOiAnRGF2ZSBCcm90aGVyc3RvbmUnIH0sXG5cdHsgZ2l0aHViOiAnam9zc21hYycsIG5hbWU6ICdKb3NzIE1hY2tpc29uJyB9LFxuXHR7IGdpdGh1YjogJ2puaWVjaGNpYWwnLCBuYW1lOiAnSmFrdWIgTmllY2hjaWHFgicgfSxcblx0eyBnaXRodWI6ICdjcmFpZ2RhbGxpbW9yZScsIG5hbWU6ICdDcmFpZyBEYWxsaW1vcmUnIH0sXG5cdHsgZ2l0aHViOiAnanVsZW4nLCBuYW1lOiAnSnVsZW4gUnVpeiBBaXpwdXJ1JyB9LFxuXHR7IGdpdGh1YjogJ2Rjb3VzZW5zJywgbmFtZTogJ0RhbmllbCBDb3VzZW5zJyB9LFxuXHR7IGdpdGh1YjogJ2pnYXV0c2NoJywgbmFtZTogJ0pvbiBHYXV0c2NoJyB9LFxuICB7IGdpdGh1YjogJ2RtaXRyeS1zbWlybm92JywgbmFtZTogJ0RtaXRyeSBTbWlybm92JyB9LFxuXHR7IGdpdGh1YjogJ3RyZXZvcmJ1cm5oYW0nLCBuYW1lOiAnVHJldm9yIEJ1cm5oYW0nIH0sXG5dO1xuIiwiZXhwb3J0cy5BVSA9IFtcblx0eyB2YWx1ZTogJ2F1c3RyYWxpYW4tY2FwaXRhbC10ZXJyaXRvcnknLCBsYWJlbDogJ0F1c3RyYWxpYW4gQ2FwaXRhbCBUZXJyaXRvcnknLCBjbGFzc05hbWU6ICdTdGF0ZS1BQ1QnIH0sXG5cdHsgdmFsdWU6ICduZXctc291dGgtd2FsZXMnLCBsYWJlbDogJ05ldyBTb3V0aCBXYWxlcycsIGNsYXNzTmFtZTogJ1N0YXRlLU5TVycgfSxcblx0eyB2YWx1ZTogJ3ZpY3RvcmlhJywgbGFiZWw6ICdWaWN0b3JpYScsIGNsYXNzTmFtZTogJ1N0YXRlLVZpYycgfSxcblx0eyB2YWx1ZTogJ3F1ZWVuc2xhbmQnLCBsYWJlbDogJ1F1ZWVuc2xhbmQnLCBjbGFzc05hbWU6ICdTdGF0ZS1RbGQnIH0sXG5cdHsgdmFsdWU6ICd3ZXN0ZXJuLWF1c3RyYWxpYScsIGxhYmVsOiAnV2VzdGVybiBBdXN0cmFsaWEnLCBjbGFzc05hbWU6ICdTdGF0ZS1XQScgfSxcblx0eyB2YWx1ZTogJ3NvdXRoLWF1c3RyYWxpYScsIGxhYmVsOiAnU291dGggQXVzdHJhbGlhJywgY2xhc3NOYW1lOiAnU3RhdGUtU0EnIH0sXG5cdHsgdmFsdWU6ICd0YXNtYW5pYScsIGxhYmVsOiAnVGFzbWFuaWEnLCBjbGFzc05hbWU6ICdTdGF0ZS1UYXMnIH0sXG5cdHsgdmFsdWU6ICdub3J0aGVybi10ZXJyaXRvcnknLCBsYWJlbDogJ05vcnRoZXJuIFRlcnJpdG9yeScsIGNsYXNzTmFtZTogJ1N0YXRlLU5UJyB9LFxuXTtcblxuZXhwb3J0cy5VUyA9IFtcbiAgICB7IHZhbHVlOiAnQUwnLCBsYWJlbDogJ0FsYWJhbWEnLCBkaXNhYmxlZDogdHJ1ZSB9LFxuICAgIHsgdmFsdWU6ICdBSycsIGxhYmVsOiAnQWxhc2thJyB9LFxuICAgIHsgdmFsdWU6ICdBUycsIGxhYmVsOiAnQW1lcmljYW4gU2Ftb2EnIH0sXG4gICAgeyB2YWx1ZTogJ0FaJywgbGFiZWw6ICdBcml6b25hJyB9LFxuICAgIHsgdmFsdWU6ICdBUicsIGxhYmVsOiAnQXJrYW5zYXMnIH0sXG4gICAgeyB2YWx1ZTogJ0NBJywgbGFiZWw6ICdDYWxpZm9ybmlhJyB9LFxuICAgIHsgdmFsdWU6ICdDTycsIGxhYmVsOiAnQ29sb3JhZG8nIH0sXG4gICAgeyB2YWx1ZTogJ0NUJywgbGFiZWw6ICdDb25uZWN0aWN1dCcgfSxcbiAgICB7IHZhbHVlOiAnREUnLCBsYWJlbDogJ0RlbGF3YXJlJyB9LFxuICAgIHsgdmFsdWU6ICdEQycsIGxhYmVsOiAnRGlzdHJpY3QgT2YgQ29sdW1iaWEnIH0sXG4gICAgeyB2YWx1ZTogJ0ZNJywgbGFiZWw6ICdGZWRlcmF0ZWQgU3RhdGVzIE9mIE1pY3JvbmVzaWEnIH0sXG4gICAgeyB2YWx1ZTogJ0ZMJywgbGFiZWw6ICdGbG9yaWRhJyB9LFxuICAgIHsgdmFsdWU6ICdHQScsIGxhYmVsOiAnR2VvcmdpYScgfSxcbiAgICB7IHZhbHVlOiAnR1UnLCBsYWJlbDogJ0d1YW0nIH0sXG4gICAgeyB2YWx1ZTogJ0hJJywgbGFiZWw6ICdIYXdhaWknIH0sXG4gICAgeyB2YWx1ZTogJ0lEJywgbGFiZWw6ICdJZGFobycgfSxcbiAgICB7IHZhbHVlOiAnSUwnLCBsYWJlbDogJ0lsbGlub2lzJyB9LFxuICAgIHsgdmFsdWU6ICdJTicsIGxhYmVsOiAnSW5kaWFuYScgfSxcbiAgICB7IHZhbHVlOiAnSUEnLCBsYWJlbDogJ0lvd2EnIH0sXG4gICAgeyB2YWx1ZTogJ0tTJywgbGFiZWw6ICdLYW5zYXMnIH0sXG4gICAgeyB2YWx1ZTogJ0tZJywgbGFiZWw6ICdLZW50dWNreScgfSxcbiAgICB7IHZhbHVlOiAnTEEnLCBsYWJlbDogJ0xvdWlzaWFuYScgfSxcbiAgICB7IHZhbHVlOiAnTUUnLCBsYWJlbDogJ01haW5lJyB9LFxuICAgIHsgdmFsdWU6ICdNSCcsIGxhYmVsOiAnTWFyc2hhbGwgSXNsYW5kcycgfSxcbiAgICB7IHZhbHVlOiAnTUQnLCBsYWJlbDogJ01hcnlsYW5kJyB9LFxuICAgIHsgdmFsdWU6ICdNQScsIGxhYmVsOiAnTWFzc2FjaHVzZXR0cycgfSxcbiAgICB7IHZhbHVlOiAnTUknLCBsYWJlbDogJ01pY2hpZ2FuJyB9LFxuICAgIHsgdmFsdWU6ICdNTicsIGxhYmVsOiAnTWlubmVzb3RhJyB9LFxuICAgIHsgdmFsdWU6ICdNUycsIGxhYmVsOiAnTWlzc2lzc2lwcGknIH0sXG4gICAgeyB2YWx1ZTogJ01PJywgbGFiZWw6ICdNaXNzb3VyaScgfSxcbiAgICB7IHZhbHVlOiAnTVQnLCBsYWJlbDogJ01vbnRhbmEnIH0sXG4gICAgeyB2YWx1ZTogJ05FJywgbGFiZWw6ICdOZWJyYXNrYScgfSxcbiAgICB7IHZhbHVlOiAnTlYnLCBsYWJlbDogJ05ldmFkYScgfSxcbiAgICB7IHZhbHVlOiAnTkgnLCBsYWJlbDogJ05ldyBIYW1wc2hpcmUnIH0sXG4gICAgeyB2YWx1ZTogJ05KJywgbGFiZWw6ICdOZXcgSmVyc2V5JyB9LFxuICAgIHsgdmFsdWU6ICdOTScsIGxhYmVsOiAnTmV3IE1leGljbycgfSxcbiAgICB7IHZhbHVlOiAnTlknLCBsYWJlbDogJ05ldyBZb3JrJyB9LFxuICAgIHsgdmFsdWU6ICdOQycsIGxhYmVsOiAnTm9ydGggQ2Fyb2xpbmEnIH0sXG4gICAgeyB2YWx1ZTogJ05EJywgbGFiZWw6ICdOb3J0aCBEYWtvdGEnIH0sXG4gICAgeyB2YWx1ZTogJ01QJywgbGFiZWw6ICdOb3J0aGVybiBNYXJpYW5hIElzbGFuZHMnIH0sXG4gICAgeyB2YWx1ZTogJ09IJywgbGFiZWw6ICdPaGlvJyB9LFxuICAgIHsgdmFsdWU6ICdPSycsIGxhYmVsOiAnT2tsYWhvbWEnIH0sXG4gICAgeyB2YWx1ZTogJ09SJywgbGFiZWw6ICdPcmVnb24nIH0sXG4gICAgeyB2YWx1ZTogJ1BXJywgbGFiZWw6ICdQYWxhdScgfSxcbiAgICB7IHZhbHVlOiAnUEEnLCBsYWJlbDogJ1Blbm5zeWx2YW5pYScgfSxcbiAgICB7IHZhbHVlOiAnUFInLCBsYWJlbDogJ1B1ZXJ0byBSaWNvJyB9LFxuICAgIHsgdmFsdWU6ICdSSScsIGxhYmVsOiAnUmhvZGUgSXNsYW5kJyB9LFxuICAgIHsgdmFsdWU6ICdTQycsIGxhYmVsOiAnU291dGggQ2Fyb2xpbmEnIH0sXG4gICAgeyB2YWx1ZTogJ1NEJywgbGFiZWw6ICdTb3V0aCBEYWtvdGEnIH0sXG4gICAgeyB2YWx1ZTogJ1ROJywgbGFiZWw6ICdUZW5uZXNzZWUnIH0sXG4gICAgeyB2YWx1ZTogJ1RYJywgbGFiZWw6ICdUZXhhcycgfSxcbiAgICB7IHZhbHVlOiAnVVQnLCBsYWJlbDogJ1V0YWgnIH0sXG4gICAgeyB2YWx1ZTogJ1ZUJywgbGFiZWw6ICdWZXJtb250JyB9LFxuICAgIHsgdmFsdWU6ICdWSScsIGxhYmVsOiAnVmlyZ2luIElzbGFuZHMnIH0sXG4gICAgeyB2YWx1ZTogJ1ZBJywgbGFiZWw6ICdWaXJnaW5pYScgfSxcbiAgICB7IHZhbHVlOiAnV0EnLCBsYWJlbDogJ1dhc2hpbmd0b24nIH0sXG4gICAgeyB2YWx1ZTogJ1dWJywgbGFiZWw6ICdXZXN0IFZpcmdpbmlhJyB9LFxuICAgIHsgdmFsdWU6ICdXSScsIGxhYmVsOiAnV2lzY29uc2luJyB9LFxuICAgIHsgdmFsdWU6ICdXWScsIGxhYmVsOiAnV3lvbWluZycgfSxcbl07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IFtcblx0eyB2YWx1ZTogJ0pvaG4gU21pdGgnLCBsYWJlbDogJ0pvaG4gU21pdGgnLCBlbWFpbDogJ2pvaG5Ac21pdGguY29tJyB9LFxuXHR7IHZhbHVlOiAnTWVycnkgSmFuZScsIGxhYmVsOiAnTWVycnkgSmFuZScsIGVtYWlsOiAnbWVycnlAamFuZS5jb20nIH0sXG5cdHsgdmFsdWU6ICdTdGFuIEhvcGVyJywgbGFiZWw6ICdTdGFuIEhvcGVyJywgZW1haWw6ICdzdGFuQGhvcGVyLmNvbScgfVxuXTtcbiIsIi8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcbi8vIHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZVxuLy8gZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbi8vIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1Ncbi8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cbi8vIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuLy8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4vLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4vLyBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG4ndXNlIHN0cmljdCc7XG5cbi8vIElmIG9iai5oYXNPd25Qcm9wZXJ0eSBoYXMgYmVlbiBvdmVycmlkZGVuLCB0aGVuIGNhbGxpbmdcbi8vIG9iai5oYXNPd25Qcm9wZXJ0eShwcm9wKSB3aWxsIGJyZWFrLlxuLy8gU2VlOiBodHRwczovL2dpdGh1Yi5jb20vam95ZW50L25vZGUvaXNzdWVzLzE3MDdcbmZ1bmN0aW9uIGhhc093blByb3BlcnR5KG9iaiwgcHJvcCkge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ocXMsIHNlcCwgZXEsIG9wdGlvbnMpIHtcbiAgc2VwID0gc2VwIHx8ICcmJztcbiAgZXEgPSBlcSB8fCAnPSc7XG4gIHZhciBvYmogPSB7fTtcblxuICBpZiAodHlwZW9mIHFzICE9PSAnc3RyaW5nJyB8fCBxcy5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gb2JqO1xuICB9XG5cbiAgdmFyIHJlZ2V4cCA9IC9cXCsvZztcbiAgcXMgPSBxcy5zcGxpdChzZXApO1xuXG4gIHZhciBtYXhLZXlzID0gMTAwMDtcbiAgaWYgKG9wdGlvbnMgJiYgdHlwZW9mIG9wdGlvbnMubWF4S2V5cyA9PT0gJ251bWJlcicpIHtcbiAgICBtYXhLZXlzID0gb3B0aW9ucy5tYXhLZXlzO1xuICB9XG5cbiAgdmFyIGxlbiA9IHFzLmxlbmd0aDtcbiAgLy8gbWF4S2V5cyA8PSAwIG1lYW5zIHRoYXQgd2Ugc2hvdWxkIG5vdCBsaW1pdCBrZXlzIGNvdW50XG4gIGlmIChtYXhLZXlzID4gMCAmJiBsZW4gPiBtYXhLZXlzKSB7XG4gICAgbGVuID0gbWF4S2V5cztcbiAgfVxuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyArK2kpIHtcbiAgICB2YXIgeCA9IHFzW2ldLnJlcGxhY2UocmVnZXhwLCAnJTIwJyksXG4gICAgICAgIGlkeCA9IHguaW5kZXhPZihlcSksXG4gICAgICAgIGtzdHIsIHZzdHIsIGssIHY7XG5cbiAgICBpZiAoaWR4ID49IDApIHtcbiAgICAgIGtzdHIgPSB4LnN1YnN0cigwLCBpZHgpO1xuICAgICAgdnN0ciA9IHguc3Vic3RyKGlkeCArIDEpO1xuICAgIH0gZWxzZSB7XG4gICAgICBrc3RyID0geDtcbiAgICAgIHZzdHIgPSAnJztcbiAgICB9XG5cbiAgICBrID0gZGVjb2RlVVJJQ29tcG9uZW50KGtzdHIpO1xuICAgIHYgPSBkZWNvZGVVUklDb21wb25lbnQodnN0cik7XG5cbiAgICBpZiAoIWhhc093blByb3BlcnR5KG9iaiwgaykpIHtcbiAgICAgIG9ialtrXSA9IHY7XG4gICAgfSBlbHNlIGlmIChpc0FycmF5KG9ialtrXSkpIHtcbiAgICAgIG9ialtrXS5wdXNoKHYpO1xuICAgIH0gZWxzZSB7XG4gICAgICBvYmpba10gPSBbb2JqW2tdLCB2XTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gb2JqO1xufTtcblxudmFyIGlzQXJyYXkgPSBBcnJheS5pc0FycmF5IHx8IGZ1bmN0aW9uICh4cykge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHhzKSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbn07XG4iLCIvLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgc3RyaW5naWZ5UHJpbWl0aXZlID0gZnVuY3Rpb24odikge1xuICBzd2l0Y2ggKHR5cGVvZiB2KSB7XG4gICAgY2FzZSAnc3RyaW5nJzpcbiAgICAgIHJldHVybiB2O1xuXG4gICAgY2FzZSAnYm9vbGVhbic6XG4gICAgICByZXR1cm4gdiA/ICd0cnVlJyA6ICdmYWxzZSc7XG5cbiAgICBjYXNlICdudW1iZXInOlxuICAgICAgcmV0dXJuIGlzRmluaXRlKHYpID8gdiA6ICcnO1xuXG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiAnJztcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihvYmosIHNlcCwgZXEsIG5hbWUpIHtcbiAgc2VwID0gc2VwIHx8ICcmJztcbiAgZXEgPSBlcSB8fCAnPSc7XG4gIGlmIChvYmogPT09IG51bGwpIHtcbiAgICBvYmogPSB1bmRlZmluZWQ7XG4gIH1cblxuICBpZiAodHlwZW9mIG9iaiA9PT0gJ29iamVjdCcpIHtcbiAgICByZXR1cm4gbWFwKG9iamVjdEtleXMob2JqKSwgZnVuY3Rpb24oaykge1xuICAgICAgdmFyIGtzID0gZW5jb2RlVVJJQ29tcG9uZW50KHN0cmluZ2lmeVByaW1pdGl2ZShrKSkgKyBlcTtcbiAgICAgIGlmIChpc0FycmF5KG9ialtrXSkpIHtcbiAgICAgICAgcmV0dXJuIG1hcChvYmpba10sIGZ1bmN0aW9uKHYpIHtcbiAgICAgICAgICByZXR1cm4ga3MgKyBlbmNvZGVVUklDb21wb25lbnQoc3RyaW5naWZ5UHJpbWl0aXZlKHYpKTtcbiAgICAgICAgfSkuam9pbihzZXApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGtzICsgZW5jb2RlVVJJQ29tcG9uZW50KHN0cmluZ2lmeVByaW1pdGl2ZShvYmpba10pKTtcbiAgICAgIH1cbiAgICB9KS5qb2luKHNlcCk7XG5cbiAgfVxuXG4gIGlmICghbmFtZSkgcmV0dXJuICcnO1xuICByZXR1cm4gZW5jb2RlVVJJQ29tcG9uZW50KHN0cmluZ2lmeVByaW1pdGl2ZShuYW1lKSkgKyBlcSArXG4gICAgICAgICBlbmNvZGVVUklDb21wb25lbnQoc3RyaW5naWZ5UHJpbWl0aXZlKG9iaikpO1xufTtcblxudmFyIGlzQXJyYXkgPSBBcnJheS5pc0FycmF5IHx8IGZ1bmN0aW9uICh4cykge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHhzKSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbn07XG5cbmZ1bmN0aW9uIG1hcCAoeHMsIGYpIHtcbiAgaWYgKHhzLm1hcCkgcmV0dXJuIHhzLm1hcChmKTtcbiAgdmFyIHJlcyA9IFtdO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHhzLmxlbmd0aDsgaSsrKSB7XG4gICAgcmVzLnB1c2goZih4c1tpXSwgaSkpO1xuICB9XG4gIHJldHVybiByZXM7XG59XG5cbnZhciBvYmplY3RLZXlzID0gT2JqZWN0LmtleXMgfHwgZnVuY3Rpb24gKG9iaikge1xuICB2YXIgcmVzID0gW107XG4gIGZvciAodmFyIGtleSBpbiBvYmopIHtcbiAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwga2V5KSkgcmVzLnB1c2goa2V5KTtcbiAgfVxuICByZXR1cm4gcmVzO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5kZWNvZGUgPSBleHBvcnRzLnBhcnNlID0gcmVxdWlyZSgnLi9kZWNvZGUnKTtcbmV4cG9ydHMuZW5jb2RlID0gZXhwb3J0cy5zdHJpbmdpZnkgPSByZXF1aXJlKCcuL2VuY29kZScpO1xuIiwiLy8gR2VuZXJhdGVkIGJ5IENvZmZlZVNjcmlwdCAxLjEwLjBcbnZhciBSZWFjdCwgaXNSZXRpbmEsIG1kNSwgcXVlcnlzdHJpbmc7XG5cblJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcblxubWQ1ID0gcmVxdWlyZSgnbWQ1Jyk7XG5cbnF1ZXJ5c3RyaW5nID0gcmVxdWlyZSgncXVlcnlzdHJpbmcnKTtcblxuaXNSZXRpbmEgPSByZXF1aXJlKCdpcy1yZXRpbmEnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGRpc3BsYXlOYW1lOiAnR3JhdmF0YXInLFxuICBwcm9wVHlwZXM6IHtcbiAgICBlbWFpbDogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcbiAgICBtZDU6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG4gICAgc2l6ZTogUmVhY3QuUHJvcFR5cGVzLm51bWJlcixcbiAgICByYXRpbmc6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG4gICAgaHR0cHM6IFJlYWN0LlByb3BUeXBlcy5ib29sLFxuICAgIFwiZGVmYXVsdFwiOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuICAgIGNsYXNzTmFtZTogUmVhY3QuUHJvcFR5cGVzLnN0cmluZ1xuICB9LFxuICBnZXREZWZhdWx0UHJvcHM6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB7XG4gICAgICBzaXplOiA1MCxcbiAgICAgIHJhdGluZzogJ2cnLFxuICAgICAgaHR0cHM6IGZhbHNlLFxuICAgICAgXCJkZWZhdWx0XCI6IFwicmV0cm9cIixcbiAgICAgIGNsYXNzTmFtZTogXCJcIlxuICAgIH07XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgdmFyIGJhc2UsIGhhc2gsIG1vZGVybkJyb3dzZXIsIHF1ZXJ5LCByZXRpbmFRdWVyeSwgcmV0aW5hU3JjLCBzcmM7XG4gICAgYmFzZSA9IHRoaXMucHJvcHMuaHR0cHMgPyBcImh0dHBzOi8vc2VjdXJlLmdyYXZhdGFyLmNvbS9hdmF0YXIvXCIgOiAnaHR0cDovL3d3dy5ncmF2YXRhci5jb20vYXZhdGFyLyc7XG4gICAgcXVlcnkgPSBxdWVyeXN0cmluZy5zdHJpbmdpZnkoe1xuICAgICAgczogdGhpcy5wcm9wcy5zaXplLFxuICAgICAgcjogdGhpcy5wcm9wcy5yYXRpbmcsXG4gICAgICBkOiB0aGlzLnByb3BzW1wiZGVmYXVsdFwiXVxuICAgIH0pO1xuICAgIHJldGluYVF1ZXJ5ID0gcXVlcnlzdHJpbmcuc3RyaW5naWZ5KHtcbiAgICAgIHM6IHRoaXMucHJvcHMuc2l6ZSAqIDIsXG4gICAgICByOiB0aGlzLnByb3BzLnJhdGluZyxcbiAgICAgIGQ6IHRoaXMucHJvcHNbXCJkZWZhdWx0XCJdXG4gICAgfSk7XG4gICAgaWYgKHRoaXMucHJvcHMubWQ1KSB7XG4gICAgICBoYXNoID0gdGhpcy5wcm9wcy5tZDU7XG4gICAgfSBlbHNlIGlmICh0aGlzLnByb3BzLmVtYWlsKSB7XG4gICAgICBoYXNoID0gbWQ1KHRoaXMucHJvcHMuZW1haWwpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLndhcm4oJ0dyYXZhdGFyIGltYWdlIGNhbiBub3QgYmUgZmV0Y2hlZC4gRWl0aGVyIHRoZSBcImVtYWlsXCIgb3IgXCJtZDVcIiBwcm9wIG11c3QgYmUgc3BlY2lmaWVkLicpO1xuICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIiwgbnVsbCk7XG4gICAgfVxuICAgIHNyYyA9IGJhc2UgKyBoYXNoICsgXCI/XCIgKyBxdWVyeTtcbiAgICByZXRpbmFTcmMgPSBiYXNlICsgaGFzaCArIFwiP1wiICsgcmV0aW5hUXVlcnk7XG4gICAgbW9kZXJuQnJvd3NlciA9IHRydWU7XG4gICAgaWYgKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgJiYgd2luZG93ICE9PSBudWxsKSB7XG4gICAgICBtb2Rlcm5Ccm93c2VyID0gJ3NyY3NldCcgaW4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XG4gICAgfVxuICAgIGlmICghbW9kZXJuQnJvd3NlciAmJiBpc1JldGluYSgpKSB7XG4gICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcImltZ1wiLCBSZWFjdC5fX3NwcmVhZCh7XG4gICAgICAgIFwic3R5bGVcIjogdGhpcy5wcm9wcy5zdHlsZSxcbiAgICAgICAgXCJjbGFzc05hbWVcIjogXCJyZWFjdC1ncmF2YXRhciBcIiArIHRoaXMucHJvcHMuY2xhc3NOYW1lLFxuICAgICAgICBcInNyY1wiOiByZXRpbmFTcmMsXG4gICAgICAgIFwiaGVpZ2h0XCI6IHRoaXMucHJvcHMuc2l6ZSxcbiAgICAgICAgXCJ3aWR0aFwiOiB0aGlzLnByb3BzLnNpemVcbiAgICAgIH0sIHRoaXMucHJvcHMpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIiwgUmVhY3QuX19zcHJlYWQoe1xuICAgICAgICBcInN0eWxlXCI6IHRoaXMucHJvcHMuc3R5bGUsXG4gICAgICAgIFwiY2xhc3NOYW1lXCI6IFwicmVhY3QtZ3JhdmF0YXIgXCIgKyB0aGlzLnByb3BzLmNsYXNzTmFtZSxcbiAgICAgICAgXCJzcmNcIjogc3JjLFxuICAgICAgICBcInNyY1NldFwiOiByZXRpbmFTcmMgKyBcIiAyeFwiLFxuICAgICAgICBcImhlaWdodFwiOiB0aGlzLnByb3BzLnNpemUsXG4gICAgICAgIFwid2lkdGhcIjogdGhpcy5wcm9wcy5zaXplXG4gICAgICB9LCB0aGlzLnByb3BzKSk7XG4gICAgfVxuICB9XG59KTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7XG4gIHZhciBtZWRpYVF1ZXJ5O1xuICBpZiAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiAmJiB3aW5kb3cgIT09IG51bGwpIHtcbiAgICBtZWRpYVF1ZXJ5ID0gXCIoLXdlYmtpdC1taW4tZGV2aWNlLXBpeGVsLXJhdGlvOiAxLjI1KSwgKG1pbi0tbW96LWRldmljZS1waXhlbC1yYXRpbzogMS4yNSksICgtby1taW4tZGV2aWNlLXBpeGVsLXJhdGlvOiA1LzQpLCAobWluLXJlc29sdXRpb246IDEuMjVkcHB4KVwiO1xuICAgIGlmICh3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbyA+IDEuMjUpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBpZiAod2luZG93Lm1hdGNoTWVkaWEgJiYgd2luZG93Lm1hdGNoTWVkaWEobWVkaWFRdWVyeSkubWF0Y2hlcykge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG4gIHJldHVybiBmYWxzZTtcbn07XG4iLCIoZnVuY3Rpb24oKXtcclxuICB2YXIgY3J5cHQgPSByZXF1aXJlKCdjcnlwdCcpLFxyXG4gICAgICB1dGY4ID0gcmVxdWlyZSgnY2hhcmVuYycpLnV0ZjgsXHJcbiAgICAgIGlzQnVmZmVyID0gcmVxdWlyZSgnaXMtYnVmZmVyJyksXHJcbiAgICAgIGJpbiA9IHJlcXVpcmUoJ2NoYXJlbmMnKS5iaW4sXHJcblxyXG4gIC8vIFRoZSBjb3JlXHJcbiAgbWQ1ID0gZnVuY3Rpb24gKG1lc3NhZ2UsIG9wdGlvbnMpIHtcclxuICAgIC8vIENvbnZlcnQgdG8gYnl0ZSBhcnJheVxyXG4gICAgaWYgKG1lc3NhZ2UuY29uc3RydWN0b3IgPT0gU3RyaW5nKVxyXG4gICAgICBpZiAob3B0aW9ucyAmJiBvcHRpb25zLmVuY29kaW5nID09PSAnYmluYXJ5JylcclxuICAgICAgICBtZXNzYWdlID0gYmluLnN0cmluZ1RvQnl0ZXMobWVzc2FnZSk7XHJcbiAgICAgIGVsc2VcclxuICAgICAgICBtZXNzYWdlID0gdXRmOC5zdHJpbmdUb0J5dGVzKG1lc3NhZ2UpO1xyXG4gICAgZWxzZSBpZiAoaXNCdWZmZXIobWVzc2FnZSkpXHJcbiAgICAgIG1lc3NhZ2UgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChtZXNzYWdlLCAwKTtcclxuICAgIGVsc2UgaWYgKCFBcnJheS5pc0FycmF5KG1lc3NhZ2UpKVxyXG4gICAgICBtZXNzYWdlID0gbWVzc2FnZS50b1N0cmluZygpO1xyXG4gICAgLy8gZWxzZSwgYXNzdW1lIGJ5dGUgYXJyYXkgYWxyZWFkeVxyXG5cclxuICAgIHZhciBtID0gY3J5cHQuYnl0ZXNUb1dvcmRzKG1lc3NhZ2UpLFxyXG4gICAgICAgIGwgPSBtZXNzYWdlLmxlbmd0aCAqIDgsXHJcbiAgICAgICAgYSA9ICAxNzMyNTg0MTkzLFxyXG4gICAgICAgIGIgPSAtMjcxNzMzODc5LFxyXG4gICAgICAgIGMgPSAtMTczMjU4NDE5NCxcclxuICAgICAgICBkID0gIDI3MTczMzg3ODtcclxuXHJcbiAgICAvLyBTd2FwIGVuZGlhblxyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBtLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIG1baV0gPSAoKG1baV0gPDwgIDgpIHwgKG1baV0gPj4+IDI0KSkgJiAweDAwRkYwMEZGIHxcclxuICAgICAgICAgICAgICgobVtpXSA8PCAyNCkgfCAobVtpXSA+Pj4gIDgpKSAmIDB4RkYwMEZGMDA7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gUGFkZGluZ1xyXG4gICAgbVtsID4+PiA1XSB8PSAweDgwIDw8IChsICUgMzIpO1xyXG4gICAgbVsoKChsICsgNjQpID4+PiA5KSA8PCA0KSArIDE0XSA9IGw7XHJcblxyXG4gICAgLy8gTWV0aG9kIHNob3J0Y3V0c1xyXG4gICAgdmFyIEZGID0gbWQ1Ll9mZixcclxuICAgICAgICBHRyA9IG1kNS5fZ2csXHJcbiAgICAgICAgSEggPSBtZDUuX2hoLFxyXG4gICAgICAgIElJID0gbWQ1Ll9paTtcclxuXHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG0ubGVuZ3RoOyBpICs9IDE2KSB7XHJcblxyXG4gICAgICB2YXIgYWEgPSBhLFxyXG4gICAgICAgICAgYmIgPSBiLFxyXG4gICAgICAgICAgY2MgPSBjLFxyXG4gICAgICAgICAgZGQgPSBkO1xyXG5cclxuICAgICAgYSA9IEZGKGEsIGIsIGMsIGQsIG1baSsgMF0sICA3LCAtNjgwODc2OTM2KTtcclxuICAgICAgZCA9IEZGKGQsIGEsIGIsIGMsIG1baSsgMV0sIDEyLCAtMzg5NTY0NTg2KTtcclxuICAgICAgYyA9IEZGKGMsIGQsIGEsIGIsIG1baSsgMl0sIDE3LCAgNjA2MTA1ODE5KTtcclxuICAgICAgYiA9IEZGKGIsIGMsIGQsIGEsIG1baSsgM10sIDIyLCAtMTA0NDUyNTMzMCk7XHJcbiAgICAgIGEgPSBGRihhLCBiLCBjLCBkLCBtW2krIDRdLCAgNywgLTE3NjQxODg5Nyk7XHJcbiAgICAgIGQgPSBGRihkLCBhLCBiLCBjLCBtW2krIDVdLCAxMiwgIDEyMDAwODA0MjYpO1xyXG4gICAgICBjID0gRkYoYywgZCwgYSwgYiwgbVtpKyA2XSwgMTcsIC0xNDczMjMxMzQxKTtcclxuICAgICAgYiA9IEZGKGIsIGMsIGQsIGEsIG1baSsgN10sIDIyLCAtNDU3MDU5ODMpO1xyXG4gICAgICBhID0gRkYoYSwgYiwgYywgZCwgbVtpKyA4XSwgIDcsICAxNzcwMDM1NDE2KTtcclxuICAgICAgZCA9IEZGKGQsIGEsIGIsIGMsIG1baSsgOV0sIDEyLCAtMTk1ODQxNDQxNyk7XHJcbiAgICAgIGMgPSBGRihjLCBkLCBhLCBiLCBtW2krMTBdLCAxNywgLTQyMDYzKTtcclxuICAgICAgYiA9IEZGKGIsIGMsIGQsIGEsIG1baSsxMV0sIDIyLCAtMTk5MDQwNDE2Mik7XHJcbiAgICAgIGEgPSBGRihhLCBiLCBjLCBkLCBtW2krMTJdLCAgNywgIDE4MDQ2MDM2ODIpO1xyXG4gICAgICBkID0gRkYoZCwgYSwgYiwgYywgbVtpKzEzXSwgMTIsIC00MDM0MTEwMSk7XHJcbiAgICAgIGMgPSBGRihjLCBkLCBhLCBiLCBtW2krMTRdLCAxNywgLTE1MDIwMDIyOTApO1xyXG4gICAgICBiID0gRkYoYiwgYywgZCwgYSwgbVtpKzE1XSwgMjIsICAxMjM2NTM1MzI5KTtcclxuXHJcbiAgICAgIGEgPSBHRyhhLCBiLCBjLCBkLCBtW2krIDFdLCAgNSwgLTE2NTc5NjUxMCk7XHJcbiAgICAgIGQgPSBHRyhkLCBhLCBiLCBjLCBtW2krIDZdLCAgOSwgLTEwNjk1MDE2MzIpO1xyXG4gICAgICBjID0gR0coYywgZCwgYSwgYiwgbVtpKzExXSwgMTQsICA2NDM3MTc3MTMpO1xyXG4gICAgICBiID0gR0coYiwgYywgZCwgYSwgbVtpKyAwXSwgMjAsIC0zNzM4OTczMDIpO1xyXG4gICAgICBhID0gR0coYSwgYiwgYywgZCwgbVtpKyA1XSwgIDUsIC03MDE1NTg2OTEpO1xyXG4gICAgICBkID0gR0coZCwgYSwgYiwgYywgbVtpKzEwXSwgIDksICAzODAxNjA4Myk7XHJcbiAgICAgIGMgPSBHRyhjLCBkLCBhLCBiLCBtW2krMTVdLCAxNCwgLTY2MDQ3ODMzNSk7XHJcbiAgICAgIGIgPSBHRyhiLCBjLCBkLCBhLCBtW2krIDRdLCAyMCwgLTQwNTUzNzg0OCk7XHJcbiAgICAgIGEgPSBHRyhhLCBiLCBjLCBkLCBtW2krIDldLCAgNSwgIDU2ODQ0NjQzOCk7XHJcbiAgICAgIGQgPSBHRyhkLCBhLCBiLCBjLCBtW2krMTRdLCAgOSwgLTEwMTk4MDM2OTApO1xyXG4gICAgICBjID0gR0coYywgZCwgYSwgYiwgbVtpKyAzXSwgMTQsIC0xODczNjM5NjEpO1xyXG4gICAgICBiID0gR0coYiwgYywgZCwgYSwgbVtpKyA4XSwgMjAsICAxMTYzNTMxNTAxKTtcclxuICAgICAgYSA9IEdHKGEsIGIsIGMsIGQsIG1baSsxM10sICA1LCAtMTQ0NDY4MTQ2Nyk7XHJcbiAgICAgIGQgPSBHRyhkLCBhLCBiLCBjLCBtW2krIDJdLCAgOSwgLTUxNDAzNzg0KTtcclxuICAgICAgYyA9IEdHKGMsIGQsIGEsIGIsIG1baSsgN10sIDE0LCAgMTczNTMyODQ3Myk7XHJcbiAgICAgIGIgPSBHRyhiLCBjLCBkLCBhLCBtW2krMTJdLCAyMCwgLTE5MjY2MDc3MzQpO1xyXG5cclxuICAgICAgYSA9IEhIKGEsIGIsIGMsIGQsIG1baSsgNV0sICA0LCAtMzc4NTU4KTtcclxuICAgICAgZCA9IEhIKGQsIGEsIGIsIGMsIG1baSsgOF0sIDExLCAtMjAyMjU3NDQ2Myk7XHJcbiAgICAgIGMgPSBISChjLCBkLCBhLCBiLCBtW2krMTFdLCAxNiwgIDE4MzkwMzA1NjIpO1xyXG4gICAgICBiID0gSEgoYiwgYywgZCwgYSwgbVtpKzE0XSwgMjMsIC0zNTMwOTU1Nik7XHJcbiAgICAgIGEgPSBISChhLCBiLCBjLCBkLCBtW2krIDFdLCAgNCwgLTE1MzA5OTIwNjApO1xyXG4gICAgICBkID0gSEgoZCwgYSwgYiwgYywgbVtpKyA0XSwgMTEsICAxMjcyODkzMzUzKTtcclxuICAgICAgYyA9IEhIKGMsIGQsIGEsIGIsIG1baSsgN10sIDE2LCAtMTU1NDk3NjMyKTtcclxuICAgICAgYiA9IEhIKGIsIGMsIGQsIGEsIG1baSsxMF0sIDIzLCAtMTA5NDczMDY0MCk7XHJcbiAgICAgIGEgPSBISChhLCBiLCBjLCBkLCBtW2krMTNdLCAgNCwgIDY4MTI3OTE3NCk7XHJcbiAgICAgIGQgPSBISChkLCBhLCBiLCBjLCBtW2krIDBdLCAxMSwgLTM1ODUzNzIyMik7XHJcbiAgICAgIGMgPSBISChjLCBkLCBhLCBiLCBtW2krIDNdLCAxNiwgLTcyMjUyMTk3OSk7XHJcbiAgICAgIGIgPSBISChiLCBjLCBkLCBhLCBtW2krIDZdLCAyMywgIDc2MDI5MTg5KTtcclxuICAgICAgYSA9IEhIKGEsIGIsIGMsIGQsIG1baSsgOV0sICA0LCAtNjQwMzY0NDg3KTtcclxuICAgICAgZCA9IEhIKGQsIGEsIGIsIGMsIG1baSsxMl0sIDExLCAtNDIxODE1ODM1KTtcclxuICAgICAgYyA9IEhIKGMsIGQsIGEsIGIsIG1baSsxNV0sIDE2LCAgNTMwNzQyNTIwKTtcclxuICAgICAgYiA9IEhIKGIsIGMsIGQsIGEsIG1baSsgMl0sIDIzLCAtOTk1MzM4NjUxKTtcclxuXHJcbiAgICAgIGEgPSBJSShhLCBiLCBjLCBkLCBtW2krIDBdLCAgNiwgLTE5ODYzMDg0NCk7XHJcbiAgICAgIGQgPSBJSShkLCBhLCBiLCBjLCBtW2krIDddLCAxMCwgIDExMjY4OTE0MTUpO1xyXG4gICAgICBjID0gSUkoYywgZCwgYSwgYiwgbVtpKzE0XSwgMTUsIC0xNDE2MzU0OTA1KTtcclxuICAgICAgYiA9IElJKGIsIGMsIGQsIGEsIG1baSsgNV0sIDIxLCAtNTc0MzQwNTUpO1xyXG4gICAgICBhID0gSUkoYSwgYiwgYywgZCwgbVtpKzEyXSwgIDYsICAxNzAwNDg1NTcxKTtcclxuICAgICAgZCA9IElJKGQsIGEsIGIsIGMsIG1baSsgM10sIDEwLCAtMTg5NDk4NjYwNik7XHJcbiAgICAgIGMgPSBJSShjLCBkLCBhLCBiLCBtW2krMTBdLCAxNSwgLTEwNTE1MjMpO1xyXG4gICAgICBiID0gSUkoYiwgYywgZCwgYSwgbVtpKyAxXSwgMjEsIC0yMDU0OTIyNzk5KTtcclxuICAgICAgYSA9IElJKGEsIGIsIGMsIGQsIG1baSsgOF0sICA2LCAgMTg3MzMxMzM1OSk7XHJcbiAgICAgIGQgPSBJSShkLCBhLCBiLCBjLCBtW2krMTVdLCAxMCwgLTMwNjExNzQ0KTtcclxuICAgICAgYyA9IElJKGMsIGQsIGEsIGIsIG1baSsgNl0sIDE1LCAtMTU2MDE5ODM4MCk7XHJcbiAgICAgIGIgPSBJSShiLCBjLCBkLCBhLCBtW2krMTNdLCAyMSwgIDEzMDkxNTE2NDkpO1xyXG4gICAgICBhID0gSUkoYSwgYiwgYywgZCwgbVtpKyA0XSwgIDYsIC0xNDU1MjMwNzApO1xyXG4gICAgICBkID0gSUkoZCwgYSwgYiwgYywgbVtpKzExXSwgMTAsIC0xMTIwMjEwMzc5KTtcclxuICAgICAgYyA9IElJKGMsIGQsIGEsIGIsIG1baSsgMl0sIDE1LCAgNzE4Nzg3MjU5KTtcclxuICAgICAgYiA9IElJKGIsIGMsIGQsIGEsIG1baSsgOV0sIDIxLCAtMzQzNDg1NTUxKTtcclxuXHJcbiAgICAgIGEgPSAoYSArIGFhKSA+Pj4gMDtcclxuICAgICAgYiA9IChiICsgYmIpID4+PiAwO1xyXG4gICAgICBjID0gKGMgKyBjYykgPj4+IDA7XHJcbiAgICAgIGQgPSAoZCArIGRkKSA+Pj4gMDtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gY3J5cHQuZW5kaWFuKFthLCBiLCBjLCBkXSk7XHJcbiAgfTtcclxuXHJcbiAgLy8gQXV4aWxpYXJ5IGZ1bmN0aW9uc1xyXG4gIG1kNS5fZmYgID0gZnVuY3Rpb24gKGEsIGIsIGMsIGQsIHgsIHMsIHQpIHtcclxuICAgIHZhciBuID0gYSArIChiICYgYyB8IH5iICYgZCkgKyAoeCA+Pj4gMCkgKyB0O1xyXG4gICAgcmV0dXJuICgobiA8PCBzKSB8IChuID4+PiAoMzIgLSBzKSkpICsgYjtcclxuICB9O1xyXG4gIG1kNS5fZ2cgID0gZnVuY3Rpb24gKGEsIGIsIGMsIGQsIHgsIHMsIHQpIHtcclxuICAgIHZhciBuID0gYSArIChiICYgZCB8IGMgJiB+ZCkgKyAoeCA+Pj4gMCkgKyB0O1xyXG4gICAgcmV0dXJuICgobiA8PCBzKSB8IChuID4+PiAoMzIgLSBzKSkpICsgYjtcclxuICB9O1xyXG4gIG1kNS5faGggID0gZnVuY3Rpb24gKGEsIGIsIGMsIGQsIHgsIHMsIHQpIHtcclxuICAgIHZhciBuID0gYSArIChiIF4gYyBeIGQpICsgKHggPj4+IDApICsgdDtcclxuICAgIHJldHVybiAoKG4gPDwgcykgfCAobiA+Pj4gKDMyIC0gcykpKSArIGI7XHJcbiAgfTtcclxuICBtZDUuX2lpICA9IGZ1bmN0aW9uIChhLCBiLCBjLCBkLCB4LCBzLCB0KSB7XHJcbiAgICB2YXIgbiA9IGEgKyAoYyBeIChiIHwgfmQpKSArICh4ID4+PiAwKSArIHQ7XHJcbiAgICByZXR1cm4gKChuIDw8IHMpIHwgKG4gPj4+ICgzMiAtIHMpKSkgKyBiO1xyXG4gIH07XHJcblxyXG4gIC8vIFBhY2thZ2UgcHJpdmF0ZSBibG9ja3NpemVcclxuICBtZDUuX2Jsb2Nrc2l6ZSA9IDE2O1xyXG4gIG1kNS5fZGlnZXN0c2l6ZSA9IDE2O1xyXG5cclxuICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChtZXNzYWdlLCBvcHRpb25zKSB7XHJcbiAgICBpZih0eXBlb2YgbWVzc2FnZSA9PSAndW5kZWZpbmVkJylcclxuICAgICAgcmV0dXJuO1xyXG5cclxuICAgIHZhciBkaWdlc3RieXRlcyA9IGNyeXB0LndvcmRzVG9CeXRlcyhtZDUobWVzc2FnZSwgb3B0aW9ucykpO1xyXG4gICAgcmV0dXJuIG9wdGlvbnMgJiYgb3B0aW9ucy5hc0J5dGVzID8gZGlnZXN0Ynl0ZXMgOlxyXG4gICAgICAgIG9wdGlvbnMgJiYgb3B0aW9ucy5hc1N0cmluZyA/IGJpbi5ieXRlc1RvU3RyaW5nKGRpZ2VzdGJ5dGVzKSA6XHJcbiAgICAgICAgY3J5cHQuYnl0ZXNUb0hleChkaWdlc3RieXRlcyk7XHJcbiAgfTtcclxuXHJcbn0pKCk7XHJcbiIsInZhciBjaGFyZW5jID0ge1xuICAvLyBVVEYtOCBlbmNvZGluZ1xuICB1dGY4OiB7XG4gICAgLy8gQ29udmVydCBhIHN0cmluZyB0byBhIGJ5dGUgYXJyYXlcbiAgICBzdHJpbmdUb0J5dGVzOiBmdW5jdGlvbihzdHIpIHtcbiAgICAgIHJldHVybiBjaGFyZW5jLmJpbi5zdHJpbmdUb0J5dGVzKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChzdHIpKSk7XG4gICAgfSxcblxuICAgIC8vIENvbnZlcnQgYSBieXRlIGFycmF5IHRvIGEgc3RyaW5nXG4gICAgYnl0ZXNUb1N0cmluZzogZnVuY3Rpb24oYnl0ZXMpIHtcbiAgICAgIHJldHVybiBkZWNvZGVVUklDb21wb25lbnQoZXNjYXBlKGNoYXJlbmMuYmluLmJ5dGVzVG9TdHJpbmcoYnl0ZXMpKSk7XG4gICAgfVxuICB9LFxuXG4gIC8vIEJpbmFyeSBlbmNvZGluZ1xuICBiaW46IHtcbiAgICAvLyBDb252ZXJ0IGEgc3RyaW5nIHRvIGEgYnl0ZSBhcnJheVxuICAgIHN0cmluZ1RvQnl0ZXM6IGZ1bmN0aW9uKHN0cikge1xuICAgICAgZm9yICh2YXIgYnl0ZXMgPSBbXSwgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyBpKyspXG4gICAgICAgIGJ5dGVzLnB1c2goc3RyLmNoYXJDb2RlQXQoaSkgJiAweEZGKTtcbiAgICAgIHJldHVybiBieXRlcztcbiAgICB9LFxuXG4gICAgLy8gQ29udmVydCBhIGJ5dGUgYXJyYXkgdG8gYSBzdHJpbmdcbiAgICBieXRlc1RvU3RyaW5nOiBmdW5jdGlvbihieXRlcykge1xuICAgICAgZm9yICh2YXIgc3RyID0gW10sIGkgPSAwOyBpIDwgYnl0ZXMubGVuZ3RoOyBpKyspXG4gICAgICAgIHN0ci5wdXNoKFN0cmluZy5mcm9tQ2hhckNvZGUoYnl0ZXNbaV0pKTtcbiAgICAgIHJldHVybiBzdHIuam9pbignJyk7XG4gICAgfVxuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNoYXJlbmM7XG4iLCIoZnVuY3Rpb24oKSB7XG4gIHZhciBiYXNlNjRtYXBcbiAgICAgID0gJ0FCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5Ky8nLFxuXG4gIGNyeXB0ID0ge1xuICAgIC8vIEJpdC13aXNlIHJvdGF0aW9uIGxlZnRcbiAgICByb3RsOiBmdW5jdGlvbihuLCBiKSB7XG4gICAgICByZXR1cm4gKG4gPDwgYikgfCAobiA+Pj4gKDMyIC0gYikpO1xuICAgIH0sXG5cbiAgICAvLyBCaXQtd2lzZSByb3RhdGlvbiByaWdodFxuICAgIHJvdHI6IGZ1bmN0aW9uKG4sIGIpIHtcbiAgICAgIHJldHVybiAobiA8PCAoMzIgLSBiKSkgfCAobiA+Pj4gYik7XG4gICAgfSxcblxuICAgIC8vIFN3YXAgYmlnLWVuZGlhbiB0byBsaXR0bGUtZW5kaWFuIGFuZCB2aWNlIHZlcnNhXG4gICAgZW5kaWFuOiBmdW5jdGlvbihuKSB7XG4gICAgICAvLyBJZiBudW1iZXIgZ2l2ZW4sIHN3YXAgZW5kaWFuXG4gICAgICBpZiAobi5jb25zdHJ1Y3RvciA9PSBOdW1iZXIpIHtcbiAgICAgICAgcmV0dXJuIGNyeXB0LnJvdGwobiwgOCkgJiAweDAwRkYwMEZGIHwgY3J5cHQucm90bChuLCAyNCkgJiAweEZGMDBGRjAwO1xuICAgICAgfVxuXG4gICAgICAvLyBFbHNlLCBhc3N1bWUgYXJyYXkgYW5kIHN3YXAgYWxsIGl0ZW1zXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG4ubGVuZ3RoOyBpKyspXG4gICAgICAgIG5baV0gPSBjcnlwdC5lbmRpYW4obltpXSk7XG4gICAgICByZXR1cm4gbjtcbiAgICB9LFxuXG4gICAgLy8gR2VuZXJhdGUgYW4gYXJyYXkgb2YgYW55IGxlbmd0aCBvZiByYW5kb20gYnl0ZXNcbiAgICByYW5kb21CeXRlczogZnVuY3Rpb24obikge1xuICAgICAgZm9yICh2YXIgYnl0ZXMgPSBbXTsgbiA+IDA7IG4tLSlcbiAgICAgICAgYnl0ZXMucHVzaChNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAyNTYpKTtcbiAgICAgIHJldHVybiBieXRlcztcbiAgICB9LFxuXG4gICAgLy8gQ29udmVydCBhIGJ5dGUgYXJyYXkgdG8gYmlnLWVuZGlhbiAzMi1iaXQgd29yZHNcbiAgICBieXRlc1RvV29yZHM6IGZ1bmN0aW9uKGJ5dGVzKSB7XG4gICAgICBmb3IgKHZhciB3b3JkcyA9IFtdLCBpID0gMCwgYiA9IDA7IGkgPCBieXRlcy5sZW5ndGg7IGkrKywgYiArPSA4KVxuICAgICAgICB3b3Jkc1tiID4+PiA1XSB8PSBieXRlc1tpXSA8PCAoMjQgLSBiICUgMzIpO1xuICAgICAgcmV0dXJuIHdvcmRzO1xuICAgIH0sXG5cbiAgICAvLyBDb252ZXJ0IGJpZy1lbmRpYW4gMzItYml0IHdvcmRzIHRvIGEgYnl0ZSBhcnJheVxuICAgIHdvcmRzVG9CeXRlczogZnVuY3Rpb24od29yZHMpIHtcbiAgICAgIGZvciAodmFyIGJ5dGVzID0gW10sIGIgPSAwOyBiIDwgd29yZHMubGVuZ3RoICogMzI7IGIgKz0gOClcbiAgICAgICAgYnl0ZXMucHVzaCgod29yZHNbYiA+Pj4gNV0gPj4+ICgyNCAtIGIgJSAzMikpICYgMHhGRik7XG4gICAgICByZXR1cm4gYnl0ZXM7XG4gICAgfSxcblxuICAgIC8vIENvbnZlcnQgYSBieXRlIGFycmF5IHRvIGEgaGV4IHN0cmluZ1xuICAgIGJ5dGVzVG9IZXg6IGZ1bmN0aW9uKGJ5dGVzKSB7XG4gICAgICBmb3IgKHZhciBoZXggPSBbXSwgaSA9IDA7IGkgPCBieXRlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBoZXgucHVzaCgoYnl0ZXNbaV0gPj4+IDQpLnRvU3RyaW5nKDE2KSk7XG4gICAgICAgIGhleC5wdXNoKChieXRlc1tpXSAmIDB4RikudG9TdHJpbmcoMTYpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBoZXguam9pbignJyk7XG4gICAgfSxcblxuICAgIC8vIENvbnZlcnQgYSBoZXggc3RyaW5nIHRvIGEgYnl0ZSBhcnJheVxuICAgIGhleFRvQnl0ZXM6IGZ1bmN0aW9uKGhleCkge1xuICAgICAgZm9yICh2YXIgYnl0ZXMgPSBbXSwgYyA9IDA7IGMgPCBoZXgubGVuZ3RoOyBjICs9IDIpXG4gICAgICAgIGJ5dGVzLnB1c2gocGFyc2VJbnQoaGV4LnN1YnN0cihjLCAyKSwgMTYpKTtcbiAgICAgIHJldHVybiBieXRlcztcbiAgICB9LFxuXG4gICAgLy8gQ29udmVydCBhIGJ5dGUgYXJyYXkgdG8gYSBiYXNlLTY0IHN0cmluZ1xuICAgIGJ5dGVzVG9CYXNlNjQ6IGZ1bmN0aW9uKGJ5dGVzKSB7XG4gICAgICBmb3IgKHZhciBiYXNlNjQgPSBbXSwgaSA9IDA7IGkgPCBieXRlcy5sZW5ndGg7IGkgKz0gMykge1xuICAgICAgICB2YXIgdHJpcGxldCA9IChieXRlc1tpXSA8PCAxNikgfCAoYnl0ZXNbaSArIDFdIDw8IDgpIHwgYnl0ZXNbaSArIDJdO1xuICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IDQ7IGorKylcbiAgICAgICAgICBpZiAoaSAqIDggKyBqICogNiA8PSBieXRlcy5sZW5ndGggKiA4KVxuICAgICAgICAgICAgYmFzZTY0LnB1c2goYmFzZTY0bWFwLmNoYXJBdCgodHJpcGxldCA+Pj4gNiAqICgzIC0gaikpICYgMHgzRikpO1xuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIGJhc2U2NC5wdXNoKCc9Jyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gYmFzZTY0LmpvaW4oJycpO1xuICAgIH0sXG5cbiAgICAvLyBDb252ZXJ0IGEgYmFzZS02NCBzdHJpbmcgdG8gYSBieXRlIGFycmF5XG4gICAgYmFzZTY0VG9CeXRlczogZnVuY3Rpb24oYmFzZTY0KSB7XG4gICAgICAvLyBSZW1vdmUgbm9uLWJhc2UtNjQgY2hhcmFjdGVyc1xuICAgICAgYmFzZTY0ID0gYmFzZTY0LnJlcGxhY2UoL1teQS1aMC05K1xcL10vaWcsICcnKTtcblxuICAgICAgZm9yICh2YXIgYnl0ZXMgPSBbXSwgaSA9IDAsIGltb2Q0ID0gMDsgaSA8IGJhc2U2NC5sZW5ndGg7XG4gICAgICAgICAgaW1vZDQgPSArK2kgJSA0KSB7XG4gICAgICAgIGlmIChpbW9kNCA9PSAwKSBjb250aW51ZTtcbiAgICAgICAgYnl0ZXMucHVzaCgoKGJhc2U2NG1hcC5pbmRleE9mKGJhc2U2NC5jaGFyQXQoaSAtIDEpKVxuICAgICAgICAgICAgJiAoTWF0aC5wb3coMiwgLTIgKiBpbW9kNCArIDgpIC0gMSkpIDw8IChpbW9kNCAqIDIpKVxuICAgICAgICAgICAgfCAoYmFzZTY0bWFwLmluZGV4T2YoYmFzZTY0LmNoYXJBdChpKSkgPj4+ICg2IC0gaW1vZDQgKiAyKSkpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGJ5dGVzO1xuICAgIH1cbiAgfTtcblxuICBtb2R1bGUuZXhwb3J0cyA9IGNyeXB0O1xufSkoKTtcbiIsIi8qKlxuICogRGV0ZXJtaW5lIGlmIGFuIG9iamVjdCBpcyBCdWZmZXJcbiAqXG4gKiBBdXRob3I6ICAgRmVyb3NzIEFib3VraGFkaWplaCA8ZmVyb3NzQGZlcm9zcy5vcmc+IDxodHRwOi8vZmVyb3NzLm9yZz5cbiAqIExpY2Vuc2U6ICBNSVRcbiAqXG4gKiBgbnBtIGluc3RhbGwgaXMtYnVmZmVyYFxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKG9iaikge1xuICByZXR1cm4gISEoXG4gICAgb2JqICE9IG51bGwgJiZcbiAgICBvYmouY29uc3RydWN0b3IgJiZcbiAgICB0eXBlb2Ygb2JqLmNvbnN0cnVjdG9yLmlzQnVmZmVyID09PSAnZnVuY3Rpb24nICYmXG4gICAgb2JqLmNvbnN0cnVjdG9yLmlzQnVmZmVyKG9iailcbiAgKVxufVxuIl19
