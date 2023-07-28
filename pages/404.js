import styled from 'styled-components';
import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';

export default function Custom404() {
  return (
    <>
      <Head>
        <title>404 - Page not found | India Datasets Platform (IDP)</title>
      </Head>
      <NotFoundWrapper className="container">
        <div className="errorContainer">
          <Image
            src="/assets/icons/NotFound.svg"
            width={132}
            height={87}
            alt="Image showing that no webpage is found"
          />
          <h2>Page Not Found</h2>
          <p>
            The page you are trying to open is not available. <br /> Please go
            to the{' '}
            <Link href="/">
              <a>Homepage </a>
            </Link>
            and try opening another page.
          </p>
        </div>
      </NotFoundWrapper>
    </>
  );
}

const NotFoundWrapper = styled.div`
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

    a {
      text-decoration: none;
      color: var(--color-primary-01);
      font-weight: var(--font-bold);
    }
  }
`;
