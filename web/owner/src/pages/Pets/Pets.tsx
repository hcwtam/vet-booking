import React, { ReactElement, useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import AddPet from '../../components/Pets/AddPet';
import { userContext } from '../../store/user';

export default function Pets(): ReactElement {
  let history = useHistory();
  const [{ pets }, { petsMutate }] = useContext(userContext);
  const [showAddPet, setShowAddPet] = useState<boolean>(false);

  let petsData;

  if (pets)
    petsData = pets.map(({ id, name }) => (
      <button key={id} onClick={() => history.push(`/pets/${id}`)}>
        <h2>{name}</h2>
      </button>
    ));

  return (
    <div>
      <h1>Pets</h1>
      {petsData}
      <br />
      <button onClick={() => setShowAddPet(true)}>Add pet</button>
      {showAddPet ? <AddPet petsMutate={petsMutate} /> : null}
    </div>
  );
}
