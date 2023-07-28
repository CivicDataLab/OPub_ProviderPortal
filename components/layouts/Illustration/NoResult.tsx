import Image from 'next/image';
import styled from 'styled-components';
import { Heading } from '../Heading';

type Props = {
  label?: string | React.ReactElement;
};

export const NoResult = ({ label }: Props) => {
  return (
    <Wrapper>
      <div>
        <Image
          src="/assets/icons/NoResult.svg"
          width={99}
          height={94}
          alt="Icon showing that no search result is found"
        />
        <Heading as="span" variant="h2l">
          {label || 'No Results'}
        </Heading>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  min-height: 60vh;

  display: flex;
  justify-content: center;
  align-items: center;

  > div {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 8px;
  }

  span {
    margin-left: 10px;
  }
`;
