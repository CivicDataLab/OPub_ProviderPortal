import { useQuery } from '@apollo/client';
import Button from 'components/actions/Button';
import { Loader } from 'components/common';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from 'components/actions/Accordian/Accordian';
import { Minus, Plus } from 'components/icons';
import { DashboardHeader, Heading, NoResult, Text } from 'components/layouts';
import { Flex } from 'components/layouts/FlexWrapper';
import { MainWrapper } from 'components/pages/user/Layout';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import {
  GET_ORGANIZATION_CREATE_REQUESTS_BY_USER,
  GET_ORGANIZATION_JOIN_REQUESTS_BY_USER,
} from 'services';
import styled from 'styled-components';
import { convertDateFormat, slug } from 'utils/helper';
import withAuth from 'utils/withAuth';
import InfoTags from 'components/actions/InfoTags';
import { platform_name } from 'platform-constants';

const OrgItem = ({ data }) => {
  const [currentAccordion, setCurrentAccordion] = useState([]);

  return (
    <>
      {data?.length > 0 ? (
        <Accordion
          type="multiple"
          key={data.id}
          onValueChange={(e: any) => setCurrentAccordion(e)}
        >
          {data.map((item) => (
            <StyledTabItem key={item.id} value={item.id}>
              <StyledTabTrigger>
                <Flex flexWrap="wrap">
                  <Text variant={'pt16b'} className="titleText">
                    {item.title || 'NA'}
                  </Text>
                  <Text variant={'pt16'}>- {item?.role}</Text>
                </Flex>
                <ActionButtons>
                  <Flex justifyContent={'center'} alignItems="center">
                    {item.status.toLowerCase() === 'approved' && (
                      <Button
                        kind={'primary'}
                        size={'sm'}
                        href={`/providers/${
                          item.title ? slug(item.title) : ''
                        }/dashboard/datasets/drafts`}
                        as={'a'}
                        className="success"
                      >
                        Dashboard
                      </Button>
                    )}
                    {item.status.toLowerCase() === 'requested' && (
                      <InfoTags variant={'pending'} statusName={'Pending'} />
                    )}
                    {item.status.toLowerCase() === 'rejected' && (
                      <InfoTags
                        className="centerText"
                        variant={'failure'}
                        statusName={
                          item.role.toLowerCase() === 'provider'
                            ? 'Rejected by Provider Admin'
                            : 'Rejected by PMU'
                        }
                      />
                    )}
                  </Flex>

                  {currentAccordion.includes(item.id) ? (
                    <Minus fill="var(--color-primary)" />
                  ) : (
                    <Plus fill="var(--color-primary)" />
                  )}
                </ActionButtons>
              </StyledTabTrigger>

              <StyledTabContent>
                <>
                  {item.status === 'APPROVED' ? (
                    <Text>
                      <strong>Status: </strong>
                      {item.status} on {convertDateFormat(item.modified)}
                    </Text>
                  ) : (
                    <Text>
                      <strong>Status: </strong>
                      {item.status}
                    </Text>
                  )}
                  {item?.remark && (
                    <Text>
                      <strong>Remark: </strong>
                      {item?.remark}
                    </Text>
                  )}
                </>
              </StyledTabContent>
            </StyledTabItem>
          ))}
        </Accordion>
      ) : (
        ''
      )}
    </>
  );
};

const OrganizationList = ({ orgReqList }) => {
  return (
    <>
      <>
        <ListWrapper>
          <OrgItem data={orgReqList} />
        </ListWrapper>
      </>
    </>
  );
};

function Organizations() {
  const router = useRouter();
  const [tab, setTab] = useState<any>();
  const [action, setAction] = useState<any>('list');

  const [orgsList, setOrgsList] = useState([]);

  const createOrgListRes = useQuery(GET_ORGANIZATION_CREATE_REQUESTS_BY_USER);
  const joinOrgListRes = useQuery(GET_ORGANIZATION_JOIN_REQUESTS_BY_USER);

  useEffect(() => {
    setTab(router.query.action || 'find');
    if (router.query.action) {
      setAction('new_org');
    }
  }, [router.query.action]);

  useEffect(() => {
    if (
      !createOrgListRes.loading &&
      !createOrgListRes.error &&
      !joinOrgListRes.loading &&
      !joinOrgListRes.error
    ) {
      setOrgsList([
        ...(createOrgListRes.data?.organizations_by_user?.map((createItem) => {
          return {
            id: createItem.id,
            title: createItem.title,
            modified: createItem.modified,
            role: 'Provider Admin',
            ...createItem.organizationcreaterequest,
          };
        }) || []),
        ...(joinOrgListRes.data?.organization_request_user?.map((joinItem) => {
          return {
            remark: joinItem.remark,
            status: joinItem.status,
            modified: joinItem.modified,
            role: 'Provider',
            ...joinItem.organization,
          };
        }) || []),
      ]);
    } else if (joinOrgListRes.error || createOrgListRes.error) {
      toast.error('Error in fetching organizations');
    }
  }, [createOrgListRes, joinOrgListRes]);

  useEffect(() => {
    if (!createOrgListRes.loading && !joinOrgListRes.loading) {
      orgsList.length < 1 && setAction('new_org');
    }
  }, [orgsList]);

  function handleTabChange(newTab) {
    if (newTab) {
      router.replace(
        {
          pathname: router.pathname,
          query: {
            action: newTab,
          },
        },
        undefined,
        { shallow: true }
      );
    }
  }

  function handleActionChange(action) {
    let new_action = action == 'list' ? 'new_org' : 'list';
    if (action !== 'list') {
      createOrgListRes.refetch();
      joinOrgListRes.refetch();
    }
    setAction(new_action);
  }

  return (
    <MainWrapper fullWidth>
      <Head>
        <title>My Entities | {platform_name} (IDP)</title>
      </Head>

      <DashboardHeader>
        <Heading as={'h1'} variant="h3" paddingBottom={'24px !important'}>
          My Entities
        </Heading>
        {/* <LinkButton
          label={action === 'list' ? 'New Organisation' : 'Back to List'}
          onClick={() => handleActionChange(action)}
          type={action === 'list' ? 'create' : 'back'}
        /> */}
      </DashboardHeader>

      {action === 'list' ? (
        createOrgListRes.loading && joinOrgListRes.loading ? (
          <Loader loadingText="Loading Organizations List" />
        ) : orgsList.length > 0 ? (
          <OrganizationList
            orgReqList={orgsList.sort((a, b) => {
              var a1 = new Date(a.modified).getTime();
              var b1 = new Date(b.modified).getTime();
              if (a1 < b1) return 1;
              else if (a1 > b1) return -1;
              else return 0;
            })}
          />
        ) : (
          <NoResult label={'No Organizations tagged to you'} />
        )
      ) : (
        // <NewOrganization
        //   onPress={() => handleTabChange('find')}
        //   onPress1={() => handleTabChange('request')}
        //   tab={tab}
        //   userOrgsListRes={joinOrgListRes}
        // />
        <NoResult label={'No Organizations tagged to you'} />
      )}
    </MainWrapper>
  );
}

export default withAuth(Organizations);

const ListHead = styled.div`
  padding: 16px 32px;
  background-color: var(--color-canvas-subtle);
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
`;
const ActionButtons = styled.div`
  .success {
    width: 150px;
    justify-content: center;
  }
  .centerText {
    text-align: center;
  }
  span {
    width: 150px;
  }
`;
const ListWrapper = styled.div`
  min-height: 600px;
  overflow-x: auto;
  width: 100%;

  @media screen and (max-width: 640px) {
    max-width: calc(100vw - 52px);
  }

  hr {
    border-bottom: 1px solid var(--color-gray-02);
    width: 100%;
    margin-top: 8px;
  }

  ul {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding-inline: 16px;
    margin-top: 16px;
  }

  li {
    margin-top: 5px;
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    justify-content: space-between;
    align-items: center;

    span {
      max-width: 150px;
    }

    :last-child {
      hr {
        display: none;
      }
    }

    > div {
      display: flex;
      gap: 12px;
      align-items: center;
      justify-content: center;
      flex: 1 10em;
    }
  }
`;

const StyledTabItem = styled(AccordionItem)`
  background-color: var(--color-tertiary-1-06);
  margin-top: 16px;
`;

const StyledTabTrigger = styled(AccordionTrigger)`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  width: 100%;
  padding: 16px;
  background-color: var(--color-tertiary-1-06);
  border: 1px solid var(--color-gray-03);
  :hover {
    background-color: var(--color-background-lightest);
  }
  font-weight: 600;
  font-size: 18px;

  > div {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .titleText {
    max-width: 80%;
  }

  span {
    text-align: initial;
    word-wrap: normal;
  }
`;

const StyledTabContent = styled(AccordionContent)`
  padding: 16px;
  background-color: var(--color-background-lightest);
  border: 1px solid var(--color-gray-03);
  span {
    display: block;
    margin-bottom: 8px;
  }
`;
