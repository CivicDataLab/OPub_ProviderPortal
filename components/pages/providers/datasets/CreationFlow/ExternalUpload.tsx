import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Button } from 'components/actions';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'Store';
import { updateDatasetElements } from 'slices/addDatasetSlice';
import { useMutation } from '@apollo/client';
import { DELETE_RESOURCE, mutation } from 'services';
import { toast } from 'react-toastify';
import { UPDATE_PATCH_OF_DATASET } from 'services';
import { useRouter } from 'next/router';
import { Edit, ChevronLeft, MoreSmallListVert } from '@opub-icons/workflow';
import { Flex } from 'components/layouts/FlexWrapper';
import { Text } from 'components/layouts';
import { Link } from 'components/layouts/Link';
import { useConstants } from 'services/store';
import { Heading } from 'components/layouts';
import { ComponentWrapper, SubmitFotter } from '../Metadata/Metadata';
import IconNext from 'components/icons/IconNext';
import DeleteDistributionIconModal from './DeleteDistributionIconModal';
import useEffectOnChange from 'utils/hooks';
import ExternalUploadForm from './ExternalUploadForm';
import { LinkButton } from 'components/pages/dashboard/helpers';

const ExternalUpload = ({ updateStore, setSelectedStep }) => {
  const formatIcons = useConstants((e) => e.formatIcons);

  const dispatch = useDispatch();
  const datasetStore = useSelector((state: RootState) => state.addDataset);
  const router = useRouter();
  const [userRoles, setUserRoles] = useState([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setUserRoles(JSON.parse(localStorage.getItem('access_roles')));
    }
  }, []);

  const [deleteResourceReq, deleteResourceRes] = useMutation(DELETE_RESOURCE);

  const [patchDatasetFunnelReq, patchDatasetFunnelRes] = useMutation(
    UPDATE_PATCH_OF_DATASET
  );
  const [resourceId, setResourceId] = useState(null);

  useEffect(() => {
    updateStore();
  }, []);

  const [currentTab, setCurrentTab] = React.useState<
    'create' | 'list' | 'edit'
  >('list');
  const [editId, setEditId] = React.useState();
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 20, behavior: 'smooth' });
    }
  }, [currentTab, setSelectedStep]);

  const deleteResourceFromServer = (resourceItemId) => {
    mutation(deleteResourceReq, deleteResourceRes, {
      resource_data: {
        id: resourceItemId,
      },
    })
      .then(() => {
        // Change funnel to Distributions if the resources length is 0 to ensure at-least one resource would be added to the dataset
        datasetStore.resource_set.length > 1
          ? null
          : mutation(patchDatasetFunnelReq, patchDatasetFunnelRes, {
              dataset_data: {
                funnel: 'Distributions',
                id: datasetStore.id,
                status: 'DRAFT',
                title: datasetStore.title,
                description: datasetStore.description,
              },
            })
              .then(() => {})
              .catch(() => {
                toast.error('Funnel Patch Failed');
              });
        toast.success('Distribution deleted successfully');
        updateStore();
      })
      .catch(() => {
        toast.error('Error while deleting distribution');
      });
  };

  const movetoDataaccessmodel = () => {
    datasetStore.funnel === 'Distributions' &&
    datasetStore.resource_set.length > 0
      ? mutation(patchDatasetFunnelReq, patchDatasetFunnelRes, {
          dataset_data: {
            funnel: 'Data Access Model',
            id: datasetStore.id,
            status: 'DRAFT',
            title: datasetStore.title,
            description: datasetStore.description,
          },
        })
          .then(() => {
            dispatch(
              updateDatasetElements({
                type: 'updateFunnel',
                value: 'Data Access Model',
              })
            );
          })
          .catch(() => {
            toast.error('Funnel Patch Failed');
          })
      : null;
    setSelectedStep('data-access-model');
  };

  useEffectOnChange(() => {
    if (currentTab === 'list') setResourceId(null);
  }, [currentTab]);

  useEffectOnChange(() => {
    if (resourceId) setCurrentTab('edit');
  }, [resourceId]);

  function handleManage(id) {
    setResourceId(id);
  }

  return (
    <>
      {currentTab == 'list' ? (
        <>
          <ComponentWrapper>
            <HeaderWrapper>
              <Heading as="h2" variant="h3" marginY={'auto'}>
                Distribution
              </Heading>
            </HeaderWrapper>
            <AddDistribution title="Add Distribution">
              <LinkButton
                label="Add Distribution"
                type="create"
                onClick={() => setCurrentTab('create')}
              />
            </AddDistribution>
            {datasetStore.resource_set.length > 0 && (
              <DataView>
                <Heading
                  as="h2"
                  variant={'h4'}
                  marginTop={'20px'}
                  marginBottom={'8px'}
                  color={'var(--color-dodger-blue-06)'}
                >
                  {datasetStore.resource_set.length > 1
                    ? `${datasetStore.resource_set.length} Distributions Added`
                    : `${datasetStore.resource_set.length}  Distribution Added`}
                </Heading>
                {datasetStore.resource_set.map((dataStoreItem, index) => (
                  <Flex key={index} justifyContent="space-between">
                    <Flex gap="10px" alignItems={'center'}>
                      {formatIcons[datasetStore.dataset_type]}
                      <div>
                        <Text variant="pt16b">{dataStoreItem.title}</Text>
                      </div>
                    </Flex>
                    <div className="more">
                      <MoreSmallListVert width={24} />
                    </div>
                    <div className="fileActionBtns">
                      {/* <a
                  href={`${process.env.NEXT_PUBLIC_BACKEND_URL}/download/${dataStoreItem.id}`}
                  download={dataStoreItem.file_details?.file
                    .toString()
                    .split('/')
                    .pop()}
                >
                  <Download height={18} width={18} />
                </a> */}
                      <Button
                        kind="custom"
                        icon={<Edit />}
                        title={'Edit the Distribution'}
                        onPress={() => {
                          handleManage(dataStoreItem.id);
                        }}
                      />

                      <DeleteDistributionIconModal
                        distributionItem={dataStoreItem}
                        handleDelete={deleteResourceFromServer}
                      />
                    </div>
                  </Flex>
                ))}
                {datasetStore.resource_set.length < 1 && (
                  <Text color={'var(--text-light)'}>
                    No files uploaded yet. You can add files below.
                  </Text>
                )}
              </DataView>
            )}
          </ComponentWrapper>
        </>
      ) : currentTab === 'edit' ? (
        <ExternalUploadForm
          updateStore={updateStore}
          setCurrentTab={setCurrentTab}
          resourceId={resourceId}
          setResourceId={setResourceId}
        />
      ) : (
        <ExternalUploadForm
          updateStore={updateStore}
          setCurrentTab={setCurrentTab}
        />
      )}

      <SubmitFotter>
        <Flex justifyContent={'space-between'} gap="10px">
          <Button
            kind="primary-outline"
            onPress={() => setSelectedStep('metadata')}
            title={'Move to Metadata'}
            icon={<ChevronLeft />}
            iconSide={'left'}
          >
            Metadata
          </Button>
          <Flex gap={'10px'}>
            <Link
              target="_blank"
              href={`/datasets/${datasetStore.slug}`}
              passHref
              underline="none"
            >
              <Button kind="primary-outline" title={'Preview Dataset'}>
                Preview Dataset
              </Button>
            </Link>
            <Button
              onPress={() => movetoDataaccessmodel()}
              title={'Move to Dataset Access Model'}
            >
              Move to Dataset Access Model
            </Button>
          </Flex>
        </Flex>
      </SubmitFotter>
    </>
  );
};

export default ExternalUpload;

const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  border-bottom: 2px solid var(--color-gray-01);
`;
const NextButton = styled.div`
  margin-left: auto;
`;
const AddDistribution = styled.div`
  padding: 24px;
  button {
    margin: auto;
    border: 2px solid var(--color-tertiary-1-00);
    color: var(--color-tertiary-1-00);
    background-color: var(--color-background-lightest);
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
