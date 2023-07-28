import Button from 'components/actions/Button';
import {
  Checkbox,
  FormikArea,
  FormikCheckbox,
  FormikCheckboxGroup,
  FormikField,
  FormikNumberField,
  FormikRadioGroup,
  FormikSelect,
  FormikUpload,
  Radio,
} from 'components/form';
import { useFormik } from 'formik';
import React from 'react';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { omit } from 'utils/helper';
import * as Yup from 'yup';

const selectOption = [
  {
    label: 'Option 1',
    value: 'option-1',
  },
  {
    label: 'Option 2',
    value: 'option-2',
  },
];

function filterUpload(fileName, urlName, obj) {
  if (obj[fileName] === null) return omit(obj, [fileName]);
  return omit(obj, [urlName]);
}

export const FormExample: React.VFC = () => {
  const [uploadVal, setUploadValue] = React.useState(null);

  const validationSchema = Yup.object().shape({
    textField: Yup.string().required('Required'),
    textArea: Yup.string().required('Required').min(10, 'Min. 10 characters'),
    numberField: Yup.number().required('Required').min(0, 'Min. value is 0'),
    singleCheckbox: Yup.boolean().oneOf(
      [true],
      'You must accept the terms and conditions'
    ),
    multiCheckbox: Yup.array()
      .min(1, 'Select atleast 1 option')
      .of(Yup.string().required('Required'))
      .required('Required'),
    formikRadio: Yup.string().required('Required'),
    formikSelect: Yup.string().required('Required').nullable(),
    selectMulti: Yup.array()
      .min(1, 'Select atleast 1 option')
      .of(Yup.string().required('Required'))
      .required('Required'),

    remote_url: Yup.string().test(
      'file or remote_url',
      'URL is required',
      () => !!uploadVal
    ),
    file: Yup.mixed().test(
      'file or remote_url',
      'File is required',
      () => !!uploadVal
    ),
  });
  const formik: any = useFormik({
    initialValues: {
      textField: '',
      textArea: '',
      singleCheckbox: false,
      multiCheckbox: [],
      formikRadio: '',
      formikSelect: null,
      selectMulti: [],
      numberField: 0,
      file: null,
      remote_url: '',
    },
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      const submitValues = filterUpload('file', 'remote_url', values);

      toast.success('Submitted Successfully');
      resetForm();
      setUploadValue(null);
    },
  });

  return (
    <FormWrapper onSubmit={formik.handleSubmit}>
      <Fields>
        <FormikField
          label="TextField"
          name="textField"
          formik={formik}
          isRequired
        />

        <FormikArea
          label="TextArea"
          name="textArea"
          formik={formik}
          isRequired
        />

        <FormikNumberField
          label="NumberField"
          name="numberField"
          // minValue={0}
          formik={formik}
          isRequired
        />

        <FormikCheckbox name="singleCheckbox" formik={formik}>
          Single Checkbox
        </FormikCheckbox>

        <FormikCheckboxGroup
          name="multiCheckbox"
          formik={formik}
          label="Multi Checkbox"
          isRequired
        >
          <Checkbox value="1">Option 1</Checkbox>
          <Checkbox value="2">Option 2</Checkbox>
        </FormikCheckboxGroup>

        <FormikRadioGroup
          formik={formik}
          name="formikRadio"
          label="Radio"
          isRequired
        >
          <Radio value="1">Option 1</Radio>
          <Radio value="2">Option 2</Radio>
        </FormikRadioGroup>

        <FormikSelect
          name="formikSelect"
          options={selectOption}
          label="Select Dropdown"
          formik={formik}
          inputId="select-1"
          isRequired
        />

        <FormikSelect
          name="selectMulti"
          options={selectOption}
          label="Select Multi"
          formik={formik}
          inputId="select-2"
          isRequired
          isMulti
        />

        <FormikUpload
          formik={formik}
          uploadValArr={[uploadVal, setUploadValue]}
          label="File Upload/Link"
          id="remote_url"
          urlName="remote_url"
          fileName="file"
          linkDescription="Enter the URL for the licence document"
        />
      </Fields>
      <Button onPress={() => formik.handleSubmit()} size="sm">
        Submit
      </Button>
    </FormWrapper>
  );
};

const FormWrapper = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;

  max-width: 480px;
`;

const Fields = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;
