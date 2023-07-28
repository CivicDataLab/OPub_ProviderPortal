import { TextField, TextFieldProps } from './TextField';

interface FromikTextFieldProps extends TextFieldProps {
  formik: any;
  name: string;
  onFieldChange?: any;
}

export const FormikField = ({
  formik,
  name,
  label,
  ...props
}: FromikTextFieldProps) => {
  function handleChange(e) {
    formik.setFieldValue(name, e);
    props.onFieldChange && props.onFieldChange(e);
  }

  return (
    <TextField
      label={label}
      name={name}
      value={formik.values[name]}
      errorMessage={formik.touched[name] && formik.errors[name]}
      onChange={(e) => handleChange(e)}
      onBlur={formik.handleBlur}
      {...props}
    />
  );
};
