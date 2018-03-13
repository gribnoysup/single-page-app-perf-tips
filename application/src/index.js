import 'normalize.css';
import './index.css';

import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';

import { createStore } from './store/root';

import { Flex } from './components/common/Flex';

import Header from './components/Header';

import Landing from './components/Landing';
import Catalog from './components/Catalog';
import Cart from './components/Cart';
import Product from './components/Product';

import Footer from './components/Footer';

const App = ({ initialState }) => (
  <Provider store={createStore(initialState)}>
    <Router>
      <React.Fragment>
        <Header />

        <Flex direction="column" wrap="nowrap">
          <Switch>
            <Route path="/" exact component={Landing} />
            <Route path="/catalog" exact component={Catalog} />
            <Route path="/cart" component={Cart} />
            <Route
              path="/product/:id"
              render={({ match }) => <Product objectNumber={match.params.id} />}
            />

            <Route render={() => <Redirect to="/" />} />
          </Switch>

          <Footer />
        </Flex>
      </React.Fragment>
    </Router>
  </Provider>
);

render(<App />, document.querySelector('[data-root="true"]'));
