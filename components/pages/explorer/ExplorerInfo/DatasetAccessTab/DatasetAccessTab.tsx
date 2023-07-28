import React from 'react';
import { useQuery } from '@apollo/client';
import { DATASET_DATA_ACCESS_MODELS } from 'services';
import styled from 'styled-components';
import { useSession } from 'next-auth/react';
import { DatasetModelWrapper } from './DatasetModelWrapper';
import { Heading, NoResult } from 'components/layouts';
import { Loader } from 'components/common';
import { useGuestStore } from 'services/store';
import { Select } from 'components/form';
import { Flex } from 'components/layouts/FlexWrapper';

export const DatasetAccessTab = ({ datasetId }) => {
  const { data: session } = useSession();
  const [users, setUsers] = React.useState<any>([]);
  const openDAMIDs = useGuestStore((e) => e.openDAMIDs);

  const filterDAMOptions = [
    {
      label: 'All',
      value: 'ALL',
    },
    {
      label: 'Open',
      value: 'OPEN',
    },
    {
      label: 'Registered',
      value: 'REGISTERED',
    },
    {
      label: 'Restricted',
      value: 'RESTRICTED',
    },
  ];

  const [filterDAMType, setFilterDAMType] = React.useState({
    label: 'All',
    value: 'ALL',
  });

  // checking for non-logged in users
  React.useEffect(() => {
    if (!session) {
      const agreements = localStorage.getItem('data_request_id');
      setUsers(agreements?.split(',').filter(Boolean) || []);
    }
  }, [openDAMIDs]);
  const vars = session
    ? {
        dataset_id: datasetId,
        anonymous_users: [],
      }
    : {
        dataset_id: datasetId,
        anonymous_users: users,
      };

  const { loading, data, refetch } = useQuery(DATASET_DATA_ACCESS_MODELS, {
    variables: vars,
  });

  const modelList = data?.dataset_access_model || [];

  if (loading) return <Loader isSection />;

  return (
    <Wrapper>
      <div className="onlyDesktop">
        <Flex justifyContent={'space-between'} flexWrap={'wrap'}>
          <Heading variant="h3" as="h2">
            Dataset Access Models
          </Heading>
          {modelList?.length > 3 && (
            <FilterSelect>
              <Select
                options={filterDAMOptions}
                inputId={'select-dam-type'}
                value={filterDAMType}
                onChange={(e) => setFilterDAMType(e)}
                isSearchable={false}
                menuPlacement={'bottom'}
              />
            </FilterSelect>
          )}
        </Flex>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : modelList?.length > 0 ? (
        modelList
          .filter(
            (item) =>
              filterDAMType.value === 'ALL' ||
              item.data_access_model.type === filterDAMType.value
          )
          .map(
            (item) =>
              item && (
                <React.Fragment key={item.id}>
                  <DatasetModelWrapper
                    key={item}
                    item={{ ...item, refetch, datasetId: datasetId }}
                    session={session}
                  />
                </React.Fragment>
              )
          )
      ) : (
        <NoResult label="No Results" />
      )}
    </Wrapper>
  );
};

const Wrapper = styled.section`
  display: flex;
  flex-direction: column;
  gap: 16px;

  > span {
    display: inline-block;
  }

  @media (max-width: 640px) {
    gap: 8px;
    margin-inline: -12px;
    margin-top: -8px;
  }
`;

const FilterSelect = styled.div`
  min-width: 120px;
  .opub-select__control {
    background-color: var(--color-white);
  }
`;
