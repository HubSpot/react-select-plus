'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var OptionGroup = function (_React$Component) {
	_inherits(OptionGroup, _React$Component);

	function OptionGroup(props) {
		_classCallCheck(this, OptionGroup);

		var _this = _possibleConstructorReturn(this, (OptionGroup.__proto__ || Object.getPrototypeOf(OptionGroup)).call(this, props));

		_this.handleMouseDown = _this.handleMouseDown.bind(_this);
		_this.handleTouchEnd = _this.handleTouchEnd.bind(_this);
		_this.handleTouchMove = _this.handleTouchMove.bind(_this);
		_this.handleTouchStart = _this.handleTouchStart.bind(_this);
		return _this;
	}

	_createClass(OptionGroup, [{
		key: 'blockEvent',
		value: function blockEvent(event) {
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
		}
	}, {
		key: 'handleMouseDown',
		value: function handleMouseDown(event) {
			event.preventDefault();
			event.stopPropagation();
		}
	}, {
		key: 'handleTouchEnd',
		value: function handleTouchEnd(event) {
			// Check if the view is being dragged, In this case
			// we don't want to fire the click event (because the user only wants to scroll)
			if (this.dragging) return;

			this.handleMouseDown(event);
		}
	}, {
		key: 'handleTouchMove',
		value: function handleTouchMove(event) {
			// Set a flag that the view is being dragged
			this.dragging = true;
		}
	}, {
		key: 'handleTouchStart',
		value: function handleTouchStart(event) {
			// Set a flag that the view is not being dragged
			this.dragging = false;
		}
	}, {
		key: 'render',
		value: function render() {
			var option = this.props.option;

			var className = (0, _classnames2.default)(this.props.className, option.className);

			return option.disabled ? _react2.default.createElement(
				'div',
				{ className: className,
					onMouseDown: this.blockEvent,
					onClick: this.blockEvent },
				this.props.children
			) : _react2.default.createElement(
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
				_react2.default.createElement(
					'div',
					{ className: 'Select-option-group-label' },
					this.props.label
				),
				this.props.children
			);
		}
	}]);

	return OptionGroup;
}(_react2.default.Component);

;

OptionGroup.propTypes = {
	children: _propTypes2.default.any,
	className: _propTypes2.default.string, // className (based on mouse position)
	label: _propTypes2.default.node, // the heading to show above the child options
	option: _propTypes2.default.object.isRequired // object that is base for that option group
};

exports.default = OptionGroup;