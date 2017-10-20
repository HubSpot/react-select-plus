import React from 'react';
import PropTypes from 'prop-types';

class Dropdown extends React.Component {
  render () {
    // This component adds no markup
    return this.props.children;
  }
};

Dropdown.propTypes = {
  children: PropTypes.node,
};

export default Dropdown;
