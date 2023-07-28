import styled from 'styled-components';
import { Heading } from '../Heading';
import { ResourceCardButton } from './ResourceCardButton';
import { useConstants } from 'services/store';
import dynamic from 'next/dynamic';
import { useQuery } from '@apollo/client';
import { GET_DATASET_BY_SLUG, GET_DISTRIBUTION_SPEC } from 'services';
import { Preview } from './Preview';
import router from 'next/router';
import { useSelector } from 'react-redux';
import { RootState } from 'Store';
import { Button } from 'components/actions';

const ApiDetails = dynamic(
  () => import('./ApiDetails').then((e) => e.ApiDetails),
  {
    ssr: false,
    loading: () => (
      <Button isDisabled={true} kind="primary-outline" size="sm">
        API Details
      </Button>
    ),
  }
);

type Props = {
  data: any;
  resActions?: boolean;
  hasAgreed?: boolean;
  request?: boolean;
};

export const ResourceCard = ({
  data,
  resActions = true,
  hasAgreed,
  request,
}: Props) => {
  const datasetStore = useSelector((state: RootState) => state.addDataset);

  const datasetName = (router.query.explorer as string) || datasetStore?.slug;

  const res = useQuery(GET_DATASET_BY_SLUG, {
    variables: {
      dataset_slug: datasetName,
      skip: !datasetName,
    },
  });

  const formatIcons = useConstants((e) => e.formatIcons);

  const GetDistSpecRes =
    resActions &&
    useQuery(GET_DISTRIBUTION_SPEC, {
      variables: {
        resource_id: data.resourceId,
        dataset_access_model_request_id: data.damReqId,
        dataset_access_model_resource_id: data.damResourceId,
      },
      skip: !data.resourceId && !data.damReqId && !data.damResourceId,
    });

  const format = data.file_details
    ? data.file_details.format
    : data.api_details.response_type;

  return (
    <Wrapper>
      <div>
        {formatIcons[format]}

        <Heading as="h4" variant="h5" marginY={'auto'}>
          {data.title}
        </Heading>
      </div>

      <Buttons>
        <Preview
          data={data}
          schema={
            res?.data === undefined
              ? ''
              : res?.data?.dataset_by_slug?.resource_set
          }
        />
        {resActions && (
          <ApiDetails
            hasAgreed={hasAgreed}
            request={request}
            damStatus={data.damStatus}
            spec={
              GetDistSpecRes.data?.data_spec &&
              JSON.parse(GetDistSpecRes.data?.data_spec)?.spec
            }
          />
        )}
        {resActions && (
          <ResourceCardButton
            data={data}
            hasAgreed={hasAgreed}
            request={request}
            data_token={
              GetDistSpecRes.data?.data_spec &&
              JSON.parse(GetDistSpecRes.data?.data_spec)?.data_token
            }
          />
        )}
      </Buttons>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px;
  justify-content: space-between;

  > div:first-of-type {
    display: flex;
    gap: 8px;
    flex-basis: 240px;
    flex-grow: 1;
  }

  > div > svg {
    min-width: 48px;
  }
`;

const Buttons = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  justify-content: flex-end;

  min-width: 232px;

  @media (max-width: 640px) {
    > * {
      flex-grow: 1;
      width: 47%;

      > div {
        width: 100%;
      }
    }
  }
`;
