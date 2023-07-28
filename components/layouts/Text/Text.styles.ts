import styled from 'styled-components';
import { typography, space, color, variant, compose } from 'styled-system';

const variants = {
  pt16: {
    fontSize: '1rem',
    letterSpacing: '0.01em',
  },
  pt14: {
    fontSize: '0.875rem',
    lineHeight: '1.7',
  },
  pt12: {
    fontSize: '0.75rem',
    lineHeight: '1.7',
  },
  pt16b: {
    fontSize: '1rem',
    fontWeight: 'var(--font-bold)',
  },
  pt14b: {
    fontSize: '0.875rem',
    fontWeight: 'var(--font-bold)',
    lineHeight: '1.7',
  },
  pt12b: {
    fontSize: '0.75rem',
    fontWeight: 'var(--font-bold)',
    lineHeight: '1.7',
  },
};

const Text = styled.span`
  margin: 0;
  padding: 0;
  line-height: 1.5;
  font-weight: 400;

  ${variant({ variants })};
  ${color};
  ${space};
  ${typography};
`;

export default Text;
