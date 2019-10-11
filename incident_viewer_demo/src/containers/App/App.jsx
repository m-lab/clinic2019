import React, { PureComponent, PropTypes } from 'react';

import { connect } from 'react-redux';
import Helmet from 'react-helmet';

import config from '../../config';

console.log(config);

import '../../assets/base.scss';

function mapStateToProps() {
  return {
  };
}

class App extends PureComponent {
  static propTypes = {
    children: PropTypes.object.isRequired,
    dispatch: React.PropTypes.func,
    info: PropTypes.object,
  };

  static contextTypes = {
    store: PropTypes.object.isRequired,
  };

  render() {
    return (
      <div>
        <Helmet {...config.app.head} />
        <div className="container">
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(App);
