import React, { Component } from 'react';
import './App.css';


class SearchForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: ''};

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    alert('A name was submitted: ' + this.state.value);
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
      'query': '',
      'searchResults': [],
    }

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    const query = event.target.value;
    let searchResults = [];
    if (query.length > 3) {
      searchResults = [
        {'title': 'Harry Potter', 'author': 'JK Rowling', 'description': 'A young wizard...'},
        {'title': 'Harry Potter', 'author': 'JK Rowling', 'description': 'A young wizard...'},
        {'title': 'Harry Potter', 'author': 'JK Rowling', 'description': 'A young wizard...'}
      ]
    }
    this.setState({
      'query': query,
      'searchResults': searchResults,
    })
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
          <SearchForm value={this.state.query} onChange={this.handleChange}/>
        </div>
        <div className="container" style={{marginTop: 15}}>
          {renderedResults}
        </div>
      </div>
    );
  }
}

export default App;
