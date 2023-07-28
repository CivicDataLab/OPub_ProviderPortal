import React from 'react';
import { useCheckboxGroupState } from 'react-stately';
import { useCheckboxGroup } from 'react-aria';
import { CheckboxGroupContext } from './context';
import { Description, ErrorMessage, Indicator, Label } from '../BaseStyles';
import { DOMRef } from '@react-types/shared';
import { SpectrumCheckboxGroupProps } from '@react-types/checkbox';
import { useDOMRef } from '@react-spectrum/utils';
import classNames from 'clsx';
import styled from 'styled-components';

export interface CheckboxGroupProps extends SpectrumCheckboxGroupProps {
  indicator?: true | false | 'label' | 'icon';
}

function CheckboxGroup(props: CheckboxGroupProps, ref: DOMRef<HTMLDivElement>) {
  let {
    children,
    label,
    orientation = 'vertical',
    description,
    errorMessage,
    validationState,
    isRequired,
    indicator = isRequired,
  } = props;
  let state = useCheckboxGroupState(props);
  let { groupProps, labelProps, descriptionProps, errorMessageProps } =
    useCheckboxGroup(props, state);

  let domRef = useDOMRef(ref);

  return (
    <Wrapper
      className={classNames(
        orientation === 'horizontal' ? 'is-horizontal' : ''
      )}
      {...groupProps}
      ref={domRef}
    >
      {label && (
        <Label as="span" {...labelProps}>
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
      <CheckboxGroupContext.Provider value={state}>
        <div className="checbox-items">{children}</div>
      </CheckboxGroupContext.Provider>
      {description && (
        <Description {...descriptionProps}>{description}</Description>
      )}
      {errorMessage && validationState === 'invalid' && (
        <ErrorMessage {...errorMessageProps}>{errorMessage}</ErrorMessage>
      )}
    </Wrapper>
  );
}

const _CheckboxGroup = React.forwardRef(CheckboxGroup);
export { _CheckboxGroup as CheckboxGroup };

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;

  .checbox-items {
    display: flex;
    flex-direction: column;
  }

  &.is-horizontal {
    > .checbox-items {
      flex-direction: row;
      display: flex;
      gap: 12px;

      > label {
        gap: 4px;
      }
    }
  }
`;
