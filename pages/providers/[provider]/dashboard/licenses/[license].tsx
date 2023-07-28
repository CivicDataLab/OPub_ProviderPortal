import { useMutation } from '@apollo/client';
import { Button } from 'components/actions';
import { Upload } from 'components/actions/Upload/Upload';
import { TextArea, TextField } from 'components/form';
import { Link } from 'components/layouts/Link';
import { DashboardHeader, Heading, Text } from 'components/layouts';
import { LinkButton } from 'components/pages/dashboard/helpers';
import { LicenseAddition } from 'components/pages/dashboard/licence';
import { MainWrapper } from 'components/pages/user/Layout';
import { useFormik } from 'formik';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { CREATE_LICENSE, mutation } from 'services';
import styled from 'styled-components';
import * as Yup from 'yup';
import { Flex } from 'components/layouts/FlexWrapper';
import { getInternalGraphQLClient } from 'apollo-client';
import { FETCH_LICENSE_BY_ID, UPDATE_LICENSE } from 'services/schema';
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
    remote_url: Yup.mixed().when('file', {
      is: null,
      then: Yup.mixed().required('This field is required.'),
      otherwise: Yup.mixed(),
    }),
    license_additions: Yup.array().of(
      Yup.object().shape({
        title: Yup.string().required('Required'),
        description: Yup.string().required('Required'),
      })
    ),
  },
  [['file', 'remote_url']]
);

const License = ({ licenseData }) => {
  const router = useRouter();
  const [createLicenseReq, createLiceseRes] = useMutation(CREATE_LICENSE);
  const [updateLicenseReq, updateLicenseRes] = useMutation(UPDATE_LICENSE);

  const initialValues = {
    file: licenseData?.file || null,
    title: licenseData?.title || '',
    short_name: licenseData?.short_name || '',
    description: licenseData?.description || '',
    remote_url: licenseData?.remote_url || null,
    license_additions:
      licenseData?.licenseaddition_set?.length > 0
        ? licenseData?.licenseaddition_set
        : [],
  };
  // TODO remove generic item from array for license request

  const formik: any = useFormik({
    initialValues,
    validationSchema,
    validateOnChange: false,
    onSubmit: (values, { resetForm }) => {
      licenseData.id === undefined
        ? CreateLicence(values)
        : UpdateLicence(values, licenseData.id);
    },
  });

  const CreateLicence = (values) => {
    if (values.file == null || values.file == '') delete values.file;
    else delete values.remote_url;
    mutation(createLicenseReq, createLiceseRes, {
      license_data: { ...values },
    })
      .then(() => {
        toast.success('Successfully requested license');
        router.replace(
          `/providers/${router.query.provider}/dashboard/licenses`
        );
      })
      .catch(() => {
        toast.error('Error in requesting License Addition');
      });
  };

  const UpdateLicence = (values, licenceid) => {
    if (values.file == null || values.file == '') delete values.file;
    else delete values.remote_url;

    mutation(updateLicenseReq, updateLicenseRes, {
      license_data: { ...values, id: licenceid },
    })
      .then(() => {
        toast.success('Successfully requested license');
        router.replace(
          `/providers/${router.query.provider}/dashboard/licenses`
        );
      })
      .catch(() => {
        toast.error('Error in requesting License Addition');
      });
  };

  const { errors, values } = formik;

  return (
    <MainWrapper fullWidth>
      <Head>
        <title>Licence | {platform_name} (IDP)</title>
      </Head>

      <Wrapper>
        <DashboardHeader>
          <Heading variant="h3" as={'h1'}>
            {' '}
            {licenseData?.id ? 'Modify Licence' : 'Request New Licence'}
          </Heading>
          <LinkButton
            label="Back to Licences"
            href={`/providers/${router.query.provider}/dashboard/licenses`}
            type="back"
          />
        </DashboardHeader>
        <Content>
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
                {formik.initialValues.file && (
                  <>
                    <Text variant="pt14">Uploaded File : </Text>
                    <Link
                      target="_blank"
                      rel="noreferrer"
                      variant="pt14"
                      href={`${process.env.NEXT_PUBLIC_BACKEND_URL}/download/license/${router.query.license}`}
                    >
                      {licenseData.file}
                    </Link>
                  </>
                )}
              </UploadWrapper>
              <InputFields>
                <TextField
                  label="Title"
                  name="title"
                  isRequired
                  value={values.title}
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
                  value={formik.values.description}
                  onChange={(e) => {
                    formik.setFieldValue('description', e);
                    errors.description && formik.validateField('description');
                  }}
                  errorMessage={errors.description}
                  placeholder="Add here the key details of the licence"
                  rows={6}
                  isRequired
                />
              </InputFields>
            </Flex>
            <TextField
              label="Short Title"
              name="short_name"
              value={values.short_name}
              maxLength={10}
              onChange={(e) => {
                formik.setFieldValue('short_name', e);
              }}
            />
            <Heading as={'h2'} variant="h4">
              Additional Terms & Conditions
            </Heading>
            <Line />
            <LicenseAddition formik={formik} valueName="license_additions" />

            <SubmitWrapper>
              <Button
                as="a"
                href={`/providers/${router.query.provider}/dashboard/licenses`}
                type="submit"
                kind="primary"
              >
                Cancel
              </Button>
              <Button
                onPress={formik.handleSubmit}
                type="submit"
                kind="primary"
              >
                {licenseData?.id ? 'Modify Licence' : 'Request New Licence'}
              </Button>
            </SubmitWrapper>
          </Form>
        </Content>
      </Wrapper>
    </MainWrapper>
  );
};

export default License;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const client = getInternalGraphQLClient;
  const license = context.query.license;

  if (license == 'request') {
    return { props: { licenseData: {} } };
  }

  const { data }: any =
    typeof license == 'string'
      ? await client
          .query({
            query: FETCH_LICENSE_BY_ID,
            variables: { license_id: license },
          })
          .catch(() => {
            return { notFound: true };
          })
      : {};

  if (license != 'request' && !data) return { notFound: true };

  return {
    props: {
      licenseData: data.license || {},
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
  max-width: 336px;
  min-height: 240px;
  margin-top: 27px;
`;

const SubmitWrapper = styled.div`
  align-self: flex-end;
  border-bottom: 1px solid var(--color-gray-02);
  width: 100%;
  margin-top: 8px;
  gap: 10px;
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
const Line = styled.div`
  border-bottom: 2px solid var(--color-gray-02);
`;
