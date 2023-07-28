/** @type {import('next-sitemap').IConfig} */

const siteUrl = 'https://ndp.civicdatalab.in' //Please update the hostname URL before building the site locally

module.exports = {
  siteUrl,
  generateRobotsTxt: true,
  sitemapSize: 500,
  exclude: ['/datasets', '/server-sitemap.xml'], // <= Exclude serverside rendered sitemap as static
  robotsTxtOptions: {
    additionalSitemaps: [
      `${siteUrl}/server-sitemap.xml`, // <==== Add serverside rendered sitemap
    ],
  },
  // (optional)// REST CODE READ DOCS  ...
};
