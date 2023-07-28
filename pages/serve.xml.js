import { getServerSideSitemap } from 'next-sitemap';

export default function Sitemap() {}

export async function getServerSideProps(context) {
  const query = context.query || {};
  const variables = {};

  const data = await fetchDatasets(variables).then((res) => {
    // Convert the Image filenames to URLs
    res.result.results.forEach((element) => {
      element.organization.image_url =
        `${process.env.CKAN_BASE_URL}/uploads/group/` +
        element.organization.image_url;
    });
    return res;
  });

  const allUrls = data.results.map((dataItem) => {
    return {
      author: dataItem.author || '',
      loc: `/datasets/${dataItem.id}`,
      lastmod: new Date(dataItem.metadata_modified).toISOString(),
      description: dataItem.notes,
      tags: dataItem.tags,
      title: dataItem.title,
    };
  });

  return await getServerSideSitemap(context, allUrls);
}
