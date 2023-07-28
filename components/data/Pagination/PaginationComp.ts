import styled from 'styled-components';

export const PaginationComp = styled.div`
  margin-top: 32px;
  padding: 16px;
  background-color: var(--color-white);
  border-radius: 4px;
  filter: var(--drop-shadow);
  align-items: center;
  gap: 16px;

  @supports (display: grid) {
    display: grid;
    grid-template-columns: 1fr repeat(2, max-content);

    @media (max-width: 920px) {
      grid-template-columns: 1fr 1fr;
      grid-template-rows: 1fr 1fr;
    }
  }

  @media (max-width: 920px) {
    font-size: 0.9rem;
  }

  @media (max-width: 370px) {
    display: flex;
    flex-wrap: wrap;
    font-size: 0.8rem;
  }

  .opub-select {
    width: fit-content;

    &__control {
      min-width: 80px;
    }

    > label {
      font-weight: var(--font-bold);
      /* color: var(--color-primary-01); */
    }
  }
`;

export const PaginationJump = styled.div`
  border-right: 1px solid rgba(0, 0, 0, 0.2);
  padding-right: 20px;
  /* color: var(--color-primary-01); */
  font-weight: var(--font-bold);

  @media (max-width: 920px) {
    border-right: none;
    justify-self: flex-end;
    padding-right: 0;
  }

  input {
    width: 56px;
    height: 40px;
    border-radius: 4px;
    box-shadow: inset 0px 0px 4px rgba(0, 0, 0, 0.08);
    border: 1px solid rgba(0, 0, 0, 0.12);
    text-align: center;
  }
`;

export const ButtonsLabel = styled.span`
  color: var(--text-medium);
  line-height: 140%;

  span {
    font-weight: var(--font-bold);

    @media (max-width: 920px) {
      margin: 0 5px;
    }
  }
`;

export const PaginationButtons = styled.div`
  /* margin-left: 20px; */
  display: flex;
  justify-content: center;
  align-items: center;

  > div {
    display: flex;
  }

  @media (max-width: 920px) {
    grid-row: 2/3;
    grid-column: 1/3;
    justify-self: center;
    padding-top: 1rem;
    border-top: 1px solid rgba(0, 0, 0, 0.2);
    width: 100%;
    justify-content: space-between;
    margin-left: 0;
  }

  button {
    border-radius: 4px;
    padding: 4px;
    line-height: 0;
    background-color: var(--color-primary-01);

    &.is-disabled {
      background-color: var(--text-disabled);
      cursor: auto;
    }
  }

  .pagination__back {
    margin-left: 16px;

    svg {
      transform: rotate(90deg);
    }
  }

  .pagination__next {
    margin-left: 8px;

    svg {
      transform: rotate(-90deg);
    }
  }
`;

export default PaginationComp;
