import { LeftCircleOutlined } from '@ant-design/icons';
import React, { ReactElement } from 'react';
import { useHistory } from 'react-router';
import styled from 'styled-components';

const Button = styled.div`
  width: 70px;
  font-size: 14px;
  border-radius: 5px;
  background-color: #fff;
  color: #777;
  padding: 5px 10px;
  cursor: pointer;
  transition: 0.2s;
  box-shadow: 0 0 2px #bbb;
  margin-bottom: 40px;

  &:hover {
    transform: scale(1.05);
    color: #ffa600;
  }
`;

export default function BackButton(): ReactElement {
  const { goBack } = useHistory();
  return (
    <Button onClick={goBack}>
      <LeftCircleOutlined /> Back
    </Button>
  );
}
