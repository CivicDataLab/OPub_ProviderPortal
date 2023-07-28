import { Footer, Loader, Navbar } from 'components/common';
import AccessibilityNav from 'components/common/AccessibilityBar/AccessibilityNav';
import LoginRequired from 'components/common/LoginRequired';
import Sidebar from 'components/common/Sidebar';
import { useSession } from 'next-auth/react';
import React from 'react';
import { useUserStore } from 'services/store';
import styled from 'styled-components';
import { navList } from './navigation';

const ConsumerDashboardLayout: React.FC = ({ children }) => {
  const url = `/user`;
  const { status } = useSession();
  const user = useUserStore((e) => e.user);

  const sideBarItems = [
    {
      name: 'My Profile',
      id: 'profile',
      link: `${url}/profile`,
    },
    {
      name: 'My Entities',
      id: 'entities',
      link: `${url}/entities`,
    },
    {
      name: 'My Datasets',
      id: 'my-datasets',
      link: `${url}/my-datasets`,
    },
    {
      name: 'Activity Log',
      id: 'activity',
      link: `${url}/activity`,
    },
    // {
    //   name: 'Banner',
    //   id: 'banner',
    //   linkfind: `${url}/organizations?action=find`,
    //   linkreq: `${url}/organizations?action=request`,
    // },
  ];

  return (
    <>
      <header className="header-freeze">
        <AccessibilityNav />
        <Navbar data={navList} />
      </header>
      {status === 'unauthenticated' ? (
        <LoginRequired />
      ) : status === 'loading' ? (
        <Loader />
      ) : (
        <>
          <Wrapper>
            <Sidebar sideBarItems={sideBarItems} />
            <Content>{children}</Content>
          </Wrapper>
        </>
      )}
      <Footer />
    </>
  );
};

export default ConsumerDashboardLayout;

const Wrapper = styled.div`
  display: flex;
  gap: 24px;

  @media (max-width: 768px) {
    flex-wrap: wrap;

    > * {
      flex-grow: 1;
      min-height: fit-content;
    }
  }
`;

const Content = styled.div`
  display: block;
  flex-grow: 1;
  padding-right: 24px;
  margin-top: 24px;

  @media (max-width: 768px) {
    padding-right: 0;
  }
`;
