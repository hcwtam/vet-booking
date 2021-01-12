import React, { useContext } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home';
import Logout from './pages/Logout';
import Pets from './pages/Pets/Pets';
import Pet from './pages/Pets/Pet';
import Profile from './pages/Profile';
import { authContext } from './store/auth';
import { UserProvider } from './store/user';
import Vet from './pages/Vets/Vet';
import Vets from './pages/Vets/Vets';
import OwnerSettings from './pages/OwnerSettings';
import ClinicSettings from './pages/ClinicSettings';
import Bookings from './pages/Bookings/Bookings';
import Booking from './pages/Bookings/Booking';
import styled from 'styled-components';
import Footer from './components/Footer';
import Search from './pages/Search';
import Detail from './pages/Detail';
import ContinueRegister from './pages/ContinueRegister';
import Sidebar from './components/Sidebar/Sidebar';
import NewPet from './pages/Pets/NewPet';

const Main = styled.div`
  width: 100%;
`;

const Content = styled.div`
  width: 100%;
  min-height: calc(100vh - 164px);
  display: flex;
`;

const Page = styled.div`
  padding: 0px 40px;
  width: 100%;
  background-color: #efefef;
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
        <Route exact path="/newpet" component={NewPet} />
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
        <Content>
          <Sidebar />
          <Page>
            <Switch>{appWithUser}</Switch>
          </Page>
        </Content>
        <Footer />
      </Main>
    </UserProvider>
  ) : (
    <Main>
      <Navbar />
      <Switch>
        <Route path="/search" component={Search} />
        <Route path="/detail" component={Detail} />
        <Route path="/continue" component={ContinueRegister} />
        <Route path="/" component={Home} />
      </Switch>
      <Footer />
    </Main>
  );
}

export default App;
