import { ChevronDown, Download, User } from '@opub-icons/workflow';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@radix-ui/react-collapsible';
import { Box, Heading, Text } from 'components/layouts';
import { Flex } from 'components/layouts/FlexWrapper';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';
import React, { useState } from 'react';
import { useConstants, useUserStore, useProviderStore } from 'services/store';
import styled, { css } from 'styled-components';
import { useQuery } from '@apollo/client';
import { GET_ORGANIZATION_BY_ID } from 'services';
import { Button } from 'components/actions';
import { Link as FileLink } from 'components/layouts/Link';
import { Org_types } from 'utils/government-entities';
import { DocsWrapper } from 'pages/about';
import { DownloadDocsCard } from 'components/pages/about';

type Props = {
  sideBarItems: any;
  imageCard?: boolean;
  imageAltText?: string;
  isSticky?: boolean;
  downloadDocs?: Array<any>;
};

const SideBar = ({
  sideBarItems,
  imageCard = true,
  imageAltText = '',
  isSticky,
  downloadDocs = [],
}: Props) => {
  const router = useRouter();
  const icons = useConstants((e) => e.dashboardIcons);
  const [logo, setLogo] = useState('logo');
  const currentOrgRole = useProviderStore((e) => e.org);
  const userDetails = useUserStore((e) => e.user);

  const organizationResponse = useQuery(GET_ORGANIZATION_BY_ID, {
    variables: {
      organization_id: currentOrgRole?.org_id,
    },
    skip: !currentOrgRole?.org_id,
  });

  const orgDetails =
    organizationResponse?.data &&
    organizationResponse?.data?.organization_by_id;

  function isActive(id) {
    return (
      router.asPath.includes(id) ||
      router.query.from === id ||
      (router.asPath.includes('create-new') &&
        router.query.from === undefined &&
        id === 'drafts')
    );
  }

  const ContainerElm = isSticky ? StickyContainer : 'div';

  return (
    <Wrapper>
      <ContainerElm>
        {imageCard ? (
          <Box>
            <Flex
              flexDirection={'column'}
              alignItems={'center'}
              gap="10px"
              padding={'10px'}
            >
              {router.asPath.includes('/providers/') ? (
                orgDetails?.logo && logo === 'logo' ? (
                  <Image
                    alt={`Logo of ${currentOrgRole?.org_title}`}
                    width={'112px'}
                    height={'112px'}
                    className="img-contain"
                    src={`${process.env.NEXT_PUBLIC_INTERNAL_BACKEND_URL}/public/${orgDetails?.logo}`}
                    onError={() => {
                      setLogo('fallback');
                    }}
                  />
                ) : (
                  <Image
                    src={
                      Org_types.includes(
                        orgDetails?.organization_types.replaceAll('_', ' ')
                      )
                        ? `/assets/icons/Government.svg`
                        : `/assets/icons/Private.svg`
                    }
                    alt={`Logo of ${currentOrgRole?.org_title}`}
                    width={112}
                    height={112}
                    className="img-contain"
                  />
                )
              ) : (
                <User size={112} style={{ marginLeft: '-2px' }} />
              )}

              {router.asPath.includes('/providers/') && currentOrgRole ? (
                <Flex flexDirection={'column'} alignItems={'center'}>
                  <Text variant="pt16b" textAlign={'center'}>
                    {currentOrgRole?.org_title}
                  </Text>
                  <Text variant="pt14">
                    {currentOrgRole?.role === 'DPA'
                      ? 'Provider Admin Dashboard'
                      : 'Provider Dashboard'}
                  </Text>
                </Flex>
              ) : (
                <Flex flexDirection={'column'} alignItems={'center'}>
                  <Text variant="pt16b">{userDetails.name}</Text>
                </Flex>
              )}
            </Flex>
          </Box>
        ) : (
          <Heading as={'h2'} variant="h5">
            {imageAltText}
          </Heading>
        )}

        <List>
          {sideBarItems.length > 0 ? (
            sideBarItems.map((item) => {
              const Icon = icons[item.id ? item.id : item.name];

              return (
                <Item key={item.name + item.link}>
                  {item.id === 'banner' ? (
                    <Banner>
                      <Flex flexDirection={'column'} gap={'4px'}>
                        <Text variant="pt16b">Looking to Share Data?</Text>
                        <Text variant="pt12">
                        Please go ahead with any of the following ways to start
                        the contribution
                        </Text>
                      </Flex>
                      <Flex
                        marginTop={'8px'}
                        gap={'2px'}
                        flexDirection={'column'}
                      >
                        <Link href={item.linkfind} passHref>
                          <a>
                            <Text variant="pt12"> Find your Organisation</Text>
                          </a>
                        </Link>

                        <Link href={item.linkreq} passHref>
                          <a>
                          <Text variant="pt12"> Request New Organisation</Text>
                          </a>
                        </Link>
                      </Flex>
                    </Banner>
                  ) : item.childItems ? (
                    <Section Icon={Icon} isActive={isActive} item={item} />
                  ) : (
                    <Link href={item.link} passHref>
                    <a className={isActive(item.id) ? 'dashboard-active' : ''}>
                        {Icon} {item.name}
                      </a>
                    </Link>
                  )}
                </Item>
              );
            })
          ) : (
            <Text textAlign={'center'} variant="pt14" fontStyle={'italic'}>
              No Contents
            </Text>
          )}
        </List>

        {downloadDocs.length > 0 && (
          <DownloadDocsWrapper>
            <DownloadDocsCard downloadDocs={downloadDocs} separator={false} />
          </DownloadDocsWrapper>
        )}
      </ContainerElm>
    </Wrapper>
  );
};

export default SideBar;

const Banner = styled.div`
  background-color: var(--color-primary-06);
  border: 1px solid var(--color-gray-01);
  padding: 18px;
  align-items: center;
  max-width: 280px;
  border-radius: 4px;
  a {
    white-space: nowrap;
    color: var(--color-primary-01);
  }
`;

const Wrapper = styled.div`
  background-color: var(--color-white);
  min-width: 304px;
  max-width: 350px;
  height: 100%;
  padding-inline: 16px;
  padding-top: 24px;
  padding-bottom: 32px;
  position: relative;

  > div {
    position: sticky;
    top: 128px;
  }

  .dashboard-active {
    background-color: var(--color-primary-06);
    color: var(--color-primary-01);
    border-color: var(--color-primary-01);

    svg {
      fill: var(--color-primary-01);
    }
  }

  @media (max-width: 640px) {
    width: 100vw;
    max-width: 100vw;
    min-height: 40vh;
  }
`;

const StickyContainer = styled.div`
  position: sticky;
  top: 128px;
`;

const List = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 20px;
`;

const ItemStyles = css`
  display: flex;
  gap: 8px;
  align-items: center;
  width: 100%;
  padding: 12px 16px;
  border-radius: 4px;
  background-color: var(--color-background-light);
  text-align: start;
  text-decoration: none;

  font-weight: var(--font-bold);
  color: var(--text-medium);

  border-left: 2px solid var(--color-gray-03);

  svg {
    fill: var(--color-gray-04);
  }
`;

const Item = styled.li`
  > a,
  > div > button {
    ${ItemStyles};
  }
`;

const DownloadDocsWrapper = styled.div`
  background-color: var(--color-white);
  width: 100%;
  border-bottom-right-radius: 4px;
  border-bottom-left-radius: 4px;
  margin-top: 32px;
`;

const Section = ({ Icon, item, isActive }) => {
  const [isOpen, setIsOpen] = React.useState(
    item.childItems.some((e) => isActive(e.id))
  );

  return (
    <Collapsible open={isOpen} onOpenChange={() => setIsOpen(!isOpen)}>
      <StyledTrigger>
        <Flex alignItems="center" gap="8px">
          {Icon}
          {item.name}
        </Flex>
        <ChevronDown className="chevy" />
      </StyledTrigger>
      <CollapsibleContent>
        <ChildList>
          {item.childItems.map((child) => (
            <Link href={child.link} passHref key={child.name + child.link}>
              <a className={isActive(child.id) ? 'dashboard-active' : ''}>
                {child.name}
              </a>
            </Link>
          ))}
        </ChildList>
      </CollapsibleContent>
    </Collapsible>
  );
};

const StyledTrigger = styled(CollapsibleTrigger)`
  &[data-state] {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 24px;
    width: 100%;
    transition: color 150ms ease, border-color 150ms ease;
  }

  svg {
    transition: transform 150ms ease, fill 150ms ease;
    fill: var(--color-gray-04);
  }

  &[data-state='open'] {
    color: var(--text-high);
    border-color: var(--color-gray-05);

    svg {
      fill: var(--color-gray-05);
    }
    .chevy {
      transform: rotate(-180deg);
    }
  }
`;

const ChildList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 12px;

  padding-left: 32px;

  a {
    ${ItemStyles};
    border: none;
  }
`;
