import { DatasetCard } from 'components/data';
import { NoResult } from 'components/layouts';
import styled from 'styled-components';

const DatasetList: React.FC<{ data: any }> = ({ data }) => {
  return (
    <Wrapper className="list">
      {data.length ? (
        data.map((pkg: any, index: number) => {
          return (
            <li key={pkg.name + index}>
              <DatasetCard datapackage={pkg} />
            </li>
          );
        })
      ) : (
        <NoResult label="No Datasets" />
      )}
    </Wrapper>
  );
};

export default DatasetList;

const Wrapper = styled.ul`
  margin-top: 28px;
  display: flex;
  flex-direction: column;
  gap: 20px;

  @media (max-width: 640px) {
    margin-top: 16px;
    gap: 16px;
  }
`;
