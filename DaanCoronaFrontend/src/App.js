import React from 'react';
import { Route, Switch, withRouter, Router } from "react-router-dom";
import logo from './logo.svg';
import './App.css';
import Home from './components/Pages/Home/Home';
import Shops from './components/Pages/Shops/Shops';
import Payment from './components/Pages/Payment/Payment';

class App extends React.Component {
  render() {
    return (
      // <Router>
        <div className="App">
          {/* <Switch> */}
          <Payment />
            {/* <Route path="/" exact component={Home} /> */}
            {/* <Route path="/" exact component={Home} />
            <Route path="/" exact component={Home} /> */}
          {/* </Switch> */}
        </div>
      // </Router>
    )
  }
}

export default App;
