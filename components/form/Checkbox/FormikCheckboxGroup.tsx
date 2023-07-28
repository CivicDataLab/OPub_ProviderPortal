import { CheckboxGroup, CheckboxGroupProps } from './CheckboxGroup';

interface FromikCheckboxGroupProps extends CheckboxGroupProps {
  formik: any;
  name: string;
  onFieldChange?: any;
}

export const FormikCheckboxGroup = ({
  formik,
  name,
  children,
  ...props
}: FromikCheckboxGroupProps) => {
  function handleChange(e) {
    formik.setFieldValue(name, e);
    props.onFieldChange && props.onFieldChange(e);
  }

  return (
    <CheckboxGroup
      name={name}
      value={formik.values[name]}
      validationState={
        formik.touched[name] && formik.errors[name] ? 'invalid' : null
      }
      errorMessage={formik.touched[name] && formik.errors[name]}
      onChange={(e) => handleChange(e)}
      {...props}
    >
      {children}
    </CheckboxGroup>
  );
};
