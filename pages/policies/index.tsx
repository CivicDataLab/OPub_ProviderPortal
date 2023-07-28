import { IconAdd, IconMinimize } from 'components/icons';
import { Breadcrumbs, Heading, NoResult, Text } from 'components/layouts';
import { Flex } from 'components/layouts/FlexWrapper';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from 'components/pages/about';
import { Content, Wrapper } from 'config/DashboardLayout';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import {
  HeaderWrapper,
  HeadingRenderer,
  ImageRenderer,
  LinkRenderer,
  MarkdownWrapper,
} from 'pages/about';
import { platform_name } from 'platform-constants';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import styled from 'styled-components';
import { convertDateFormat } from 'utils/helper';

const Policies = ({ policyItems }) => {
  return (
    <>
      <Head>
        <title>Policies | {platform_name} (IDP)</title>
      </Head>
      <Breadcrumbs container title="Poilicies" />

      <Wrapper>
        <PolicyWrapper>
          <Content>
            <HeaderWrapper>
              <Heading as="h1" variant="h2">
                Policies
              </Heading>
            </HeaderWrapper>

            {policyItems.length > 0 && (
              <Accordion>
                {policyItems.map((policyItem, index) => (
                  <AccordionItem
                    key={`Problem-Statement-${index}`}
                    value={`Problem-Statement-${index}`}
                  >
                    <AccordionTrigger title={policyItem.title} />

                    <AccordionContent>
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
                          {policyItem.content}
                        </ReactMarkdown>
                      </MarkdownWrapper>
                      <Text
                        as={'p'}
                        variant="pt12"
                        color={'var(--color-gray-05)'}
                      >
                        Last updated on{' '}
                        {convertDateFormat(policyItem.updated_at)}{' '}
                        {new Date(policyItem.updated_at).toLocaleTimeString()}
                      </Text>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </Content>
        </PolicyWrapper>
      </Wrapper>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const policyItems = await fetch(`${process.env.STRAPI_URL}/policies`).then(
    (res) => {
      return res.json();
    }
  );
  return {
    props: {
      policyItems,
    },
  };
};

export default Policies;

const PolicyWrapper = styled.div`
  width: 50vw;
  margin: 0 auto;
  box-shadow: var(--box-shadow);
  padding: 12px;
  padding-bottom: 32px;
  background-color: var(--color-background-lightest);
  min-height: 80vh;

  .accordion-about {
    margin-top: 20px;
  }

  @media (max-width: 768px) {
    width: 80vw;
  }

  @media (max-width: 640px) {
    width: 100vw;

    .accordion-about {
      margin-top: 16px;
    }
  }
`;
