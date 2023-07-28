import styled from 'styled-components';
import Head from 'next/head';
import { Error500 } from 'components/layouts';

export default function Custom500() {
  return (
    <>
      <Head>
        <title>500 - Server-side Error | India Datasets Platform (IDP)</title>
      </Head>
      <ServerErrorWrapper className="container">
        <Error500 />
      </ServerErrorWrapper>
    </>
  );
}

const ServerErrorWrapper = styled.div`
  height: calc(100vh - 20em);

  display: flex;
  align-items: center;
  text-align: center;

  .errorContainer {
    flex-basis: 100%;
    h2 {
      /* margin-top: 2rem; */
      font-size: 2rem;
      font-weight: 500;
    }
    p {
      font-size: 1rem;
      line-height: 1.5;
    }
    .highlightLink {
      background-color: var(--color-tertiary);

      a {
        text-decoration: none;
      }
    }
  }
`;
