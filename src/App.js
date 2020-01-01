import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink
} from "react-router-dom";
import './App.css';


function removeFromArray(array, value) {
  const index = array.indexOf(value);
  if (index > -1) {
    array.splice(index, 1);
  }
  return array;
}

function getFavouritesList() {
  const favourites = window.localStorage.getItem('favourites') || '[]';
  return JSON.parse(favourites);
}

function saveFavouritesList(anArray) {
  let asString = JSON.stringify(anArray);
  window.localStorage.setItem('favourites', asString);
}


class SearchForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: ''};

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    // Just ignore submits
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input type="text" value={this.props.value} onChange={this.props.onChange} />
      </form>
    );
  }
}

function Alert(props) {
  if (!props.message) {
    // If there is no message there should be no alert
    return null
  }
  return (
    <div className={"alert alert-" + (props.type || 'primary')} role="alert">
      {props.message}
    </div>
  )
}

class SearchResult extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      'favourite': window.localStorage.getItem(props.id),
    }

    this.addToFavourites = this.addToFavourites.bind(this);
    this.removeFromFavourites = this.removeFromFavourites.bind(this);
  }

  addToFavourites(event) {
    event.preventDefault()
    // Add SearchResult's ID to a list of "favourites"
    let favourites = getFavouritesList()
    favourites.push(this.props.id);
    saveFavouritesList(favourites);
    // Store a copy of the props using this objects ID as a key in localStorage
    window.localStorage.setItem(this.props.id, JSON.stringify(this.props));

    this.setState({'favourite': true});
  }

  removeFromFavourites(event) {
    event.preventDefault()
    // Remove this SearchResult's ID from the list of "favourites"
    let favourites = getFavouritesList();
    favourites = removeFromArray(favourites, this.props.id);
    saveFavouritesList(favourites);
    // Remove the details about this search result from localStorage
    window.localStorage.removeItem(this.props.id);

    this.setState({'favourite': false});

    // The Favourites page specifies a callback to update the page when something is removed
    if (this.props.onRemoveFromFavourites) {
      this.props.onRemoveFromFavourites();
    }
  }

  render() {
    return (
      <div className="card border-dark mb-3">
        <div className="card-body">
          <div className="card-title"> <h3> {this.props.title} </h3></div>
          <div className="card-subtitle"> {this.props.author} </div>
          <p className="card-text">{this.props.description}</p>
          <a className="card-link float-right"
             href="#"
             onClick={this.state.favourite ? this.removeFromFavourites : this.addToFavourites}>
            {this.state.favourite ? "🗑 Remove from Favourites" : "⭐ Add to Favourites" }
          </a>
        </div>
      </div>
    )
  }
}

class SearchPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      'query': '',
      'searchResults': [],
      'message': '',
    }

    this.handleChange = this.handleChange.bind(this);
  }

  queryGoogle(query){
    fetch("https://www.googleapis.com/books/v1/volumes?q=title:" + query)
      .then(res => res.json())
      .then(
        (result) => {
          let searchResults = []
          let message = ''
          let messageColor = ''
          if (result.error){
            console.log(result.error);
            message = result.error.message;
            messageColor = 'warning';
          } else if (result.totalItems === 0){
            message = 'No Results Found';
            messageColor = 'danger';
          } else {
            message = 'Found ' + result.totalItems + ' results.'
            messageColor = 'primary';
            console.log(result.items);
            console.log(result);
            searchResults = result.items;
          }

          this.setState({
            'searchResults': searchResults,
            'message': message,
            'messageColor': messageColor,
          });
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        // (error) => {
        //   this.setState({
        //     isLoaded: true,
        //     error
        //   });
        // }
      )
  }

  handleChange(event) {
    const query = event.target.value;
    let message = '';
    if (query.length > 3) {
      this.queryGoogle(query);
      message = 'Loading...';
    }
    this.setState({
      'query': query,
      'message': message,
      'searchResults': [],
    })
  }

  render() {
    const searchResults = this.state.searchResults;
    const renderedResults = searchResults.map((result, index) => {
      return (
        <SearchResult key={index}
                      title={result.volumeInfo.title}
                      author={result.volumeInfo.authors}
                      description={result.volumeInfo.description}
                      id={result.id}  // This is just an arbitrary ID that Google provide
        />
      )
    });
    return (
      <div>
        <SearchForm value={this.state.query} onChange={this.handleChange}/>
        <br></br>
        <Alert message={this.state.message} type={this.state.messageColor} />
        {renderedResults}
      </div>
    );
  }
}


class FavouritesPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      'favourites': getFavouritesList()
    }

    this.refreshFavouritesList = this.refreshFavouritesList.bind(this);
  }

  refreshFavouritesList() {
    this.setState({'favourites': getFavouritesList()});
  }

  render() {
    const favourites = this.state.favourites.map((favouriteId, index) => {
      const fromLocalStorage = JSON.parse(window.localStorage.getItem(favouriteId));
      if (!fromLocalStorage) {
        return <Alert key={favouriteId} message={'Unable to load Book from LocalStorage'} type='danger' />
      }
      return <SearchResult key={favouriteId}
                           title={fromLocalStorage.title}
                           author={fromLocalStorage.author}
                           description={fromLocalStorage.description}
                           onRemoveFromFavourites={this.refreshFavouritesList}
                           id={favouriteId} />
    });
    if (favourites.length > 0) {
      return <div> {favourites} </div>
    } else {
      return <Alert message='No Books have been added to your favourites list. Try searching for one to add!' />
    }
  }
}


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
