import { Checkbox } from './Checkbox';
import { SpectrumCheckboxProps } from '@react-types/checkbox';

interface FromikCheckboxProps extends SpectrumCheckboxProps {
  formik: any;
  children: React.ReactNode;
  name: string;
  onFieldChange?: any;
}

export const FormikCheckbox = ({
  formik,
  name,
  children,
  ...props
}: FromikCheckboxProps) => {
  function handleChange(e) {
    formik.setFieldValue(name, e);
    props.onFieldChange && props.onFieldChange(e);
  }

  return (
    <Checkbox
      name={name}
      isSelected={formik.values[name]}
      validationState={
        formik.touched[name] && formik.errors[name] ? 'invalid' : null
      }
      errorMessage={formik.touched[name] && formik.errors[name]}
      onChange={(e) => handleChange(e)}
      onBlur={formik.handleBlur}
      {...props}
    >
      {children}
    </Checkbox>
  );
};
