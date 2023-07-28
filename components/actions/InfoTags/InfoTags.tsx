import styled from 'styled-components';
import { color, variant, ColorProps } from 'styled-system';

interface Props extends ColorProps {
  className?: string;
}

type InfoTagProps = React.ComponentProps<typeof StyledTag> & Props;

const InfoTags = ({ statusName, ...props }: InfoTagProps) => {
  return <StyledTag {...props}>{statusName}</StyledTag>;
};

export default InfoTags;

const variants = {
  success: {
    backgroundColor: 'var(--color-gray-01)',
    color: 'var(--color-success)',
  },
  failure: {
    backgroundColor: 'var(--color-gray-01)',
    color: 'var(--color-error)',
  },
  pending: {
    backgroundColor: 'var(--color-gray-01)',
    color: 'var( --color-tertiary-2-00)',
  },
  suspended: {
    backgroundColor: 'var(--color-gray-01)',
    color: 'var(--color-gray-07)',
  },
};

export const StyledTag = styled.span`
  background-color: var(--color-gray-04);
  display: inline-flex;
  text-align: center;
  color: var(--color-white);
  font-size: 14px;
  font-weight: var(--font-bold);
  text-transform: capitalize;
  border-radius: 25px;
  padding: 5px 20px;
  width: fit-content;
  height: fit-content;
  align-content: center;
  justify-content: center;
  ${variant({ variants })};
  ${color};
`;
