import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

const isGroup = (option) => {
	return option && Array.isArray(option.options);
};

const menuRenderer = ({
	focusedOption,
	focusOption,
	inputValue,
	instancePrefix,
	onFocus,
	onOptionRef,
	onSelect,
	optionClassName,
	optionComponent,
	optionGroupComponent,
	optionRenderer,
	options,
	removeValue,
	selectValue,
	valueArray,
	valueKey,
}) => {
	let OptionGroup = optionGroupComponent;
	let Option = optionComponent;
	let renderLabel = optionRenderer;

	const renderOptions = (optionsSubset) => {
		return optionsSubset.map((option, i) => {
			if (isGroup(option)) {
				let optionGroupClass = classNames({
					'Select-option-group': true,
				});

				return (
					<OptionGroup
						className={optionGroupClass}
						key={`option-group-${i}`}
						label={renderLabel(option)}
						option={option}
						optionIndex={i}
						>
						{renderOptions(option.options)}
					</OptionGroup>
				);
			} else {
				let isSelected = valueArray && valueArray.indexOf(option) > -1;
				let isFocused = option === focusedOption;
				let optionRef = isFocused ? 'focused' : null;
				let optionClass = classNames(optionClassName, {
					'Select-option': true,
					'is-selected': isSelected,
					'is-focused': isFocused,
					'is-disabled': option.disabled,
				});

				return (
					<Option
						className={optionClass}
						focusOption={focusOption}
						inputValue={inputValue}
						instancePrefix={instancePrefix}
						isDisabled={option.disabled}
						isFocused={isFocused}
						isSelected={isSelected}
						key={`option-${i}-${option[valueKey]}`}
						onFocus={onFocus}
						onSelect={onSelect}
						option={option}
						optionIndex={i}
						ref={ref => { onOptionRef(ref, isFocused); }}
						removeValue={removeValue}
						selectValue={selectValue}
					>
						{renderLabel(option, i)}
					</Option>
				);
			}
		});
	};

	return renderOptions(options);
};

menuRenderer.propTypes = {
	focusOption: PropTypes.func,
	focusedOption: PropTypes.object,
	inputValue: PropTypes.string,
	instancePrefix: PropTypes.string,
	onFocus: PropTypes.func,
	onOptionRef: PropTypes.func,
	onSelect: PropTypes.func,
	optionClassName: PropTypes.string,
	optionComponent: PropTypes.func,
	optionRenderer: PropTypes.func,
	options: PropTypes.array,
	removeValue: PropTypes.func,
	selectValue: PropTypes.func,
	valueArray: PropTypes.array,
	valueKey: PropTypes.string,
};

export default menuRenderer;
