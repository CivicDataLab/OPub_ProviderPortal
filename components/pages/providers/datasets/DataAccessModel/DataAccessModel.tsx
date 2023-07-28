import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { AccessModelForm } from './AccessModelForm';
import { AccessModelsListing } from './AccessModelsListing';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'Store';
import { Button } from 'components/actions';
import useEffectOnChange from 'utils/hooks';
import { Flex } from 'components/layouts/FlexWrapper';
import { Link } from 'components/layouts/Link';
import { Heading } from 'components/layouts';
import { mutation, UPDATE_PATCH_OF_DATASET } from 'services';
import { updateDatasetElements } from 'slices/addDatasetSlice';
import { useMutation } from '@apollo/client';
import { toast } from 'react-toastify';
import { ComponentWrapper, SubmitFotter } from '../Metadata/Metadata';
import { ChevronLeft } from '@opub-icons/workflow';
import { InstructionWrapper } from '../../CreationFlow';

const DataAccessModel = ({ setSelectedStep, updateStore, handleStep }) => {
  useEffect(() => {
    updateStore();
  }, []);
  const router = useRouter();

  const [currentTab, setCurrentTab] = React.useState<
    'create' | 'list' | 'edit'
  >('list');
  const [editId, setEditId] = React.useState();

  const datasetStore = useSelector((state: RootState) => state.addDataset);

  const [patchDatasetFunnelReq, patchDatasetFunnelRes] = useMutation(
    UPDATE_PATCH_OF_DATASET
  );
  const dispatch = useDispatch();
  const movetoAdditionalinfo = () => {
    datasetStore.funnel === 'Data Access Model' &&
    datasetStore.resource_set.length > 0
      ? mutation(patchDatasetFunnelReq, patchDatasetFunnelRes, {
          dataset_data: {
            funnel: 'Additional Info',
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
                value: 'Additional Info',
              })
            );
          })
          .catch(() => {
            toast.error('Funnel Patch Failed');
          })
      : null;
    handleStep(0);
    setSelectedStep('additional-info');
  };

  useEffectOnChange(() => {
    if (currentTab === 'list') setEditId(null);
  }, [currentTab]);

  useEffectOnChange(() => {
    if (editId) setCurrentTab('edit');
  }, [editId]);

  function handleManage(id) {
    setEditId(id);
  }
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 20, behavior: 'smooth' });
    }
  }, [currentTab, setSelectedStep]);
  return (
    <Wrapper>
      <ComponentWrapper>
        {datasetStore.resource_set.length == 0 ? (
          <>
            <HeaderWrapper>
              <Heading
                as="h2"
                variant="h3"
                marginY={'auto'}
                paddingBottom={'17px'}
              >
                Dataset Access Model
              </Heading>
            </HeaderWrapper>
            <InstructionWrapper>
              <Heading variant="h5" as={'h2'}>
                Instruction
              </Heading>
              <div>
                <ul>
                  <li>Add distribution to add dataset access model</li>
                </ul>
              </div>
            </InstructionWrapper>
          </>
        ) : (
          <>
            {currentTab == 'list' ? (
              <>
                <AccessModelsListing
                  router={router}
                  handleManage={handleManage}
                  setCurrentTab={setCurrentTab}
                />
              </>
            ) : currentTab === 'edit' ? (
              <AccessModelForm
                datasetId={router.query.datasetId}
                datasetData={datasetStore}
                setCurrentTab={setCurrentTab}
                editId={editId}
              />
            ) : (
              <AccessModelForm
                datasetId={router.query.datasetId}
                datasetData={datasetStore}
                setCurrentTab={setCurrentTab}
              />
            )}
          </>
        )}
      </ComponentWrapper>
      <SubmitFotter>
        <Flex justifyContent={'space-between'} gap="10px">
          <Button
            kind="primary-outline"
            onPress={() => setSelectedStep('distributions')}
            title={'Move to Distributions'}
            icon={<ChevronLeft />}
            iconSide={'left'}
          >
            Distributions
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
              onPress={() => movetoAdditionalinfo()}
              title={'Move to Additional Information'}
            >
              Move to Additional Info
            </Button>
          </Flex>
        </Flex>
      </SubmitFotter>
    </Wrapper>
  );
};

export default DataAccessModel;

const Wrapper = styled.div`
  form {
    padding: 0;
    > button {
      margin-top: 16px;
    }
  }
`;
const ListingWrapper = styled.div`
  background-color: var(--color-background-lightest);
  padding: 24px;
`;
const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  border-bottom: 2px solid var(--color-gray-01);
`;
