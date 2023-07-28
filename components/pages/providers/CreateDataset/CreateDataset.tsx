import { useMutation } from '@apollo/client';
import { Button } from 'components/actions';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { CREATE_DATASET, mutation } from 'services';
import { updateDatasetElements } from 'slices/addDatasetSlice';
import styled from 'styled-components';
import { useFormik } from 'formik';
import { TextArea, TextField } from 'components/form';
import * as Yup from 'yup';
import { DashboardHeader, Heading, ShowMore, Text } from 'components/layouts';
import { DataUpload, Link, LinkNav } from '@opub-icons/workflow';
import { MainWrapper } from 'components/pages/user/Layout';
import { Flex } from 'components/layouts/FlexWrapper';

const validationSchema = Yup.object().shape({
  title: Yup.string().required('Required'),

  description: Yup.string()
    .required('Required')
    .max(1500, 'Length should not be more than 1500 characters'),
});

const CreateDataset = () => {
  const router = useRouter();

  const [resourceOption, setResourceOption] = useState('API');

  const optionHandler = (optionSelected) => {
    setResourceOption(optionSelected);
  };

  const DatasetCreationOptions = [
    {
      name: 'APIs',
      id: 'API',
      image: <Link width={32} />,
    },
    {
      name: 'File',
      id: 'FILE',
      image: <DataUpload width={32} />,
    },

    {
      name: 'External',
      id: 'EXTERNAL',
      image: <LinkNav width={32} />,
    },
  ];

  const dispatch = useDispatch();

  const handleMetadataChange = (e, elementType) => {
    dispatch(
      updateDatasetElements({
        type: elementType,
        value: e.target.value,
      })
    );
  };

  const [terms, setTerms] = useState([]);

  useEffect(() => {
    if (resourceOption !== 'EXTERNAL') {
      setTerms([
        'The Data Provider confirms that they have the full power and authority to accept these Terms and Conditions and to be the signatory for the Dataset Sharing Agreement to be completed at the end of this data sharing process.',
        'The Data Provider has obtained all approvals, including any institutional, ethics and regulatory approvals, necessary to make the dataset available via India Datasets Platform and for the storage, usage and distribution of the data/metadata concerned by India Datasets Platform.',
        'The Data Provider confirms that sharing of the data/metadata via India Datasets Platform, and the storage, usage and distribution of the data/metadata by India Datasets Platform, will not infringe or invade any existing rights of third parties upon the data/metadata concerned (if any).',
        'The Data Provider agrees to submit the shared data/metadata, if and when required, to the Data Provider’s institutional review board and/or by the data review mechanism implemented for India Datasets Platform (as specified by IDMO/Competent Authorities).',
        'The Data Provider agrees to cooperate with the administrators of India Datasets Platform and/or other Competent Authority(ies) to address legal/technical/other problems that may be identified in relation to the shared data/metadata, including any problem reported by users of the India Datasets Platform.',
      ]);
    } else {
      setTerms([
        'The Data Provider confirms that they have the full power and authority to accept these Terms and Conditions and to be the signatory for the Dataset Sharing Agreement to be completed at the end of this data sharing process.',
        'The Data Provider has obtained all approvals, including any institutional, ethics and regulatory approvals, necessary to make the dataset available via India Datasets Platform and for the storage, usage and distribution of the data/metadata concerned by India Datasets Platform.',
        'The Data Provider confirms that sharing of the data/metadata via India Datasets Platform, and the storage, usage and distribution of the data/metadata by India Datasets Platform, will not infringe or invade any existing rights of third parties upon the data/metadata concerned (if any).',
        'The Data Provider agrees to submit the shared data/metadata, if and when required, to the Data Provider’s institutional review board and/or by the data review mechanism implemented for India Datasets Platform (as specified by IDMO/Competent Authorities).',
        'The Data Provider agrees to cooperate with the administrators of India Datasets Platform and/or other Competent Authority(ies) to address legal/technical/other problems that may be identified in relation to the shared data/metadata, including any problem reported by users of the India Datasets Platform.',
      ]);
    }
  }, [resourceOption]);

  const terms_conditions = terms;

  const [addDatasetReq, datasetCreationRes] = useMutation(CREATE_DATASET);

  // Method to create dataset ID at server and redirect to Edit Dataset flow with the new ID

  const formik: any = useFormik({
    initialValues: {
      title: '',
      description: '',
    },
    // validate,
    validationSchema,
    validateOnChange: false,
    onSubmit: (values) => {
      handleCreation(values);
    },
  });

  const { values, errors } = formik;
  const handleCreation = (values) => {
    mutation(addDatasetReq, datasetCreationRes, {
      dataset_data: {
        title: values.title,
        description: values.description,
        dataset_type: resourceOption,
        funnel: 'Metadata',
      },
    })
      .then((res) => {
        // Redirect to Upload component with the ID on success of the above promise

        if (res.create_dataset.success) {
          dispatch(
            updateDatasetElements({
              type: 'updateTitle',
              value: res.create_dataset.dataset.title,
            })
          );
          dispatch(
            updateDatasetElements({
              type: 'updateDescription',
              value: res.create_dataset.dataset.description,
            })
          );
          toast.success('Dataset created successfully');

          router.replace(
            `/providers/${router.query.provider}/dashboard/datasets/create-new?datasetId=${res.create_dataset.dataset.id}`
          );
        } else {
          throw new Error(res.create_dataset.errors.id[0]);
        }
      })
      .catch((error) => {
        toast.error('Error in creating dataset: ' + error.message);
      });
  };

  return (
    <MainWrapper fullWidth>
      <form onSubmit={formik.handleSubmit}>
        <DashboardHeader>
          <Heading variant="h2" as={'h1'}>
            Add New Dataset
          </Heading>
        </DashboardHeader>
        <Heading variant="h4" as={'h2'}>
          Select Source Type
        </Heading>
        <DatasetType>
          {DatasetCreationOptions.map((type) => (
            <Card
              isActive={resourceOption === type.id}
              onClick={() => {
                optionHandler(type.id);
              }}
              key={type.id}
            >
              <div>
                {type.image}

                <Heading as={'h3'} variant={'h4'}>
                  {type.name}
                </Heading>
              </div>
            </Card>
          ))}
        </DatasetType>

        <TextField
          label="Title"
          name="title"
          isRequired
          maxLength={100}
          errorMessage={errors.title}
          onChange={(e) => {
            formik.setFieldValue('title', e);
            if (errors.title) errors.title = false;
          }}
          value={formik.values?.title}
          indicator="icon"
        />

        <TextArea
          label="Description"
          name="description"
          errorMessage={errors.description}
          marginTop="8px"
          maxLength={1500}
          rows={5}
          onChange={(e) => {
            formik.setFieldValue('description', e);
            if (errors.description) errors.description = false;
          }}
          value={formik.values?.description}
          isRequired
          indicator="icon"
        />
        <Terms_conditions>
          <Heading variant="h4" marginBottom={'8px'}>
            General Terms & Conditions
          </Heading>

          <ShowMore height={400} openLabel="Show More" closeLabel="Show Less">
            {terms_conditions.map((termsItem, index) => (
              <ul key={`TermsConditions-${index}`}>
                <li>
                  <Text color={'var(--text-high)'}>{termsItem}</Text>
                </li>
              </ul>
            ))}
          </ShowMore>
        </Terms_conditions>
        <Line />
        <Flex alignItems="center" gap="8px" justifyContent="flex-end" mt="16px">
          <Button
            kind="primary"
            size="sm"
            onPress={() => formik.handleSubmit()}
          >
            Accept &#38; Add
          </Button>
        </Flex>
      </form>
    </MainWrapper>
  );
};

export default CreateDataset;
const Line = styled.div`
  border-bottom: 2px solid var(--color-gray-02);
`;
const Terms_conditions = styled.div`
  margin-block: 24px 28px;
  > div {
    padding-left: 24px;
  }
  ul {
    list-style-type: disc;
  }
  li {
    padding-left: 4px;
  }
`;

const DatasetType = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  width: 100%;
  margin: 1rem 0;
`;

const Card = styled.div<any>`
  background-color: ${(props) =>
    props.isActive ? 'var(--color-secondary-06)' : 'var(--color-gray-01)'};
  justify-content: center;
  text-align: center;
  display: block;
  width: 176px;
  height: 104px;
  color: var(--text-light);
  border-radius: 4px;
  cursor: pointer;
  > div {
    margin-block: 20px;
  }
  svg {
    fill: ${(props) =>
      props.isActive ? 'var(--color-secondary-01);' : 'var(--color-gray-01)'};
  }
  border: 1px solid
    ${(props) =>
      props.isActive ? 'var(--color-secondary-01);' : 'var(--color-gray-02)'};

  h4 {
    color: ${(props) =>
      props.isActive ? 'var(--text-high);' : 'var(--text-light)'};
  }
`;
