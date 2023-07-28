import styled from 'styled-components';

export const Wrapper = styled.article`
  padding: 16px;
  background-color: var(--color-white);
  filter: var(--drop-shadow);

  display: flex;
  justify-content: space-between;

  > div:first-child {
    flex-grow: 1;
  }

  > div:last-child {
    flex-basis: 250px;
  }

  @media screen and (max-width: 920px) {
    flex-wrap: wrap;
    gap: 32px;
  }

  @media screen and (max-width: 640px) {
    padding: 12px;
    gap: 8px;

    &.isHVD {
      padding-top: 32px;
    }
  }
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-grow: 1;
`;

export const Logo = styled.div`
  padding: 12px;
  background-color: var(--color-white);
  border-radius: 2px;
  border: 2px solid var(--color-gray-02);
  min-width: 108px;
  width: fit-content;
  height: fit-content;
  font-size: 0;
  cursor: pointer;

  @media (max-width: 640px) {
    display: none;
  }
`;

export const Header = styled.header`
  display: inline-flex;
  width: 100%;
  gap: 16px;
`;

export const Title = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 4px;
  flex-grow: 1;

  border-bottom: 1px solid var(--color-gray-01);
  padding-bottom: 12px;

  a {
    text-decoration: none;
  }

  h4 {
    overflow: hidden;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    display: -webkit-box;
  }
`;

export const HeaderMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  flex-wrap: wrap;
`;

export const Rating = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  border-left: 1px solid var(--color-gray-01);
  padding-left: 8px;
`;

export const Description = styled.div`
  display: inline-flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-between;
  width: 100%;
`;

export const Update = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;

  > span:first-of-type {
    padding: 6px;
    background-color: var(--color-primary-05);
    font-size: 0;

    svg {
      fill: var(--color-primary-01);
    }
  }
`;

export const Tag = styled.span`
  font-weight: 700;
  line-height: 1.7;
  font-size: 0.75rem;
  padding: 2px 6px;
  border-radius: 2px;
  background-color: ${(props) => props.color || 'var(--color-white)'};
  border: 2px solid var(--color-gray-01);

  color: var(--color-gray-06);
`;

export const Metadata = styled.div`
  min-width: 250px;
  flex-basis: 250px;
  border-left: 1px solid var(--color-gray-01);
  padding-left: 16px;
  margin-left: 16px;

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  @media screen and (max-width: 920px) {
    border-left: none;
    margin-left: 0;
    border-top: 1px solid var(--color-gray-01);
    padding-left: 0;
    padding-top: 16px;
    flex-grow: 1;

    > div:first-of-type {
      height: auto;
    }
  }

  @media (max-width: 640px) {
    padding-top: 12px;
    max-width: 100%;
  }

  h5 {
    span {
      font-size: 2rem;
    }
  }
`;

export const DateWrapper = styled.div`
  color: var(--text-medium);
  flex-grow: 1;
  gap: 16px;

  span {
    min-width: 100px;
  }
`;
