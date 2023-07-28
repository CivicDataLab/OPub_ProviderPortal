import Head from 'next/head';
import { Content } from 'config/DashboardLayout';
import Sidebar from 'components/common/Sidebar';
import { Breadcrumbs, Heading, NoResult, Text } from 'components/layouts';
import {
  ContentFlexContainer,
  DocsWrapper,
  DownloadDocsLinkWrapper,
  SidebarWrapper,
  Wrapper,
} from 'pages/about';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useUserStore } from 'services/store';
import { Link, NextLink } from 'components/layouts/Link';
import { DownloadDocsCard } from 'components/pages/about';
import { Share } from 'components/actions';
import { platform_name } from 'platform-constants';
import { ContentWrapper, MainContentWrapper } from './[helpSlug]';

const Help = ({ helpItems, helpDownloadDocs }) => {
  const router = useRouter();
  const userAcess = useUserStore((e) => e.access);
  const userRoles = [
    ...new Set(userAcess.roles?.map((item) => item.role.toString())),
  ];

  const helpSidebarItems = [
    {
      name: 'All',
      id: 'all',
      link: `?category=all`,
    },
    ...[
      ...new Set(
        helpItems.map((faq) => {
          return faq.category;
        })
      ),
    ].map((helpItem) => {
      return {
        name: helpItem,
        id: helpItem.toString().toLowerCase().replaceAll(' ', '-'),
        link: `?category=${helpItem
          .toString()
          .toLowerCase()
          .replaceAll(' ', '-')}`,
      };
    }),
  ];

  useEffect(() => {
    if (!router?.query?.category) {
      router?.replace(`?category=${helpSidebarItems[0].id}`);
    }
  }, [router]);

  return (
    <>
      <Head>
        <title>Help | {platform_name} (IDP)</title>
      </Head>
      <Breadcrumbs container title="Help" />

      <div className="containerDesktop">
        <Wrapper>
          <SidebarWrapper>
            <Sidebar
              sideBarItems={helpSidebarItems}
              imageCard={false}
              imageAltText={'Categories'}
              downloadDocs={helpDownloadDocs}
            />
          </SidebarWrapper>

          <ContentFlexContainer>
            <MainContentWrapper>
              <SearchContainer>
                <Heading variant="h2" as="h1">
                  Help
                </Heading>
                <Share />
              </SearchContainer>

              <ListingWrapper>
                <DownloadDocsLinkWrapper className="onlyMobile">
                  <Link href="#DownloadDocs" underline="hover">
                    Go to the Documents Downloads section
                  </Link>
                </DownloadDocsLinkWrapper>
                <Heading as={'h2'} variant="h3" marginTop={'12px'}>
                  {helpSidebarItems.find(
                    (menuItem) => menuItem.id === router.query.category
                  )?.name || ''}
                </Heading>

                {helpItems
                  .filter(
                    (helpItem) =>
                      router.query.category === 'all' ||
                      helpItem.category
                        .toString()
                        .toLowerCase()
                        .replaceAll(' ', '-') === router.query.category
                  )
                  .filter(
                    (helpItem) =>
                      helpItem.role === 'ALL' ||
                      (helpItem.role !== 'ALL' &&
                        userRoles.includes(helpItem.role))
                  ).length > 0 ? (
                  <CardWrapper>
                    {helpItems
                      .filter(
                        (helpItem) =>
                          router.query.category === 'all' ||
                          helpItem.category
                            .toString()
                            .toLowerCase()
                            .replaceAll(' ', '-') === router.query.category
                      )
                      .sort((a, b) => a.title.localeCompare(b.title))
                      .map((helpItem, index) => (
                        <>
                          {(helpItem.role === 'ALL' ||
                            (helpItem.role !== 'ALL' &&
                              userRoles.includes(helpItem.role))) && (
                            <Card key={`Help-${index}`}>
                              <NextLink href={`/help/${helpItem.slug}`}>
                                <CardContent>
                                  <Heading variant="h4" as="h3">
                                    {helpItem.title}
                                  </Heading>

                                  <Text variant="pt16">{helpItem.summary}</Text>
                                </CardContent>
                              </NextLink>
                            </Card>
                          )}
                        </>
                      ))}
                  </CardWrapper>
                ) : (
                  <NoResult />
                )}
              </ListingWrapper>
            </MainContentWrapper>

            <DocsWrapper id="DownloadDocs">
              <DownloadDocsCard downloadDocs={helpDownloadDocs} />
            </DocsWrapper>
          </ContentFlexContainer>
        </Wrapper>
      </div>
    </>
  );
};

export async function getServerSideProps() {
  const helpItems = await fetch(`${process.env.STRAPI_URL}/help-items`).then(
    (res) => {
      return res.json();
    }
  );

  const helpDownloadDocs = await fetch(
    `${process.env.STRAPI_URL}/download-documents`
  ).then((res) => {
    return res.json();
  });

  return {
    props: {
      helpItems,
      helpDownloadDocs,
    },
  };
}

export default Help;

const SearchContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;

  padding: 24px;
  background-color: var(--color-white);
  box-shadow: var(--box-shadow);

  @media (max-width: 640px) {
    padding: 20px;
  }
`;

const ListingWrapper = styled.div`
  background-color: var(--color-white);
  padding: 24px 24px 48px;
  border-bottom-right-radius: 4px;
  border-bottom-left-radius: 4px;
  min-height: 70vh;
  max-width: 100%;
  box-shadow: var(--box-shadow);
  margin-top: 24px;

  @media (max-width: 640px) {
    padding: 20px;
    margin-top: 32px;
  }
`;

const CardWrapper = styled.div`
  display: grid;
  gap: 16px;
  margin-block: 32px;
  align-items: stretch;
  grid-template-columns: 1fr 1fr;
  margin-top: 16px;
  padding-top: 32px;
  border-top: 1px solid var(--color-gray-02);

  @media (max-width: 640px) {
    display: flex;
    flex-direction: column;
    padding-top: 24px;
  }

  @media (max-width: 1080px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  padding: 12px;
  border-radius: 8px;
  box-shadow: var(--box-shadow);
  cursor: pointer;
`;

const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  h3,
  span {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  h3 {
    -webkit-line-clamp: 2;
  }

  span {
    -webkit-line-clamp: 4;
  }
`;
