import styled from 'styled-components';

const Tags = ({ data }) => {
  return (
    <TagsWrapper title="Tags associated with the dataset">
      {data.slice(0, 9).map((item, index) => (
        <li key={`explorer-${index}`}>{item}</li>
      ))}
    </TagsWrapper>
  );
};

export default Tags;

export const TagsWrapper = styled.ul`
  display: flex;
  flex-wrap: wrap;
  margin: 16px 0;
  gap: 0.5rem;

  li {
    text-transform: uppercase;
    font-weight: bold;
    font-size: 9px;
    line-height: 130%;
    color: var(--text-medium);
    background-color: var(--text-light-disabled);
    padding: 4px 8px;
    border-radius: 10px;
  }
`;
