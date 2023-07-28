import { Button } from 'components/actions';
import { Checkbox, Select, TextArea } from 'components/form';
import { Heading, Text } from 'components/layouts';
import styled from 'styled-components';
import { ORGANIZATION_REQUEST, GET_ORGANIZATIONS, mutation } from 'services';
import { useMutation, useQuery } from '@apollo/client';
import React, { useEffect } from 'react';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { ErrorMessage } from 'components/form/BaseStyles';
import { omit } from 'utils/helper';
import { useRouter } from 'next/router';

const validationSchema = Yup.object().shape({
  organization: Yup.object()
    .shape({
      label: Yup.string().required(),
      value: Yup.string().required(),
    })
    .required('Organization Selection is compulsory'),
  description: Yup.string()
    .max(500, 'Description should be maximum 500 characters')
    .min(25, 'Description should have atleast 25 characters'),
  accepted: Yup.boolean().oneOf([true], 'Required'),
});

export const FindOrganization = ({ userOrgsListRes }) => {
  const router = useRouter();
  const { data } = useQuery(GET_ORGANIZATIONS);

  const [organizationReq, organizationReqRes] =
    useMutation(ORGANIZATION_REQUEST);

  const orgList = React.useMemo(() => {
    return (
      data?.organizations &&
      data.organizations.map((e) => ({
        label: e.title,
        value: e.id,
      }))
    );
  }, [data]);

  const initialValues = {
    organization: { label: '', value: '' },
    description: '',
    accepted: false,
  };

  const formik: any = useFormik({
    initialValues,
    validationSchema,
    validateOnChange: false,
    onSubmit: (values, { resetForm }) => {
      let submitValues: any = {
        ...values,
        organization: values.organization.value,
      };
      submitValues = omit(submitValues, ['accepted']);
      mutation(organizationReq, organizationReqRes, {
        organization_request: { ...submitValues },
      })
        .then(() => {
          toast.success('Request successfully sent');
          resetForm();
          userOrgsListRes.refetch();
        })
        .catch(() => {
          toast.error('Error in sending request');
        });
    },
  });

  const { values, errors } = formik;

  useEffect(() => {
    if (router.query.action === 'find') {
      window.scrollTo({
        top:
          document.getElementById('middle').offsetTop -
          0.08 * window.innerHeight,
        behavior: 'smooth',
      });
      document.getElementById('org-list').focus();
    }
  }, [router.query.action]);

  return (
    <Wrapper id="middle">
      <Heading as="h4" variant="h3">
        Find your Organisation
      </Heading>
      <FormWrapper>
        <div>
          <Select
            label="Search among the existing organisations in the list below"
            inputId="org-list"
            options={orgList?.filter(
              (optionsObj) =>
                !userOrgsListRes?.data?.organization_request_user
                  ?.filter((item) => item.status !== 'REJECTED')
                  .find(
                    (userObj) => userObj.organization.id === optionsObj.value
                  )
            )}
            onChange={(e) => {
              formik.setFieldValue('organization', e);
              if (errors.organization) errors.organization = false;
            }}
            value={values.organization}
            placeholder="Select an Organization"
          />
          {errors.organization && <ErrorMessage>Required</ErrorMessage>}
        </div>
        <TextArea
          errorMessage={errors.description}
          rows={5}
          maxLength={500}
          name="description"
          value={values.description}
          onChange={(e) => {
            if (errors.description && e.length > 25) errors.description = false;
            formik.setFieldValue('description', e);
          }}
          label="Message for the Organisation Admin"
        />
        <Checkbox
          validationState={errors.accepted ? 'invalid' : null}
          name="accepted"
          onChange={(e) => {
            if (errors.accepted) errors.accepted = false;
            formik.setFieldValue('accepted', e);
          }}
          isSelected={values.accepted}
        >
          I confirm that I work with the selected organisation.
        </Checkbox>

        <RequestOrg>
          <Text variant="pt14">Don&apos;t see your Organisation?</Text>
          <Button
            kind="custom"
            onPress={() => {
              router.push('?action=request');
            }}
          >
            Request a new Organisation
          </Button>
        </RequestOrg>
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
`;

const FormWrapper = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;

  > div:first-child {
    label {
      font-weight: var(--font-normal);
      margin-top: 16px;
    }
  }
`;

const RequestOrg = styled.div`
  display: flex;
  gap: 8px;

  > button {
    color: var(--color-link);
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  justify-content: flex-end;
  border-bottom: 1px solid var(--color-gray-02); ;
`;
