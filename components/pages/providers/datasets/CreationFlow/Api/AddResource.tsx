import React, { useEffect } from 'react';
import styled from 'styled-components';
import { Button } from 'components/actions';
import { useMutation } from '@apollo/client';
import { ResourceListing } from './ResourceListing';
import { toast } from 'react-toastify';
import { mutation, UPDATE_PATCH_OF_DATASET } from 'services';
import { useDispatch, useSelector } from 'react-redux';
import { updateDatasetElements } from 'slices/addDatasetSlice';
import { Flex } from 'components/layouts/FlexWrapper';
import { RootState } from 'Store';
import { Heading } from 'components/layouts';
import { Link } from 'components/layouts/Link';
import { ChevronLeft } from '@opub-icons/workflow';
import IconNext from 'components/icons/IconNext';
import { ComponentWrapper, SubmitFotter } from '../../Metadata/Metadata';
import AddResourceForm from './AddResourceForm';
import useEffectOnChange from 'utils/hooks';
import { LinkButton } from 'components/pages/dashboard/helpers';

const AddResource = ({
  currentStep,
  handleStep,
  updateStore,
  setSelectedStep,
}) => {
  const [resId, setResId] = React.useState(null);
  const datasetStore = useSelector((state: RootState) => state.addDataset);

  //   TODO: change API Resource fetch query to use already fetched

  const [patchDatasetFunnelReq, patchDatasetFunnelRes] = useMutation(
    UPDATE_PATCH_OF_DATASET
  );
  const dispatch = useDispatch();

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

  const [currentTab, setCurrentTab] = React.useState<
    'create' | 'list' | 'edit'
  >('list');

  useEffect(() => {
    if (currentTab === 'list') {
      updateStore();
    }
  }, [currentTab]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 20, behavior: 'smooth' });
    }
  }, [currentTab, currentStep]);
  useEffectOnChange(() => {
    if (currentTab === 'list') setResId(null);
  }, [currentTab]);

  useEffectOnChange(() => {
    if (resId) setCurrentTab('edit');
  }, [resId]);

  return (
    <>
      <ComponentWrapper>
        {currentTab == 'list' ? (
          <>
            <HeaderWrapper>
              <Heading as="h2" variant="h3" marginY={'auto'}>
                Distribution
              </Heading>
              <NextButton>
                <button
                  onClick={() => handleStep(currentStep + 1)}
                  title={'Move to Schema'}
                >
                  <IconNext />
                </button>
              </NextButton>
            </HeaderWrapper>
            <AddDistribution title="Add Distribution">
              <LinkButton
                label="Add Distribution"
                type="create"
                onClick={() => setCurrentTab('create')}
              />
            </AddDistribution>
            {datasetStore.resource_set.length > 0 && (
              <>
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
                <ResourceListing
                  handleCallback={(e) => {
                    setResId(e);
                  }}
                  updateStore={updateStore}
                />
              </>
            )}
          </>
        ) : currentTab === 'edit' ? (
          <AddResourceForm
            setCurrentTab={setCurrentTab}
            setResId={setResId}
            resId={resId}
            updateStore={updateStore}
          />
        ) : (
          <AddResourceForm
            setCurrentTab={setCurrentTab}
            updateStore={updateStore}
          />
        )}
      </ComponentWrapper>
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
              kind="primary"
              onPress={() => movetoDataaccessmodel()}
              title={'Move to Data Acess Model'}
            >
              Move to Data Access Model
            </Button>
          </Flex>
        </Flex>
      </SubmitFotter>
    </>
  );
};

export default AddResource;

const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  border-bottom: 2px solid var(--color-gray-01);
`;
const NextButton = styled.div`
  margin-left: auto;
`;
export const URLWrapper = styled.div`
  label {
    display: block;
  }
  div {
    display: flex;
    box-shadow: 0 0 2px black;
    border-radius: 5px;
    span {
      background-color: var(--color-background-light);
      border: none;
      box-shadow: 0;
      padding-top: 4px;
      line-height: 2;
      height: 44px;
      border-bottom-left-radius: 5px;
      padding-inline-start: 10px;
      border-top-left-radius: 5px;
      font-weight: bold;
      padding-inline-end: 5px;
      width: 250px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  input {
    background-color: var(--color-background-light);
    border: none;
    box-shadow: 0;
    line-height: 2;
    height: 44px;
    padding-inline-end: 10px;
    padding-bottom: 10px;
    font-weight: 400;
    width: 100%;
  }
  input:focus {
    outline: none;
    background-color: var(--color-background-light);
  }
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
