import styled from 'styled-components';
import Image from 'next/image';
import { Heading, Text } from 'components/layouts';
import { Link, NextLink } from 'components/layouts/Link';

export function ErrorPage() {
  return (
    <>
      <Wrapper className="container">
        <Image
          src="/assets/icons/Error500.svg"
          width={146}
          height={94}
          alt="Image showing that no webpage is found"
        />
        <Heading>Something went wrong</Heading>
        <Text as="p">
          You can try to Refresh this page or go to the{' '}
          <NextLink href="/">
            <Link>Homepage</Link>
          </NextLink>
        </Text>
      </Wrapper>
    </>
  );
}

const Wrapper = styled.div`
  min-height: 80vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  h2 {
    margin-top: 8px;
  }

  p {
    margin-top: 2px;
  }
`;
