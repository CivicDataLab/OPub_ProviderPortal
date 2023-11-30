import { getInternalGraphQLClient } from 'apollo-client';
import {
  HomeAbout,
  HomeBanner,
  HomeCarousel,
  HomeDiscover,
  HomeExplore,
  HomeHeader,
  HomeProviders,
} from 'components/pages/home';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { platform_name } from 'platform-constants';
import { GET_ALL_STATS_COUNT } from 'services';
import {
  // featchPopularSearches,
  fetchFeaturedDatasets,
  fetchPartnersDatasets,
  fetchUserCount,
} from 'utils/fetch';

const Home = ({
  users,
  statsCount,
  featuredDatasets,
  // popularSearches,
  partnersData,
  homeBannerImages,
}) => {
  return (
    <>
      <Head>
        <title>{platform_name} (IDP)</title>
      </Head>
      <main>
        <HomeCarousel homeBannerImages={homeBannerImages} />
        <HomeHeader
          users={users}
          statsData={statsCount}
          // popularSearches={popularSearches}
        />
        <HomeExplore />
        <HomeAbout />
        <HomeDiscover featuredDatasets={featuredDatasets} />
        <HomeProviders data={partnersData} />
        <HomeBanner />
      </main>
    </>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps = async (context) => {
  context.res.setHeader(
    'Cache-Control',
    'public, s-maxage=10, stale-while-revalidate=59'
  );

  const client = getInternalGraphQLClient;
  const { data } = await client.query({ query: GET_ALL_STATS_COUNT });
  const featuredDatasets = await fetchFeaturedDatasets();
  const usersCount = await fetchUserCount();
  // const popularSearches = await featchPopularSearches();
  const partnersData = await fetchPartnersDatasets();

  const homeBanners = await fetch(`${process.env.STRAPI_URL}/banner-images`)
    .then((res) => {
      return res.json();
    })
    .catch((err) => {
      console.error('Fetching Home banner images: ', err);
    });

  return {
    props: {
      users: usersCount.user_count,
      statsCount: data.stat_count,
      featuredDatasets: featuredDatasets || [],
      // popularSearches: popularSearches || [],
      partnersData: partnersData || [],
      homeBannerImages: homeBanners || [],
    },
  };
};
