import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { convertToSearchQuery } from 'utils/fetch';
import { useQuery } from '@apollo/client';
import { Breadcrumbs } from 'components/layouts';
import { DatasetList } from 'components/pages/datasets';
import { IntroCard } from 'components/pages/providers/IntroCard';
import { platform_name } from 'platform-constants';
import { GET_SECTOR_BY_TITLE } from 'services';
import { fetchSectorFilters, formatResults } from 'utils/providers.helper';

type Props = {
  facets: any;
  sectorDetails: any;
};

const Sector: React.FC<Props> = ({ facets }) => {
  const router = useRouter();

  const sectorTitle = router.query.sector as string;
  const formattedSectorTitle = sectorTitle;

  const sectorDetailsRes = useQuery(GET_SECTOR_BY_TITLE, {
    variables: {
      sector_title: formattedSectorTitle,
    },
  });

  const sectorDetails = sectorDetailsRes?.data &&
    sectorDetailsRes?.data?.sector_by_title && {
      ...sectorDetailsRes?.data?.sector_by_title,
    };

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
      pathname: `/sectors/${router.query.sector}`,
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
          {sectorDetails?.title || formattedSectorTitle} | {platform_name}
        </title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Breadcrumbs
        container
        title={sectorDetails?.title || formattedSectorTitle}
      />

      <IntroCard data={sectorDetails} />

      <Wrapper className="containerDesktop">
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
  const facets = await fetchSectorFilters(variables, query.sector);

  return {
    props: {
      facets,
      variables,
    },
  };
};

export default Sector;

const Wrapper = styled.main``;
