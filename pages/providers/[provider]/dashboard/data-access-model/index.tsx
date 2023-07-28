import { useQuery } from '@apollo/client';
import { DashSize400 } from '@opub-icons/ui';
import {
  Add,
  Copy,
  LockClosed,
  LockOpen,
  Login,
  Wrench,
} from '@opub-icons/workflow';
import { Button } from 'components/actions';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from 'components/actions/Accordian/Accordian';
import InfoTags from 'components/actions/InfoTags';
import { Loader } from 'components/common';
import { DashboardHeader, Heading, NoResult, Text } from 'components/layouts';
import { Flex } from 'components/layouts/FlexWrapper';
import { Link, NextLink } from 'components/layouts/Link';
import { Tooltip } from 'components/overlays';
import { LinkButton } from 'components/pages/dashboard/helpers';
import { MainWrapper } from 'components/pages/user/Layout';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { ORG_DATA_ACCESS_MODELS } from 'services';
import { useProviderStore } from 'services/store';
import styled from 'styled-components';
import { truncate } from 'utils/helper';
import { platform_name } from 'platform-constants';

const DataAccessModelListing = () => {
  const org = useProviderStore((e) => e.org);
  const router = useRouter();

  const [currentAccordion, setCurrentAccordion] = useState('custom');

  const modelsList = useQuery(ORG_DATA_ACCESS_MODELS, {
    variables: { organization_id: org?.org_id },
    skip: !org?.org_id,
  });

  const typeObj = {
    OPEN: {
      icon: <LockOpen width={64} />,
      label: 'Publicly Available',
    },
    RESTRICTED: {
      icon: <LockClosed width={64} />,
      label: 'Request Data Access',
    },
    REGISTERED: {
      icon: <Login width={64} />,
      label: 'Registered Access',
    },
  };

  const Card = ({ data }) => {
    const isDisabled = data.status === 'DISABLED';
    return (
      <CardWrapper>
        <LeftSide>
          <IconWrapper>{typeObj[data.type].icon}</IconWrapper>
          <CardHeader>
            <Heading variant="h3" as="h2">
              {data.title}
            </Heading>
          </CardHeader>
          <Content>
            <Text>{data.description}</Text>
            <NextLink
              href={
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/download/contract/${data.id}` ||
                '#'
              }
            >
              <Link target="_blank">Terms and Conditions</Link>
            </NextLink>
          </Content>
        </LeftSide>
        <StatsWrapper>
          <TagsWrapper>
            {data.is_global && (
              <InfoTags
                variant="success"
                statusName={'Default Access Model'.toUpperCase()}
              />
            )}
            <Tag>
              <span>Active Users: </span>
              {data.active_users}
            </Tag>
            <Tag>
              <span>Type: </span>
              {data.type || 'N/A'}
            </Tag>
            <Tag>
              <span>License: </span>
              {truncate(data?.license?.title, 20) || 'N/A'}
            </Tag>

            <Tag>
              <span>Rate: </span>
              {data?.rate_limit}
              {`/${data.rate_limit_unit.toLowerCase()}`}
            </Tag>
            {data?.subscription_quota && (
              <Tag>
                <span>Quota: </span>
                {data?.subscription_quota}
                {data.subscription_quota_unit !== 'LIMITEDDOWNLOAD' &&
                  `/${data.subscription_quota_unit.toLowerCase()}`}
              </Tag>
            )}
            <Flex gap={'5px'} flexDirection={'column'} marginTop="5px">
              {data.is_global !== true && (
                <Tooltip mode="dark" disabled={!isDisabled}>
                  <Button
                    fluid
                    size="sm"
                    kind="primary"
                    isDisabled={isDisabled}
                    as="a"
                    icon={<Wrench width={12} />}
                    href={`/providers/${router.query.provider}/dashboard/data-access-model/${data.id}`}
                  >
                    Manage
                  </Button>
                  <span>{isDisabled ? 'Access Model is disabled' : null}</span>
                </Tooltip>
              )}
              {data.is_global === true && isDisabled && (
                <Tag>{data?.status.toLowerCase()}</Tag>
              )}
              <Button
                fluid
                size="sm"
                kind="primary-outline"
                as="a"
                icon={<Copy width={12} />}
                onPress={() => {
                  router.push(
                    `/providers/${router.query.provider}/dashboard/data-access-model/${data.id}?clone=true`
                  );
                }}
              >
                Clone
              </Button>
            </Flex>
          </TagsWrapper>
        </StatsWrapper>
      </CardWrapper>
    );
  };

  const list = modelsList?.data?.org_data_access_models;

  return (
    <MainWrapper fullWidth>
      <Head>
        <title>Access Models | {platform_name} (IDP)</title>
      </Head>
      <Wrapper>
        <DashboardHeader>
          <Heading variant="h3" as={'h1'}>
            Access Models
          </Heading>
          <LinkButton
            label="Create New"
            href={`/providers/${router.query.provider}/dashboard/data-access-model/create`}
            type="create"
          />
        </DashboardHeader>
        <Cards>
          {list ? (
            list.length > 0 ? (
              <>
                <Accordion
                  type="single"
                  collapsible
                  onValueChange={(e: any) => {
                    currentAccordion === 'custom'
                      ? setCurrentAccordion('')
                      : setCurrentAccordion('custom');
                  }}
                  value={currentAccordion}
                >
                  <AccordionItem value={'custom'}>
                    <StyledAccordionTrigger>
                      <Text
                        variant="pt16b"
                        fontWeight={'700'}
                        color={'var(--text-medium)'}
                      >
                        Custom Access Models
                      </Text>
                      <Flex gap="10px">
                        {currentAccordion === 'custom' ? (
                          <DashSize400 fill="var(--color-gray-04)" />
                        ) : (
                          <Add fill="var(--color-gray-04)" />
                        )}
                      </Flex>
                    </StyledAccordionTrigger>
                    <AccordionContent>
                      {list.filter((item) => item.is_global !== true).length ===
                      0 ? (
                        <Flex justifyContent={'center'}>
                          <Text variant="pt16b" color={'var(--text-medium)'}>
                            No Custom Access Models
                          </Text>
                        </Flex>
                      ) : (
                        list
                          ?.filter((item) => item.is_global !== true)
                          .map((item) => <Card key={item.title} data={item} />)
                      )}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                <Accordion
                  type="single"
                  collapsible
                  onValueChange={(e: any) => {
                    currentAccordion === 'common'
                      ? setCurrentAccordion('')
                      : setCurrentAccordion('common');
                  }}
                  value={currentAccordion}
                >
                  <AccordionItem value={'common'}>
                    <StyledAccordionTrigger>
                      <Text
                        variant="pt16b"
                        fontWeight={'700'}
                        color={'var(--text-medium)'}
                      >
                        Default Access Models
                      </Text>
                      <Flex gap="10px">
                        {currentAccordion === 'common' ? (
                          <DashSize400 fill="var(--color-gray-04)" />
                        ) : (
                          <Add fill="var(--color-gray-04)" />
                        )}
                      </Flex>
                    </StyledAccordionTrigger>
                    <AccordionContent>
                      {list.filter((item) => item.is_global === true).length ===
                      0 ? (
                        <Flex justifyContent={'center'}>
                          <Text variant="pt16b" color={'var(--text-medium)'}>
                            No Default Access Models
                          </Text>
                        </Flex>
                      ) : (
                        list
                          ?.filter((item) => item.is_global === true)
                          .map((item) => <Card key={item.title} data={item} />)
                      )}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </>
            ) : (
              <NoResult />
            )
          ) : (
            <Loader />
          )}
        </Cards>
      </Wrapper>
    </MainWrapper>
  );
};

export default DataAccessModelListing;

const Wrapper = styled.main``;

const Cards = styled.div`
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const CardWrapper = styled.article`
  padding: 16px;
  border-radius: 4px;
  background-color: var(--color-white);
  border-top: 1px solid var(--color-gray-03);
  border-bottom: 1px solid var(--color-gray-03);

  display: flex;
  align-items: flex-start;
  gap: 16px;
  justify-content: space-between;

  @media (max-width: 680px) {
    flex-wrap: wrap;
  }

  > span,
  a {
    display: inline-block;
  }
`;

const LeftSide = styled.div`
  display: grid;
  flex-direction: column;
  gap: 12px;
  grid-template-columns: max-content 1fr;

  a {
    display: block;
  }
`;

const IconWrapper = styled.div`
  background-color: var(--color-gray-02);
  width: fit-content;
  padding: 12px;
  line-height: 0;
  border-radius: 4px;
  grid-column: 1/2;
  grid-row: 1/3;
  height: fit-content;

  svg {
    fill: var(--color-gray-04);
  }
`;

const CardHeader = styled.header`
  border-bottom: 1px solid var(--color-gray-02);
  padding-bottom: 8px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  grid-column: 2/3;
`;

const Content = styled.div`
  grid-column: 2/3;

  @media (max-width: 680px) {
    grid-column: 1/3;
  }
`;

const StatsWrapper = styled.div`
  display: flex;
  flex-direction: column;

  @media (max-width: 680px) {
    flex-direction: row;
    align-items: flex-start;
    gap: 16px;
  }

  a {
    text-align: center;
  }
`;

const TagsWrapper = styled.div`
  margin-top: 8px;
  margin-left: 8px;
  min-width: 190px;

  > a {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
  }

  @media (max-width: 680px) {
    margin: 0;
  }
`;

const Tag = styled.div`
  font-weight: 400;
  line-height: 1.7;
  font-size: 0.875rem;
  color: var(--text-medium);
  text-transform: capitalize;
  white-space: nowrap;

  span {
    font-weight: 700;
  }
`;

const StyledAccordionTrigger = styled(AccordionTrigger)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  width: 100%;
  padding: 12px;

  margin-bottom: 12px;

  &[data-disabled] {
    cursor: not-allowed;
  }
`;
