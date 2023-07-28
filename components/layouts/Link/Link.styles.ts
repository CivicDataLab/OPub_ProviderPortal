import styled from 'styled-components';
import { typography, space, color, variant, compose } from 'styled-system';

type Props = {
  underline: 'never' | 'hover' | 'always';
};

const variants = {
  pt16: {
    fontSize: '1rem',
  },
  pt14: {
    fontSize: '0.875rem',
    lineHeight: '1.7',
  },
  pt12: {
    fontSize: '0.75rem',
    lineHeight: '1.7',
  },

  pt16l: {
    fontSize: '1rem',
    fontWeight: 'var(--font-normal)',
  },
  pt14l: {
    fontSize: '0.875rem',
    lineHeight: '1.7',
    fontWeight: 'var(--font-normal)',
  },
  pt12l: {
    fontSize: '0.75rem',
    lineHeight: '1.7',
    fontWeight: 'var(--font-normal)',
  },
};

const Link = styled.a<Props>`
  margin: 0;
  padding: 0;
  line-height: 1.5;
  font-weight: var(--font-bold);
  font-size: 1rem;
  color: var(--color-link);

  text-decoration-color: ${(props) =>
    props.underline == 'always' ? 'inherit' : 'transparent'};

  &:hover {
    text-decoration-color: ${(props) =>
      props.underline == 'hover' && 'inherit'};
  }

  svg {
    fill: currentColor;
    margin-left: 2px;
  }

  ${compose(variant({ variants }), color, space, typography)}
`;

export default Link;
