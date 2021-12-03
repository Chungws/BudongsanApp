import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import MainPage from '../src/pages/main';
import GoodsPage from '../src/pages/goods';
import GoodsCreatePage from '../src/pages/goodsCreate';
import GoodsUpdatePage from '../src/pages/goodsUpdate';
import ClientsPage from '../src/pages/clients';
import ClientsCreatePage from '../src/pages/clientsCreate';
import ClientsUpdatePage from '../src/pages/clientsUpdate';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Switch>
          <Route exact path="/" render={() => <MainPage />} />
          <Route exact path="/goods" render={() => <GoodsPage />} />
          <Route exact path="/goods/create" render={() => <GoodsCreatePage />} />
          <Route exact path="/goods/update" render={() => <GoodsUpdatePage />} />
          <Route exact path="/clients" render={() => <ClientsPage />} />
          <Route exact path="/clients/create" render={() => <ClientsCreatePage />} />
          <Route exact path="/clients/update" render={() => <ClientsUpdatePage />} />
        </Switch>
      </div>
    );
  }
}

export default App;
