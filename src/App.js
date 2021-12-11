import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import MainPage from '../src/pages/main';
import GoodsViewPage from '../src/pages/goodsView';
import GoodsManagePage from './pages/goodsManage';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Switch>
          <Route exact path="/" render={() => <MainPage />} />
          <Route exact path="/goods" render={() => <GoodsViewPage />} />
          <Route exact path="/goods/manage" render={() => <GoodsManagePage />} />
        </Switch>
      </div>
    );
  }
}

export default App;
