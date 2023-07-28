import { useQuery } from '@apollo/client';
import { DashboardHeader, Heading, NoResult, Text } from 'components/layouts';
import { Flex } from 'components/layouts/FlexWrapper';
import { DatasetModelWrapper } from 'components/pages/explorer/ExplorerInfo/DatasetAccessTab/DatasetModelWrapper';
import { MainWrapper } from 'components/pages/user/Layout';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { GET_ALL_DATASETS } from 'services';
import { useConstants } from 'services/store';
import styled from 'styled-components';
import withAuth from 'utils/withAuth';
import React, { useEffect, useState } from 'react';
import SortFilterListingTable, {
  SelectColumnFilter,
} from 'components/common/SortFilterListingTable';
import { Loader } from 'components/common';
import { ExpanderCell } from 'components/common/SortFilterListingTable/SortFilterListingTable';
import useEffectOnChange from 'utils/hooks';
import { GET_ALL_DATASETS_COUNT } from 'services/schema';
import { useRouter } from 'next/router';
import GraphqlPagination from 'components/data/Pagination/GraphqlPagination';
import { LogoContainer } from 'pages/providers/[provider]/dashboard/datasets/drafts';
import { platform_name } from 'platform-constants';

const MyDatasetsList = () => {
  const { data: session } = useSession();
  const datasetTypeIcons = useConstants((e) => e.datasetTypeIcons);
  const router = useRouter();

  const { q, skip, first } = router.query;
  const [pages, setPages] = useState(first);
  const [items, setItems] = useState(skip);
  const [query, setQuery] = useState(q);

  function handleMyDatasetsPagination(val: any) {
    switch (val.query) {
      case 'first':
        setPages(val.value);
        break;
      case 'skip':
        setItems(val.value);
        break;
    }
  }

  const { data, loading, error, refetch } = useQuery(GET_ALL_DATASETS, {
    variables: {
      first: pages || 10,
      skip: items || 0,
    },
  });

  const AllDatasetsCount = useQuery(GET_ALL_DATASETS_COUNT);

  useEffectOnChange(() => {
    router.replace({
      pathname: router.pathname,
      query: {
        q: query || '',
        skip: items || '0',
        first: pages || '10',
      },
    });
    refetch;
  }, [query, pages, items]);

  useEffect(() => {
    (!router.query.skip || !router.query.first) &&
      router.replace({
        pathname: router.pathname,
        query: {
          q: query || '',
          skip: '0',
          first: '10',
        },
      });
  }, []);

  const ColumnHeaders = React.useMemo(
    () => [
      {
        Header: 'Dataset Title',
        accessor: 'name',
        sortType: 'alphanumeric',
        Filter: SelectColumnFilter,
        filter: 'includes',
        maxWidth: 200,
        minWidth: 100,
        Cell: ({ row }) => (
          <Flex>
            <LogoContainer>{row.original.logo}</LogoContainer>

            <Text marginY={'auto'}>{row.original.name}</Text>
          </Flex>
        ),
      },
      {
        Header: 'Provider',
        accessor: 'provider',
        sortType: 'alphanumeric',
        Filter: SelectColumnFilter,
        filter: 'includes',
      },
      {
        Header: 'Sector',
        accessor: 'sector',
        sortType: 'alphanumeric',
        disableFilters: true,
      },
      {
        Header: 'More Info',
        id: 'expander',
        sortType: 'disabled',
        Cell: ({ row }) => ExpanderCell(row),
      },
    ],
    []
  );

  const getTableContentFromArray = (datasetsList) => {
    return datasetsList?.map((datasetItem) => {
      return {
        logo: datasetTypeIcons[datasetItem?.dataset_type?.toLowerCase()]?.image,
        name: datasetItem?.title,
        provider: datasetItem?.catalog?.organization?.title,
        sector:
          datasetItem?.sector.map((item) => item.name).join(', ') || 'N/A',
        expander: (
          <InfoWrapper>
            {datasetItem?.datasetaccessmodel_set.length > 0 ? (
              datasetItem?.datasetaccessmodel_set.map((model) => {
                return (
                  <DatasetModelWrapper
                    key={model?.id}
                    item={{ ...model, refetch, datasetId: datasetItem.id }}
                    session={session}
                  />
                );
              })
            ) : (
              <Flex justifyContent={'center'} padding="15px">
                <Text>No Dataset Access Model for the dataset</Text>
              </Flex>
            )}
          </InfoWrapper>
        ),
      };
    });
  };

  return (
    <>
      <Head>
        <title>My Datasets List | {platform_name} (IDP)</title>
      </Head>

      <MainWrapper fullWidth>
        <DashboardHeader>
          <Heading as={'h1'} variant="h3" paddingBottom={'24px !important'}>
            My Datasets
          </Heading>
        </DashboardHeader>
        {loading || error ? (
          <Loader />
        ) : data.all_datasets?.length > 0 ? (
          <>
            {/* <DatasetGridCardsdata.all_datasets
              data={getCardContentFromArray(data.all_datasets)}
              ColumnHeaders={ColumnHeaders}
            /> */}
            <SortFilterListingTable
              title={''}
              columns={ColumnHeaders}
              data={getTableContentFromArray(data.all_datasets)}
              paginationEnable={false}
            />
            <GraphqlPagination
              total={AllDatasetsCount?.data?.all_datasets?.length}
              newPage={handleMyDatasetsPagination}
            />
          </>
        ) : (
          <NoResult label={'You have not consumed any datasets yet'} />
        )}
      </MainWrapper>
    </>
  );
};

export default withAuth(MyDatasetsList);

const InfoWrapper = styled.div`
  margin-top: 4px;
  width: 100%;
`;
