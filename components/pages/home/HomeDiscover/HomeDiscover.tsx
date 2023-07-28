import React from 'react';
import Image from 'next/image';
import styled from 'styled-components';
import {
  CarouselMultiple,
  Heading,
  Separator,
  TruncateText,
} from 'components/layouts';
import { Link, NextLink } from 'components/layouts/Link';
import { Text } from 'components/layouts/Text';
import { Flex } from 'components/layouts/FlexWrapper';
import useTranslation from 'next-translate/useTranslation';
import { toCamelCase } from 'utils/helper';

const HomeDiscover = ({ featuredDatasets }) => {
  const { t } = useTranslation('home');
  const featuredData = [];
  const [logo, setLogo] = React.useState('logo');

  featuredDatasets?.hits?.hits &&
    featuredDatasets.hits.hits.map((item) => {
      featuredData.push({
        text: item?._source?.dataset_title,
        link: `/datasets/${item?._source?.slug}`,
        image: (
          <Image
            src={`/assets/icons/${
              item?._source?.sector[0]
                ? toCamelCase(item?._source?.sector[0])
                : 'Other'
            }.svg`}
            width={32}
            height={32}
            alt={`Icon of ${item?._source?.sector[0]} sector`}
            onError={() => {
              setLogo('fallback');
            }}
          />
        ),
        downloads: item?._source?.download_count,
        org: item?._source?.org_title,
        sector: item?._source?.sector[0],
      });
    });

  return (
    <Wrapper className="container">
      <Flex alignItems={'center'} flexDirection={'column'}>
        <Heading variant="h2" as="h2">
          {t('discover-consumer-trends-1')}
          <Text color={'var(--color-secondary-01)'}>
            {t('discover-consumer-trends-2')}
          </Text>
        </Heading>
        <Heading variant="h4" as="h3" color="var(--text-light)" mt="8px">
          {t('explore-data-and-ap-is-in-high-demand')}
        </Heading>
      </Flex>
      <ul>
        {featuredData.map((item, index) => (
          <Card key={`FeaturedItem-${index}`}>
            <NextLink href={item.link}>
              <Link underline="never" color="var(--text-high)">
                <Heading variant="h4" as="h3">
                  <TruncateText linesToClamp={2}>{item.text}</TruncateText>
                </Heading>
                <Flex gap="4px">
                  <Text variant="pt14" as="h4">
                    By
                  </Text>
                  <Text
                    color={'var(--color-primary-01)'}
                    variant="pt14b"
                    as={'h4'}
                  >
                    {item.org}
                  </Text>
                </Flex>
                <Separator className="home-separator" />
                <CardMeta title={item.sector}>
                  <div>
                    {logo === 'logo' ? (
                      item.image
                    ) : (
                      <Image
                        src={`/assets/icons/Organisation.svg`}
                        alt={`Icon of ${item.sector} sector`}
                        width={20}
                        height={20}
                        style={{ marginLeft: '-2px' }}
                      />
                    )}
                  </div>
                  <Heading as="span" variant="h5">
                    {t('downloads-count-in-card', {
                      count: item.downloads,
                    })}
                  </Heading>
                </CardMeta>
              </Link>
            </NextLink>
          </Card>
        ))}
      </ul>
      <MobileList>
        <CarouselMultiple label="Sector List" hideButtons showDots>
          {featuredData.map((item, index) => (
            <div key={`FeaturedItem-${index}`}>
              <Card as="div">
                <NextLink href={item.link}>
                  <Link underline="never" color="var(--text-high)">
                    <Heading variant="h4" as="h3">
                      <TruncateText linesToClamp={2}>{item.text}</TruncateText>
                    </Heading>
                    <Flex gap="4px">
                      <Text variant="pt14" as="h4">
                        By
                      </Text>
                      <Text
                        color={'var(--color-primary-01)'}
                        variant="pt14b"
                        as={'h4'}
                      >
                        {item.org}
                      </Text>
                    </Flex>
                    <Separator className="home-separator" />
                    <CardMeta title={item.sector}>
                      <div>
                        {logo === 'logo' ? (
                          item.image
                        ) : (
                          <Image
                            src={`/assets/icons/Organisation.svg`}
                            alt={`Icon of ${item.sector} sector`}
                            width={20}
                            height={20}
                            style={{ marginLeft: '-2px' }}
                          />
                        )}
                      </div>
                      <Heading as="span" variant="h5">
                        {t('downloads-count-in-card', {
                          count: item.downloads,
                        })}
                      </Heading>
                    </CardMeta>
                  </Link>
                </NextLink>
              </Card>
            </div>
          ))}
        </CarouselMultiple>
      </MobileList>
    </Wrapper>
  );
};

export default HomeDiscover;

const Wrapper = styled.section`
  margin-top: 82px;

  h2 > span {
    font-weight: var(--font-bold);
    height: 48px;
  }

  ul {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(320px, 100%), 1fr));
    gap: 24px;
    margin-top: 40px;
  }

  @media (max-width: 640px) {
    margin-top: 32px;

    ul {
      margin-top: 12px;
      display: none;
    }
  }
`;

const Card = styled.li`
  background-color: var(--color-white);
  border-radius: 4px;
  box-shadow: var(--box-shadow);
  border: 2px solid var(--color-gray-01);
  height: 100%;

  h3 {
    min-height: 64px;
  }

  .home-separator {
    margin-top: 16px;
    margin-bottom: 12px;
  }

  a {
    padding: 16px;
    display: grid;
    height: 100%;
  }
  &:hover,
  &:focus-visible {
    border-color: var(--color-primary-01);
  }
`;

const CardMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  border-radius: 2px;

  > div:first-child {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  span {
    color: var(--text-light);
  }
`;

const MobileList = styled.div`
  display: none;

  @media (max-width: 640px) {
    display: block;
  }
`;
