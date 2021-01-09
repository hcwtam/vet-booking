import React, { ReactElement } from 'react';
import styled from 'styled-components';

interface Props {
  children: React.ReactNode;
}

const Overview = styled.div`
  width: 95%;
  margin: 50px auto;
  border-radius: 10px;
  background-color: #fff;
  padding: 20px 20px 40px;
  box-shadow: 0 0 8px #ccc;
`;

export default function Content({ children }: Props): ReactElement {
  return <Overview>{children}</Overview>;
}
