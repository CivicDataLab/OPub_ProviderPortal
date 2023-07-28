import LoginRequired from 'components/common/LoginRequired';
import { useSession } from 'next-auth/react';

const withAuth = (WrappedComponent) => {
  return (props) => {
    const { status } = useSession();

    if (status === 'unauthenticated') {
      return <LoginRequired />;
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
