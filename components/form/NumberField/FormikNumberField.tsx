import { NumberField, Props } from './NumberField';

interface FromikNumberTextFieldProps extends Props {
  formik: any;
  name: string;
  onFieldChange?: any;
}

export const FormikNumberField = ({
  formik,
  name,
  label,
  ...props
}: FromikNumberTextFieldProps) => {
  function handleChange(e) {
    formik.setFieldValue(name, e);
    props.onFieldChange && props.onFieldChange(e);
  }

  return (
    <NumberField
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
