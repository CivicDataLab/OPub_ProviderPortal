import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { useMutation } from '@apollo/client';
import AboutData from './AboutData';
import DataStories from './DataStories';
import DataAndApis from './DataAndApis';
import { ADD_RATING, mutation } from 'services';
import { toast } from 'react-toastify';
import { DatasetAccessTab } from './DatasetAccessTab';
import { Info, Data, FileData, NewsAdd, Answer } from '@opub-icons/workflow';
import { Flex } from 'components/layouts/FlexWrapper';
import { Heading } from 'components/layouts';
import { ProviderInfoCard } from './ProviderInfoCard';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from 'components/actions/Tabs/Tabs';
import ExternalDam from './ExternalDam';

const ExplorerInfo: React.FC<{
  datasetID: any;
  headerData: any;
  resUrl?: any;
  vizCompData?: any;
  orgDetails?: any;
}> = ({ headerData, vizCompData, datasetID }) => {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<any>(
    router?.query?.tab || 'about-data'
  );
  const TabbedRef = useRef(null);

  useEffect(() => {
    setSelectedTab(router?.query?.tab || 'about-data');
  }, [router?.query?.tab]);

  const [addRatingReq, addRatingResponse] = useMutation(ADD_RATING);

  const TabHeaders = [
    {
      name: (
        <Flex padding="20px 0" gap="10px">
          <Info width={20} fill={'var(color-gray-02)'} />
          <Heading as="h2" variant="h5">
            About
          </Heading>
        </Flex>
      ),
      disabled: false,
      id: 'about-data',
    },
    {
      name: (
        <Flex padding="20px 0" gap="10px">
          <Data width={20} fill={'var(color-gray-04)'} />
          <Heading as="h2" variant="h5">
            {headerData.dataset_type !== 'EXTERNAL'
              ? 'Distributions'
              : 'Distributions Links'}
          </Heading>
        </Flex>
      ),
      disabled: false,
      id: 'data-apis',
    },
    headerData.dataset_type !== 'EXTERNAL'
      ? {
          name: (
            <Flex padding="20px 0" gap="10px">
              <FileData width={20} fill={'var(color-gray-04)'} />
              <Heading as="h2" variant="h5">
                Dataset Access Models
              </Heading>
            </Flex>
          ),
          disabled: false,
          id: 'data-access-model',
        }
      : {
          name: (
            <Flex padding="20px 0" gap="10px">
              <FileData width={20} fill={'var(color-gray-04)'} />
              <Heading as="h2" variant="h5">
                Policy & Licence
              </Heading>
            </Flex>
          ),
          disabled: false,
          id: 'external-data-access-model',
        },
    {
      name: (
        <Flex padding="20px 0" gap="10px">
          <NewsAdd width={20} fill={'var(color-gray-04)'} />
          <Heading
            as="h2"
            variant="h5"
            title={
              headerData.additionalinfo_set.length > 0
                ? ''
                : 'Additional Information does not exist'
            }
          >
            Additional Information
          </Heading>
        </Flex>
      ),
      disabled: headerData.additionalinfo_set.length > 0 ? false : true,
      id: 'additional-info',
    },
  ];

  const TabContent = [
    {
      id: 'about-data',
      component: (
        <AboutData
          callBack={(review, rating, clearFormOnSubmit) => {
            handleSubmit(review, rating, clearFormOnSubmit);
          }}
          datasetID={datasetID}
          data={headerData}
        />
      ),
    },
    {
      id: 'data-apis',
      component: <DataAndApis data={vizCompData} other={headerData} />,
    },
    headerData.dataset_type !== 'EXTERNAL'
      ? {
          id: 'data-access-model',
          component: <DatasetAccessTab datasetId={datasetID} />,
        }
      : {
          id: 'external-data-access-model',
          component: <ExternalDam data={headerData} />,
        },
    {
      id: 'additional-info',
      component: <DataStories data={headerData} />,
    },
  ];

  const handleTabChange = (selected) => {
    router.replace(
      {
        pathname: router.pathname,
        query: {
          explorer: router.query.explorer,
          tab: selected,
        },
      },
      router.pathname,
      { shallow: true }
    );
    setSelectedTab(selected);
  };

  const handleSubmit = (review, rating, clearFormOnSubmit) => {
    if (!addRatingResponse.loading && !addRatingResponse.error) {
      mutation(addRatingReq, addRatingResponse, {
        rating_data: {
          id: '',
          dataset: datasetID,
          review: review,
          data_quality: rating,
        },
      })
        .then(() => {
          toast.success(
            'Rating and Review submitted for moderation successfully!'
          );
          clearFormOnSubmit();
        })
        .catch((err) => {
          const errorMessage = err.toString().slice(7).split(',')[0];
          toast.error(errorMessage);
        });
    }
  };

  function handleScrollJump() {
    var headerOffset = 100;

    const element = document.getElementById('explorer-tab-container');
    if (element && document.documentElement.scrollTop > 565) {
      var offsetPosition = element.offsetTop - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  }

  return (
    <div id="explorer-tab-container" ref={TabbedRef}>
      <Tabs
        onValueChange={(selected) => handleTabChange(selected)}
        value={selectedTab}
      >
        <TabsListContainer>
          <TabListWrapper className="container">
            <StyledTabList aria-label="Dataset landing tabs">
              {TabHeaders.map((item) => (
                <StyledTabTrigger
                  onClick={handleScrollJump}
                  key={item.id}
                  value={item.id}
                  disabled={item.disabled}
                >
                  {item.name}
                </StyledTabTrigger>
              ))}
            </StyledTabList>
            <SupportButtonWrapper
              onClick={() => {
                if (typeof window !== 'undefined') {
                  router.push({
                    pathname: `/connect-with-idp`,
                    query: {
                      datasetURL: `${window.location.origin}/datasets/${router.query.explorer}`,
                      providerID: headerData.organization.id,
                    },
                  });
                }
              }}
            >
              <Heading
                variant="h5"
                as="h2"
                color={'var(--color-primary-01)'}
                title={
                  'Share your comments and queries with the IDP administrators'
                }
              >
                Support
              </Heading>
              <Answer />
            </SupportButtonWrapper>
          </TabListWrapper>
        </TabsListContainer>

        <Wrapper
          id="explorer-tab-container"
          className="containerDesktop"
          ref={TabbedRef}
        >
          <InfoContainer id="InfoTabsContainer">
            <LeftContainer>
              {TabContent.map((item) => (
                <StyledTabContent key={item.id} value={item.id}>
                  {item.component}
                </StyledTabContent>
              ))}
            </LeftContainer>
            <RightContainer>
              <ProviderInfoCard headerData={headerData} />
            </RightContainer>
          </InfoContainer>
        </Wrapper>
      </Tabs>
    </div>
  );
};

export default ExplorerInfo;

const Wrapper = styled.div``;

const StyledTabList = styled(TabsList)`
  display: flex;
  gap: 30px;
  width: 100%;
  overflow-x: auto;
`;

const StyledTabTrigger = styled(TabsTrigger)`
  color: var(--text-medium);
  border-bottom: 2px solid white;

  h2 {
    white-space: nowrap;
  }
  :disabled {
    color: var(--text-disabled);
    svg {
      fill: var(--text-disabled);
    }
  }
  > div > svg {
    fill: var(--color-gray-04);
  }
  &[data-state='active'] {
    border-bottom: 2px solid var(--color-primary-01);
    color: var(--color-primary-01);
    > div > svg {
      fill: var(--color-primary-01);
    }
  }
`;

const TabsListContainer = styled.div`
  background-color: var(--color-white);
  border-bottom: 1px solid var(--color-gray-02);
  z-index: 1;
  position: sticky;
  top: 128px;

  @media (max-width: 800px) {
    position: initial;
  }
`;

const TabListWrapper = styled.div`
  display: flex;
  gap: 8px;
  svg {
    fill: var(--color-primary-01);
  }
`;

const SupportButtonWrapper = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;

  svg {
    margin-bottom: -4px;
  }
  @media (max-width: 800px) {
    h2 {
      display: none;
    }
    svg {
      margin-left: 8px;
    }
  }
`;

const StyledTabContent = styled(TabsContent)`
  /* padding-top: 40px; */
`;

const InfoContainer = styled.div`
  display: flex;
  gap: 40px;
  flex-wrap: wrap;
  margin-top: 40px;

  @media (max-width: 640px) {
    margin-top: 24px;
    gap: 24px;
  }
`;

const LeftContainer = styled.div`
  flex: 1 1 60%;
`;

const RightContainer = styled.div`
  flex: 1 1 20%;
  position: sticky;
  top: 200px;
  height: fit-content;
`;
