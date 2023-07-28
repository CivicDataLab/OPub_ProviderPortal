import React from 'react';
import styled from 'styled-components';

function RadioGroup({ data, formik }) {
  return (
    <RadioWrapper>
      {data.list.map((item) => {
        return (
          <label key={item.value}>
            <input
              checked={formik.values[data.name]?.toString() == item.value}
              type="radio"
              name={data.name}
              onChange={formik.handleChange}
              value={item.value}
              required
            />
            <p>{item.label}</p>
          </label>
        );
      })}
    </RadioWrapper>
  );
}

export default RadioGroup;

const RadioWrapper = styled.div`
  label {
    display: grid;
    grid-template-columns: 1em auto;
    gap: 16px;
    color: var(--text-medium);
    align-items: end;

    p {
      font-weight: 600;
      /* font-size: 0.875rem; */
    }

    input {
      /* Remove native radio style */
      appearance: none;
      background-color: #fff;
      margin: 0;

      font: inherit;
      color: currentColor;
      width: 24px;
      height: 24px;
      /* min-width: 8px; */
      border: 0.15em solid var(--color-primary);
      border-radius: 50%;
      /* transform: translateY(0.2em); */

      display: grid;
      place-content: center;

      &::before {
        content: '';
        width: 12px;
        height: 12px;
        border-radius: 50%;
        transform: scale(0);
        transition: 120ms transform ease-in-out;
        box-shadow: inset 1em 1em var(--color-primary);

        /* Windows High Contrast Mode */
        background-color: CanvasText;
      }

      &:checked::before {
        transform: scale(1);
      }

      &:focus-visible {
        outline: max(2px, 0.15em) solid currentColor;
        outline-offset: max(2px, 0.15em);
      }
    }
  }
`;
