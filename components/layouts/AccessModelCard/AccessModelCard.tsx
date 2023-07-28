import { Add, MoreSmallListVert, Remove, Wrench } from '@opub-icons/workflow';
import { Button } from 'components/actions';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { Heading } from '../Heading';
import { Link } from '../Link';
import { Text } from '../Text';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@radix-ui/react-collapsible';

import { S } from 'components/data/Cards/DatasetCard';
import { useConstants, useUserStore } from 'services/store';
import { capitalize, capitalizeFirstLetter, dateFormat } from 'utils/helper';
import { Flex } from '../FlexWrapper';
import { PDFViewer } from '../PDFViewer/PDFViewer';
import { TruncateText } from '../TruncateText';
import { ModelBanner } from './ModelBanner';
import { ResourceCard } from './ResourceCard';
import { HistoryWrapper } from 'components/pages/explorer/ExplorerInfo/DatasetAccessTab/HistroyWrapper';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';

import { ResetTokenWrapper } from 'components/pages/explorer/ExplorerInfo/DatasetAccessTab/ResetTokenWrapper';
import { useSession } from 'next-auth/react';

type Props = {
  // main data object
  data: any;

  // whether to pass custom actions element for top right section
  customActions?: React.ReactElement;

  // hide resources section
  noRes?: boolean;

  // is res collapsable open
  resOpen?: boolean;

  // setState function to handle resOpen
  setResOpen?: any;

  // whether to show resource action buttons
  resActions?: boolean;

  // are the terms accepted for this dataset access
  hasAgreed?: boolean;

  // are the terms accepted for this dataset access
  hideBanner?: boolean;

  request?: any;

  actionlist?: boolean;
};

export const AccessModelCard = React.memo(function AccessModelCardFn({
  data,
  customActions,
  resOpen,
  setResOpen,
  resActions,
  noRes = false,
  hasAgreed,
  hideBanner = false,
  request,
  actionlist,
}: Props) {
  const router = useRouter();
  const [isOpen, setisOpen] = React.useState(false);
  const [isLicenseOpen, setisLicenseOpen] = React.useState(false);
  const [isPolicyOpen, setisPolicyOpen] = React.useState(false);

  const user = useUserStore((e) => e.user);
  const damObj = data?.data_access_model;
  const resourceSet = data?.datasetaccessmodelresource_set;
  const requestSet = data?.datasetaccessmodelrequest_set;
  const formatColor = useConstants((e) => e.formatColor);
  const damIcons = useConstants((e) => e.damIcons);

  const { accepted_agreement } = data.agreements.length
    ? data.agreements[0]
    : { accepted_agreement: null };

  const durationFormat = useConstants((e) => e.durationFormat);
  const resList = !noRes
    ? React.useMemo(() => {
        return [...resourceSet].map((e) => {
          const request = requestSet[0];
          const currentResReq = request
            ? request.datarequest_set?.find(
                (el) => el.resource.id == e.resource.id && el
              )
            : null;
          return {
            ...e.resource,
            supported_formats: e.supported_formats,
            damResourceId: e.id,
            type: damObj.type,
            fields: e.fields,
            spec: currentResReq?.spec || null,
            damStatus: request && request.status,
            damReqId: request && request.id,
            damId: damObj.id,
            reject_reason: request && request.reject_reason,
            remaining_quota: request && request.remaining_quota,
            validity: request && request.validity,
            status: currentResReq?.status,
            resource_id: currentResReq?.id || '',
            dataset_model_id: data.id,
            sample_enabled: e.sample_enabled,
            sample_rows: e.sample_rows,
          };
        });
      }, [requestSet, resourceSet, damObj])
    : [];

  const { type, title, status } = data.data_access_model;
  const { data: session } = useSession();

  const approvedObj = {
    label: 'Show Distributions',
    action: setResOpen,
  };

  function getButtonState(session, type, hasAgreed) {
    if (type === 'OPEN') {
      return approvedObj;
    }

    if (type === 'REGISTERED') {
      if (session && hasAgreed && request?.is_valid) return approvedObj;
    }

    if (type === 'RESTRICTED') {
      if (session && hasAgreed && request?.status) {
        if (request?.status === 'APPROVED' && request?.is_valid)
          return approvedObj;
      }
    }
  }

  return (
    <article>
      <Card>
        <CardWrapper>
          <Header>
            <IconWrapper>
              <div>{damIcons[damObj.type]}</div>
              <div>
                <Heading
                  as="span"
                  variant="h4"
                  marginX={'auto'}
                  color={'var(--color-secondary-00)'}
                >
                  {data?.payment === null || data?.payment === undefined
                    ? 'Free'
                    : '₹' + data?.payment}
                </Heading>
              </div>
            </IconWrapper>
            <LeftSide>
              <Heading as="h3" variant="h6">
                {capitalize(damObj.type)} Access
              </Heading>
              <CardHeader>
                <Heading variant="h4" as="span">
                  <TruncateText linesToClamp={1}>
                    {capitalizeFirstLetter(data.title)}
                  </TruncateText>
                </Heading>
                <Flex>
                  {data.policy === null ? (
                    ''
                  ) : data?.policy?.remote_url === '' ? (
                    <>
                      <Link
                        as="button"
                        onClick={() => setisPolicyOpen(!isPolicyOpen)}
                        variant="pt16l"
                        underline="hover"
                        target="_blank"
                        title={data.policy.title}
                      >
                        Policy&nbsp;
                        <Text color={'var(--color-gray-04)'}>|</Text>&nbsp;
                      </Link>
                      <PDFViewer
                        label={'Policy'}
                        isOpen={isPolicyOpen}
                        setOpen={setisPolicyOpen}
                        link={`${process.env.NEXT_PUBLIC_BACKEND_URL}/public/${data.policy.file}`}
                      />
                    </>
                  ) : (
                    <Link
                      target="_blank"
                      href={data?.policy?.remote_url}
                      external
                      title={data.policy.title}
                    >
                      Policy&nbsp;
                      <Text color={'var(--color-gray-04)'}>|</Text>&nbsp;
                    </Link>
                  )}

                  <Link
                    as="button"
                    onClick={() => setisLicenseOpen(!isLicenseOpen)}
                    variant="pt16l"
                    underline="hover"
                    target="_blank"
                  >
                    {accepted_agreement
                      ? 'Agreement'
                      : data.data_access_model.license.short_name
                      ? data.data_access_model.license.short_name
                      : 'Licence'}
                  </Link>
                  <PDFViewer
                    label={
                      accepted_agreement
                        ? 'Agreement'
                        : data.data_access_model.license.short_name
                        ? data.data_access_model.license.short_name
                        : 'Licence'
                    }
                    isOpen={isLicenseOpen}
                    setOpen={setisLicenseOpen}
                    link={`${process.env.NEXT_PUBLIC_BACKEND_URL}/public/${
                      accepted_agreement ? accepted_agreement : damObj.contract
                    }`}
                  />
                </Flex>
              </CardHeader>
              <Content>
                <div className="onlyDesktop">
                  <TruncateText linesToClamp={5}>
                    <Text as="p" title={data.description}>
                      {data?.description}
                    </Text>
                  </TruncateText>
                </div>
                <Flex gap="8px" alignItems="center">
                  {data.resource_formats?.map(
                    (e, index) =>
                      e && (
                        <S.Tag
                          key={e + index}
                          color={formatColor[e] || 'var(--color-gray-04)'}
                        >
                          {e}
                        </S.Tag>
                      )
                  )}
                </Flex>
              </Content>
            </LeftSide>
          </Header>

          {data.description && (
            <div className="onlyMobile" style={{ width: '100%' }}>
              <TruncateText linesToClamp={4}>
                <Text as="p" title={data.description}>
                  {data?.description}
                </Text>
              </TruncateText>
            </div>
          )}

          <StatsWrapper>
            <TagsWrapper>
              <TagsHeader>
                <Flex justifyContent={'space-between'}>
                  <Heading as="span" variant="h6">
                    Key Highlights
                  </Heading>

                  {user.name &&
                    actionlist === true &&
                    (data?.datasetaccessmodelrequest_set?.length > 0 ||
                      getButtonState(session, type, hasAgreed)?.label ===
                        'Show Distributions') && (
                      <Navlinks>
                        <NavigationMenu.List>
                          <NavigationMenu.Item>
                            <Navitem as={NavigationMenu.Trigger}>
                              <MoreSmallListVert />
                            </Navitem>
                            <ContentList>
                              <ul>
                                <li>
                                  <HistoryWrapper
                                    data={data.datasetaccessmodelrequest_set}
                                  />
                                </li>

                                {getButtonState(session, type, hasAgreed)
                                  ?.label === 'Show Distributions' && (
                                  <li>
                                    <ResetTokenWrapper data={data} />
                                  </li>
                                )}
                              </ul>
                            </ContentList>
                          </NavigationMenu.Item>
                        </NavigationMenu.List>
                      </Navlinks>
                    )}
                </Flex>
              </TagsHeader>

              <div>
                <Tag>
                  <span>Users: </span>
                  {data.usage || 'N/A'}
                </Tag>
                {damObj.type.toLowerCase() !== 'open' && (
                  <Tag>
                    <span>Quota: </span>
                    {damObj?.subscription_quota}
                    {damObj.subscription_quota_unit != 'LIMITEDDOWNLOAD' &&
                      `/${
                        durationFormat[
                          damObj.subscription_quota_unit.toLowerCase()
                        ]
                      }`}
                  </Tag>
                )}
                {damObj.type.toLowerCase() !== 'open' && (
                  <Tag>
                    <span>Validity: </span>
                    <DamValidity>
                      {damObj.validation_unit?.toLowerCase() !== 'lifetime'
                        ? `${damObj.validation} ${capitalize(
                            damObj.validation_unit
                          )}(s)`
                        : `${capitalize(damObj.validation_unit)}`}
                    </DamValidity>
                  </Tag>
                )}
                <Tag>
                  <span>Rate Limit: </span>
                  {damObj?.rate_limit}
                  {damObj.rate_limit_unit
                    ? `/${damObj.rate_limit_unit.toLowerCase()}`
                    : ' - lifetime'}
                </Tag>
                <Tag>
                  <span>Published on: </span>
                  {dateFormat(damObj.issued)}
                </Tag>
                <Tag>
                  <span>Last Updated: </span>
                  {dateFormat(damObj.modified)}
                </Tag>

                {damObj.type.toLowerCase() !== 'open' &&
                requestSet[0]?.remaining_quota ? (
                  <Tag>
                    <span>Remaining Quota: </span>
                    {requestSet[0].remaining_quota}
                  </Tag>
                ) : null}
              </div>
            </TagsWrapper>
            {customActions ? (
              <>{customActions}</>
            ) : (
              <Button
                size="sm"
                kind="primary"
                as="a"
                fluid
                icon={<Wrench width={12} />}
                href={`/providers/${router.query.provider}/dashboard/data-access-model/${damObj.id}`}
              >
                Manage
              </Button>
            )}
          </StatsWrapper>
        </CardWrapper>
        {!noRes && (
          <Collapsible
            open={resOpen || isOpen}
            onOpenChange={() =>
              setResOpen ? setResOpen(!resOpen) : setisOpen(!isOpen)
            }
          >
            <StyledTrigger>
              <Text variant="pt14b">All Distributions</Text>
              <Add data-type="open" />
              <Remove data-type="close" />
            </StyledTrigger>
            <StyledContent>
              <>
                {resList.map((item, index) => (
                  <ResourceCard
                    hasAgreed={hasAgreed}
                    resActions={resActions}
                    key={item.id}
                    request={request?.is_valid}
                    data={{
                      ...item,
                      resourceId:
                        data.datasetaccessmodelresource_set[index].resource.id,
                      refetch: data.refetch,
                    }}
                  />
                ))}
              </>
            </StyledContent>
          </Collapsible>
        )}
      </Card>
      {!hideBanner &&
        (damObj.type === 'RESTRICTED' || damObj.type === 'REGISTERED') && (
          <BannerIconWrapper>
            <ModelBanner
              quotaReached={data.quotaReached}
              requestSet={requestSet}
              damObj={damObj}
              data={data}
            />
          </BannerIconWrapper>
        )}
    </article>
  );
});

const BannerIconWrapper = styled.div`
  svg {
    margin-bottom: auto;
    padding-top: 3px;
  }
`;

const Card = styled.div`
  border-radius: 4px;
  background-color: var(--color-white);
  box-shadow: var(--box-shadow);
  padding: 16px;

  @media (max-width: 640px) {
    padding: 12px;
    box-shadow: none;
    border: 1px solid var(--color-gray-02);
  }
`;

const DamValidity = styled.p`
  text-transform: none;
  font-weight: 400;
`;
const CardWrapper = styled.div`
  display: flex;
  gap: 16px;
  flex-grow: 1;

  border-bottom: 1px solid var(--color-gray-01);
  padding-bottom: 20px;

  @media (max-width: 680px) {
    flex-wrap: wrap;
  }

  > span,
  a {
    display: inline-block;
  }
`;

const IconWrapper = styled.div`
  border: 1px solid var(--color-gray-01);

  width: fit-content;
  height: fit-content;

  > div:first-of-type {
    background-color: var(--color-secondary-06);
    border-radius: 2px;
    padding: 24px 46px;
    display: flex;
    justify-content: center;
  }

  span {
    padding-block: 6px;
    text-align: center;
  }

  svg {
    fill: var(--color-secondary-01);
    width: 80px;
    margin-inline: auto;
  }

  @media (max-width: 640px) {
    /* width: 100%; */

    > div:first-of-type {
      padding: 16px 32px;
    }

    svg {
      width: 48px;
    }
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  flex-grow: 1;
  gap: 16px;
`;

const LeftSide = styled.div`
  flex-basis: 340px;
  display: flex;
  flex-direction: column;

  > h3 {
    color: var(--text-medium);
  }

  flex-grow: 1;

  a {
    display: block;
  }
`;

const CardHeader = styled.header`
  grid-column: 2/3;

  a {
    display: inline-block;
    color: var(--color-link);
    font-size: 1rem;
    font-weight: var(--font-normal);
  }

  button {
    font-size: 1rem;
    font-weight: var(--font-normal);
  }
`;

const Content = styled.div`
  grid-column: 1/3;
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 12px;
`;

const StatsWrapper = styled.div`
  min-width: 220px;

  padding-left: 16px;
  border-left: 1px solid var(--color-gray-01);

  @media (max-width: 680px) {
    flex-grow: 1;
    padding-left: 0;
    border-left: none;
  }

  > a,
  button {
    display: flex;
    margin-top: 12px;
    display: inline-block;
  }
`;

const TagsWrapper = styled.div`
  align-self: flex-end;
  width: 100%;

  > span {
    text-transform: uppercase;
    color: var(--text-light);
  }

  @media (max-width: 680px) {
    margin: 0;
  }
`;

const TagsHeader = styled.div`
  color: var(--color-gray-04);
  button {
    margin: 0;
    padding: 0;

    svg {
      width: 16px;
      height: 16px;
    }
  }
`;
const Tag = styled.div`
  font-weight: 400;
  line-height: 1.7;
  font-size: 0.875rem;
  text-transform: capitalize;
  white-space: nowrap;

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;

  span {
    font-weight: 700;
  }
`;

const StyledTrigger = styled(CollapsibleTrigger)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 16px;
  color: var(--text-medium);
  margin-top: 12px;

  [data-type='close'] {
    display: none;
  }

  &[data-state='open'] {
    [data-type='open'] {
      display: block;
    }

    [data-type='close'] {
      display: none;
    }
  }

  &[data-state='open'] {
    [data-type='open'] {
      display: none;
    }

    [data-type='close'] {
      display: block;
    }
  }
`;

const StyledContent = styled(CollapsibleContent)`
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Space = styled.div`
  padding: 10px;
`;

const Navitem = styled(NavigationMenu.Link)`
  all: unset;
  text-transform: capitalize;

  padding: 8px;
  align-items: center;
  display: flex;
  color: var(--text-high);
  transition: background-color 200ms ease;
  width: max-content;
  cursor: pointer;
  position: relative;
  font-weight: var(--font-bold);

  &:hover:not([aria-expanded]),
  &:focus-visible:not([aria-expanded]) {
    color: var(--color-white);

    &::before {
      content: '';
      width: 8px;
      height: 8px;
      border-radius: 100%;
      background-color: var(--color-white);
      position: absolute;
      left: 50%;
      margin-left: -4px;
      bottom: -2px;
      z-index: 100;
    }

    &.active {
      &::before {
        content: none;
      }
    }
  }

  &.active {
    box-shadow: inset 0 -2px 0 0 #fff;
    font-weight: 500;

    @media (max-width: 800px) {
      box-shadow: inset 3px 0 0 0 #fff;
    }
  }

  svg {
    fill: var(--color-black);
    pointer-events: none;
  }
`;

const enterFromRight = keyframes({
  from: { transform: 'translateX(200px)', opacity: 0 },
  to: { transform: 'translateX(0)', opacity: 1 },
});

const enterFromLeft = keyframes({
  from: { transform: 'translateX(-200px)', opacity: 0 },
  to: { transform: 'translateX(0)', opacity: 1 },
});

const exitToRight = keyframes({
  from: { transform: 'translateX(0)', opacity: 1 },
  to: { transform: 'translateX(200px)', opacity: 0 },
});

const exitToLeft = keyframes({
  from: { transform: 'translateX(0)', opacity: 1 },
  to: { transform: 'translateX(-200px)', opacity: 0 },
});

const ContentList = styled(NavigationMenu.Content)`
  @media (prefers-reduced-motion: no-preference) {
    animation-duration: 250ms;
    animation-timing-function: ease;
    &[data-motion='from-start'] {
      animation-name: ${enterFromLeft};
    }
    &[data-motion='from-end'] {
      animation-name: ${enterFromRight};
    }
    &[data-motion='to-start'] {
      animation-name: ${exitToLeft};
    }
    &[data-motion='to-end'] {
      animation-name: ${exitToRight};
    }
  }

  ul {
    position: absolute;
    top: 110%;
    right: 0;
    background-color: var(--color-background-lightest);
    border: 1px solid var(--color-gray-01);
    padding-block: 8px;
    width: max-content;
    border-radius: 4px;
    min-width: 210px;
    z-index: 200;

    /* &::before {
      content: '';
      display: inline-block;
      position: absolute;
      border-left: 14px solid transparent;
      border-right: 14px solid transparent;
      border-bottom: 17px solid var(--color-background-darkest);
      top: -15px;
      right: 5px;
    } */

    li {
      margin-top: 4px;
      transition: background-color 200ms ease;
      border-radius: 4px;
      span {
        max-width: 200px;
      }

      &:first-child {
        margin-top: 0;
      }

      &:hover {
        background-color: var(--color-primary-06);
      }
    }

    a,
    button {
      line-height: 1.5;
      padding: 10px 0 10px 16px;
      color: var(--text-high);
      fill: var(--text-high);
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      font-weight: 400;
    }
  }
`;

const Navlinks = styled(NavigationMenu.Root)`
  position: relative;

  > div > ul {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .invert-button-outline {
    border-color: var(--color-primary-06);
    color: var(--color-primary-06);
  }
  .invert-button {
    background-color: var(--color-primary-06);
    color: var(--color-primary-01);

    .submenu-logout {
      width: 100%;
    }
  }
`;
