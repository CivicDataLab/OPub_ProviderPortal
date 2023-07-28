import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { convertToSearchQuery } from 'utils/fetch';
import { Breadcrumbs } from 'components/layouts';
import { DatasetList } from 'components/pages/datasets';
import { fetchOrgFilters, formatResults } from 'utils/providers.helper';
import { useQuery } from '@apollo/client';
import { IntroCard } from 'components/pages/providers/IntroCard';
import { platform_name } from 'platform-constants';
import { GET_ORGANIZATION_PROVIDER_PAGE } from 'services';

type Props = {
  facets: any;
};

const Provider: React.FC<Props> = ({ facets }) => {
  const router = useRouter();

  const organisationId = router.query.provider.slice(
    router.query.provider.lastIndexOf('_') + 1
  );

  const organizationResponse = useQuery(GET_ORGANIZATION_PROVIDER_PAGE, {
    variables: {
      organization_id: organisationId,
    },
  });

  const orgDetails =
    organizationResponse?.data &&
    organizationResponse?.data?.published_organization_by_id;

  const { q, sort_by, sort, size, fq, from, start_duration, end_duration } =
    router.query;
  const [search, setSearch] = useState(q);
  const [sorts, setSorts] = useState([sort_by, sort]);
  const [items, setItems] = useState(size);
  const [startDuration, setStartDuration] = useState(start_duration);
  const [endDuration, setEndDuration] = useState(end_duration);
  const [datasetsFilters, setDatasetsFilters] = useState(fq);
  const [pages, setPages] = useState(from);

  const count = facets?.total?.value || facets?.hits?.total?.value;
  const results = facets?.hits?.hits;

  useEffect(() => {
    router.replace({
      pathname: `/providers/${router.query.provider}`,
      query: {
        fq: datasetsFilters,
        q: search,
        sort_by: sorts[0],
        sort: sorts[1],
        size: items,
        from: pages,
        start_duration,
        end_duration,
      },
    });
  }, [
    datasetsFilters,
    search,
    sorts,
    pages,
    startDuration,
    endDuration,
    items,
  ]);

  function handleDatasetsChange(val: any) {
    switch (val.query) {
      case 'q':
        setSearch(val.value);
        break;
      case 'sort':
        val.value === ''
          ? setSorts(['modified', 'asc'])
          : setSorts([
              val.value[0] || '',
              val.value.length > 1 ? val.value[1] : '',
            ]);
        break;
      case 'size':
        setItems(val.value);
        break;
      case 'fq':
        setDatasetsFilters(val.value);
        break;
      case 'from':
        setPages(val.value);
        break;
      case 'start_duration':
        setStartDuration(val.value);
        break;
      case 'end_duration':
        setEndDuration(val.value);
        break;
    }
  }

  // *  convert results from elastic search to what is accepted by component
  const datasets = React.useMemo(() => {
    return formatResults(results);
  }, [results]);

  return (
    <>
      <Head>
        <title>
          {orgDetails?.title} | {platform_name}
        </title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Breadcrumbs container title={orgDetails?.title} />

      <IntroCard data={orgDetails} />

      <Wrapper className="container">
        {datasets && (
          <DatasetList
            datasets={datasets}
            facets={facets}
            handleDatasetsChange={handleDatasetsChange}
            count={count}
          />
        )}
      </Wrapper>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  context.res.setHeader(
    'Cache-Control',
    'public, s-maxage=10, stale-while-revalidate=59'
  );

  const query = context.query || {};
  const variables = convertToSearchQuery(query);
  const facets = await fetchOrgFilters(
    variables,
    query.provider.slice(0, query.provider.lastIndexOf('_'))
  );

  return {
    props: {
      facets,
      variables,
    },
  };
};

export default Provider;

const Wrapper = styled.main``;
