import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { convertToSearchQuery, fetchFilters } from 'utils/fetch';
import { Breadcrumbs } from 'components/layouts';
import { SearchHeader } from 'components/layouts/Header';
import { DatasetList } from 'components/pages/datasets';
import useEffectOnChange from 'utils/hooks';
import { formatResults } from 'utils/providers.helper';
import { platform_name } from 'platform-constants';

type Props = {
  facets: any;
  variables: any;
};

const Datasets: React.FC<Props> = ({ facets, variables }) => {
  const router = useRouter();
  const {
    q,
    sort_by,
    sort,
    size,
    fq,
    from,
    start_duration,
    end_duration,
    org_types,
    payment_type,
  } = router.query;
  const [search, setSearch] = useState(q);
  const [sorts, setSorts] = useState([sort_by, sort]);
  const [startDuration, setStartDuration] = useState(start_duration);
  const [endDuration, setEndDuration] = useState(end_duration);
  const [items, setItems] = useState(size);
  const [datasetsFilters, setDatasetsFilters] = useState(fq);
  const [pages, setPages] = useState(from);
  const [organisationType, setOrganisationType] = useState(org_types);
  const [paymentType, setPaymentType] = useState(payment_type);

  // If facets are present data would be under hits
  const results = facets?.hits?.hits || facets?.hits;
  const count = facets?.total?.value || facets?.hits?.total?.value;

  useEffectOnChange(() => {
    router.replace(
      {
        pathname: router.pathname,
        query: {
          fq: datasetsFilters,
          q: search,
          sort_by: sorts[0],
          sort: sorts[1],
          size: items,
          from: pages,
          start_duration: startDuration,
          end_duration: endDuration,
          org_types: organisationType,
          payment_type: paymentType,
        },
      },
      null,
      {
        scroll: false,
      }
    );
  }, [
    datasetsFilters,
    search,
    sorts,
    pages,
    startDuration,
    endDuration,
    items,
    organisationType,
    paymentType,
  ]);

  // TODO use array of changes and object for all states
  // USE ZUSTAND!!!
  function handleDatasetsChange(val: any) {
    switch (val.query) {
      case 'q':
        setSearch(val.value);
        setPages('0');
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
        setPages('0');
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
      case 'org_types':
        setOrganisationType(val.value);
        break;
      case 'payment_type':
        setPaymentType(val.value);
        break;
    }
  }

  function handleclear() {
    setSearch('');
  }

  const datasets = React.useMemo(() => {
    return formatResults(results);
  }, [results]);

  return (
    <>
      <Head>
        <title>Datasets | {platform_name} (IDP)</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Breadcrumbs container title="Datasets" />

      <SearchHeader
        defaultValue={q}
        handleDatasetsChange={handleDatasetsChange}
        handleClear={handleclear}
      />
      <main className="containerDesktop">
        {datasets && (
          <DatasetList
            datasets={datasets}
            facets={facets}
            handleDatasetsChange={handleDatasetsChange}
            count={count}
          />
        )}
      </main>
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
  const facets = await fetchFilters(variables);

  return {
    props: {
      facets,
      variables,
    },
  };
};

export default Datasets;
