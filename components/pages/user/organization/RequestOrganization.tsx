import { useMutation } from '@apollo/client';
import { Button } from 'components/actions';
import { Upload } from 'components/actions/Upload/Upload';
import { Checkbox, Select, TextArea, TextField } from 'components/form';
import { ErrorMessage, Indicator, Label } from 'components/form/BaseStyles';
import { Heading, Text } from 'components/layouts';
import { Link, NextLink } from 'components/layouts/Link';
import { useFormik } from 'formik';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { toast } from 'react-toastify';
import { CREATE_ORGANIZATION, mutation } from 'services';
import styled from 'styled-components';
import { omit } from 'utils/helper';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  title: Yup.string().required('Required'),
  homepage: Yup.string().required('Required'),
  description: Yup.string()
    .max(500, 'Description should be maximum 500 characters')
    .min(25, 'Description should have atleast 25 characters')
    .required('Required'),
  organization_types: Yup.string().required('Required'),
  data_description: Yup.string()
    .max(500, 'Description should be maximum 500 characters')
    .min(25, 'Description should have atleast 25 characters')
    .required('Required'),
  contact: Yup.string()
    .email('Please enter correct email')
    .required('Required'),
  accepted: Yup.boolean().oneOf([true], 'Required'),
  logo: Yup.mixed().required('Required'),
});

const orgTypes: any = [
  {
    label: 'Academic Institution',
    value: 'ACADEMIC_INSTITUTION',
  },
  {
    label: 'Central Government',
    value: 'CENTRAL_GOVERNMENT',
  },
  {
    label: 'Citizens’ Group',
    value: 'CITIZENS_GROUP',
  },
  {
    label: 'Civil Society Organisation',
    value: 'CIVIL_SOCIETY_ORGANISATION',
  },
  {
    label: 'Industry Body',
    value: 'INDUSTRY_BODY',
  },
  {
    label: 'Media Organisation',
    value: 'MEDIA_ORGANISATION',
  },

  {
    label: 'Open Data/Technology Community',
    value: 'OPEN_DATA_TECHNOLOGY_COMMUNITY',
  },
  {
    label: 'Private Company',
    value: 'PRIVATE_COMPANY',
  },

  {
    label: 'Public Sector Company',
    value: 'PUBLIC_SECTOR_COMPANY',
  },
  {
    label: 'State Government',
    value: 'STATE_GOVERNMENT',
  },
  {
    label: 'Union Territory Government',
    value: 'UNION_TERRITORY_GOVERNMENT',
  },

  {
    label: 'Urban Local Body',
    value: 'URBAN_LOCAL_BODY',
  },
  {
    label: 'Other',
    value: 'OTHER',
  },
];

export const RequestOrganization = () => {
  const [createOrganizationReq, createOrganizationReqRes] =
    useMutation(CREATE_ORGANIZATION);

  const router = useRouter();

  const initialValues = {
    title: '',
    description: '',
    contact: '',
    homepage: '',
    organization_types: '',
    logo: null,
    data_description: '',
    upload_sample_data_file: null,
    sample_data_url: '',
    accepted: false,
  };

  const formik: any = useFormik({
    initialValues,
    validationSchema,
    validateOnChange: false,
    onSubmit: (values, { resetForm }) => {
      let submitValues: any = { ...values };

      //  remove unwanted values
      submitValues = omit(submitValues, ['accepted']);
      if (submitValues.logo == null)
        submitValues = omit(submitValues, ['logo']);

      mutation(createOrganizationReq, createOrganizationReqRes, {
        organization_data: submitValues,
      })
        .then((res) => {
          if (res.create_organization.success) {
            toast.success('Request successfully sent');
            resetForm({
              values: initialValues,
            });
            router.push('/user/organizations');
          }
        })
        .catch((res) => {
          toast.error('Error in sending request: ' + res.message);
        });
    },
  });

  const { values, errors, setFieldValue } = formik;

  useEffect(() => {
    window.scrollTo({
      top:
        document.getElementById('middle').offsetTop - 0.08 * window.innerHeight,
      behavior: 'smooth',
    });

    document.getElementById('NameOfOrg').focus();
  }, []);

  return (
    <Wrapper id="middle">
      <Heading as="h4" variant="h3">
        Request New Organisation
      </Heading>
      <Text>
        Please share the following details to create a new organisation. The
        submitted details will be reviewed by the administrators and you will be
        notified in the organisation email address (as shared below) once the
        organisation is created or if any further details are needed. Do ensure
        that your organisation does not already exist on this platform by
        checking the
        <NextLink href={'/providers'}>
          <Text color={'var(--color-link)'}> current organisation list</Text>
        </NextLink>
        .
      </Text>

      <FormWrapper>
        <TextField
          isRequired
          label="Name"
          id="NameOfOrg"
          placeholder="Name of the organisation"
          errorMessage={errors.title}
          name="title"
          maxLength={100}
          value={values.title}
          onChange={(e) => {
            setFieldValue('title', e.replace(/[^a-zA-Z0-9\(\)\]\[& -]/gi, ''));
            if (errors.title) errors.title = false;
          }}
        />
        <TextArea
          errorMessage={errors.description}
          rows={5}
          isRequired
          name="description"
          maxLength={500}
          minLength={25}
          value={values.description}
          placeholder="Brief description of the organisation. This will be visible to all users."
          onChange={(e) => {
            if (errors.description && e.length > 25) errors.description = false;
            formik.setFieldValue('description', e);
          }}
          label="Description"
        />
        <TextField
          label="Organisation Website"
          name="homepage"
          errorMessage={errors.homepage}
          placeholder="Website URL"
          isRequired
          value={values.homepage}
          onChange={(e) => {
            setFieldValue('homepage', e);
            if (errors.homepage) errors.homepage = false;
          }}
        />

        <div>
          <Select
            label="Organisation type:"
            inputId="organization_types"
            options={orgTypes}
            value={orgTypes?.find((e) => e.value === values.organization_types)}
            name="organization_types"
            isRequired
            isSearchable={false}
            key={values.organization_types}
            onChange={(e) => {
              formik.setFieldValue('organization_types', e.value);
              if (errors.organization_types) errors.organization_types = false;
            }}
            placeholder="Select organisation type from the list"
          />
          {errors.organization_types && <ErrorMessage>Required</ErrorMessage>}
        </div>
        <UploadWrapper>
          <Label htmlFor="logo_upload">
            Upload Logo File <Indicator>(Required)</Indicator>
          </Label>
          <Upload
            formik={formik}
            fileName="logo"
            id="logo_upload"
            fileTypes=".png, .jpg, .jpeg, .svg"
            errorMessage={errors['logo']}
            FileSizelabel={true}
            FormatLabel={true}
          />
        </UploadWrapper>
        <TextArea
          errorMessage={errors.data_description}
          rows={5}
          isRequired
          minLength={25}
          maxLength={500}
          value={values.data_description}
          name="data_description"
          onChange={(e) => {
            if (errors.data_description && e.length > 25)
              errors.data_description = false;
            formik.setFieldValue('data_description', e);
          }}
          placeholder="Description of the content/type of data that your organisation would like to share"
          label="Describe Content/Type of Data"
        />

        <TextField
          label="Organisation Email Address"
          isRequired
          value={values.contact}
          placeholder="This will be visible to all users."
          name="contact"
          errorMessage={errors.contact}
          onChange={(e) => setFieldValue('contact', e)}
        />

        <TextField
          label="Sample data"
          value={values.sample_data_url}
          name="sample_data_url"
          placeholder="Share URL of sample data collected/compiled/generated by your organisation"
          onChange={(e) => setFieldValue('sample_data_url', e)}
        />

        <Accept>
          <Checkbox
            validationState={errors.accepted ? 'invalid' : null}
            name="accepted"
            isSelected={values.accepted || false}
            onChange={(e) => {
              if (errors.accepted) errors.accepted = false;
              formik.setFieldValue('accepted', e);
            }}
          >
            I have read and agree with
          </Checkbox>

          <Link
            href={'/terms-of-use'}
            underline="hover"
            variant="pt16l"
            target="_blank"
          >
            Terms of Use of IDP
          </Link>
        </Accept>
      </FormWrapper>

      <ButtonWrapper>
        <Button onPress={() => formik.handleSubmit()} kind="primary">
          Submit
        </Button>
      </ButtonWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  padding-top: 52px;
  /* max-width: 800px; */
`;

const FormWrapper = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 16px;
`;

const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  justify-content: flex-end;
  border-bottom: 1px solid var(--color-gray-02); ;
`;

const UploadWrapper = styled.div`
  margin-top: 8px;
  width: 100%;
  min-height: 114px;
`;

const Accept = styled.div`
  display: flex;
  align-items: flex-start;

  > a {
    line-height: 1.4;
  }
`;
