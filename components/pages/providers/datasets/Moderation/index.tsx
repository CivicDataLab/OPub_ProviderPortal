import { DashboardHeader, Heading } from 'components/layouts';
import { Checkmark, ChevronLeft, Close } from '@opub-icons/workflow';
import { Checkbox, TextArea } from 'components/form';
import styled from 'styled-components';
import { Button, Modal } from 'components/actions';
import { useSelector } from 'react-redux';
import { RootState } from 'Store';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { omit } from 'utils/helper';
import { toast } from 'react-toastify';
import {
  CREATE_MODERATION_REQUEST,
  CREATE_REVIEW_REQUEST,
  DATASET_DATA_ACCESS_MODELS,
  mutation,
} from 'services';
import router from 'next/router';
import { useMutation, useQuery } from '@apollo/client';
import { useProviderStore } from 'services/store';
import { Link } from 'components/layouts/Link';
import { Flex } from 'components/layouts/FlexWrapper';
import { Text } from 'components/layouts';
import { useEffect, useState } from 'react';
import { ComponentWrapper, SubmitFotter } from '../Metadata/Metadata';
import { Loader } from 'components/common';

const Moderation = ({ updateStore, handleStep, setSelectedStep }) => {
  const [verifySubmitModalOpen, setVerifySubmitModalOpen] = useState(false);
  useEffect(() => {
    updateStore();
  }, []);
  const datasetStore = useSelector((state: RootState) => state.addDataset);

  const currentOrgRole = useProviderStore((e) => e.org);

  const validationSchema = Yup.object().shape({
    remark: Yup.string()
      .optional()
      .nullable()
      .max(500, 'Description should not be more tan 500 characters'),

    accepted:
      currentOrgRole.role === 'DPA' && Yup.boolean().oneOf([true], 'Required'),
  });

  const { data: damList, loading } = useQuery(DATASET_DATA_ACCESS_MODELS, {
    variables: {
      dataset_id: router.query.datasetId,
      anonymous_users: [],
    },
  });

  const [createModerationReq, createModerationRes] = useMutation(
    CREATE_MODERATION_REQUEST
  );

  const [createReviewReq, createReviewRes] = useMutation(CREATE_REVIEW_REQUEST);

  const initialValues = {
    dataset: datasetStore.id,
    remark: '',
    description: '',
    reject_reason: '',
    status: 'REQUESTED',
    accepted: false,
  };

  const formik: any = useFormik({
    initialValues,
    validationSchema,
    validateOnChange: false,
    onSubmit: () => {
      setVerifySubmitModalOpen(true);
    },
  });

  const submitRequestBasedOnRole = (values) => {
    let submitValues: any = { ...values };
    submitValues = omit(submitValues, ['accepted']);

    setVerifySubmitModalOpen(!verifySubmitModalOpen);

    if (currentOrgRole.role === 'DPA') {
      mutation(createModerationReq, createModerationRes, {
        moderation_request: {
          ...submitValues,
        },
      })
        .then((res) => {
          if (res.moderation_request.success === true) {
            toast.success('Data successfully submitted for review');
            formik.resetForm({
              values: initialValues,
            });
            router.push(
              router.asPath.substr(0, router.asPath.lastIndexOf('/')) +
                '/under-moderation'
            );
          }
        })
        .catch(() => {
          toast.error('Error while submitting for moderation');
        });
    } else {
      mutation(createReviewReq, createReviewRes, {
        review_request: {
          dataset: submitValues.dataset,
          ...(currentOrgRole.role === 'DPA'
            ? { remark: submitValues.remark }
            : { description: submitValues.remark }),
          status: submitValues.status,
        },
      })
        .then((res) => {
          if (res.review_request.success === true) {
            toast.success('Submitted dataset for Review');
            formik.resetForm({
              values: initialValues,
            });
            router.push(
              router.asPath.substr(0, router.asPath.lastIndexOf('/')) +
                '/under-moderation'
            );
          } else {
            toast.error('Error in submitting for Review');
          }
        })
        .catch(() => {
          toast.error('Error in submitting for Review');
        });
    }
  };

  const { values, errors } = formik;

  const verifiedIcon = (condition) => {
    return condition ? (
      <IconWrapper className="success">
        <Checkmark size={20} fill={'var(--color-background-lightest)'} />
      </IconWrapper>
    ) : (
      <IconWrapper className="failure">
        <Close size={20} fill={'var(--color-background-lightest)'} />
      </IconWrapper>
    );
  };

  return (
    <>
      <ComponentWrapper>
        <main>
          <DashboardHeader>
            <Heading as="h2" variant="h3">
              {currentOrgRole.role === 'DPA'
                ? 'Moderation Request'
                : 'Review Request'}
            </Heading>
          </DashboardHeader>

          {currentOrgRole.role === 'DPA' && (
            <>
              <Text variant="pt16b">Data Sharing Agreement</Text>
              <PDFWrapper>
                <object
                  type="application/pdf"
                  data={`${process.env.NEXT_PUBLIC_BACKEND_URL}/public/${datasetStore.accepted_agreement}`}
                  width="100%"
                  height="100%"
                >
                  Alt:{' '}
                  <a
                    href={`${process.env.NEXT_PUBLIC_BACKEND_URL}/public/${datasetStore.accepted_agreement}`}
                  >
                    PDF Link
                  </a>
                </object>
              </PDFWrapper>
            </>
          )}
          <FormWrapper>
            <TextArea
              label={
                currentOrgRole.role === 'DP'
                  ? 'Description'
                  : 'Remarks for Moderator'
              }
              errorMessage={errors.remark}
              rows={8}
              maxLength={500}
              name="remark"
              value={values.remark}
              onChange={(e) => {
                if (errors.remark && e.length > 500) errors.remark = false;
                formik.setFieldValue('remark', e);
              }}
            />
            {currentOrgRole.role === 'DPA' && (
              <Checkbox
                aria-label="Terms and conditions"
                validationState={errors.accepted ? 'invalid' : null}
                name="accepted"
                onChange={(e) => {
                  if (errors.accepted) errors.accepted = false;
                  formik.setFieldValue('accepted', e);
                }}
              >
                I hereby agree to the terms and conditions of access, usage and
                storage contained in the Data Sharing Agreement
              </Checkbox>
            )}
          </FormWrapper>
        </main>
      </ComponentWrapper>
      <SubmitFotter>
        <Flex justifyContent={'space-between'} gap="10px" marginTop={'10px'}>
          <Button
            kind="primary-outline"
            onPress={() => {
              handleStep(0);
              setSelectedStep('additional-info');
            }}
            title={'Move to Additional Information'}
            icon={<ChevronLeft />}
            iconSide={'left'}
          >
            Additional Information
          </Button>

          <Flex gap={'10px'}>
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
            {datasetStore.funnel && (
              <Button
                kind="primary"
                onPress={() => formik.handleSubmit()}
                title={
                  !['Additional Info', 'Ready to Review'].includes(
                    datasetStore.funnel
                  )
                    ? 'Add Data Access Model to Submit for Moderation'
                    : 'Submit for Moderation'
                }
              >
                Verify & Submit
              </Button>
            )}
          </Flex>
        </Flex>
      </SubmitFotter>

      <Modal
        label={'Verification Modal'}
        isOpen={verifySubmitModalOpen}
        modalHandler={() => setVerifySubmitModalOpen(!verifySubmitModalOpen)}
      >
        <ModalContentWrapper>
          <ModalHeader>
            <Heading as="h3" variant="h4">
              Verification
            </Heading>
            <Button
              kind="custom"
              size="md"
              icon={<Close />}
              onPress={() => setVerifySubmitModalOpen(!verifySubmitModalOpen)}
            />
          </ModalHeader>

          {loading ? (
            <Loader />
          ) : (
            <>
              <Flex
                flexDirection={'column'}
                gap="10px"
                padding={'10px'}
                paddingX={'30px'}
              >
                <Flex flexDirection={'row'} gap="10px">
                  {verifiedIcon(datasetStore.remote_issued.length > 0)}
                  <Text>All mandatory fields in Metadata</Text>
                </Flex>

                <Flex flexDirection={'row'} gap="10px">
                  {verifiedIcon(datasetStore.resource_set.length > 0)}
                  <Text>
                    Atleast one Distribution added with required parameters
                  </Text>
                </Flex>
                {datasetStore.dataset_type === 'EXTERNAL' && (
                  <Flex flexDirection={'row'} gap="10px">
                    {verifiedIcon(
                      datasetStore?.externalaccessmodel_set[0]?.license.id
                    )}
                    <Text>Atleast one Licence added</Text>
                  </Flex>
                )}
                {datasetStore.dataset_type !== 'EXTERNAL' && (
                  <>
                    <Flex flexDirection={'row'} gap="10px">
                      {damList &&
                        verifiedIcon(damList?.dataset_access_model.length > 0)}
                      <Text>Atleast one Dataset Access Model added</Text>
                    </Flex>
                    <Flex flexDirection={'row'} gap="10px">
                      {verifiedIcon(
                        damList &&
                          damList?.dataset_access_model.length > 0 &&
                          damList?.dataset_access_model.filter(
                            (item) =>
                              item.datasetaccessmodelresource_set.length === 0
                          ).length === 0
                      )}
                      <Text>
                        Distributions should not be removed from the Dataset
                        Access Models
                      </Text>
                    </Flex>
                  </>
                )}
              </Flex>

              <Line />
              <Flex paddingTop={'10px'} gap={'10px'} justifyContent="flex-end">
                <Button
                  kind="primary"
                  size="sm"
                  onPress={() => {
                    submitRequestBasedOnRole(values);
                  }}
                  isDisabled={
                    datasetStore.dataset_type === 'EXTERNAL'
                      ? !(
                          datasetStore.remote_issued.length > 0 &&
                          datasetStore.resource_set.length > 0 &&
                          datasetStore?.externalaccessmodel_set[0]?.license.id
                        )
                      : !(
                          datasetStore.remote_issued.length > 0 &&
                          datasetStore.resource_set.length > 0 &&
                          damList &&
                          damList?.dataset_access_model.length > 0 &&
                          damList?.dataset_access_model.filter(
                            (item) =>
                              item.datasetaccessmodelresource_set.length === 0
                          ).length === 0
                        )
                  }
                >
                  {currentOrgRole.role === 'DP'
                    ? 'Submit for Review'
                    : 'Submit for Moderation'}
                </Button>
              </Flex>
            </>
          )}
        </ModalContentWrapper>
      </Modal>
    </>
  );
};

export default Moderation;

const FormWrapper = styled.form`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 12px;
  button {
    align-self: flex-end;
  }
  button:disabled,
  button[disabled] {
    border: 1px solid #999999;
    background-color: #cccccc;
    color: #666666;
  }
`;

const PDFWrapper = styled.main`
  margin-top: 16px;
  height: 70vh;
`;

const ModalContentWrapper = styled.div`
  background-color: var(--color-background-lightest);
  min-width: 629px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  padding: 16px;

  .success {
    background-color: var(--color-success);
  }

  .failure {
    background-color: var(--color-error);
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  padding-bottom: 10px;
`;

const Line = styled.div`
  border: 1px solid var(--color-gray-01);
  margin-inline: 20px;
  margin-top: 10px;
`;

const IconWrapper = styled.div`
  cursor: pointer;
  border-radius: 400px;
  width: 24px;
  height: 24px;
  border: 2px solid var(--color-gray-02);
  display: flex;
  justify-content: center;
`;
