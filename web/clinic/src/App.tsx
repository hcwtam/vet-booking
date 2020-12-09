import React, { useContext } from 'react';
import { Switch, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Logout from './pages/Logout';
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
          <Route path="/profile" component={Profile} />
          <Route path="/settings" component={Settings} />
          <Route path="/logout" component={Logout} />
          <Route path="/" component={Home} />
        </Switch>
      </>
    </UserProvider>
  ) : (
    <>
      <Navbar />
      <Switch>
        <Route path="/signup" component={Signup} />
        <Route path="/login" component={Login} />
        <Route path="/" component={Home} />
      </Switch>
    </>
  );
}

export default App;
