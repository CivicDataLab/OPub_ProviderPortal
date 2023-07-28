import { IconInfo } from 'components/icons';
import React from 'react';
import styled from 'styled-components';

type Props = {
  title: React.ReactNode;
};

function Aside({ title, ...props }: Props) {
  return (
    title && (
      <StyledAside {...props}>
        <IconInfo />
        <Title>{title}</Title>
      </StyledAside>
    )
  );
}

export default Aside;

const StyledAside = styled.aside`
  display: flex;
  background-color: #f7f7f7;
  border-radius: 25px;
  padding: 2px;
  margin: 5px 0;
`;
const Title = styled.p`
  font-size: 14px;
  margin-right: auto;
  padding-left: 5px;
  font-weight: 400;
`;
