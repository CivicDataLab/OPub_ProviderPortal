import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RootState } from 'Store';
import { Button } from 'components/actions';
import { toast } from 'react-toastify';
import { DELETE_RESOURCE, mutation } from 'services';
import { useMutation } from '@apollo/client';
import { Delete } from '@opub-icons/workflow';
import { Flex } from 'components/layouts/FlexWrapper';
import { FilePreviewModal, FileSchemaPreviewModal } from './Transformations';
import { dateFormat } from 'utils/helper';

const PipelineStatusForm = ({ resourceData, updateStore }) => {
  const datasetStore = useSelector((state: RootState) => state.addDataset);
  const [deleteResourceReq, deleteResourceRes] = useMutation(DELETE_RESOURCE);

  function humanize(str: any) {
    var i,
      frags = str.split('_');
    for (i = 0; i < frags.length; i++) {
      frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1);
    }
    return frags.join(' ');
  }

  function tasks(str) {
    // Check whether we are getting skip columns and format based on the response
    const formatStr = str.includes("'columns':")
      ? str
          .split(':')[1]
          .replace(/[{}''\[\]'_+]/g, ' ')
          .split(',')
      : str.replace(/[{}''\[\]'_+]/g, ' ').split(',');
    return (
      <TransformationViewer>
        {formatStr.map((item) => (
          <span key={item[0]}>
            <strong>{item.split(':')[0]} </strong>
            {item.split(':')[1] ? `:${item.split(':')[1]}` : ''}
          </span>
        ))}
      </TransformationViewer>
    );
  }
  const deleteResourceFromServer = (resourceItemId) => {
    mutation(deleteResourceReq, deleteResourceRes, {
      resource_data: {
        id: resourceItemId,
      },
    })
      .then(() => {
        toast.success('Distribution deleted successfully');
        updateStore();
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  const distributionStatus = datasetStore.resource_set
    .map((res) => res.id)
    .includes(resourceData.resultant_res_id);

  return (
    <PipelineForm>
      <div className="schemadata" key={resourceData.pipeline_id}>
        <div className="resoucedata">
          {distributionStatus === true && (
            <>
              <div className="resourcename">
                <p>Distribution Name:</p>
                {datasetStore.resource_set.map((resourceItem) => {
                  if (resourceItem.id === resourceData?.resultant_res_id) {
                    return resourceItem.title;
                  }
                })}
              </div>
              <div>{dateFormat(resourceData.created_at)}</div>
            </>
          )}
        </div>
        <div>
          {resourceData.error_message && (
            <p className="error">
              <strong>Error: </strong>
              {resourceData.error_message}
            </p>
          )}
        </div>
        <div className="headers">
          <p>Transformation</p>
          <p>Description</p>
        </div>
        <hr></hr>{' '}
        {resourceData.tasks.map((dataStoreItem, index) => (
          <>
            <div className="resourcedetails" key={index}>
              <div className="name">
                <label>
                  <input
                    type="text"
                    defaultValue={humanize(dataStoreItem.task_name)}
                    maxLength={100}
                    disabled
                  />
                </label>
              </div>
              <div className="description">{tasks(dataStoreItem.context)}</div>
            </div>
          </>
        ))}
        <Flex justifyContent={'space-between'} paddingY={'24px'}>
          {resourceData.db_action == 'create' &&
          resourceData.status == 'Done' ? (
            <Button
              kind="secondary-outline"
              size="sm"
              title={
                distributionStatus
                  ? 'Delete Distribution'
                  : 'Distribution does not exist'
              }
              icon={<Delete />}
              isDisabled={distributionStatus ? false : true}
              iconSide={'left'}
              onPress={() => {
                deleteResourceFromServer(resourceData.resultant_res_id);
              }}
            >
              Delete Distribution
            </Button>
          ) : (
            ''
          )}
          {resourceData.status == 'Done' ? (
            <PreviewButtons>
              <FilePreviewModal
                item={resourceData.resultant_res_id}
                enable_add={true}
                distributionStatus={distributionStatus ? '' : true}
              />
              <FileSchemaPreviewModal
                item={resourceData.resultant_res_id}
                enable_add={true}
                datasetStore={datasetStore}
                updateStore={updateStore}
                distributionStatus={distributionStatus ? '' : true}
              />
            </PreviewButtons>
          ) : (
            ''
          )}
        </Flex>
      </div>
    </PipelineForm>
  );
};

export default PipelineStatusForm;
const PreviewButtons = styled.div`
  display: flex;
  margin-left: auto;

  gap: 10px;
  button {
    border: 2px solid var(--color-tertiary-1-00);
    color: var(--color-tertiary-1-00);
    background-color: var(--color-background-lightest);
  }
`;
const PipelineForm = styled.section`
  .error {
    color: var(--color-error);
    padding: 10px 0;
  }
  .deldistribution {
    margin: 10px 0;
    margin-left: auto;
  }
  .schemadata {
    display: block;
    width: 100%;

    .headers {
      display: flex;
      margin-top: 1rem;
      p {
        width: 100%;
      }
    }
    .resoucedata {
      display: flex;
      justify-content: space-between;
    }
    .resourcename {
      display: flex;
      gap: 0.3rem;
      font-weight: 400;
      p {
        font-weight: 600;
      }
    }
  }
  .resourcedetails {
    display: flex;
    width: 100%;
    gap: 1rem;
    margin-bottom: 5px;
    input,
    textarea {
      background-color: var(--color-white);
      border: none;
      box-shadow: 0 0 2px black;
      line-height: 2;
      // height: 4rem;
      border-radius: 5px;
      padding: 0 10px;
      margin-top: 4px;
      font-weight: 400;
      width: 100%;
    }
    .name {
      flex: 1;
    }
    .description {
      flex: 3;
      textarea {
        white-space: inherit;
        // height:auto
        height: 90%;
        resize: none;
        padding-top: 10px;
      }
    }
  }
`;

const TransformationViewer = styled.div`
  padding: 1rem;
  background-color: var(--color-white);
  border: none;
  box-shadow: 0 0 2px black;
  line-height: 2;
  border-radius: 5px;
  padding: 0 10px;
  margin-top: 4px;
  font-weight: 400;
  width: 100%;

  strong {
    font-weight: 600;
    text-transform: capitalize;
  }
  span {
    display: flex;
    gap: 0.4rem;
    font-weight: 400;
  }
`;
function dispatch(arg0: {
  payload: { type: string; value: import('slices/addDatasetSlice').Resource[] };
  type: string;
}) {
  throw new Error('Function not implemented.');
}
