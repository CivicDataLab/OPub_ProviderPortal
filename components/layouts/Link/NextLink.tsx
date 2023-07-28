import Link from 'next/link';
import React from 'react';

interface Props {
  children: React.ReactNode;
}

type LinkProps = React.ComponentProps<typeof Link> & Props;

export const NextLink = React.forwardRef(
  ({ href, children, ...props }: LinkProps, ref) => {
    return (
      <Link href={href} {...props} passHref>
        {children}
      </Link>
    );
  }
);
