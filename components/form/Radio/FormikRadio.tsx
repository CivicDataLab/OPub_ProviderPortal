import { RadioGroup, Props } from './Radio';

interface FromikRadioProps extends Props {
  formik: any;
  name: string;
  onFieldChange?: any;
}

export const FormikRadioGroup = ({
  formik,
  name,
  children,
  ...props
}: FromikRadioProps) => {
  function handleChange(e) {
    formik.setFieldValue(name, e);
    props.onFieldChange && props.onFieldChange(e);
  }

  return (
    <RadioGroup
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
    </RadioGroup>
  );
};
