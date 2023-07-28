import { Button, Modal } from 'components/actions';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { fetchProvidersDataUnderOrg } from 'utils/fetch';
import * as Yup from 'yup';
import { Close, Delete } from '@opub-icons/workflow';
import { Loader } from 'components/common';
import SortFilterListingTable, {
  formatDateTimeForTable,
} from 'components/common/SortFilterListingTable';
import { Heading, NoResult, Text } from 'components/layouts';
import { Flex } from 'components/layouts/FlexWrapper';
import { MainWrapper } from 'components/pages/user/Layout';
import Head from 'next/head';
import React from 'react';
import { useProviderStore } from 'services/store';
import { ModalContainer } from '../../consumer-base/reviews';
import { useMutation, useQuery } from '@apollo/client';
import {
  DELETE_ORGANIZATION_REQUEST,
  ORGANIZATION_WITHOUT_DPA,
} from 'services/schema';
import { ADD_ORG_PROVIDER, mutation } from 'services';
import styled from 'styled-components';
import { Select, TextField } from 'components/form';
import { useFormik } from 'formik';
import ViewProfile from 'components/pages/viewprofile';
import { platform_name } from 'platform-constants';

const validationSchema = Yup.object().shape({
  email: Yup.string().email('Please enter correct email').required('Required'),
  org_id: Yup.string().required('Required'),
});

const ProvidersManagement = () => {
  const [providersList, setProviderList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const currentOrgRole = useProviderStore((e) => e.org);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [providerForRemoval, setProviderForRemoval] = useState();
  const [isDPModalOpen, setIsDPModalOpen] = useState(false);

  const [createAddProvReq, createAddProvRes] = useMutation(ADD_ORG_PROVIDER);

  const { data: session } = useSession();

  useEffect(() => {
    currentOrgRole?.org_id &&
      session &&
      fetchProvidersDataUnderOrg(
        session['access']?.token || '',
        currentOrgRole.org_id
      )
        .then((res) => {
          res.Success === true
            ? setProviderList(res.providers)
            : toast.error(res.error);
          setIsLoading(false);
        })
        .catch((err) => {
          toast.error(err);
          setIsLoading(false);
        });
  }, [session, currentOrgRole, isLoading, isDPModalOpen]);

  const [deleteOrganizationReq, deleteOrganizationRes] = useMutation(
    DELETE_ORGANIZATION_REQUEST
  );

  const { data, loading, error } = useQuery(ORGANIZATION_WITHOUT_DPA, {
    variables: { organization_id: currentOrgRole?.org_id },
    skip: !currentOrgRole?.org_id,
  });
  const currentOrg = {
    label: currentOrgRole?.org_title,
    value: currentOrgRole?.org_id,
  };

  const orgList =
    data?.organization_without_dpa === null
      ? [currentOrg]
      : data?.organization_without_dpa?.map((v) => ({
          label: v.title,
          value: v.id,
        }));

  data?.organization_without_dpa !== null && orgList?.push(currentOrg);

  const removeUser = (userInfo) => {
    setIsLoading(true);

    mutation(deleteOrganizationReq, deleteOrganizationRes, {
      delete_organization_request: {
        id: +userInfo.org_id,
        status: 'DELETED',
        username: userInfo.username,
        remark: 'Delete Provider',
      },
    })
      .then((res) => {
        if (res.delete_organization_request.success === 'true') {
          toast.success('User removed from the Organization');
        } else {
          toast.error('Error in User List Call');
        }
      })
      .catch((res) => {
        toast.error(res?.delete_organization_request?.error);
      });
  };

  const modalHandler = () => {
    setIsModalOpen(!isModalOpen);
  };

  const ColumnHeaders = React.useMemo(
    () => [
      {
        Header: 'Username',
        accessor: 'username',
        sortType: (a, b) => {
          var a1 = a.values['username'].toLowerCase();
          var b1 = b.values['username'].toLowerCase();
          if (a1 < b1) return 1;
          else if (a1 > b1) return -1;
          else return 0;
        },
        disableFilters: true,
        maxWidth: 200,
        minWidth: 100,
        Cell: (props) => {
          return <ViewProfile username={props.row.original.username} />;
        },
      },
      {
        Header: 'Email',
        accessor: 'email',
        sortType: (a, b) => {
          var a1 = a.values['email'].toLowerCase();
          var b1 = b.values['email'].toLowerCase();
          if (a1 < b1) return 1;
          else if (a1 > b1) return -1;
          else return 0;
        },
        disableFilters: true,
        maxWidth: 200,
        minWidth: 100,
      },
      {
        Header: 'Organisation Title',
        accessor: 'org_title',
        sortType: (a, b) => {
          var a1 = a.values['email'].toLowerCase();
          var b1 = b.values['email'].toLowerCase();
          if (a1 < b1) return 1;
          else if (a1 > b1) return -1;
          else return 0;
        },
        disableFilters: true,
        maxWidth: 200,
        minWidth: 100,
      },
      {
        Header: 'Date of Joining',
        accessor: 'modified',
        disableFilters: true,
        sortType: (a, b) => {
          var a1 = new Date(a.values['modified']).getTime();
          var b1 = new Date(b.values['modified']).getTime();
          if (a1 < b1) return 1;
          else if (a1 > b1) return -1;
          else return 0;
        },
        Cell: (props) => {
          return formatDateTimeForTable(props.row.original.modified);
        },
      },

      {
        Header: 'Action',
        accessor: 'actionable',
        disableFilters: true,
        sortType: 'disabled',
        minWidth: 400,
      },
    ],
    []
  );

  const getUserList = (providersList) => {
    return providersList.map((provider) => {
      return {
        username: provider.username,
        email: provider.email,
        modified: provider.updated,
        org_title: provider.org_title,
        actionable: (
          <Flex
            alignItems={'center'}
            justifyContent={'center'}
            flexWrap={'wrap'}
          >
            <Button
              kind="custom"
              icon={<Delete color="var(--color-error)" />}
              iconOnly
              onPress={() => {
                modalHandler(), setProviderForRemoval(provider);
              }}
              title={'Remove the provider'}
            >
              Remove
            </Button>
          </Flex>
        ),
      };
    });
  };

  const dpModalHandler = () => {
    setIsDPModalOpen(!isDPModalOpen);
  };

  const initialValues = {
    email: '',
    org_id: '',
  };

  const formik: any = useFormik({
    initialValues,
    // validate,
    validationSchema,
    validateOnChange: false,
    onSubmit: (values, { resetForm }) => {
      let submitValues: any = { ...values };

      const mutationRequest = {
        organization_request: {
          user_email: values.email,
          organization: values.org_id,
          description: 'dummy',
        },
      };
      setIsLoading(true);
      // add mutation
      mutation(createAddProvReq, createAddProvRes, mutationRequest)
        .then((response) => {
          toast.success('Provider Added Successfully');
          resetForm({
            values: initialValues,
          });
          dpModalHandler();
          setIsLoading(false);
        })
        .catch(() => {
          toast.error('Error in adding provider');
          dpModalHandler();
          setIsLoading(false);
        });
    },
  });
  const { values, errors, setFieldValue } = formik;

  return (
    <>
      {currentOrgRole?.role === 'DPA' && (
        <Wrapper>
          <Heading variant="h3" as="h1">
            Here to add Data Provider?
          </Heading>
          <Button
            size="sm"
            onPress={() => {
              dpModalHandler();
              formik.resetForm();
            }}
            title={'Add Data Provider'}
          >
            Add Data Provider
          </Button>
        </Wrapper>
      )}
      <MainWrapper fullWidth>
        <Head>
          <title>Data Providers | {platform_name} (IDP)</title>
        </Head>
        <>
          {isLoading || !currentOrgRole?.org_id ? (
            <Loader />
          ) : providersList?.length ? (
            <SortFilterListingTable
              data={getUserList(providersList)}
              columns={ColumnHeaders}
              title={'Data Providers'}
              globalSearchPlaceholder="Search Providers"
            />
          ) : (
            <NoResult label="No Data Providers Found" />
          )}
          {/* Remove Provider Modal */}
          <Modal
            isOpen={isModalOpen}
            modalHandler={() => modalHandler()}
            label="Confirmation Modal"
          >
            <ModalContainer>
              <Flex justifyContent={'space-between'} alignItems={'center'}>
                <Text as={'h2'}>Confirmation</Text>
                <Button
                  kind="custom"
                  icon={<Close />}
                  onPress={() => modalHandler()}
                />
              </Flex>

              <p>Are you sure you want to remove this Data Provider?</p>
              <Flex
                flexDirection={'row'}
                justifyContent={'flex-end'}
                gap={'10px'}
              >
                <Button
                  onPress={() => {
                    modalHandler();
                  }}
                  kind="primary-outline"
                  className="downloadButton"
                >
                  Cancel
                </Button>
                <Button
                  onPress={() => {
                    removeUser(providerForRemoval);
                    modalHandler();
                  }}
                  kind="primary"
                >
                  Submit
                </Button>
              </Flex>
            </ModalContainer>
          </Modal>
          {/* Add Data Provider Modal */}
          <Modal
            isOpen={isDPModalOpen}
            modalHandler={() => dpModalHandler()}
            label="Add Data Provider"
          >
            <DataProviderModal>
              <ModalContainer>
                <Flex justifyContent={'space-between'} alignItems={'center'}>
                  <Heading as={'h2'} variant={'h3'}>
                    Add Data Provider
                  </Heading>
                  <Button
                    kind="custom"
                    icon={<Close />}
                    onPress={() => dpModalHandler()}
                  />
                </Flex>
                <TextField
                  label="Email"
                  name="email"
                  isRequired
                  placeholder="Email of Data Provider"
                  value={formik.values.email}
                  onChange={(e) => {
                    formik.setFieldValue('email', e);
                    errors.email && formik.validateField('email');
                  }}
                  errorMessage={errors.email}
                />
                <Select
                  options={orgList}
                  inputId={formik.org_id}
                  errorMessage={errors.org_id}
                  isRequired
                  onChange={(e) => {
                    formik.setFieldValue('org_id', e.value);
                    if (errors.org_id) errors.org_id = false;
                  }}
                  label={'Select Organisation'}
                />
                <Flex
                  flexDirection={'row'}
                  justifyContent={'flex-end'}
                  gap={'10px'}
                >
                  <Button
                    onPress={() => {
                      dpModalHandler();
                    }}
                    kind="primary-outline"
                    className="downloadButton"
                  >
                    Cancel
                  </Button>
                  <Button onPress={formik.handleSubmit} kind="primary">
                    Add
                  </Button>
                </Flex>
              </ModalContainer>
            </DataProviderModal>
          </Modal>
        </>
      </MainWrapper>
    </>
  );
};

export default ProvidersManagement;

const Wrapper = styled.div`
  padding: 24px;
  background-color: var(--color-white);
  margin-bottom: 24px;

  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
`;
const DataProviderModal = styled.form`
  > div {
    padding: 20px;
    min-width: 600px;
  }
`;
