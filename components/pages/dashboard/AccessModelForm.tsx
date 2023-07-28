import { useMutation, useQuery } from '@apollo/client';
import { Close } from '@opub-icons/workflow';
import { Button, Modal } from 'components/actions';
import {
  Checkbox,
  CheckboxGroup,
  NumberField,
  Select,
  TextArea,
  TextField,
} from 'components/form';
import { Heading, Text } from 'components/layouts';
import { Flex } from 'components/layouts/FlexWrapper';
import { Tooltip } from 'components/overlays';
import { LinkButton } from 'components/pages/dashboard/helpers';
import { useRouter } from 'next/router';
import React from 'react';
import { toast } from 'react-toastify';
import {
  ALL_PUBLISHED_LICENSES,
  DISABLE_DATA_ACCESS_MODEL,
  mutation,
} from 'services';
import { useProviderStore } from 'services/store';
import styled from 'styled-components';
import { Aside } from '../providers/datasets';

const AccessModelForm = ({ formik, modelData, constants, isClone }) => {
  const router = useRouter();
  const { values, errors } = formik;
  const currentOrgRole = useProviderStore((e) => e.org);
  const { data: licenseRes } = useQuery(ALL_PUBLISHED_LICENSES, {
    skip: !currentOrgRole?.org_id,
  });
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

  const [selectedLicense, setSelectedicense] = React.useState<any>({
    label: '',
    value: '',
  });

  React.useEffect(() => {
    if (modelData && modelData.license && licenseList) {
      const filtered = licenseList.filter(
        (e) => e.value == modelData.license.id
      )[0];

      if (filtered) {
        formik.setFieldValue('license', filtered.value);
        setSelectedicense(filtered);
      }
    }
  }, [licenseList]);

  React.useEffect(() => {
    if (values.license) {
      const newLicense = licenseList.filter((e) => e.value == values.license);
      if (newLicense[0]) {
        setSelectedicense(newLicense[0]);
      }
    }
  }, [values.license]);

  return (
    <Form noValidate onSubmit={formik.handleSubmit}>
      <TextField
        label="Title"
        maxLength={100}
        name="title"
        isRequired
        value={values.title}
        errorMessage={errors.title}
        onChange={(e) => {
          formik.setFieldValue('title', e);
          errors.title && formik.validateField('title');
        }}
      />
      <TextArea
        label="Description"
        name="description"
        maxLength={500}
        onChange={(e) => {
          formik.setFieldValue('description', e);
          errors.description && formik.validateField('description');
        }}
        value={values.description}
        errorMessage={errors.description}
        rows={3}
        isRequired
      />

      <Select
        onChange={(e: any) => {
          formik.setFieldValue(
            'type',
            e.value ? e.value : e.map((elm) => elm.value)
          );
          if (errors.type) errors.type = false;
        }}
        errorMessage={errors.type}
        key={values.type}
        options={constants.typeList}
        label="Access Type"
        inputId="data-type"
        defaultValue={
          constants.typeList.filter((e) => e.value == values.type)[0]
        }
        isRequired
      />
      {formik.values.type !== 'OPEN' && (
        <FormFlex>
          <NumberField
            label="Subscription Quota"
            maxWidth="480px"
            name="subscription_quota"
            onChange={(e) => {
              formik.setFieldValue('subscription_quota', e);
              errors.subscription_quota &&
                formik.validateField('subscription_quota');
            }}
            minValue={1}
            value={values.subscription_quota}
            isRequired
            errorMessage={errors.subscription_quota}
          />
          <Select
            onChange={(e: any) => {
              formik.setFieldValue(
                'subscription_quota_unit',
                e.value ? e.value : e.map((elm) => elm.value)
              );
              if (errors.subscription_quota_unit)
                errors.subscription_quota_unit = false;
            }}
            key={values.subscription_quota_unit}
            options={constants.subscriptionList}
            label="Subscription Quota Unit"
            inputId="subscription_quota_unit"
            isRequired
            errorMessage={errors.subscription_quota_unit}
            defaultValue={
              constants.subscriptionList.filter(
                (e) => e.value == values.subscription_quota_unit
              )[0]
            }
          />
        </FormFlex>
      )}
      <FormFlex>
        <NumberField
          label="Rate Limit"
          maxWidth="480px"
          onChange={(e) => {
            formik.setFieldValue('rate_limit', e);
            errors.rate_limit && formik.validateField('rate_limit');
          }}
          name="rate_limit"
          minValue={1}
          errorMessage={errors.rate_limit}
          value={values.rate_limit}
          isRequired
        />
        <Select
          onChange={(e: any) => {
            formik.setFieldValue(
              'rate_limit_unit',
              e.value ? e.value : e.map((elm) => elm.value)
            );
            if (errors.rate_limit_unit) errors.rate_limit_unit = false;
          }}
          key={values.rate_limit_unit}
          options={constants.rateList}
          label="Rate Limit Unit"
          inputId="rate_limit_unit"
          isRequired
          errorMessage={errors.rate_limit_unit}
          defaultValue={
            constants.rateList.filter(
              (e) => e.value == values.rate_limit_unit
            )[0]
          }
        />
      </FormFlex>

      {formik.values.type !== 'OPEN' && (
        <FormFlex>
          <NumberField
            label="Validity"
            maxWidth="480px"
            name="validation"
            onChange={(e) => {
              formik.setFieldValue('validation', e);
              errors.validation && formik.validateField('validation');
            }}
            minValue={1}
            value={values.validation}
            isRequired
            isDisabled={values.validation_unit === 'LIFETIME'}
            errorMessage={errors.validation}
          />
          <Select
            onChange={(e: any) => {
              formik.setFieldValue(
                'validation_unit',
                e.value ? e.value : e.map((elm) => elm.value)
              );
              if (e.value === 'LIFETIME') formik.setFieldValue('validation', 1);
              if (errors.validation_unit) errors.validation_unit = false;
            }}
            key={values.validation_unit}
            options={constants.validationList}
            label="Validity Unit"
            inputId="validation_unit"
            isRequired
            errorMessage={errors.validation_unit}
            defaultValue={
              constants.validationList.filter(
                (e) => e.value == values.validation_unit
              )[0]
            }
          />
        </FormFlex>
      )}
      <FormFlex>
        {licenseList ? (
          <Select
            key={selectedLicense.value}
            onChange={(e: any) => {
              formik.setFieldValue(
                'license',
                e.value ? e.value : e.map((elm) => elm.value)
              );
              if (errors.license) errors.license = false;
            }}
            options={licenseList}
            label="Licenses"
            inputId="license"
            isRequired
            errorMessage={errors.license}
            defaultValue={{
              label: selectedLicense.label,
              value: selectedLicense.value,
            }}
          />
        ) : null}
        <Text
          variant="pt16b"
          style={{ alignSelf: 'flex-end' }}
          mb={'8px'}
          paddingX="16px"
        >
          OR
        </Text>
        <LicenseButton>
          <LinkButton
            label="Create New"
            href={`/providers/${router.query.provider}/dashboard/licenses/request`}
            type="create"
            kind="primary"
          />
        </LicenseButton>
      </FormFlex>

      {selectedLicense?.additions?.length ? (
        <CheckboxGroup
          defaultValue={values.additions}
          label="Select Additonal Conditions"
          onChange={(e) =>
            formik.setFieldValue(
              'additions',
              e.map((e) => Number(e))
            )
          }
        >
          {selectedLicense.additions.map((item) => {
            return (
              <Checkbox key={item.id} value={item.id}>
                {item.title}
              </Checkbox>
            );
          })}
        </CheckboxGroup>
      ) : null}

      <DAMActions
        formik={formik}
        users={isClone ? 0 : modelData?.active_users}
        values={values}
        router={router}
        isClone={isClone}
      />
    </Form>
  );
};

export { AccessModelForm };

const Form = styled.form`
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
`;

const FormFlex = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  justify-content: space-between;

  > div {
    flex-grow: 1;
    flex-basis: 100px;
  }
`;

const LicenseButton = styled.div`
  align-self: flex-end;
  flex-basis: 40%;

  display: flex;
  justify-items: flex-end;

  margin-bottom: 4px;
`;

const SubmitWrapper = styled.div`
  justify-content: flex-end;
  align-items: center;
  /* align-self: flex-end; */
  border-bottom: 1px solid var(--color-gray-02);
  width: 100%;

  display: flex;
  gap: 24px;
  margin-top: 20px;
`;

function DAMActions({ values, router, formik, users, isClone }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [disableAccessDataModel, disableAccessDataModelRes] = useMutation(
    DISABLE_DATA_ACCESS_MODEL
  );
  function handleDisable(id) {
    mutation(disableAccessDataModel, disableAccessDataModelRes, {
      id: id,
    })
      .then(() => {
        toast.success('Access Model disabled');
        router.replace(
          `/providers/${router.query.provider}/dashboard/data-access-model`
        );
      })
      .catch(() => toast.error('Error while disabling Access Model'));
  }
  return (
    <>
      <SubmitWrapper>
        {users > 0 && values.type !== 'OPEN' && (
          <Aside
            title={'Save Unavailable. There are active users for this model.'}
          />
        )}
        <Flex gap="10px">
          {values.id && (
            <>
              <Button
                kind="primary"
                bg="var(--color-error)"
                onPress={() => setIsOpen(!isOpen)}
              >
                Disable Model
              </Button>
              <Modal
                isOpen={isOpen}
                label="model disable confirmation"
                modalHandler={() => setIsOpen(!isOpen)}
              >
                <DisableWrapper>
                  <header>
                    <Heading as="h1" variant="h3">
                      Confirmation
                    </Heading>
                    <Button
                      kind="custom"
                      onPress={() => setIsOpen(!isOpen)}
                      iconOnly
                      icon={<Close />}
                    >
                      Close Modal
                    </Button>
                  </header>
                  <Text mt="12px">
                    Are you sure you want to disable {values.title}
                  </Text>

                  <ButtonGroup>
                    <Button
                      kind="primary-outline"
                      size="sm"
                      onPress={() => setIsOpen(!isOpen)}
                    >
                      Cancel
                    </Button>
                    <Button
                      kind="primary"
                      size="sm"
                      onPress={() => handleDisable(values.id)}
                    >
                      Confirm
                    </Button>
                  </ButtonGroup>
                </DisableWrapper>
              </Modal>
            </>
          )}
          <Button
            kind="primary-outline"
            as="a"
            href={`/providers/${router.query.provider}/dashboard/data-access-model`}
          >
            Cancel
          </Button>
          <Tooltip mode="dark" disabled={!(users > 0)}>
            <Button
              type="submit"
              kind="primary"
              isDisabled={users > 0 && values.type !== 'OPEN'}
              onPress={(e) => {
                formik.handleSubmit(e);
              }}
            >
              {formik.values.id ? 'Save ' : isClone ? 'Clone ' : 'Create '}{' '}
              Access Model
            </Button>
            <span>
              Save Unavailable. There are active users for this model.
            </span>
          </Tooltip>
        </Flex>
      </SubmitWrapper>
    </>
  );
}

const DisableWrapper = styled.div`
  padding: 16px;
  background-color: var(--color-white);
  border-radius: 4px;
  width: 90vw;
  max-width: 480px;

  display: flex;
  flex-direction: column;

  > header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 24px;
  }

  span {
    display: block;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 32px;
  align-self: flex-end;
`;
