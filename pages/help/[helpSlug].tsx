import { ChevronLeft } from '@opub-icons/workflow';
import { Button, Share } from 'components/actions';
import Sidebar from 'components/common/Sidebar';
import { Breadcrumbs, Heading, Text } from 'components/layouts';
import { Flex } from 'components/layouts/FlexWrapper';
import { Link } from 'components/layouts/Link';
import { DownloadDocsCard } from 'components/pages/about';
import { MainWrapper } from 'components/pages/user/Layout';
import Head from 'next/head';
import { useRouter } from 'next/router';
import {
  AboutHeader,
  ContentFlexContainer,
  DocsWrapper,
  DownloadDocsLinkWrapper,
  HeadingRenderer,
  ImageRenderer,
  LinkRenderer,
  MarkdownWrapper,
  Wrapper,
} from 'pages/about';
import { platform_name } from 'platform-constants';
import ReactMarkdown from 'react-markdown';
import styled from 'styled-components';
import { convertDateFormat } from 'utils/helper';

const HelpPage = ({ showHelpItem, helpDownloadDocs }) => {
  const router = useRouter();
  const HEADING_R = /(#{1,6} .*)\r?\n/g;

  const helpSidebarItems = [
    ...Array.from(showHelpItem?.content.matchAll(HEADING_R), (m) =>
      m[1].replaceAll('#', '').trim()
    )?.map((headItem) => {
      return {
        name: headItem,
        id: headItem.toLowerCase().replaceAll(' ', '-'),
        link: `#${headItem.toLowerCase().replaceAll(' ', '-')}`,
      };
    }),
  ];

  return (
    <>
      <Head>
        <title>
          {showHelpItem.title} | {platform_name} (IDP)
        </title>
      </Head>

      <Breadcrumbs container title={showHelpItem.title} />

      <div className="containerDesktop">
        <Wrapper>
          <SidebarWrapper>
            <Button kind="custom" onPress={() => router.back()}>
              <Flex alignItems={'center'} marginY={'16px'} padding={'8px'}>
                <ChevronLeft />
                Back to Help
              </Flex>
            </Button>
            <Sidebar
              sideBarItems={helpSidebarItems}
              imageCard={false}
              imageAltText={'Contents'}
              isSticky
              downloadDocs={helpDownloadDocs}
            />
          </SidebarWrapper>

          <ContentFlexContainer>
            <MainContentWrapper>
              <MainWrapper>
                <HelpItemWrapper>
                  <AboutHeader
                    heading={showHelpItem.title}
                    updatedAt={showHelpItem.updated_at}
                  />

                  <DownloadDocsLinkWrapper className="onlyMobile">
                    <Link href="#DownloadDocs" underline="hover">
                      Go to the Documents Downloads section
                    </Link>
                  </DownloadDocsLinkWrapper>

                  <MarkdownWrapper>
                    <ReactMarkdown
                      transformImageUri={(uri) =>
                        uri.startsWith('http')
                          ? uri
                          : `${process.env.NEXT_PUBLIC_INTERNAL_BACKEND_URL}/cms${uri}`
                      }
                      renderers={{
                        heading: HeadingRenderer,
                        link: LinkRenderer,
                        image: ImageRenderer,
                      }}
                    >
                      {showHelpItem.content}
                    </ReactMarkdown>
                  </MarkdownWrapper>

                  <Flex justifyContent={'flex-end'} marginTop={'20px'}>
                    <Button
                      kind="secondary-outline"
                      iconSide="left"
                      icon={<ChevronLeft />}
                      onPress={() => {
                        router.push(
                          `/help?category=${showHelpItem.category
                            .toLowerCase()
                            .replaceAll(' ', '-')}`
                        );
                      }}
                    >
                      Back to Help
                    </Button>
                  </Flex>
                </HelpItemWrapper>
              </MainWrapper>
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

export async function getServerSideProps(context) {
  const showHelpItem = await fetch(
    `${process.env.STRAPI_URL}/help-items?slug=${context.query.helpSlug}`
  ).then((res) => {
    return res.json();
  });

  const helpDownloadDocs = await fetch(
    `${process.env.STRAPI_URL}/download-documents`
  ).then((res) => {
    return res.json();
  });

  return {
    props: {
      showHelpItem: showHelpItem[0],
      helpDownloadDocs,
    },
  };
}

export default HelpPage;

const HelpItemWrapper = styled.div`
  display: flex;
  gap: 8px;
  flex-direction: column;
`;

export const ContentWrapper = styled.div`
  display: block;
`;

export const MainContentWrapper = styled.div`
  display: block;
  flex-grow: 1;
`;

const SidebarWrapper = styled.div`
  display: flex;
  flex-direction: column;

  @media (max-width: 1024px) {
    display: none;
  }
`;
