import React, { ReactElement, useState } from 'react';
import { Menu, Dropdown, DatePicker, Tooltip, Button } from 'antd';
import moment from 'moment';
import { SearchOutlined } from '@ant-design/icons';
import 'react-datepicker/dist/react-datepicker.css';
import styled from 'styled-components';

import backgroundImage from '../../assets/background.jpg';
import { useHistory } from 'react-router';

// styles
const Main = styled.main`
  width: 100%;
  height: 575px;
  @media (min-width: 1400px) {
    height: 625px;
  }
`;

const Background = styled.div`
  width: 100%;
  height: 600px;
  position: absolute;
  top: 50px;
  left: 0;
  z-index: -1;

  @media (min-width: 1400px) {
    height: 650px;
  }
  img {
    height: 100%;
    width: 100%;
    object-fit: cover;
    object-position: 50% 75%;
  }
`;

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SearchBar = styled.div`
  background-color: #f7f7f7;
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.2);
  margin-top: 100px;
  height: 70px;
  width: 90%;
  max-width: 850px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 35px;
  @media (max-width: 500px) {
    flex-direction: column;
    height: 140px;
    margin-top: 50px;
  }
`;

type SeachBarButtonProps = {
  petChosen?: boolean;
};

const SearchBarButton = styled.div`
  position: relative;
  padding: 0 20px 0 40px;
  background-color: rgba(0, 0, 0, 0);
  color: ${(props: SeachBarButtonProps) =>
    props.petChosen ? '#000000' : '#969696'};
  border: none;
  font-size: 1rem;
  width: 50%;
  height: 100%;
  border-radius: 35px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .ant-picker {
    width: 100%;
    input::placeholder {
      color: #969696;
    }
  }
  @media (max-width: 500px) {
    width: 100%;
  }

  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }

  &.active {
    background-color: white;
  }

  input {
    caret-color: transparent;
    font-size: 1rem;
  }

  .ant-picker-clear {
    border-radius: 50%;
  }
`;

type SeperationProps = {
  show?: boolean;
};

const Seperation = styled.div`
  border-right: 2px solid rgb(221, 221, 221);
  opacity: ${(props: SeperationProps) => (props.show ? 1 : 0)};
  display: block;
  width: 2px;
  height: 30px;
  @media (max-width: 500px) {
    width: 80%;
    height: 1px;
    border-top: 2px solid rgb(221, 221, 221);
  }
`;

const Slogan = styled.h1`
  margin: 170px 0 0 50px;
  color: #ffffff;
  font-weight: bolder;
  font-size: 1.4rem;
  width: 350px;
  line-height: 1.2;
  strong {
    font-size: 4.25rem;
  }

  @media (max-width: 1000px) {
    margin: 40px 0 0 50px;
  }
  @media (max-width: 500px) {
    text-align: center;
    margin: 30px auto;
    font-size: 1.2rem;
    strong {
      font-size: 3.5rem;
    }
  }
`;

// helpers
function disabledDate(current: any) {
  // Can not select days before today and today
  return current && current <= moment().endOf('day');
}

const disabledMins: number[] = [];
for (let i = 0; i < 60; i++) {
  if (i !== 0 && i !== 15 && i !== 30 && i !== 45) disabledMins.push(i);
}

const disabledSecs: number[] = [];
for (let i = 0; i < 60; i++) {
  disabledSecs.push(i);
}

function disabledDateTime() {
  return {
    disabledMinutes: () => disabledMins,
    disabledSeconds: () => disabledSecs
  };
}

export default function GuestBooking(): ReactElement {
  const [datetime, setDatetime] = useState<Date | null>(null);
  const [chosenPetType, setChosenPetType] = useState<string | null>(null);
  const [showSeperation, setShowSeperation] = useState<boolean>(true);
  let history = useHistory();

  const handleDateChange = (date: Date) => {
    setDatetime(date);
  };

  const searchVets = () => {
    //TODO search vets
    history.push(
      `/search?datetime=${datetime?.getTime()}&animalType=${chosenPetType}`
    );
  };

  const petTypes = ['dog', 'cat', 'rabbit', 'turtle'].map((petType, index) => (
    <React.Fragment key={petType}>
      {index === 0 ? null : <Menu.Divider />}
      <Menu.Item
        onClick={() => setChosenPetType(petType)}
        style={{
          padding: '10px 30px',
          display: 'flex',
          alignItems: 'center',
          fontSize: 11
        }}
      >
        <h2>{petType[0].toUpperCase() + petType.slice(1)}</h2>
      </Menu.Item>
    </React.Fragment>
  ));

  const menu = (
    <Menu style={{ borderRadius: 20, padding: '20px 0' }}>{petTypes}</Menu>
  );

  return (
    <Main>
      <Background>
        <img src={backgroundImage} alt="background" />
      </Background>
      <Container>
        <SearchBar>
          <Dropdown overlay={menu} trigger={['click']}>
            <SearchBarButton
              onMouseEnter={() => setShowSeperation(false)}
              onMouseLeave={() => setShowSeperation(true)}
              petChosen={typeof chosenPetType == 'string'}
            >
              {chosenPetType
                ? chosenPetType[0].toUpperCase() + chosenPetType.slice(1)
                : 'Select pet type'}
            </SearchBarButton>
          </Dropdown>
          <Seperation show={showSeperation} />
          <SearchBarButton
            onClick={(e) => e.preventDefault()}
            onMouseEnter={() => setShowSeperation(false)}
            onMouseLeave={() => setShowSeperation(true)}
          >
            <DatePicker
              bordered={false}
              disabledDate={disabledDate}
              disabledTime={disabledDateTime}
              showTime={{ defaultValue: moment('09:00:00', 'HH:mm:ss') }}
              showNow={false}
              showSecond={false}
              minuteStep={15}
              format={'YYYY-MM-DD h:mm a'}
              onChange={(moment) => {
                if (moment) {
                  handleDateChange(moment.toDate() as Date);
                }
              }}
            />
            <Tooltip title="search">
              <Button
                shape="circle"
                icon={<SearchOutlined />}
                disabled={!chosenPetType || !datetime}
                onClick={searchVets}
              />
            </Tooltip>
          </SearchBarButton>
        </SearchBar>
      </Container>
      <Slogan>
        Book your pet's appointment <strong>with ease</strong>
      </Slogan>
    </Main>
  );
}
