import React from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import { Heading, Text } from 'components/layouts';
import { Button } from 'components/actions';
import { Flex } from 'components/layouts/FlexWrapper';
import useTranslation from 'next-translate/useTranslation';
import { useWindowSize } from 'utils/hooks';

const HomeBanner = () => {
  const { t } = useTranslation('home');
  const windowSize = useWindowSize();

  return (
    <BannerSection>
      <div>
        <ImageContainer>
          <MobileHeading>
            <Heading color={'var(--text-high)'} variant="h3" as={'span'}>
              {t('cannot-find-the-data-you-are-looking-for-1')}
              <Text color={'var(--color-primary-02)'}>
                {t('cannot-find-the-data-you-are-looking-for-2')}
              </Text>
              {t('cannot-find-the-data-you-are-looking-for-3')}
            </Heading>
          </MobileHeading>
          <Image
            src={'/assets/images/homeFooter.svg'}
            alt={
              'Image showing two users of IDP unable to find what they are looking for'
            }
            width={364}
            height={316}
            layout="responsive"
          />
        </ImageContainer>
        <CTA>
          <Flex flexDirection={'column'} gap="24px">
            <DesktopHeading>
              <Heading color={'var(--text-high)'} variant="h3" as={'span'}>
                {t('cannot-find-the-data-you-are-looking-for-1')}
                <Text color={'var(--color-primary-02)'}>
                  {t('cannot-find-the-data-you-are-looking-for-2')}
                </Text>
                {t('cannot-find-the-data-you-are-looking-for-3')}
              </Heading>
            </DesktopHeading>
            <Button
              as="a"
              href="/connect-with-idp?requestNew=true"
              kind="primary"
              size={windowSize.width > 480 ? 'md' : 'sm'}
            >
              {t('request-now-button')}
            </Button>
          </Flex>
        </CTA>
      </div>
    </BannerSection>
  );
};

export default HomeBanner;

const BannerSection = styled.section`
  margin-block: 116px 80px;

  > div {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    place-content: center;
    gap: 80px;

    @media (max-width: 640px) {
      gap: 0;
      flex-direction: column;
    }
  }

  span {
    overflow-wrap: break-word;
    font-weight: var(--font-bold);
    word-wrap: break-word;
    word-break: break-word;
  }

  @media (max-width: 640px) {
    margin-top: 32px;
    margin-bottom: 0;
    padding: 24px;
    background-color: var(--color-background-lightest);
    box-shadow: var(--box-shadow);
  }
`;

const ImageContainer = styled.div`
  width: 364px;
  height: 316px;

  @media (max-width: 640px) {
    width: 253px;
    height: auto;
  }
`;

const DesktopHeading = styled.div`
  display: none;
  text-align: start;
  width: 280px;

  @media (min-width: 480px) {
    display: block;
  }
`;

const MobileHeading = styled.div`
  display: none;
  text-align: center;
  margin-bottom: 28px;

  @media (max-width: 640px) {
    display: block;
  }
`;

const CTA = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  align-items: center;
  justify-content: center;

  @media (max-width: 640px) {
    margin-top: 24px;
  }
`;
