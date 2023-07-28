import styled from 'styled-components';
import {
  compose,
  SpaceProps,
  ColorProps,
  LayoutProps,
  space,
  color,
  layout,
  variant,
} from 'styled-system';

interface Props extends SpaceProps, ColorProps, LayoutProps {
  className?: string;
}

type SeparatorProps = React.ComponentProps<typeof Wrapper> & Props;

const Separator = ({ ...props }: SeparatorProps) => {
  return <Wrapper {...props} />;
};

export { Separator };

const variants = {
  onDark: {
    backgroundColor: 'var(--color-gray-01-on-dark)',
  },
  onLight: {
    backgroundColor: 'var(--color-gray-01)',
  },
};

const Wrapper = styled.span<any>`
  display: block;
  background-color: var(--color-gray-01);
  height: 2px;
  width: 100%;
  ${compose(space, color, layout, variant({ variants }))}
`;
