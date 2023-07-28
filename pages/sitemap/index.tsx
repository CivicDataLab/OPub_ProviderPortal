import React from 'react';
import Head from 'next/head';
import { Breadcrumbs, Header, Heading } from 'components/layouts';
import styled from 'styled-components';
import Link from 'next/link';
import {
  Asterisk,
  Bookmark,
  CallCenter,
  ChevronRight,
  Data,
  FileTxt,
  GraphStreamRanked,
  Help,
  Monitoring,
  Question,
  VectorDraw,
} from '@opub-icons/workflow';
import { Flex } from 'components/layouts/FlexWrapper';
import { platform_name } from 'platform-constants';

const Sitemap = () => {
  const headerData = {
    title: 'Sitemap',
    description:
      'The sitemap provides information about the categories, pages and platform structure along with direct links.',
  };

  const sitemapData = [
    {
      name: 'Datasets',
      link: '/datasets',
      icon: <Data fill="var(--color-secondary-01)" width={32} />,
    },
    {
      name: 'Providers',
      link: '/providers',
      icon: <Monitoring fill="var(--color-secondary-01)" width={32} />,
    },
    {
      name: 'Sectors',
      link: '/sectors',
      icon: <Bookmark fill="var(--color-secondary-01)" width={32} />,
    },
    {
      name: 'About',
      link: '/about',
      icon: <GraphStreamRanked fill="var(--color-secondary-01)" width={32} />,
    },
    {
      name: 'Glossary',
      link: '/glossary',
      icon: <VectorDraw fill="var(--color-secondary-01)" width={32} />,
    },
    {
      name: 'FAQs',
      link: '/faqs?category=all',
      icon: <Question fill="var(--color-secondary-01)" width={32} />,
    },
    {
      name: 'Help',
      link: '/help?category=all',
      icon: <Help fill="var(--color-secondary-01)" width={32} />,
    },
    {
      name: 'Terms of Use',
      link: '/terms-of-use',
      icon: <Asterisk fill="var(--color-secondary-01)" width={32} />,
    },
    // {
    //   name: 'About IDP',
    //   link: '/about',
    //   icon: <DataBook fill="var(--color-secondary-01)" width={32} />,
    // },
    // {
    //   name: 'Sitemap',
    //   link: '/server-sitemap.xml',
    //   icon: (
    //     <Workflow
    //       fill="var(--color-secondary-01)"
    //       transform="rotate(90)"
    //       width={32}
    //     />
    //   ),
    // },
    {
      name: 'Connect with IDP',
      link: '/connect-with-idp',
      icon: <CallCenter fill="var(--color-secondary-01)" width={32} />,
    },
  ];

  return (
    <>
      <Head>
        <title>Sitemap | {platform_name} (IDP)</title>
      </Head>

      <Breadcrumbs container title="Sitemap" />

      <Header data={headerData} />

      <Wrapper className="container">
        {/* <div className="homeAnchor">
            <Link href="/" passHref>
              Home
            </Link>
          </div> */}

        <section className="sitemapContainer">
          {sitemapData.map((sitemapItem) => (
            <Link key={sitemapItem.name} href={sitemapItem.link} passHref>
              <Flex justifyContent={'space-between'}>
                <Flex gap="16px">
                  {sitemapItem.icon}
                  <Heading as={'h5'} variant={'h4l'}>
                    {sitemapItem.name}
                  </Heading>
                </Flex>
                <ChevronRight fill="var(--color-gray-03)" />
              </Flex>
            </Link>
          ))}
        </section>
      </Wrapper>
    </>
  );
};

export default Sitemap;

const Wrapper = styled.div`
  margin-top: 2rem;
  margin-bottom: 2rem;

  .homeAnchor {
    margin: 1rem;
    padding: 1rem 5rem;
    background-color: var(--color-primary);
    color: var(--color-white);
    border-radius: 5rem;
    text-align: center;
    width: min-content;
    display: inline;
    a {
      text-decoration: none;
    }
  }

  .sitemapContainer {
    margin-top: 2rem;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(400px, 100%), 1fr));
    > div {
      margin: 1rem;
      padding: 1rem;
      background-color: var(--color-background-lightest);
      color: var(--color-black);
      border: 1px solid var(--color-gray-02);
      &:hover {
        background-color: var(--color-secondary-06);
      }
    }
    a {
      text-decoration: none;
      overflow: hidden;
    }
  }
`;
