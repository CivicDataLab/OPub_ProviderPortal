import React from 'react';
import { chain, mergeProps, useHover, useTextField } from 'react-aria';
import { SpectrumTextFieldProps } from '@react-types/textfield';
import {
  BaseInput,
  Description,
  ErrorMessage,
  Indicator,
  InputWrapper,
  Label,
  TextAreaDescription,
  Wrapper,
} from '../BaseStyles';
import { useStyleProps } from '@react-spectrum/utils';
import classNames from 'clsx';
import { useControlledState } from '@react-stately/utils';
import { Flex } from 'components/layouts/FlexWrapper';
export interface TextAreaProps extends SpectrumTextFieldProps {
  rows?: string | number;
  columns?: string | number;
  indicator?: true | false | 'label' | 'icon';
  iconStart?: React.ReactNode;
  iconEnd?: React.ReactNode;
  maxLength?: number;
  minLength?: number;
  showLimit?: boolean;
}

function TextArea(props: TextAreaProps) {
  let {
    label,
    rows,
    columns,
    isRequired,
    maxLength = 500,
    minLength,
    indicator = isRequired,
    isDisabled = false,
    onChange,
    ...otherProps
  } = props;

  let { hoverProps, isHovered } = useHover({ isDisabled });
  let { styleProps } = useStyleProps(otherProps);

  let [inputValue, setInputValue] = useControlledState(
    props.value,
    props.defaultValue,
    () => {}
  );
  let ref = React.useRef<HTMLTextAreaElement>();
  let {
    labelProps,
    inputProps,
    descriptionProps,
    errorMessageProps,
    showLimit = true,
  }: any = useTextField(
    {
      ...props,
      onChange: chain(onChange, setInputValue),
      inputElementType: 'textarea',
    },
    ref
  );

  let onHeightChange = React.useCallback(() => {
    // Quiet textareas always grow based on their text content.
    // Standard textareas also grow by default, unless an explicit height is set.
    if (!props.height && ref.current) {
      let input = ref.current;

      let prevAlignment = input.style.alignSelf;
      let prevOverflow = input.style.overflow;
      // Firefox scroll position is lost when overflow: 'hidden' is applied so we skip applying it.
      // The measure/applied height is also incorrect/reset if we turn on and off
      // overflow: hidden in Firefox https://bugzilla.mozilla.org/show_bug.cgi?id=1787062
      let isFirefox = 'MozAppearance' in input.style;
      if (!isFirefox) {
        input.style.overflow = 'hidden';
      }
      input.style.alignSelf = 'start';
      input.style.height = 'auto';
      // offsetHeight - clientHeight accounts for the border/padding.
      input.style.height = `${
        input.scrollHeight + (input.offsetHeight - input.clientHeight)
      }px`;
      input.style.overflow = prevOverflow;
      input.style.alignSelf = prevAlignment;
    }
  }, [ref, props.height]);

  React.useLayoutEffect(() => {
    if (ref.current) {
      onHeightChange();
    }
  }, [onHeightChange, inputValue, ref]);

  return (
    <Wrapper
      className={classNames(
        isDisabled ? 'is-disabled' : '',
        isHovered ? 'is-hovered' : ''
      )}
      {...mergeProps(styleProps, hoverProps)}
    >
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

      <InputWrapper>
        {props.iconStart && props.iconStart}
        <BaseInput
          as="textarea"
          {...inputProps}
          rows={rows || 2}
          ref={ref}
          required={props.isRequired || false}
          maxlength={maxLength || 500}
        />
        {props.iconEnd && props.iconEnd}
      </InputWrapper>
      {props.maxLength && showLimit && (
        <Flex alignItems="center" justifyContent="space-between" gap="8px">
          {props.minLength ? (
            <TextAreaDescription>
              Character Limit: {props.minLength} to {props.maxLength} Characters
            </TextAreaDescription>
          ) : (
            <TextAreaDescription>
              Character Limit: {props.maxLength} Characters
            </TextAreaDescription>
          )}
          {inputValue?.length ? (
            <TextAreaDescription>
              {inputValue?.length}/{props.maxLength}
            </TextAreaDescription>
          ) : null}
        </Flex>
      )}

      {props.description && (
        <Description {...descriptionProps}>{props.description}</Description>
      )}
      {props.errorMessage && (
        <ErrorMessage {...errorMessageProps}>{props.errorMessage}</ErrorMessage>
      )}
    </Wrapper>
  );
}

export { TextArea };
