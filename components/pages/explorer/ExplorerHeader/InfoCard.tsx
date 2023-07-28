import { CheckmarkCircle, Info, LinkNav } from '@opub-icons/workflow';
import { Button } from 'components/actions';
import { Separator, Text, Heading, PDFViewer } from 'components/layouts';
import { Flex } from 'components/layouts/FlexWrapper';
import { Link } from 'components/layouts/Link';
import router from 'next/router';
import React from 'react';
import { useConstants } from 'services/store';
import styled from 'styled-components';
import { capitalize } from 'utils/helper';

export const InfoCard: React.FC<{
  dataAccessModelInfo: any;
  datasetTimelineInfo?: object;
  scrollY?: boolean;
  highlights?: any;
  data: any;
}> = ({
  dataAccessModelInfo,
  datasetTimelineInfo,
  scrollY,
  highlights,
  data,
}) => {
  const handleClick = (tabToChange) => {
    router.replace(
      {
        pathname: router.pathname,
        query: {
          explorer: router.query.explorer,
          tab: tabToChange,
          jump: 'explorer-tab-container',
        },
      },
      router.pathname,
      { shallow: true }
    );
    // const wrapper = document.querySelector('#explorer-upload-wrapper');
    // wrapper?.scrollIntoView({ behavior: 'smooth' });

    if (window) {
      window.scrollTo({
        top: document.getElementById('InfoTabsContainer').offsetTop - 200,
        behavior: 'smooth',
      });
    }
  };

  const isFalsy = Object.values(dataAccessModelInfo?.damObjCount).every(
    (value) => {
      if (value === 0) {
        return true;
      }

      return false;
    }
  );

  const AccessModelInfo = ({ dataAccessModelInfo }) => {
    // console.log(
    //   Object.keys(dataAccessModelInfo?.pricing)?.map((item) =>
    //     dataAccessModelInfo.pricing[item].every((val) => val !== null)
    //   )
    // );

    const damIcons = useConstants((e) => e.damIcons);

    return (
      <>
        <Flex gap="6px" alignItems={'baseline'}>
          {data.dataset_type !== 'EXTERNAL' ? (
            <Heading variant="h2" as={'span'}>
              Dataset
              <br /> Access Models
            </Heading>
          ) : (
            <Heading variant="h2" as={'span'}>
              External Access
            </Heading>
          )}
        </Flex>
        <Heading variant="h6" color={'var(--text-light)'} marginBottom={'4px'}>
          {data.dataset_type !== 'EXTERNAL' && 'ALL AVAILABLE ACCESS MODELS'}
        </Heading>
        {data.dataset_type !== 'EXTERNAL' ? (
          <>
            {!isFalsy && (
              <>
                <AccessModelCountWrapper>
                  {Object.keys(dataAccessModelInfo?.damObjCount)
                    .reverse()
                    .map((item) =>
                      dataAccessModelInfo?.damObjCount?.[item] !== 0 ? (
                        <Card>
                          <button
                            key={`${item}`}
                            className="data-info--text-button"
                            onClick={() => handleClick('data-access-model')}
                          >
                            <Flex
                              justifyContent={'space-between'}
                              alignItems={'center'}
                              gap="10px"
                              paddingY={'4px'}
                              paddingX={'8px'}
                            >
                              <Flex gap="12px">
                                <IconWrapper>
                                  {damIcons[`${item}`.toUpperCase()]}
                                </IconWrapper>
                                <Flex flexDirection={'column'} margin={'auto'}>
                                  <Text
                                    variant={'pt12b'}
                                    color={'var(--color-secondary-00)'}
                                  >
                                    {dataAccessModelInfo?.damObjCount[item]}
                                    {`    ${capitalize(item)} Access`}
                                  </Text>
                                  {dataAccessModelInfo.pricing[item][0] !==
                                    'open' &&
                                    dataAccessModelInfo.pricing[item].filter(
                                      (item) => item === null
                                    ).length !==
                                      dataAccessModelInfo.pricing[item]
                                        .length && (
                                      // dataAccessModelInfo.pricing[item].every(
                                      //   (val) => val !== null
                                      // )
                                      <Text
                                        variant={'pt12'}
                                        color={'var( --color-secondary-00)'}
                                      >
                                        {dataAccessModelInfo.pricing[item]
                                          .length > 1
                                          ? 'Price Starts at'
                                          : 'Priced at'}
                                        &nbsp;
                                        {'₹' +
                                          Math.min(
                                            ...dataAccessModelInfo.pricing[item]
                                          )}
                                      </Text>
                                    )}
                                </Flex>
                              </Flex>
                            </Flex>
                          </button>
                        </Card>
                      ) : (
                        <DisabledDamCards>
                          <DisableIconWrapper>
                            {damIcons[`${item}`.toUpperCase()]}
                          </DisableIconWrapper>
                          <Flex flexDirection={'column'} marginY={'auto'}>
                            <div
                              key={`${item}`}
                              className="data-info--text-button"
                            >
                              <Text
                                variant={'pt12b'}
                                color={'var(--color-gray-03)'}
                              >
                                {`  ${capitalize(item)} Access`}
                              </Text>
                            </div>
                          </Flex>
                        </DisabledDamCards>
                      )
                    )}
                </AccessModelCountWrapper>
              </>
            )}
          </>
        ) : (
          <>
            <ExternalCard>
              <LinkNav color={'var(--color-secondary-00)'} />
              <Text variant="pt14b" color={'var(--color-secondary-00)'}>
                {data?.resource_set?.length} External Links
              </Text>
            </ExternalCard>
            <ExternalMessageCard>
              <Info width={'14'} fill="var(--text-light)" />
              <Text variant="pt14" color={'var(--text-high)'}>
                This dataset is from an external website.
              </Text>
            </ExternalMessageCard>
          </>
        )}
      </>
    );
  };

  return (
    <>
      {datasetTimelineInfo ? (
        <InfoCardWrapper>
          <DataInfoCard scrollY={scrollY}>
            <AccessModelInfo dataAccessModelInfo={dataAccessModelInfo} />

            <Button
              className="dataset_info--button"
              fluid
              kind="secondary"
              onPress={() => handleClick('data-apis')}
            >
              View Distributions
            </Button>
          </DataInfoCard>
        </InfoCardWrapper>
      ) : (
        <DataSmallInfoCard scrollY={scrollY}>
          <AccessModelInfo dataAccessModelInfo={dataAccessModelInfo} />
          <Button
            className="dataset_info--button"
            fluid
            kind="secondary"
            onPress={() => handleClick('data-apis')}
          >
            View Distributions
          </Button>
        </DataSmallInfoCard>
      )}
    </>
  );
};

const InfoCardWrapper = styled.div`
  @media (max-width: 720px) {
    flex-grow: 1;
  }
`;

const ExternalCard = styled.div`
  border: 2px solid var(--color-gray-02);
  background-color: var(--color-white);
  display: flex;
  gap: 12px;
  padding: 8px;
  margin-block: 16px;
`;

const ExternalMessageCard = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 28px;
`;

const DataSmallInfoCard = styled.div<any>`
  display: ${(props) => (props.scrollY ? 'flex' : 'none')};
  flex-direction: column;
  background-color: var(--color-secondary-06);
  min-width: 320px;
  min-height: 280px;
  border: 2px solid var(--color-gray-02);
  border-radius: 4px;
  filter: var(--drop-shadow);
  padding: 16px;

  h1 {
    margin-bottom: 16px;
  }

  .data-info--text-button {
    margin: 0;
    padding: 0;
    text-align: left;
  }

  .dataset_info--button {
    margin-top: auto;
  }
`;

const DisabledDamCards = styled.div`
  display: flex;
  gap: 12px;
  border: 1px solid var(--color-gray-02);
  background-color: 'var(--color-gray-02)';
`;

const DisableIconWrapper = styled.div`
  svg {
    fill: var(--color-gray-03);
    width: 32px;
    display: block;
    margin: 8px;
  }
`;

const DataInfoCard = styled.div<any>`
  display: flex;
  flex-direction: column;
  background-color: var(--color-secondary-06);
  min-width: 320px;
  /* min-height: 400px; */
  filter: var(--drop-shadow);
  border: 2px solid var(--color-gray-02);
  border-radius: 4px;
  padding: 16px;

  svg {
    min-width: 18px;
  }

  .data-info--text-button {
    margin: 0;
    padding: 0;
    text-align: left;
  }

  .dataset_info--button {
    margin-top: auto;
  }

  .info_card__span {
    text-transform: uppercase;
    margin-top: 16px;
  }

  .info_card__separator {
    margin: 16px 0 12px 0;
  }

  .dataset_timeline__separator {
    margin: 12px 0;
  }
`;

const AccessModelCountWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  gap: 4px;
`;

const Card = styled.div`
  border: 1px solid var(--color-gray-02);
  margin-block: 2px;
  button {
    width: 100%;
  }
`;

const IconWrapper = styled.div`
  svg {
    fill: var(--color-secondary-00);
    width: 32px;
    display: block;
  }
`;
