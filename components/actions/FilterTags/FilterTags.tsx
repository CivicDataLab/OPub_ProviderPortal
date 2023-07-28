import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { Text } from 'components/layouts';
import { Flex } from 'components/layouts/FlexWrapper';
import { Checkmark, LockOpen, RotateCWBold } from '@opub-icons/workflow';

const FilterTags = ({ data, clickedTag, defaultSelected }) => {
  const [tagClicked, setTagClicked] = useState(defaultSelected);

  useEffect(() => {
    setTagClicked(defaultSelected);
  }, [defaultSelected]);

  const handleTagClick = (clickedItem) => {
    setTagClicked(clickedItem);
    clickedTag(clickedItem);
  };

  return (
    <MainWrapper>
      <ProgressBar>
        <TagsWrapper>
          {data?.map((item, index) => (
            <>
              <ListItem
                aria-pressed={item.id === tagClicked}
                data-completed={item.status}
                backgroundColor={item.id === tagClicked}
                key={`${index}`}
                onClick={() => handleTagClick(item.id)}
              >
                <Flex margin={'10px'}>
                  {item.id === tagClicked ? (
                    <RotateCWBold
                      transform="rotate(90deg)"
                      size={32}
                      fill={'var(--color-background-lightest)'}
                    />
                  ) : item.status === 'done' ? (
                    <Checkmark
                      size={32}
                      fill={'var(--color-background-lightest)'}
                    />
                  ) : (
                    <LockOpen size={28} />
                  )}
                </Flex>
                <Flex marginTop={'20px'} justifyContent={'center'}>
                  <Text>{item.name}</Text>
                </Flex>

                {/* {item.id === tagClicked ? <Vector /> : ''} */}
              </ListItem>
              {data.length !== index + 1 && (
                <StatusBar
                  aria-pressed={item.id === tagClicked}
                  data-completed={item.status}
                />
              )}
            </>
          ))}
        </TagsWrapper>

        {/* <Labels>
          {' '}
          {data?.map((item, index) => (
            <>
              <li key={index}>{item.name}</li>
            </>
          ))}
        </Labels> */}
      </ProgressBar>
    </MainWrapper>
  );
};

export default FilterTags;

const Status = styled.span`
  border-radius: 400px;
  width: 56px;
  border: 2px solid var(--color-gray-02);
  background-color: var(--color-background-lightest);
`;
const MainWrapper = styled.section`
  padding: 0 20px; ;
`;
const ProgressBar = styled.div`
  padding-bottom: 30px;
  border-top: 1px solid var(--color-gray-01);

  @media (max-width: 1070px) {
    padding: 30px 10px;

    overflow-x: auto;
    width: 100%;
  }
`;

export const TagsWrapper = styled.ul`
  display: flex;
  justify-content: center;
  padding: 14px 0;
  @media (max-width: 1270px) {
    zoom: 75%;
  }
`;

const ListItem = styled.li<any>`
  cursor: pointer;
  border-radius: 400px;
  width: 40px;
  height: 40px;
  border: 2px solid var(--color-gray-02);
  background-color: var(--color-background-lightest);
  gap: 10px;

  &[data-completed='done'] {
    background-color: var(--color-success);
  }

  &[aria-pressed='true'] {
    background-color: var(--color-warning);
  }

  > button {
    padding: 12px;
  }
  span {
    white-space: nowrap;
  }
  @media (max-width: 1070px) {
    span {
      white-space: normal;
    }
  }
`;

const StatusBar = styled.span`
  position: relative;
  width: 144px;
  height: 4px;
  border-bottom: 5px dotted var(--color-gray-03);

  &[data-completed='done'] {
    border-bottom: 5px solid var(--color-success);
  }
  &[aria-pressed='true'] {
    border-bottom: 5px solid var(--color-gray-03);
  }
  margin: auto 0;
  border-radius: 0;
  vertical-align: top;
`;
