import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { NoResult, TruncateText } from 'components/layouts';
import { Button, Modal } from 'components/actions';
import { useRouter } from 'next/router';
import { useMutation, useQuery } from '@apollo/client';
import {
  ADDRESS_MODERATION_REQ,
  mutation,
  RESPOND_TO_REVIEW_REQUEST,
} from 'services';
import { Flex } from 'components/layouts/FlexWrapper';
import { useConstants, useProviderStore } from 'services/store';
import { GET_REVIEW_REQUEST_USER } from 'services';
import { DatasetHeading } from 'components/pages/dashboard';
import { MainWrapper } from 'components/pages/user/Layout';
import SortFilterListingTable, {
  formatDateTimeForTable,
  SelectColumnFilter,
} from 'components/common/SortFilterListingTable';
import { Loader } from 'components/common';
import { dateTimeFormat } from 'utils/helper';
import { toast } from 'react-toastify';
import {
  CheckmarkCircle,
  Close,
  CloseCircle,
  Edit,
  Reply,
} from '@opub-icons/workflow';
import { Link } from 'components/layouts/Link';
import styled from 'styled-components';
import { Text } from 'components/layouts';
import RejectModal from 'components/pages/providers/datasets/CreationFlow/RejectModal';
import { LogoContainer } from '../drafts';
import { platform_name } from 'platform-constants';

const UnderReview = () => {
  const router = useRouter();

  const [showRejectDOM, setRejectDom] = useState({
    clickedItem: '',
    showDom: false,
  });

  const [reviewItemsList, setReviewItemsList] = useState([]);

  const currentOrgRole = useProviderStore((e) => e.org);
  const datasetTypeIcons = useConstants((e) => e.datasetTypeIcons);

  const GetReviewRequestsByUserRes = useQuery(GET_REVIEW_REQUEST_USER, {
    skip: !currentOrgRole?.org_id,
  });

  useEffect(() => {
    setReviewItemsList(
      GetReviewRequestsByUserRes.data?.review_request_user.filter((item) => {
        if (currentOrgRole.role === 'DPA') {
          if (
            item.request_type === 'MODERATION' &&
            item.status !== 'APPROVED' &&
            item.status !== 'REQUESTED' &&
            item.status !== 'ADDRESSED'
          )
            return item;
          else if (
            item.request_type === 'REVIEW' &&
            (item.status === 'REQUESTED' || item.status === 'APPROVED')
          )
            return item;
        } else if (currentOrgRole.role === 'DP') {
          if (
            item.request_type === 'REVIEW' &&
            (item.status === 'REJECTED' || item.status === 'ADDRESSING')
          )
            return item;
        }
      })
    );
  }, [GetReviewRequestsByUserRes.data]);

  const [changeReqStatusReq, changeReqStatusRes] = useMutation(
    ADDRESS_MODERATION_REQ
  );

  const [RespondToReviewRequestReq, RespondToReviewRequestRes] = useMutation(
    RESPOND_TO_REVIEW_REQUEST
  );

  const RespondToReviewReq = (id, remark, status) => {
    mutation(RespondToReviewRequestReq, RespondToReviewRequestRes, {
      review_request: {
        ids: [id],
        remark: remark,
        status: status,
      },
    })
      .then((res) => {
        if (res.approve_reject_review_request.success === true) {
          setRejectDom({
            clickedItem: '',
            showDom: !showRejectDOM.showDom,
          });
          toast.success('Submitted response successfully');
          GetReviewRequestsByUserRes.refetch();
        }
      })
      .catch(() => {
        toast.error('Error in submitting the response');
      });
  };

  const RejectToProvider = (reviewReqItem) => {
    mutation(RespondToReviewRequestReq, RespondToReviewRequestRes, {
      review_request: {
        ids: [reviewReqItem.parent?.id],
        remark: reviewReqItem.remark,
        status: 'REJECTED',
      },
    })
      .then((res) => {
        if (res.approve_reject_review_request.success === true) {
          mutation(changeReqStatusReq, changeReqStatusRes, {
            moderation_request: {
              ids: [reviewReqItem.id],
              remark: 'Sent to Provider: ' + reviewReqItem.parent?.user,
              status: 'ADDRESSED',
            },
          }).then((res) => {
            if (res.address_moderation_requests.success) {
              GetReviewRequestsByUserRes.refetch();
            } else {
              throw new Error(res.address_moderation_requests.errors);
            }
          });
        } else {
          throw new Error(res.approve_reject_review_request.errors);
        }
      })
      .catch((err) => {
        toast.error('Error in sending to Provider: ' + err.message);
      });
  };

  const ColumnHeaders = React.useMemo(
    () => [
      {
        Header: 'Dataset Title',
        accessor: 'name',
        sortType: (a, b) => {
          var a1 = a.values['name'].toLowerCase();
          var b1 = b.values['name'].toLowerCase();
          if (a1 < b1) return 1;
          else if (a1 > b1) return -1;
          else return 0;
        },
        disableFilters: true,
        maxWidth: 300,
        minWidth: 100,
        Cell: ({ row }) => (
          <>
            <LogoContainer>{row.original.logo}</LogoContainer>
            <Link
              title={'View Dataset'}
              target="_blank"
              href={`/datasets/${row.original.slug}`}
            >
              <Text>{row.original.name}</Text>
            </Link>
          </>
        ),
      },
      {
        Header: 'Last Modified',
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
          return formatDateTimeForTable(props.row.original.modified);
        },
      },
      {
        Header: 'Received On',
        accessor: 'issued',
        sortType: (a, b) => {
          var a1 = new Date(a.values['issued']).getTime();
          var b1 = new Date(b.values['issued']).getTime();
          if (a1 < b1) return 1;
          else if (a1 > b1) return -1;
          else return 0;
        },
        disableFilters: true,
        Cell: (props) => {
          return formatDateTimeForTable(props.row.original.issued);
        },
      },
      {
        Header: 'Received From',
        accessor: 'rejectRole',
        sortType: 'alphanumeric',
        Filter: SelectColumnFilter,
        filter: 'includes',
        // Cell: ({ row }) => (
        //   <Flex flexWrap={'wrap'} justifyContent={'center'}>
        //     <Text>
        //       {row.original.rejectRole !== 'PMU' && (
        //         <Text>{row.original.rejectUser} </Text>
        //       )}
        //       ({row.original.rejectRole})
        //     </Text>
        //   </Flex>
        // ),
      },
      {
        Header: 'Remarks',
        accessor: 'reason',
        disableFilters: true,
        sortType: 'disabled',
        Cell: ({ row }) => {
          const [showRemarkModal, setShowRemarkModal] = useState(false);
          return (
            <RemarkWrapper>
              <Flex justifyContent={'center'}>
                {row.original.reason === '-' ||
                row.original.reason.length === 0 ? (
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
                      <Text as={'h1'}>Remarks</Text>
                      <Button
                        kind="custom"
                        icon={<Close />}
                        onPress={() => setShowRemarkModal(!showRemarkModal)}
                      />
                    </Flex>
                    <hr />
                    <Flex marginTop={'5px'}>
                      <Text>{row.original.reason}</Text>
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

  const PrepareReviewList = (reviewRequestList) => {
    return reviewRequestList?.map((reviewReqItem) => {
      return {
        logo: datasetTypeIcons[
          reviewReqItem?.dataset?.dataset_type?.toLowerCase()
        ]?.image,
        slug: reviewReqItem?.dataset.slug,
        name: reviewReqItem?.dataset.title,
        description: reviewReqItem?.description || '-',
        issued: dateTimeFormat(reviewReqItem?.creation_date),
        modified: dateTimeFormat(reviewReqItem?.modified_date),
        reason:
          currentOrgRole.role === 'DPA' &&
          reviewReqItem?.request_type === 'REVIEW' &&
          reviewReqItem.status === 'REQUESTED'
            ? reviewReqItem.description
            : reviewReqItem.remark || reviewReqItem.reject_reason || '-',
        rejectRole:
          reviewReqItem.status === 'REJECTED' ||
          reviewReqItem.status === 'ADDRESSING'
            ? reviewReqItem?.request_type === 'REVIEW'
              ? 'DPA'
              : 'PMU'
            : 'DP',
        rejectUser: reviewReqItem.user,
        actionable: (
          <ActionContainer>
            {((currentOrgRole.role === 'DP' &&
              reviewReqItem?.request_type === 'REVIEW' &&
              (reviewReqItem.status === 'ADDRESSING' ||
                reviewReqItem.status === 'REJECTED')) ||
              (currentOrgRole.role === 'DPA' &&
                reviewReqItem?.request_type === 'MODERATION' &&
                (reviewReqItem.status === 'ADDRESSING' ||
                  reviewReqItem.status === 'REJECTED'))) && (
              <Flex
                alignItems="center"
                justifyContent={'center'}
                flexWrap={'wrap'}
              >
                {currentOrgRole.role === 'DPA' && reviewReqItem.parent?.id ? (
                  <Button
                    size="sm"
                    kind="custom"
                    className="customSize"
                    title="Send back to Provider"
                    icon={<Reply color={'var(--color-warning)'} />}
                    iconOnly
                    // iconSide="left"
                    onPress={() => {
                      RejectToProvider(reviewReqItem);
                    }}
                  >
                    Send to Provider
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    kind="custom"
                    className="customSize"
                    title="Edit the Dataset"
                    icon={<Edit color={'var(--color-information)'} />}
                    iconOnly
                    onPress={() => {
                      handleEditDataset(reviewReqItem);
                    }}
                  >
                    Edit Dataset
                  </Button>
                )}
              </Flex>
            )}

            {currentOrgRole.role === 'DPA' &&
              reviewReqItem?.request_type === 'REVIEW' &&
              reviewReqItem.status === 'APPROVED' && (
                <ActionButtnWrapper>
                  <Flex
                    alignItems="center"
                    justifyContent={'center'}
                    flexWrap={'wrap'}
                  >
                    <Button
                      size="sm"
                      kind="custom"
                      title="Move the Dataset to Moderation"
                      className="flipHorizontal"
                      icon={<Reply color={'var(--color-success  )'} />}
                      iconOnly
                      onPress={() => {
                        router.push(
                          `/providers/${router.query.provider}/dashboard/datasets/create-new?datasetId=${reviewReqItem?.dataset?.id}&from=under-review`
                        );
                      }}
                    >
                      Send to Moderation
                    </Button>
                  </Flex>
                </ActionButtnWrapper>
              )}

            {currentOrgRole.role === 'DPA' &&
              reviewReqItem?.request_type === 'REVIEW' &&
              reviewReqItem.status === 'REQUESTED' && (
                <>
                  <Flex
                    alignItems="center"
                    justifyContent={'center'}
                    flexWrap={'wrap'}
                  >
                    <Button
                      size="sm"
                      kind="custom"
                      onPress={() => {
                        RespondToReviewReq(reviewReqItem.id, '', 'APPROVED');
                      }}
                      className="circleBtns"
                      icon={
                        <CheckmarkCircle
                          color={'var(--color-success)'}
                          size={'21px'}
                        />
                      }
                      iconOnly
                      title="Accept"
                    ></Button>
                    <Button
                      size="sm"
                      onPress={() => {
                        setRejectDom({
                          clickedItem: reviewReqItem.id,
                          showDom: true,
                        });
                      }}
                      className="circleBtns"
                      kind="custom"
                      icon={
                        <CloseCircle
                          color={'var(--color-warning)'}
                          size={'21px'}
                        />
                      }
                      iconOnly
                      title="Reject"
                    >
                      Reject
                    </Button>
                  </Flex>

                  <RejectModal
                    isModalOpen={
                      showRejectDOM.showDom &&
                      showRejectDOM.clickedItem === reviewReqItem.id
                    }
                    onSubmit={(reason) => {
                      RespondToReviewReq(reviewReqItem.id, reason, 'REJECTED');
                    }}
                    onCancel={() => {
                      setRejectDom({
                        clickedItem: '',
                        showDom: !showRejectDOM.showDom,
                      });
                    }}
                  />
                </>
              )}
          </ActionContainer>
        ),
      };
    });
  };

  const handleEditDataset = (reviewReqItem) => {
    mutation(changeReqStatusReq, changeReqStatusRes, {
      moderation_request: {
        ids: [reviewReqItem.id],
        remark: reviewReqItem.remark || '',
        status: 'ADDRESSING',
      },
    })
      .then((res) => {
        if (res.address_moderation_requests.success) {
          router.push(
            `/providers/${router.query.provider}/dashboard/datasets/create-new?datasetId=${reviewReqItem?.dataset?.id}&from=under-review`
          );
        } else {
          throw new Error(res.address_moderation_requests.errors);
        }
      })
      .catch((err) => {
        toast.error(
          'Error in addressing the moderation request: ' + err.message
        );
      });
  };

  return (
    <>
      <Head>
        <title>Needs Review | {platform_name} (IDP)</title>
      </Head>

      <DatasetHeading />

      <MainWrapper fullWidth>
        {!GetReviewRequestsByUserRes?.loading && currentOrgRole?.org_id ? (
          reviewItemsList?.length > 0 ? (
            <SortFilterListingTable
              data={PrepareReviewList(reviewItemsList)}
              columns={ColumnHeaders}
              title={'Needs Review'}
              globalSearchPlaceholder={'Search Datasets'}
            />
          ) : (
            <NoResult label={'No datasets needing review'} />
          )
        ) : (
          <Loader />
        )}
      </MainWrapper>
    </>
  );
};

export default UnderReview;

const ActionButtnWrapper = styled.div`
  .flipHorizontal svg {
    transform: rotateY(180deg);
  }
`;

export const NameWrapper = styled.div`
  a {
    color: inherit;
  }
`;

export const RemarkWrapper = styled.div`
  button a {
    text-decoration: underline;
    font-size: 14px;
  }
`;

export const RemarkModalContentWrapper = styled.section`
  background-color: var(--color-background-lightest);
  max-height: 90vh;
  min-width: 30vw;
  max-width: 1014px;
  padding: 20px;
  overflow-y: auto;
  border-radius: 8px;
`;

const ActionContainer = styled.div`
  .circleBtns svg {
    max-width: none;
    max-height: none;
  }

  .customSize svg {
    max-width: none;
    max-height: none;
    width: 21px;
  }
`;
