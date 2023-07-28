import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Text } from 'components/layouts';
import { Select } from 'components/form';
import styled from 'styled-components';

const Sort: React.FC<{
  newSort: any;
  className?: string;
  sortOptions: any;
}> = ({ newSort, className, sortOptions }) => {
  const router = useRouter();
  const [sort, setSort] = useState<any>(sortOptions[0].value);
  const [value, setValue] = useState(sortOptions[0]);

  useEffect(() => {
    const currentSort = router.query.sort_by
      ? router.query.sort_by
      : sortOptions[0].value;
    const sortOrder = router.query.sort ? router.query.sort : '';

    setSort(sortOrder ? `${currentSort}_${sortOrder}` : currentSort);
  }, [router.query.sort_by, router.query.sort]);

  useEffect(() => {
    const currentSort = sortOptions.find((o) => o.value === sort);
    currentSort && setValue(currentSort);
  }, [sort]);

  const handleChange = (event: any) => {
    setSort(event.value);

    newSort({
      query: 'sort',
      value: event.value.split('_'),
    });
  };
  return (
    <Wrapper className={className}>
      <Text color="var(--text-medium)">Sort by: </Text>
      <Select
        inputId="sort-datasets"
        instanceId="sort-datasets-1"
        aria-label="Sort datasets"
        options={sortOptions}
        isSearchable={false}
        value={value}
        onChange={handleChange}
      />
    </Wrapper>
  );
};

export default Sort;

const Wrapper = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;
  justify-content: flex-end;

  .opub-select {
    width: 250px;

    &__control {
      border: none;
      min-height: 24px;
      font-weight: var(--font-bold);
    }

    &__single-value {
      color: var(--text-medium);
    }

    &__menu {
      min-width: 180px;
      right: 0;
    }

    &__indicator-separator {
      display: none;
    }

    &__value-container {
      padding: 0;
      padding-left: 6px;
    }
  }
`;
