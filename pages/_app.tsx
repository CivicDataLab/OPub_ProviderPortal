import NextNprogress from 'nextjs-progressbar';
import { GlobalStyle } from 'styles/Global';
import GlobalLayout from 'config/GlobalLayout';
import ErrorBoundary from 'components/common/ErrorBoundary';
import { ApolloProvider } from '@apollo/client';
import { getGraphQLClient } from '../apollo-client';
import { dataStore } from '../Store';
import { Provider } from 'react-redux';
import dynamic from 'next/dynamic';
import { SessionProvider, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import DashboardLayout from 'config/DashboardLayout';
import ConsumerDashboardLayout from 'config/ConsumerDashboardLayout';
import { SSRProvider } from 'react-aria';
import 'swagger-ui-react/swagger-ui.css';
import { toast } from 'react-toastify';
import { Loader } from 'components/common';
import { useEffect } from 'react';
import ScrollToTop from 'react-scroll-to-top';

const Toast = dynamic(() => import('components/actions/Toast/Toast'), {
  ssr: true,
});

const MyApp = ({ Component, pageProps: { session, ...pageProps } }) => {
  const router = useRouter();
  const isConsumerDashboard = router.asPath.includes('/user/');
  const isDashboard =
    router.asPath.includes('/dashboard/') &&
    Object.keys(router.query).length > 0;

  let Layout = isDashboard ? DashboardLayout : GlobalLayout;
  Layout = isConsumerDashboard ? ConsumerDashboardLayout : Layout;
  // Use the layout defined at the page level, if availables

  // (router.query?.session_state?.length > 0) &&
  if (router.query.session_state?.length > 0 && router.query.code?.length > 0) {
    toast.success('Registration Successful');

    // Login if session state and code is available
    typeof window !== 'undefined' &&
      setTimeout(() => {
        signIn('keycloak', {
          callbackUrl: `${window.location.origin}/user/profile`,
        });
      }, 3000);
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const currentTime = new Date().getTime();
      const storedTime = Number(window.localStorage.getItem('idpSessionClock'));

      if (
        session &&
        !router.query?.clientLogin &&
        currentTime - storedTime >
          Number(process.env.NEXT_PUBLIC_TIMER_SESSION_CHECK)
      ) {
        window.localStorage.setItem(
          'idpSessionClock',
          new Date().getTime().toString()
        );

        console.log('Logout the profile');

        signOut({ redirect: false }).then(() => {
          fetch(`/api/auth/logout`)
            .then((res) => res.json())
            .then((path) => {
              router.push(path);
            });
        });

        // logout(session);
      }

      const timer = setInterval(() => {
        const nowTime = new Date().getTime();
        window.localStorage.setItem('idpSessionClock', nowTime.toString());
      }, Number(process.env.NEXT_PUBLIC_TIMER_UPDATE_INTERVAL));

      return () => clearInterval(timer);
    }
  }, [session]);

  return (
    <SSRProvider>
      <SessionProvider session={session}>
        <GlobalStyle />
        <ApolloProvider client={getGraphQLClient}>
          <Provider store={dataStore}>
            <Layout>
              <NextNprogress
                startPosition={0.3}
                stopDelayMs={100}
                height={3}
                options={{ easing: 'ease', speed: 300, showSpinner: false }}
              />
              <Toast />

              <ErrorBoundary>
                {router.query.session_state?.length > 0 &&
                router.query.code?.length > 0 ? (
                  <Loader loadingText="Redirecting to User Dashboard..." />
                ) : (
                  <Component {...pageProps} />
                )}
              </ErrorBoundary>
            </Layout>
          </Provider>
          <ScrollToTop
            smooth
            viewBox="0 0 23 23"
            color="var(--color-primary-01)"
            title="Scroll to top"
            svgPath="M13 19V7.82998L17.88 12.71C18.27 13.1 18.91 13.1 19.3 12.71C19.69 12.32 19.69 11.69 19.3 11.3L12.71 4.70998C12.32 4.31998 11.69 4.31998 11.3 4.70998L4.69997 11.29C4.30997 11.68 4.30997 12.31 4.69997 12.7C5.08997 13.09 5.71997 13.09 6.10997 12.7L11 7.82998V19C11 19.55 11.45 20 12 20C12.55 20 13 19.55 13 19Z"
          />
        </ApolloProvider>
      </SessionProvider>
    </SSRProvider>
  );
};

export default MyApp;
