import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import { fetchApiTransformersList, fetchTransformersList } from 'utils/fetch';
import CreateDataset from 'components/pages/providers/CreateDataset';
import CreationFlow from 'components/pages/providers/CreationFlow';
import { platform_name } from 'platform-constants';

const CreateDatasetWrapper = ({ transformerslist, apitransformerslist }) => {
  const router = useRouter();

  // Get the file ID generated from the Redux Store
  const datasetFileID = router.query.datasetId;

  return (
    <div>
      <Head>
        <title>Create Dataset | {platform_name} (IDP)</title>
      </Head>

      {datasetFileID ? (
        <CreationFlow
          datasetFileID={datasetFileID}
          transformerslist={''}
          apitransformerslist={''}
        />
      ) : (
        <CreateDataset />
      )}
    </div>
  );
};

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   context.res.setHeader(
//     'Cache-Control',
//     'public, s-maxage=10, stale-while-revalidate=59'
//   );

//   const transformerslist = await fetchTransformersList();
//   const apitransformerslist = await fetchApiTransformersList();
//   return {
//     props: {
//       transformerslist,
//       apitransformerslist,
//     },
//   };
// };

export default CreateDatasetWrapper;
