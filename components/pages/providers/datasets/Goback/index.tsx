import React from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import { Text } from 'components/layouts';

import { Link, NextLink } from 'components/layouts/Link';
import { ChevronRight } from '@opub-icons/workflow';

const Goback = ({}) => {
  const router = useRouter();

  return (
    <Wrapper>
      <ChevronRight />
      <NextLink
        href={`/providers/${router.query.provider}/dashboard/datasets/drafts`}
      >
        <Link underline="hover">
          <Text>Goback</Text>
        </Link>
      </NextLink>
    </Wrapper>
  );
};

export default Goback;

const Wrapper = styled.p`
  display: flex;
  color: var(--color-primary-01);
  padding-bottom: 20px;

  h2 {
    font-size: 16px;
    padding-left: 5px;
  }
  svg {
    transform: rotate(180deg);
  }
`;
