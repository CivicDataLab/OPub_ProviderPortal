const nextTranslate = require('next-translate-plugin');
const nextBuildId = require('next-build-id');
const withTM = require('next-transpile-modules')([
  'echarts',
  'zrender',
  'react-simple-captcha',
]);
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const ContentSecurityPolicy = `
  default-src 'self' 'unsafe-inline' 'unsafe-eval' data: dev.idp.nic.in strapi-dev.idp.nic.in backend-dev.idp.nic.in auth-dev.idp.nic.in pipeline-dev.idp.nic.in kc-dev.idp.nic.in;
`;

// script-src 'self';
// child-src example.com;
// style-src 'self' example.com;
// font-src 'self';

const nextConfig = {
  headers: async () => {
    return [
      {
        source: '/:path*',
        headers: [
          // {
          //   key: 'Cache-Control',
          //   value: 'public, s-maxage=10, stale-while-revalidate=59',
          // },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          // {
          //   key: 'Content-Security-Policy',
          //   value: ContentSecurityPolicy.replace(/\s{2,}/g, ' ').trim()
          // },
        ],
      },
    ];
  },
  generateBuildId: async () => {
    const fromGit = await nextBuildId({ dir: __dirname });
    return fromGit;
  },
  compiler: {
    styledComponents: true,
  },
  images: {
    domains: [
      `${process.env.STRAPI_DOMAIN}`,
      `${process.env.NEXT_PUBLIC_STRAPI_DOMAIN}`,
      `${process.env.BACKEND_DOMAIN}`,
      `${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}`,
      `${process.env.NEXT_PUBLIC_BACKEND_URL}`,
    ],
    formats: ['image/webp'],
  },
};

module.exports = buildConfig = (_phase) => {
  const plugins = [withBundleAnalyzer, withTM, nextTranslate];
  const config = plugins.reduce((acc, plugin) => plugin(acc), {
    ...nextConfig,
  });
  return config;
};
