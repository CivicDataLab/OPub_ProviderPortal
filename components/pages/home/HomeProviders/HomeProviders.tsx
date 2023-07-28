import { ArrowSize500 } from '@opub-icons/ui';
import { Data, Star, UserGroup } from '@opub-icons/workflow';
import { Button } from 'components/actions';
import { Loader } from 'components/common';
import { IconArrow } from 'components/icons';
import { CarouselMultiple, Heading, TruncateText } from 'components/layouts';
import { Flex } from 'components/layouts/FlexWrapper';
import { Link, NextLink } from 'components/layouts/Link';
import { Text } from 'components/layouts/Text';
import useTranslation from 'next-translate/useTranslation';
import Image from 'next/image';
import { useState } from 'react';
import styled from 'styled-components';
import { Org_types } from 'utils/government-entities';
import { useWindowSize } from 'utils/hooks';

const HomeProviders = ({ data }) => {
  const { t } = useTranslation('home');
  const windowSize = useWindowSize();
  const partnersData = [];

  data?.hits &&
    data.hits.map((item) => {
      partnersData.push({
        redirect_url: `/providers/${item?._source.org_title}_${item?._id}`,
        logo: item?._source?.logo,
        title: item?._source?.org_title,
        dataset_count: item?._source?.dataset_count,
        average_rating: item?._source?.average_rating,
        user_count: item?._source?.user_count,
        type: item?._source?.type,
      });
    });

  function ArrowKey(pos) {
    if (pos == 'back')
      return (
        <Arrow style={{ transform: 'scale(-1, 1)' }}>
          <IconArrow width={32} />
        </Arrow>
      );
    return (
      <Arrow>
        <IconArrow width={32} />
      </Arrow>
    );
  }

  return (
    <Wrapper>
      <>
        <div className="container">
          <Flex flexDirection={'column'} alignItems={'center'}>
            <Heading variant="h2" as="h2">
              {t('our-data-providers-1')}
              <Text color={'var(--color-secondary-01)'}>
                {t('our-data-providers-2')}
              </Text>
            </Heading>
            <Heading variant="h4" as="h3" color="var(--text-light)" mt="4px">
              {t('explore-the-organisations-sharing-data-on-this-platform')}
            </Heading>
          </Flex>
          {partnersData?.length > 0 ? (
            <CarouselMultiple
              prevBtn={ArrowKey('back')}
              nextBtn={ArrowKey('forward')}
              label="data providers list"
              hideButtons={windowSize.width < 480}
              showDots={windowSize.width < 480}
            >
              {partnersData?.map((partner, index) => (
                <div key={`number-slide${index}`}>
                  <NextLink href={partner.redirect_url}>
                    <ItemWrapper>
                      <ImageWrapper partner={partner} />
                      <Heading
                        variant="h4"
                        textAlign={'center'}
                        color="var(--text-high)"
                        as="h4"
                      >
                        <TruncateText linesToClamp={1}>
                          {partner?.title}
                        </TruncateText>
                      </Heading>
                      <Content>
                        <Stats>
                          <StatItem>
                            <Data color="var(--color-information)" size={24} />
                            <div>
                              <Text variant="pt16b" color="var(--text-high)">
                                {partner.dataset_count}
                              </Text>
                              <Text variant="pt14" color="var(--text-medium)">
                                {t('datasets-in-provider-card')}
                              </Text>
                            </div>
                          </StatItem>
                          <Separator />
                          <StatItem>
                            <UserGroup color="var(--color-success)" size={24} />
                            <div>
                              <Text variant="pt16b" color="var(--text-high)">
                                {partner.user_count}
                              </Text>
                              <Text variant="pt14" color="var(--text-medium)">
                                {t('consumers-in-provider-card')}
                              </Text>
                            </div>
                          </StatItem>
                          <Separator />
                          <StatItem>
                            <Star color="var(--color-warning)" size={24} />
                            <div>
                              <Text variant="pt16b" color="var(--text-high)">
                                {/* Format to 2 decimal, if required  */}
                                {Number(partner.average_rating)
                                  .toFixed(2)
                                  .replace(/[.,]00$/, '')}
                              </Text>
                              <Text variant="pt14" color="var(--text-medium)">
                                {t('ratings-in-provider-card')}
                              </Text>
                            </div>
                          </StatItem>
                        </Stats>
                      </Content>
                      <Explore className="explore-wrap">
                        {t('explore-provider')} <ArrowSize500 />
                      </Explore>
                    </ItemWrapper>
                  </NextLink>
                </div>
              ))}
            </CarouselMultiple>
          ) : (
            <LoaderComponent>
              <Loader />
            </LoaderComponent>
          )}
          <ProvidersWrapper>
            <NextLink href="/providers">
              <Button
                kind="primary"
                data-type="explore"
                size={windowSize.width > 480 ? 'md' : 'sm'}
              >
                {t('view-all-providers')}
              </Button>
            </NextLink>
          </ProvidersWrapper>
        </div>
      </>
    </Wrapper>
  );
};

export default HomeProviders;

function ImageWrapper({ partner }) {
  const [logo, setLogo] = useState('logo');

  return (
    <>
      {partner.logo && logo === 'logo' ? (
        <figure>
          <Image
            src={`${process.env.NEXT_PUBLIC_INTERNAL_BACKEND_URL}/public/${partner.logo}`}
            width={112}
            height={70}
            alt={`Logo of ${partner.title}`}
            title={`${partner.title}`}
            className="img-contain"
            onError={() => {
              setLogo('fallback');
            }}
          />
        </figure>
      ) : (
        <figure>
          <Image
            src={
              Org_types.includes(partner?.type.replaceAll('_', ' '))
                ? `/assets/icons/Government.svg`
                : `/assets/icons/Private.svg`
            }
            alt={`Logo of ${partner.title}`}
            width={112}
            height={70}
            className="img-contain"
            style={{ marginLeft: '-2px' }}
          />
        </figure>
      )}
    </>
  );
}

const Wrapper = styled.section`
  margin-top: 96px;

  h2 > span {
    font-weight: var(--font-bold);
  }

  @media (max-width: 640px) {
    margin-top: 40px;

    h3 {
      text-align: center;
    }
  }
`;

const LoaderComponent = styled.div`
  > div {
    height: 25vh;
  }
`;

const ProvidersWrapper = styled.div`
  margin-top: 20px;
  button {
    margin: auto;
  }
`;

const ItemWrapper = styled(Link)`
  text-decoration: none;

  display: flex;
  flex-direction: column;
  gap: 20px;

  width: 100%;
  border-radius: 4px;
  border: 1px solid transparent;
  box-shadow: var(--box-shadow);
  background-color: var(--color-background-lightest);
  padding: 20px;

  .explore-wrap {
    visibility: hidden;
  }

  &:hover,
  &:focus-visible {
    border-color: var(--color-primary-01);

    .explore-wrap {
      visibility: visible;
    }
  }

  figure {
    border-radius: 4px;
    filter: var(--drop-shadow);
    width: 100%;
    height: 112px;
    padding: 20px 32px;
    display: flex;
    justify-content: center;
  }

  @media (max-width: 640px) {
    gap: 12px;

    .explore-wrap {
      display: none;
    }
  }
`;

const Explore = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  align-self: flex-end;
`;

const Content = styled.div`
  max-width: 900px;

  > p {
    overflow: hidden;
    -webkit-line-clamp: 3;
    line-clamp: 3;
    -webkit-box-orient: vertical;
    display: -webkit-box;
  }

  > button {
    margin-top: 20px;
    align-self: flex-end;
  }
`;

const Stats = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  justify-content: space-evenly;

  @media (max-width: 640px) {
    gap: 8px;
  }
`;

const Arrow = styled.div`
  background-color: var(--color-primary-01);
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  fill: var(--text-high-on-dark);
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;

  span {
    display: block;
    text-align: center;
  }
`;

const Separator = styled.span`
  width: 1px;
  background-color: var(--color-gray-01);
  display: block;
`;
