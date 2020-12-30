import React, { ReactElement, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router';
import useSWR from 'swr';

export default function Search(): ReactElement {
  const history = useHistory();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const datetime = params.get('datetime');
  const animalType = params.get('animalType');
  const { data } = useSWR(
    datetime && animalType
      ? [`vet/guest?datetime=${datetime}&animalType=${animalType}`]
      : null
  );

  let vets;
  if (data && data.data.vets) {
    vets = data.data.vets.map((vet: any) => (
      <pre key={vet.id}>{JSON.stringify(vet)}</pre>
    ));
  }

  useEffect(() => {
    if (!datetime || !animalType) {
      history.push('/');
    }
  }, [history, animalType, datetime]);
  return <div>{vets}</div>;
}
