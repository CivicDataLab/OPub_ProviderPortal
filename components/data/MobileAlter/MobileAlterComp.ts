import styled from 'styled-components';

export const MobileAlterComp = styled.div`
  .data-alter {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    justify-content: space-between;
    align-items: center;
    padding: 12px;
    background: var(--color-white);
    border-radius: 4px;

    @media (min-width: 640px) {
      display: none;
    }

    &__buttons {
      display: flex;
      gap: 12px;
      align-items: center;

      .alter__small {
        display: none;
        border: none;
      }

      @media (max-width: 540px) {
        button {
          display: none;
        }
        .alter__small {
          display: block;
          line-height: 0;
        }
      }
    }
  }

  @media (max-width: 540px) {
    fieldset {
      padding-inline: 16px;
    }
  }
`;

export const Header = styled.div`
  display: flex;
  gap: 12px;
  justify-content: space-between;
  align-items: center;
  background-color: var(--color-white);
  border-radius: 12px 12px 0px 0px;
  padding-inline: 24px;
  padding-block: 12px;
  border-bottom: var(--separator-5-2);

  @media (max-width: 540px) {
    padding-inline: 16px;
  }

  h1 {
    font-weight: var(--font-weight-medium);
    font-size: 20px;
    line-height: 26px;
    margin: 0;
  }

  button {
    color: var(--color-secondary-02);
    text-decoration-line: underline;
    text-transform: capitalize;
  }
`;

export const Wrapper = styled.div`
  padding-inline: 24px;
  background-color: var(--color-background-lighter);

  @media (max-width: 540px) {
    padding-inline: 16px;
  }
`;

export const FilterAlter = styled.div`
  display: grid;
  grid-template-columns: max-content 1fr;
  margin-top: 0.5rem;

  ul {
    width: 200px;
    margin-right: 1.25rem;
    overflow-y: auto;

    li {
      margin-top: 0.5rem;
    }

    a {
      width: 100%;
      padding: 9px 8px;
      display: block;
      text-decoration: none;
      text-transform: capitalize;
      border-radius: 4px;
      background-color: var(--color-gray-01);
      line-height: 137%;

      &[aria-selected='true'] {
        background-color: var(--color-gray-03);
        font-weight: 500;
      }
    }

    @media (max-width: 640px) {
      width: 144px;
    }
  }
`;

export const Fieldset = styled.fieldset`
  height: 80vh;
  max-height: 480px;
  padding: 0;
  padding-inline: 4px;

  label {
    display: flex;
    align-items: center;
    gap: 4px;
    line-height: 1.5;
  }

  input {
    margin-right: 6px;
    accent-color: var(--color-primary-02);

    &[type='radio'] {
      padding: 6px 0;
      transform: scale(1.2);
      margin-top: -2px;
    }
  }

  &#modalSort {
    overflow-y: auto;
    padding-top: 16px;

    label {
      margin-bottom: 8px;
    }
  }

  [role='tabpanel'] {
    overflow-y: auto;
    display: inline-flex;
    flex-direction: column;
    gap: 8px;
    margin-top: 4px;

    font-size: 14px;

    height: 80vh;
    max-height: 480px;
  }
`;

export const Footer = styled.div`
  display: flex;
  gap: 12px;
  padding: 16px 0;
  border-top: var(--separator-5-2);

  button {
    width: 100%;
  }

  @media (max-width: 540px) {
    padding: 8px 0;
  }
`;
