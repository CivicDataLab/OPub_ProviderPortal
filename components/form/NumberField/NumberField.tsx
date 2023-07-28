import React from 'react';
import { useNumberFieldState } from 'react-stately';
import { useLocale, useNumberField } from 'react-aria';
import Button from 'components/actions/Button';
import styled from 'styled-components';
import { ChevronSize100 as Chevron } from '@opub-icons/ui';
import { SpectrumNumberFieldProps } from '@react-types/numberfield';
import { layout } from 'styled-system';
import {
  Description,
  ErrorMessage,
  Indicator,
  Label as BaseLabel,
} from '../BaseStyles';

export interface Props extends SpectrumNumberFieldProps {
  indicator?: true | 'label' | 'icon';
  name?: string;
}

let layoutProps = {
  width: null,
  minWidth: null,
  maxWidth: null,
  height: null,
  maxHeight: null,
  minHeight: null,
};

function NumberField(props: Props) {
  let { locale } = useLocale();
  let { label, isRequired, indicator = isRequired } = props;
  let state = useNumberFieldState({ ...props, locale });
  let inputRef = React.useRef();
  let {
    labelProps,
    groupProps,
    inputProps,
    incrementButtonProps,
    decrementButtonProps,
    descriptionProps,
    errorMessageProps,
  } = useNumberField(props, state, inputRef);
  Object.keys(props).forEach(
    (key) => key in layoutProps && (layoutProps[key] = props[key])
  );

  return (
    <Wrapper {...layoutProps}>
      {label && (
        <Label {...labelProps}>
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
      )}
      <InputWrapper {...groupProps}>
        <InputContainer>
          <Input name={props.name} {...inputProps} ref={inputRef} />
        </InputContainer>
        <Button {...incrementButtonProps}>
          <Chevron style={{ transform: 'rotate(-90deg)' }} />
        </Button>
        <Button {...decrementButtonProps}>
          <Chevron style={{ transform: 'rotate(90deg)' }} />
        </Button>
      </InputWrapper>
      {props.description && (
        <Description {...descriptionProps}>{props.description}</Description>
      )}
      {props.errorMessage && (
        <ErrorMessage {...errorMessageProps}>{props.errorMessage}</ErrorMessage>
      )}
    </Wrapper>
  );
}

export { NumberField };

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  ${layout};
`;

const Label = styled(BaseLabel)`
  text-align: left;
  grid-area: label;
`;

const InputWrapper = styled.div`
  --border-color: var(--color-gray-03);
  --border-width: 1px;

  grid-area: field;
  line-height: 0;
  display: inline-grid;
  grid-template: 'field increment' 'field decrement'/1fr auto;

  &:hover {
    --border-color: var(--color-gray-04);
  }

  &:active,
  &:focus-within {
    --border-color: var(--form-active);
    --border-width: 1px;
  }

  > button {
    box-shadow: 0 0 0 var(--border-width) var(--border-color);
    transition: box-shadow 150ms ease;
    border-radius: 0;
    border-left: 0;
    background-color: var(--color-white);
    color: var(--text-high);

    display: inline-flex;
    align-items: center;
    justify-content: center;

    padding: 0;
    width: 34px;
    height: 24px;

    &.is-disabled {
      background-color: var(--form-bg-disabled);
      cursor: default;
      border-top-color: transparent;

      &:focus-visible,
      &:hover {
        background-color: var(--form-bg-disabled);
        --border-color: var(--color-gray-03);
      }
    }

    &:focus-visible,
    &:hover {
      background-color: var(--color-background-lightest);
      transform: none;
      filter: none;
    }

    svg {
      margin: 0;
      margin-right: -2px;
      pointer-events: none;
    }

    &:first-of-type {
      grid-area: increment;
      border-top-right-radius: 4px;
      border-bottom: 0;
    }

    &:last-of-type {
      grid-area: decrement;
      border-bottom-right-radius: 4px;
    }
  }
`;

const InputContainer = styled.div`
  width: unset;
  min-width: 64px;
  grid-area: field;
  display: inline-flex;
  position: relative;
  line-height: 0;
`;

const Input = styled.input`
  --bg-color: var(--form-bg);

  background-color: var(--bg-color);
  border: none;
  box-shadow: 0 0 0 var(--border-width) var(--border-color);
  transition: box-shadow 150ms ease;
  border-radius: 4px;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  padding-left: 8px;

  text-indent: 0;
  width: 100%;
  -moz-appearance: textfield;
  outline: 0;
  margin: 0;
  overflow: visible;
  line-height: 1.5;

  outline: none !important;

  &[disabled=''] {
    --bg-color: var(--form-bg-disabled);
  }
`;
