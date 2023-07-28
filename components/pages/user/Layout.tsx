import React from 'react';
import styled from 'styled-components';

type Props = {
  fullWidth?: boolean;
  children: React.ReactNode;
};

export function MainWrapper({ children, ...props }: Props) {
  return (
    <Wrapper id="main" {...props}>
      {children}
    </Wrapper>
  );
}

const Wrapper = styled.main<Props>`
  background-color: var(--color-white);
  padding: 24px 24px 48px;
  border-bottom-right-radius: 4px;
  border-bottom-left-radius: 4px;
  min-height: 70vh;

  > * {
    max-width: ${(props: any) => (props.fullWidth ? '100%' : '768px')};
  }

  @media (max-width: 640px) {
    padding: 20px;
  }
`;
