import { Footer, Loader, Navbar } from 'components/common';
import AccessibilityNav from 'components/common/AccessibilityBar/AccessibilityNav';
import LoginRequired from 'components/common/LoginRequired';
import Sidebar from 'components/common/Sidebar';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import React from 'react';
import { useProviderStore, useUserStore } from 'services/store';
import styled from 'styled-components';
import { getOrgDetails, slug } from 'utils/helper';
import { navList } from './navigation';

const DashboardLayout: React.FC = ({ children }) => {
  const router = useRouter();
  const roles = useUserStore((e) => e.access.roles);
  const { org, setOrg } = useProviderStore();
  const { status } = useSession();

  React.useEffect(() => {
    const currentOrg = getOrgDetails(roles, router.query.provider);
    setOrg(currentOrg);
  }, [router.query.provider, roles]);

  const url = `/providers/${slug(org?.org_title)}/dashboard`;
  const sideBarItems = [
    // {
    //   name: 'Analytics',
    //   id: 'analytics',
    //   link: `#`,
    // },
    {
      name: 'Datasets',
      link: `${url}/datasets/drafts`,
      childItems: [
        {
          name: 'My Drafts',
          id: 'drafts',
          link: `${url}/datasets/drafts`,
        },
        {
          name: 'Under Moderation',
          id: 'under-moderation',
          link: `${url}/datasets/under-moderation`,
        },

        {
          name: 'Needs Review',
          id: 'under-review',
          link: `${url}/datasets/under-review`,
        },
        {
          name: 'Published',
          id: 'published',
          link: `${url}/datasets/published`,
        },
        // {
        //   name: 'Create',
        //   id: 'create-new',
        //   link: `${url}/datasets/create-new`,
        // },
      ],
    },
  ] as Array<any>;

  if (org && org?.role === 'DPA') {
    sideBarItems.push(
      ...[
        {
          name: 'Data Providers',
          id: 'providers-management',
          link: `${url}/user-management/providers-management`,

          // childItems: [
          //   {
          //     name: 'Data Providers',
          //     id: 'providers-management',
          //     link: `${url}/user-management/providers-management`,
          //   },
          // {
          //   name: 'Requests Pending',
          //   id: 'provider-requests',
          //   link: `${url}/user-management/provider-requests`,
          // },
          // ],
        },
        {
          name: 'Consumers',
          link: `${url}/consumer-base/access-requests`,
          childItems: [
            {
              name: 'Data Consumers',
              id: 'consumer-list',
              link: `${url}/consumer-base/consumer-list`,
            },
            {
              name: 'Requests Pending',
              id: 'access-requests',
              link: `${url}/consumer-base/access-requests`,
            },
            {
              name: 'Reviews',
              id: 'reviews',
              link: `${url}/consumer-base/reviews`,
            },
          ],
        },
        {
          name: 'Licences',
          id: 'licenses',
          link: `${url}/licenses`,
        },
        {
          name: 'Policies',
          id: 'policy',
          link: `${url}/policy`,
        },
        {
          name: 'Access Models',
          id: 'data-access-model',
          link: `${url}/data-access-model`,
        },
        {
          name: 'API Sources',
          id: 'api-sources',
          link: `${url}/api-sources`,
        },
      ]
    );
  }

  // Push Activity Log to the last
  sideBarItems.push(
    ...[
      {
        name: 'Activity Log',
        id: 'activity',
        link: `${url}/activity`,
      },
    ]
  );

  return (
    <>
      <header className="header-freeze">
        <AccessibilityNav />
        <Navbar data={navList} />
      </header>
      <div style={{ minHeight: '80vh' }}>
        {status === 'unauthenticated' ? (
          <LoginRequired />
        ) : status === 'loading' ? (
          <Loader />
        ) : (
          <Wrapper>
            <Sidebar sideBarItems={sideBarItems} />
            <Content>{children}</Content>
          </Wrapper>
        )}
      </div>
      <Footer />
    </>
  );
};

export default DashboardLayout;

export const Wrapper = styled.div`
  display: flex;
  gap: 16px;

  @media (max-width: 768px) {
    display: block;

    > * {
      flex-grow: 1;
      min-height: fit-content;
    }
  }

  @media (max-width: 640px) {
    > * {
      min-width: 100vw;
    }
  }
`;

export const Content = styled.div`
  display: block;
  flex-grow: 1;
  padding-right: 24px;
  margin-top: 24px;

  @media (max-width: 768px) {
    padding-right: 0;
    margin-top: 20px;
  }
`;
