import { DashSize400 } from '@opub-icons/ui';
import { Add, Close } from '@opub-icons/workflow';
import { Button, Modal } from 'components/actions';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from 'components/actions/Accordian/Accordian';
import { MenuComp } from 'components/actions/Menu/MenuComp';
import { Table } from 'components/data/BasicTable';
import {
  Heading,
  NoResult,
  ReadMore,
  Separator,
  Text,
  TruncateText,
} from 'components/layouts';
import { Flex } from 'components/layouts/FlexWrapper';
import { Link } from 'components/layouts/Link';
import router from 'next/router';
import { useState } from 'react';
import { pdfjs } from 'react-pdf';
import { useConstants } from 'services/store';
import styled from 'styled-components';
import { truncate } from 'utils/helper';
import { useWindowSize } from 'utils/hooks';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const ExplorerViz = ({ data, other }) => {
  const [showModal, setShowModal] = useState(false);
  const formatIcons = useConstants((e) => e.formatIcons);

  const { width } = useWindowSize();

  const { clickHandler } = other;

  const getColumnData = (datasetType) => {
    if (datasetType === 'CSV') {
      return [
        {
          headerName: 'Column',
        },
        {
          headerName: 'Description',
        },
        {
          headerName: 'Format',
        },
      ];
    }
    return [
      {
        headerName: 'Column',
      },
      {
        headerName: 'Description',
      },
      {
        headerName: 'Format',
      },
      {
        headerName: 'Array Item',
      },
      {
        headerName: 'Parent',
      },
    ];
  };

  const [currentAccordion, setCurrentAccordion] = useState();

  const formatRowData = (schema, fileFormat) => {
    if (fileFormat === 'CSV') {
      return schema.map((item) => ({
        Column: item?.display_name,
        Description: item?.description || '-',
        Format: item?.format,
      }));
    }
    return schema.map((item) => ({
      Column: item?.key,
      Description: item?.description || '-',
      Format: item?.format,
      'Array Item': item?.array_item?.key || '-',
      Parent: item?.parent?.key || '-',
    }));
  };

  const vizToggle = data.allRes?.map((item) => {
    return {
      name: item.title || item?.api_details?.api_source?.title,
      id: `#${item?.id}`,
      format: item.file_details?.format || item?.api_details?.response_type,
      description: item.description,
      schema: formatRowData(
        item.schema,
        item.file_details?.format || item.api_details?.response_type
      ),
      byte_size: item?.byte_size,
      checksum: item?.checksum,
      compression_format: item?.compression_format,
      media_type: item?.media_type,
      packaging_format: item?.packaging_format,
      release_date: item?.release_date,
      external_url: item?.external_url,
    };
  });

  const changeTab = () => {
    clickHandler && clickHandler();
    router.push(
      {
        pathname: router.pathname,
        query: {
          explorer: router.query.explorer,
          tab: 'data-access-model',
        },
      },
      router.pathname,
      { shallow: true }
    );
  };

  const ViewSchema = (item) => {
    return (
      <>
        <Button
          title="Get Access"
          onClick={() => setShowModal(true)}
          size="sm"
          fluid
          kind="primary-outline"
          className="view-schema"
        >
          View Schema
        </Button>
        <Modal
          label="api details"
          isOpen={showModal}
          modalHandler={() => setShowModal(false)}
        >
          <ModalWrapper>
            <Flex justifyContent="space-between" alignItems="center" gap="16px">
              <Text variant="pt14b" color={'var(--text-high)'}>
                Schema Details
              </Text>
              <Button
                onClick={() => setShowModal(false)}
                iconOnly
                icon={<Close />}
                kind="custom"
              >
                close
              </Button>
            </Flex>
            {item.schema.length === 0 ? (
              <NoResult />
            ) : (
              <Table
                columnData={getColumnData(item.format)}
                rowData={item.schema}
                label="Schema Table"
                heading={`Schema Table fields for ${data?.title}`}
              />
            )}
          </ModalWrapper>
        </Modal>
      </>
    );
  };

  return (
    <>
      <Wrapper>
        <div className="onlyDesktop">
          <Heading as={'h3'} variant="h3">
            Distributions
            {other.dataset_type !== 'EXTERNAL'
              ? ' (Data & APIs)'
              : ' (External)'}
          </Heading>
        </div>

        {vizToggle.length > 0 ? (
          vizToggle.map((item, index) => (
            <>
              <CardWrapper key={`wrapper-${index}`}>
                <DataWrapper>
                  <Flex
                    gap="8px"
                    flexBasis="80%"
                    flexGrow="1"
                    alignItems="flex-start"
                  >
                    {other.dataset_type !== 'EXTERNAL'
                      ? formatIcons[item.format]
                      : formatIcons[other.dataset_type]}
                    <div>
                      <Heading as="h4" variant="h5">
                        {item.name}
                      </Heading>
                      <ReadMore
                        as="p"
                        variant="pt14"
                        color="var(--text-medium)"
                      >
                        {item.description}
                      </ReadMore>
                    </div>
                  </Flex>
                  <Separator className="mobile-separator" />
                  {other.dataset_type !== 'EXTERNAL' ? (
                    <Buttons>
                      {ViewSchema(item)}
                      <Button
                        title="Get Access"
                        onPress={() => changeTab()}
                        size="sm"
                        fluid={width < 640}
                      >
                        Get Access
                      </Button>
                    </Buttons>
                  ) : (
                    <Link target="_blank" href={item.external_url} external>
                      <button className="storyfile">Open Link</button>
                    </Link>
                  )}
                </DataWrapper>
                <OptionalData>
                  {item?.byte_size > 0 && (
                    <Text variant="pt14">
                      <strong>Byte Size: </strong>
                      {item?.byte_size}
                    </Text>
                  )}

                  {item?.checksum && (
                    <Text variant="pt14">
                      <strong>Checksum: </strong>
                      {item?.checksum}
                    </Text>
                  )}

                  {item?.compression_format && (
                    <Text variant="pt14">
                      <strong>Compression Format: </strong>
                      {item?.compression_format}
                    </Text>
                  )}

                  {item?.media_type && (
                    <Text variant="pt14" title={item.media_type}>
                      <strong>Media Type: </strong>

                      {truncate(item.media_type, 30)}
                    </Text>
                  )}

                  {item?.packaging_format && (
                    <Text variant="pt14">
                      <strong>Packaging Format: </strong>
                      {item?.packaging_format}
                    </Text>
                  )}
                  {item?.release_date && (
                    <Text variant="pt14">
                      <strong>Release Date: </strong>
                      {item?.release_date}
                    </Text>
                  )}
                </OptionalData>
                <DesktopAccess>
                  {other.dataset_type !== 'EXTERNAL' && (
                    <>
                      <Separator className="card_wrapper__span" />
                      <Accordion
                        type="single"
                        collapsible
                        onValueChange={(e: any) => setCurrentAccordion(e)}
                        value={currentAccordion}
                        disabled={item.schema.length === 0}
                      >
                        <StyledTabItem value={item.id}>
                          <StyledTabTrigger
                            title={
                              !item.schema.length ? 'No Schema Available' : null
                            }
                          >
                            <Text variant="pt16b" color={'var(--text-medium)'}>
                              Schema
                            </Text>
                            <Flex gap="10px">
                              {item.schema.length === 0
                                ? 'No Schema Available'
                                : null}
                              {currentAccordion === item.id ? (
                                <DashSize400 fill="var(--color-gray-04)" />
                              ) : (
                                <Add fill="var(--color-gray-04)" />
                              )}
                            </Flex>
                          </StyledTabTrigger>
                          <StyledTabContent>
                            <Text variant="pt14b" color={'var(--text-high)'}>
                              Schema Details
                            </Text>
                            {item.schema.length === 0 ? (
                              <NoResult />
                            ) : (
                              <Table
                                columnData={getColumnData(item.format)}
                                rowData={item.schema}
                                label="Schema Table"
                                heading={`Schema Table fields for ${data?.title}`}
                              />
                            )}
                          </StyledTabContent>
                        </StyledTabItem>
                      </Accordion>
                    </>
                  )}
                </DesktopAccess>
              </CardWrapper>
            </>
          ))
        ) : (
          <NoResult />
        )}
      </Wrapper>
    </>
  );
};

export default ExplorerViz;

export const Wrapper = styled.section`
  display: flex;
  flex-direction: column;
  gap: 16px;

  @media (max-width: 640px) {
    gap: 8px;
    margin-inline: -12px;
    margin-top: -8px;
  }
`;

const StyledTabItem = styled(AccordionItem)`
  padding: 0;
`;

const StyledTabTrigger = styled(AccordionTrigger)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  width: 100%;
  padding: 0;

  &[data-disabled] {
    cursor: not-allowed;
  }
`;

const StyledTabContent = styled(AccordionContent)`
  overflow: auto;
  margin-top: 24px;

  table {
    margin-top: 12px;
  }
`;

export const CardWrapper = styled.div`
  background: var(--color-white);
  box-shadow: var(--box-shadow);
  border-radius: 4px;
  padding: 20px 24px;

  .storyfile {
    padding: 8px 16px;
    font-size: 0.875rem;
    line-height: 1.7;
    font-weight: var(--font-bold);
    display: flex;
    color: var(--color-background-lightest);
    background-color: var(--color-primary-01);
    border-radius: 2px;
    align-items: center;
    white-space: nowrap;
    width: fit-content;
    height: fit-content;

    &:hover {
      filter: brightness(110%);
    }
  }

  div > div > svg {
    min-width: 48px;
  }

  .card_wrapper__span {
    margin: 12px 0;
  }

  h3 {
    padding-bottom: 0px;
    border-bottom: none;
  }

  .AccordionHeader {
    background-color: var(--color-white);
    padding: 0.5rem;
  }

  .AccordionContainer {
    border-style: solid;
    border-color: var(--color-background-alt-dark);

    padding: 0.5rem;

    .AccordionBar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      cursor: pointer;
    }

    .AccordionBody {
      overflow-y: auto;
      overflow-x: auto;

      .DocumentWrapper {
        max-height: 800px;
        max-width: 800px;
      }

      @media (max-width: 900px) {
        .DocumentWrapper {
          width: calc(100vw - 120px);
        }
      }
    }
  }

  .AccordionFooter {
    display: flex;
    align-items: center;
    border-top-width: 2px;
    border-style: solid;
    border-color: var(--color-background-alt-dark);
    justify-content: space-between;
    padding: 0.5rem;
  }

  @media (max-width: 640px) {
    padding: 12px;
    box-shadow: none;
    border: 1px solid var(--color-gray-02);
  }
`;

export const VizWrapper = styled.div`
  background-color: #fff;
  border: 1px solid #f7fdf9;
  border-radius: 6px;
  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.14);
`;

export const VizHeader = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1.5rem;
  gap: 1.5rem;

  ${MenuComp} {
    flex-basis: 270px;
  }
`;

export const DataWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 8px;

  .mobile-separator {
    width: 100%;
    display: none;
  }

  @media (max-width: 640px) {
    flex-wrap: wrap;

    .mobile-separator {
      display: block;
    }
  }
`;

const OptionalData = styled.div`
  margin-left: 56px;
  margin-top: 4px;
  display: grid;
  align-items: stretch;
  grid-template-columns: repeat(auto-fit, minmax(min(350px, 100%), 1fr));
`;

export const VizTabs = styled.ul`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1.5rem;

  a {
    display: block;
    white-space: nowrap;
    /* overflow: hidden; */
    /* text-overflow: ellipsis; */
    text-decoration: none;
    padding: 8px 12px;
    display: block;
    text-align: center;
    border-bottom: 2px solid transparent;
    font-weight: bold;
    color: hsla(0, 0%, 0%, 0.32);
    max-width: 250px;

    svg {
      margin-bottom: -3px;
      margin-right: 5px;
      fill: hsla(0, 0%, 0%, 0.32);

      &.svg-stroke {
        stroke: hsla(0, 0%, 0%, 0.32);
      }
    }

    &[aria-selected='true'] {
      color: #de4b33;
      border-bottom: 2px solid #de4b33;

      svg {
        fill: #de4b33;

        &.svg-stroke {
          stroke: #de4b33;
        }
      }
    }
  }
`;

export const VizGraph = styled.div`
  margin: 0 2rem 2rem;
  a {
    width: max-content;
    margin-bottom: 1rem;
  }
  > div {
    //Breaking the React Table Pagination Component hence commented but PDF not working as expected
    /* height: 500px; */
    overflow-y: auto;
    overflow-x: auto;
    /* max-width: calc(100vw - 120px); */
  }

  .DocumentWrapper {
    max-height: 800px;
  }
`;

export const ExplorerSource = styled.div`
  border-top: 1px solid #cdd1d1;
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  justify-content: flex-end;
  align-items: flex-start;
  padding: 1rem 0;
  margin: 0 1.5rem;

  button,
  a {
    svg {
      width: 10px;
      margin-left: 8px;
    }
  }
`;

export const SourceText = styled.div`
  flex-basis: 35%;
  flex-grow: 1;
  font-size: 14px;

  p {
    color: var(--text-medium);
    font-weight: var(--font-weight-medium);
    display: inline;
  }
`;

export const NoView = styled.p`
  margin-top: 16px;
`;

const Buttons = styled.div`
  display: flex;
  gap: 16px;

  .view-schema {
    display: none;
  }

  @media (max-width: 640px) {
    width: 100%;

    .view-schema {
      display: inline-flex;
    }
  }
`;

const DesktopAccess = styled.div`
  @media (max-width: 640px) {
    display: none;
  }
`;

const ModalWrapper = styled.div`
  padding: 16px;
  background-color: var(--color-white);
  border-radius: 4px;
  height: 80vh;

  display: flex;
  flex-direction: column;
  gap: 16px;
`;
