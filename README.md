This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

Development Environment:

- Run a local CKAN and KeyCloak instance to which you want to connect OPUB front-end.

- Create '.env.local' file in the OPUB project folder with the following:

```
STRAPI_URL='https://dev.strapi.idp.civicdatalab.in'
DATAPIPELINE_URL='http://13.232.239.70/'
CKAN_BASE_URL='https://ndp.ckan.civicdatalab.in'
NEXT_PUBLIC_STRAPI_URL='https://dev.strapi.idp.civicdatalab.in'
NEXT_PUBLIC_BACKEND_URL='https://dev.backend.idp.civicdatalab.in'

BACKEND_URL='https://dev.backend.idp.civicdatalab.in'
NEXT_PUBLIC_AUTH_URL='https://dev.auth.idp.civicdatalab.in'

NEXT_PUBLIC_KEYCLOAK_REALM='external'
NEXT_PUBLIC_KEYCLOAK_BASE_URL='https://dev.kc.idp.civicdatalab.in'
NEXT_PUBLIC_KEYCLOAK_CLIENTID='opub-idp'

KEYCLOAK_BASE_URL='https://dev.kc.idp.civicdatalab.in'
KEYCLOAK_REALM='external'
KEYCLOAK_CLIENTID='opub-idp'
KEYCLOAK_SECRET='YCsLCvO3kNIMcx6tz24jEzAmiHKxpErs'
NEXTAUTH_SECRET='YCsLCvO3kNIMcx6tz24jEzAmiHKxpErs'

NEXT_PUBLIC_TRANSFORMATION_URL='https://dev.pipeline.idp.civicdatalab.in'

NEXTAUTH_URL='http://localhost:3000'
```

- Run the development server:

```bash
npm run dev
# or
yarn dev
```

- Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
