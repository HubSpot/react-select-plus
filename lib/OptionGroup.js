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
		label: _react2['default'].PropTypes.node, // the heading to show above the child options
		option: _react2['default'].PropTypes.object.isRequired, // object that is base for that option group
		isFocused: _react2['default'].PropTypes.bool, // the option is focused
		onFocus: _react2['default'].PropTypes.func, // method to handle mouseEnter on option element
		selectGroup: _react2['default'].PropTypes.bool },

	//  if is true you can select the elements of the group
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

		var className = (0, _classnames2['default'])(this.props.className, option.className);
		var classNameselectGroup = selectGroup ? 'Select-option-group-label select-parent' : 'Select-option-group-label';
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
				onMouseEnter: this.handleMouseEnter,
				onMouseMove: this.handleMouseMove,
				onTouchStart: this.handleTouchStart,
				onTouchMove: this.handleTouchMove,
				onTouchEnd: this.handleTouchEnd,
				title: option.title },
			_react2['default'].createElement(
				'div',
				{ className: classNameselectGroup },
				this.props.label
			),
			this.props.children
		);
	}
});

module.exports = OptionGroup;