import { AccordionTrigger } from '@radix-ui/react-accordion';
import styled from 'styled-components';

export const FilterComp = styled.div`
  scrollbar-width: thin;
  background-color: var(--color-white);
  border-radius: 4px;
  height: max-content;
  padding: 12px 16px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 5px;
  }

  [aria-pressed='true'] {
    background-color: #ebf0ff;

    &:hover {
      background-color: #f2eff2;
    }
  }
`;

export const FilterHeading = styled(AccordionTrigger)`
  background-color: var(--color-primary-06);
  border-top: 2px solid var(--color-primary-05);
  border-radius: 0px 0px 4px 4px;
  text-transform: capitalize;
  padding: 8px 12px;

  margin-top: 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;

  [data-state='closed'] {
    display: block;
  }
  [data-state='opened'] {
    display: none;
  }

  &[aria-expanded='true'] {
    background-color: var(--color-primary-05);

    [data-state='closed'] {
      display: none;
    }
    [data-state='opened'] {
      display: block;
    }
  }
`;

export const FilterContent = styled.div`
  max-height: 20rem;
  overflow-y: auto;
  scrollbar-width: thin;
  padding-top: 8px;
  padding-inline: 12px;

  &::-webkit-scrollbar {
    width: 5px;
  }

  .opub-search {
    margin-top: 4px;
    margin-bottom: 8px;
  }

  .is-checked {
    span:last-child {
      font-weight: bold;
    }
  }
`;
