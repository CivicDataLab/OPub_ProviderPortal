import { getServerSideSitemap } from 'next-sitemap';
import { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async (context) => {
  context.res.setHeader(
    'Cache-Control',
    'public, s-maxage=10, stale-while-revalidate=59'
  );

  // Method to source urls from cms
  const siteUrl = context.req.headers.host;

  const response = await fetch(`${process.env.BACKEND_URL}/search`);

  const apiResDatasets = await response.json();

  const fields = apiResDatasets?.hits.map((dataset) => {
    return {
      loc: `https://${siteUrl}/datasets/${dataset?._source?.dataset_title
        .replaceAll(/\s+/g, '-')
        .toLowerCase()}`,
      // lastmod: new Date().toISOString(),
      // changefreq
      // priority
    };
  });

  return getServerSideSitemap(context, fields);
};

// Default export to prevent next.js errors
export default function ServerSitemap() {}
