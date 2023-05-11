import React from 'react';
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom';
import ReactDOM from 'react-dom';
import App from './App';
import Callback from './Callback';
import { AppProvider } from './AppContext';

ReactDOM.render(
  <React.StrictMode>
    <AppProvider>
      <Router>
        <Switch>
          <Route exact path="/" component={App} />
          <Route path="/callback" component={Callback} />
        </Switch>
      </Router>
    </AppProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
