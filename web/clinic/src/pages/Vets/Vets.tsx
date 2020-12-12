import React, { ReactElement, useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import AddVet from '../../components/Vets/AddVet';
import { userContext } from '../../store/user';

export default function Vets(): ReactElement {
  let history = useHistory();
  const [{ vets }, { vetsMutate }] = useContext(userContext);
  const [showAddVet, setShowAddVet] = useState<boolean>(false);

  let vetsData;

  if (vets)
    vetsData = vets.map(({ id, firstName }) => (
      <button key={id} onClick={() => history.push(`/vets/${id}`)}>
        <h2>{firstName}</h2>
      </button>
    ));

  return (
    <div>
      <h1>Vets</h1>
      {vetsData}
      <br />
      <button onClick={() => setShowAddVet(true)}>Add vet</button>
      {showAddVet ? <AddVet vetsMutate={vetsMutate} /> : null}
    </div>
  );
}
