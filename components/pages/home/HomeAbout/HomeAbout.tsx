import styled from 'styled-components';
import { Heading } from 'components/layouts';
import { Text } from 'components/layouts/Text';
import { platform_name } from 'platform-constants';
import { Flex } from 'components/layouts/FlexWrapper';
import Image from 'next/image';
import { Button } from 'components/actions';
import HomeTrending from '../HomeTrending';
import useTranslation from 'next-translate/useTranslation';
import { useWindowSize } from 'utils/hooks';

const HomeAbout = () => {
  const { t } = useTranslation('home');
  const windowSize = useWindowSize();

  return (
    <Wrapper>
      <>
        <HomeTrending />

        <div className="container">
          <AboutWrapper>
            <Flex flexDirection={'column'} gap="24px">
              <Heading variant="h3" as={'span'}>
                <Text color={'var(--color-primary-01)'}>
                  {t('one-stop-solution-phrase-1')}
                </Text>{' '}
                {t('one-stop-solution-phrase-2')}
                <Text color={'var(--color-primary-01)'}>
                  {' '}
                  {t('one-stop-solution-phrase-3')}
                </Text>
              </Heading>
              <Button
                as="a"
                href="/about"
                kind="primary"
                size={windowSize.width > 480 ? 'md' : 'sm'}
              >
                {t('know-more')}
              </Button>
            </Flex>
            <Image
              src={'/assets/images/homeAbout.svg'}
              alt={
                'Image showing various users of IDP such as analysts, entrepreneurs, students and teachers'
              }
              width={590}
              height={320}
            />
          </AboutWrapper>
        </div>
      </>
    </Wrapper>
  );
};

export { HomeAbout };

const Wrapper = styled.section`
  margin-top: 100px;
  padding-top: 72px;
  padding-bottom: 54px;
  background-color: var(--color-white);
  box-shadow: var(--box-shadow);

  > .container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  span {
    font-weight: var(--font-bold);
  }

  @media (max-width: 990px) {
    margin-top: 96px;
  }

  @media (max-width: 640px) {
    margin-top: 40px;
    padding-block: 24px;
  }
`;

const AboutWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 64px;
  margin-top: 40px;

  span {
    text-align: right;
    max-width: 295px;
    overflow-wrap: break-word;
    word-wrap: break-word;
    word-break: break-word;
  }

  a {
    margin-left: auto;
  }

  @media (max-width: 640px) {
    margin-top: 24px;
    gap: 24px;

    span {
      text-align: center;
      max-width: 312px;
    }

    > div {
      align-items: center;
    }

    a {
      margin-left: initial;
      margin-top: 24px;
    }
  }
`;
