import { Filter, Pagination, Sort, Total } from 'components/data';
import React from 'react';
import styled from 'styled-components';
import { List } from 'components/pages/datasets';
import MobileAlter from 'components/data/MobileAlter/MobileAlter';

const sortOptions = [
  {
    value: 'recent',
    label: 'Most Recent',
  },
  {
    value: 'modified_asc',
    label: 'Last Updated Ascending',
  },
  {
    value: 'modified_desc',
    label: 'Last Updated Descending',
  },
  {
    value: 'relevance',
    label: 'Relevance',
  },
  {
    value: 'rating_asc',
    label: 'Rating Ascending',
  },
  {
    value: 'rating_desc',
    label: 'Rating Descending',
  },
  {
    value: 'provider_asc',
    label: 'Data Provider Ascending',
  },
  {
    value: 'provider_desc',
    label: 'Data Provider Descending',
  },
];

export const DatasetList = ({
  datasets,
  facets,
  handleDatasetsChange,
  count,
}) => {
  return (
    <DatasetsComp>
      <Filter
        data={facets.aggregations}
        selectedFacets={facets?.selected_facets || []}
        newFilters={handleDatasetsChange}
        filterHeadingAs="h2"
      />
      <DatasetRight>
        <h2 className="sr-only">Datasets</h2>
        {sortOptions && (
          <MobileAlter
            data={facets.aggregations}
            newData={handleDatasetsChange}
            selectedFacets={facets?.selected_facets || []}
            count={count}
            sortOptions={sortOptions}
          />
        )}
        <DatasetSort>
          <Total text="Showing" total={count} />
          {sortOptions && (
            <Sort
              className="fill"
              newSort={handleDatasetsChange}
              sortOptions={sortOptions}
            />
          )}
        </DatasetSort>
        <List data={datasets} />
        {count ? (
          <Pagination total={count} newPage={handleDatasetsChange} />
        ) : null}
      </DatasetRight>
    </DatasetsComp>
  );
};

const DatasetsComp = styled.div`
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 32px;
  margin-top: 32px;
  margin-bottom: 64px;

  @media (max-width: 640px) {
    display: block;
    margin-top: 16px;

    .filters,
    .sort {
      display: none;
    }
  }
`;

const DatasetRight = styled.div`
  width: 100%;
`;

const DatasetSort = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: var(--color-white);
  border-radius: 4px;

  @media (max-width: 640px) {
    display: none;
  }
`;
