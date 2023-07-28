import StyledText from './Text.styles';
import { TypographyProps, SpaceProps, ColorProps } from 'styled-system';

export interface Props extends SpaceProps, ColorProps, TypographyProps {
  children: React.ReactNode;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'span' | 'p';
  variant?: 'pt16' | 'pt14' | 'pt12' | 'pt16b' | 'pt14b' | 'pt12b';
  className?: String;
}

type TextProps = React.ComponentProps<typeof StyledText> & Props;

const Text = ({ as = 'span', children, ...props }: TextProps) => {
  return (
    <StyledText as={as} {...props}>
      {children}
    </StyledText>
  );
};

export { Text };
