import React, { Component } from 'react';
import './App.css';


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
          <Alert message={this.state.message} type={this.state.messageColor} />
          {renderedResults}
        </div>
      </div>
    );
  }
}

export default App;
