import React, { Component } from 'react';

import './Icons.css';
import {SET_COMPONENT_MARKUP} from '../../actions/atomic';

class Icons extends Component {
  constructor() {
    super();

    this.state = {
      icons: window.icons,
    };
  }

  renderIconsTable() {
    const icons = this.state.icons;

    return (
      <div className="tlbx-grid">
        {Object.keys(icons).map((key) => {
          const icon = icons[key];

          return (
            <div className="tlbx-icon-wrapper" key={key} title={key}>
              <svg className="tlbx-icon"><use xlink="http://www.w3.org/1999/xlink" xlinkHref={`#icon-${key}`} /></svg>
              <span>{icon}</span>
            </div>
          );
        })}
      </div>
    );
  }

  render() {
    return (
      <div>
        <h2>Icons</h2>
        <div>
          {this.state.icons ? this.renderIconsTable() : 'No icons to display'}
        </div>
      </div>
    );
  }
}

export default Icons;
