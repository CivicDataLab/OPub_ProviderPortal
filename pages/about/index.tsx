import { Share } from 'components/actions';
import Sidebar from 'components/common/Sidebar';
import { Breadcrumbs, Heading, Text } from 'components/layouts';
import { Flex } from 'components/layouts/FlexWrapper';
import { Link } from 'components/layouts/Link';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  DownloadDocsCard,
} from 'components/pages/about';
import { MainWrapper } from 'components/pages/user/Layout';
import Head from 'next/head';
import Image from 'next/image';
import { MainContentWrapper } from 'pages/help/[helpSlug]';
import { platform_name } from 'platform-constants';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import styled from 'styled-components';
import { convertDateFormat } from 'utils/helper';

export function ImageRenderer(props) {
  return (
    <Logo>
      <Image
        alt={props.alt}
        src={props.src}
        title={props.title}
        layout="fill"
        className="img-contain"
      />
    </Logo>
  );
}

function flatten(text, child) {
  return typeof child === 'string'
    ? text + child
    : React.Children.toArray(child.props.children).reduce(flatten, text);
}

export function HeadingRenderer(props) {
  var children = React.Children.toArray(props.children);

  var text = children.reduce(flatten, '');
  var slug = (text as string).toLowerCase().replace(/\W/g, '-');
  return React.createElement('h' + props.level, { id: slug }, props.children);
}

export function LinkRenderer(props: any) {
  return (
    <Link
      href={props.href}
      rel="noopener noreferrer"
      target="_blank"
      external
      underline="always"
      style={{
        display: 'contents',
      }}
    >
      {props.children}
    </Link>
  );
}

export const AboutHeader = ({ heading, updatedAt }) => {
  return (
    <HeaderWrapper>
      <Flex alignItems={'center'} justifyContent={'space-between'}>
        <Heading as="h1" variant="h2">
          {heading}
        </Heading>
        <Share />
      </Flex>

      <Text color={'var(--color-gray-05)'} variant="pt14">
        Last updated on {convertDateFormat(updatedAt)}
      </Text>
    </HeaderWrapper>
  );
};

const About = ({ aboutText, aboutProblemStatements, aboutDownloadDocs }) => {
  const HEADING_R = /(#{1,6} .*)\r?\n/g;

  const AboutSidebarItems = [
    ...Array.from(aboutText?.content.matchAll(HEADING_R), (m) =>
      m[1].replaceAll('#', '').trim()
    )?.map((headItem) => {
      return {
        name: headItem,
        id: headItem.toLowerCase().replaceAll(' ', '-'),
        link: `#${headItem.toLowerCase().replaceAll(' ', '-')}`,
      };
    }),
    {
      name: 'Problem Statements',
      id: 'problem-statement',
      link: `#problem-statement`,
    },
  ];

  return (
    <>
      <Head>
        <title>About | {platform_name} (IDP)</title>
      </Head>
      <Breadcrumbs container title="About" />

      <div className="containerDesktop">
        <Wrapper>
          <SidebarWrapper>
            <Sidebar
              sideBarItems={AboutSidebarItems}
              imageCard={false}
              imageAltText={'Contents'}
              isSticky
              downloadDocs={aboutDownloadDocs}
            />
          </SidebarWrapper>

          <ContentFlexContainer>
            <MainContentWrapper>
              <MainWrapper fullWidth>
                <AboutHeader
                  heading="About"
                  updatedAt={aboutText?.updated_at}
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
                    {aboutText?.content}
                  </ReactMarkdown>
                </MarkdownWrapper>

                {aboutProblemStatements.length > 0 && (
                  <Accordion title="Problem Statements">
                    {aboutProblemStatements.map(
                      (problemStatementItem, index) => (
                        <AccordionItem
                          key={`Problem-Statement-${index}`}
                          value={`Problem-Statement-${index}`}
                        >
                          <AccordionTrigger
                            title={problemStatementItem.title}
                          />

                          <AccordionContent>
                            <Text as="p" variant="pt14">
                              {problemStatementItem.description}
                            </Text>
                          </AccordionContent>
                        </AccordionItem>
                      )
                    )}
                  </Accordion>
                )}
              </MainWrapper>
            </MainContentWrapper>

            <DocsWrapper id="DownloadDocs">
              <DownloadDocsCard downloadDocs={aboutDownloadDocs} />
            </DocsWrapper>
          </ContentFlexContainer>
        </Wrapper>
      </div>
    </>
  );
};

export async function getServerSideProps() {
  const aboutText = await fetch(
    `${process.env.STRAPI_URL}/about-platform`
  ).then((res) => {
    return res.json();
  });

  const aboutProblemStatements = await fetch(
    `${process.env.STRAPI_URL}/problem-statements`
  ).then((res) => {
    return res.json();
  });

  const aboutDownloadDocs = await fetch(
    `${process.env.STRAPI_URL}/download-documents`
  ).then((res) => {
    return res.json();
  });

  return {
    props: {
      aboutText,
      aboutProblemStatements,
      aboutDownloadDocs,
    },
  };
}

export default About;

export const Wrapper = styled.div`
  display: flex;
  gap: 16px;
`;

export const SidebarWrapper = styled.div`
  @media (max-width: 1024px) {
    display: none;
  }
`;

export const ContentFlexContainer = styled.div`
  display: flex;
  width: 100%;
  gap: 16px;
  flex-direction: column;

  .accordion-about {
    margin-top: 32px;
  }

  @media (max-width: 640px) {
    flex-direction: column;
    flex-grow: 1;
    gap: 32px;

    .accordion-about {
      margin-top: 20px;
    }
  }
`;

interface StyleProps {
  hideBorder?: boolean;
}

export const HeaderWrapper = styled.div<StyleProps>`
  border-bottom: ${(props) =>
    props.hideBorder ? 'none' : '1px solid var(--color-gray-02)'};
  padding-bottom: ${(props) => (props['topBorder'] ? '0px' : '12px')};

  @media (max-width: 640px) {
    padding-bottom: ${(props) => (props['topBorder'] ? '0px' : '12px')};
  }
`;

export const MarkdownWrapper = styled.div`
  display: block;
  white-space: pre-wrap;
  word-wrap: break-word;
  margin-top: 12px;

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    scroll-margin-top: 150px;
  }

  code {
    white-space: pre-line;
  }

  h2 {
    margin-top: 16px;
    margin-bottom: 8px;

    font-size: 1.25rem;
    line-height: 1.59;
  }

  h3 {
    margin-top: 14px;
    margin-bottom: 8px;

    font-size: 1.125rem;
    line-height: 1.7;
  }

  hr {
    color: var(--color-gray-02);
  }

  p,
  a {
    letter-spacing: 0.16px;
    padding-top: 12px;
  }

  pre {
    padding: 10px;
    background-color: var(--color-gray-01);
  }

  a {
    color: var(--color-primary-01);
    font-size: 14px;
    font-weight: 700;

    :hover {
      color: var(--color-primary-03);
    }
  }

  ul {
    padding-left: 24px;

    li {
      margin: 8px 0;
      list-style: disc outside none;

      li {
        list-style-type: circle;
      }
    }
  }

  ol {
    padding-left: 24px;

    li {
      margin: 8px 0;
      list-style-type: decimal;

      li {
        list-style-type: lower-roman;
      }
    }
  }

  table {
    max-width: 100%;
    overflow: auto;
    display: block;
    width: 100%;
    margin-top: 10px;
    text-align: left;

    th {
      padding: 5px 2px;
      background-color: var(--color-gray-01);
      border: 1px solid var(--color-gray-02);
    }
    td {
      padding: 5px 5px;
      border: 1px solid var(--color-gray-02);
    }
  }

  @media (max-width: 640px) {
    margin-top: 20px;
  }
`;

const Logo = styled.div`
  position: relative;
  height: 450px;

  span {
    position: absolute;
    top: 50%;
    left: 50%;
  }
`;

export const DocsWrapper = styled.div`
  background-color: var(--color-white);
  padding: 12px 16px;
  min-width: 328px;
  border-bottom-right-radius: 4px;
  border-bottom-left-radius: 4px;
  box-shadow: var(--box-shadow);
  margin-bottom: 32px;
  display: none;

  @media (max-width: 1024px) {
    width: 100%;
    display: block;
  }
`;

export const DownloadDocsLinkWrapper = styled.div`
  padding-top: 12px;
`;
