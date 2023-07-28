import React from 'react';
import { useQuery } from '@apollo/client';
import { DATA_ACCESS_MODEL_REQUESTS } from 'services';
import styled from 'styled-components';
import { DatasetInfoCard } from 'components/data';
import { InfoTag } from 'components/actions';
import { Heading, NoResult, Text } from 'components/layouts';
import { FileData, JourneyData } from '@opub-icons/workflow';

import { Flex } from 'components/layouts/FlexWrapper';
import { useSession } from 'next-auth/react';
import { DatasetModelWrapper } from '../explorer/ExplorerInfo/DatasetAccessTab/DatasetModelWrapper';

export const DataAccessModelRequest = () => {
  const { loading, data, refetch } = useQuery(DATA_ACCESS_MODEL_REQUESTS);
  const requestList = data?.data_access_model_request_user;

  const { data: session } = useSession();

  const StatusObj = {
    APPROVED: 'success',
    REJECTED: 'failure',
    REQUESTED: 'pending',
  };

  const iconTypeObj = {
    file: {
      name: 'File',
      id: 'FILE',
      image: <FileData width={40} />,
    },
    api: {
      name: 'API',
      id: 'API',
      image: <JourneyData />,
    },
  };

  const ColumnHeaders = [
    {
      name: 'Name of Dataset',
    },
    {
      name: "Provider's Name",
    },
    {
      name: 'Status',
    },
    {
      name: 'Date',
    },
  ];

  const getDataList = (requestList) => {
    const requestListData = [];
    requestList.map((item) => {
      requestListData.push({
        gridOne: (
          <GridOneWrapper>
            <Flex
              alignContent={'center'}
              justifyContent={'center'}
              alignItems={'center'}
              gap={'10px'}
            >
              {
                iconTypeObj[
                  item?.access_model?.dataset?.dataset_type.toLowerCase()
                ].image
              }
              <Heading variant="h4" as={'span'}>
                {item?.access_model?.dataset?.title}
              </Heading>
            </Flex>
          </GridOneWrapper>
        ),
        gridTwo: (
          <Flex
            alignContent={'center'}
            justifyContent={'center'}
            marginTop={'10px'}
          >
            <Text as={'h4'}>
              {item?.access_model?.dataset?.catalog?.organization?.title}
            </Text>
          </Flex>
        ),
        gridThree: (
          <Flex
            alignContent={'center'}
            justifyContent={'center'}
            marginTop={'5px'}
          >
            <InfoTag
              variant={StatusObj[item?.status]}
              statusName={item?.status}
            />
          </Flex>
        ),
        actionable: (
          <Flex flexDirection={'column'}>
            <Text>
              <Text fontWeight={'bold'}>Requested on: </Text>
              {new Date(item.issued).toLocaleString('en-IN', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric',
              })}
            </Text>
            {(item.status === 'APPROVED' || item.status === 'REJECTED') && (
              <Text>
                <Text fontWeight={'bold'}>
                  {item.status === 'APPROVED' ? 'Approved' : 'Rejected'} on:{' '}
                </Text>
                {new Date(item.modified).toLocaleString('en-IN', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: 'numeric',
                  second: 'numeric',
                })}
              </Text>
            )}
          </Flex>
        ),
        info: (
          <InfoWrapper>
            <DatasetModelWrapper
              key={item?.access_model?.id}
              item={{
                ...item?.access_model,
                refetch,
                datasetId: item?.access_model?.dataset?.id,
              }}
              session={session}
            />
          </InfoWrapper>
        ),
      });
    });

    return requestListData;
  };

  return (
    <Wrapper>
      {loading ? (
        <p>Loading...</p>
      ) : requestList?.length > 0 ? (
        <>
          <DatasetInfoCard
            data={getDataList(requestList)}
            ColumnHeaders={ColumnHeaders}
          />
        </>
      ) : (
        <NoResult label={'No Requests yet'} />
      )}
    </Wrapper>
  );
};

const GridOneWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  svg {
    fill: var(--color-gray-04);
  }
`;

const Wrapper = styled.section`
  display: flex;
  flex-direction: column;
`;

const InfoWrapper = styled.div`
  margin-top: 4px;
  width: 100%;
`;
