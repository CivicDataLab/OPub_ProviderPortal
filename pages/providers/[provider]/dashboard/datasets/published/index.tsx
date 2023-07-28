import React, { useState } from 'react';
import Head from 'next/head';
import { Heading, NoResult, TruncateText, Text } from 'components/layouts';
import { Button, Modal } from 'components/actions';
import { useRouter } from 'next/router';
import { useMutation, useQuery } from '@apollo/client';
import {
  GET_REVIEW_REQUEST_USER,
  mutation,
  NEW_VERSION_DATASET_ID_REQUEST,
} from 'services';
import withAuth from 'utils/withAuth';
import { Flex } from 'components/layouts/FlexWrapper';
import { DatasetHeading } from 'components/pages/dashboard';
import { MainWrapper } from 'components/pages/user/Layout';
import { Loader } from 'components/common';
import SortFilterListingTable, {
  formatDateTimeForTable,
  SelectColumnFilter,
} from 'components/common/SortFilterListingTable';
import { dateTimeFormat } from 'utils/helper';
import { useConstants, useProviderStore } from 'services/store';
import { toast } from 'react-toastify';
import { Link } from 'components/layouts/Link';
import { CrossSize300 } from '@opub-icons/ui';
import styled from 'styled-components';
import { NameWrapper } from '../under-review';
import { TextField } from 'components/form';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { LogoContainer } from '../drafts';
import { platform_name } from 'platform-constants';
import { Download } from '@opub-icons/workflow';

const validationSchema = Yup.object().shape({
  version_name: Yup.string().required('Required'),
});

const PublishedDatasets = () => {
  const router = useRouter();
  const datasetTypeIcons = useConstants((e) => e.datasetTypeIcons);
  const currentOrgRole = useProviderStore((e) => e.org);

  const ReviewRequestsByUserRes = useQuery(GET_REVIEW_REQUEST_USER, {
    skip: !currentOrgRole?.org_id,
  });

  const [GetNewVersionDatasetIDRes, GetNewVersionDatasetIDReq] = useMutation(
    NEW_VERSION_DATASET_ID_REQUEST
  );

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
        maxWidth: 200,
        minWidth: 100,
        Cell: ({ row }) => (
          <>
            <LogoContainer>{row.original.logo}</LogoContainer>
            <Link target="_blank" href={`/datasets/${row.original.id}`}>
              <Text>{row.original.name}</Text>
            </Link>
          </>
        ),
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
        Header: 'Published On',
        accessor: 'modified',
        sortType: (a, b) => {
          var a1 = new Date(a.values['modified']).getTime();
          var b1 = new Date(b.values['modified']).getTime();
          if (a1 < b1) return 1;
          else if (a1 > b1) return -1;
          else return 0;
        },
        disableFilters: true,
        Cell: (props) => {
          return formatDateTimeForTable(props.row.original.modified);
        },
      },
      {
        Header: 'Data Type',
        accessor: 'dataType',
        sortType: 'alphanumeric',
        Filter: SelectColumnFilter,
        filter: 'includes',
      },
      {
        Header: 'Update Frequency',
        accessor: 'frequency',
        sortType: 'alphanumeric',
        disableFilters: true,
      },
      {
        Header: 'Action',
        accessor: 'actionable',
        disableFilters: true,
        sortType: 'disabled',
        width: 100,
      },
      {
        Header: 'Agreement',
        accessor: 'agreement',
        disableFilters: true,
        sortType: 'disabled',
        Cell: ({ row }) => (
          <>
            <AgreementWrapper>
              <Button
                as="a"
                target="_blank"
                kind="primary-outline"
                icon={<Download />}
                href={`${process.env.NEXT_PUBLIC_BACKEND_URL}/public/${row.original.agreement}`}
              />
            </AgreementWrapper>
          </>
        ),
      },
    ],
    []
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [publishedItem, setPublishedItem] = useState(false);
  const [oldDatasetId, setOldDatasetId] = useState('');

  const getTableContentFromArray = (draftsList) => {
    return draftsList?.map((reqItem) => {
      return {
        id: reqItem.dataset?.id,
        logo: datasetTypeIcons[reqItem.dataset?.dataset_type?.toLowerCase()]
          ?.image,
        name: reqItem.dataset?.title,
        issued: dateTimeFormat(reqItem.dataset?.issued),
        modified: dateTimeFormat(reqItem.modified_date),
        dataType: reqItem.dataset?.dataset_type,
        frequency: reqItem.dataset?.update_frequency,
        agreement: reqItem.dataset?.accepted_agreement,
        actionable: (
          <Flex
            alignItems={'center'}
            justifyContent={'center'}
            flexWrap={'wrap'}
            gap="10px"
          >
            <Button
              size="sm"
              title="Edit Dataset"
              kind="primary-outline"
              onPress={() => {
                setOldDatasetId(reqItem.dataset.id);
                setIsModalOpen(true);
              }}
            >
              Move to Drafts
            </Button>
          </Flex>
        ),
      };
    });
  };

  const [isLoading, setIsLoading] = useState(false);

  function modalHandler() {
    setIsModalOpen(!isModalOpen);
  }
  const initialValues = {
    version_name: '',
  };

  const formik: any = useFormik({
    initialValues,
    validationSchema,
    validateOnChange: false,
    onSubmit: (values, { resetForm }) => {
      setIsLoading(true);
      mutation(GetNewVersionDatasetIDRes, GetNewVersionDatasetIDReq, {
        dataset_data: {
          id: oldDatasetId,
          new_version_name: values.version_name,
        },
      })
        .then((res) => {
          if (res.edit_dataset.success) {
            router.push(
              `/providers/${router.query.provider}/dashboard/datasets/create-new?datasetId=${res.edit_dataset.dataset_id}`
            );
            resetForm({
              values: initialValues,
            });
            setIsLoading(false);
          } else {
            setIsLoading(false);
            resetForm({
              values: initialValues,
            });
            throw new Error(res.edit_dataset.errors.id[0]);
          }
        })
        .catch((err) => {
          toast.error('Error in editing the dataset :::: ' + err.message);
          resetForm({
            values: initialValues,
          });
          setIsLoading(false);
        });
      setIsModalOpen(!isModalOpen);
      setOldDatasetId('');
    },
  });

  const { errors } = formik;

  return (
    <>
      <Head>
        <title>Published Datasets | {platform_name} (IDP)</title>
      </Head>

      <DatasetHeading />
      <MainWrapper fullWidth>
        {ReviewRequestsByUserRes.loading ||
        isLoading ||
        !currentOrgRole?.org_id ? (
          <Loader />
        ) : ReviewRequestsByUserRes.data?.review_request_user?.filter(
            (reqItem) => {
              if (
                currentOrgRole.role === 'DPA' &&
                reqItem.request_type === 'MODERATION' &&
                reqItem.status === 'APPROVED'
              ) {
                return reqItem;
              } else if (
                currentOrgRole.role === 'DP' &&
                reqItem.request_type === 'REVIEW' &&
                reqItem.status === 'ADDRESSED' &&
                reqItem.parent_field[0]?.status === 'APPROVED'
              ) {
                return reqItem;
              }
            }
          ).length > 0 ? (
          <>
            <SortFilterListingTable
              columns={ColumnHeaders}
              data={getTableContentFromArray(
                ReviewRequestsByUserRes.data?.review_request_user
                  .filter((reqItem) => {
                    if (
                      currentOrgRole.role === 'DPA' &&
                      reqItem.request_type === 'MODERATION' &&
                      reqItem.status === 'APPROVED'
                    ) {
                      return reqItem;
                    } else if (
                      currentOrgRole.role === 'DP' &&
                      reqItem.request_type === 'REVIEW' &&
                      reqItem.status === 'ADDRESSED' &&
                      reqItem.parent_field[0]?.status === 'APPROVED'
                    ) {
                      return reqItem;
                    }
                  })
                  .map((reqItem) => {
                    if (
                      reqItem.request_type === 'REVIEW' &&
                      reqItem.status === 'ADDRESSED' &&
                      reqItem.parent_field[0]?.status === 'APPROVED'
                    ) {
                      return {
                        dataset: reqItem.dataset,
                        ...reqItem.parent_field[0],
                      };
                    } else return reqItem;
                  })
              )}
              globalSearchPlaceholder="Search Published Datasets"
              title={'Published Datasets'}
            />
            <Modal
              isOpen={isModalOpen}
              modalHandler={() => modalHandler()}
              label="Add API Source"
            >
              <Wrapper>
                <ModalHeader>
                  <div>
                    <Heading as="h2" variant="h3">
                      Move Dataset to Drafts
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
                  paddingX={'24px'}
                  fontWeight="400"
                >
                  Are you sure you want to Move it to Drafts for Editing?
                </Heading>

                <Text
                  paddingTop="6px"
                  paddingX={'24px'}
                  paddingBottom={'24px'}
                  fontWeight="400"
                >
                  Note: If yes, then a new copy/revision of this Datasets will
                  be created. This new copy will replace the Original one after
                  moderation by PMU.
                </Text>
                <InputWrapper>
                  <TextField
                    label="Version Name"
                    name="version_name"
                    isRequired
                    placeholder="New version name"
                    value={formik.values.version_name}
                    onChange={(e) => {
                      formik.setFieldValue('version_name', e);
                      errors.version_name &&
                        formik.validateField('version_name');
                    }}
                    errorMessage={errors.version_name}
                  />
                </InputWrapper>
                <Line />
                <Flex padding={'16px'} gap={'10px'} justifyContent="flex-end">
                  <Button
                    kind="primary-outline"
                    onPress={() => setIsModalOpen(!isModalOpen)}
                  >
                    No, Cancel
                  </Button>
                  <Button kind="primary-outline" onPress={formik.handleSubmit}>
                    {' '}
                    Move to Drafts
                  </Button>
                </Flex>
              </Wrapper>
            </Modal>
          </>
        ) : (
          <NoResult />
        )}
      </MainWrapper>
    </>
  );
};

export default withAuth(PublishedDatasets);
const Wrapper = styled.section`
  background-color: var(--color-background-lightest);
  max-height: 90vh;
  min-width: 629px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
`;

const InputWrapper = styled.div`
  padding-inline: 24px;
  margin-bottom: 10px;
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

const AgreementWrapper = styled.div`
  a {
    padding: 5px 10px;
    margin: auto;
    svg {
      margin: auto;
    }
  }
`;
