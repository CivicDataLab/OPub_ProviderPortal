import { useMutation } from '@apollo/client';
import styled from 'styled-components';
import { Edit, MoreSmallListVert, Preview } from '@opub-icons/workflow';
import { toast } from 'react-toastify';
import { mutation, DELETE_RESOURCE, UPDATE_PATCH_OF_DATASET } from 'services';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'Store';
import { Flex } from 'components/layouts/FlexWrapper';
import { useConstants, useProviderStore } from 'services/store';
import { Heading, Text } from 'components/layouts';
import { Button, Modal } from 'components/actions';
import { fetchapipreview } from 'utils/fetch';
import JSONPretty from 'react-json-pretty';
import { CrossSize300 } from '@opub-icons/ui';
import { Loader } from 'components/common';
import DeleteDistributionIconModal from '../DeleteDistributionIconModal';
import { Table } from 'components/data/BasicTable';
import { prepareCSVPreviewForTable } from 'utils/helper';
import { useSession } from 'next-auth/react';

export function CardListing({ handleEdit, handleDelete }) {
  const datasetStore = useSelector((state: RootState) => state.addDataset);
  const formatIcons = useConstants((e) => e.formatIcons);

  return (
    <DataView>
      {/* <h2>Added Resources</h2> */}

      {datasetStore.resource_set.map((item, index) => (
        <Flex justifyContent="space-between" key={item.id} data-id={item.id}>
          <Flex gap="10px" alignItems={'center'}>
            {formatIcons[item?.api_details?.response_type]}
            <div>
              <Text variant="pt16b">{item.title}</Text>
            </div>
          </Flex>
          <div className="more">
            <MoreSmallListVert width={24} />
          </div>
          <div className="fileActionBtns">
            <APIPreviewModal item={item} />

            <Button
              kind="custom"
              data-id={item.id}
              title="Edit the Distribution"
              icon={<Edit />}
              onPress={(e: any) => handleEdit(e.target.dataset.id)}
            />

            <DeleteDistributionIconModal
              distributionItem={item}
              handleDelete={handleDelete}
            />
          </div>
        </Flex>
      ))}
    </DataView>
  );
}

function APIPreviewModal({ item }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  function modalHandler() {
    setIsModalOpen(!isModalOpen);
  }
  const [previewData, setPreviewData] = useState();
  const { data: session } = useSession();
  const currentOrgRole = useProviderStore((e) => e.org);

  const handlePreview = (e) => {
    modalHandler();
    fetchapipreview(e, session, currentOrgRole?.org_id)
      .then((res) => {
        if (res.Success === true) {
          setPreviewData(res.data);
        } else {
          setIsModalOpen(false);
          toast.error(
            `Error in Fetching API Preview. ${res.error} Please review the API details.`
          );
        }
      })
      .catch((err) => {
        setIsModalOpen(false);
        toast.error(`Error in Fetching API Preview. ${err}`);
      });
  };

  return (
    <>
      <Button
        kind="custom"
        size="md"
        title="See a Preview of the Distribution"
        data-id={item.id}
        icon={<Preview />}
        onPress={(e: any) => handlePreview(e.target.dataset.id)}
      />

      <Modal
        isOpen={isModalOpen}
        modalHandler={() => modalHandler()}
        label="Add API Source"
      >
        <Status>
          <Header>
            <Heading variant="h3">Data Preview - {item.title}</Heading>

            <Button
              kind="custom"
              size="md"
              icon={<CrossSize300 />}
              onPress={() => setIsModalOpen(!isModalOpen)}
            />
          </Header>
          <hr />
          <DataWrapper>
            {previewData ? (
              item.api_details?.response_type === 'CSV' ? (
                <Table
                  columnData={prepareCSVPreviewForTable(previewData).columnData}
                  rowData={prepareCSVPreviewForTable(previewData).rows}
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
        </Status>
      </Modal>
    </>
  );
}

export function ResourceListing({ handleCallback, updateStore }) {
  const dispatch = useDispatch();

  const datasetStore = useSelector((state: RootState) => state.addDataset);

  const router = useRouter();

  const [deleteResourceReq, deleteResourceRes] = useMutation(DELETE_RESOURCE);
  const [patchDatasetFunnelReq, patchDatasetFunnelRes] = useMutation(
    UPDATE_PATCH_OF_DATASET
  );

  function handleEdit(id) {
    handleCallback(id);
  }

  function handleDelete(id) {
    mutation(deleteResourceReq, deleteResourceRes, {
      resource_data: { id: id },
    })
      .then(() => {
        // TODO: Resource should be removed from DatasetStore
        datasetStore.resource_set.length == 1
          ? mutation(patchDatasetFunnelReq, patchDatasetFunnelRes, {
              dataset_data: {
                funnel: 'Distributions',
                id: router.query.datasetId,
                status: 'DRAFT',
                title: datasetStore.title,
                description: datasetStore.description,
              },
            })
              .then(() => {})
              .catch(() => {
                toast.error('Funnel Patch Failed');
              })
          : null;
        toast.success('Distribution deleted successfully');
        updateStore();
      })
      .catch((err) => {
        toast.error('Error while deleting distribution');
      });
  }

  return <CardListing handleEdit={handleEdit} handleDelete={handleDelete} />;
}

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

const DataView = styled.section`
  display: block;
  width: 100%;
  /* overflow-y: auto; */
  > div {
    background-color: var(--color-tertiary-1-06);
    width: 100%;
    margin: 1rem 0;
    padding: 10px;
    border: 1px solid var(--color-gray-02);

    .fileActionBtns {
      display: none;
    }
    .more {
      align-items: center;
      display: flex;
      padding-right: 20px;
    }
    &:hover {
      background-color: var(--color-background-lightest);
      .fileActionBtns {
        align-items: center;
        display: flex;
      }
      .more {
        display: none;
      }
    }
  }
`;
