import React from 'react';
import classNames from 'classnames';

const OptionGroup = React.createClass({
	propTypes: {
		children: React.PropTypes.any,
		className: React.PropTypes.string,          // className (based on mouse position)
		isDisabled: React.PropTypes.bool,              // the option is disabled
		isFocused: React.PropTypes.bool,						// method to handle mouseEnter on option group label element
		isFocused: React.PropTypes.bool,            // the option group is focused
		isSelected: React.PropTypes.bool,           // the option group is selected
		label: React.PropTypes.node,                // the heading to show above the child options
		onFocus: React.PropTypes.func,						 	// provide the onFocus function to highlight if selectGroup
		onSelect: React.PropTypes.func,							// provide the onSelect function to select group if selectGroup
		option: React.PropTypes.object.isRequired,  // object that is base for that option group
		selectGroup: React.PropTypes.bool,				  // option to allow Groups to be selected
	},

	blockEvent (event) {
		event.preventDefault();
		event.stopPropagation();
		if ((event.target.tagName !== 'A') || !('href' in event.target)) {
			return;
		}
		if (event.target.target) {
			window.open(event.target.href, event.target.target);
		} else {
			window.location.href = event.target.href;
		}
	},

	handleMouseDown (event) {
		const { selectGroup } = this.props;
		event.preventDefault();
		event.stopPropagation();
		if (selectGroup) this.props.onSelect(this.props.option, event);
	},

	handleMouseEnter (event) {
		const { selectGroup } = this.props;
		if (selectGroup) this.onFocus(event);
	},

	handleMouseMove (event) {
		const { selectGroup } = this.props;
		if (selectGroup) this.onFocus(event);
	},

	handleTouchEnd(event){
		// Check if the view is being dragged, In this case
		// we don't want to fire the click event (because the user only wants to scroll)
		if(this.dragging) return;

		this.handleMouseDown(event);
	},

	handleTouchMove (event) {
		// Set a flag that the view is being dragged
		this.dragging = true;
	},

	handleTouchStart (event) {
		// Set a flag that the view is not being dragged
		this.dragging = false;
	},

	onFocus (event) {
		if (!this.props.isFocused) {
			this.props.onFocus(this.props.option, event);
		}
	},

	render () {
		var { option, selectGroup, isFocused, isDisabled } = this.props;
		var className = classNames(this.props.className, option.className);

		var groupLabelClassName = classNames({
			'Select-option-group-label':  true,
			'Select-option-group-label-selectable': selectGroup,
			'is-focused': isFocused,
			'is-disabled': isDisabled,
		});

		return option.disabled ? (
			<div className={className}
				onMouseDown={this.blockEvent}
				onClick={this.blockEvent}>
				{this.props.children}
			</div>
		) : (
			<div className={className}
				style={option.style}
				onMouseDown={this.handleMouseDown}

				onTouchStart={this.handleTouchStart}
				onTouchMove={this.handleTouchMove}
				onTouchEnd={this.handleTouchEnd}
				title={option.title}>
				<div
					className={groupLabelClassName}
					onMouseEnter={this.handleMouseEnter}
					onMouseMove={this.handleMouseMove}
				>
					{this.props.label}
				</div>
				{this.props.children}
			</div>
		);
	}
});

module.exports = OptionGroup;
