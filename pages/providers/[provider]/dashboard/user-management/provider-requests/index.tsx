import { Button, InfoTag, Modal } from 'components/actions';
import { NoResult } from 'components/layouts';
import { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import {
  GET_ORGANIZATION_REQUESTS,
  mutation,
  RESPOND_TO_ORGANIZATION_REQUEST,
} from 'services';
import { MainWrapper } from 'components/pages/user/Layout';
import Head from 'next/head';
import React from 'react';
import { Flex } from 'components/layouts/FlexWrapper';
import { Loader } from 'components/common';
import SortFilterListingTable, {
  formatDateTimeForTable,
} from 'components/common/SortFilterListingTable';
import { dateTimeFormat } from 'utils/helper';
import { useProviderStore } from 'services/store';
import RejectModal from 'components/pages/providers/datasets/CreationFlow/RejectModal';
import { toast } from 'react-toastify';
import { Text } from 'components/layouts';
import {
  RemarkModalContentWrapper,
  RemarkWrapper,
} from '../../datasets/under-review';
import { Link } from 'components/layouts/Link';
import { Close } from '@opub-icons/workflow';
import { platform_name } from 'platform-constants';

const ProvidersRequests = () => {
  const currentOrgRole = useProviderStore((e) => e.org);

  const [showRejectDOM, setRejectDom] = useState({
    clickedItem: '',
    showDom: false,
  });

  const [isLoading, setIsLoading] = useState(false);

  const getOrganizationRequests = useQuery(GET_ORGANIZATION_REQUESTS, {
    skip: !currentOrgRole?.org_id,
  });

  const [RespondToOrgRequestReq, RespondToOrgRequestRes] = useMutation(
    RESPOND_TO_ORGANIZATION_REQUEST
  );

  const RespondToOrgReq = (id, remark, status) => {
    setIsLoading(true);
    mutation(RespondToOrgRequestReq, RespondToOrgRequestRes, {
      organization_request: {
        id: id,
        remark: remark,
        status: status,
      },
    })
      .then((res) => {
        if (res.approve_reject_organization_request.success === true) {
          setIsLoading(false);
          setRejectDom({
            clickedItem: '',
            showDom: false,
          });
          toast.success('Responded to request successfully');
          getOrganizationRequests.refetch();
        } else {
          throw new Error(res.approve_reject_organization_request.errors[0]);
        }
      })
      .catch((err) => {
        setIsLoading(false);
        toast.error('Error in responding to request: ' + err.message);
      });
  };

  const ColumnHeaders = React.useMemo(
    () => [
      {
        Header: 'User',
        accessor: 'username',
        sortType: (a, b) => {
          var b1 = b.values['username'].toLowerCase();
          var a1 = a.values['username'].toLowerCase();
          if (a1 < b1) return 1;
          else if (a1 > b1) return -1;
          else return 0;
        },
        disableFilters: true,
        maxWidth: 200,
        minWidth: 100,
      },
      {
        Header: 'Date of Request',
        accessor: 'created',
        sortType: (a, b) => {
          var a1 = new Date(a.values['created']).getTime();
          var b1 = new Date(b.values['created']).getTime();
          if (a1 < b1) return 1;
          else if (a1 > b1) return -1;
          else return 0;
        },
        disableFilters: true,
        Cell: (props) => {
          return formatDateTimeForTable(props.row.original.created);
        },
      },
      {
        Header: 'Date of Approval/Rejection',
        accessor: 'modified',
        sortType: (a, b) => {
          var a1 = new Date(a.values['modified']).getTime();
          var b1 = new Date(b.values['modified']).getTime();
          if (a1 < b1) return 1;
          else if (a1 > b1) return -1;
          else return 0;
        },
        disableFilters: true,
        Cell: (props) => {
          return props.row.original.modified === '-'
            ? '-'
            : formatDateTimeForTable(props.row.original.modified);
        },
      },
      {
        Header: 'Remarks',
        accessor: 'remark',
        disableFilters: true,
        sortType: 'disabled',
        Cell: ({ row }) => {
          const [showRemarkModal, setShowRemarkModal] = useState(false);
          return (
            <RemarkWrapper>
              <Flex justifyContent={'center'}>
                {row.original.remark === '-' ||
                row.original.remark.length === 0 ? (
                  '-'
                ) : (
                  <Button
                    kind="custom"
                    onPress={() => {
                      setShowRemarkModal(!showRemarkModal);
                    }}
                  >
                    <Link>
                      Remarks by{' '}
                      {row.original.status === 'REJECTED'
                        ? 'Provider Admin'
                        : 'User'}
                    </Link>
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
                      <Text as={'h1'}>Remarks</Text>
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
      {
        Header: 'Action',
        accessor: 'actionable',
        disableFilters: true,
        sortType: 'disabled',
        minWidth: 400,
      },
    ],
    []
  );

  const prepareOrgReqList = (orgReqList) => {
    return orgReqList.map((orgReqItem) => {
      return {
        username: orgReqItem.user,
        remark:
          orgReqItem.status === 'REJECTED'
            ? orgReqItem.remark
            : orgReqItem.description,
        status: orgReqItem.status,
        created: dateTimeFormat(orgReqItem.issued),
        modified:
          orgReqItem.status === 'REQUESTED'
            ? '-'
            : dateTimeFormat(orgReqItem.modified),
        actionable:
          orgReqItem.status === 'REQUESTED' ? (
            <>
              <Flex
                gap="15px"
                flexWrap={'wrap'}
                alignItems={'center'}
                justifyContent={'center'}
              >
                <Button
                  onPress={() => {
                    RespondToOrgReq(orgReqItem.id, '', 'APPROVED');
                  }}
                  kind="primary"
                  title="Accept the Request"
                >
                  Accept
                </Button>
                <Button
                  onPress={() => {
                    setRejectDom({
                      clickedItem: orgReqItem.id,
                      showDom: !showRejectDOM.showDom,
                    });
                  }}
                  kind="primary-outline"
                  title="Reject the Request"
                >
                  Reject
                </Button>
              </Flex>
              <RejectModal
                isModalOpen={
                  showRejectDOM.showDom &&
                  showRejectDOM.clickedItem === orgReqItem.id
                }
                onCancel={() => {
                  setRejectDom({
                    clickedItem: '',
                    showDom: !showRejectDOM.showDom,
                  });
                }}
                onSubmit={(reason) => {
                  RespondToOrgReq(orgReqItem.id, reason, 'REJECTED');
                }}
              />
            </>
          ) : (
            <>
              <Flex alignItems={'center'} justifyContent={'center'}>
                <InfoTag
                  variant={
                    orgReqItem.status === 'REJECTED' ? 'failure' : 'success'
                  }
                  statusName={orgReqItem.status.toLowerCase()}
                />
              </Flex>
            </>
          ),
      };
    });
  };

  return (
    <MainWrapper fullWidth>
      <Head>
        <title>Requests Pending | {platform_name} (IDP)</title>
      </Head>

      {getOrganizationRequests.loading ||
      isLoading ||
      !currentOrgRole?.org_id ? (
        <Loader />
      ) : getOrganizationRequests.data?.all_organization_requests?.filter(
          (item) => item.organization.id === currentOrgRole?.org_id
        )?.length > 0 ? (
        <SortFilterListingTable
          data={prepareOrgReqList(
            getOrganizationRequests.data?.all_organization_requests.filter(
              (item) => item.organization.id === currentOrgRole?.org_id
            )
          )}
          columns={ColumnHeaders}
          title={'Requests Pending'}
          globalSearchPlaceholder={'Search requests'}
        />
      ) : (
        <NoResult label="No Pending Requests Yet" />
      )}
    </MainWrapper>
  );
};

export default ProvidersRequests;
