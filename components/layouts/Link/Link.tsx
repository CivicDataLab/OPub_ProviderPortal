import StyledLink from './Link.styles';
import { TypographyProps, SpaceProps, ColorProps } from 'styled-system';
import React from 'react';

interface Props extends SpaceProps, ColorProps, TypographyProps {
  children: React.ReactNode;
  underline?: 'never' | 'hover' | 'always';
  variant?: 'pt16' | 'pt14' | 'pt12' | 'pt16l' | 'pt14l' | 'pt12l';
  external?: boolean;
}

type LinkProps = React.ComponentProps<typeof StyledLink> & Props;

const Link = React.forwardRef(
  (
    { underline = 'always', children, external = false, ...props }: LinkProps,
    ref
  ) => {
    function handleClick(link) {
      if (window.confirm(`You are being redirected to ${link}`)) {
        window.open(link);
      }
    }

    if (external) {
      return (
        <StyledLink
          as="button"
          ref={ref}
          underline={underline}
          {...props}
          onClick={() => handleClick(props.href)}
        >
          {children}
        </StyledLink>
      );
    }

    return (
      <StyledLink ref={ref} underline={underline} {...props}>
        {children}
      </StyledLink>
    );
  }
);

export { Link };
