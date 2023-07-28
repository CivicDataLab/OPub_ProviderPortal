import { DashboardHeader, Heading } from 'components/layouts';
import { MainWrapper } from 'components/pages/user/Layout';
import Head from 'next/head';
import { platform_name } from 'platform-constants';

const OrganizationInfo = () => {
  return (
    <MainWrapper fullWidth>
      <Head>
        <title>Organization Info | {platform_name} (IDP)</title>
      </Head>
      <DashboardHeader>
        <Heading variant="h3">Organization Info</Heading>
      </DashboardHeader>
    </MainWrapper>
  );
};

export default OrganizationInfo;
