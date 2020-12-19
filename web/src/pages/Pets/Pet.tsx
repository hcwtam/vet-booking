import React, { ReactElement, useContext, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { userContext } from '../../store/user';
import Change from '../../components/Pets/Change';
import Delete from '../../components/Pets/Delete';
import { PetType } from '../../types/types';

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
  const [showDeleteOption, setShowDeleteOption] = useState<boolean>(false);

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
    <div>
      <h1>{petData.name}</h1>
      <ul>
        <li>id: {petData.id}</li>
        <li>name: {petData.name}</li>
        <li>animal type: {petData.animalType}</li>
        {petData.birthDate ? <li>birthDate: {petData.birthDate}</li> : null}
        <li>gender: {petData.gender}</li>
        <li>desexed: {petData.desexed ? 'yes' : 'no'}</li>
        <li>
          illnesses:
          {petData.illnesses.length
            ? petData.illnesses.map((illness) => (
                <span key={illness}>{`| ${illness} |`}</span>
              ))
            : 'none'}
        </li>
      </ul>
      <button onClick={() => setShowForm(true)}>Change Pet Detail</button>
      {showForm ? (
        <Change name={petData.name} id={id} petsMutate={petsMutate} />
      ) : null}
      <br />
      <button onClick={() => setShowDeleteOption(true)}>Delete this pet</button>
      {showDeleteOption ? (
        <Delete
          hide={() => setShowDeleteOption(false)}
          id={id}
          petsMutate={petsMutate}
        />
      ) : null}
    </div>
  ) : (
    <></>
  );
}
