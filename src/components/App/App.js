import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';
import { Theme } from './Theme';

import { getComponents } from '../../actions/atomic';
import { getDocs } from '../../actions/docs';
import { setBaseURL } from '../../actions/navigation';

import Sidebar from '../Sidebar/Sidebar';
import Toolbar from '../Toolbar/Toolbar';
import SingleStyleguide from '../../views/Single/SingleStyleguide';
import SingleFull from '../../views/Single/SingleFull';
import SinglePage from '../../views/Single/SinglePage';
import Doc from '../../views/Doc/Doc';
import Colors from '../../views/Colors/Colors';
import Icons from '../../views/Icons/Icons';

import './App.css';

class App extends Component {
  constructor() {
    super();

    this.state = {
      components: {
        atoms: [],
        molecules: [],
        organisms: [],
        pages: [],
      },
      docs: {},
    };
  }

  componentWillMount() {
    // Start init actions
    this.props.setBaseURL(this.props.location.pathname);
    this.props.getComponents();
    this.props.getDocs();
  }

  componentDidMount() {
    // Send a ToolboxReady event when App is mounted and on each page change
    this.updateHook();
    this.props.history.listen(() => this.updateHook());
  }

  updateHook() {
    setTimeout(() => {
      document.dispatchEvent(new Event('ToolboxReady'));
    }, 500);
  }

  render() {
    // Remove styleguide shell from pages and full render of components
    const hasStyleguideShell = !this.props.location.pathname.includes('/pages/') && !this.props.location.pathname.match(/\/full\/?$/);
    const fullHome = window.fullhome || false;
    const hasHomeStyleguideShell = !(fullHome && this.props.location.pathname === '/');

    if (hasStyleguideShell && hasHomeStyleguideShell) {
      return (
        <Theme className="styleguide">
          <div className="tlbx-toolbar-wrapper">
            <Toolbar />
          </div>
          <div className={`tlbx-sidebar-wrapper${this.props.navigation.showMenu ? ' tlbx-sidebar-open' : ''}`}>
            <Sidebar location={this.props.location} />
          </div>
          <div className="tlbx-content-wrapper">
            <div className="tlbx-content">
              {fullHome
                ? '' :
                <Route path="/" exact component={Doc} />
              }
              <Route path="/atoms/:slug" component={SingleStyleguide} />
              <Route path="/molecules/:slug" component={SingleStyleguide} />
              <Route path="/organisms/:slug" component={SingleStyleguide} />
              <Route path="/doc/:slug" component={Doc} />
              <Route path="/colors" component={Colors} />
              <Route path="/icons" component={Icons} />
            </div>
          </div>
        </Theme>
      );
    }

    return (
      <div>
        {fullHome ?
          <Route path="/" exact component={Doc} />
          : ''
        }
        <Route path="/pages/:slug" exact component={SinglePage} />
        <Route path="/:type/:slug/:variant?/full" exact component={SingleFull} />
      </div>
    );
  }
}

App.propTypes = {
  getComponents: PropTypes.func.isRequired,
  getDocs: PropTypes.func.isRequired,
  location: PropTypes.object.isRequired,
  navigation: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  setBaseURL: PropTypes.func.isRequired,
};

function mapState(state) {
  return {
    atomic: state.atomic,
    docs: state.docs,
    navigation: state.navigation,
  };
}

function mapDispatch(dispatch) {
  return bindActionCreators({
    getComponents,
    getDocs,
    setBaseURL,
  }, dispatch);
}

export default connect(mapState, mapDispatch)(App);
