import React from 'react';
import styled from 'styled-components';
import { Label } from '../BaseStyles';

interface Props {
  label: string;
  onChange?: any;
  onSubmit?: any;
  id: string;
  maxLength?: number;
}

const Input = ({
  label,
  onChange,
  onSubmit,
  id,
  maxLength,
  ...props
}: Props) => {
  function handleOnChange(e) {
    onChange && onChange(e);
    if (e.target.value != '') e.target.setAttribute('data-empty', 'false');
    else e.target.setAttribute('data-empty', 'true');
  }
  return (
    <FieldSet>
      <input
        onChange={(e) => handleOnChange(e)}
        data-empty="true"
        onSubmit={onSubmit}
        id={id}
        maxLength={maxLength}
        {...props}
      />
      <Label htmlFor="id">{label}</Label>
    </FieldSet>
  );
};

export { Input };

const FieldSet = styled.fieldset`
  position: relative;

  input:active + label,
  input:focus + label,
  input:required:valid + label,
  input[data-empty='false'] + label {
    transform: translate3d(-9px, -32px, 0) scale(0.9);
    line-height: 14px;
  }

  input {
    border-radius: 2px;
    border: 1px solid var(--color-gray-05-on-dark);
    padding: 12px 8px;
    font-weight: 700;
    color: var(--text-medium);
    height: 48px;
  }

  label {
    transform: translateZ(0);
    top: 14px;
    left: 12px;
    transform-origin: 0 50%;
    transition: all 0.25s ease-in-out;
    pointer-events: none;
    position: absolute;
    display: inline-block;
    font-weight: var(--font-bold);
    color: var(--text-medium);
    line-height: 23px;
  }
`;
