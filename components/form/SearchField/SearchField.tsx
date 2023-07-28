import { ArrowSize300, CrossSize300 } from '@opub-icons/ui';
import { Search } from '@opub-icons/workflow';
import classname from 'clsx';
import Button from 'components/actions/Button';
import React from 'react';
import { AriaSearchFieldProps, useSearchField } from 'react-aria';
import { useSearchFieldState } from 'react-stately';
import styled from 'styled-components';
import {
  InputWrapper as BaseInput,
  Description,
  ErrorMessage,
  Label,
} from '../BaseStyles';

interface Props extends AriaSearchFieldProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubmit?: boolean;
  showSubmitButton?: boolean;
  showBtnLabel?: boolean;
  submitVisible?: boolean;
  btnLabel?: string;
}

export function SearchField(props: Props) {
  let { label } = props;
  let state = useSearchFieldState(props);
  let ref: any = React.useRef();
  let {
    labelProps,
    inputProps,
    descriptionProps,
    errorMessageProps,
    clearButtonProps,
  } = useSearchField(props, state, ref);

  return (
    <Wrapper className={classname('opub-search', `size-${props.size || 'lg'}`)}>
      {label && <Label {...labelProps}>{label}</Label>}
      <InputWrapper>
        <Input as="input" {...inputProps} ref={ref} />
        <Search fill="var(--color-gray-04)" />
        {(state.value !== '' || props.submitVisible) && (
          <SearchButtons
            style={{
              right: props.showSubmit ? '24px' : '0',
            }}
          >
            {!props.submitVisible && (
              <Button
                kind="custom"
                className="search-clear"
                iconOnly
                icon={<CrossSize300 />}
                {...clearButtonProps}
              >
                clear search
              </Button>
            )}
            {props.showSubmit ? (
              <Button
                kind="primary"
                className="search-submit"
                iconOnly={props.showBtnLabel ? false : true}
                type="submit"
                onPress={() => props.onSubmit(ref.current.value)}
                icon={!props.showBtnLabel ? <ArrowSize300 /> : null}
              >
                {props.btnLabel || 'Submit'}
              </Button>
            ) : null}
          </SearchButtons>
        )}
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

const SearchButtons = styled.div`
  position: absolute;
  right: 0;
  top: 0;

  width: 48px;
  height: 48px;

  display: flex;
  align-items: center;
  gap: 4px;
`;

const Wrapper = styled.div<Props>`
  display: flex;
  flex-direction: column;

  input {
    background-color: var(--color-white);
  }

  &.size-lg {
    input {
      padding-left: 42px;
      height: 48px;
    }
  }

  &.size-xl {
    input {
      padding: 16px 42px;
      padding-left: 56px;
      height: 72px;
      font-size: 1.25rem;
    }
    > div {
      > svg {
        width: 32px;
        top: 20px;
        left: 16px;
      }
    }

    ${SearchButtons} {
      & {
        width: inherit;
        height: inherit;
        right: 16px !important;
        top: 12px;
      }
    }
  }

  &.size-md {
    input {
      height: 36px;
      font-size: 0.9rem;
      padding-left: 32px;
    }

    > div {
      > svg {
        width: 16px;
        top: 10px;
        left: 8px;
      }

      > div {
        width: 36px;
        height: 36px;

        button {
          padding: 6px;
        }
      }
    }
  }

  &.size-sm {
    input {
      height: 32px;
      font-size: 0.875rem;
      padding-left: 30px;
    }

    > div {
      > svg {
        width: 14px;
        top: 9px;
        left: 8px;
      }

      > div {
        width: 32px;
        height: 32px;

        button {
          padding: 5px;
        }
      }
    }
  }
`;

const Input = styled(BaseInput)`
  font-weight: var(--font-bold);
  color: var(--text-medium);

  /* remove default clear button */
  &::-webkit-search-decoration,
  &::-webkit-search-cancel-button,
  &::-webkit-search-results-button,
  &::-webkit-search-results-decoration {
    -webkit-appearance: none;
  }
`;

const InputWrapper = styled.div`
  position: relative;

  > svg {
    position: absolute;
    top: 15px;
    left: 12px;
  }
`;
