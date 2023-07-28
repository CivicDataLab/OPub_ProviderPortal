import styled from 'styled-components';
import { Text } from 'components/layouts';

const DatasetInfoCard: React.FC<{ data: any; ColumnHeaders?: any }> = ({
  data,
  ColumnHeaders,
}) => {
  return (
    <>
      {ColumnHeaders && (
        <HeaderWrapper columnHeadersLength={ColumnHeaders?.length}>
          {ColumnHeaders?.map((headerItem, index) => (
            <Text as="p" fontWeight={'bold'} key={`Column-Header-${index}`}>
              {headerItem.name}
            </Text>
          ))}
        </HeaderWrapper>
      )}
      {data.map(
        ({ gridOne, gridTwo, gridThree, actionable, info = null }, index) => {
          return (
            <Container key={index}>
              <CardRow isGridThree={!!gridThree} showActionable={!!actionable}>
                {gridOne && gridOne}
                {gridTwo && gridTwo}
                {gridThree && gridThree}
                {
                  <ButtonGroup showActionable={!!actionable}>
                    {actionable}
                  </ButtonGroup>
                }
              </CardRow>
              {<span className={info && 'container__span'}>{info}</span>}
            </Container>
          );
        }
      )}
    </>
  );
};

export default DatasetInfoCard;

const Container = styled.div`
  margin-bottom: 1rem;
  padding: 10px;
  margin-top: 1em;
  max-width: 100%;

  .container__span {
    display: flex;
    gap: 10px;
    border-top: 1px solid var(--color-grey-500);
    padding-inline: 0 5px;
  }
`;

const ButtonGroup = styled.div<any>`
  display: ${(props) => (props.showActionable ? 'flex' : 'none')};
  gap: 20px;
  justify-content: center;
`;

const CardRow = styled.div<any>`
  display: grid;
  gap: 20px;
  grid-template-columns: ${(props) =>
    props.showActionable && props.isGridThree
      ? 'repeat(4 , 1fr)'
      : 'repeat(3  ,1fr)'};
  background-color: var(--color-white);
  & > * {
    flex: 0 0 15%;
    border-right: 1px solid var(--color-grey-500);
    word-break: break-word;
    padding-right: 5px;

    &:nth-last-child(2) {
      border: none;
      /* max-width: 125px; */
    }

    &:first-child {
      /* grid-column: 1/2; */
      padding-bottom: 15px;
    }

    &:last-child {
      flex: 1;
      border-left: 1px solid var(--color-grey-500);
      border-right: none;
      min-width: max-content;
      padding: 15px;
    }
  }
`;

const HeaderWrapper = styled.div<any>`
  margin-top: 1em;
  padding-bottom: 5px;
  display: grid;
  grid-template-columns: repeat(${(props) => props.columnHeadersLength}, 1fr);
  border-bottom: 3px solid var(--color-grey-500);
  text-align: center;
  max-width: 100%;

  & > *:first-child {
    text-align: left;
  }
  & > *:last-child {
    text-align: right;
  }
`;
