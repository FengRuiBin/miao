import './App.css';
import { Switch, Route, HashRouter, Redirect } from 'react-router-dom'
import Login from './components/Login'
import Register from './components/Register'
import Main from './components/Main'
import CreateVote from './components/CreateVote'
import ViewVote from './components/ViewVote'

function App() {
  return (
    <HashRouter>
      <div className="App">
        <Switch>
          <Route path="/" exact>
            <Redirect to="/main" />
          </Route>
          <Route path="/main" component={Main} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/view-vote/:voteId" component={ViewVote} />
          <Route path="/create-vote" component={CreateVote} />
        </Switch>
      </div>
    </HashRouter>
  );
}

export default App;
