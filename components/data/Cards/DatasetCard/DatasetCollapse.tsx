import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@radix-ui/react-collapsible';
import { IconAdd, IconMinimize } from 'components/icons';
import { Text } from 'components/layouts';
import React from 'react';
import styled from 'styled-components';

export const DatasetCollapse = ({ content }) => {
  const [open, setOpen] = React.useState(false);

  const Icon = open ? IconMinimize : IconAdd;
  return (
    <Collapsible onOpenChange={setOpen}>
      <Trigger>
        <Text variant="pt14b" color="var(--text-medium)">
          {open ? 'Hide' : 'Show'} All Details
        </Text>

        <Icon fill="var(--text-medium)" />
      </Trigger>
      <CollapsibleContent>{content}</CollapsibleContent>
    </Collapsible>
  );
};

const Trigger = styled(CollapsibleTrigger)`
  padding: 8px 0;
  border-bottom: 1px solid var(--color-gray-01);

  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;
