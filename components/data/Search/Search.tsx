import { useState } from 'react';
import { useRouter } from 'next/router';
import { Button } from 'components/actions';
import { IconSearch } from 'components/icons';
import styled from 'styled-components';

const Search: React.FC<{ text?: string; newSearch: any }> = ({
  text,
  newSearch,
}) => {
  const router = useRouter();
  const [q, setQ] = useState(
    router.query.q ? decodeURIComponent(router.query.q.toString()) : ''
  );

  const handleChange = (value) => {
    setQ(value.replace(/^\W+/, ''));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    newSearch({
      query: 'q',
      value: encodeURIComponent(q.toString()),
    });
  };
  return (
    <SearchWrapper onSubmit={handleSubmit} className="search">
      <Wrapper>
        <Icon>
          <IconSearch fill="var(--gray-04)" />
        </Icon>
        <SearchInput
          type="search"
          name="q"
          value={q}
          id="searchInput"
          onChange={(e) => handleChange(e.target.value)}
          placeholder={text ? text : 'Search here for dataset...'}
          aria-label="Search"
        />
      </Wrapper>
      <Button kind="secondary" onPress={handleSubmit}>
        Submit
      </Button>
    </SearchWrapper>
  );
};

export default Search;

export const SearchWrapper = styled.form`
  display: flex;
  gap: 12px;
  align-content: center;
  flex-wrap: wrap;
`;

export const Wrapper = styled.div`
  height: 100%;
  background-color: var(--color-white);
  border-radius: 2px;
  box-shadow: inset 0px 0px 4px rgba(0, 0, 0, 0.08);
  border: 1px solid -var(--color-gray-02);
  flex-grow: 1;

  display: flex;
  height: 48px;

  &:focus-within {
    outline: 3px solid var(--color-secondary-01);
  }
`;

export const SearchInput = styled.input`
  border: none;
  width: 100%;
  padding: 10px;
  color: var(--text-medium);
  font-weight: 700;

  outline: none !important;
`;

const Icon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding-left: 16px;
`;
