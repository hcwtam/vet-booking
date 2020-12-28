import React, { useContext } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Logout from './pages/Logout';
import Pets from './pages/Pets/Pets';
import Pet from './pages/Pets/Pet';
import Profile from './pages/Profile';
import Signup from './pages/Signup';
import { authContext } from './store/auth';
import { UserProvider } from './store/user';
import Vet from './pages/Vets/Vet';
import Vets from './pages/Vets/Vets';
import OwnerSettings from './pages/OwnerSettings';
import ClinicSettings from './pages/ClinicSettings';
import ClinicSignup from './pages/ClinicSignup';
import Bookings from './pages/Bookings/Bookings';
import Booking from './pages/Bookings/Booking';
import styled from 'styled-components';
import Footer from './components/Footer';

const Main = styled.div`
  width: 100%;
`;

function App() {
  const { token, userType } = useContext(authContext);

  let appWithUser = null;
  if (userType === 'owner')
    appWithUser = (
      <>
        <Route path="/bookings/:id" component={Booking} />
        <Route exact path="/bookings" component={Bookings} />
        <Route path="/profile" component={Profile} />
        <Route path={'/pets/:id'} component={Pet} />
        <Route exact path="/pets" component={Pets} />
        <Route path="/settings" component={OwnerSettings} />
        <Route path="/logout" component={Logout} />
        <Route exact path="/" component={Home} />
        <Redirect to="/" />
      </>
    );
  if (userType === 'clinic')
    appWithUser = (
      <>
        <Route path="/profile" component={Profile} />
        <Route path={'/vets/:id'} component={Vet} />
        <Route exact path="/vets" component={Vets} />
        <Route path="/settings" component={ClinicSettings} />
        <Route path="/logout" component={Logout} />
        <Route exact path="/" component={Home} />
        <Redirect to="/" />
      </>
    );

  return token && userType ? (
    <UserProvider>
      <Main>
        <Navbar />
        <Switch>{appWithUser}</Switch>
        <Footer />
      </Main>
    </UserProvider>
  ) : (
    <Main>
      <Navbar />
      <Switch>
        <Route path="/signup" component={Signup} />
        <Route path="/clinicsignup" component={ClinicSignup} />
        <Route path="/login" component={Login} />
        <Route path="/" component={Home} />
      </Switch>
      <Footer />
    </Main>
  );
}

export default App;
