import React from 'react';
import { Button } from 'components/actions';
import { NextLink } from 'components/layouts/Link';
import { ArrowSize600 as Arrow } from '@opub-icons/ui';
import { AddCircle } from '@opub-icons/workflow';

const getIcons = {
  back: <Arrow style={{ transform: 'scale(-1,1)' }} width={14} />,
  create: <AddCircle width={14} />,
};

type Props = {
  kind?: 'primary-outline' | 'primary';
  href?: string;
  label: string | React.ReactElement;
  onClick?: any;
  type?: 'back' | 'create';
};

export const LinkButton = ({
  href,
  label,
  onClick,
  type,
  kind = 'primary-outline',
}: Props) => {
  if (onClick) {
    return (
      <Button
        kind={kind || 'primary-outline'}
        size="sm"
        onPress={onClick}
        icon={getIcons[type]}
        iconSide={type == 'back' ? 'left' : 'right'}
      >
        {label}
      </Button>
    );
  }

  return (
    <NextLink href={href}>
      <Button
        as="a"
        kind={kind || 'primary-outline'}
        size="sm"
        icon={getIcons[type]}
        iconSide={type == 'back' ? 'left' : 'right'}
      >
        {label}
      </Button>
    </NextLink>
  );
};
