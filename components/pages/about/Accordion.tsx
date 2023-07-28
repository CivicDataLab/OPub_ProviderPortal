import {
  Accordion as AC,
  AccordionContent as AContent,
  AccordionItem as AItem,
  AccordionTrigger as ATrigger,
} from 'components/actions/Accordian/Accordian';
import { IconAdd, IconMinimize } from 'components/icons';
import { Heading, Text } from 'components/layouts';
import { Flex } from 'components/layouts/FlexWrapper';
import React from 'react';
import styled from 'styled-components';

export const AccordionTrigger = ({ title }) => {
  return (
    <StyledAccordionTrigger>
      <Text variant="pt16b" color={'var(--color-grey-07)'}>
        {title}
      </Text>

      <div>
        <IconMinimize fill="var(--color-gray-04)" />
        <IconAdd fill="var(--color-gray-04)" />
      </div>
    </StyledAccordionTrigger>
  );
};

export const AccordionContent = ({ children }) => {
  return (
    <AContent>
      <Flex
        justifyContent="center"
        paddingX="2px"
        paddingTop="8px"
        flexDirection="column"
        gap="8px"
      >
        {children}
      </Flex>
    </AContent>
  );
};

export const AccordionItem = ({ value, children }) => {
  return <AItem value={value}>{children}</AItem>;
};

export const Accordion = ({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) => {
  const [currentAccordion, setCurrentAccordion] = React.useState([]);

  return (
    <AccordionWrapper className="accordion-about">
      {title && (
        <Heading id="problem-statement" as="h2" variant="h4">
          {title}
        </Heading>
      )}
      <StyledAccordion
        type="multiple"
        onValueChange={(e: any) => {
          currentAccordion === e
            ? setCurrentAccordion([])
            : setCurrentAccordion(e);
        }}
      >
        {children}
      </StyledAccordion>
    </AccordionWrapper>
  );
};

export const AccordionWrapper = styled.div`
  span {
    text-align: left;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    scroll-margin-top: 150px;
  }
`;

export const StyledAccordion = styled(AC)`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 8px;
`;

export const StyledAccordionTrigger = styled(ATrigger)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 8px 2px;
  gap: 12px;

  border-bottom: 1px solid var(--color-gray-03);

  &[data-disabled] {
    cursor: not-allowed;
  }

  > div {
    svg {
      &:first-child {
        display: none;
      }
    }
  }

  &[data-state='open'] {
    > div {
      svg {
        &:last-child {
          display: none;
        }

        &:first-child {
          display: block;
        }
      }
    }
  }
`;
