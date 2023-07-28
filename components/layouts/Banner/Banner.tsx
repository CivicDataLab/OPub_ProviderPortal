import { Info } from '@opub-icons/workflow';
import React from 'react';
import styled from 'styled-components';
import {
  color,
  compose,
  space,
  SpaceProps,
  ColorProps,
  variant,
} from 'styled-system';

interface Props extends ColorProps, SpaceProps {
  children: React.ReactNode | string;
  variant?: 'success' | 'error' | 'warning' | 'info';
}

export const Banner = ({ children, ...props }: Props) => {
  return (
    <Wrapper className="opub-banner" {...props}>
      <Info size={20} />
      <>{children}</>
    </Wrapper>
  );
};

const variants = {
  success: {
    backgroundColor: 'var(--banner-color-success)',
  },
  error: {
    backgroundColor: 'var(--banner-color-error)',
  },
  warning: {
    backgroundColor: 'var(--banner-color-warning)',
  },
  info: {
    backgroundColor: 'var(--banner-color-information)',
  },
};

const Wrapper = styled.div<any>`
  padding: 8px 16px;
  border-radius: 4px;
  border: 1px solid var(--color-gray-01);
  background-color: var(--banner-color-information);
  color: var(--text-high);

  display: inline-flex;
  align-items: center;
  width: 100%;
  gap: 4px;

  ${variant({ variants })};
  ${compose(color, space)};
`;
