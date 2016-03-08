import React from 'react';
import classNames from 'classnames';

const OptionGroup = React.createClass({
	propTypes: {
		children: React.PropTypes.any,
		className: React.PropTypes.string,             // className (based on mouse position)
		label: React.PropTypes.node,                   // the heading to show above the child options
		option: React.PropTypes.object.isRequired,     // object that is base for that option group
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
		event.preventDefault();
		event.stopPropagation();
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

	render () {
		var { option } = this.props;
		var className = classNames(this.props.className, option.className);

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
				onMouseEnter={this.handleMouseEnter}
				onMouseMove={this.handleMouseMove}
				onTouchStart={this.handleTouchStart}
				onTouchMove={this.handleTouchMove}
				onTouchEnd={this.handleTouchEnd}
				title={option.title}>
				<div className="Select-option-group-label">
					{this.props.label}
				</div>
				{this.props.children}
			</div>
		);
	}
});

module.exports = OptionGroup;
