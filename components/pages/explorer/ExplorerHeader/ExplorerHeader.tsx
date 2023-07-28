import { useMutation, useQuery } from '@apollo/client';
import {
  Answer,
  CheckmarkCircle,
  Info,
  Star,
  Subscribe,
} from '@opub-icons/workflow';
import { Button, Share } from 'components/actions';
import { S } from 'components/data/Cards/DatasetCard';
import HVD from 'components/icons/HVD';
import { Heading, ReadMore, Separator, Text } from 'components/layouts';
import { Flex } from 'components/layouts/FlexWrapper';
import { Link } from 'components/layouts/Link';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import {
  GET_USER_DATASET_SUBSCRIPTION,
  SUB_UNSUB_DATASET,
  mutation,
} from 'services';
import { useConstants, useUserStore } from 'services/store';
import styled from 'styled-components';
import { dateFormat, getDuration } from 'utils/helper';
import { CategoryTags } from '../common/CategoryTags';
import { accessModelMap } from '../explorer.helper';
import { InfoCard } from './InfoCard';
import { useWindowSize } from 'utils/hooks';

const ExplorerHeader: React.FC<{
  data: any;
  meta?: any;
  vizCompData?: any;
}> = ({ data, meta, vizCompData }) => {
  const user = useUserStore((e) => e.user);
  const { data: session } = useSession();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const GetSubscribeStatusRes = useQuery(GET_USER_DATASET_SUBSCRIPTION, {
    variables: { dataset_id: data.id },
    skip: !data.id,
  });

  const router = useRouter();
  const { width } = useWindowSize();

  useEffect(() => {
    if (GetSubscribeStatusRes.data?.user_dataset_subscription === null) {
      setIsSubscribed(false);
    } else if (
      GetSubscribeStatusRes.data?.user_dataset_subscription?.user ===
      user.username
    ) {
      setIsSubscribed(true);
    }
  }, [GetSubscribeStatusRes]);

  const [SubscribeReq, SubscribeRes] = useMutation(SUB_UNSUB_DATASET);

  const handleSubscribeBtnAction = () => {
    mutation(SubscribeReq, SubscribeRes, {
      subscribe_input: {
        action: isSubscribed ? 'UNSUBSCRIBE' : 'SUBSCRIBE',
        dataset_id: data.id,
      },
    })
      .then((res) => {
        if (res.subscribe_mutation?.success === true) {
          toast.success(
            isSubscribed
              ? 'Unsubscribed to dataset successfully'
              : 'Subscribed to dataset successfully'
          );
          setIsSubscribed(!isSubscribed);
        } else {
          toast.error('Subscription is not allowed on unpublished datasets');
        }
      })
      .catch(() => toast.error('Error while subscribing to dataset'));
  };

  const format: any = [
    ...new Set(
      vizCompData?.allRes?.map((item): string[] => {
        return item?.file_details?.format;
      }) || []
    ),
  ];
  const formatColor = useConstants((e) => e.formatColor);

  const getDatasetTimeLineInfo = () => {
    // let datasetTimelineInfo = { ...data };
    let datasetTimelineInfo = {
      ...(data?.published_date
        ? { 'Published on': dateFormat(data?.published_date) }
        : {}),

      Frequency: data?.update_frequency || '-',

      ...(data?.modified
        ? {
            'Last Updated': dateFormat(data?.modified),
          }
        : {}),

      'Data Duration':
        data?.period_from && (data?.period_to || data?.is_datedynamic)
          ? getDuration(
              data?.period_from,
              data?.is_datedynamic ? 'Till Date' : data?.period_to
            )
          : 'NA',
    };
    return datasetTimelineInfo;
  };

  function onSubscribe() {
    if (session) {
      !GetSubscribeStatusRes.loading && handleSubscribeBtnAction();
    } else {
      if (typeof window !== 'undefined') {
        signIn('keycloak', {
          callbackUrl: `${window.location.href}?clientLogin=true`,
        });
      }
    }
  }

  function subscribeBtnText() {
    if (GetSubscribeStatusRes.loading) {
      return 'Loading';
    } else if (isSubscribed) {
      return 'Unsubscribe';
    } else {
      return 'Subscribe';
    }
  }

  const RatingDownload = (
    <Flex alignItems="center" gap="8px">
      {data?.dataset_type !== 'EXTERNAL' && (
        <Text variant="pt14b" color="var(--text-medium)">
          {data?.download_count} Downloads
        </Text>
      )}
      {data?.average_rating ? (
        <S.Rating>
          <Star fill="var(--color-warning)" />
          <Text variant="pt14b" color="var(--text-medium)">
            {data?.average_rating.toPrecision(2)}
          </Text>
        </S.Rating>
      ) : null}
    </Flex>
  );

  return (
    <Wrapper id="explorer-header">
      <div className="container">
        <LeftContainer>
          <div className="left__container">
            <Flex gap="8px" flexWrap="wrap" justifyContent={'space-between'}>
              <CategoryTags categories={data?.sector.slice(0, 3)} />
              {data.hvd_rating >
                `${process.env.NEXT_PUBLIC_HVD_RATING_VALUE}` && <HVD />}
            </Flex>
            <HeaderWrapper>
              <Heading as={'h2'} variant="h3">
                {data?.title}
              </Heading>
              <Buttons>
                <Button
                  kind="secondary-outline"
                  icon={<Subscribe />}
                  className="subscribeBtn"
                  onPress={onSubscribe}
                  size="sm"
                >
                  {subscribeBtnText()}
                </Button>
                {data?.status === 'PUBLISHED' && (
                  <Share kind="secondary-outline" size="sm" fluid />
                )}
              </Buttons>
            </HeaderWrapper>
            <ProviderName>
              <span>
                <Text>By&nbsp;</Text>
                <Link
                  underline="never"
                  href={`/providers/${data?.organization?.title}_${data?.organization?.id}`}
                >
                  {data?.organization?.title}
                </Link>
              </span>
            </ProviderName>

            <Separator />
            <div>
              <ReadMore characterLimit={width < 640 ? 180 : 420}>
                {data?.description}
              </ReadMore>
            </div>

            {data?.highlights?.length > 0 && (
              <HighlightWrapper>
                {data?.highlights.map((e, index) => (
                  <Flex key={e + index} gap="4px" alignItems="center">
                    <CheckmarkCircle fill="var(--color-success)" />
                    <Text variant="pt14b" title={e}>
                      {e}
                    </Text>
                  </Flex>
                ))}
              </HighlightWrapper>
            )}
            <Separator />
          </div>
          <DamData>
            {Object.keys(getDatasetTimeLineInfo()).map((key, index) => (
              <DatasetTimelineInfo key={`${key}-${index}`}>
                <Text variant={'pt14b'}>{key}:</Text>
                <Text
                  variant={'pt14'}
                  textAlign={'right'}
                  alignSelf={'flex-end'}
                >{`${getDatasetTimeLineInfo()[key]}`}</Text>
              </DatasetTimelineInfo>
            ))}
          </DamData>
          <FormatWrapper>
            <Flex
              flexWrap="wrap"
              gap="8px"
              alignItems="center"
              justifyContent="space-between"
            >
              {data?.dataset_type !== 'EXTERNAL' ? (
                <>
                  <Separator />
                  <Flex gap="8px" alignItems="center" flexWrap="wrap">
                    {format?.map(
                      (e, index) =>
                        e && (
                          <S.Tag
                            key={e + index}
                            color={formatColor[e] || 'var(--color-warning)'}
                          >
                            {e}
                          </S.Tag>
                        )
                    )}
                  </Flex>
                </>
              ) : (
                <>
                  <Separator />
                  <Flex alignItems="center">
                    <S.Tag color={'var(--color-white)'}>External</S.Tag>
                    <ExternalMessage>
                      <Button
                        kind="custom"
                        title="This dataset is not available on IDP and can be accessed from an external website."
                      >
                        <Info fill="var(--text-light)" />
                      </Button>
                    </ExternalMessage>
                  </Flex>
                </>
              )}
              <div className="onlyDesktop">{RatingDownload}</div>
            </Flex>
          </FormatWrapper>
          <div className="onlyMobile">
            <Separator />
            <MobileFooter>
              <button
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    router.push({
                      pathname: `/connect-with-idp`,
                      query: {
                        datasetURL: `${window.location.origin}/datasets/${router.query.explorer}`,
                        providerID: data.organization.id,
                      },
                    });
                  }
                }}
              >
                <Answer color="var(--text-medium)" />
                <Heading variant="h5" as="h2">
                  Support
                </Heading>
              </button>
              <span>{RatingDownload}</span>
            </MobileFooter>
          </div>
        </LeftContainer>

        <RightContainer>
          <InfoCard
            dataAccessModelInfo={accessModelMap(data)}
            datasetTimelineInfo={getDatasetTimeLineInfo()}
            highlights={data.highlights}
            data={data}
          />
        </RightContainer>
      </div>
    </Wrapper>
  );
};

export default ExplorerHeader;

const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 24px;
  flex-wrap: wrap;
`;

const Buttons = styled.div`
  display: flex;
  gap: 16px;

  > * {
    flex-grow: 1;
    justify-content: center;
    width: 50%;

    > div {
      width: 100%;
    }
  }

  @media (max-width: 640px) {
    width: 100%;
  }
`;

const ProviderName = styled.div`
  @media (max-width: 640px) {
    margin-top: 8px;
  }
`;

const ExternalMessage = styled.div`
  color: var(--text-light);
`;

const Wrapper = styled.div`
  padding-top: 32px;
  background-color: var(--color-white);

  > .container {
    display: flex;
    justify-content: space-between;
    gap: 40px;

    @media (max-width: 720px) {
      flex-wrap: wrap;
    }
  }

  .left__container {
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 20px;

    > div:first-of-type {
      flex-wrap: wrap;
      gap: 16px;
      svg {
        margin-top: 8px;
      }
    }

    @media (max-width: 640px) {
      gap: 12px;
    }
  }

  .subscribeBtn {
    height: fit-content;
    text-align: center;
    font-weight: var(--font-bold);
    text-transform: capitalize;

    svg {
      margin-top: -3px;
    }

    &:hover,
    &:focus-visible {
      background-color: var(--color-secondary-05);
    }
  }

  @media (max-width: 640px) {
    padding-top: 16px;
  }
`;

const FormatWrapper = styled.div`
  > div {
    padding-block: 8px;
  }
  > div > div > span {
    padding-left: 8px;
    border-left: 1px solid var(--color-gray-01);
  }
`;

const LeftContainer = styled.div`
  flex: 1 1 60%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const RightContainer = styled.div`
  flex: 1 1 20%;
  width: 100%;
  min-width: 330px;

  @media (max-width: 640px) {
    display: none;
  }
`;

const DatasetTimelineInfo = styled.div`
  display: flex;
  gap: 28px;
  > span {
    min-width: 98px;
    display: block;
    text-align: inherit;
  }
`;

const DamData = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  margin-block: 16px;

  @media screen and (max-width: 920px) {
    grid-template-columns: none;
  }

  @media (max-width: 640px) {
    margin-block: 12px;
  }
`;

const HighlightWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-block: 4px;

  svg {
    min-width: 16px;
  }
  @media screen and (max-width: 1120px) {
    svg {
      margin-top: 4px;
      margin-bottom: auto;
    }
  }
`;

const MobileFooter = styled.div`
  padding-block: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;

  > button {
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--text-medium);
  }

  > span {
    padding-left: 8px;
    border-left: 1px solid var(--color-gray-01);
  }
`;
