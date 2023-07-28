import { useMutation, useQuery } from '@apollo/client';
import { Loader } from 'components/common';
import { Box, DashboardHeader, Heading, NoResult } from 'components/layouts';
import { platform_name } from 'platform-constants';
import { CrossSize300 } from '@opub-icons/ui';
import { AddCircle, Delete, Paste } from '@opub-icons/workflow';
import { Button, Modal } from 'components/actions';
import SortFilterListingTable, {
  ExpanderCell,
} from 'components/common/SortFilterListingTable';
import { Text } from 'components/layouts';
import { Flex } from 'components/layouts/FlexWrapper';
import ApiSourceForm from 'components/pages/providers/datasets/CreationFlow/Api/NewApiSource';
import { MainWrapper } from 'components/pages/user/Layout';
import Head from 'next/head';
import React, { useState } from 'react';
import JSONPretty from 'react-json-pretty';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import {
  DELETE_API_SOURCE,
  GET_ALL_API_SOURCES,
  GET_API_SOURCE_BY_ID,
  mutation,
} from 'services';
import { resetDatasetStore } from 'slices/addDatasetSlice';
import styled from 'styled-components';
import { capitalizeFirstLetter } from 'utils/helper';
import { useProviderStore } from '../../../../../services/store';

const ApiSourcesListing = () => {
  // Reset Redux store to not fill values in Create API Form with recent dataset
  const dispatch = useDispatch();
  dispatch(resetDatasetStore());

  const [sourceModal, setSourceModal] = useState(false);

  const [editSourceID, setEditSourceID] = useState(null);

  const currentOrgRole = useProviderStore((e) => e.org);

  const GetAllApiSourcesListRes = useQuery(GET_ALL_API_SOURCES, {
    skip: !currentOrgRole?.org_id,
  });

  const GetAPISourceByIDRes: any = useQuery(GET_API_SOURCE_BY_ID, {
    variables: { api_source_id: editSourceID },
    skip: !editSourceID,
  });

  const [deleteApiSourceReq, deleteApiSourceRes] =
    useMutation(DELETE_API_SOURCE);

  GetAllApiSourcesListRes.error && toast.error(GetAllApiSourcesListRes.error);

  const ColumnHeaders = React.useMemo(
    () => [
      {
        Header: 'Title',
        accessor: 'title',
        sortType: (a, b) => {
          var a1 = a.values['title'].toLowerCase();
          var b1 = b.values['title'].toLowerCase();
          if (a1 < b1) return 1;
          else if (a1 > b1) return -1;
          else return 0;
        },
        disableFilters: true,
        maxWidth: 200,
        minWidth: 100,
      },
      {
        Header: 'Published Datasets',
        accessor: 'apidetails_set',
        sortType: 'disabled',
        disableFilters: true,
        Cell: (props) => (
          <List>
            {props.row.original.apidetails_set.map((item, index) => (
              <li key={index}>
                {item}
                {props.row.original.apidetails_set.length !== index + 1 && ','}
              </li>
            ))}
          </List>
        ),
      },
      {
        Header: 'Base URL',
        accessor: 'baseURL',
        sortType: 'alphanumeric',
        disableFilters: true,
      },
      {
        Header: 'Actions',
        id: 'actions',
        sortType: 'disabled',
        Cell: (props) => (
          <Flex gap={'5px'} justifyContent={'center'} alignItems={'center'}>
            <Button
              size="sm"
              kind="primary-outline"
              as="a"
              icon={<Paste width={12} />}
              onPress={() => {
                setSourceToEdit(props.row.original.id);
              }}
              title="Clone the API Source"
            >
              Clone
            </Button>

            <Button
              size="md"
              kind="secondary-outline"
              as="a"
              icon={<Delete width={20} />}
              iconOnly
              isDisabled={props.row.original.linked !== 0}
              title={
                props.row.original.linked
                  ? `Cannot delete API source as ${props.row.original.linked} dataset(s) are linked`
                  : 'Delete the API Source'
              }
              onPress={() => {
                deleteAPIsource(props.row.original.id);
              }}
            >
              Delete
            </Button>
          </Flex>
        ),
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

  const getTableFromArray = (apiSourcesList) => {
    return apiSourcesList?.map((apiSourceItem) => {
      return {
        logo: '',
        id: apiSourceItem.id,
        title: apiSourceItem.title,
        baseURL: apiSourceItem.base_url,
        apidetails_set: apiSourceItem.apidetails_set.map((item) => {
          return item.resource.title;
        }),
        linked: apiSourceItem.all_dataset_count,
        expander: (
          <Box>
            <Flex flexDirection={'column'} margin={'10px'} gap="5px">
              <Text>
                <Text fontWeight={'bold'}>Description: </Text>
                {apiSourceItem.description}
              </Text>
              <Text>
                <Text fontWeight={'bold'}>Authorization In: </Text>
                {apiSourceItem.auth_loc}
              </Text>
              {apiSourceItem.api_version && (
                <Text>
                  <Text fontWeight={'bold'}>Version: </Text>
                  {apiSourceItem.api_version}
                </Text>
              )}
              {apiSourceItem.auth_type && (
                <Text>
                  <Text fontWeight={'bold'}>Auth type: </Text>
                  {capitalizeFirstLetter(apiSourceItem.auth_type.toLowerCase())}
                </Text>
              )}
              {apiSourceItem.auth_credentials && (
                <Text>
                  <Text fontWeight={'bold'}>Auth Credentials: </Text>
                  <JSONPretty
                    data={JSON.parse(apiSourceItem.auth_credentials)}
                  />
                </Text>
              )}
              {apiSourceItem.headers.length > 0 && (
                <Text>
                  <Text fontWeight={'bold'}>Common Headers: </Text>
                  {apiSourceItem.headers.map((headerItem, index) => (
                    <div key={index}>
                      <JSONPretty data={JSON.parse(headerItem)} />
                      <br />
                    </div>
                  ))}
                </Text>
              )}
            </Flex>
          </Box>
        ),
      };
    });
  };

  const deleteAPIsource = (ApiSourceID) => {
    mutation(deleteApiSourceReq, deleteApiSourceRes, {
      api_source_id: ApiSourceID,
    })
      .then((res) => {
        if (res.delete_api_source.success) {
          toast.success('Deleted API Source successfully');
          GetAllApiSourcesListRes.refetch();
        } else {
          toast.error(res.delete_api_source.errors.id[0]);
        }
      })
      .catch((err) => {
        toast.error('Failed to delete API Source. Error: ' + err.message);
      });
  };

  const setSourceToEdit = (ApiSourceID) => {
    setEditSourceID(ApiSourceID);
    setSourceModal(!sourceModal);
  };

  return (
    <>
      <MainWrapper fullWidth>
        <Head>
          <title>API Sources | {platform_name} (IDP)</title>
        </Head>

        <DashboardHeader>
          <Heading variant="h3" as={'h1'}>
            API Sources
          </Heading>
          {/* <LinkButton
            label="Create New"
            href={`/providers/${router.query.provider}/dashboard/api-sources/create`}
            type="create"
          /> */}
          <Button
            size="sm"
            kind="primary-outline"
            icon={<AddCircle width={14} />}
            iconSide={'right'}
            onPress={() => {
              setEditSourceID(null);
              setSourceModal(true);
            }}
          >
            Create New
          </Button>
        </DashboardHeader>
        <Flex flexDirection={'column'}>
          {!GetAllApiSourcesListRes.loading && currentOrgRole?.org_id ? (
            !GetAllApiSourcesListRes.error &&
            GetAllApiSourcesListRes.data?.all_api_source_by_org?.length > 0 ? (
              <SortFilterListingTable
                columns={ColumnHeaders}
                data={getTableFromArray(
                  GetAllApiSourcesListRes.data?.all_api_source_by_org
                )}
                // renderRowSubComponent={renderRowSubComponent}
                title={''}
                globalSearchPlaceholder={'Search API Sources'}
              />
            ) : (
              <NoResult />
            )
          ) : (
            <Loader />
          )}
        </Flex>
      </MainWrapper>

      <Modal
        label={''}
        isOpen={sourceModal}
        modalHandler={() => {
          GetAllApiSourcesListRes.refetch();
          setEditSourceID(null);
        }}
      >
        <Wrapper>
          {GetAPISourceByIDRes.loading ? (
            <Loader />
          ) : (
            <>
              <ModalHeader>
                <div>
                  <Heading as="h2" variant="h3">
                    {editSourceID === null ? 'Add' : 'Clone'} API Source
                  </Heading>
                  <Button
                    // isDisabled={}
                    kind="custom"
                    size="md"
                    icon={<CrossSize300 />}
                    onPress={() => {
                      setEditSourceID(null);
                      setSourceModal(!sourceModal);
                    }}
                  />
                </div>
              </ModalHeader>
              <ApiSourceForm
                onMutationComplete={() => {
                  GetAllApiSourcesListRes.refetch();
                  setSourceModal(!sourceModal);
                }}
                apiData={
                  editSourceID === null
                    ? {}
                    : GetAPISourceByIDRes.data?.api_source
                }
              />
            </>
          )}
        </Wrapper>
      </Modal>
    </>
  );
};

export default ApiSourcesListing;

const List = styled.ul`
  text-align: left;
  li {
    list-style: none;
  }
`;

const Wrapper = styled.div`
  background-color: white;

  /* padding: 15px; */
  border-radius: 8px;
  display: flex;
  flex-direction: column;
`;

const ModalHeader = styled.div`
  > div {
    display: flex;
    justify-content: space-between;
    padding: 10px 15px;
  }
  Button {
    margin: auto 0;
    padding: 0;
  }
`;
