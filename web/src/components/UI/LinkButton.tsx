import React, { ReactElement } from 'react';
import styled from 'styled-components';

interface Props {
  onClick: () => void;
  children?: React.ReactNode;
}

const Button = styled.button`
  border: none;
  cursor: pointer;
  background-color: inherit;
  color: #1890ff;
  padding: 0;
`;

export default function LinkButton({
  onClick,
  children = null
}: Props): ReactElement {
  return <Button onClick={onClick}>{children}</Button>;
}
