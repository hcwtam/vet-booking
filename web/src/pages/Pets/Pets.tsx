import { PlusOutlined } from '@ant-design/icons';
import React, { ReactElement, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import Content from '../../components/UI/Content';
import { userContext } from '../../store/user';
import { switchIcon } from '../../utils/user';

const PetCardsContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  width: 100%;
  margin: 20px 2px 2px;
  border-radius: 5px;
  background-color: #efefef;
  box-shadow: 0 0 8px #ccc;
  padding: 0 0 50px;
`;

const PetCard = styled.div`
  width: 95%;
  max-width: 150px;
  height: 200px;
  margin: 20px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  background-color: white;
  border-radius: 5px;
  box-shadow: 0 0 8px #ccc;
  color: #444;
  transition: 0.1s;
  padding: 30px 0 10px;
  &:hover {
    transform: scale(1.05);
    color: #ff7a22;
    box-shadow: 0 0 8px #ff6600;
  }
`;

const Title = styled.div`
  width: 100%;
  border-bottom: 1px solid #ccc;
  padding: 20px;
`;

export default function Pets(): ReactElement {
  let history = useHistory();
  const [{ pets }] = useContext(userContext);

  let petsData;

  if (pets)
    petsData = pets.map(({ id, name, animalType }) => (
      <PetCard onClick={() => history.push(`/pets/${id}`)} key={id}>
        {switchIcon(animalType)}
        <h2 style={{ margin: 0 }}>{name}</h2>
      </PetCard>
    ));

  return (
    <Content>
      <h1 style={{ margin: '0 10px ' }}>Pets</h1>
      <PetCardsContainer>
        <Title>
          <h2 style={{ marginBottom: 0, fontSize: '1.2rem', fontWeight: 600 }}>
            Select to view profile
          </h2>
        </Title>{' '}
        {petsData}
        <PetCard onClick={() => history.push(`/newpet`)}>
          <PlusOutlined style={{ fontSize: '3rem' }} />
          <h2 style={{ margin: 0 }}>Add pet</h2>
        </PetCard>
      </PetCardsContainer>
    </Content>
  );
}
