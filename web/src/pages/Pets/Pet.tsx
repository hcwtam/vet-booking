import React, { ReactElement, useContext, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { userContext } from '../../store/user';
import Change from '../../components/Pets/Change';
import Delete from '../../components/Pets/Delete';
import { PetType } from '../../types/types';
import Content from '../../components/UI/Content';
import styled from 'styled-components';
import { switchIcon } from '../../utils/user';
import { Button, Descriptions } from 'antd';

const ResponsiveContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;

const AvatarBox = styled.div`
  width: 200px;
  text-align: center;
  padding: 20px;

  @media (max-width: 700px) {
    width: 100%;
  }
`;

const Info = styled.div`
  min-width: 60px;
`;

const ButtonGroup = styled.div`
  margin-top: 40px;
`;

const getPetDataById = (petsData: PetType[], id: string) => {
  if (isNaN(+id)) return null;
  return petsData.find((petData) => petData.id === +id);
};

export default function Pets(): ReactElement {
  const history = useHistory();
  const { id } = useParams<{ id: string }>();
  const [{ pets }, { petsMutate }] = useContext(userContext);
  const [petExist, setPetExist] = useState<boolean>(true);
  const [petData, setPetData] = useState<PetType>();
  const [showForm, setShowForm] = useState<boolean>(false);
  const [, setShowDeleteOption] = useState<boolean>(false);
  const [, setShowModal] = useState<boolean>(false);

  const { Item } = Descriptions;

  useEffect(() => {
    if (!petExist) history.push('/pets');
  }, [petExist, history]);

  useEffect(() => {
    if (pets.length) {
      let data = getPetDataById(pets, id);
      if (data) setPetData(data);
      else setPetExist(false);
    }
  }, [petExist, petData, id, pets]);

  return petData ? (
    <Content>
      <ResponsiveContainer>
        <AvatarBox>
          <h1>{petData.name || ''}</h1>
          {switchIcon(petData.animalType)}
        </AvatarBox>
        <Descriptions title="Pet Details" bordered>
          <Item label="Name">
            {' '}
            <Info>{petData.name}</Info>
          </Item>
          <Item label="Pet type">
            <Info>{petData.animalType}</Info>
          </Item>
          {petData.birthDate ? (
            <Item>
              <Info>{petData.birthDate}</Info>
            </Item>
          ) : null}
          <Item label="Gender">
            <Info>{petData.gender}</Info>
          </Item>
          <Item label="Desexed">
            <Info>{petData.desexed ? 'yes' : 'no'}</Info>
          </Item>
          <Item label="Illnesses">
            <Info>
              {petData.illnesses.length
                ? petData.illnesses.map((illness) => (
                    <span key={illness}>{`| ${illness} |`}</span>
                  ))
                : 'none'}
            </Info>
          </Item>
        </Descriptions>
      </ResponsiveContainer>
      <ButtonGroup>
        <Button
          size="large"
          style={{ marginRight: 10 }}
          onClick={() => setShowForm(true)}
        >
          Change Pet Info
        </Button>
        <Delete
          hide={() => setShowDeleteOption(false)}
          id={id}
          petsMutate={petsMutate}
          onCloseModal={() => setShowModal(false)}
        >
          <Button
            size="large"
            style={{ marginRight: 10 }}
            onClick={() => setShowDeleteOption(true)}
          >
            Delete this pet
          </Button>
        </Delete>
      </ButtonGroup>
      <Change
        name={petData.name}
        id={id}
        petsMutate={petsMutate}
        isVisible={showForm}
        onCloseModal={() => setShowForm(false)}
      />
    </Content>
  ) : (
    <></>
  );
}
