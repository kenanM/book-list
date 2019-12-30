import React, { Component } from 'react';
import './App.css';


function SearchResult(props) {
  return (
    <div className="card border-dark mb-3">
      <div className="card-body">
        <div className="card-title"> <h3> {props.title} </h3></div>
        <div className="card-subtitle"> {props.author} </div>
        <p className="card-text">{props.description}</p>
      </div>
    </div>
  )
}


class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      'query': 'Harry Potter',
      'searchResults': [
        {'title': 'Harry Potter', 'author': 'JK Rowling', 'description': 'A young wizard...'},
        {'title': 'Harry Potter', 'author': 'JK Rowling', 'description': 'A young wizard...'},
        {'title': 'Harry Potter', 'author': 'JK Rowling', 'description': 'A young wizard...'}
      ],
    }
  }

  render() {
    const searchResults = this.state.searchResults;
    const renderedResults = searchResults.map((result, index) => {
      return (
        <SearchResult key={index} 
                      title={result.title}
                      author={result.author}
                      description={result.description}
        />
      )
    });
    return (
      <div className="App">
        <div className="App-header">
          <h2>Book List</h2>
          <input type="text" />
        </div>
        <div class="container" style={{marginTop: 15}}>
          {renderedResults}
        </div>
      </div>
    );
  }
}

export default App;
