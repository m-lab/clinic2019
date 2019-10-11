import React from 'react';
import { IndexRoute, Route } from 'react-router';
import {
    App,
    DemoPage,
  } from './containers';

export default () => (
  /**
   * Please keep routes in alphabetical order
   */
  <Route path="/" component={App}>
    { /* Home (main) route */ }
    <IndexRoute component={DemoPage} />

    
  </Route>
);
