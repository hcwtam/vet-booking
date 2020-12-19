import React, { ReactElement, useContext, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { userContext } from '../../store/user';
import Change from '../../components/Vets/Change';
import Delete from '../../components/Vets/Delete';
import { VetType } from '../../types/types';

const getVetDataById = (vetsData: VetType[], id: string) => {
  if (isNaN(+id)) return null;
  return vetsData.find((vetData) => vetData.id === +id);
};

export default function Vet(): ReactElement {
  const history = useHistory();
  const { id } = useParams<{ id: string }>();
  const [{ vets }, { vetsMutate }] = useContext(userContext);
  const [vetExist, setVetExist] = useState<boolean>(true);
  const [vetData, setVetData] = useState<VetType>();
  const [showForm, setShowForm] = useState<boolean>(false);
  const [showDeleteOption, setShowDeleteOption] = useState<boolean>(false);

  useEffect(() => {
    if (!vetExist) history.push('/vets');
  }, [vetExist, history]);

  useEffect(() => {
    if (vets.length) {
      let data = getVetDataById(vets, id);
      if (data) setVetData(data);
      else setVetExist(false);
    }
  }, [vetExist, vetData, id, vets]);

  return vetData ? (
    <div>
      <h1>
        {vetData.firstName} {vetData.lastName}
      </h1>
      <ul>
        <li>id: {vetData.id}</li>
        <li>first name: {vetData.firstName}</li>
        <li>last name: {vetData.lastName}</li>
        <li>phone number: {vetData.phone}</li>
        <li>
          specialties:
          {vetData.specialties?.length
            ? vetData.specialties.map((specialty) => (
                <span key={specialty}>{`| ${specialty} |`}</span>
              ))
            : 'none'}
        </li>
        {vetData.schedule?.length
          ? vetData.schedule
              .sort((a, b) => a.dayOfWeek - b.dayOfWeek)
              .map((workingHours) =>
                workingHours.breakStartTime && workingHours.breakEndTime ? (
                  <li
                    key={workingHours.dayOfWeek}
                  >{`Weekday ${workingHours.dayOfWeek}: | Working hours: ${workingHours.startTime}-${workingHours.endTime} | Break time: ${workingHours.breakStartTime}-${workingHours.breakEndTime}`}</li>
                ) : (
                  <li
                    key={workingHours.dayOfWeek}
                  >{`Weekday ${workingHours.dayOfWeek}: | Working hours: ${workingHours.startTime}-${workingHours.endTime}`}</li>
                )
              )
          : 'none'}
      </ul>
      <button onClick={() => setShowForm(true)}>Change Vet Detail</button>
      {showForm ? (
        <Change
          firstName={vetData.firstName}
          lastName={vetData.lastName}
          specialties={vetData.specialties || []}
          schedule={vetData.schedule}
          id={id}
          vetsMutate={vetsMutate}
        />
      ) : null}
      <br />
      <button onClick={() => setShowDeleteOption(true)}>Delete this vet</button>
      {showDeleteOption ? (
        <Delete
          hide={() => setShowDeleteOption(false)}
          id={id}
          vetsMutate={vetsMutate}
        />
      ) : null}
    </div>
  ) : (
    <></>
  );
}
