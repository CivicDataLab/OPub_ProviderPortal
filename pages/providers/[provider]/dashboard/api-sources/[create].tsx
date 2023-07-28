import { useQuery } from '@apollo/client';
import { Loader } from 'components/common';
import { DashboardHeader, Heading } from 'components/layouts';
import { platform_name } from 'platform-constants';
import { LinkButton } from 'components/pages/dashboard/helpers';
import ApiSourceForm from 'components/pages/providers/datasets/CreationFlow/Api/NewApiSource';
import { MainWrapper } from 'components/pages/user/Layout';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { GET_API_SOURCE_BY_ID } from 'services';
import styled from 'styled-components';

const APISourceUpdateSave = () => {
  const router = useRouter();

  // query for API Sources content in case of modify
  const apiIdentifier = router.query.create;

  const GetAPISourceByIDRes: any = useQuery(GET_API_SOURCE_BY_ID, {
    variables: { api_source_id: apiIdentifier },
    skip: isNaN(Number(apiIdentifier)),
  });

  if (
    apiIdentifier !== 'create' &&
    apiIdentifier &&
    !GetAPISourceByIDRes.loading &&
    !GetAPISourceByIDRes.data?.api_source
  )
    toast.error('Error while fetching API Source');

  return (
    <MainWrapper fullWidth>
      <Head>
        <title>Create Base API Source | {platform_name} (IDP)</title>
      </Head>

      <DashboardHeader>
        <Heading variant="h3">Create Base API Source</Heading>
        <LinkButton
          label="Back to Base API Sources"
          href={`/providers/${router.query.provider}/dashboard/api-sources`}
          type="back"
        />
      </DashboardHeader>
      <Content>
        {!GetAPISourceByIDRes.loading ? (
          <ApiSourceForm
            onMutationComplete={() =>
              router.push(
                `/providers/${router.query.provider}/dashboard/api-sources`
              )
            }
            apiData={GetAPISourceByIDRes.data?.api_source}
          />
        ) : (
          <Loader />
        )}
      </Content>
    </MainWrapper>
  );
};

export default APISourceUpdateSave;

const Content = styled.div`
  margin-top: 32px;
`;
