import { CrossSize300 } from '@opub-icons/ui';
import { Button, Modal, Tabs } from 'components/actions';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Heading } from '../Heading';
import { Table } from 'components/data/BasicTable';
import { Loader } from 'components/common';
import { toast } from 'react-toastify';
import { fetchDamResourcePreview } from 'utils/fetch';
import JSONPretty from 'react-json-pretty';
import { Flex } from '../FlexWrapper';
import { TabsList, TabsTrigger } from 'components/actions/Tabs/Tabs';
import { useSession } from 'next-auth/react';
import { useProviderStore } from 'services/store';
import { capitalize } from 'utils/helper';

export const Preview = ({ data, schema }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  function modalHandler() {
    setIsModalOpen(!isModalOpen);
  }
  const [typeofPreview, setTypeofPreview] = useState('Schema');

  const [previewData, setPreviewData] = useState();
  const [previewId, setPreviewId] = useState();
  const { data: session } = useSession();
  const currentOrgRole = useProviderStore((e) => e.org);

  useEffect(() => {
    setTypeofPreview('Schema');
  }, [isModalOpen]);

  const Format = data?.file_details
    ? data.file_details?.format
    : data.api_details?.response_type;

  const handlePreview = (e) => {
    fetchDamResourcePreview(data.damResourceId, session, currentOrgRole?.org_id)
      .then((res) => {
        if (res.Success === true) {
          setPreviewData(res.data);
        } else {
          setIsModalOpen(false);
          toast.error('Error in Fetching API Preview');
        }
      })
      .catch(() => {
        setIsModalOpen(false);
        toast.error('Error in Fetching API Preview');
      });
  };

  const getTableData = (csvData) => {
    const totalArray = csvData;
    if (csvData.length == 0) {
      return {
        columnData: [
          {
            headerName: '',
          },
        ],
        rows: [],
      };
    }
    const columnData = Object?.keys(totalArray[0]).map((item) => {
      return {
        headerName: item,
      };
    });

    const rowsData = totalArray.map((item) => {
      const rowElements = Object.values(item);
      const singleRow = {};
      rowElements.forEach((element, index) => {
        singleRow[columnData[index]?.headerName || 'dummy'] = element;
      });
      return singleRow;
    });

    return {
      columnData: columnData,
      rows: rowsData,
    };
  };

  const distributionSchema = (schema !== '' &&
    schema
      ?.filter((item) => item.id === data.id)
      ?.map((item) => item.schema)) || [null];

  const damschema = data.fields?.map((item) => item.key);

  const filteredSchema = distributionSchema[0]?.filter((item) =>
    damschema.includes(item.key)
  );

  const formatRowData = (orgschema, fileFormat) => {
    if (fileFormat === 'CSV') {
      return orgschema.map((item) => ({
        Column: item?.display_name,
        Description: item?.description || '-',
        Format: capitalize(item?.format),
      }));
    }
    return orgschema.map((item) => ({
      Column: item?.key,
      Description: item?.description || '-',
      Format: capitalize(item?.format),
      'Array Item': item?.array_item?.key || '-',
      Parent: item?.parent?.key || '-',
    }));
  };

  const FinalSchema = {
    data:
      (schema &&
        schema !== '' &&
        formatRowData(
          filteredSchema,
          schema?.file_details?.format || schema?.api_details?.response_type
        )) ||
      [],
  };

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

  const TabHeaders = [
    {
      name: (
        <Flex padding="10px 0" gap="10px">
          <Heading as="h2" variant="h5" title="Schema">
            Schema
          </Heading>
        </Flex>
      ),
      id: 'Schema',
      disabled: false,
    },
    {
      name: (
        <Flex padding="10px 0" gap="10px">
          <Heading
            as="h2"
            variant="h5"
            title={
              data.sample_enabled === false
                ? 'Preview not enabled. Please contact Data Provider'
                : Format.toLowerCase() == 'pdf'
                ? 'Preview is not enabled for PDF file'
                : 'Preview Data'
            }
          >
            Preview
          </Heading>
        </Flex>
      ),
      id: 'Preview',
      disabled: data.sample_enabled === false || Format.toLowerCase() == 'pdf',
    },
  ];

  return (
    <Wrapper>
      <Button
        // isDisabled={
        //   data.sample_enabled === false || Format.toLowerCase() == 'pdf'
        // }
        kind="primary-outline"
        size="sm"
        fluid
        title={'Schema & Preview'}
        onPress={(e: any) => {
          modalHandler();
          data?.file_details?.format === 'PDF'
            ? setPreviewId(e.target.dataset.id)
            : handlePreview(e.target.dataset.id);
        }}
      >
        Schema & Preview
      </Button>
      <Modal
        isOpen={isModalOpen}
        modalHandler={() => modalHandler()}
        label="Add API Source"
      >
        <Status>
          <Header>
            <Heading variant="h3">Data Preview - {data.title}</Heading>

            <Button
              kind="custom"
              size="md"
              icon={<CrossSize300 />}
              onClick={() => setIsModalOpen(!isModalOpen)}
            />
          </Header>
          <hr />

          <Tabs
            onValueChange={(selected) => setTypeofPreview(selected)}
            value={typeofPreview}
          >
            <StyledTabList>
              {TabHeaders.map((item) => (
                <StyledTabTrigger
                  key={item.id}
                  value={item.id}
                  disabled={item.disabled}
                >
                  {item.name}
                </StyledTabTrigger>
              ))}
            </StyledTabList>
          </Tabs>

          {typeofPreview === 'Preview' ? (
            <DataWrapper>
              {previewData ? (
                Format === 'CSV' ? (
                  <Table
                    columnData={getTableData(previewData).columnData}
                    rowData={getTableData(previewData).rows}
                    label={'CSV Table'}
                    heading={''}
                  />
                ) : (
                  <JSONPretty id="json-pretty" data={previewData} />
                )
              ) : (
                <Loader isSection />
              )}
            </DataWrapper>
          ) : (
            <DataWrapper>
              <Table
                columnData={getColumnData(
                  schema?.file_details?.format ||
                    schema?.api_details?.response_type
                )}
                rowData={FinalSchema?.data}
                label="Schema Table"
                heading={`Schema Table fields for ${data?.title}`}
              />
            </DataWrapper>
          )}
        </Status>
      </Modal>
    </Wrapper>
  );
};

const Wrapper = styled.div``;

const Status = styled.section`
  background-color: var(--color-background-lightest);
  padding: 10px 24px;
  border-radius: 8px;
  button {
    /* padding: 10px; */
  }
  .__json-pretty__,
  .__json-pretty-error__ {
    margin-top: 30px;
    white-space: break-spaces;
  }
`;
const DataWrapper = styled.div`
  white-space: break-spaces;
  max-height: 70vh;
  max-width: 50vw;
  min-width: 50vw;
  overflow: auto;
  @media screen and (max-width: 920px) {
    max-width: 100%;
  }
`;
const Header = styled.div`
  background-color: var(--color-background-lightest);
  justify-content: space-between;
  display: flex;
  margin-bottom: 10px;
  button {
    margin-block: auto;
  }
`;

const StyledTabList = styled(TabsList)`
  display: flex;
  gap: 30px;
  width: 100%;
  overflow-x: auto;
  justify-content: center;
  margin-bottom: 10px;
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
