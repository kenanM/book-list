/* The favourites page renders a list of Books taken from local storage */

import React from 'react';

import { Alert } from './alert.js';
import { Book } from './book.js';

import { getFavouritesList } from './utils.js';


export class FavouritesPage extends React.Component {

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
      return <Book key={favouriteId}
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
