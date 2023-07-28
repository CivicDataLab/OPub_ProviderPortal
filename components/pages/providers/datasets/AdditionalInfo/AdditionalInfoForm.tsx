import { useMutation } from '@apollo/client';
import { Button } from 'components/actions';
import { Upload } from 'components/actions/Upload/Upload';
import { Heading } from 'components/layouts';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Select, TextArea, TextField } from 'components/form';
import { useEffect } from 'react';
import { CREATE_ADDLINFO, mutation } from 'services';
import { RootState } from 'Store';
import styled from 'styled-components';
import * as Yup from 'yup';
import { ComponentWrapper } from '../Metadata/Metadata';
import React from 'react';
import { LinkButton } from 'components/pages/dashboard/helpers';
import { Flex } from 'components/layouts/FlexWrapper';
import { InstructionsWrapper } from '../../CreationFlow';
import { UPDATE_ADDLINFO } from 'services/schema';
import { Text } from 'components/layouts';
import { Link } from 'components/layouts/Link';

const validationSchema = Yup.object().shape({
  title: Yup.string().required('Required'),
  description: Yup.string()
    .required('Required')
    .max(500, 'Length should not be more than 500 characters'),
});
const AdditionalInfoForm = ({
  updateStore,
  setCurrentTab,
  resourceId = undefined,
  setResourceId = undefined,
}) => {
  const datasetStore = useSelector((dataset: RootState) => dataset.addDataset);

  const additionalinfo_data = {
    ...datasetStore.additionalinfo_set.filter((item) => item.id === resourceId),
  };

  useEffect(() => {
    updateStore();
  }, []);

  const dispatch = useDispatch();
  const [createDataStoryReq, createDataStoryRes] = useMutation(CREATE_ADDLINFO);
  const [updateDataStoryReq, updateDataStoryRes] = useMutation(UPDATE_ADDLINFO);

  const TypeList = [
    { value: 'DATASTORY', label: 'DATASTORY' },
    { value: 'REPORT', label: 'REPORT' },
    { value: 'BLOG', label: 'BLOG' },
    { value: 'USECASE', label: 'USECASE' },
    { value: 'OTHER', label: 'OTHER' },
  ];
  const FormatList = [
    { value: 'DOCX', label: 'DOCX' },
    { value: 'TXT', label: 'TXT' },
    { value: 'PDF', label: 'PDF' },
    { value: 'OTHER', label: 'OTHER' },
  ];

  React.useEffect(() => {
    if (resourceId) {
      const updateResourceObj = {
        id: additionalinfo_data[0].id,
        title: additionalinfo_data[0].title,
        description: additionalinfo_data[0].description,
        file: additionalinfo_data[0]?.file,
        remote_url: additionalinfo_data[0]?.remote_url,
        format: {
          label: additionalinfo_data[0]?.format,
          value: additionalinfo_data[0]?.format,
        },
        type: {
          label: additionalinfo_data[0]?.type,
          value: additionalinfo_data[0]?.type,
        },
      };

      formik.setValues(updateResourceObj);
    }
  }, []);

  const formik: any = useFormik({
    initialValues: {
      title: datasetStore.title,
      description: datasetStore.description,
      type: '',
      format: '',
      file: null,
      id: null,
      remote_url: '',
      dataset: datasetStore.id,
    },
    // validate,
    validationSchema,
    validateOnChange: false,
    onSubmit: (values) => {
      resourceId
        ? UpdateDataStoryToServer(values, resourceId)
        : DataStoryToServer(values);
    },
  });
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 20, behavior: 'smooth' });
    }
  }, []);

  const DataStoryToServer = (values) => {
    const submitValues = { ...values };
    if (submitValues.file || submitValues.remote_url.length) {
      const mutationVariables = {
        title: submitValues.title,
        description: submitValues.description,
        type: submitValues.type.value,
        format: submitValues.format.value,
        file: submitValues.file,
        remote_url: submitValues.remote_url,
        dataset: submitValues.dataset,
      };

      mutation(createDataStoryReq, createDataStoryRes, {
        info_data: {
          ...mutationVariables,
        },
      })
        .then((res) => {
          updateStore();

          toast.success('Additional Information submitted successfully');
          formik.resetForm();
          setCurrentTab('list');
        })
        .catch(() => {
          toast.error('Error in the Mutation Request');
        });
    } else {
      toast.error('Please provide a file or URL');
    }
  };
  const UpdateDataStoryToServer = (values, resourceId) => {
    const submitValues = { ...values };
    if (submitValues.file || submitValues.remote_url.length) {
      const mutationVariables = {
        id: resourceId,
        title: submitValues.title,
        description: submitValues.description,
        type: submitValues.type.value,
        format: submitValues.format.value,
        file: submitValues.file,
        remote_url: submitValues.remote_url,
        dataset: datasetStore.id,
      };

      mutation(updateDataStoryReq, updateDataStoryRes, {
        info_data: {
          ...mutationVariables,
        },
      })
        .then((res) => {
          updateStore();
          setResourceId(null);
          toast.success('Additional Information modified successfully');
          formik.resetForm();
          setCurrentTab('list');
        })
        .catch(() => {
          toast.error('Error while modifying the additional information ');
        });
    } else {
      toast.error('Please provide a file or URL');
    }
  };
  const { errors } = formik;

  return (
    <>
      <ComponentWrapper>
        <HeaderWrapper>
          <Heading as="h2" variant="h3" marginY={'auto'}>
            {formik.values.id
              ? 'Edit Additional Information (Optional)'
              : ' Additional Information (Optional)'}
          </Heading>

          <AddTransform title="Move to Additional Information List">
            <LinkButton
              kind="primary"
              label="Back to Additional Information List"
              type="back"
              onClick={() => setCurrentTab('list')}
            />
          </AddTransform>
        </HeaderWrapper>
        <InstructionsWrapper>
          <Heading variant="h5" as={'h2'}>
            Instructions
          </Heading>
          <div>
            <ul>
              <li>The file size should not be more than 8 MB</li>
              <li>
                Supported file type are .csv, .json, .xml, .pdf, .docx, .txt,
                .png, .svg, .jpg, .jpeg
              </li>
              <li>
                Share additional information related to the dataset such as blog
                post, methodology documentation, report, visualisation, etc.
              </li>
            </ul>
          </div>
        </InstructionsWrapper>
        <Form>
          <Flex gap="33px" flexWrap={'wrap'}>
            <UploadWrapper>
              <Upload
                formik={formik}
                id="remote_url"
                urlName="remote_url"
                fileTypes=".csv, .json, .xml, .pdf, .docx, .txt, .png, .svg, .jpg, .jpeg"
                fileName="file"
                linkDescription="Enter the URL for the licence document"
              />
            </UploadWrapper>
            <InputFields>
              <TextField
                label="Title"
                name="title"
                value={formik.values?.title}
                maxLength={100}
                isRequired
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
                rows={7}
                isRequired
              />
            </InputFields>
          </Flex>
          {formik.values.id && formik.values.file ? (
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
                        {additionalinfo_data[0]?.file
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
          <Select
            options={TypeList}
            inputId={formik.type}
            value={formik.values?.type}
            onChange={(e) => {
              formik.setFieldValue('type', e);
              if (errors.type) errors.type = false;
            }}
            label={'Type'}
          />

          <Select
            options={FormatList}
            inputId={formik.format}
            value={formik.values?.format}
            onChange={(e) => {
              formik.setFieldValue('format', e);
              if (errors.format) errors.format = false;
            }}
            label={'Format'}
          />

          <SubmitWrapper>
            <Button kind="primary" size="sm" onPress={formik.handleSubmit}>
              {formik.values.id
                ? 'Save Additional Information'
                : 'Add Additional Information'}
            </Button>
          </SubmitWrapper>
        </Form>
      </ComponentWrapper>
    </>
  );
};
export default AdditionalInfoForm;

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

const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  border-bottom: 2px solid var(--color-gray-01);
  padding-bottom: 17px;
`;
const AddTransform = styled.div`
  button {
    border: 2px solid var(--color-secondary-01);
    color: var(--color-secondary-01);
    background-color: var(--color-background-lightest);
    margin-left: 8px;
  }
`;

const NextButton = styled.div`
  margin-left: auto;
  display: flex;
  button {
    margin: auto;
    color: var(--color-secondary-01);
    border-color: var(--color-secondary-01);
  }
  svg {
    transform: rotate(180deg);
  }
`;

const UploadWrapper = styled.div`
  max-width: 336px;
  min-height: 240px;
  margin-top: 27px;
`;
const InputFields = styled.div`
  width: 100%;
  flex: 1 0 33.33%;
  margin: auto;
  > div {
    margin-bottom: 20px;
  }
`;
const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
`;

const Underline = styled.a`
  text-decoration: underline;
`;
