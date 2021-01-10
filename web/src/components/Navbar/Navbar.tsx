import React, { ReactElement, useContext } from 'react';
import styled from 'styled-components';
import { Link, useHistory } from 'react-router-dom';

import { authContext } from '../../store/auth';
import logo from '../../assets/logo.png';
import { useState } from 'react';
import NavbarModal from './NavbarModal';
import { ModalContentType } from '../../types/types';

const Nav = styled.nav`
  background: #fff;
  box-shadow: 0 2px 8px #f0f1f2;
  padding: 0 20px;
  width: 100%;
  height: 64px;
  font-size: 16px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 999;
  a {
    color: rgba(82, 82, 82, 0.85);
    font-weight: 600;
    font-size: 15px;
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
      : 'rgb(245, 245, 245)'};
  color: ${(props: ButtonProps) => (props.bg ? 'rgb(255, 255, 255)' : '')};
  width: 100px;
  height: 40px;
  margin: 0 5px;
  border-radius: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.85;
  cursor: pointer;
  transition: all 0.3s;
  &:hover {
    opacity: 1;
    background-color: ${(props: ButtonProps) =>
      props.bg ? '' : 'rgba(238, 238, 238, 0.85)'};
  }
`;

export default function Navbar(): ReactElement {
  const { push } = useHistory();
  const { token, userType } = useContext(authContext);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalContent, setModalContent] = useState<ModalContentType | null>(
    null
  );

  let navbarWithUser = <></>;
  if (userType)
    navbarWithUser = (
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
          <Button
            bg
            onClick={() => {
              push('/bookings');
            }}
          >
            Book now
          </Button>
          <Link to="/logout">
            <Button>Logout</Button>
          </Link>
        </ButtonsGroup>
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
        <Button
          bg
          onClick={() => {
            setShowModal(true);
            setModalContent('Sign up');
          }}
        >
          Join now
        </Button>

        <Button
          onClick={() => {
            setShowModal(true);
            setModalContent('Login');
          }}
        >
          Login
        </Button>
      </ButtonsGroup>
      <NavbarModal
        showModal={showModal}
        hideModal={() => setShowModal(false)}
        modalTitle={modalContent}
        setModalContent={(content: ModalContentType) =>
          setModalContent(content)
        }
      />
    </Nav>
  );
}
