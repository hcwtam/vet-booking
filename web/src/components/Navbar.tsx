import React, { ReactElement, useContext } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import { authContext } from '../store/auth';
import logo from '../assets/logo.png';

const Nav = styled.nav`
  background: linear-gradient(
    180deg,
    rgb(255, 255, 255) 70%,
    rgba(255, 255, 255, 0) 100%
  );
  padding: 0 50px;
  width: 100%;
  height: 75px;
  font-size: 16px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  a {
    color: rgba(82, 82, 82, 0.85);
    font-weight: 600;
    font-size: 15px;
    padding-bottom: 10px;
  }
  a:hover {
    color: rgba(0, 0, 0, 0.85);
  }
  @media (max-width: 500px) {
    padding: 0;
  }
`;

const Logo = styled.div`
  width: 50px;
  img {
    height: 100%;
    width: 100%;
    object-fit: cover;
  }
`;

const Name = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 5px;

  div {
    font-size: 1.2rem;
    font-weight: bold;
    margin-left: 10px;
    background: linear-gradient(10deg, #ff6661 10% 30%, #ff9b61 50% 100%);
    background-clip: border-box;
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

const ButtonsGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

type ButtonProps = { bg?: boolean };

const Button = styled.div`
  background: ${(props: ButtonProps) =>
    props.bg
      ? 'linear-gradient(10deg, #ffa55b 10% 30%, #ff895b 50% 100%)'
      : 'transparent'};
  color: ${(props: ButtonProps) => (props.bg ? 'rgb(255, 255, 255)' : '')};
  width: 100px;
  height: 40px;
  margin: 0 5px;
  border-radius: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.85;
  transition: all 0.3s;
  &:hover {
    opacity: 1;
    background-color: ${(props: ButtonProps) =>
      props.bg ? '' : 'rgba(238, 238, 238, 0.85)'};
  }
`;

export default function Navbar(): ReactElement {
  const { token, userType } = useContext(authContext);

  let navbarWithUser = <></>;
  if (userType === 'owner')
    navbarWithUser = (
      <Nav>
        <Link to="/">Home</Link>
        <Link to="/bookings">Booking</Link>
        <Link to="/profile">Profile</Link>
        <Link to="/pets">Pets</Link>
        <Link to="/settings">Settings</Link>
        <Link to="/logout">Logout</Link>
      </Nav>
    );
  if (userType === 'clinic')
    navbarWithUser = (
      <Nav>
        <Link to="/">Home</Link>
        <Link to="/profile">Profile</Link>
        <Link to="/vets">Vets</Link>
        <Link to="/settings">Settings</Link>
        <Link to="/logout">Logout</Link>
      </Nav>
    );

  return token ? (
    navbarWithUser
  ) : (
    <Nav>
      <Link to="/">
        <Name>
          <Logo>
            <img src={logo} alt="logo" />
          </Logo>
          <div>YouVet</div>
        </Name>
      </Link>
      <ButtonsGroup>
        <Link to="/signup">
          <Button bg>Join now</Button>
        </Link>
        <Link to="/login">
          <Button>Login</Button>
        </Link>
      </ButtonsGroup>
    </Nav>
  );
}
