import React, { useContext } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Logout from './pages/Logout';
import Pets from './pages/Pets/index';
import Pet from './pages/Pets/Pet';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Signup from './pages/Signup';
import { authContext } from './store/auth';
import { UserProvider } from './store/user';

function App() {
  const { token } = useContext(authContext);
  return token ? (
    <UserProvider>
      <>
        <Navbar />
        <Switch>
          <Route path="/profile">
            <Profile />
          </Route>
          <Route exact path="/pets">
            <Pets />
          </Route>
          <Route path={'/pets/:id'}>
            <Pet />
          </Route>
          <Route path="/settings">
            <Settings />
          </Route>
          <Route path="/logout">
            <Logout />
          </Route>
          <Route exact path="/">
            <Home />
          </Route>
          <Redirect to="/" />
        </Switch>
      </>
    </UserProvider>
  ) : (
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
