import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import { fetchresourcedata } from 'utils/fetch';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'Store';
import { ChevronLeft } from '@opub-icons/workflow';
import PipelineStatus from './PipelineStatus';
import TransformDataForm from './TransformDataForm';
import { Button } from 'components/actions';
import { useMutation } from '@apollo/client';
import { mutation, UPDATE_PATCH_OF_DATASET } from 'services';
import { updateDatasetElements } from 'slices/addDatasetSlice';
import { toast } from 'react-toastify';
import { Heading } from 'components/layouts';
import { Link } from 'components/layouts/Link';
import { Flex } from 'components/layouts/FlexWrapper';
import { LinkButton } from 'components/pages/dashboard/helpers';
import Transformations from './Transformations';
import { ComponentWrapper, SubmitFotter } from '../Metadata/Metadata';
import IconNext from 'components/icons/IconNext';
import { InstructionWrapper } from '../../CreationFlow';
import { useSession } from 'next-auth/react';
import { useProviderStore } from 'services/store';

const TransformData = ({
  transformerslist,
  apitransformerslist,
  currentStep,
  handleStep,
  setSelectedStep,
  updateStore,
}) => {
  const datasetStore = useSelector((state: RootState) => state.addDataset);

  const [resourceData, setResourceData] = useState([]);

  const router = useRouter();

  const datasetFileID = router.query.datasetId;
  const [isLoading, setIsLoading] = useState(Boolean);

  useEffect(() => {
    handleResourceRefresh();
  }, []);
  const { data: session } = useSession();
  const currentOrgRole = useProviderStore((e) => e.org);

  const handleResourceRefresh = () => {
    setIsLoading(true);

    fetchresourcedata(datasetFileID, session, currentOrgRole?.org_id)
      .then((res) => {
        setIsLoading(false);
        setResourceData(res.result);
      })
      .catch(() => {
        setIsLoading(false);
        toast.error('Error while updating Data');
      });
  };

  const dispatch = useDispatch();

  const [patchDatasetFunnelReq, patchDatasetFunnelRes] = useMutation(
    UPDATE_PATCH_OF_DATASET
  );

  useEffect(() => {
    updateStore();
  }, []);

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
    handleStep(0);
    setSelectedStep('data-access-model');
  };

  const [pipelineId, setPipelineId] = useState();

  const [currentTab, setCurrentTab] = React.useState<
    'create' | 'list' | 'edit'
  >('list');
  const [selectedResource, setselectedResource] = useState('');

  return (
    <>
      <ComponentWrapper>
        <>
          <div>
            {datasetStore.resource_set.length == 0 ? (
              <>
                <div>
                  <HeaderWrapper>
                    <Heading as="h2" variant="h3" marginY={'auto'}>
                      Transformation (Optional)
                    </Heading>
                    <NextButton>
                      <button
                        onClick={() => handleStep(currentStep - 1)}
                        title={'Move to Schema'}
                      >
                        <IconNext />
                      </button>
                      <Button
                        kind="secondary-outline"
                        size="sm"
                        onPress={() => movetoDataaccessmodel()}
                        title={'Move to Dataset Access Model'}
                        icon={<ChevronLeft />}
                        iconSide={'right'}
                      >
                        Skip
                      </Button>
                    </NextButton>
                  </HeaderWrapper>
                </div>
                <InstructionWrapper>
                  <Heading variant="h5" as={'h2'}>
                    Instruction
                  </Heading>
                  <div>
                    <ul>
                      <li>Add schema to add transformation</li>
                    </ul>
                  </div>
                </InstructionWrapper>
              </>
            ) : (
              <>
                {currentTab == 'list' ? (
                  <>
                    <div>
                      <HeaderWrapper>
                        <Heading as="h2" variant="h3" marginY={'auto'}>
                          Transformation (Optional)
                        </Heading>
                        <NextButton>
                          <button
                            onClick={() => handleStep(currentStep - 1)}
                            title={'Move to Schema'}
                          >
                            <IconNext />
                          </button>
                          <Button
                            kind="secondary-outline"
                            size="sm"
                            onPress={() => movetoDataaccessmodel()}
                            title={'Move to Dataset Access Model'}
                            icon={<ChevronLeft />}
                            iconSide={'right'}
                          >
                            Skip
                          </Button>
                        </NextButton>
                      </HeaderWrapper>
                    </div>
                    {datasetStore.resource_set.find(
                      (dataStoreItem) => dataStoreItem.schema?.length !== 0
                    ) ? (
                      <AddTransform title="Add New Transformation">
                        <LinkButton
                          kind="primary"
                          label="Add New Transformation"
                          type="create"
                          onClick={() => setCurrentTab('create')}
                        />
                      </AddTransform>
                    ) : (
                      <InstructionWrapper>
                        <Heading variant="h5" as={'h2'}>
                          Instruction
                        </Heading>
                        <div>
                          <ul>
                            <li>
                              Please save schema to create transformations
                            </li>
                          </ul>
                        </div>
                      </InstructionWrapper>
                    )}
                    <PipelineStatus
                      resourceData={resourceData}
                      datasetStore={datasetStore}
                      isLoading={isLoading}
                      handleResourceRefresh={handleResourceRefresh}
                      setCurrentTab={setCurrentTab}
                      setPipelineId={setPipelineId}
                      updateStore={updateStore}
                    />
                  </>
                ) : currentTab === 'create' ? (
                  <TransformDataForm
                    handleResourceRefresh={handleResourceRefresh}
                    apitransformerslist={apitransformerslist}
                    setCurrentTab={setCurrentTab}
                    setPipelineId={setPipelineId}
                    selectedResource={selectedResource}
                    setselectedResource={setselectedResource}
                    updateStore={updateStore}
                  />
                ) : (
                  <Transformations
                    handleResourceRefresh={handleResourceRefresh}
                    resourceData={resourceData}
                    isLoading={isLoading}
                    transformerslist={transformerslist}
                    pipelineId={pipelineId}
                    setCurrentTab={setCurrentTab}
                    selectedResource={selectedResource}
                    updateStore={updateStore}
                  />
                )}
              </>
            )}
          </div>
        </>
      </ComponentWrapper>
      <SubmitFotter>
        <Flex justifyContent={'space-between'}>
          <Button
            kind="primary-outline"
            onPress={() => {
              handleStep(0);
              setSelectedStep('metadata');
            }}
            title={'Move to Metadata'}
            icon={<ChevronLeft />}
            iconSide={'left'}
          >
            Metadata
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
              kind="primary"
              className="wrapper__button"
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

export default TransformData;

const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  border-bottom: 2px solid var(--color-gray-01);
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
const Line = styled.div`
  border: 1px solid var(--color-gray-01);
  margin-inline: 20px;
`;

const AddTransform = styled.div`
  padding: 24px;
  button {
    margin: auto;
    border: 2px solid var(--color-tertiary-1-00);
    color: var(--color-tertiary-1-00);
    background-color: var(--color-background-lightest);
  }
`;
