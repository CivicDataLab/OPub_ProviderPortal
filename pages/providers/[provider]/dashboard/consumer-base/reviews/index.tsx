import { useMutation, useQuery } from '@apollo/client';
import { CheckmarkCircle, Close, CloseCircle } from '@opub-icons/workflow';
import { Button } from 'components/actions';
import Modal from 'components/actions/Modal';
import { Loader } from 'components/common';
import SortFilterListingTable, {
  formatDateTimeForTable,
  SelectColumnFilter,
} from 'components/common/SortFilterListingTable';
import { Checkbox, Select } from 'components/form';
import {
  DashboardHeader,
  Heading,
  NoResult,
  Text,
  TruncateText,
} from 'components/layouts';
import { Flex } from 'components/layouts/FlexWrapper';
import { Link } from 'components/layouts/Link';
import { MainWrapper } from 'components/pages/user/Layout';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import {
  GET_ALL_RATINGS_REVIEWS,
  mutation,
  UPDATE_DATASET_RATING_STATUS,
} from 'services';
import styled from 'styled-components';
import {
  useConstants,
  useProviderStore,
} from '../../../../../../services/store';
import { NameWrapper } from '../../datasets/under-review';
import { LogoContainer } from '../../datasets/drafts';
import { platform_name } from 'platform-constants';

const LicenseModeration = () => {
  const currentOrgRole = useProviderStore((e) => e.org);
  const { data, loading, error, refetch } = useQuery(GET_ALL_RATINGS_REVIEWS, {
    skip: !currentOrgRole?.org_id,
  });
  const [reviews, setReviews] = useState([]);
  const [isCheckedAll, setIsCheckedAll] = useState(false);
  const [isCheckedId, setIsCheckedId] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rejectSelected, setRejectSelected] = useState(false);
  const [requestIds, setRequestIds] = useState([]);
  const [clickedTag, setClickedTag] = useState('ALL');

  const datasetTypeIcons = useConstants((e) => e.datasetTypeIcons);

  const [updateDataModerationReq, updateDataModerationRes] = useMutation(
    UPDATE_DATASET_RATING_STATUS,
    {
      refetchQueries: [data, { query: GET_ALL_RATINGS_REVIEWS }],
    }
  );

  useEffect(() => {
    if (data) {
      let createdLicenses =
        clickedTag == 'ALL'
          ? data?.rating_by_org
          : data?.rating_by_org.filter(
              (dataset) => dataset.status === clickedTag
            );
      setReviews(createdLicenses);
    }
  }, [data]);

  const Filters = [
    {
      label: 'All',
      value: 'ALL',
    },
    {
      label: 'Created',
      value: 'CREATED',
    },
    {
      label: 'Accepted',
      value: 'PUBLISHED',
    },
    {
      label: 'Rejected',
      value: 'REJECTED',
    },
  ];

  const handleClickedTag = (clickedTag) => {
    setClickedTag(clickedTag);
    setReviews(
      clickedTag == 'ALL'
        ? data?.rating_by_org
        : data?.rating_by_org.filter((dataset) => dataset.status === clickedTag)
    );
  };

  const submitRequest = (requestID, status) => {
    const mutationRequest = {
      rating_data: {
        id: requestID,
        status: status,
      },
    };

    mutation(updateDataModerationReq, updateDataModerationRes, mutationRequest)
      .then((res) => {
        toast.success('Successfully changed status');
        modalHandler();
        refetch();
        setRequestIds([]);
      })
      .catch((err) => {
        toast.error('Failed to Approve request , Please Try again!');
        modalHandler();
        setRequestIds([]);
      });
  };

  const DefaultDom = ({ id }) => {
    return (
      <Flex justifyContent={'center'}>
        <Button
          size="md"
          onPress={() => {
            modalHandler();
            setRequestIds(id);
          }}
          kind="custom"
          icon={
            <CheckmarkCircle color={'var(--color-success)'} size={'21px'} />
          }
          iconOnly
          title="Accept"
        >
          Accept
        </Button>
        <Button
          size="md"
          onPress={() => {
            modalHandler();
            setRejectSelected(true);
            setRequestIds(id);
          }}
          kind="custom"
          icon={<CloseCircle color={'var(--color-warning)'} size={'21px'} />}
          iconOnly
          title="Reject"
        >
          Reject
        </Button>
      </Flex>
    );
  };

  const modalHandler = () => {
    setIsModalOpen(!isModalOpen);
  };

  const ShowAllSelectedDom = () => {
    return (
      <FlexRow style={{ marginTop: '15px' }}>
        <Button
          onPress={() => {
            modalHandler();
          }}
          kind="primary"
        >
          Accept selected
        </Button>
        <Button
          onPress={() => {
            modalHandler();
            setRejectSelected(true);
          }}
          kind="primary-outline"
        >
          Reject selected
        </Button>
      </FlexRow>
    );
  };

  const ColumnHeaders = React.useMemo(
    () => [
      {
        Header: 'Dataset Title',
        accessor: 'dataset',
        sortType: (a, b) => {
          var a1 = a.values['dataset'].toLowerCase();
          var b1 = b.values['dataset'].toLowerCase();
          if (a1 < b1) return 1;
          else if (a1 > b1) return -1;
          else return 0;
        },
        Filter: SelectColumnFilter,
        maxWidth: 200,
        minWidth: 100,
        Cell: ({ row }) => (
          <>
            <LogoContainer>{row.original.logo}</LogoContainer>
            <Link target="_blank" href={`/datasets/${row.original.id}`}>
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
        maxWidth: 200,
        minWidth: 100,
        Cell: ({ row }) => <Flex gap="10px">{row.original.name}</Flex>,
      },
      {
        Header: 'Rating',
        accessor: 'rating',
        sortType: 'alphanumeric',
        Filter: SelectColumnFilter,
        filter: 'includes',
        Cell: ({ row }) => (
          <Flex justifyContent={'center'}>{row.original.rating}</Flex>
        ),
      },
      {
        Header: 'Review',
        accessor: 'review',
        sortType: (a, b) => {
          var a1 = a.values['review'].toLowerCase();
          var b1 = b.values['review'].toLowerCase();
          if (a1 < b1) return 1;
          else if (a1 > b1) return -1;
          else return 0;
        },
        disableFilters: true,
      },
      {
        Header: 'Submitted On',
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
        Header: 'Actions',
        accessor: 'actionable',
        disableFilters: true,
        sortType: 'disabled',
        width: 100,
      },
    ],
    []
  );

  const prepareReviewsList = (reviewsList) => {
    return reviewsList.map((reviewItem) => {
      return {
        logo: datasetTypeIcons[reviewItem?.dataset?.dataset_type?.toLowerCase()]
          ?.image,
        id: reviewItem.dataset.id,
        dataset: reviewItem.dataset.title,
        rating: reviewItem.data_quality,
        review: reviewItem.review,
        name: reviewItem.user,
        issued: reviewItem.issued,
        actionable:
          reviewItem.status.toLowerCase() === 'created' ? (
            <DefaultDom id={reviewItem.id} />
          ) : (
            <Flex justifyContent={'center'} alignItems={'center'}>
              {reviewItem.remark || '-'}
            </Flex>
          ),
      };
    });
  };

  const captureAllIds = (resourceIds) => {
    const selectedIds = [];
    resourceIds.map((item) => {
      selectedIds.push(item.id);
    });
    setRequestIds(selectedIds);
    if (isCheckedAll) {
      requestIds.splice(0, requestIds.length);
      setRequestIds(requestIds);
    }
    setIsCheckedAll(!isCheckedAll);
  };

  const captureIndividualIds = (resourceId) => {
    if (requestIds.includes(resourceId)) {
      const getIndex = requestIds.indexOf(resourceId);
      requestIds.splice(getIndex, 1);
      setRequestIds(requestIds);
      setIsCheckedId('');
    } else {
      setRequestIds([...requestIds, resourceId]);
      setIsCheckedId(resourceId);
    }
  };

  const SelectAll = ({ data }) => {
    return (
      <Checkbox
        isSelected={isCheckedAll}
        aria-label="Select all"
        onChange={() => {
          captureAllIds(data);
        }}
      >
        Select all
      </Checkbox>
    );
  };

  return (
    <MainWrapper fullWidth>
      <Head>
        <title>Ratings and Reviews | {platform_name} (IDP)</title>
      </Head>
      <DashboardHeader>
        <Heading as={'h1'} variant="h3" paddingBottom={'24px !important'}>
          Ratings and Reviews
        </Heading>
        <Wrapper>
          <Text color="var(--text-medium)">Sort by: </Text>

          <Select
            options={Filters}
            onChange={(e) => handleClickedTag(e.value)}
            inputId={'sort'}
            defaultValue={{
              label: 'All',
              value: 'ALL',
            }}
          />
        </Wrapper>
      </DashboardHeader>
      <Container>
        {loading || !currentOrgRole?.org_id ? (
          <Loader />
        ) : (
          <MainBody>
            <RequestListContainer>
              <div className="dataRequestPageContainer">
                <div className="dataRequestCardsContainer">
                  {!reviews.length ? (
                    <NoResult />
                  ) : (
                    <SortFilterListingTable
                      columns={ColumnHeaders}
                      data={prepareReviewsList(reviews)}
                      title={''}
                    />
                  )}
                </div>
              </div>
            </RequestListContainer>
          </MainBody>
        )}
      </Container>

      <Modal
        isOpen={isModalOpen}
        modalHandler={() => modalHandler()}
        label="Confirmation Modal"
      >
        <ModalContainer>
          <Flex justifyContent={'space-between'} alignItems={'center'}>
            <Text as={'h2'}>Confirmation</Text>
            <Button
              kind="custom"
              icon={<Close />}
              onPress={() => modalHandler()}
            />
          </Flex>

          <p>Are you sure you want to perform this action ?</p>
          <Flex flexDirection={'row'} justifyContent={'flex-end'} gap={'10px'}>
            <Button
              onPress={() => {
                modalHandler();
              }}
              kind="primary-outline"
              className="downloadButton"
            >
              Cancel
            </Button>
            <Button
              onPress={() => {
                submitRequest(
                  requestIds,
                  rejectSelected ? 'REJECTED' : 'PUBLISHED'
                );
              }}
              kind="primary"
            >
              Submit
            </Button>
          </Flex>
        </ModalContainer>
      </Modal>
    </MainWrapper>
  );
};

export default LicenseModeration;

const Wrapper = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;
  justify-content: flex-end;
  margin-bottom: 10px;
  .opub-select {
    &__control {
      border: none;
      min-height: 24px;
      font-weight: var(--font-bold);
    }

    &__single-value {
      color: var(--text-medium);
    }

    &__menu {
      min-width: 180px;
      right: 0;
    }

    &__indicator-separator {
      display: none;
    }

    &__value-container {
      padding: 0;
      padding-left: 6px;
    }
  }
`;

const LoadingText = styled.span`
  display: grid;
  transform: translate(0, 15rem);
  font-weight: 600;
  height: 100%;
  text-align: center;
  margin: 0 auto;
`;

export const ModalContainer = styled.div`
  padding: 10px;
  background-color: var(--color-white);
  display: flex;
  flex-direction: column;
  gap: 25px;

  h4 {
    text-align: center;
  }

  > div:first-child {
    border-bottom: 1px solid var(--color-gray-02);

    button {
      padding-right: 0px;
    }
  }

  p {
    padding: 8px;
  }
`;

const RequestListContainer = styled.div`
  .dataRequestPageContainer {
    display: flex;
    gap: 2em;
  }

  .dataRequestCardsContainer {
    width: 100%;
    a {
      color: var(--color-primary-01);
    }

    /* span {
      margin-left: 10px;
    } */
  }
`;

const FlexRow = styled.div`
  display: flex;
  gap: 15px;
`;

const RejectedContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const MainBody = styled.div`
  width: 100%;
`;

const Container = styled.section`
  display: flex;
  gap: 25px;
`;
