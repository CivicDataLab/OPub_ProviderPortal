import React from 'react';
import {
  AriaRadioGroupProps,
  AriaRadioProps,
  useFocusRing,
  useRadio,
  useRadioGroup,
  VisuallyHidden,
} from 'react-aria';
import { useRadioGroupState } from 'react-stately';
import styled from 'styled-components';
import { Description, ErrorMessage, Label, Indicator } from '../BaseStyles';
import className from 'clsx';

export interface Props extends AriaRadioGroupProps {
  children: React.ReactNode;
  orientation?: 'vertical' | 'horizontal';
  indicator?: true | false | 'label' | 'icon';
}

// RadioGroup is the same as in the previous example
let RadioContext = React.createContext(null);

export function RadioGroup(props: Props) {
  let {
    children,
    orientation = 'vertical',
    label,
    description,
    errorMessage,
    validationState,
    isRequired,
    indicator = isRequired,
  } = props;
  let state = useRadioGroupState(props);
  let { radioGroupProps, labelProps, descriptionProps, errorMessageProps } =
    useRadioGroup(props, state);

  return (
    <Wrapper {...radioGroupProps}>
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
      <GroupWrapper className={className(`is-${orientation}`)}>
        <RadioContext.Provider value={state}>{children}</RadioContext.Provider>
      </GroupWrapper>
      {description && (
        <Description {...descriptionProps}>{description}</Description>
      )}
      {errorMessage && validationState === 'invalid' && (
        <ErrorMessage {...errorMessageProps}>{errorMessage}</ErrorMessage>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;

  > span {
    text-align: start;
  }
`;

const GroupWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;

  &.is-horizontal {
    flex-direction: row;
    gap: 8px;
  }
`;

interface RadioProps extends AriaRadioProps {
  children: React.ReactNode;
}

export function Radio(props: RadioProps) {
  let { children } = props;
  let state = React.useContext(RadioContext);
  let ref = React.useRef(null);
  let { inputProps, isSelected, isDisabled } = useRadio(props, state, ref);
  let { isFocusVisible, focusProps } = useFocusRing();
  let strokeWidth = isSelected ? 5 : 2;

  return (
    <label
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        opacity: isDisabled ? 0.4 : 1,
      }}
    >
      <VisuallyHidden>
        <input {...inputProps} {...focusProps} ref={ref} />
      </VisuallyHidden>
      <svg
        width={16}
        height={16}
        aria-hidden="true"
        style={{ marginRight: 4, minWidth: 16, marginTop: '2px' }}
      >
        <circle
          cx={8}
          cy={8}
          r={8 - strokeWidth / 2}
          fill="none"
          stroke={isSelected ? 'var(--input-checked)' : 'var(--color-gray-04)'}
          strokeWidth={strokeWidth}
        />
        {isFocusVisible && (
          <circle
            cx={8}
            cy={8}
            r={10}
            fill="none"
            stroke="var(--input-checked)"
            strokeWidth={2}
          />
        )}
      </svg>
      <span style={{ marginTop: '-1px' }}>{children}</span>
    </label>
  );
}
