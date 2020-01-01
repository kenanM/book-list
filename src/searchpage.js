/* The Search Page displays a text input that lets you query Google Books API displaying and displays the search results. */

import React from 'react';

import { Book } from './book.js';
import { Alert } from './alert.js';


class SearchForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: ''};
  }

  render() {
    return (
      <div className="row">
        <div className="col-lg-12">
          <input type="text" placeholder="Search for books by title" value={this.props.value} onChange={this.props.onChange} className="form-control input-lg"/>
        </div>
      </div>
    );
  }
}

export class SearchPage extends React.Component {

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
        <Book key={index}
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
