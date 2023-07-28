import Select from './Select';
import { GroupBase, Props } from 'react-select';

type SelectProps<
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>
> = Props<Option, IsMulti, Group> & {
  formik: any;
  name: string;
  onFieldChange?: any;

  /**
   * label for the select
   */
  label?: string;

  /**
   * id for the select component
   */
  inputId: string;

  indicator?: true | 'label' | 'icon';

  isRequired?: boolean;

  labelSide?: 'top' | 'left';

  creatable?: boolean;

  allowSelectAll?: boolean;

  description?: string | React.ReactNode;
};

export const FormikSelect = <
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>
>(
  props: SelectProps<Option, IsMulti, Group>
) => {
  const { name, formik, ...otherProps } = props;

  const selectedVal = !props.isMulti
    ? props.options
      ? props.options.find(
          (option: any) => option.value === formik.values[name]
        ) || null
      : ''
    : // for multi
      props.options.filter((option: any) =>
        formik.values[name].includes(option.value)
      );

  function handleChange(e) {
    props.isMulti
      ? formik.setFieldValue(
          name,
          e.map((val) => val.value)
        )
      : formik.setFieldValue(name, e.value);
    props.onFieldChange && props.onFieldChange(e);
  }

  return (
    <Select
      name={props.name}
      errorMessage={formik.touched[name] && formik.errors[name]}
      onChange={(e) => handleChange(e)}
      onBlur={formik.handleBlur}
      {...otherProps}
      value={selectedVal}
    />
  );
};
