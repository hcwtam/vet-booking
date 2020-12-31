import React, { ReactElement, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router';
import styled from 'styled-components';
import useSWR from 'swr';
import VetCard from '../components/Search/VetCard';
import { VetType } from '../types/types';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export default function Search(): ReactElement {
  const history = useHistory();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const datetime = params.get('datetime');
  const animalType = params.get('animalType');
  let weekday: number | null = null;
  if (datetime) weekday = new Date(+datetime * 1000).getDay();
  const { data } = useSWR(
    datetime && animalType
      ? [`vet/guest?datetime=${datetime}&animalType=${animalType}`]
      : null
  );

  let vetCards;
  if (data && data.data.vets) {
    console.log(data.data.vets);
    vetCards = data.data.vets.map((vet: VetType) => (
      <VetCard weekday={weekday} vet={vet} key={vet.id} />
    ));
  }

  useEffect(() => {
    if (!datetime || !animalType) {
      history.push('/');
    }
  }, [history, animalType, datetime]);
  return <Container>{vetCards}</Container>;
}
