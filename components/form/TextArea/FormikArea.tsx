import { TextArea, TextAreaProps } from './TextArea';

interface FromikTextAreaProps extends TextAreaProps {
  formik: any;
  name: string;
  onFieldChange?: any;
}

export const FormikArea = ({
  formik,
  name,
  label,
  ...props
}: FromikTextAreaProps) => {
  function handleChange(e) {
    formik.setFieldValue(name, e);
    props.onFieldChange && props.onFieldChange(e);
  }

  return (
    <TextArea
      label={label}
      name={name}
      value={formik.values[name]}
      errorMessage={formik.touched[name] && formik.errors[name]}
      onBlur={formik.handleBlur}
      onChange={(e) => handleChange(e)}
      {...props}
    />
  );
};
