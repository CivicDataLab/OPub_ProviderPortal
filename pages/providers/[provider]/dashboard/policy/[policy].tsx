import { useMutation } from '@apollo/client';
import { Button } from 'components/actions';
import { Upload } from 'components/actions/Upload/Upload';
import { TextArea, TextField } from 'components/form';
import { DashboardHeader, Heading } from 'components/layouts';
import { Flex } from 'components/layouts/FlexWrapper';
import { LinkButton } from 'components/pages/dashboard/helpers';
import { MainWrapper } from 'components/pages/user/Layout';
import { useFormik } from 'formik';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { mutation } from 'services';
import { CREATE_POLICY } from 'services/schema';
import styled from 'styled-components';
import * as Yup from 'yup';
import { platform_name } from 'platform-constants';

const validationSchema = Yup.object().shape(
  {
    title: Yup.string().required('Required'),

    description: Yup.string().required('Required'),
    file: Yup.mixed().when('remote_url', {
      is: null,
      then: Yup.mixed().required('This field is required.'),
      otherwise: Yup.mixed(),
    }),
    remote_url: Yup.string().when('file', {
      is: null,
      then: Yup.string().required('This field is required.'),
      otherwise: Yup.string(),
    }),
  },
  [['file', 'remote_url']]
);

const Policy = ({ query }) => {
  const router = useRouter();
  const [createPolicyReq, createPolicyRes] = useMutation(CREATE_POLICY);

  const initialValues = {
    file: null,
    remote_url: null,
    title: '',
    description: '',
  };
  // TODO remove generic item from array for license request

  const formik: any = useFormik({
    initialValues,
    validationSchema,
    validateOnChange: false,
    onSubmit: (values, { resetForm }) => {
      const submitValues = { ...values };
      // remove unused contract field
      if (submitValues.file == null || submitValues.file == '')
        delete submitValues.file;
      else delete submitValues.remote_url;

      mutation(createPolicyReq, createPolicyRes, {
        policy_data: { ...submitValues },
      })
        .then(() => {
          toast.success('Successfully requested policy');
          router.replace(
            `/providers/${router.query.provider}/dashboard/policy`
          );
          resetForm();
        })
        .catch(() => {
          toast.error('Error in requesting Policy Addition');
        });
    },
  });

  const { errors } = formik;

  return (
    <MainWrapper fullWidth>
      <Head>
        <title>Policy | {platform_name} (IDP)</title>
      </Head>

      <Wrapper>
        <DashboardHeader>
          <Heading variant="h3" as={'h1'}>
            {' '}
            Request New Policy
          </Heading>
          <LinkButton
            label="Back to Policies"
            href={`/providers/${router.query.provider}/dashboard/policy`}
            type="back"
          />
        </DashboardHeader>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
          }}
          noValidate
        >
          <Flex gap="33px" flexWrap={'wrap'}>
            <UploadWrapper>
              {/* <Label htmlFor="licenseUpload">
                Upload/Link the Full Legal Text of the Licence
              </Label> */}
              <Upload
                formik={formik}
                urlName="remote_url"
                fileName="file"
                id="licenseUpload"
                fileTypes=".txt, .pdf"
                FileSizelabel={true}
                FormatLabel={true}
                linkDescription="Enter the URL for the licence document"
                errorMessage={errors['file'] || errors['remote_url']}
              />
            </UploadWrapper>
            <InputFields>
              <TextField
                label="Title"
                name="title"
                placeholder="Title of the policy"
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
                maxLength={10000}
                onChange={(e) => {
                  formik.setFieldValue('description', e);
                  errors.description && formik.validateField('description');
                }}
                errorMessage={errors.description}
                placeholder="Add here the key details of the policy"
                rows={5}
                isRequired
              />
            </InputFields>
          </Flex>
          <SubmitWrapper>
            <Button type="submit" kind="primary" onPress={formik.handleSubmit}>
              Request New Policy
            </Button>
          </SubmitWrapper>
        </Form>
      </Wrapper>
    </MainWrapper>
  );
};

export default Policy;

export const getServerSideProps: GetServerSideProps = async (context) => {
  context.res.setHeader(
    'Cache-Control',
    'public, s-maxage=10, stale-while-revalidate=59'
  );

  const policy = context.query.policy || {};

  if (policy != 'request') return { notFound: true };

  return {
    props: {
      policy,
    },
  };
};

const Wrapper = styled.main``;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
`;

const UploadWrapper = styled.div`
  max-width: 336px;
  min-height: 240px;
  margin-top: 27px;
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

const InputFields = styled.div`
  width: 100%;
  flex: 1 0 33.33%;
  margin: auto;
  > div {
    margin-bottom: 20px;
  }
`;
