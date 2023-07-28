import React, { useState } from 'react';
import Head from 'next/head';
import { NoResult, TruncateText } from 'components/layouts';
import { useRouter } from 'next/router';
import { useMutation, useQuery } from '@apollo/client';
import { mutation, ORG_DATASETS_LIST, UPDATE_PATCH_OF_DATASET } from 'services';
import withAuth from 'utils/withAuth';
import styled from 'styled-components';
import { MainWrapper } from 'components/pages/user/Layout';
import { DatasetHeading } from 'components/pages/dashboard';
import { useConstants, useProviderStore } from 'services/store';
import { capitalizeFirstLetter, dateTimeFormat } from 'utils/helper';
import { Loader } from 'components/common';
import SortFilterListingTable, {
  formatDateTimeForTable,
  SelectColumnFilter,
} from 'components/common/SortFilterListingTable';
import { Flex } from 'components/layouts/FlexWrapper';
import { Button, Modal } from 'components/actions';
import { toast } from 'react-toastify';
import { Delete, Edit } from '@opub-icons/workflow';
import { Heading, Text } from 'components/layouts';
import { CrossSize300 } from '@opub-icons/ui';
import InfoTags from 'components/actions/InfoTags';
import { platform_name } from 'platform-constants';

const Drafts = () => {
  const router = useRouter();
  const currentOrgRole = useProviderStore((e) => e.org);
  const datasetTypeIcons = useConstants((e) => e.datasetTypeIcons);

  const OrgDatasetsListRes = useQuery(ORG_DATASETS_LIST, {
    variables: { status: 'DRAFT' },
    skip: !currentOrgRole?.org_id,
  });

  const [deleteDraftReq, deleteDraftRes] = useMutation(UPDATE_PATCH_OF_DATASET);

  const ColumnHeaders = React.useMemo(
    () => [
      {
        Header: 'Dataset Title',
        accessor: 'name',
        sortType: (a, b) => {
          var a1 = a.values['name'].toLowerCase();
          var b1 = b.values['name'].toLowerCase();
          if (a1 < b1) return 1;
          else if (a1 > b1) return -1;
          else return 0;
        },
        disableFilters: true,
        maxWidth: 300,
        minWidth: 100,
        Cell: ({ row }) => (
          <>
            <LogoContainer>{row.original.logo}</LogoContainer>

            <Text>{row.original.name}</Text>
          </>
        ),
      },
      {
        Header: 'Data Type',
        accessor: 'dataType',
        sortType: 'alphanumeric',
        Filter: SelectColumnFilter,
        filter: 'includes',
      },
      {
        Header: 'Created On',
        accessor: 'issued',
        sortType: (a, b) => {
          var a1 = new Date(a.values['issued']).getTime();
          var b1 = new Date(b.values['issued']).getTime();
          if (a1 < b1) return 1;
          else if (a1 > b1) return -1;
          else return 0;
        },
        disableFilters: true,
        Cell: (props) => {
          return formatDateTimeForTable(props.row.original.issued);
        },
      },
      {
        Header: 'Status',
        accessor: 'funnel',
        sortType: 'alphanumeric',
        Filter: SelectColumnFilter,
        filter: 'includes',
        Cell: (props) => {
          return (
            <Flex justifyContent={'center'}>
              <InfoTags
                statusName={props.row.original.funnel}
                variant="suspended"
              />
            </Flex>
          );
        },
      },
      {
        Header: 'Actions',
        accessor: 'actionable',
        disableFilters: true,
        sortType: 'disabled',
        width: 100,
      },
    ],
    []
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [draftItem, setDraftItem] = useState(false);

  const getTableContentFromArray = (draftsList) => {
    return draftsList?.map((draftItem) => {
      return {
        logo: datasetTypeIcons[draftItem?.dataset_type?.toLowerCase()]?.image,
        name: draftItem?.title,
        issued: dateTimeFormat(draftItem?.issued),
        funnel: getPreviousFunnelStatus(draftItem?.funnel),
        dataType: capitalizeFirstLetter(draftItem?.dataset_type.toLowerCase()),
        actionable: (
          <Flex
            alignItems="center"
            justifyContent={'center'}
            gap="10px"
            flexWrap={'wrap'}
          >
            <EditButton>
              <Button
                size="sm"
                kind="custom"
                title="Edit the Dataset"
                icon={<Edit />}
                onPress={() => {
                  router.push(
                    `/providers/${router.query.provider}/dashboard/datasets/create-new?datasetId=${draftItem?.id}&from=drafts`
                  );
                }}
              ></Button>
            </EditButton>
            <Button
              size="md"
              kind="custom"
              title="Delete the Dataset"
              icon={<Delete size={20} color="var(--color-error)" />}
              iconOnly
              onPress={() => {
                setDraftItem(draftItem);
                setIsModalOpen(true);
              }}
            />
          </Flex>
        ),
      };
    });
  };
  const [isLoading, setIsLoading] = useState(false);

  function modalHandler() {
    setIsModalOpen(!isModalOpen);
  }

  function DeleteDatasetModel({ draftItem, isOpen }) {
    return (
      <>
        <Modal
          isOpen={isOpen}
          modalHandler={() => modalHandler()}
          label="Add API Source"
        >
          <Wrapper>
            <ModalHeader>
              <div>
                <Heading as="h2" variant="h3">
                  Delete Dataset
                </Heading>
                <Button
                  kind="custom"
                  size="md"
                  icon={<CrossSize300 />}
                  onPress={() => setIsModalOpen(!isModalOpen)}
                />
              </div>
            </ModalHeader>
            <Line />
            <Heading
              as="h3"
              variant="h4"
              paddingTop="24px"
              padding={'24px'}
              fontWeight="400"
            >
              Are you sure you want to Delete the{' '}
              <strong>{draftItem.title}</strong> Dataset?
            </Heading>
            <Line />
            <Flex padding={'16px'} gap={'10px'} justifyContent="flex-end">
              <Button
                kind="primary-outline"
                onPress={() => setIsModalOpen(!isModalOpen)}
              >
                No, Cancel
              </Button>
              <Button
                kind="primary-outline"
                onPress={() => deleteDraft(draftItem)}
              >
                {' '}
                Delete Dataset
              </Button>
            </Flex>
          </Wrapper>
        </Modal>
      </>
    );
  }
  const deleteDraft = (draftItem) => {
    setIsLoading(true);
    mutation(deleteDraftReq, deleteDraftRes, {
      dataset_data: {
        funnel: draftItem.funnel,
        id: draftItem.id,
        status: 'DISABLED',
        title: draftItem.title,
        description: draftItem.description,
      },
    })
      .then((res) => {
        if (res.patch_dataset.success) {
          toast.success('Draft deleted successfully!');
          setIsLoading(false);
          OrgDatasetsListRes.refetch();
        } else {
          throw new Error(res.patch_dataset.errors.id[0]);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        toast.error('Error in deleting draft:  ' + err.message);
        setIsLoading(false);
      });
    setIsModalOpen(!isModalOpen);
  };

  const getPreviousFunnelStatus = (funnelItem) => {
    const funnelSteps = [
      'Created',
      'Metadata',
      'Distributions',
      'Data Access Model',
      'Additional Info',
      'Ready to Review',
    ];

    return funnelSteps[
      funnelSteps.findIndex((element) => element === funnelItem) - 1
    ];
  };

  return (
    <>
      <Head>
        <title>My Drafts | {platform_name} (IDP)</title>
      </Head>

      <DatasetHeading />

      <MainWrapper fullWidth>
        {OrgDatasetsListRes.loading || isLoading || !currentOrgRole?.org_id ? (
          <Loader />
        ) : OrgDatasetsListRes.data?.org_datasets?.length > 0 ? (
          <>
            <SortFilterListingTable
              columns={ColumnHeaders}
              data={getTableContentFromArray(
                OrgDatasetsListRes.data.org_datasets
              )}
              title={'My Drafts'}
              globalSearchPlaceholder="Search Datasets"
            />
            <DeleteDatasetModel isOpen={isModalOpen} draftItem={draftItem} />
          </>
        ) : (
          <NoResult label={'You have not created any datasets yet'} />
        )}
      </MainWrapper>

      {/* <DeleteDatasetModel /> */}
    </>
  );
};

export default withAuth(Drafts);

const EditButton = styled.div`
  color: var(--color-information);
  button {
    padding: 8px;
    svg {
      margin: 0;
    }
  }
`;
const Wrapper = styled.section`
  background-color: var(--color-background-lightest);
  max-height: 90vh;
  min-width: 629px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
`;
const ModalHeader = styled.div`
  > div {
    display: flex;
    justify-content: space-between;
    padding: 24px;
  }
  Button {
    margin: auto 0;
    padding: 0;
  }
`;
const Line = styled.div`
  border: 1px solid var(--color-gray-01);
  margin-inline: 20px;
`;

export const LogoContainer = styled.div`
  display: inline;
  margin-right: 10px;
  min-width: 30px;
`;
