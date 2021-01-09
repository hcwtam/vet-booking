import React, { ReactElement } from 'react';
import styled from 'styled-components';

const Foot = styled.footer`
  width: 100%;
  height: 100px;
  background-color: #efefef;
  display: flex;
  flex-direction: column-reverse;
  align-items: center;
  padding: 20px;

  border-top: 1px solid #dbdbdb;
`;

export default function Footer(): ReactElement {
  return (
    <Foot>
      <div>© 2021 Wesley Tam. All rights reserved</div>
    </Foot>
  );
}
