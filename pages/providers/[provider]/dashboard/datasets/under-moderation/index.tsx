import React, { useState } from 'react';
import Head from 'next/head';
import { NoResult, TruncateText } from 'components/layouts';
import { Button, InfoTag, Modal } from 'components/actions';
import { useQuery } from '@apollo/client';
import { GET_REVIEW_REQUEST_USER } from 'services';
import { Flex } from 'components/layouts/FlexWrapper';
import { DatasetHeading } from 'components/pages/dashboard';
import { MainWrapper } from 'components/pages/user/Layout';
import { Loader } from 'components/common';
import SortFilterListingTable, {
  formatDateTimeForTable,
  SelectColumnFilter,
} from 'components/common/SortFilterListingTable';
import { dateTimeFormat } from 'utils/helper';
import { useConstants, useProviderStore } from 'services/store';
import { Link } from 'components/layouts/Link';
import { RemarkModalContentWrapper, RemarkWrapper } from '../under-review';
import { Close } from '@opub-icons/workflow';
import { Text } from 'components/layouts';
import { LogoContainer } from '../drafts';
import { platform_name } from 'platform-constants';

const UnderModeration = () => {
  const currentOrgRole = useProviderStore((e) => e.org);
  const datasetTypeIcons = useConstants((e) => e.datasetTypeIcons);

  const AllReviewRequestByUserRes = useQuery(GET_REVIEW_REQUEST_USER, {
    skip: !currentOrgRole?.org_id,
  });

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
        maxWidth: 200,
        minWidth: 100,
        Cell: ({ row }) => (
          <>
            <LogoContainer>{row.original.logo}</LogoContainer>
            <Link
              title={'View Dataset'}
              target="_blank"
              href={`/datasets/${row.original.id}`}
            >
              <Text>{row.original.name}</Text>
            </Link>
          </>
        ),
      },
      {
        Header: 'Created On',
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
        Header: 'Submitted On',
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
        Header: 'Submitted To',
        accessor: 'pending',
        sortType: (a, b) => {
          var a1 = a.values['pending'].toLowerCase();
          var b1 = b.values['pending'].toLowerCase();
          if (a1 < b1) return 1;
          else if (a1 > b1) return -1;
          else return 0;
        },
        Filter: SelectColumnFilter,
        filter: 'includes',
      },
      // {
      //   Header: 'Remark',
      //   accessor: 'remark',
      //   disableFilters: true,
      //   sortType: 'disabled',
      //   Cell: ({ row }) => {
      //     const [showRemarkModal, setShowRemarkModal] = useState(false);
      //     return (
      //       <RemarkWrapper>
      //         <Flex justifyContent={'center'}>
      //           {row.original.remark === '-' ||
      //           row.original.remark.length === 0 ? (
      //             '-'
      //           ) : (
      //             <Button
      //               kind="custom"
      //               onPress={() => {
      //                 setShowRemarkModal(!showRemarkModal);
      //               }}
      //             >
      //               <Link>Show Remark</Link>
      //             </Button>
      //           )}

      //           <Modal
      //             label={''}
      //             isOpen={showRemarkModal}
      //             modalHandler={() => {
      //               setShowRemarkModal(!showRemarkModal);
      //             }}
      //           >
      //             <RemarkModalContentWrapper>
      //               <Flex
      //                 flexDirection={'row'}
      //                 justifyContent="space-between"
      //                 alignItems={'center'}
      //               >
      //                 <Text as={'h1'}>Remarks</Text>
      //                 <Button
      //                   kind="custom"
      //                   icon={<Close />}
      //                   onPress={() => setShowRemarkModal(!showRemarkModal)}
      //                 />
      //               </Flex>
      //               <hr />
      //               <Flex marginTop={'5px'}>
      //                 <Text>{row.original.remark}</Text>
      //               </Flex>
      //             </RemarkModalContentWrapper>
      //           </Modal>
      //         </Flex>
      //       </RemarkWrapper>
      //     );
      //   },
      // },
    ],
    []
  );

  const prepareModerationList = (moderationList) => {
    return moderationList.map((reviewReqItem) => {
      return {
        logo: datasetTypeIcons[
          reviewReqItem?.dataset.dataset_type.toLowerCase()
        ]?.image,
        id: reviewReqItem?.dataset.id,
        name: reviewReqItem?.dataset.title,
        remark:
          reviewReqItem.request_type === 'MODERATION'
            ? reviewReqItem.remark
            : reviewReqItem.description,
        description: reviewReqItem?.dataset.description,
        ...(reviewReqItem?.parent_field[0]?.status === 'REQUESTED'
          ? {
              issued: dateTimeFormat(
                reviewReqItem?.parent_field[0]?.creation_date
              ),
              modified: dateTimeFormat(
                reviewReqItem?.parent_field[0]?.modified_date
              ),
              pending:
                reviewReqItem?.parent_field[0]?.request_type === 'MODERATION'
                  ? 'PMU'
                  : 'DPA',
              actionable: (
                <Flex alignItems="center" justifyContent={'center'}>
                  <InfoTag
                    variant="suspended"
                    statusName={
                      reviewReqItem?.parent_field[0]?.request_type ===
                        'MODERATION' &&
                      reviewReqItem?.parent_field[0]?.status === 'REQUESTED'
                        ? 'Under Moderation'
                        : 'Under Review'
                    }
                  />
                </Flex>
              ),
            }
          : {
              issued: dateTimeFormat(reviewReqItem?.creation_date),
              modified: dateTimeFormat(reviewReqItem?.modified_date),
              pending:
                reviewReqItem.request_type === 'MODERATION' &&
                reviewReqItem.status === 'REQUESTED'
                  ? 'PMU'
                  : 'DPA',
              actionable: (
                <Flex alignItems="center" justifyContent={'center'}>
                  <InfoTag
                    variant="suspended"
                    statusName={
                      reviewReqItem.request_type === 'MODERATION' &&
                      reviewReqItem.status === 'REQUESTED'
                        ? 'Under Moderation'
                        : 'Under Review'
                    }
                  />
                </Flex>
              ),
            }),
      };
    });
  };

  return (
    <>
      <Head>
        <title>Under Moderation | {platform_name} (IDP)</title>
      </Head>

      <DatasetHeading />
      <MainWrapper fullWidth>
        {!AllReviewRequestByUserRes.loading && currentOrgRole?.org_id ? (
          AllReviewRequestByUserRes.data?.review_request_user?.filter(
            (item) => {
              if (
                currentOrgRole.role === 'DPA' &&
                item.request_type === 'MODERATION' &&
                item.status === 'REQUESTED'
              ) {
                return item;
              } else if (
                currentOrgRole.role === 'DP' &&
                ((item.status === 'ADDRESSED' &&
                  item.parent_field.length > 0 &&
                  item.parent_field[0].status !== 'APPROVED' &&
                  item.parent_field[0].status !== 'ADDRESSED') ||
                  item.status === 'APPROVED')
              ) {
                return item;
              } else if (
                currentOrgRole.role === 'DP' &&
                item.status === 'REQUESTED'
              ) {
                return item;
              }
            }
          )?.length > 0 ? (
            <SortFilterListingTable
              data={prepareModerationList(
                AllReviewRequestByUserRes.data?.review_request_user.filter(
                  (item) => {
                    if (
                      currentOrgRole.role === 'DPA' &&
                      item.request_type === 'MODERATION' &&
                      item.status === 'REQUESTED'
                    ) {
                      return item;
                    } else if (
                      currentOrgRole.role === 'DP' &&
                      ((item.status === 'ADDRESSED' &&
                        item.parent_field.length > 0 &&
                        item.parent_field[0].status !== 'APPROVED' &&
                        item.parent_field[0].status !== 'ADDRESSED') ||
                        item.status === 'APPROVED')
                    ) {
                      return item;
                    } else if (
                      currentOrgRole.role === 'DP' &&
                      item.status === 'REQUESTED'
                    ) {
                      return item;
                    }
                  }
                )
              )}
              columns={ColumnHeaders}
              title={'Under Moderation'}
              globalSearchPlaceholder="Search Datasets"
            />
          ) : (
            <NoResult label={'No datasets under moderation'} />
          )
        ) : (
          <Loader />
        )}
      </MainWrapper>
    </>
  );
};

export default UnderModeration;
