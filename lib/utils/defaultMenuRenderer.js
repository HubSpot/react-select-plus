'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var isGroup = function isGroup(option) {
	return option && Array.isArray(option.options);
};

var menuRenderer = function menuRenderer(_ref) {
	var focusedOption = _ref.focusedOption,
	    focusOption = _ref.focusOption,
	    inputValue = _ref.inputValue,
	    instancePrefix = _ref.instancePrefix,
	    onFocus = _ref.onFocus,
	    onOptionRef = _ref.onOptionRef,
	    onSelect = _ref.onSelect,
	    optionClassName = _ref.optionClassName,
	    optionComponent = _ref.optionComponent,
	    optionGroupComponent = _ref.optionGroupComponent,
	    optionRenderer = _ref.optionRenderer,
	    options = _ref.options,
	    removeValue = _ref.removeValue,
	    selectValue = _ref.selectValue,
	    valueArray = _ref.valueArray,
	    valueKey = _ref.valueKey;

	var OptionGroup = optionGroupComponent;
	var Option = optionComponent;
	var renderLabel = optionRenderer;

	var renderOptions = function renderOptions(optionsSubset) {
		return optionsSubset.map(function (option, i) {
			if (isGroup(option)) {
				var optionGroupClass = (0, _classnames2.default)({
					'Select-option-group': true
				});

				return _react2.default.createElement(
					OptionGroup,
					{
						className: optionGroupClass,
						key: 'option-group-' + i,
						label: renderLabel(option),
						option: option,
						optionIndex: i
					},
					renderOptions(option.options)
				);
			} else {
				var isSelected = valueArray && valueArray.indexOf(option) > -1;
				var isFocused = option === focusedOption;
				var optionRef = isFocused ? 'focused' : null;
				var optionClass = (0, _classnames2.default)(optionClassName, {
					'Select-option': true,
					'is-selected': isSelected,
					'is-focused': isFocused,
					'is-disabled': option.disabled
				});

				return _react2.default.createElement(
					Option,
					{
						className: optionClass,
						focusOption: focusOption,
						inputValue: inputValue,
						instancePrefix: instancePrefix,
						isDisabled: option.disabled,
						isFocused: isFocused,
						isSelected: isSelected,
						key: 'option-' + i + '-' + option[valueKey],
						onFocus: onFocus,
						onSelect: onSelect,
						option: option,
						optionIndex: i,
						ref: function ref(_ref2) {
							onOptionRef(_ref2, isFocused);
						},
						removeValue: removeValue,
						selectValue: selectValue
					},
					renderLabel(option, i)
				);
			}
		});
	};

	return renderOptions(options);
};

menuRenderer.propTypes = {
	focusOption: _propTypes2.default.func,
	focusedOption: _propTypes2.default.object,
	inputValue: _propTypes2.default.string,
	instancePrefix: _propTypes2.default.string,
	onFocus: _propTypes2.default.func,
	onOptionRef: _propTypes2.default.func,
	onSelect: _propTypes2.default.func,
	optionClassName: _propTypes2.default.string,
	optionComponent: _propTypes2.default.func,
	optionRenderer: _propTypes2.default.func,
	options: _propTypes2.default.array,
	removeValue: _propTypes2.default.func,
	selectValue: _propTypes2.default.func,
	valueArray: _propTypes2.default.array,
	valueKey: _propTypes2.default.string
};

exports.default = menuRenderer;