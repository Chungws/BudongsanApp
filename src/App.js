import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import MainPage from '../src/pages/main';
import GoodsViewPage from '../src/pages/goodsView';
import GoodsCreatePage from '../src/pages/goodsCreate';
import GoodsUpdatePage from '../src/pages/goodsUpdate';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Switch>
          <Route exact path="/" render={() => <MainPage />} />
          <Route exact path="/goods" render={() => <GoodsViewPage />} />
          <Route exact path="/goods/create" render={() => <GoodsCreatePage />} />
          <Route exact path="/goods/update" render={() => <GoodsUpdatePage />} />
        </Switch>
      </div>
    );
  }
}

export default App;
