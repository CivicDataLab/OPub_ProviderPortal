import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { Button } from 'components/actions';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);

    // Define a state variable to track whether is an error or not
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    // You can use your own error logging service here
  }
  render() {
    // Check if the error is thrown
    if (this.state['hasError']) {
      // You can render any custom fallback UI
      return (
        <NotFoundWrapper className="container">
          <div className="errorContainer">
            <h2>Error opening the page</h2>
            <p>
              There was an error while we are trying to get the requested
              information. Please go to the{' '}
              <Button
                kind="primary"
                size="sm"
                onPress={() => {
                  this.setState({ hasError: false });
                }}
              >
                <Link href="/" passHref>
                  home
                </Link>
              </Button>
              page and try later.
            </p>
          </div>
        </NotFoundWrapper>
      );
    }

    // Return children components in case of no error
    // onClick={() => {
    //     this.setState({ hasError: false });
    //     Router.push('/');
    //   }}

    return this.props.children;
  }
}

export default ErrorBoundary;

const NotFoundWrapper = styled.div`
  height: calc(100vh - 20em);

  display: flex;
  align-items: center;
  text-align: center;

  .errorContainer {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex-basis: 100%;
    text-align: center;
    justify-items: center;
    h2 {
      /* margin-top: 2rem; */
      font-size: 2rem;
      font-weight: 500;
    }
    p {
      display: flex;
      align-content: center;
      align-items: center;
      gap: 5px;
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
