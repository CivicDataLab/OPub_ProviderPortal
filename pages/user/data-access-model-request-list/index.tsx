import { DashboardHeader, Heading } from 'components/layouts';
import { DataAccessModelRequest } from 'components/pages/data-access-model-request-list/DataAccessModelRequest';
import { MainWrapper } from 'components/pages/user/Layout';
import Head from 'next/head';
import withAuth from 'utils/withAuth';
import { platform_name } from 'platform-constants';

const DataAccessModelRequestList = () => {
  return (
    <>
      <Head>
        <title>Requested Access | {platform_name} (IDP)</title>
      </Head>

      <MainWrapper fullWidth>
        <DashboardHeader>
          <Heading variant="h3">My Requests</Heading>
        </DashboardHeader>

        <DataAccessModelRequest />
      </MainWrapper>
    </>
  );
};

export default withAuth(DataAccessModelRequestList);
