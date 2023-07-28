import { useMutation, useQuery } from '@apollo/client';
import { CheckmarkCircle, CloseCircle } from '@opub-icons/workflow';
import { Button } from 'components/actions';
import InfoTags from 'components/actions/InfoTags';
import { Loader } from 'components/common';
import SortFilterListingTable, {
  formatDateTimeForTable,
  SelectColumnFilter,
} from 'components/common/SortFilterListingTable';
import {
  DashboardHeader,
  Heading,
  NoResult,
  TruncateText,
} from 'components/layouts';
import { Flex } from 'components/layouts/FlexWrapper';
import { Link } from 'components/layouts/Link';
import RejectModal from 'components/pages/providers/datasets/CreationFlow/RejectModal';
import { MainWrapper } from 'components/pages/user/Layout';
import Head from 'next/head';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import {
  GET_ALL_DATA_ACCESS_MODEL_REQUEST_LIST_BY_ORG,
  mutation,
  RESPOND_TO_DATA_ACCESS_MODEL_REQUEST,
} from 'services';
import { useConstants, useProviderStore } from 'services/store';
import { capitalizeFirstLetter, dateTimeFormat } from 'utils/helper';
import { LogoContainer } from '../../datasets/drafts';
import { platform_name } from 'platform-constants';
import ViewProfile from 'components/pages/viewprofile';

const ProviderRequestList = () => {
  const [showRejectDOM, setRejectDom] = useState({
    clickedItem: '',
    showDom: false,
  });
  const [rejectionConsumerMsg, setRejectionConsumerMsg] = useState('');
  const currentOrgRole = useProviderStore((e) => e.org);
  const datasetTypeIcons = useConstants((e) => e.datasetTypeIcons);

  const getAllDataAccessModelRequestsListRes = useQuery(
    GET_ALL_DATA_ACCESS_MODEL_REQUEST_LIST_BY_ORG,
    {
      skip: !currentOrgRole?.org_id,
    }
  );

  const [approveRejectDataAccessModelReq, approveRejectDataAccessModelRes] =
    useMutation(RESPOND_TO_DATA_ACCESS_MODEL_REQUEST);

  const approveDataRequest = (reqId) => {
    mutation(approveRejectDataAccessModelReq, approveRejectDataAccessModelRes, {
      data_access_model_request: {
        id: reqId,
        status: 'APPROVED',
      },
    })
      .then((res) => {
        if (res?.approve_reject_data_access_model_request?.success) {
          toast.success('Success in Grant Access');
          getAllDataAccessModelRequestsListRes.refetch();
        }
      })
      .catch(() => {
        toast.error('Failed to Grant Access');
      });
  };

  const rejectDataRequest = (reqId, message) => {
    mutation(approveRejectDataAccessModelReq, approveRejectDataAccessModelRes, {
      data_access_model_request: {
        id: reqId,
        status: 'REJECTED',
        remark: message,
      },
    })
      .then((res) => {
        if (res?.approve_reject_data_access_model_request?.success) {
          setRejectDom({
            clickedItem: '',
            showDom: !showRejectDOM.showDom,
          });
          toast.success('Access Rejected');
          getAllDataAccessModelRequestsListRes.refetch();
        }
      })
      .catch((err) => {
        toast.error('Failed to process the request. ' + err.message);
      });
  };

  const getAccessReqDataList = (DAMReqList) => {
    return DAMReqList.map((DAMReqItem) => {
      return {
        logo: datasetTypeIcons[
          DAMReqItem.access_model.dataset.dataset_type?.toLowerCase()
        ]?.image,
        name: DAMReqItem.user || 'Anonymous User',
        slug: DAMReqItem.access_model.dataset.slug,
        dataset: DAMReqItem.access_model.dataset.title,
        description:
          DAMReqItem.status === 'REJECTED'
            ? DAMReqItem.remark || 'NA'
            : DAMReqItem.description || 'NA',
        purpose: capitalizeFirstLetter(DAMReqItem.purpose.toLowerCase()),
        modified: dateTimeFormat(DAMReqItem.modified),
        status: (
          <>
            {DAMReqItem.status !== 'REQUESTED' ? (
              <Flex gap="5px" alignItems="center" flexDirection={'column'}>
                <InfoTags
                  variant={
                    DAMReqItem.status === 'APPROVED' ? 'success' : 'failure'
                  }
                  statusName={DAMReqItem.status.toLowerCase()}
                />
              </Flex>
            ) : (
              <>
                <Flex
                  gap="15px"
                  alignItems="center"
                  justifyContent={'center'}
                  flexWrap={'wrap'}
                >
                  <Button
                    onPress={() => {
                      approveDataRequest(DAMReqItem.id);
                    }}
                    kind="custom"
                    icon={
                      <CheckmarkCircle
                        color={'var(--color-success)'}
                        size={'21px'}
                      />
                    }
                    iconOnly
                    title="Approve the Data Access Request"
                  >
                    Grant Access
                  </Button>
                  <Button
                    onPress={() => {
                      setRejectDom({
                        clickedItem: DAMReqItem.id,
                        showDom: !showRejectDOM.showDom,
                      });
                    }}
                    kind="custom"
                    icon={
                      <CloseCircle
                        color={'var(--color-warning)'}
                        size={'21px'}
                      />
                    }
                    iconOnly
                    title="Reject the Data Access Request"
                  >
                    Reject
                  </Button>
                </Flex>
                <RejectModal
                  isModalOpen={
                    showRejectDOM.showDom &&
                    showRejectDOM.clickedItem === DAMReqItem.id
                  }
                  onCancel={() => {
                    setRejectDom({
                      clickedItem: '',
                      showDom: !showRejectDOM.showDom,
                    });
                  }}
                  onSubmit={(msg) => {
                    rejectDataRequest(DAMReqItem.id, msg);
                  }}
                />
              </>
            )}
          </>
        ),
      };
    });
  };

  const list = getAllDataAccessModelRequestsListRes.data
    ?.data_access_model_request_org
    ? getAllDataAccessModelRequestsListRes.data?.data_access_model_request_org
    : [];

  const ColumnHeaders = React.useMemo(
    () => [
      {
        Header: 'Dataset Title',
        accessor: 'dataset',
        sortType: 'alphanumeric',
        Filter: SelectColumnFilter,
        filter: 'includes',
        Cell: ({ row }) => (
          <>
            <LogoContainer>{row.original.logo}</LogoContainer>
            <Link target="_blank" href={`/datasets/${row.original.slug}`}>
              {row.original.dataset}
            </Link>
          </>
        ),
      },
      {
        Header: 'Name',
        accessor: 'name',
        sortType: (a, b) => {
          var a1 = a.values['name'].toLowerCase();
          var b1 = b.values['name'].toLowerCase();
          if (a1 < b1) return 1;
          else if (a1 > b1) return -1;
          else return 0;
        },
        Filter: SelectColumnFilter,
        filter: 'includes',
        Cell: (props) => {
          return <ViewProfile username={props.row.original.name} />;
        },
      },
      {
        Header: 'Purpose',
        accessor: 'purpose',
        sortType: 'alphanumeric',
        Filter: SelectColumnFilter,
        filter: 'includes',
      },
      // {
      //   Header: 'Remark',
      //   accessor: 'description',
      //   sortType: (a, b) => {
      //     var a1 = a.values['description'].toLowerCase();
      //     var b1 = b.values['description'].toLowerCase();
      //     if (a1 < b1) return 1;
      //     else if (a1 > b1) return -1;
      //     else return 0;
      //   },
      //   disableFilters: true,
      //   maxWidth: 200,
      //   minWidth: 100,
      //   Cell: ({ row }) => (
      //     <TruncateText linesToClamp={2} title={`${row.original.description}`}>
      //       {row.original.description}
      //     </TruncateText>
      //   ),
      // },
      {
        Header: 'Date of Request',
        accessor: 'modified',
        sortType: (a, b) => {
          var a1 = new Date(a.values['modified']).getTime();
          var b1 = new Date(b.values['modified']).getTime();
          if (a1 < b1) return 1;
          else if (a1 > b1) return -1;
          else return 0;
        },
        Cell: (props) => {
          return formatDateTimeForTable(props.row.original.modified);
        },
        Filter: SelectColumnFilter,
        filter: 'includes',
      },
      {
        Header: 'Actions',
        accessor: 'status',
        disableFilters: true,
        sortType: 'disabled',
        width: 100,
      },
    ],
    []
  );

  return (
    <MainWrapper fullWidth>
      <Head>
        <title>Pending Dataset Access Requests | {platform_name} (IDP)</title>
      </Head>
      <DashboardHeader>
        <Heading as={'h1'} variant="h3" paddingBottom={'24px !important'}>
          Pending Dataset Access Requests
        </Heading>
      </DashboardHeader>
      {!getAllDataAccessModelRequestsListRes.loading &&
      currentOrgRole?.org_id ? (
        list.filter(
          (DAMReqItem) =>
            DAMReqItem.access_model?.data_access_model?.type === 'RESTRICTED' &&
            DAMReqItem.status === 'REQUESTED'
        )?.length > 0 ? (
          <SortFilterListingTable
            data={getAccessReqDataList(
              list.filter(
                (DAMReqItem) =>
                  DAMReqItem.access_model?.data_access_model?.type ===
                    'RESTRICTED' && DAMReqItem.status === 'REQUESTED'
              )
            )}
            columns={ColumnHeaders}
            title=""
            globalSearchPlaceholder="Search requests"
          />
        ) : (
          <NoResult label={'No Pending Data Access Requests yet'} />
        )
      ) : (
        <Loader />
      )}
    </MainWrapper>
  );
};

export default ProviderRequestList;
