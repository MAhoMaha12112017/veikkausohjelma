import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Joukkueet from './components/Joukkueet/Joukkueet';
import Navigation from './components/Navigation/Navigation';
import Tulos from './components/Tulos/Tulos';
import Liigat from './components/Liigat/Liigat';
import HomeAway from './components/HomeAway/HomeAway';
import teamList from './components/Joukkueet/joukkuelista.js';


const defaults = {
  id: 0,
  league: teamList[0].league,
  round: 0,
  homeTeam: '',
  awayTeam: '',
  homeGoals: 0,
  awayGoals: 0,
  homexG: 0,
  awayxG: 0,
  homeaway: 'all',
  selectedTeam: '',
  use: 'save'
}

class App extends Component {
  constructor (props) {
    super(props);
    this.state = defaults;
  }

  onChangehomeGoals = (event) => {
    this.setState({homeGoals: Number(event.target.value)})
  }
  onChangeawayGoals = (event) => {
    this.setState({awayGoals: Number(event.target.value)})
  }
  onChangehomexG = (event) => {
    this.setState({homexG: Number(event.target.value)})
  }
  onChangeawayxG = (event) => {
    this.setState({awayxG: Number(event.target.value)})
  }
  onChangeRound = (event) => {
    this.setState({round: Number(event.target.value)})
  }
  onChangeId = (event) => {
    this.setState({id: Number(event.target.value)})
  }
  onHomeTeamChange = (event) => { // todo: yhdistä tämä ja alempi
    this.setState({homeTeam: event.target.value})
  }
  onAwayTeamChange = (event) => { // todo: yhdistä tämä ja alempi
    this.setState({awayTeam: event.target.value})
  }
  onLeagueChange = (event) => {
    this.setState({league: event.target.value});
  }
  onHomeAwayChange = (event) => {
    this.setState({homeaway: event.target.value});
  }
  onSelectedTeamChange = (event) => {
    this.setState({selectedTeam: event.target.value});
  }
  onUseChange = (use) => {
    if (use ==='search') {
      this.setState({
        use,
        homeGoals: 0, // voisko laittaa null / undefined?
        awayGoals: 0,
        homexG: 0,
        awayxG: 0,
        selectedTeam: ''
      });
    } else if (use === 'save') {
      this.setState({use})
    }
  }

  onButtonSave = () => {
    fetch('http://localhost:3001/match', {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(this.state) 
    })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      if (data.id) {
        alert(`Match between ${data.hometeamabbr} and ${data.awayteamabbr} added to database`)
      } else {
        alert(`Match could not be added to database`);
      }
    });
  }

  onButtonSearch = () => {
    const searchBody = {
      id: this.state.id || undefined,
      league: this.state.league || undefined,
      round: this.state.round || undefined,
      team1: this.state.homeTeam || undefined,
      team2: this.state.awayTeam || undefined,
      homeaway: this.state.homeaway || undefined,
      team: this.state.selectedTeam || undefined
    }
    console.log(searchBody);

    fetch('http://localhost:3001/matchsearch', {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(searchBody) 
    })
    .then((res)=> res.json())
    .then((data) => {
      console.log(data);
    })
    .catch((err) => console.log(err));
  }

  onClickReset = () => {
    this.setState(defaults);
  }
  onClickSearchReset = () => {
    this.setState({...defaults, use: 'search'});
  }
  onClickTable = () => {
    console.log('onClickTable');
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Veikkausappi</h1>
        </header>
        <Navigation onUseChange={this.onUseChange} onClickTable={this.onClickTable}/>

        <div>
          <Liigat onLeagueChange={this.onLeagueChange} labeli="League" currentValue={this.state.league}/>
          <Tulos onResultChange={this.onChangeRound} labeli="Round" currentValue={this.state.round} />
        {this.state.use === 'search' 
          ?
            <div>
              <p>Team Pair Data:</p>
              <Joukkueet onTeamChange={this.onHomeTeamChange} labeli="Team 1" league={this.state.league} currentValue={this.state.homeTeam}/>
              <Joukkueet onTeamChange={this.onAwayTeamChange} labeli="Team 2" league={this.state.league} currentValue={this.state.awayTeam}/>
              <hr />
              <Joukkueet onTeamChange={this.onSelectedTeamChange} labeli="Single Team Data" league={this.state.league} currentValue={this.state.selectedTeam}/>
              <HomeAway onHomeAwayChange={this.onHomeAwayChange} labeli="Home / Away" currentValue={this.state.homeaway} />
              <hr />
              <Tulos onResultChange={this.onChangeId} labeli="Id" currentValue={this.state.id} />
              <button onClick={this.onButtonSearch}>Hae</button>
              <button onClick={this.onClickSearchReset} type="button">Tyhjennä</button>
            </div>
          :
            <div>
              <Joukkueet onTeamChange={this.onHomeTeamChange} labeli="Home" league={this.state.league} currentValue={this.state.homeTeam}/>
              <Joukkueet onTeamChange={this.onAwayTeamChange} labeli="Away" league={this.state.league} currentValue={this.state.awayTeam}/>
              <Tulos onResultChange={this.onChangehomeGoals} labeli="Home Goals" currentValue={this.state.homeGoals}/>
              <Tulos onResultChange={this.onChangeawayGoals} labeli="Away Goals" currentValue={this.state.awayGoals}/>
              <Tulos onResultChange={this.onChangehomexG} labeli="Home xG" currentValue={this.state.homexG}/>
              <Tulos onResultChange={this.onChangeawayxG} labeli="Away xG" currentValue={this.state.awayxG}/>
              <button onClick={this.onButtonSave}>Lähetä</button>
              <button onClick={this.onClickReset} type="button">Tyhjennä</button>
            </div>
        } 
        </div>
      </div>
    );
  }
}

export default App;

// TODO:
// yhdistä funktiot?
// lisää liiga - tulisiko olla yksi listaelementti: liiga + joukkue children-tekn?
