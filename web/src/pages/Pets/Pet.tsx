import React, { ReactElement, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { PetType } from '../../store/user';

export default function Pets(): ReactElement {
  const location = useLocation();
  const history = useHistory();

  const { state } = location;
  const { id, name, birthDate = '', gender, desexed } = state as PetType;

  useEffect(() => {
    if (!state) history.push('/pets');
  }, [history, state]);

  return (
    <div>
      <h1>{name}</h1>
      <ul>
        <li>id: {id}</li>
        <li>name: {name}</li>
        {birthDate ? <li>birthDate: {birthDate}</li> : null}
        <li>gender: {gender}</li>
        <li>desexed: {desexed ? 'yes' : 'no'}</li>
      </ul>
    </div>
  );
}
