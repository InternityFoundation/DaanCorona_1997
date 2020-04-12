import React from 'react';
import { Route, Switch, withRouter, Router } from "react-router-dom";
import logo from './logo.svg';
import './App.css';
import Home from './components/Pages/Home/Home';
import Shops from './components/Pages/Shops/Shops';
import Payment from './components/Pages/Payment/Payment';
import Profile from './components/Pages/Profile/profile';

class App extends React.Component {
  render() {
    return (
        <div className="App">
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/payment" exact component={Payment} />
            <Route path="/shops" exact component={Shops} />
            <Route path="/profile" exact component={Profile} />
            <Route path="/" component={Home} />
          </Switch>
        </div>
    )
  }
}

export default withRouter(App);
