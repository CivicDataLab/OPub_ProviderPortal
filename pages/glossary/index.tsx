import { Breadcrumbs, Heading } from 'components/layouts';
import { MainWrapper } from 'components/pages/user/Layout';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import {
  HeadingRenderer,
  ImageRenderer,
  LinkRenderer,
  MarkdownWrapper,
} from 'pages/about';
import { platform_name } from 'platform-constants';
import ReactMarkdown from 'react-markdown';
import styled from 'styled-components';

const Glossary = ({ glossary }) => {
  return (
    <>
      <Head>
        <title>Glossary | {platform_name} (IDP)</title>
      </Head>
      <Breadcrumbs container title="Glossary" />

      <GlossaryWrapper>
        <MainWrapper fullWidth>
          <Heading as={'h1'}>Glossary</Heading>
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
              {glossary.content}
            </ReactMarkdown>
          </MarkdownWrapper>
        </MainWrapper>
      </GlossaryWrapper>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const glossary = await fetch(`${process.env.STRAPI_URL}/glossary`).then(
    (res) => {
      return res.json();
    }
  );
  return {
    props: { glossary },
  };
};

export default Glossary;

const GlossaryWrapper = styled.div`
  min-width: 768px;
  max-width: 50vw;
  margin: 0 auto;
  box-shadow: var(--box-shadow);

  @media (max-width: 640px) {
    min-width: 0px;
    max-width: 100vw;
  }
`;
