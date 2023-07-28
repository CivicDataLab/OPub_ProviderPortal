import { useMutation, useQuery } from '@apollo/client';
import {
  DashboardHeader,
  Heading,
  NoResult,
  TruncateText,
} from 'components/layouts';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { GET_CONSUMERS_BY_ORGANIZATION_ID } from 'services';
import { Text } from 'components/layouts/Text';
import { Link } from 'components/layouts/Link';
import { MainWrapper } from 'components/pages/user/Layout';
import { Loader } from 'components/common';
import React from 'react';
import { useProviderStore } from 'services/store';
import { capitalizeFirstLetter } from 'utils/helper';
import SelectSortFilterListingTable from 'components/common/SelectSortFilterListingTable';
import { Flex } from 'components/layouts/FlexWrapper';
import { Button, Modal } from 'components/actions';
import styled from 'styled-components';
import { CrossSize300 } from '@opub-icons/ui';
import { TextArea, TextField } from 'components/form';
import { Aside } from 'components/pages/providers/datasets';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { sendEmailToConsumers } from 'utils/fetch';
import { useSession } from 'next-auth/react';
import { toast } from 'react-toastify';
import { platform_name } from 'platform-constants';

const validationSchema = Yup.object().shape({
  subject: Yup.string()
    .min(25, 'Length should have atleast 25 characters')
    .max(200, 'Length should not be more than 200 characters')
    .required('Required'),
  message: Yup.string()
    .min(25, 'Length should have atleast 25 characters')
    .max(1000, 'Length should not be more than 200 characters')
    .required('Required'),
});

const ConsumerList = () => {
  const [consumersList, setConsumersList] = useState([]);
  const [consumersSelectionList, setConsumersSelectionList] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  const currentOrgRole = useProviderStore((e) => e.org);
  const { data: session } = useSession();

  const initialValues = {
    subject: '',
    message: '',
  };

  const formik: any = useFormik({
    initialValues,
    validationSchema,
    validateOnChange: false,
    onSubmit: (values, { resetForm }) => {
      sendEmailToConsumers({
        token: session['access'].token,
        organization: currentOrgRole?.org_id,
        formData: {
          user: session.user.email,
          org_id: currentOrgRole?.org_id,
          subject: values.subject,
          msg: values.message,
          consumers: [
            ...new Set(
              Object.keys(consumersSelectionList).map((element) => {
                return getConsumerListTableRows(consumersList)[element].user;
              })
            ),
          ],
        },
      })
        .then((res) => {
          if (res.Success) {
            resetForm();
            modalHandler(!consumersSelectionList);
            toast.success('Email sent to consumers successfully');
          } else {
            throw new Error(res.error);
          }
        })
        .catch((err) => {
          toast.error(err);
        });
    },
  });

  const { values, errors } = formik;

  const GetConsumersByOrgRes = useQuery(GET_CONSUMERS_BY_ORGANIZATION_ID, {
    skip: !currentOrgRole?.org_id,
  });

  useEffect(() => {
    GetConsumersByOrgRes.data &&
      setConsumersList(
        GetConsumersByOrgRes.data.data_access_model_request_org.filter(
          (item) => item.status === 'APPROVED'
        )
      );
  }, [GetConsumersByOrgRes.data]);

  const ColumnHeaders = React.useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'user',
        sortType: (a, b) => {
          var a1 = a.values['user'].toLowerCase();
          var b1 = b.values['user'].toLowerCase();
          if (a1 < b1) return 1;
          else if (a1 > b1) return -1;
          else return 0;
        },

        filter: 'includes',
      },
      {
        Header: 'Dataset Title',
        accessor: 'dataset',
        sortType: (a, b) => {
          var a1 = a.values['dataset'].toLowerCase();
          var b1 = b.values['dataset'].toLowerCase();
          if (a1 < b1) return 1;
          else if (a1 > b1) return -1;
          else return 0;
        },

        filter: 'includes',
        Cell: (props) => (
          <Link
            target="_blank"
            href={`/datasets/${props.row.original.datasetSlug}`}
            passsHref
          >
            <TruncateText
              linesToClamp={2}
              title={`${props.row.original.dataset}`}
            >
              {props.row.original.dataset}
              {props.row.original.versionName !== 'Original' &&
                props.row.original.versionName}
            </TruncateText>
          </Link>
        ),
      },
      {
        Header: 'Access Type',
        accessor: 'type',
        sortType: (a, b) => {
          var a1 = a.values['type'].toLowerCase();
          var b1 = b.values['type'].toLowerCase();
          if (a1 < b1) return 1;
          else if (a1 > b1) return -1;
          else return 0;
        },

        filter: 'includes',
      },
      {
        Header: 'Dataset Access Model',
        accessor: 'datasetAccessModel',
        sortType: (a, b) => {
          var a1 = a.values['datasetAccessModel'].toLowerCase();
          var b1 = b.values['datasetAccessModel'].toLowerCase();
          if (a1 < b1) return 1;
          else if (a1 > b1) return -1;
          else return 0;
        },

        filter: 'includes',
      },
      {
        Header: 'Validity',
        accessor: 'validation',
        sortType: (a, b) => {
          var a1 = a.values['validation']
            ?.concat(' ', a.values['validity'])
            .toLowerCase();
          var b1 = b.values['validation']
            ?.concat(' ', b.values['validity'])
            .toLowerCase();
          if (a1 < b1) return 1;
          else if (a1 > b1) return -1;
          else return 0;
        },
        disableFilters: true,
        Cell: (props) => (
          <Text>
            {props.row.original.validity && props.row.original.validation
              ? `${
                  props.row.original.validity.toLowerCase() === 'lifetime'
                    ? ''
                    : props.row.original.validation
                } ${capitalizeFirstLetter(
                  props.row.original.validity.toLowerCase()
                )}${
                  props.row.original.validity.toLowerCase() === 'lifetime'
                    ? ''
                    : '(s)'
                }`
              : '-'}
          </Text>
        ),
      },
    ],
    []
  );

  const modalHandler = (isTrue) => {
    setIsModalOpen(isTrue);
  };

  const handleRowSelection = React.useCallback((rowArray) => {
    setConsumersSelectionList(rowArray);
  }, []);

  const getConsumerListTableRows = (consumersList) => {
    return consumersList.map((consumerItem) => {
      return {
        user: consumerItem.user,
        datasetAccessModel: consumerItem.access_model?.title || '-',
        dataset: consumerItem.access_model?.dataset?.title,
        versionName: consumerItem.access_model?.dataset?.version_name,
        datasetSlug: consumerItem.access_model?.dataset?.slug,
        type: capitalizeFirstLetter(
          consumerItem.access_model?.data_access_model?.type.toLowerCase()
        ),
        validation:
          consumerItem.access_model?.data_access_model?.validation || '',
        validity:
          consumerItem.access_model?.data_access_model?.validation_unit || '',
      };
    });
  };

  return (
    <MainWrapper fullWidth>
      <Head>
        <title>Data Consumers | {platform_name} (IDP)</title>
      </Head>

      <Modal
        isOpen={isModalOpen}
        modalHandler={() => modalHandler(true)}
        label="Add API Source"
      >
        <Wrapper>
          <header>
            <Flex
              justifyContent={'space-between'}
              alignItems={'center'}
              paddingBottom={'20px'}
            >
              <Text as={'h2'}>E-mail</Text>
              <Button
                iconOnly
                kind="custom"
                size="md"
                icon={<CrossSize300 width={'15px'} />}
                onPress={() => setIsModalOpen(!isModalOpen)}
              />
            </Flex>
          </header>
          <EmailForm
            onSubmit={(e) => {
              e.preventDefault();
            }}
            noValidate
          >
            <Aside
              title={
                'Please note that the mail will not be sent to IP addresses '
              }
            />
            <TextField
              label={'To'}
              isDisabled={true}
              value={[
                ...new Set(
                  Object.keys(consumersSelectionList).map((element) => {
                    return getConsumerListTableRows(consumersList)[element]
                      .user;
                  })
                ),
              ].join(', ')}
            />
            <TextField
              isRequired
              id="emailSubject"
              errorMessage={errors.subject}
              name="subject"
              minLength={25}
              maxLength={200}
              value={values.subject}
              label={'Subject'}
              onChange={(e) => {
                formik.setFieldValue('subject', e);
                if (errors.subject) errors.subject = false;
              }}
            />
            <TextArea
              label={'Message'}
              rows={'10'}
              isRequired
              id="emailContent"
              errorMessage={errors.message}
              name="message"
              minLength={25}
              maxLength={1000}
              value={values.message}
              onChange={(e) => {
                formik.setFieldValue('message', e);
                if (errors.message) errors.message = false;
              }}
            />

            <Flex justifyContent={'flex-end'} gap="10px">
              <Button
                size="sm"
                kind="secondary-outline"
                onPress={() => {
                  formik.resetForm();
                  modalHandler(!isModalOpen);
                }}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                kind="primary"
                type="button"
                onPress={(e) => formik.handleSubmit(e)}
              >
                Send
              </Button>
            </Flex>
          </EmailForm>
        </Wrapper>
      </Modal>
      <DashboardHeader>
        <Heading as={'h1'} variant="h3" paddingBottom={'24px !important'}>
          Data Consumers
        </Heading>
        {Object.keys(consumersSelectionList).length > 0 && (
          <Flex
            gap="10px"
            alignItems={'center'}
            justifyContent={'flex-end'}
            marginBottom={'10px'}
          >
            <Text>{Object.keys(consumersSelectionList).length} Selected</Text>
            <Button size="sm" onPress={modalHandler}>
              Draft Email
            </Button>
          </Flex>
        )}
      </DashboardHeader>
      {GetConsumersByOrgRes.loading || !currentOrgRole?.org_id ? (
        <Loader />
      ) : consumersList?.length > 0 ? (
        <SelectSortFilterListingTable
          data={getConsumerListTableRows(consumersList)}
          columns={ColumnHeaders}
          title={''}
          globalSearchPlaceholder="Search Consumers"
          onRowSelect={(e) => handleRowSelection(e)}
          initialState={{
            selectedRowIds: consumersSelectionList,
          }}
        />
      ) : (
        <NoResult />
      )}
    </MainWrapper>
  );
};

export default ConsumerList;

const Wrapper = styled.div`
  background-color: #fff;
  width: 45em;
  max-height: fit-content;
  padding: 2em;
`;

const EmailForm = styled.form`
  > div {
    margin-bottom: 5px;
  }
`;
