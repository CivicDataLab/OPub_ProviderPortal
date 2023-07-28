import { Pagination } from 'components/data';
import { Breadcrumbs, Header, NoResult } from 'components/layouts';
import { OrgCard } from 'components/pages/providers/OrgCard';
import { GetServerSideProps } from 'next';
import useTranslation from 'next-translate/useTranslation';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import styled from 'styled-components';
import { fetchProviders } from 'utils/fetch';
import useEffectOnChange from 'utils/hooks';
import { platform_name } from 'platform-constants';

type Props = {
  providersList: any;
};

const Orgs: React.FC<Props> = ({ providersList }) => {
  const { t } = useTranslation('providers');
  const router = useRouter();
  const { q, size, from } = router.query;
  const [pages, setPages] = useState(from);
  const [items, setItems] = useState(size);
  const [query, setQuery] = useState(q);

  const headerData = {
    title: t('all-data-providers'),
    search: true,
    searchPlaceholder: 'Search Entities',
  };

  function handleProvidersChange(val: any) {
    switch (val.query) {
      case 'from':
        setPages(val.value);
        break;
      case 'size':
        setItems(val.value);
        break;
    }
  }

  useEffectOnChange(() => {
    router.replace({
      pathname: router.pathname,
      query: {
        q: query || '',
        size: items || '6',
        from: pages || '0',
      },
    });
  }, [query, pages, items]);

  const results = providersList?.hits?.hits || providersList?.hits;
  const count =
    providersList?.total?.value || providersList?.hits?.total?.value;
  ``;

  const organizationData = results.map((item) => ({
    title: item._source.org_title,
    description: item._source.org_description,
    homepage: item._source.homepage,
    contact_email: item._source.contact,
    logo: item._source.logo,
    dataset_count: item._source.dataset_count,
    user_count: item._source.user_count,
    average_rating: item._source.average_rating,
    redirect_url: `/providers/${item._source.org_title}_${item._source.id}`,
    package_count: item._source.dataset_count,
    type: item._source.type,
  }));

  return (
    <>
      <Head>
        <title>Providers | {platform_name} (IDP)</title>
      </Head>

      <Breadcrumbs container title={t('breadcrumb-title-providers')} />

      <Header data={headerData} />
      <ListWrapper>
        <main className="containerDesktop">
          <List>
            {organizationData &&
              organizationData?.map((item, index) => {
                return (
                  <li key={`list-${index}`} className="list__item">
                    <OrgCard data={item} />
                  </li>
                );
              })}
          </List>

          {count ? (
            <Pagination
              total={count}
              newPage={handleProvidersChange}
              MultipleSort="6"
            />
          ) : (
            <NoResult />
          )}
        </main>
      </ListWrapper>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  context.res.setHeader(
    'Cache-Control',
    'public, s-maxage=10, stale-while-revalidate=59'
  );

  const query = context.query || {};

  const providersList = await fetchProviders(
    query.q as string,
    query.size as string,
    query.from as string
  );

  return {
    props: {
      providersList,
    },
  };
};

export default Orgs;

const List = styled.ul`
  display: grid;
  gap: 16px;
  margin-block: 32px;
  align-items: stretch;

  grid-template-columns: repeat(auto-fit, minmax(min(350px, 100%), 1fr));
`;

const ListWrapper = styled.div`
  margin-bottom: 30px;
`;
