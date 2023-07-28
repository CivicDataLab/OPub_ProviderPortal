import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'Store';
import { Button } from 'components/actions';
import { Flex } from 'components/layouts/FlexWrapper';
import { mutation, UPDATE_PATCH_OF_DATASET } from 'services';
import { updateDatasetElements } from 'slices/addDatasetSlice';
import { useMutation, useQuery } from '@apollo/client';
import { toast } from 'react-toastify';
import { ComponentWrapper, SubmitFotter } from '../Metadata/Metadata';
import { ChevronLeft } from '@opub-icons/workflow';
import { DashboardHeader, Heading } from 'components/layouts';
import { Link, NextLink } from 'components/layouts/Link';

import {
  ALL_PUBLISHED_LICENSES,
  ALL_PUBLISHED_POLICY,
  CREATE_EXTERNAL_ACCESS_MODEL,
  GET_EXTRENAL_ACCESS_MODEL_BY_ID,
} from 'services/schema';
import { useFormik } from 'formik';
import { useRouter } from 'next/router';
import { Select } from 'components/form/Select';
import { useProviderStore } from 'services/store';
import useEffectOnChange from 'utils/hooks';
import * as Yup from 'yup';
import Aside from '../Aside';

const validationSchema = Yup.object().shape({
  license: Yup.string().required('Required'),
});

const ExternalDataAccessModel = ({
  setSelectedStep,
  updateStore,
  handleStep,
}) => {
  useEffect(() => {
    updateStore();
  }, []);
  const datasetStore = useSelector((state: RootState) => state.addDataset);

  const [patchDatasetFunnelReq, patchDatasetFunnelRes] = useMutation(
    UPDATE_PATCH_OF_DATASET
  );

  const { loading, data, error } = useQuery(GET_EXTRENAL_ACCESS_MODEL_BY_ID, {
    variables: {
      dataset_id: +datasetStore.id,
    },
    skip: !datasetStore.id,
  });

  const dispatch = useDispatch();

  const router = useRouter();
  const [userFurtherAction, setUserFurtherAction] = useState('AdditionalInfo');

  const [createExternalAccessModelreq, createExternalAccessModelRes] =
    useMutation(CREATE_EXTERNAL_ACCESS_MODEL);

  const org = useProviderStore((e) => e.org);

  const policyData = !loading &&
    !error && { ...data?.external_access_model_by_dataset?.policy };

  const licenseData = !loading &&
    !error && { ...data?.external_access_model_by_dataset?.license };

  const [selectedPolicy, setSelectedPolicy] = React.useState<any>();
  const [selectedLicense, setSelectedLicense] = React.useState<any>();

  const formik: any = useFormik({
    initialValues: {
      dataset: datasetStore.id,
      policy: '',
      license: '',
    },
    validationSchema,
    validateOnChange: false,
    onSubmit: (values) => {
      DataStoryToServer(values);
    },
  });
  const { values, errors } = formik;

  useEffectOnChange(() => {
    if (policyData) {
      setSelectedPolicy({ label: policyData.title, value: policyData.id });

      formik.setFieldValue('policy', policyData.id);
    }
    if (licenseData) {
      setSelectedLicense({ label: licenseData.title, value: licenseData.id });
      formik.setFieldValue('license', licenseData.id);
    }
  }, [loading, data]);

  const { data: policyRes } = useQuery(ALL_PUBLISHED_POLICY, {
    skip: !org?.org_id,
  });

  const { data: licenseRes } = useQuery(ALL_PUBLISHED_LICENSES, {
    skip: !org?.org_id,
  });

  const policyList = React.useMemo(() => {
    if (policyRes?.approved_policy) {
      const filtered = [...policyRes.approved_policy].filter(
        (e) => e.status == 'PUBLISHED'
      );

      return filtered.map((item) => ({
        label: item.title,
        value: item.id,
        description: item.description,
      }));
    }
    return [];
  }, [policyRes]);

  const licenseList = React.useMemo(() => {
    if (licenseRes?.licenses) {
      const filtered = [...licenseRes.licenses].filter(
        (e) => e.status == 'PUBLISHED'
      );

      return filtered.map((item) => ({
        label: item.title,
        value: item.id,
        description: item.description,
        additions: item.additions,
      }));
    }
    return [];
  }, [licenseRes]);

  const DataStoryToServer = (values) => {
    const submitValues = { ...values };
    const mutationVariables = {
      id: datasetStore?.externalaccessmodel_set[0]?.id || '',
      dataset: +submitValues.dataset,
      policy: values.policy,
      license: values.license,
    };

    mutation(createExternalAccessModelreq, createExternalAccessModelRes, {
      external_access_model_data: {
        ...mutationVariables,
      },
    })
      .then((res) => {
        updateStore();

        toast.success('Data added successfully');
        formik.resetForm();

        if (userFurtherAction === 'Distribution') {
          window
            ? window.open(`/datasets/${datasetStore.slug}`, '_blank')
            : router.push(`/datasets/${datasetStore.slug}`);
        } else {
          datasetStore.funnel === 'Data Access Model' &&
          datasetStore.resource_set.length > 0
            ? mutation(patchDatasetFunnelReq, patchDatasetFunnelRes, {
                dataset_data: {
                  funnel: 'Additional Info',
                  id: datasetStore.id,
                  status: 'DRAFT',
                  title: datasetStore.title,
                  description: datasetStore.description,
                },
              })
                .then(() => {
                  dispatch(
                    updateDatasetElements({
                      type: 'updateFunnel',
                      value: 'Additional Info',
                    })
                  );
                })
                .catch(() => {
                  toast.error('Funnel Patch Failed');
                })
            : null;
          handleStep(0);
          setSelectedStep('additional-info');
        }
      })
      .catch(() => {
        toast.error('Error in the Mutation Request');
      });
  };

  return (
    <>
      <ComponentWrapper>
        <DashboardHeader>
          <Heading as="h2" variant="h3">
            Policy & Licence
          </Heading>
        </DashboardHeader>
        <Flex flexDirection={'column'} gap="16px">
          <Select
            key={selectedPolicy}
            label="Select a Policy"
            inputId="policy"
            options={policyList?.map((item) => {
              return {
                label: item.label,
                value: item.value,
              };
            })}
            isClearable
            defaultValue={selectedPolicy}
            onChange={(e) => {
              formik.setFieldValue('policy', e?.value);
            }}
          />
          <div>
            {org.role === 'DPA' ? (
              <NextLink
                href={`/providers/${router.query.provider}/dashboard/policy`}
              >
                <Link color="var(--color-secondary-01)">Add New Policy</Link>
              </NextLink>
            ) : (
              <Aside
                title={
                  'Please contact Data Provider Admin to create new policy'
                }
              />
            )}
          </div>
          <Select
            key={selectedLicense}
            label="Select a Licence"
            inputId="Licence"
            options={licenseList?.map((item) => {
              return {
                label: item.label,
                value: item.value,
              };
            })}
            defaultValue={selectedLicense}
            isRequired
            errorMessage={errors.license}
            onChange={(e) => {
              formik.setFieldValue('license', e?.value);
              if (errors.license) errors.license = false;
            }}
          />
          <div>
            {org.role === 'DPA' ? (
              <NextLink
                href={`/providers/${router.query.provider}/dashboard/licenses`}
              >
                <Link color="var(--color-secondary-01)">Add New Licence</Link>
              </NextLink>
            ) : (
              <Aside
                title={
                  'Please contact Data Provider Admin to create new licence'
                }
              />
            )}
          </div>
        </Flex>
      </ComponentWrapper>

      <SubmitFotter>
        <Flex justifyContent={'space-between'} gap="10px">
          <Button
            kind="primary-outline"
            onPress={() => setSelectedStep('distributions')}
            title={'Move to Distributions'}
            icon={<ChevronLeft />}
            iconSide={'left'}
          >
            Distributions
          </Button>
          <Flex gap="10px">
            <Link
              target="_blank"
              href={`/datasets/${datasetStore.slug}`}
              passHref
              underline="none"
            >
              <Button kind="primary-outline" title={'Preview Dataset'}>
                Preview Dataset
              </Button>
            </Link>
            <Button
              onPress={() => {
                setUserFurtherAction('AdditionalInfo');
                formik.handleSubmit();
              }}
              title={'Move to Additional Information'}
            >
              Save & Move to Additional Info
            </Button>
          </Flex>
        </Flex>
      </SubmitFotter>
    </>
  );
};

export default ExternalDataAccessModel;
