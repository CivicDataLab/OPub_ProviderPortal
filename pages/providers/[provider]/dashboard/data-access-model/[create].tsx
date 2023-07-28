import { useMutation, useQuery } from '@apollo/client';
import { Loader } from 'components/common';
import { DashboardHeader, Heading } from 'components/layouts';
import { AccessModelForm } from 'components/pages/dashboard/AccessModelForm';
import { LinkButton } from 'components/pages/dashboard/helpers';
import { MainWrapper } from 'components/pages/user/Layout';
import { useFormik } from 'formik';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import {
  CREATE_ACCESS_DATA_MODEL,
  DATA_ACCESS_MODEL,
  mutation,
  UPDATE_DATA_ACCESS_MODEL,
} from 'services';
import styled from 'styled-components';
import { omit } from 'utils/helper';
import * as Yup from 'yup';
import { platform_name } from 'platform-constants';

const constants = {
  typeList: [
    { value: 'OPEN', label: 'Open' },
    { value: 'RESTRICTED', label: 'Restricted' },
    { value: 'REGISTERED', label: 'Registered' },
  ],
  rateList: [
    { value: 'SECOND', label: 'Second' },
    { value: 'MINUTE', label: 'Minute' },
    { value: 'HOUR', label: 'Hour' },
    { value: 'DAY', label: 'Day' },
    { value: 'WEEK', label: 'Week' },
    { value: 'MONTH', label: 'Month' },
    { value: 'QUARTER', label: 'Quarter' },
    { value: 'YEAR', label: 'Year' },
  ],

  subscriptionList: [
    { value: 'LIMITEDDOWNLOAD', label: 'Limited Download' },
    { value: 'DAILY', label: 'Daily' },
    { value: 'WEEKLY', label: 'Weekly' },
    { value: 'QUARTERLY', label: 'Quarterly' },
    { value: 'MONTHLY', label: 'Monthly' },
    { value: 'YEARLY', label: 'Yearly' },
  ],

  validationList: [
    { label: 'Lifetime', value: 'LIFETIME' },
    { label: 'Day', value: 'DAY' },
    { label: 'Week', value: 'WEEK' },
    { label: 'Month', value: 'MONTH' },
    { label: 'Year', value: 'YEAR' },
  ],
};

const DataAccessModel = () => {
  const router = useRouter();
  const [createAccessDataModel, createAccessDataModelRes] = useMutation(
    CREATE_ACCESS_DATA_MODEL
  );

  const [updateAccessDataModel, updateAccessDataModelRes] = useMutation(
    UPDATE_DATA_ACCESS_MODEL
  );

  // query for access model content in case of modify
  const modelID = router.query.create;
  const isClone = router.query.clone;

  let modelData: any = {};
  if (modelID == 'create') {
    modelData = {};
  }

  let { data, loading }: any = useQuery(DATA_ACCESS_MODEL, {
    variables: { data_access_model_id: modelID },
    skip: !modelID,
  });

  modelData = data?.data_access_model;
  if (modelID != 'create' && modelID && !loading && !modelData)
    toast.error('Error while fetching Access Model');

  // initial values for formik, incase there are values in `modelData`, use those to prefil
  const initialValues = modelData
    ? {
        title: (isClone ? 'Clone of ' : '') + modelData.title || '',
        description: modelData.description || '',
        type:
          constants.typeList?.filter((e) => e.value == modelData?.type)[0]
            ?.value || '',
        license: '',
        subscription_quota: modelData.subscription_quota || 1,
        subscription_quota_unit:
          constants.subscriptionList?.filter(
            (e) => e.value == modelData.subscription_quota_unit
          )[0]?.value || '',
        rate_limit: modelData.rate_limit || 1,
        rate_limit_unit:
          constants.rateList?.filter(
            (e) => e.value == modelData.rate_limit_unit
          )[0]?.value || '',
        validation: modelData.validation || 1,
        validation_unit:
          constants.validationList?.filter(
            (e) => e.value == modelData.validation_unit
          )[0]?.value || '',
        additions: modelData.license_additions?.map((e) => e.id) || [],
        id: (isClone ? null : modelData.id) || null,
      }
    : {};

  const validationSchema = Yup.object().shape({
    title: Yup.string()
      .required('Required')
      .max(100, 'Length should not be more than 100 characters'),
    description: Yup.string()
      .required('Required')
      .max(500, 'Length should not be more than 500 characters'),
    type: Yup.string().required('Required'),
    subscription_quota: Yup.number().when('type', {
      is: (type) => type !== 'OPEN',
      then: Yup.number().integer('Please enter a number').required('Required'),
    }),
    subscription_quota_unit: Yup.string().when('type', {
      is: (type) => type !== 'OPEN',
      then: Yup.string().required('Required'),
    }),
    rate_limit: Yup.number()
      .integer('Please enter a number')
      .required('Required'),
    rate_limit_unit: Yup.string().required('Required'),
    validation: Yup.number().when(['type'], {
      is: (type) => type !== 'OPEN',
      then: Yup.number().integer('Please enter a number').required('Required'),
    }),
    validation_unit: Yup.string().when('type', {
      is: (type) => type !== 'OPEN',
      then: Yup.string().required('Required'),
    }),
    license: Yup.string().required('Required'),
  });

  // Initialise Formik
  const formik: any = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema,
    validateOnChange: false,
    onSubmit: (values, { resetForm }) => {
      let submitValues = {};
      if (values.type === 'OPEN') {
        submitValues = omit({ ...values }, [
          'validation',
          'validation_unit',
          'subscription_quota',
          'subscription_quota_unit',
        ]);
      } else {
        submitValues = { ...values };
      }

      if (values.id) {
        // update mutation to run if there is an id provided
        mutation(updateAccessDataModel, updateAccessDataModelRes, {
          data_access_model_data: submitValues,
        })
          .then(() => {
            toast.success('Access Model updated!');
            resetForm();
            // route to lisitng page
            router.replace(
              `/providers/${router.query.provider}/dashboard/data-access-model`
            );
          })
          .catch((err) =>
            toast.error(err.message || 'Error while updating Access Model')
          );
      } else {
        // otherwise run create mutation

        const idRemovedObj = omit({ ...submitValues }, ['id']);
        // run mutation on click on Submit
        mutation(createAccessDataModel, createAccessDataModelRes, {
          data_access_model_data: idRemovedObj,
        })
          .then(() => {
            toast.success('Access Model created');
            resetForm();
            // route to lisitng page
            router.replace(
              `/providers/${router.query.provider}/dashboard/data-access-model`
            );
          })
          .catch((err) =>
            toast.error(err.message || 'Error while creating Access Model')
          );
      }
    },
  });
  const isEdit = modelData?.id ? true : false;

  return (
    <MainWrapper fullWidth>
      <Head>
        <title>{`${
          isEdit ? (isClone ? 'Clone' : 'Modify') : 'Create'
        } Access Model | {platform_name} (IDP)`}</title>
      </Head>
      <div>
        <DashboardHeader>
          <Heading as="h1" variant="h3">
            {`${isEdit ? 'Modify' : 'Create New'} Access Model`}
          </Heading>
          <LinkButton
            label="Back to Access Models"
            href={`/providers/${router.query.provider}/dashboard/data-access-model`}
            type="back"
          />
        </DashboardHeader>
        <Content>
          {!loading ? (
            <AccessModelForm
              constants={constants}
              formik={formik}
              modelData={modelData}
              isClone={isClone}
            />
          ) : (
            <Loader />
          )}
        </Content>
      </div>
    </MainWrapper>
  );
};

export default DataAccessModel;

const Content = styled.div`
  margin-top: 32px;
`;
