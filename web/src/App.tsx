import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';

function App() {
  return (
    <>
      <Navbar />
      <Switch>
        <Route path="/signup">
          <Signup />
        </Route>
        <Route path="/login">
          <Login />
        </Route>
        <Route exact path="/">
          <Home />
        </Route>
        <Redirect to="/" />
      </Switch>
    </>
  );
}

export default App;
