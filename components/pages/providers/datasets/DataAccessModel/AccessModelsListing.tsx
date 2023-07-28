import { Heading } from 'components/layouts';
import { AccessModelCard } from 'components/layouts/AccessModelCard';
import { LinkButton } from 'components/pages/dashboard/helpers';
import React from 'react';
import styled from 'styled-components';
import { DATASET_DATA_ACCESS_MODELS } from 'services';
import { useQuery } from '@apollo/client';
import { Button } from 'components/actions';
import { Loader } from 'components/common';

export const AccessModelsListing = ({
  router,
  setCurrentTab,
  handleManage,
}) => {
  const { data: damList, loading } = useQuery(DATASET_DATA_ACCESS_MODELS, {
    variables: {
      dataset_id: router.query.datasetId,
      anonymous_users: [],
    },
  });

  return (
    <>
      <main>
        <HeaderWrapper>
          <Heading as="h2" variant="h3" marginY={'auto'} paddingBottom={'17px'}>
            Dataset Access Model
          </Heading>
        </HeaderWrapper>
        <AddTransform title="Add Dataset Access Model">
          <LinkButton
            label="Add Dataset Access Model"
            type="create"
            onClick={() => setCurrentTab('create')}
          />
        </AddTransform>

        {loading ? (
          <Loader />
        ) : damList && damList.dataset_access_model?.length > 0 ? (
          <Cards>
            <>
              <Heading
                as="h2"
                variant={'h4'}
                marginTop={'20px'}
                marginBottom={'8px'}
                color={'var(--color-dodger-blue-06)'}
              >
                {damList?.dataset_access_model?.length > 1
                  ? `${damList?.dataset_access_model?.length} Dataset Access Models Added`
                  : `${damList?.dataset_access_model?.length}  Dataset Access Model Added`}
              </Heading>
              {damList.dataset_access_model?.map((item, index) => (
                <>
                  <AccessModelCard
                    hideBanner
                    resActions={false}
                    key={item.title + index}
                    data={item}
                    actionlist={false}
                    customActions={
                      <ManageButton
                        damId={item.id}
                        handleManage={handleManage}
                      />
                    }
                  />
                </>
              ))}
            </>
          </Cards>
        ) : (
          <></>
        )}
      </main>
    </>
  );
};

const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  border-bottom: 2px solid var(--color-gray-01);
`;

const AddTransform = styled.div`
  padding: 24px;
  button {
    margin: auto;
    border: 2px solid var(--color-tertiary-1-00);
    color: var(--color-tertiary-1-00);
    background-color: var(--color-background-lightest);
  }
`;
const NextButton = styled.div`
  margin-left: auto;
  display: flex;
  button {
    margin: auto;
    color: var(--color-secondary-01);
    border-color: var(--color-secondary-01);
  }
  svg {
    transform: rotate(180deg);
  }
`;
const Cards = styled.div`
  margin-block: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 8px;

  /* min-height: 60vh; */
  overflow-y: auto;
`;

const ManageButton = ({ handleManage, damId }) => {
  return (
    <Button size="sm" fluid onPress={() => handleManage(damId)}>
      Manage
    </Button>
  );
};
