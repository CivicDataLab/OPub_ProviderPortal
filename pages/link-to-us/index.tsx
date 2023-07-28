import { MainWrapper } from 'components/pages/user/Layout';
import { GetServerSideProps } from 'next';
import { Heading } from 'components/layouts';
import {
  HeadingRenderer,
  ImageRenderer,
  LinkRenderer,
  MarkdownWrapper,
} from 'pages/about';
import ReactMarkdown from 'react-markdown';
import styled from 'styled-components';
import Head from 'next/head';
import { platform_name } from 'platform-constants';

const LinkToUs = ({ linkToUs }) => {
  return (
    <>
      <Head>
        <title>Link to us | {platform_name} (IDP)</title>
      </Head>
      <LinkToUsWrapper>
        <MainWrapper fullWidth>
          <Heading as={'h1'}>Link to us</Heading>
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
              {linkToUs.content}
            </ReactMarkdown>
          </MarkdownWrapper>
        </MainWrapper>
      </LinkToUsWrapper>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const linkToUs = await fetch(`${process.env.STRAPI_URL}/link-to-us`).then(
    (res) => {
      return res.json();
    }
  );
  return {
    props: { linkToUs },
  };
};

export default LinkToUs;

const LinkToUsWrapper = styled.div`
  min-width: 768px;
  max-width: 50vw;
  margin: 0 auto;
  box-shadow: var(--box-shadow);

  @media (max-width: 640px) {
    min-width: 0px;
    max-width: 100vw;
  }
`;
