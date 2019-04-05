import React, { Component } from 'react';
import Button from './Button.jsx';

class App extends Component {
  constructor() {
    super();
    this.handleClick = this.handleClick.bind(this)
  }
handleClick(e) {
    alert("The button was clicked");
  }
render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">GitHub Analytics</h1>
        </header>
        <p className="App-intro">
          Watch this space...
        </p>
        <Button handleClick={this.handleClick}/>
      </div>
    );
  }
}
export default App;
