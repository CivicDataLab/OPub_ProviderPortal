import React from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import { Heading } from 'components/layouts';
import { Button } from 'components/actions';
import { Flex } from 'components/layouts/FlexWrapper';
import { useRouter } from 'next/router';
import { signIn, useSession } from 'next-auth/react';
import { platform_name } from 'platform-constants';

const HomeOrgBanner = () => {
  const router = useRouter();
  const { data: session } = useSession();

  return (
    <BannerSection className="container">
      <Wrapper>
        <Heading color={'var(--text-high)'} variant="h3" as={'span'}>
          Looking forward to share data on <br />
          {platform_name}?
        </Heading>
        <Flex gap="16px" flexWrap={'wrap'}>
          <Button
            as="a"
            kind="primary-outline"
            onPress={() => {
              session
                ? router.push('/user/organizations?action=find')
                : typeof window !== 'undefined' &&
                  signIn('keycloak', {
                    callbackUrl: `${window.location.origin}/user/organizations?action=find&clientLogin=true`,
                  });
            }}
          >
            Find Your Organisation
          </Button>
          <Button
            as="a"
            kind="primary"
            onPress={() => {
              session
                ? router.push('/user/organizations?action=request')
                : typeof window !== 'undefined' &&
                  signIn('keycloak', {
                    callbackUrl: `${window.location.origin}/user/organizations?action=request&clientLogin=true`,
                  });
            }}
          >
            Request New Organisation
          </Button>
        </Flex>
      </Wrapper>

      <Image
        src={'/assets/images/homeorgbanner.svg'}
        alt={'about section image'}
        width={383}
        height={252}
      />
    </BannerSection>
  );
};

export default HomeOrgBanner;

const BannerSection = styled.section`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-block: 25px;
  flex-wrap: wrap;
  place-content: center;
  gap: 50px;
  margin-top: 30px;
  background-color: var(--color-background-lightest);
`;

const Wrapper = styled.div`
  width: 580px;
  display: flex;
  flex-wrap: wrap;
  gap: 19px;
  flex-direction: column;
  @media (max-width: 1050px) {
    width: auto;
  }
`;
