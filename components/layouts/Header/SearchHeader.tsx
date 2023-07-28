import { SearchField } from 'components/form';
import styled from 'styled-components';
import { Heading } from 'components/layouts';

const SearchHeader = ({ handleDatasetsChange, defaultValue, handleClear }) => {
  return (
    <Wrapper>
      <div className="container">
        <Heading as="h2" variant="h2">
          All Datasets
        </Heading>
        <SearchField
          id="globalSearch"
          onClear={handleClear}
          onSubmit={(e) => handleDatasetsChange({ query: 'q', value: e })}
          showSubmit
          defaultValue={defaultValue}
          placeholder="Search through the datasets"
          aria-label="search through datasets"
        />
      </div>
    </Wrapper>
  );
};

export { SearchHeader };

export const Wrapper = styled.div`
  background-color: var(--color-white);
  padding-block: 24px;

  > div {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    align-items: center;
    gap: 32px;
  }

  .opub-search {
    flex-grow: 1;
    max-width: 904px;
  }

  @media (max-width: 640px) {
    padding-top: 16px;
    padding-bottom: 18px;

    > div {
      gap: 16px;
    }
  }
`;
