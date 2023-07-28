import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding-inline: 2px;
  gap: 4px;
`;

export const Label = styled.label`
  font-weight: var(--font-bold);
  font-size: 0.875rem;
  line-height: 1.4;
  display: block;
  width: 100%;
`;

export const Description = styled.div`
  font-weight: normal;
  font-size: 0.875rem;
  line-height: 1.4;
  color: var(--text-medium);

  svg {
    width: 10px;
  }
`;
export const TextAreaDescription = styled.div`
  font-size: 0.875rem;
  line-height: 1.4;
  text-align: initial;
  min-width: 50px;
  color: var(--text-medium);
`;

export const ErrorMessage = styled.div`
  font-size: 0.875rem;
  line-height: 1.4;
  color: var(--color-error);
`;

export const Indicator = styled.span`
  font-size: 0.75rem;
  line-height: 1.3;
  color: var(--text-light);
  font-weight: var(--font-normal);
`;

export const BaseInput = styled.input`
  border: none;
  background-color: inherit;
  flex-grow: 1;
  outline: none;
`;

export const InputWrapper = styled.div`
  display: flex;
  align-items: center;

  > svg {
    width: 24px;
  }

  --border-color: var(--color-gray-02);
  --border-width: 1px;
  --bg-color: var(--form-bg);

  background-color: var(--bg-color);
  border: var(--border-width) solid var(--border-color);
  width: 100%;
  border-radius: 2px;

  > input,
  > textarea {
    padding: 11px 15px;
    height: 48px;
    resize: vertical;
  }

  letter-spacing: 0.01em;
  line-height: 1.5;

  &:hover {
    --border-color: var(--color-gray-03);
  }

  &:active,
  &:focus-within {
    --border-color: var(--form-active);
  }

  &[disabled=''] {
    --bg-color: var(--form-bg-disabled);
    color: var(--text-light);

    &:hover {
      --border-color: var(--color-gray-02);
    }
  }

  outline: none !important;
`;
