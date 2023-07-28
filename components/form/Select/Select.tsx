import React from 'react';
import ReactSelect, { GroupBase, Props } from 'react-select';
import Creatable from 'react-select/creatable';
import styled from 'styled-components';
import { omit } from 'utils/helper';
import { Description, ErrorMessage, Indicator, Label } from '../BaseStyles';
import classNames from 'clsx';
import Button from 'components/actions/Button';

export type SelectProps<
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>
> = Props<Option, IsMulti, Group> & {
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

  /**
   * return prop
   */
  onChange: any;

  errorMessage?: string;
};

const Select = <
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>
>(
  props: SelectProps<Option, IsMulti, Group>
) => {
  const [selected, setSelected] = React.useState<any>(props.defaultValue || []);
  const id = props.inputId || Math.random().toString();
  let {
    isRequired,
    label,
    indicator = isRequired,
    labelSide = 'top',
    allowSelectAll = false,
  } = props;
  const reactSelectProps = omit(props, ['label', 'className']);

  const Component = props.creatable ? Creatable : ReactSelect;
  return (
    <SelectWrapper
      className={classNames(
        props.isDisabled ? 'is-disabled' : '',
        `label-${labelSide}`,
        'opub-select'
      )}
    >
      {label ? (
        <Label htmlFor={id}>
          {label}
          {indicator && (
            <Indicator>
              {!isRequired ? (
                <>&nbsp;(Optional)</>
              ) : indicator == 'label' ? (
                '*'
              ) : (
                <>&nbsp;(Required)</>
              )}
            </Indicator>
          )}
        </Label>
      ) : null}

      <Component
        inputId={id}
        options={props.options}
        classNamePrefix="opub-select"
        value={selected}
        {...reactSelectProps}
        onChange={(e: any) => {
          setSelected(e);
          props.onChange(e);
        }}
      />

      {allowSelectAll && !props.isDisabled ? (
        <Button
          onPress={() => {
            setSelected(props.options);
            props.onChange(props.options);
          }}
          className="select-all"
          kind="custom"
        >
          select all
        </Button>
      ) : null}

      {props.description && <Description>{props.description}</Description>}
      {props.errorMessage && <ErrorMessage>{props.errorMessage}</ErrorMessage>}
    </SelectWrapper>
  );
};

export default Select;

export const SelectWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  --bg-color: var(--form-bg);
  --border-color: var(--color-gray-02);
  padding-inline: 1px;

  .select-all {
    margin-top: 4px;
    font-size: 0.875rem;
    color: var(--color-primary-01);
    padding-inline: 4px;
    background-color: var(--color-primary-06);
    border: 1px solid var(--color-primary-02);
    border-radius: 4px;
  }

  .opub-select {
    &__menu-list {
      max-height: 130px;
    }
    &__control {
      min-height: 48px;

      background-color: var(--bg-color);
      border-color: var(--border-color);
      border-width: 1px;
      border-radius: 2px;

      &--is-focused {
        border-color: var(--form-active);
        border-width: 1px;
        box-shadow: none;

        &:hover {
          border-color: var(--form-active);
        }
      }
    }

    &__indicator-separator {
      display: none;
    }
  }

  &.label-left {
    flex-direction: row;
    align-items: center;
    gap: 8px;

    label {
      width: auto;
    }
  }

  input {
    outline: none !important;
  }

  &:hover {
    --border-color: var(--color-gray-03);
  }

  &.is-disabled {
    --bg-color: var(--form-bg-disabled);
    color: var(--text-light);

    &:hover {
      --border-color: var(--color-gray-02);
    }
  }
`;
