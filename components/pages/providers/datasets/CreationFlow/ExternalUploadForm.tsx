import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Upload } from 'components/actions/Upload/Upload';
import { Button } from 'components/actions';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'Store';
import { useMutation, useQuery } from '@apollo/client';
import { useFormik } from 'formik';
import {
  ADD_RESOURCE,
  GET_RESOURCE_BY_ID,
  mutation,
  UPDATE_RESOURCE,
} from 'services';
import { toast } from 'react-toastify';
import { TextArea, TextField } from 'components/form';
import { Flex } from 'components/layouts/FlexWrapper';
import { Text } from 'components/layouts';
import { Link } from 'components/layouts/Link';
import * as Yup from 'yup';
import { Heading } from 'components/layouts';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@radix-ui/react-accordion';
import { Minus, Plus } from 'components/icons';
import { ComponentWrapper } from '../Metadata/Metadata';
import { Loader } from 'components/common';
import { LinkButton } from 'components/pages/dashboard/helpers';

const validationSchema = Yup.object().shape({
  title: Yup.string().required('Required'),
  description: Yup.string()
    .required('Required')
    .max(500, 'Length should not be more than 500 characters'),
  external_url: Yup.string().required('Required'),
});

const ExternalUploadForm = ({
  updateStore,
  setCurrentTab,
  resourceId = undefined,
  setResourceId = undefined,
}) => {
  const [currentAccordion, setCurrentAccordion] = useState();

  const dispatch = useDispatch();
  const datasetStore = useSelector((state: RootState) => state.addDataset);

  const [addResourceReq, addResourceRes] = useMutation(ADD_RESOURCE);

  const [updateResource, updateResourceRes] = useMutation(UPDATE_RESOURCE);

  const { loading, data, error } = useQuery(GET_RESOURCE_BY_ID, {
    variables: {
      resource_id: resourceId,
    },
    skip: !resourceId,
  });

  const editObj = !loading && !error && { ...data?.resource };

  useEffect(() => {
    updateStore();
  }, []);

  React.useEffect(() => {
    if (resourceId) {
      const updateResourceObj = {
        id: editObj.id,
        title: editObj.title,
        description: editObj.description,
        external_url: editObj.external_url,
        format: {
          label: editObj.file_details?.format,
          value: editObj.file_details?.format,
        },
        masked_fields: [],
        schema: [],
        dataset: datasetStore.id,
        status: 'DRAFT',
        byte_size: editObj.byte_size,
        checksum: editObj.checksum,
        compression_format: editObj.compression_format,
        media_type: editObj.media_type,
        packaging_format: editObj.packaging_format,
        release_date: editObj.release_date,
      };

      formik.setValues(updateResourceObj);
    }
  }, [loading]);

  const formik: any = useFormik({
    initialValues: {
      id: null,
      title: datasetStore.title,
      description: datasetStore.description,
      external_url: '',
      format: '',
      masked_fields: [],
      schema: [],
      dataset: datasetStore.id,
      status: 'DRAFT',
      byte_size: 0,
      checksum: '',
      compression_format: '',
      media_type: '',
      packaging_format: '',
      release_date: '',
    },
    validationSchema,
    validateOnChange: false,
    onSubmit: (values) => {
      resourceId ? UpdateResource(values, resourceId) : CreateResource(values);
    },
  });

  const { errors } = formik;

  const [isLoading, setIsLoading] = useState(false);

  const CreateResource = (values) => {
    const submitValues = { ...values };

    const mutationVariables = {
      dataset: submitValues.dataset,
      description: submitValues.description,
      external_url: submitValues.external_url,
      id: submitValues.id,
      masked_fields: [],
      schema: [],
      status: submitValues.status,
      title: submitValues.title,
      byte_size: submitValues.byte_size,
      checksum: submitValues.checksum,
      compression_format: submitValues.compression_format,
      media_type: submitValues.media_type,
      packaging_format: submitValues.packaging_format,
      ...(values.release_date.length > 0
        ? { release_date: values.release_date }
        : {}),
    };
    setIsLoading(true);

    mutation(addResourceReq, addResourceRes, {
      resource_data: {
        ...mutationVariables,
      },
    })
      .then((res) => {
        if (res.create_resource.success) {
          updateStore();
          formik.resetForm();
          setIsLoading(false);

          toast.success('Distribution added successfully');
          setCurrentTab('list');
        } else {
          toast.error(res.create_resource.errors.id[0]);
        }
      })
      .catch((err) => {
        toast.error(err.message);
        setIsLoading(false);
      });
  };

  const UpdateResource = (values, resourceId) => {
    const submitValues = { ...values };

    const oldSchema = datasetStore.resource_set.find(
      (item) => item.id === resourceId
    );

    const mutationVariables = {
      dataset: submitValues.dataset,
      description: submitValues.description,
      external_url: submitValues.external_url,
      id: resourceId,
      masked_fields: [],
      schema: oldSchema.schema,
      status: submitValues.status,
      title: submitValues.title,
      byte_size: submitValues.byte_size,
      checksum: submitValues.checksum,
      compression_format: submitValues.compression_format,
      media_type: submitValues.media_type,
      packaging_format: submitValues.packaging_format,
      release_date: submitValues.release_date,
    };
    setIsLoading(true);

    mutation(updateResource, updateResourceRes, {
      resource_data: {
        ...mutationVariables,
      },
    })
      .then((res) => {
        if (res.update_resource.success) {
          toast.success('Distribution modified successfully');
          updateStore();
          formik.resetForm();
          setIsLoading(false);
          setResourceId(null);
          setCurrentTab('list');
        }
      })

      .catch(() => {
        toast.error('Error while modifying the distribution');
        setIsLoading(false);
      });
  };

  const dcatLinks = {
    byte_size: 'https://www.w3.org/TR/vocab-dcat-3/#Property:distribution_size',
    checksum:
      'https://www.w3.org/TR/vocab-dcat-3/#Property:distribution_checksum',
    compression_format:
      'https://www.w3.org/TR/vocab-dcat-3/#Property:distribution_compression_format',
    media_type:
      'https://www.w3.org/TR/vocab-dcat-3/#Property:distribution_media_type',
    packaging_format:
      'https://www.w3.org/TR/vocab-dcat-3/#Property:distribution_packaging_format',
    release_date:
      'https://www.w3.org/TR/vocab-dcat-3/#Property:resource_release_date',
  };

  return (
    <>
      <ComponentWrapper>
        <HeaderWrapper>
          <Heading as="h2" variant="h3" marginY={'auto'}>
            {formik.values.id ? 'Edit Distribution' : 'Add Distribution'}
          </Heading>
          <AddDistribution title="Back to Distribution List">
            <LinkButton
              label="Back to Distribution List"
              type="back"
              onClick={() => setCurrentTab('list')}
            />
          </AddDistribution>
        </HeaderWrapper>

        {isLoading ? (
          <Loader />
        ) : (
          <>
            {' '}
            <Form
              onSubmit={(e) => {
                e.preventDefault();
              }}
              noValidate
            >
              {/* <Heading variant="h5">
                {formik.values.id
                  ? 'Save Distribution by Editing the file below'
                  : 'Add Distribution by uploading file below'}
              </Heading> */}
              <Flex gap="33px" flexWrap={'wrap'}>
                <InputFields>
                  <TextField
                    label="Title"
                    name="title"
                    isRequired
                    maxLength={100}
                    value={formik.values?.title}
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
                    value={formik.values?.description}
                    onChange={(e) => {
                      formik.setFieldValue('description', e);
                      errors.description && formik.validateField('description');
                    }}
                    errorMessage={errors.description}
                    rows={5}
                    isRequired
                  />
                  <TextField
                    label="External Link"
                    name="link"
                    isRequired
                    value={formik.values?.external_url}
                    onChange={(e) => {
                      formik.setFieldValue('external_url', e);
                      errors.title && formik.validateField('external_url');
                    }}
                    errorMessage={errors.external_url}
                  />
                </InputFields>
              </Flex>
              {formik.values.id ? (
                <>
                  <Flex gap="4px" marginTop={'4px'}>
                    <Text fontWeight="bold">Uploaded File:</Text>
                    <Link
                      href={`${process.env.NEXT_PUBLIC_BACKEND_URL}/download/${resourceId}`}
                      passHref
                    >
                      <a>
                        <Text>
                          <Underline>
                            {editObj.file_details?.file
                              .toString()
                              .split('/')
                              .pop()}
                          </Underline>
                        </Text>
                      </a>
                    </Link>
                  </Flex>
                </>
              ) : (
                ''
              )}

              <Accordion
                type="single"
                collapsible
                key={'Additional Fields'}
                value={currentAccordion}
                onValueChange={(e: any) => setCurrentAccordion(e)}
              >
                <StyledTabItem value="Additional">
                  <StyledTabTrigger>
                    <Heading
                      variant={'h5'}
                      fontWeight={'bold'}
                      color={'var(--text-light)'}
                    >
                      Optional Fields{' '}
                    </Heading>
                    <div>
                      {currentAccordion === 'Additional' ? (
                        <Minus fill="var(--color-primary)" />
                      ) : (
                        <Plus fill="var(--color-primary)" />
                      )}
                    </div>
                  </StyledTabTrigger>

                  <StyledTabContent>
                    <TextField
                      label={'Byte Size'}
                      maxLength={100}
                      onChange={(e) => formik.setFieldValue('byte_size', e)}
                      value={formik.values.byte_size}
                      type="number"
                      externalHelpLink={dcatLinks.byte_size}
                    />
                    <TextField
                      label={'Checksum'}
                      maxLength={100}
                      onChange={(e) => formik.setFieldValue('checksum', e)}
                      value={formik.values.checksum}
                      externalHelpLink={dcatLinks.checksum}
                    />
                    <TextField
                      label={'Compression Format'}
                      maxLength={100}
                      onChange={(e) =>
                        formik.setFieldValue('compression_format', e)
                      }
                      value={formik.values.compression_format}
                      externalHelpLink={dcatLinks.compression_format}
                    />
                    <TextField
                      label={'Media Type'}
                      maxLength={100}
                      onChange={(e) => formik.setFieldValue('media_type', e)}
                      value={formik.values.media_type}
                      externalHelpLink={dcatLinks.media_type}
                    />
                    <TextField
                      label={'Packaging Format'}
                      maxLength={100}
                      onChange={(e) =>
                        formik.setFieldValue('packaging_format', e)
                      }
                      value={formik.values.packaging_format}
                      externalHelpLink={dcatLinks.packaging_format}
                    />
                    <TextField
                      label={'Release Date'}
                      type="date"
                      onChange={(e) => formik.setFieldValue('release_date', e)}
                      value={formik.values.release_date}
                      externalHelpLink={dcatLinks.release_date}
                    />
                  </StyledTabContent>
                </StyledTabItem>
              </Accordion>
            </Form>
            <SubmitWrapper>
              <Button
                onPress={formik.handleSubmit}
                kind="primary"
                title={
                  formik.values.id ? 'Save Distribution' : 'Add Distribution'
                }
              >
                {formik.values.id ? 'Save Distribution' : 'Add Distribution'}
              </Button>
            </SubmitWrapper>
          </>
        )}
      </ComponentWrapper>
    </>
  );
};

export default ExternalUploadForm;

const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  border-bottom: 2px solid var(--color-gray-01);
`;
const NextButton = styled.div`
  margin-left: auto;
`;
const AddDistribution = styled.div`
  padding-bottom: 17px;
  button {
    margin: auto;
    border: 2px solid var(--color-tertiary-1-00);
    color: var(--color-tertiary-1-00);
    background-color: var(--color-background-lightest);
  }
`;

const UploadWrapper = styled.div`
  max-width: 340px;
  min-height: 240px;
  /* margin: auto; */
`;
const InputFields = styled.div`
  width: 100%;
  flex: 1 0 33.33%;
  margin: auto;
  > div {
    margin-bottom: 20px;
  }
`;
const Underline = styled.a`
  text-decoration: underline;
`;

const SubmitWrapper = styled.div`
  margin: auto;
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 32px;

  > button {
    background-color: var(--color-secondary-01);
    color: var(--color-background-lightest);
    margin-left: 8px;
  }
`;

const Form = styled.form`
  margin-top: 24px;
  display: flex;
  flex-direction: column;

  width: 100%;
`;

const StyledTabItem = styled(AccordionItem)`
  background-color: var(--color-background-lightest);
  margin-top: 16px;
`;

const StyledTabTrigger = styled(AccordionTrigger)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  width: 100%;
  padding-block: 12px 8px;
  padding-inline: 0;
  background-color: var(--color-background-lightest);
  border-bottom: 1px solid var(--color-grey-500);

  font-weight: 600;
  font-size: 18px;

  > div {
    display: flex;
    align-items: center;
    gap: 8px;
  }
`;

const StyledTabContent = styled(AccordionContent)`
  padding-block: 16px;
  > div {
    margin-bottom: 20px;
  }
`;
