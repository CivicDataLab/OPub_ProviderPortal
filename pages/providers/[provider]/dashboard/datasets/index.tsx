import React, { useEffect } from 'react';
import { useRouter } from 'next/router';

const DataPipeline = () => {
  const router = useRouter();

  useEffect(() => {
    router.push(
      `/providers/${router.query.provider}/dashboard/datasets/drafts`
    );
  }, []);
  return <></>;
};

export default DataPipeline;
