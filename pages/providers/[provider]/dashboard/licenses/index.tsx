import { useQuery } from '@apollo/client';
import { Download, Link as InsertLink } from '@opub-icons/workflow';
import Button from 'components/actions/Button';
import SortFilterListingTable, {
  ExpanderCell,
} from 'components/common/SortFilterListingTable';
import {
  Box,
  DashboardHeader,
  Heading,
  NoResult,
  TruncateText,
} from 'components/layouts';
import { Flex } from 'components/layouts/FlexWrapper';
import { LinkButton } from 'components/pages/dashboard/helpers';
import { MainWrapper } from 'components/pages/user/Layout';
import Head from 'next/head';
import { Link } from 'components/layouts/Link';
import { useRouter } from 'next/router';
import React from 'react';
import { LICENSES_BY_ORG } from 'services/schema';
import { useProviderStore } from 'services/store';
import { Text } from 'components/layouts';
import Loader from 'components/common/Loader';
import InfoTags from 'components/actions/InfoTags';
import styled from 'styled-components';
import { convertDateFormat } from 'utils/helper';
import { platform_name } from 'platform-constants';

const License = () => {
  const router = useRouter();

  const currentOrgRole = useProviderStore((e) => e.org);

  const { data, loading, error } = useQuery(LICENSES_BY_ORG, {
    skip: !currentOrgRole?.org_id,
  });

  const licenseList = React.useMemo(() => {
    if (data) {
      return data.license_by_org?.filter((e) => e.title.length);
    }
    return [];
  }, [data]);

  const ColumnHeaders = React.useMemo(
    () => [
      {
        Header: 'Licence Title',
        accessor: 'name',
        disableFilters: true,
        sortType: 'disabled',
        Cell: ({ row }) => {
          return (
            <Flex justifyContent={'space-between'}>
              <Text variant="pt14b">{row.original?.name}</Text>
              <LicenceWrapper>
                {row.original.remote_url === '' ? (
                  <Button
                    icon={<Download color="var(--color-information)" />}
                    as="a"
                    target="_blank"
                    kind="custom"
                    href={`${process.env.NEXT_PUBLIC_BACKEND_URL}/download/license/${row.original.id}`}
                  />
                ) : (
                  <Link target="_blank" href={row.original.remote_url} external>
                    <a>
                      <InsertLink color="var(--color-information)" />
                    </a>
                  </Link>
                )}
              </LicenceWrapper>
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
        Header: 'Action',
        accessor: 'action',
        disableFilters: true,
        sortType: 'disabled',
        minWidth: 400,
        Cell: ({ row }) => {
          return (
            <>
              {row.original.status.props.statusName !== 'published' ? (
                <EditWrapper>
                  <Link
                    href={`/providers/${router.query.provider}/dashboard/licenses/${row.original.id}`}
                  >
                    Edit Licence
                  </Link>
                </EditWrapper>
              ) : (
                '-'
              )}
            </>
          );
        },
      },
      {
        Header: 'Details',
        id: 'expander',
        sortType: 'disabled',
        Cell: ({ row }) => {
          return <>{ExpanderCell(row)}</>;
        },
      },
    ],
    []
  );

  const PrepareLicenseList = (data) => {
    return data?.map((dataItem) => {
      return {
        name: dataItem.title,
        remote_url: dataItem.remote_url,
        id: dataItem.id,
        additions: dataItem.licenseaddition_set,
        status: (
          <InfoTags
            variant={
              dataItem?.status === 'PUBLISHED'
                ? 'success'
                : dataItem?.status === 'REQUESTED'
                ? 'pending'
                : 'failure'
            }
            statusName={
              dataItem?.status === 'CREATED'
                ? 'Pending Approval'
                : dataItem?.status.toLowerCase()
            }
          />
        ),
        remark: dataItem.reject_reason,
        expander: (
          <>
            {dataItem?.short_name && (
              <Flex gap="10px " marginBottom={'2px'}>
                <Text variant="pt14b">Licence short title: </Text>
                <Text variant="pt14">{dataItem.short_name}</Text>
              </Flex>
            )}
            <Flex gap="10px " marginBottom={'2px'}>
              {' '}
              <Text variant="pt14b">Description: </Text>
              <Text variant="pt14">{dataItem.description}</Text>
            </Flex>
            <Flex gap="10px " marginBottom={'2px'}>
              {' '}
              <Text variant="pt14b">Created on: </Text>
              <Text variant="pt14">{convertDateFormat(dataItem.issued)}</Text>
            </Flex>
            {dataItem?.status === 'PUBLISHED' && (
              <Flex gap="10px" marginBottom={'2px'}>
                {' '}
                <Text variant="pt14b">Approved on: </Text>
                <Text variant="pt14">
                  {convertDateFormat(dataItem.modified)}
                </Text>
              </Flex>
            )}
            {dataItem?.reject_reason && (
              <Flex gap="10px " marginBottom={'2px'}>
                <Text variant="pt14b">Remark: </Text>
                <Text variant="pt14">{dataItem.reject_reason}</Text>
              </Flex>
            )}
            {dataItem.licenseaddition_set?.length > 0 && (
              <AdditionalTermsTable>
                <table>
                  <tr>
                    <th>Title of Additional T&C</th>
                    <th>Description</th>
                  </tr>
                  {dataItem?.licenseaddition_set?.map((item, index) => {
                    return (
                      <>
                        <tr>
                          <td>
                            <TruncateText linesToClamp={1}>
                              {item.title}
                            </TruncateText>
                          </td>
                          <td>
                            <TruncateText linesToClamp={1}>
                              {item.description}
                            </TruncateText>
                          </td>
                        </tr>
                      </>
                    );
                  })}
                </table>
              </AdditionalTermsTable>
            )}
          </>
        ),
      };
    });
  };

  return (
    <>
      <MainWrapper fullWidth>
        <Head>
          <title>Licences | {platform_name} (IDP)</title>
        </Head>
        <DashboardHeader>
          <Heading variant="h3" as={'h1'}>
            Licences
          </Heading>
          <LinkButton
            label="Request New Licence"
            href={`/providers/${router.query.provider}/dashboard/licenses/request`}
            type="create"
          />
        </DashboardHeader>

        {!data?.loading && currentOrgRole?.org_id ? (
          licenseList?.length > 0 ? (
            <SortFilterListingTable
              data={PrepareLicenseList(licenseList)}
              columns={ColumnHeaders}
              title={''}
              globalSearchPlaceholder={'Search Licence'}
              hasSidebar
            />
          ) : (
            <NoResult label={'No Licenses Available'} />
          )
        ) : (
          <Loader loadingText="Loading Licenses..." />
        )}
      </MainWrapper>
    </>
  );
};

export default License;

const LicenceWrapper = styled.div`
  a {
    padding-right: 20px;
  }
`;

const EditWrapper = styled.div`
  a {
    text-decoration: underline;
    color: var(--color-secondary-01);
    font-size: 14px;
  }
`;

const AdditionalTermsTable = styled.div`
  table {
    width: 100%;
    border-bottom: 1px solid var(--color-gray-02);
    th {
      background-color: var(--color-gray-01);
    }
    th:first-child {
      width: 40%;
    }
  }
`;
