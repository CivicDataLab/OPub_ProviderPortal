import { ChevronDown, ChevronUp } from '@opub-icons/workflow';
import { Button } from 'components/actions';
import { useState } from 'react';
import styled from 'styled-components';
import { Text } from 'components/layouts';

const DatasetGridCards: React.FC<{ data: any; ColumnHeaders?: any }> = ({
  data,
  ColumnHeaders,
}) => {
  const [collapsedElement, setCollapsedElement] = useState(null);
  return (
    <>
      {ColumnHeaders && (
        <HeaderWrapper>
          {ColumnHeaders.map((headerItem) => (
            <Text key={`Header-${headerItem}`}>{headerItem.name}</Text>
          ))}
        </HeaderWrapper>
      )}
      {data?.map(({ grid, info }, index) => {
        return (
          <Container key={index}>
            <CardRow>
              {grid.map((item, gridIndex) => {
                return (
                  <div key={gridIndex}>
                    {item}
                    {gridIndex === grid.length - 1 && (
                      <Button
                        size="sm"
                        kind={
                          collapsedElement === index
                            ? 'primary'
                            : 'primary-outline'
                        }
                        icon={
                          collapsedElement === index ? (
                            <ChevronUp />
                          ) : (
                            <ChevronDown />
                          )
                        }
                        onPress={() => {
                          collapsedElement === index
                            ? setCollapsedElement(null)
                            : setCollapsedElement(index);
                        }}
                      >
                        See Details
                      </Button>
                    )}
                  </div>
                );
              })}
            </CardRow>
            {collapsedElement === index && (
              <span className={info && 'container__span'}>{info}</span>
            )}
          </Container>
        );
      })}
    </>
  );
};

export default DatasetGridCards;

const Container = styled.div`
  background: var(--color-white);
  filter: var(--drop-shadow);
  margin-bottom: 1rem;
  padding: 10px;
  margin-top: 1em;

  .container__span {
    display: flex;
    gap: 10px;
    border-top: 1px solid var(--color-grey-500);
    padding-inline: 0 5px;
  }
`;

const HeaderWrapper = styled.div`
  display: grid;
  gap: 20px;
  grid-template-columns: 250px repeat(auto-fit, minmax(100px, 1fr));
  word-break: break-all;
  padding: 10px 0px;
  border-bottom: 3px solid var(--color-grey-500);
`;

const CardRow = styled.div`
  display: grid;
  gap: 20px;
  grid-template-columns: 250px repeat(auto-fit, minmax(100px, 1fr));

  & > * {
    display: flex;
    flex: 0 0 15%;
    border-right: 1px solid var(--color-grey-500);
    word-break: break-word;
    padding-right: 5px;
    justify-content: center;
    align-items: center;

    &:first-child {
      justify-content: left;
    }

    &:last-child {
      flex: 1;
      display: flex;
      gap: 10px;
      padding: 5px;
      justify-content: space-between;
      border: none;
      flex-wrap: wrap;
    }
  }
`;
