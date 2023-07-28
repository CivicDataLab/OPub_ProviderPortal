import { CheckmarkCircle, Info, LinkNav, Star } from '@opub-icons/workflow';
import Button from 'components/actions/Button';
import HVD from 'components/icons/HVD';
import { Heading, Text, TruncateText } from 'components/layouts';
import { Flex } from 'components/layouts/FlexWrapper';
import { Link, NextLink } from 'components/layouts/Link';
import Image from 'next/image';
import React from 'react';
import { useConstants } from 'services/store';
import styled from 'styled-components';
import { capitalize, dateFormat, getDuration } from 'utils/helper';
import { S } from './index';
import { accessModelMap } from 'components/pages/explorer/datasetcard.helper';
import { Org_types } from 'utils/government-entities';
import { DatasetCollapse } from './DatasetCollapse';

const DatasetCard: React.FC<{ datapackage: any }> = ({ datapackage }) => {
  const damData =
    datapackage.datasetaccessmodel_set.length > 0 &&
    accessModelMap(datapackage?.datasetaccessmodel_set);

  const formatColor = useConstants((e) => e.formatColor);

  const [logo, setLogo] = React.useState('logo');

  const damIcons = useConstants((e) => e.damIcons);
  const isHighValueDataset =
    datapackage.hvd_rating > process.env.NEXT_PUBLIC_HVD_RATING_VALUE;

  const Description = (
    <S.Description>
      <DescriptionWrapper>
        <Text as="p" variant="pt14" color="var(--text-medium)">
          <TruncateText linesToClamp={3}>
            {datapackage.description}
          </TruncateText>
        </Text>
      </DescriptionWrapper>
      <Meta>
        {datapackage.published && (
          <div>
            <Text variant="pt14b">Published on:</Text>
            <Text variant="pt14" textAlign={'right'}>
              {dateFormat(datapackage.published)}
            </Text>
          </div>
        )}
        {datapackage.metadata_modified && (
          <div>
            <Text variant="pt14b">Last Updated:</Text>
            <Text variant="pt14" textAlign={'right'}>
              {dateFormat(
                datapackage.frequency === 'Daily'
                  ? new Date().toISOString()
                  : datapackage.metadata_modified
              )}
            </Text>
          </div>
        )}
        {datapackage.frequency && (
          <div>
            <Text variant="pt14b">Frequency:</Text>
            <Text variant="pt14" textAlign={'right'}>
              {datapackage.frequency}
            </Text>
          </div>
        )}
        <div>
          <Text variant="pt14b">Duration: </Text>
          <Text variant="pt14" textAlign={'right'}>
            {datapackage.period_from && datapackage.period_to
              ? getDuration(datapackage.period_from, datapackage.period_to)
              : 'NA'}
          </Text>
        </div>
      </Meta>
      <FormatWrapper>
        <Flex
          flexWrap="wrap"
          gap="8px"
          alignItems="center"
          justifyContent="space-between"
        >
          {datapackage.type !== 'EXTERNAL' ? (
            <Flex gap="8px" alignItems="center" flexWrap="wrap">
              {datapackage?.format?.map(
                (e, index) =>
                  e && (
                    <S.Tag
                      key={e + index}
                      color={formatColor[e] || 'var(--color-gray-05)'}
                    >
                      {e}
                    </S.Tag>
                  )
              )}
            </Flex>
          ) : (
            <Flex gap="8px" alignItems="center">
              <S.Tag color={'var(--color-white)'}>External</S.Tag>
            </Flex>
          )}
          <Flex alignItems="center" gap="8px">
            {datapackage.rating ? (
              <S.Rating title="Average rating of this dataset">
                <Star fill="#DBA846" />
                <Text variant="pt14b" color="var(--text-medium)">
                  {datapackage.rating.toPrecision(2)}
                </Text>
              </S.Rating>
            ) : null}
            {datapackage.type !== 'EXTERNAL' && (
              <Text variant="pt14b" color="var(--text-medium)">
                {datapackage.downloads} Downloads
              </Text>
            )}
          </Flex>
        </Flex>
      </FormatWrapper>
    </S.Description>
  );

  const Metadata = (
    <S.Metadata>
      <div>
        <Flex gap="4px" flexWrap={'wrap'}>
          {datapackage.type !== 'EXTERNAL' ? (
            <Heading as="span" variant="h6">
              DATASET ACCESS MODELS
            </Heading>
          ) : (
            <Heading as="span" variant="h6">
              EXTERNAL ACCESS
            </Heading>
          )}
        </Flex>
        {datapackage.type !== 'EXTERNAL' ? (
          <Flex flexDirection="column" gap="12px" marginTop={'8px'}>
            {datapackage.datasetaccessmodel_set.length > 0 &&
              Object?.keys(damData?.damObjCount)
                .reverse()
                .map((item, index) =>
                  damData?.damObjCount?.[item] !== 0 ? (
                    <DamCards
                      isActive={`${item}` === 'Open'}
                      key={`DAMCard-${index}`}
                    >
                      <IconWrapper>
                        {damIcons[`${item}`.toUpperCase()]}
                      </IconWrapper>
                      <Flex flexDirection={'column'} marginY={'auto'}>
                        <NextLink
                          key={item}
                          href={{
                            pathname: `/datasets/${datapackage.slug}`,
                            query: {
                              tab: 'data-access-model',
                              jump: 'explorer-tab-container',
                            },
                          }}
                        >
                          <Link
                            underline="false"
                            variant="pt12"
                            color="var(--color-secondary-00)"
                          >
                            {` ${damData?.damObjCount[item]} ${capitalize(
                              item
                            )} Access`}
                          </Link>
                        </NextLink>
                        {item !== 'open' && (
                          <Text
                            variant="pt12"
                            color="var(--color-secondary-00)"
                          >
                            {damData.pricing[item].length > 1
                              ? 'Price Starts at'
                              : 'Priced at'}
                            &nbsp;
                            {'₹' + Math.min(...damData.pricing[item])}
                          </Text>
                        )}
                      </Flex>
                    </DamCards>
                  ) : (
                    <DisabledDamCards key={`DisabledDAMCard-${index}`}>
                      <DisableIconWrapper>
                        {damIcons[`${item}`.toUpperCase()]}
                      </DisableIconWrapper>
                      <Flex flexDirection={'column'} marginY={'auto'}>
                        <Link
                          underline="false"
                          variant="pt12"
                          color="var(--color-gray-03)"
                        >
                          {`  ${capitalize(item)} Access`}
                        </Link>
                      </Flex>
                    </DisabledDamCards>
                  )
                )}
          </Flex>
        ) : (
          <div>
            <NextLink
              href={{
                pathname: `/datasets/${datapackage.slug}`,
                query: {
                  tab: 'data-apis',
                  jump: 'explorer-tab-container',
                },
              }}
            >
              <Link
                underline="false"
                variant="pt12"
                color="var(--color-secondary-00)"
              >
                <ExternalCard>
                  <LinkNav color={'var(--color-secondary-00)'} />
                  <Text variant="pt14b" color={'var(--color-secondary-00)'}>
                    {datapackage?.resource_count} External Links
                  </Text>
                </ExternalCard>
              </Link>
            </NextLink>

            <ExternalMessageCard>
              <Info width={24} fill="var(--text-light)" />
              <Text variant="pt14" color={'var(--text-high)'}>
                This dataset is not available on IDP. Please go to &apos;View
                Dataset&apos; below to access it from an external website.
              </Text>
            </ExternalMessageCard>
          </div>
        )}
        <Highlights>
          {datapackage.highlights &&
            datapackage.highlights.map((e, index) => (
              <HighlightWrapper title={e} key={e + index}>
                <Flex gap="4px" alignItems="center">
                  <CheckmarkCircle width={16} fill="var(--color-success)" />
                  <Text variant="pt14b">{e}</Text>
                </Flex>
              </HighlightWrapper>
            ))}
        </Highlights>
      </div>
      <ExploreButton>
        <Button href={`/datasets/${datapackage.slug}`} as="a" size="sm" fluid>
          View Dataset
        </Button>
      </ExploreButton>
    </S.Metadata>
  );

  return (
    <S.Wrapper className={isHighValueDataset ? 'isHVD' : ''}>
      <S.Content>
        {isHighValueDataset && (
          <HvdWrapper>
            <HVD />
          </HvdWrapper>
        )}
        <S.Header>
          <NextLink
            href={`/providers/${datapackage?.organization?.name}_${datapackage?.organization?.id}`}
          >
            <S.Logo>
              {logo === 'logo' ? (
                <Image
                  src={`${process.env.NEXT_PUBLIC_INTERNAL_BACKEND_URL}/public/${datapackage.organization.image_url}`}
                  width={80}
                  height={80}
                  className="img-contain"
                  alt={`Logo of ${datapackage.organization.title}`}
                  onError={() => setLogo('fallback')}
                />
              ) : (
                <Image
                  src={
                    Org_types.includes(
                      datapackage?.organization?.type.replaceAll('_', ' ')
                    )
                      ? `/assets/icons/Government.svg`
                      : `/assets/icons/Private.svg`
                  }
                  alt={`Logo of ${datapackage.organization.title}`}
                  width={80}
                  height={80}
                  className="img-contain"
                  style={{ marginLeft: '-2px' }}
                />
              )}
            </S.Logo>
          </NextLink>
          <S.Title>
            <div>
              <SectorContainer>
                {datapackage.sector.slice(0, 3).map((sector, index) => (
                  <NextLink key={sector + index} href={`/sectors/${sector}`}>
                    <Link variant="pt12" underline="hover">
                      {sector}
                    </Link>
                  </NextLink>
                ))}
              </SectorContainer>

              <NextLink href={`/datasets/${datapackage.slug}`}>
                <a>
                  <Heading as="h3" mt="4px" variant="h5">
                    {datapackage.title}
                  </Heading>
                </a>
              </NextLink>
            </div>
            <S.HeaderMeta>
              <Text variant="pt14">
                By{' '}
                <Link
                  href={`/providers/${datapackage?.organization?.name}_${datapackage?.organization?.id}`}
                  underline="hover"
                  variant="pt14"
                >
                  {datapackage?.organization?.title || ''}
                </Link>
              </Text>
            </S.HeaderMeta>
          </S.Title>
        </S.Header>

        <MobileContent>
          <DatasetCollapse
            content={
              <div>
                {Description}
                {Metadata}
              </div>
            }
          />
        </MobileContent>
        <DesktopContent>{Description}</DesktopContent>
      </S.Content>
      <DesktopContent className={isHighValueDataset ? 'isHVD' : ''}>
        {Metadata}
      </DesktopContent>
    </S.Wrapper>
  );
};

export default DatasetCard;

const SectorContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;

  @media (max-width: 640px) {
    display: none;
  }
`;

const Highlights = styled.div`
  margin-block: 20px;
  word-break: break-word;

  div:first-of-type {
    margin-bottom: 4px;
  }

  @media (max-width: 640px) {
    margin-block: 8px;
  }
`;

const ExternalCard = styled.div`
  border: 2px solid var(--color-gray-02);
  background-color: var(--color-white);
  display: flex;
  gap: 12px;
  padding: 8px;
  margin-top: 8px;
  margin-bottom: 12px;
`;

const ExternalMessageCard = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 28px;
  flex-basis: 250px;

  > svg {
    margin-top: 3px;
    margin-bottom: auto;
    min-width: 18px;
  }

  @media (max-width: 640px) {
    margin-bottom: 0px;
  }
`;

const HighlightWrapper = styled.div`
  svg {
    min-width: 16px;
  }

  span {
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    text-overflow: ellipsis;
  }
`;

const HvdWrapper = styled.div`
  position: absolute;
  top: 12px;
  right: -10px;

  @media (max-width: 640px) {
    top: 8px;
  }

  @media screen and (max-width: 920px) {
    padding-bottom: 0px;
  }
`;

const DescriptionWrapper = styled.div`
  border-bottom: 1px solid var(--color-gray-01);
  padding-block: 16px;

  @media (max-width: 640px) {
    padding-block: 8px;
  }
`;

const FormatWrapper = styled.div`
  margin-top: 16px;
  border-top: 1px solid var(--color-gray-01);

  > div {
    padding-block: 8px;
  }

  > div > div > span {
    padding-left: 8px;
    border-left: 1px solid var(--color-gray-01);
  }

  @media (max-width: 640px) {
    margin-top: 8px;
  }
`;

const IconWrapper = styled.div`
  svg {
    fill: var(--color-secondary-00);
    width: 32px;
    display: block;
    margin: 8px;
  }
`;

const DisableIconWrapper = styled.div`
  svg {
    fill: var(--color-gray-03);
    width: 32px;
    display: block;
    margin: 8px;
  }
`;

const DamCards = styled.div<any>`
  display: flex;
  gap: 12px;
  border: 1px solid var(--color-gray-02);
  background-color: ${(props) =>
    props.isActive ? 'var(--color-white)' : 'var(--color-secondary-06)'};
`;

const DisabledDamCards = styled.div`
  display: flex;
  gap: 12px;
  border: 1px solid var(--color-gray-02);
  background-color: 'var(--color-gray-02)';
`;

const ExploreButton = styled.div`
  a {
    width: 100%;
  }
`;

const Meta = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding-top: 16px;
  justify-content: space-between;
  gap: 4px;

  > div {
    flex: 1;
    flex-basis: 47%;
    display: flex;
    flex-grow: 1;

    &:nth-of-type(even) {
      justify-content: flex-end;
      margin-left: 12px;
    }

    > span {
      &:first-of-type {
        flex-basis: 100px;
        text-align: start;
      }

      &:last-of-type {
        flex-basis: 120px;
      }
    }
  }

  @media (max-width: 640px) {
    padding-top: 8px;

    > div {
      flex-basis: 100%;
      justify-content: space-between;
      flex-grow: 1;

      &:nth-of-type(even) {
        justify-content: space-between;
        margin-left: 0;
      }
    }
  }
`;

const DesktopContent = styled.div`
  display: block;

  &.isHVD {
    padding-top: 32px;
  }

  @media (max-width: 640px) {
    display: none;
    padding-top: 0;
  }

  &:first-of-type {
    flex-basis: 250px;
  }
`;

const MobileContent = styled.div`
  display: none;

  @media (max-width: 640px) {
    display: block;
  }
`;
