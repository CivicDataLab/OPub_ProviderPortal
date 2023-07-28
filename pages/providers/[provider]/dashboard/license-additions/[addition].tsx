import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { useFormik } from 'formik';
import { Button } from 'components/actions';
import { Select, TextArea, TextField } from 'components/form';
import { DashboardHeader, Heading } from 'components/layouts';
import { GetServerSideProps } from 'next';
import { CREATE_LICENSE_ADDITION, LICENSES_BY_ORG, mutation } from 'services';
import { useMutation, useQuery } from '@apollo/client';
import { toast } from 'react-toastify';
import { LinkButton } from 'components/pages/dashboard/helpers';
import * as Yup from 'yup';
import { MainWrapper } from 'components/pages/user/Layout';
import { useProviderStore } from 'services/store';
import { platform_name } from 'platform-constants';

const validationSchema = Yup.object().shape({
  title: Yup.string().required('Required'),
  description: Yup.string().required('Required'),
  license: Yup.string().required('Required'),
});

const LicenseAdditions = ({ query }) => {
  const router = useRouter();
  const [createLicenseAdditionReq, createLicenseAdditionRes] = useMutation(
    CREATE_LICENSE_ADDITION
  );

  const currentOrgRole = useProviderStore((e) => e.org);
  const { data, loading, error } = useQuery(LICENSES_BY_ORG, {
    skip: !currentOrgRole?.org_id,
  });

  const licenseList = React.useMemo(() => {
    if (data) {
      return data.license_by_org
        ?.filter((e) => e.title.length)
        .map((item) => {
          return {
            label: item.title,
            value: item.id,
          };
        });
    }
    return [];
  }, [data]);

  const initialValues = {
    title: '',
    description: '',
    generic_item: 'false',
    license: '',
    id: '',
  };

  const formik: any = useFormik({
    initialValues,
    validationSchema,
    validateOnChange: false,
    onSubmit: (values, { resetForm }) => {
      mutation(createLicenseAdditionReq, createLicenseAdditionRes, {
        license_addition_data: {
          ...values,
          generic_item: JSON.parse(values.generic_item),
        },
      })
        .then((res) => {
          if (res.create_license_addition.success === true) {
            toast.success('Successfully requested license');
            resetForm();
            router.replace(
              `/providers/${router.query.provider}/dashboard/license-additions`
            );
          }
        })
        .catch(() => {
          toast.error('Error in requesting License Addition');
        });
    },
  });

  const { errors } = formik;

  return (
    <MainWrapper fullWidth>
      <Head>
        <title>License Addition | {platform_name} (IDP)</title>
      </Head>

      <Wrapper>
        <DashboardHeader>
          <Heading variant="h3">License Additions</Heading>
          <LinkButton
            label="Back to License Additions"
            href={`/providers/${router.query.provider}/dashboard/license-additions`}
            type="back"
          />
        </DashboardHeader>
        <Content>
          <Heading as="h3" variant="h3">
            Request New License Addition
          </Heading>
          <Form onSubmit={formik.handleSubmit}>
            <TextField
              label="Title"
              name="title"
              isRequired
              maxLength={100}
              onChange={(e) => {
                formik.setFieldValue('title', e);
                errors.title && formik.validateField('title');
              }}
              errorMessage={errors.title}
            />
            <TextArea
              label="Description"
              name="description"
              maxLength={500}
              onChange={(e) => {
                formik.setFieldValue('description', e);
                errors.description && formik.validateField('description');
              }}
              errorMessage={errors.description}
              rows={5}
              isRequired
            />

            <Select
              inputId="Select License"
              aria-label="Select License"
              label="Select License"
              options={licenseList}
              onChange={(e) => {
                formik.setFieldValue('license', e.value);
                errors.license && formik.validateField('license');
              }}
              isRequired
            />

            <Select
              inputId="Generic Condition"
              aria-label="Is this a Generic Condition"
              label="Is this a Generic Condition"
              options={[
                { label: 'Yes', value: 'true' },
                { label: 'No', value: 'false' },
              ]}
              onChange={(e) => {
                formik.setFieldValue('generic_item', e.value);
                errors.generic_item && formik.validateField('generic_item');
              }}
              isRequired
            />

            <SubmitWrapper>
              <Button
                onPress={(e) => formik.handleSubmit(e)}
                type="submit"
                kind="primary"
              >
                Request License Addition
              </Button>
            </SubmitWrapper>
          </Form>
        </Content>
      </Wrapper>
    </MainWrapper>
  );
};

export default LicenseAdditions;

export const getServerSideProps: GetServerSideProps = async (context) => {
  context.res.setHeader(
    'Cache-Control',
    'public, s-maxage=10, stale-while-revalidate=59'
  );

  const addition = context.query.addition || {};

  if (addition !== 'request') return { notFound: true };

  return {
    props: {
      addition,
    },
  };
};

const Wrapper = styled.main``;

const Content = styled.div`
  margin-top: 32px;
`;

const Form = styled.form`
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
`;

const UploadWrapper = styled.div`
  margin-top: 8px;
  width: 100%;
  min-height: 114px;
`;

const SubmitWrapper = styled.div`
  align-self: flex-end;
  border-bottom: 1px solid var(--color-gray-02);
  width: 100%;
  margin-top: 8px;

  display: flex;
  justify-content: flex-end;

  > button {
    margin-left: 8px;
  }
`;
