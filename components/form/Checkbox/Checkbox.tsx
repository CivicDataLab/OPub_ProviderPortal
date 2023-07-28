import React from 'react';
import styled from 'styled-components';
import { useToggleState } from 'react-stately';
import { useCheckbox, useCheckboxGroupItem } from '@react-aria/checkbox';
import { SpectrumCheckboxProps } from '@react-types/checkbox';
import { FocusableRef } from '@react-types/shared';
import { useFocusableRef, useStyleProps } from '@react-spectrum/utils';
import { FocusRing } from '@react-aria/focus';
import { useHover } from '@react-aria/interactions';
import { CheckboxGroupContext } from './context';
import { Label as BaseLabel } from '../BaseStyles';
import { CheckmarkSize75 as Checkmark } from '@opub-icons/ui';
import { mergeProps } from 'react-aria';
import classNames from 'clsx';
import { ErrorMessage } from '../BaseStyles';

interface CheckboxProps extends SpectrumCheckboxProps {
  errorMessage?: string;
}

function Checkbox(props: CheckboxProps, ref: FocusableRef<HTMLLabelElement>) {
  let originalProps = props;
  let {
    isIndeterminate = false,
    isEmphasized = false,
    isDisabled = false,
    autoFocus,
    children,
    validationState,
    ...otherProps
  } = props;
  let { hoverProps, isHovered } = useHover({ isDisabled });
  let { styleProps } = useStyleProps(otherProps);

  let inputRef = React.useRef<HTMLInputElement>(null);
  let domRef = useFocusableRef(ref, inputRef);

  // Swap hooks depending on whether this checkbox is inside a CheckboxGroup.
  // This is a bit unorthodox. Typically, hooks cannot be called in a conditional,
  // but since the checkbox won't move in and out of a group, it should be safe.
  let groupState = React.useContext(CheckboxGroupContext);
  let { inputProps } = groupState
    ? // eslint-disable-next-line react-hooks/rules-of-hooks
      useCheckboxGroupItem(
        {
          ...props,
          // Value is optional for standalone checkboxes, but required for CheckboxGroup items;
          // it's passed explicitly here to avoid typescript error (requires ignore).
          // @ts-ignore
          value: props.value,
          // Only pass isRequired and validationState to react-aria if they came from
          // the props for this individual checkbox, and not from the group via context.
          isRequired: originalProps.isRequired,
          validationState: originalProps.validationState,
        },
        groupState,
        inputRef
      )
    : // eslint-disable-next-line react-hooks/rules-of-hooks
      useCheckbox(props, useToggleState(props), inputRef);

  if (groupState) {
    for (let key of ['isSelected', 'defaultSelected', 'isEmphasized']) {
      if (originalProps[key] != null) {
        console.warn(
          `${key} is unsupported on individual <Checkbox> elements within a <CheckboxGroup>. Please apply these props to the group instead.`
        );
      }
    }
    if (props.value == null) {
      console.warn(
        'A <Checkbox> element within a <CheckboxGroup> requires a `value` property.'
      );
    }
  }

  return (
    <>
      <Label
        {...mergeProps(styleProps, hoverProps)}
        ref={domRef}
        className={classNames(
          inputProps.checked ? 'is-checked' : '',
          isIndeterminate ? 'is-indeterminate' : '',
          validationState === 'invalid' ? 'is-invalid' : '',
          isDisabled ? 'is-disabled' : '',
          isHovered ? 'is-hovered' : ''
        )}
      >
        <FocusRing focusRingClass="focus-ring" autoFocus={autoFocus}>
          <Input {...inputProps} ref={inputRef} />
        </FocusRing>
        <CheckboxWrapper>
          <CheckmarkSVG focusable="false" aria-hidden="true" role="img" />
        </CheckboxWrapper>
        {children && <Text>{children}</Text>}
      </Label>
      {props.errorMessage && <ErrorMessage>{props.errorMessage}</ErrorMessage>}
    </>
  );
}

let _Checkbox = React.forwardRef(Checkbox);
export { _Checkbox as Checkbox };

const Label = styled.label`
  ${BaseLabel};
  padding-inline-end: 8px;
  min-height: 24px;
  width: fit-content;
  max-width: 100%;
  vertical-align: top;
  isolation: isolate;
  align-items: flex-start;
  display: inline-flex;
  position: relative;
  gap: 8px;

  &.is-invalid {
    span {
      color: var(--color-error);
    }

    &.is-hovered {
      > span:first-of-type {
        &::before {
          border-color: var(--color-error);
        }
      }
    }

    > span:first-of-type {
      &::before {
        border-color: var(--color-error);
      }
    }
  }

  &.is-hovered {
    > span:first-of-type {
      &::before {
        border-color: var(--input-checked);
      }
    }
  }

  &.is-checked {
    svg {
      opacity: 1;
    }

    > span:first-of-type {
      &::before {
        border-width: 7px;
        background-color: var(--input-checked);
        border-color: var(--input-checked);
      }
    }
  }
`;

const Input = styled.input`
  width: 100%;
  height: 100%;
  opacity: 0.0001;
  z-index: 1;
  cursor: default;
  margin: 0;
  padding: 0;
  font-family: inherit;
  font-size: 100%;
  line-height: 1.15;
  position: absolute;
  top: 0;
  overflow: visible;

  &.focus-ring + span {
    &::after {
      opacity: 1;
      margin: -2px;
    }
  }
`;

const CheckboxWrapper = styled.span`
  width: 14px;
  height: 14px;
  margin-top: 4px;
  flex-grow: 0;
  flex-shrink: 0;
  position: relative;
  border-radius: 2px;

  &::before {
    z-index: 0;
    content: '';
    width: 14px;
    height: 14px;
    border-radius: 2px;
    border-width: 2px;
    transition: border 130ms ease-in-out, box-shadow 130ms ease-in-out;
    border-style: solid;
    display: block;
    position: absolute;
    border-color: var(--color-gray-04);
  }

  &::after {
    border-radius: 2px;
    content: '';
    border-radius: 4px;
    transition: opacity 130ms ease-out, margin 130ms ease-out;
    display: block;
    position: absolute;
    inset: 0;
    transform: translate(0);
    box-shadow: 0 0 0 2px var(--form-active);
    opacity: 0;
    margin: 0px;
    color: var(--text-high);
  }
`;

const CheckmarkSVG = styled(Checkmark)`
  opacity: 0;
  transform: translate(-50%, -50%);
  transition: opacity 130ms ease-in-out;
  position: absolute;
  top: 50%;
  left: 50%;

  fill: var(--text-high-on-dark);
  pointer-events: none;
  display: inline-block;
`;

const Text = styled.span`
  text-align: start;
  color: var(--text-high);
  line-height: 1.4;
`;
