import { DashSize400 } from '@opub-icons/ui';
import { ChevronDown } from '@opub-icons/workflow';
import { Share } from 'components/actions';

import Sidebar from 'components/common/Sidebar';
import { Breadcrumbs, Heading, NoResult, Text } from 'components/layouts';
import { Flex } from 'components/layouts/FlexWrapper';
import { Link } from 'components/layouts/Link';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  DownloadDocsCard,
} from 'components/pages/about';
import Head from 'next/head';
import { useRouter } from 'next/router';
import {
  ContentFlexContainer,
  DocsWrapper,
  DownloadDocsLinkWrapper,
  SidebarWrapper,
  Wrapper,
} from 'pages/about';
import { MainContentWrapper } from 'pages/help/[helpSlug]';
import { platform_name } from 'platform-constants';
import { useEffect, useState } from 'react';
import { useUserStore } from 'services/store';
import styled from 'styled-components';
import { convertDateFormat } from 'utils/helper';

const FrequentQuestions = ({ faqItems, faqDownloadDocs }) => {
  const [currentAccordion, setCurrentAccordion] = useState('');
  const router = useRouter();
  const userAcess = useUserStore((e) => e.access);
  const userRoles = [
    ...new Set(userAcess.roles?.map((item) => item.role.toString())),
  ];

  const faqSidebarItems = [
    {
      name: 'All',
      id: 'all',
      link: `?category=all`,
    },
    ...[
      ...new Set(
        faqItems.map((faq) => {
          return faq.category;
        })
      ),
    ].map((faqItem) => {
      return {
        name: faqItem,
        id: faqItem.toString().toLowerCase().replaceAll(' ', '-'),
        link: `?category=${faqItem
          .toString()
          .toLowerCase()
          .replaceAll(' ', '-')}`,
      };
    }),
  ];

  useEffect(() => {
    if (!router?.query?.category) {
      router?.replace(`?category=${faqSidebarItems[0].id}`);
    }
  }, [router]);

  const items = faqItems
    .filter(
      (faqItem) =>
        router.query.category === 'all' ||
        faqItem.category.toString().toLowerCase().replaceAll(' ', '-') ===
          router.query.category
    )
    .sort((a, b) => a.question.localeCompare(b.question));

  return (
    <>
      <Head>
        <title>Frequently Asked Questions | {platform_name} (IDP)</title>
      </Head>
      <Breadcrumbs container title="FAQ" />

      <div className="containerDesktop">
        <Wrapper>
          <SidebarWrapper>
            <Sidebar
              sideBarItems={faqSidebarItems}
              imageCard={false}
              imageAltText={'Categories'}
              isSticky
              downloadDocs={faqDownloadDocs}
            />
          </SidebarWrapper>

          <ContentFlexContainer>
            <MainContentWrapper>
              <SearchWrapper>
                <Flex
                  justifyContent={'space-between'}
                  gap="10px"
                  alignItems={'center'}
                >
                  <Heading as="h1" variant="h2">
                    Frequently Asked Questions
                  </Heading>
                  <Share />
                </Flex>
              </SearchWrapper>

              <AccordionWrapper>
                <DownloadDocsLinkWrapper className="onlyMobile">
                  <Link href="#DownloadDocs" underline="hover">
                    Go to the Documents Downloads section
                  </Link>
                </DownloadDocsLinkWrapper>

                <Heading as={'h2'} variant="h3" marginTop={'12px'}>
                  {faqSidebarItems.find(
                    (menuItem) => menuItem.id === router.query.category
                  )?.name || ''}
                </Heading>

                <Accordion>
                  {items.map(
                    (faqItem, index) =>
                      (faqItem.role === 'ALL' ||
                        (faqItem.role !== 'ALL' &&
                          userRoles.includes(faqItem.role))) && (
                        <AccordionItem
                          key={`Problem-Statement-${index}`}
                          value={`Problem-Statement-${index}`}
                        >
                          <AccordionTrigger title={faqItem.question} />

                          <AccordionContent>
                            <Text as={'p'} variant="pt14">
                              {faqItem.answer}
                            </Text>
                            <Text
                              as={'p'}
                              variant="pt12"
                              color={'var(--color-gray-05)'}
                            >
                              Last updated on{' '}
                              {convertDateFormat(faqItem.updated_at)}{' '}
                              {new Date(
                                faqItem.updated_at
                              ).toLocaleTimeString()}
                            </Text>
                          </AccordionContent>
                        </AccordionItem>
                      )
                  )}
                </Accordion>
              </AccordionWrapper>
            </MainContentWrapper>

            <DocsWrapper id="DownloadDocs">
              <DownloadDocsCard downloadDocs={faqDownloadDocs} />
            </DocsWrapper>
          </ContentFlexContainer>
        </Wrapper>
      </div>
    </>
  );
};

export async function getServerSideProps() {
  const faqItems = await fetch(`${process.env.STRAPI_URL}/faqs`).then((res) => {
    return res.json();
  });

  const faqDownloadDocs = await fetch(
    `${process.env.STRAPI_URL}/download-documents`
  ).then((res) => {
    return res.json();
  });

  return {
    props: {
      faqItems,
      faqDownloadDocs,
    },
  };
}

export default FrequentQuestions;

const SearchWrapper = styled.div`
  padding: 24px;
  background-color: var(--color-white);
  margin-bottom: 24px;

  @media (max-width: 640px) {
    padding: 20px;
  }
`;

export const AccordionWrapper = styled.div`
  background-color: var(--color-white);
  padding: 24px 24px 48px;
  border-bottom-right-radius: 4px;
  border-bottom-left-radius: 4px;
  min-height: 70vh;

  span {
    text-align: left;
  }

  .accordion-about {
    margin-top: 12px;
  }

  @media (max-width: 640px) {
    padding: 20px;
  }
`;
