import { useQuery } from '@apollo/client';
import { Close, Download, Link as InsertLink } from '@opub-icons/workflow';
import { Modal } from 'components/actions';
import Button from 'components/actions/Button';
import SortFilterListingTable from 'components/common/SortFilterListingTable';
import { DashboardHeader, Heading, NoResult } from 'components/layouts';
import { Flex } from 'components/layouts/FlexWrapper';
import { LinkButton } from 'components/pages/dashboard/helpers';
import { MainWrapper } from 'components/pages/user/Layout';
import Head from 'next/head';
import { Link } from 'components/layouts/Link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { POLICY_BY_ORG } from 'services/schema';
import { useProviderStore } from 'services/store';
import {
  RemarkModalContentWrapper,
  RemarkWrapper,
} from '../datasets/under-review';
import { Text } from 'components/layouts';
import Loader from 'components/common/Loader';
import InfoTags from 'components/actions/InfoTags';
import styled from 'styled-components';
import { platform_name } from 'platform-constants';

const Policy = () => {
  const [currentTab, setCurrentTab] = React.useState<'create' | 'list'>('list');
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 10, behavior: 'smooth' });
    }
  }, [currentTab]);
  const currentOrgRole = useProviderStore((e) => e.org);

  const { data, loading, error } = useQuery(POLICY_BY_ORG, {
    skip: !currentOrgRole?.org_id,
  });

  const policyList = React.useMemo(() => {
    if (data) {
      return data.policy_by_org?.filter((e) => e.title.length);
    }
    return [];
  }, [data]);

  const ColumnHeaders = React.useMemo(
    () => [
      {
        Header: 'Title',
        accessor: 'name',
        disableFilters: true,
        sortType: 'disabled',
        minWidth: 400,
        Cell: ({ row }) => {
          return (
            <Flex justifyContent={'space-between'}>
              <Text variant="pt14b">{row.original?.name}</Text>
              <PolicyWrapper>
                {row.original.remote_url === '' ? (
                  <Button
                    icon={<Download color="var(--color-information)" />}
                    as="a"
                    kind="custom"
                    href={`${process.env.NEXT_PUBLIC_BACKEND_URL}/download/policy/${row.original.id}`}
                  />
                ) : (
                  <Link target="_blank" href={row.original.remote_url} external>
                    <a>
                      <InsertLink color="var(--color-information)" />
                    </a>
                  </Link>
                )}
              </PolicyWrapper>
            </Flex>
          );
        },
      },

      {
        Header: 'Status',
        accessor: 'status',
        disableFilters: true,
        sortType: 'disabled',
        minWidth: 400,
      },
      {
        Header: 'Remark',
        accessor: 'remark',
        disableFilters: true,
        sortType: 'disabled',
        Cell: ({ row }) => {
          const [showRemarkModal, setShowRemarkModal] = useState(false);

          return (
            <RemarkWrapper>
              <Flex justifyContent={'center'}>
                {row.original.remark === '' ? (
                  '-'
                ) : (
                  <Button
                    kind="custom"
                    onPress={() => {
                      setShowRemarkModal(!showRemarkModal);
                    }}
                  >
                    <Link>Show Remark</Link>
                  </Button>
                )}

                <Modal
                  label={''}
                  isOpen={showRemarkModal}
                  modalHandler={() => {
                    setShowRemarkModal(!showRemarkModal);
                  }}
                >
                  <RemarkModalContentWrapper>
                    <Flex
                      flexDirection={'row'}
                      justifyContent="space-between"
                      alignItems={'center'}
                    >
                      <Text as={'h1'}>Remark</Text>
                      <Button
                        kind="custom"
                        icon={<Close />}
                        onPress={() => setShowRemarkModal(!showRemarkModal)}
                      />
                    </Flex>
                    <hr />
                    <Flex marginTop={'5px'}>
                      <Text>{row.original.remark}</Text>
                    </Flex>
                  </RemarkModalContentWrapper>
                </Modal>
              </Flex>
            </RemarkWrapper>
          );
        },
      },
    ],
    []
  );

  const PreparePolicyList = (data) => {
    return data?.map((dataItem) => {
      return {
        name: dataItem.title,
        remote_url: dataItem.remote_url,
        id: dataItem.id,
        status: (
          <InfoTags
            variant={
              dataItem?.status === 'PUBLISHED'
                ? 'success'
                : dataItem?.status === 'REQUESTED'
                ? 'pending'
                : 'failure'
            }
            statusName={dataItem?.status.toLowerCase()}
          />
        ),

        remark: dataItem.reject_reason,
      };
    });
  };

  return (
    <>
      <MainWrapper fullWidth>
        <Head>
          <title>Policy | {platform_name} (IDP)</title>
        </Head>
        <DashboardHeader>
          <Heading variant="h3" as={'h1'}>
            Policies
          </Heading>
          <LinkButton
            label="Request New Policy"
            href={`/providers/${router.query.provider}/dashboard/policy/request`}
            type="create"
          />
        </DashboardHeader>

        {!data?.loading && currentOrgRole?.org_id ? (
          policyList?.length > 0 ? (
            <SortFilterListingTable
              data={PreparePolicyList(policyList)}
              columns={ColumnHeaders}
              title={''}
              globalSearchPlaceholder={'Search Policies'}
            />
          ) : (
            <NoResult label={'No Policies Available'} />
          )
        ) : (
          <Loader loadingText="Loading Policies..." />
        )}
      </MainWrapper>
    </>
  );
};

export default Policy;

const PolicyWrapper = styled.div`
  a {
    padding-right: 20px;
  }
`;
