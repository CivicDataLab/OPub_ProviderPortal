import { Heading, Text } from 'components/layouts';
import useTranslation from 'next-translate/useTranslation';
import Image from 'next/image';
import styled from 'styled-components';

const HomeTrending = () => {
  const { t } = useTranslation('home');

  return (
    <Wrapper>
      <Heading variant="h2" as="h2" textAlign="center">
        {t('about-platform-1') + ' '}
        <Text color={'var(--color-secondary-01)'}>{t('about-platform-2')}</Text>
      </Heading>
      <Heading
        textAlign="center"
        variant="h4"
        as="h3"
        color="var(--text-light)"
        mt="4px"
      >
        {t('learn-about-the-aims-and-features-of-idp')}
      </Heading>

      <VideoContainer>
        {process.env.NEXT_PUBLIC_ENV === 'nic' ? (
          <Image
            src="/assets/images/AboutIDP.jpg"
            width="680"
            height="360"
            alt="Youtube video placeholder"
          />
        ) : (
          <video
            width="680"
            height="360"
            src="/assets/AboutIDP.mp4"
            title="About IDP"
            controls
            autoPlay={false}
          />
        )}
      </VideoContainer>
    </Wrapper>
  );
};

export default HomeTrending;

const Wrapper = styled.section`
  padding-bottom: 40px;
  background-image: url('/assets/images/Maskgrp.png');
  background-size: contain;

  h3 {
    margin-top: 8px;
  }

  @media (max-width: 640px) {
    padding-bottom: 0;
    background-image: none;

    h3 {
      max-width: 260px;
      text-align: center;
      margin-inline: auto;
    }
  }
`;

const VideoContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 52px;

  @media (max-width: 700px) {
    margin-top: 0;

    video {
      max-width: 350px;
    }
  }

  @media (max-width: 640px) {
    margin-top: 22px;
    video {
      height: 180px;
    }
  }
`;
