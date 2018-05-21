// React Library
import React, { Component } from 'react';
import Scrollbars from 'react-custom-scrollbars';

// Components
import Homepage from './pages/Homepage';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import './App.css';

class App extends Component {
  render() {
    return (
      <Scrollbars universal style={{height: 100 + 'vh'}}>
        <Router>
          <div className="App">
            <header>
              <h1>News-From</h1>
              <img
                className="news-from-logo"
                src="/assets/images/news-from-logo.png"
                alt="News-From-logo"
              />
            </header>
            <Route exact path="/" component={Homepage} />
          </div>
        </Router>
      </Scrollbars>
    );
  }
}

export default App;
