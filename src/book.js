/* The book is shared accross all of the pages and displays information about a book inside a bootstrap "card" */

import React from 'react';

import {
  getFavouritesList,
  saveFavouritesList,
  removeFromArray
} from './utils.js';


export class Book extends React.Component {
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
