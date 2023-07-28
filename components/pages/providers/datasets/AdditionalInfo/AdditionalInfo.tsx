import { useMutation } from '@apollo/client';
import { Button } from 'components/actions';
import { Delete } from 'components/icons';
import { Heading } from 'components/layouts';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Text } from 'components/layouts';
import { Flex } from 'components/layouts/FlexWrapper';
import { Link } from 'components/layouts/Link';
import { useEffect, useState } from 'react';
import {
  DELETE_ADDITIONALINFO,
  mutation,
  UPDATE_PATCH_OF_DATASET,
} from 'services';
import { useConstants } from 'services/store';
import { updateDatasetElements } from 'slices/addDatasetSlice';
import { RootState } from 'Store';
import styled from 'styled-components';
import { ComponentWrapper, SubmitFotter } from '../Metadata/Metadata';
import { ChevronLeft, Edit, MoreSmallListVert } from '@opub-icons/workflow';
import React from 'react';
import { LinkButton } from 'components/pages/dashboard/helpers';
import AdditionalInfoForm from './AdditionalInfoForm';
import useEffectOnChange from 'utils/hooks';

const AdditionalInfo = ({ setSelectedStep, updateStore }) => {
  useEffect(() => {
    updateStore();
  }, []);
  const formatIcons = useConstants((e) => e.formatIcons);

  const datasetStore = useSelector((dataset: RootState) => dataset.addDataset);

  const dispatch = useDispatch();

  const [deleteAdditionalInfoReq, deleteAdditionalInfoRes] = useMutation(
    DELETE_ADDITIONALINFO
  );

  const [resourceId, setResourceId] = useState(null);

  const [currentTab, setCurrentTab] = React.useState<
    'create' | 'list' | 'edit'
  >('list');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 20, behavior: 'smooth' });
    }
  }, [currentTab, setSelectedStep]);

  const deleteAdditionalinfo = (resourceItemId) => {
    mutation(deleteAdditionalInfoReq, deleteAdditionalInfoRes, {
      id: resourceItemId,
    })
      .then(() => {
        toast.success('Additional Information deleted successfully');
        updateStore();
      })
      .catch(() => {
        toast.error('Error while deleting Additional Information');
      });
  };
  const [patchDatasetFunnelReq, patchDatasetFunnelRes] = useMutation(
    UPDATE_PATCH_OF_DATASET
  );

  const movetoModeration = () => {
    datasetStore.funnel === 'Additional Info' &&
      mutation(patchDatasetFunnelReq, patchDatasetFunnelRes, {
        dataset_data: {
          funnel: 'Ready to Review',
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
              value: 'Ready to Review',
            })
          );
        })
        .catch(() => {
          toast.error('Funnel Patch Failed');
        });
    setSelectedStep('ready-to-review');
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
                Additional Information (Optional)
              </Heading>
              <NextButton>
                <Button
                  kind="secondary-outline"
                  size="sm"
                  onPress={() => movetoModeration()}
                  title={'Move to Moderation'}
                  icon={<ChevronLeft />}
                  iconSide={'right'}
                >
                  Skip
                </Button>
              </NextButton>
            </HeaderWrapper>

            <AddTransform title="Add Additional Information">
              <LinkButton
                kind="primary"
                label="Add Additional Information"
                type="create"
                onClick={() => setCurrentTab('create')}
              />
            </AddTransform>
            {datasetStore.additionalinfo_set.length > 0 && (
              <DataView>
                <Heading
                  as="h2"
                  variant={'h4'}
                  marginTop={'20px'}
                  marginBottom={'8px'}
                  color={'var(--color-dodger-blue-06)'}
                >
                  {datasetStore.additionalinfo_set.length > 1
                    ? `${datasetStore.additionalinfo_set.length} Additional Informations Added`
                    : `${datasetStore.additionalinfo_set.length}  Additional Information Added`}
                </Heading>
                {datasetStore.additionalinfo_set.map((dataStoreItem, index) => (
                  <>
                    <Flex key={index} justifyContent="space-between">
                      <Flex gap="10px">
                        {formatIcons[dataStoreItem?.format?.toString()]}
                        <div>
                          <Text variant={'pt16b'}>{dataStoreItem.title}</Text>
                        </div>
                      </Flex>
                      <div className="more">
                        <MoreSmallListVert width={24} />
                      </div>
                      <div className="fileActionBtns">
                        <Button
                          kind="custom"
                          icon={<Edit />}
                          title={'Edit the Distribution'}
                          onPress={() => {
                            handleManage(dataStoreItem.id);
                          }}
                        />
                        <Button
                          kind="custom"
                          size="md"
                          icon={<Delete />}
                          onPress={() => {
                            deleteAdditionalinfo(dataStoreItem.id);
                          }}
                        />
                      </div>
                    </Flex>
                  </>
                ))}
              </DataView>
            )}
          </ComponentWrapper>
        </>
      ) : currentTab === 'edit' ? (
        <AdditionalInfoForm
          updateStore={updateStore}
          resourceId={resourceId}
          setResourceId={setResourceId}
          setCurrentTab={setCurrentTab}
        />
      ) : (
        <AdditionalInfoForm
          updateStore={updateStore}
          setCurrentTab={setCurrentTab}
        />
      )}
      <SubmitFotter>
        <Flex justifyContent={'space-between'} gap="10px">
          <Button
            kind="primary-outline"
            onPress={() => setSelectedStep('data-access-model')}
            title={'Move to Dataset Access Model'}
            icon={<ChevronLeft />}
            iconSide={'left'}
          >
            Dataset Access Model
          </Button>
          <Flex gap="10px">
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
              onPress={() => movetoModeration()}
              title={'Move to Moderation'}
            >
              Move to Moderation
            </Button>
          </Flex>
        </Flex>
      </SubmitFotter>
    </>
  );
};

export default AdditionalInfo;

const AddTransform = styled.div`
  padding: 24px;
  button {
    margin: auto;
    border: 2px solid var(--color-tertiary-1-00);
    color: var(--color-tertiary-1-00);
    background-color: var(--color-background-lightest);
  }
`;

const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  border-bottom: 2px solid var(--color-gray-01);
  padding-bottom: 17px;
`;

const NextButton = styled.div`
  margin-left: auto;
  display: flex;
  button {
    margin: auto;
    color: var(--color-secondary-01);
    border-color: var(--color-secondary-01);
  }
  svg {
    transform: rotate(180deg);
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
    /* justify-content: space-between; */
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
