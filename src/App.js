import React, { Component } from 'react';
import axios from 'axios';
import Form from './Form';
import ProfileDetails from './ProfileDetails';
import SortedList from './SortedList';
import LanguageList from './LanguageList';
import lda from './lda';
import './App.css';
import logo from './git_icon.png';


class App extends Component {
  constructor() {
    super();
    this.state = {
      gitun: 'No username',
      infoclean : '',
      info: '',
      formData: {
        username: '',
      },
      repitems: null,
      staritems: null,
      replanguagecount: {},
      keywords: null
      
}
    this.handleUserFormSubmit = this.handleUserFormSubmit.bind(this);
    this.handleFormChange= this.handleFormChange.bind(this);
  }


handleUserFormSubmit(event) {
    event.preventDefault();
    axios.get('https://api.github.com/users/'+this.state.formData.username)
    .then(response => this.setState({
      gitun: response.data.login,
      infoclean: response.data,
      info : JSON.stringify(response.data, undefined, 2)
    })).catch((err) => { console.log(err); });
axios.get('https://api.github.com/users/'+this.state.formData.username+'/repos')
    .then(response => {
var itemsWithFalseForks = response.data.filter(item => item.fork === false)
var sortedItems = itemsWithFalseForks.sort((b,a) => {
        if((a.watchers_count +  a.forks_count) < (b.forks_count + b.watchers_count)){
          return -1
        }
        else if ((a.watchers_count +  a.forks_count) > (b.forks_count + b.watchers_count)){
          return 1
        }

        else {
          return 0
        }
      })

let dictrlc = Object.assign({}, this.state.replanguagecount);
      for (var i = 0; i < itemsWithFalseForks.length; i++) {
          dictrlc[itemsWithFalseForks[i]['language']] = -~ dictrlc[itemsWithFalseForks[i]['language']]
      }

this.setState({
        repitems: sortedItems.slice(0,10),
        replanguagecount: dictrlc,
      })
}).catch((err) => { console.log(err); })
axios.get('https://api.github.com/users/'+this.state.formData.username+'/starred')
    .then(response => {
var itemsWithFalseForks = response.data.filter(item => item.fork === false)
var sortedItems = itemsWithFalseForks.sort((b,a) => {
        if((a.watchers_count +  a.forks_count) < (b.forks_count + b.watchers_count)){
          return -1
        }else if ((a.watchers_count +  a.forks_count) > (b.forks_count + b.watchers_count)){
          return 1
        }else {
          return 0
        }
      })
var documents = []
      for (var i = 0; i < response.data.length; i++) {
          var descr = response.data[i]['description']
          if (descr != null) {
            var newtext = descr.match(/[^.!?]+[.!?]+/g)
            if (newtext != null) {
              documents = documents.concat(newtext)
            }
          }
      }
      var result = lda(documents, 3, 3);
      var keywords = new Set()
      for (var k = 0; k < 3; k++) {
        for (var j = 0; j < 3; j++) {
          keywords = keywords.add(result[k][j]['term']);
        }
      }
this.setState({
        staritems: sortedItems.slice(0,10),
        keywords: Array.from(keywords).join(', ')
      })
}).catch((err) => { console.log(err); })
};
handleFormChange(event) {
    const obj = this.state.formData;
    obj[event.target.name] = event.target.value;
    this.setState(obj);
  };
render() {
    return (
      <div className="App">
      <div className = "Logo">
        <img src={logo} width="80" height="80" />
    </div>
    
        <header className="App-header">

          <h1 className="App-title">Get that repo</h1>
        </header>
        <p className="App-intro">
          Your favorite Githubbers... a click away
        </p>
        <hr></hr>
        <Form
          formData={this.state.formData}
          handleUserFormSubmit={this.handleUserFormSubmit}
          handleFormChange={this.handleFormChange}
        />
        <hr></hr>
        Profile Details:
        <ProfileDetails infoclean={this.state.infoclean}/>
        <hr></hr>
        Own Repositories:
        <SortedList repitems={this.state.repitems}/>
        <hr></hr>
        Starred Repositories:
        <SortedList repitems={this.state.staritems}/>
        <hr></hr>
        Own Repos Language Count:
        <LanguageList langslist={this.state.replanguagecount}/>
         Keywords:  {this.state.keywords}
      </div>
    );
  }
}

export default App;
