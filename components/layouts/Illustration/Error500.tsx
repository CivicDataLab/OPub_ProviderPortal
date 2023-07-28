import Image from 'next/image';
import styled from 'styled-components';
import { Heading } from '../Heading';
import { Text } from '../Text';

type Props = {
  label?: string | React.ReactElement;
};

export const Error500 = ({ label }: Props) => {
  return (
    <Wrapper>
      <div>
        <Image
          src="/assets/icons/Error500.svg"
          width={135}
          height={87}
          alt="Error"
        />
        <Heading mt="16px" as="span" variant="h2l">
          {label || 'Connection Error'}
        </Heading>
        <Text fontStyle="italic" variant="pt14" as="span">
          Something went wrong. Please try again later.
        </Text>
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
  }
`;
