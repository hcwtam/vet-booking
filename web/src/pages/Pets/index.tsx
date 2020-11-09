import React, { ReactElement, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { PetType, userContext } from '../../store/user';

export default function Pets(): ReactElement {
  let history = useHistory();
  const [data] = useContext(userContext);
  const { pets } = data;

  let petsData;

  const pushToPetPage = ({
    id,
    name,
    birthDate = '',
    gender,
    desexed
  }: PetType) => {
    history.push({
      pathname: `/pets/${id}`,
      state: { id, name, birthDate, gender, desexed }
    });
  };

  if (pets)
    petsData = pets.map((pet) => (
      <button key={pet.id} onClick={() => pushToPetPage(pet)}>
        <h2>{pet.name}</h2>
      </button>
    ));

  return (
    <div>
      <h1>Pets</h1>
      {petsData}
    </div>
  );
}
