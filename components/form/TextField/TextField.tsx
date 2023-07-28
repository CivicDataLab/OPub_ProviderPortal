import React from 'react';
import { useTextField } from 'react-aria';

import { SpectrumTextFieldProps } from '@react-types/textfield';
import {
  BaseInput,
  Description,
  ErrorMessage,
  Indicator,
  InputWrapper,
  Label,
  Wrapper,
} from '../BaseStyles';
import { Flex } from 'components/layouts/FlexWrapper';
import { LinkOutLight } from '@opub-icons/workflow';
import { Link } from 'components/layouts/Link';

export interface TextFieldProps extends SpectrumTextFieldProps {
  indicator?: true | false | 'label' | 'icon';
  iconStart?: React.ReactNode;
  iconEnd?: React.ReactNode;
  maxLength?: number;
  minLength?: number;
  showLimit?: boolean;
  externalHelpLink?: string;
  max?: string;
}

function TextField(props: TextFieldProps) {
  let {
    label,
    isRequired,
    indicator = isRequired,
    showLimit = true,
    max,
  } = props;
  let ref = React.useRef();
  let { labelProps, inputProps, descriptionProps, errorMessageProps } =
    useTextField(props, ref);

  let inputValue: any = inputProps.value;
  // TODO change default required failure response for all fields
  return (
    <Wrapper className="opub-textField">
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
          {...inputProps}
          max={max}
          ref={ref}
          required={props.isRequired || false}
          maxLength={props.maxLength || 200}
          min={props.type === 'number' ? 0 : 'false'}
        />
        {props.iconEnd && props.iconEnd}
      </InputWrapper>

      {props.externalHelpLink ||
        (props.maxLength && showLimit && (
          <Flex gap="5px" alignItems={'center'}>
            {props.externalHelpLink && (
              <>
                <Link target="_blank" href={props.externalHelpLink} external>
                  <Description title={`Go to ${props.externalHelpLink}`}>
                    <Flex gap="1px">
                      Help <LinkOutLight color="var(--color-link)" size={15} />
                    </Flex>
                  </Description>
                </Link>
              </>
            )}
            {props.maxLength && showLimit && (
              <Flex
                alignItems="center"
                justifyContent="space-between"
                gap="8px"
                flexGrow={'1'}
              >
                {props.minLength ? (
                  <Description>
                    Character Limit: {props.minLength} to {props.maxLength}{' '}
                    Characters
                  </Description>
                ) : (
                  <Description>
                    Character Limit: {props.maxLength} Characters
                  </Description>
                )}
                {inputValue?.length ? (
                  <Description>
                    {inputValue?.length}/{props.maxLength}
                  </Description>
                ) : null}
              </Flex>
            )}
          </Flex>
        ))}

      {props.description && (
        <Description {...descriptionProps}>{props.description}</Description>
      )}
      {props.errorMessage && (
        <ErrorMessage {...errorMessageProps}>{props.errorMessage}</ErrorMessage>
      )}
    </Wrapper>
  );
}

export { TextField };
