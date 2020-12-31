import React, { ReactElement, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router';
import styled from 'styled-components';
import useSWR from 'swr';
import VetCard from '../components/Search/VetCard';
import { VetType } from '../types/types';

const Container = styled.div`
  width: 90%;
  max-width: 800px;
  padding: 30px 0 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;

  @media (max-width: 750px) {
    width: 100%;
  }
`;

const Title = styled.h1`
  align-self: flex-start;
  font-weight: bold;
  font-size: 2rem;

  @media (max-width: 750px) {
    margin-left: 20px;
  }
`;

const DateTitle = styled.h2`
  align-self: flex-start;
  font-size: 1rem;
  color: #1a1a1a;
  margin: 0;
`;

export default function Search(): ReactElement {
  const history = useHistory();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const datetime = params.get('datetime');
  const animalType = params.get('animalType');
  let weekday: number | null = null;
  let formatDate: string | null = null;
  if (datetime) {
    weekday = new Date(+datetime).getDay();
    formatDate = new Date(+(datetime as string)).toLocaleString();
    // remove seconds
    formatDate = formatDate.slice(0, formatDate.length - 3);
  }
  const { data } = useSWR(
    datetime && animalType
      ? [`vet/guest?datetime=${datetime}&animalType=${animalType}`]
      : null
  );

  let vetCards;
  if (data && data.data.vets) {
    vetCards = data.data.vets.map((vet: VetType) => (
      <VetCard
        weekday={weekday}
        vet={vet}
        key={vet.id}
        animalType={animalType}
        datetime={datetime as string}
      />
    ));
  }

  useEffect(() => {
    if (!datetime || !animalType) {
      history.push('/');
    }
  }, [history, animalType, datetime]);
  return (
    <Container>
      <DateTitle>{formatDate}</DateTitle>
      <Title>Available Vets</Title>
      {vetCards}
    </Container>
  );
}