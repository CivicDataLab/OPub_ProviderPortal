import { CheckmarkCircle, Email, WebPage } from '@opub-icons/workflow';
import { Share } from 'components/actions';
import { Heading, ShowMore, TruncateText } from 'components/layouts';
import { Flex } from 'components/layouts/FlexWrapper';
import { Link } from 'components/layouts/Link';
import { Text } from 'components/layouts/Text';
import useTranslation from 'next-translate/useTranslation';
import Image from 'next/image';
import { useState } from 'react';
import styled from 'styled-components';
import { Org_types } from 'utils/government-entities';
import { CardHeader } from '../OrgCard/OrgCard';

const IntroCard = ({ data }) => {
  const [logo, setLogo] = useState('logo');

  const { t: commonT } = useTranslation('common');
  const { t: sectorT } = useTranslation('sectors');

  const cards = [
    {
      number: data?.dataset_count || 0,
      label: commonT('intro-card-datasets'),
    },
    {
      number: data?.dam_count || 0,
      label: commonT('intro-card-dataset-access-models'),
    },
    {
      number: data?.hasOwnProperty('homepage')
        ? data?.usecase_count || 0
        : data?.organization_count || 0,
      label: data?.hasOwnProperty('homepage')
        ? commonT('intro-card-sectors')
        : commonT('intro-card-providers'),
    },
  ];

  const title = data?.name
    ? sectorT(data?.name.toLowerCase().replaceAll(' ', '-'))
    : data?.title;
  return (
    <>
      <HeaderComp className="containerDesktop">
        {data && (
          <>
            <HeadWrapper>
              <CardHeader>
                <LogoWrapper>
                  <Logo>
                    {logo === 'logo' && data.logo ? (
                      <Image
                        src={`${process.env.NEXT_PUBLIC_INTERNAL_BACKEND_URL}/public/${data.logo}`}
                        width={112}
                        height={112}
                        className="img-contain"
                        onError={() => {
                          setLogo('fallback');
                        }}
                        alt={
                          data.name
                            ? 'Icon of ' +
                              sectorT(
                                data?.name.toLowerCase().replaceAll(' ', '-')
                              ) +
                              ' sector'
                            : 'Logo of ' + data?.title
                        }
                      />
                    ) : (
                      <Image
                        src={
                          data?.name
                            ? `/assets/icons/Organisation.svg`
                            : Org_types.includes(
                                data?.organization_types.replaceAll('_', ' ')
                              )
                            ? `/assets/icons/Government.svg`
                            : `/assets/icons/Private.svg`
                        }
                        alt={
                          data.name
                            ? 'Icon of ' +
                              sectorT(
                                data?.name.toLowerCase().replaceAll(' ', '-')
                              ) +
                              ' sector'
                            : 'Logo of ' + data?.title
                        }
                        width={112}
                        height={112}
                        className="img-contain"
                        style={{ marginLeft: '-2px' }}
                      />
                    )}
                  </Logo>
                </LogoWrapper>
                <div className="onlyMobile">
                  <Heading as="h1" variant="h3">
                    <TruncateText linesToClamp={2}>{title}</TruncateText>
                  </Heading>
                </div>
              </CardHeader>
              <Details>
                <Head>
                  <div className="onlyDesktop">
                    <Heading as="h1" variant="h3">
                      <TruncateText linesToClamp={2}>{title}</TruncateText>
                    </Heading>
                  </div>

                  <ActionButtons>
                    <Share fluid />
                  </ActionButtons>
                </Head>
                <Desc>
                  <ShowMore
                    height={150}
                    openLabel="Read More"
                    closeLabel="Read Less"
                  >
                    <Text as={'p'}>{data?.description}</Text>
                  </ShowMore>
                  <Flex marginTop={'6px'} gap={'6px'}>
                    {data.contact_email ? (
                      <>
                        <Text as={'p'}>
                          <span>
                            {' '}
                            <Email size={20} />
                            <strong>{`${commonT(
                              'intro-card-email'
                            )}:  `}</strong>
                            <Link
                              underline="hover"
                              href={`mailto:${data.contact_email}`}
                              color={'var(--color-primary-01)'}
                            >
                              {data.contact_email
                                .replace('@', '[at]')
                                .replace('.', '[dot]')}
                            </Link>
                          </span>
                        </Text>
                      </>
                    ) : null}
                  </Flex>
                  {data.homepage ? (
                    <Flex marginTop={'8px'} gap={'6px'}>
                      <Text as={'p'}>
                        <span>
                          {' '}
                          <WebPage />
                          <strong>{`${commonT(
                            'intro-card-website'
                          )}:  `}</strong>
                          <Link
                            underline="hover"
                            href={data.homepage !== '' ? data.homepage : '#'}
                            external
                          >
                            <Text color={'var(--color-primary-01)'}>
                              {data.homepage !== '' ? data.homepage : ''}
                            </Text>
                          </Link>
                        </span>
                      </Text>
                    </Flex>
                  ) : (
                    <Flex flexDirection={'column'} marginTop={'8px'}>
                      <ul>
                        {data?.highlights?.map((highlightItem, index) => (
                          <li key={`HightLight ${index}`}>
                            <CheckmarkCircle fill="green" />
                            <Text> {highlightItem}</Text>
                          </li>
                        ))}
                      </ul>
                    </Flex>
                  )}
                </Desc>
              </Details>
            </HeadWrapper>
            <Card>
              {cards.map((card) => (
                <MiniCard key={commonT('intro-card-datasets')}>
                  <Heading variant="h4" as="span">
                    {Number(card.number).toLocaleString('en-US', {
                      minimumIntegerDigits: 2,
                      useGrouping: false,
                    })}
                  </Heading>
                  <Text variant="pt16b" color={'var(--text-light)'}>
                    {card.label}
                  </Text>
                </MiniCard>
              ))}
            </Card>
          </>
        )}
      </HeaderComp>
    </>
  );
};

export default IntroCard;

const HeaderComp = styled.div`
  color: var(--text-high);
  background-color: var(--color-white);
  max-width: 100%;
  padding-block: 32px;
  gap: 32px;

  > div {
    max-width: 1216px;
  }

  @media (max-width: 640px) {
    padding: 24px;
    width: 100%;
  }
`;

const HeadWrapper = styled.div`
  margin-top: 1rem;
  display: grid;
  align-items: flex-start;
  background-color: var(--color-white);
  gap: 24px;
  margin: auto;
  grid-template-columns: max-content 1fr;

  @media (max-width: 640px) {
    grid-template-columns: auto;
    gap: 8px;
  }
`;

const Head = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
  color: var(--color-primary-01);

  @media (max-width: 640px) {
    width: 100%;
    display: block;
  }

  .subscribe {
    padding: 8px 24px;
    gap: 4px;

    svg {
      transform: rotate(90deg);
    }
  }
`;

const LogoWrapper = styled.section`
  width: fit-content;
  padding: 32px;
  background-color: var(--color-primary-06);
  border-radius: 2px;
  border: 1px solid var(--color-gray-01);

  @media (max-width: 640px) {
    padding: 16px;
  }
`;

const Logo = styled.div`
  position: relative;
  width: 112px;
  height: 112px;

  @media (max-width: 640px) {
    width: 62px;
    height: 62px;
    margin-inline: auto;
  }
`;

const Details = styled.section`
  gap: 24px;
`;

const Desc = styled.div`
  margin-top: 24px;

  > div span {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
  }

  li {
    text-decoration: disc;
    display: flex;
    gap: 4px;
  }

  @media (max-width: 640px) {
    margin-top: 12px;
  }
`;

const Card = styled.div`
  margin: auto;
  gap: 32px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(150px, 100%), 1fr));
  margin-top: 32px;

  @media (max-width: 640px) {
    gap: 4px;
    display: flex;
    flex-direction: column;
    margin-top: 12px;
  }
`;

const MiniCard = styled.div`
  display: flex;
  flex-direction: column;
  padding: 8px;
  background-color: var(--color-primary-06);
  text-align: center;

  @media (max-width: 640px) {
    padding: 0;
    background-color: transparent;
    flex-direction: row;
    align-items: center;
    gap: 16px;

    > span:first-child {
      min-width: 20px;
      text-align: start;
    }
  }
`;
