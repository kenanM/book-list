import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink
} from "react-router-dom";

import { SearchPage } from './searchpage.js';
import { FavouritesPage } from './favouritespage.js';


class App extends Component {
  render() {
    return (
      <Router>
        <nav className="navbar navbar-expand-sm navbar-light bg-light">
          <a className="navbar-brand" href="#">Books</a>
          <div className="navbar-nav">
            <NavLink exact
                           to="/"
                           className="nav-item nav-link"
                           activeClassName="disabled">
                    Search
                  </NavLink>
            <NavLink exact
                     to="/favourites"
                     className="nav-item nav-link"
                     activeClassName="disabled">
              Favourites
            </NavLink>
          </div>
        </nav>
        <div className="container" style={{marginTop: 15}}>
          <Switch>
            <Route path="/favourites">
              <FavouritesPage />
            </Route>
            <Route path="/">
              <SearchPage />
            </Route>
          </Switch>
        </div>
      </Router>
    )
  }
}


export default App;
