import Image from 'next/image';
import styled from 'styled-components';

const LoginRequired = () => {
  return (
    <>
      <LoginReqWrapper className="container">
        <div className="errorContainer">
          <Image
            src="/assets/icons/Login.svg"
            alt="Image showing a webpage that the user can access after logging in"
            width={125}
            height={87}
          />
          <h2>Login Required</h2>
          <p>
            The page you are trying to open is protected. Please login to
            continue.
          </p>
        </div>
      </LoginReqWrapper>
    </>
  );
};

export default LoginRequired;

const LoginReqWrapper = styled.div`
  min-height: 80vh;
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
