import { CrossSize600 } from '@opub-icons/ui';
import { Data, Edit, Link, LinkNav } from '@opub-icons/workflow';
import { Button } from 'components/actions';
import { Flex } from 'components/layouts/FlexWrapper';
import React, { useState } from 'react';
import styled from 'styled-components';
import { Heading } from 'components/layouts';
import { useFormik } from 'formik';
import { TextArea, TextField } from 'components/form';
import { useMutation } from '@apollo/client';
import { mutation, UPDATE_PATCH_OF_DATASET } from 'services';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { updateDatasetElements } from 'slices/addDatasetSlice';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  title: Yup.string().required('Required'),

  description: Yup.string()
    .required('Required')
    .max(1500, 'Length should not be more than 1500 characters'),
});

const DatasetHeader = ({ datasetStore }) => {
  const [editMode, setEditMode] = useState(false);
  const dispatch = useDispatch();

  const [editTitleDescPatchReq, editTitkeDescPatchRes] = useMutation(
    UPDATE_PATCH_OF_DATASET
  );

  const formik: any = useFormik({
    initialValues: {
      title: datasetStore.title,
      description: datasetStore.description,
    },
    // validate,
    validationSchema,
    validateOnChange: false,
    onSubmit: (values) => {
      editTitleDesc(values);
      setEditMode(!editMode);
    },
  });
  const { values, errors } = formik;

  const editTitleDesc = (values) => {
    mutation(editTitleDescPatchReq, editTitkeDescPatchRes, {
      dataset_data: {
        ...values,
        id: datasetStore.id,
      },
    })
      .then((res) => {
        if (res.patch_dataset?.success === true) {
          toast.success('Saved Title and Description successfully!');
          formik.resetForm();

          dispatch(
            updateDatasetElements({
              type: 'updateTitle',
              value: values.title,
            })
          );
          dispatch(
            updateDatasetElements({
              type: 'updateDescription',
              value: values.description,
            })
          );
        }
      })
      .catch(() => {
        toast.error('Error in editing Title and Description');
      });
  };

  return (
    <Wrapper>
      <Flex justifyContent="space-between" gap="10px">
        <HeaderContent>
          {editMode ? (
            <>
              <Rectangle>
                <div>
                  {datasetStore.dataset_type == 'FILE' ? (
                    <Data width={24} fill="var(--color-secondary-01)" />
                  ) : datasetStore.dataset_type == 'API' ? (
                    <Link width={24} fill="var(--color-secondary-01)" />
                  ) : (
                    <LinkNav width={24} fill="var(--color-secondary-01)" />
                  )}
                </div>
              </Rectangle>
              <EditTitleDesc
                onSubmit={() => {
                  formik.handleSubmit();
                }}
              >
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
                  defaultValue={datasetStore.title}
                  indicator="icon"
                />
                <TextArea
                  label="Description"
                  name="description"
                  isRequired
                  maxLength={1500}
                  errorMessage={errors.description}
                  onChange={(e) => {
                    formik.setFieldValue('description', e);
                    if (errors.description) errors.description = false;
                  }}
                  defaultValue={datasetStore.description}
                  indicator="icon"
                />
                <Button
                  kind="primary-outline"
                  size="sm"
                  onPress={() => formik.handleSubmit()}
                >
                  Save
                </Button>
              </EditTitleDesc>
            </>
          ) : (
            <>
              <Header>
                <Flex gap="16px">
                  <Rectangle>
                    <div>
                      {datasetStore.dataset_type == 'FILE' ? (
                        <Data width={24} fill="var(--color-secondary-01)" />
                      ) : datasetStore.dataset_type == 'API' ? (
                        <Link width={24} fill="var(--color-secondary-01)" />
                      ) : (
                        <LinkNav width={24} fill="var(--color-secondary-01)" />
                      )}
                    </div>
                  </Rectangle>
                  <Title>
                    <Heading variant="h4" as={'h1'}>
                      {' '}
                      {datasetStore.title}
                    </Heading>
                  </Title>
                </Flex>
              </Header>
            </>
          )}
        </HeaderContent>
        <>
          {' '}
          <Button
            kind="custom"
            onPress={() => {
              setEditMode(!editMode);
              formik.resetForm();
            }}
          >
            {!editMode ? <Edit width={16} /> : <CrossSize600 width={16} />}
          </Button>
        </>
      </Flex>
    </Wrapper>
  );
};

export default DatasetHeader;

const Wrapper = styled.section`
  display: block;
  background-color: var(--color-white);
  padding: 20px 20px 17px 20px;
`;

const HeaderContent = styled.div`
  width: 100%;
  gap: 10px;
  display: flex;
`;
const EditTitleDesc = styled.form`
  padding-left: 10px;
  flex-wrap: wrap;
  align-items: center;
  width: 100%;
  gap: 20px;
  Button {
    margin-left: auto;
    margin-top: 10px;
  }
  > div {
    margin-bottom: 10px;
  }
`;

const Rectangle = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 1px;
  background-color: var(--color-secondary-05);
  > div {
    padding: 4px;
  }
`;
const Header = styled.div`
  width: 100%;
  /* border-bottom: 2px solid var(--color-gray-02); */
`;
const Title = styled.div`
  /* border-bottom: 2px solid var(--color-gray-02); */
  width: 100%;
`;

const EditButton = styled.div`
  margin: auto;
`;
