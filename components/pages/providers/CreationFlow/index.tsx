import React, { useEffect, useState } from 'react';
import {
  AdditionalInfo,
  DatasetHeader,
  Metadata,
  Progressbar,
  TransformData,
  AddResource,
  AddSchema,
  DataAccessModel,
  UploadFile,
  UploadSchema,
  Moderation,
  ExternalUpload,
  ExternalDataAccessModel,
} from 'components/pages/providers/datasets';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'Store';
import { useQuery } from '@apollo/client';
import { updateDataset } from 'slices/addDatasetSlice';
import { GET_DATASET } from 'services';
import withAuth from 'utils/withAuth';
import styled from 'styled-components';
import { FilterTags } from 'components/actions';
import { useProviderStore } from 'services/store';

const DraftsUpload = ({
  transformerslist,
  apitransformerslist,
  datasetFileID,
}) => {
  const currentOrgRole = useProviderStore((e) => e.org);

  // Get the file ID generated from the Redux Store
  //   const datasetFileID = router.query.datasetId;

  // Declare dispatch function
  const dispatch = useDispatch();
  const datasetStore = useSelector((state: RootState) => state.addDataset);

  const [currentStep, setCurrentStep] = useState(0);
  const [selectedStep, setSelectedStep] = useState('');
  // Get the data from the server and update the local data store
  const { data, loading, error, refetch } = useQuery(GET_DATASET, {
    variables: {
      dataset_id: datasetFileID,
    },
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 20, behavior: 'smooth' });
    }
  }, [selectedStep, currentStep]);

  // Call the dispatch only once based on change in data from the API
  useEffect(() => {
    if (!loading && !error) {
      dispatch(updateDataset(data?.dataset));
    }
  }, [data]);

  useEffect(() => {
    if (!!datasetStore.funnel) {
      setSelectedStep(
        datasetStore.funnel.replaceAll(/\s+/g, '-').toLowerCase()
      );
    }
  }, [datasetStore.funnel]);

  let providerStatusItems = [
    {
      name: 'Metadata',
      id: 'metadata',
      status: '',
      // image: '/assets/images/lock.png',
      // link: '',
      // tooltip: 'You are in Upload Session',
    },
    {
      name: 'Distributions',
      id: 'distributions',
      status: '',
      // image: '/assets/images/lock.png',
      // link: '',
      // tooltip: 'You are in Upload Session',
    },
    {
      name: 'Dataset Access Model',
      id: 'data-access-model',
      status: '',
      // image: '/assets/images/lock.png',
      // link: '',
      // tooltip: 'You are in Upload Session',
    },
    {
      name: 'Additional Information',
      id: 'additional-info',
      status: '',
      // image: '/assets/images/lock.png',
      // link: '',
      // tooltip: 'You are in Upload Session',
    },
    {
      name: currentOrgRole?.role === 'DP' ? 'Review' : 'Moderation',
      id: 'ready-to-review',
      status: '',
      // image: '/assets/images/lock.png',
      // link: '',
      // tooltip: 'You are in Upload Session',
    },
  ];

  const selectedFunnelIndex = providerStatusItems.findIndex(
    (item) =>
      item.id === datasetStore.funnel.replaceAll(/\s+/g, '-').toLowerCase()
  );
  //Method1
  if (selectedFunnelIndex !== -1 && selectedFunnelIndex != 0) {
    providerStatusItems = providerStatusItems.map((item, index) =>
      index < selectedFunnelIndex ? { ...item, status: 'done' } : item
    );
  }

  //Method2
  // if (selectedFunnelIndex !== -1 && selectedFunnelIndex != 0) {
  //   const updatedStatusItems = providerStatusItems
  //     .slice(0, selectedFunnelIndex)
  //     .map((item, index) =>
  //       index === selectedFunnelIndex ? item : { ...item, status: 'done' }
  //     );
  //   const providerStatusItemsArr = [...providerStatusItems];
  //   providerStatusItems = [
  //     ...updatedStatusItems,
  //     ...providerStatusItemsArr.slice(
  //       selectedFunnelIndex,
  //       providerStatusItems.length
  //     ),
  //   ];
  // }

  const componentList = {
    file: {
      metadata: {
        component: [
          <Metadata
            handleStep={setCurrentStep}
            setSelectedStep={setSelectedStep}
            datasetStore={datasetStore}
            key={0}
          />,
          <></>,
        ],
        componentName: [
          {
            name: 'Metadata',
            helperText: 'Mandatory',
          },
        ],
      },
      distributions: {
        component: [
          <UploadFile
            currentStep={currentStep}
            setSelectedStep={setSelectedStep}
            handleStep={setCurrentStep}
            key={0}
            updateStore={refetch}
          />,
          <UploadSchema
            currentStep={currentStep}
            setSelectedStep={setSelectedStep}
            handleStep={setCurrentStep}
            key={1}
            updateStore={refetch}
          />,
          <TransformData
            key={2}
            transformerslist={transformerslist}
            apitransformerslist={apitransformerslist}
            currentStep={currentStep}
            handleStep={setCurrentStep}
            setSelectedStep={setSelectedStep}
            updateStore={refetch}
          />,
        ],
        componentName: [
          {
            name: 'Distribution',
            helperText: 'Mandatory',
          },
          {
            name: 'Schema',
            helperText: 'Optional',
          },
          {
            name: 'Transformation',
            helperText: 'Optional',
          },
        ],
      },
      'data-access-model': {
        component: [
          <DataAccessModel
            key={0}
            handleStep={setCurrentStep}
            setSelectedStep={setSelectedStep}
            updateStore={refetch}
          />,
          <></>,
        ],
        componentName: [
          {
            name: 'Dataset Access Model',
            helperText: 'Mandatory',
          },
        ],
      },
      'additional-info': {
        component: [
          <AdditionalInfo
            key={0}
            setSelectedStep={setSelectedStep}
            updateStore={refetch}
          />,
          <></>,
        ],
        componentName: [
          {
            name: 'Additional Information',
            helperText: 'Optional',
          },
        ],
      },
      'ready-to-review': {
        component: [
          <Moderation
            key={0}
            updateStore={refetch}
            handleStep={setCurrentStep}
            setSelectedStep={setSelectedStep}
          />,
          <></>,
        ],
        componentName: [
          {
            name: 'Moderation',
            helperText: 'Mandatory',
          },
        ],
      },
    },
    api: {
      metadata: {
        component: [
          <Metadata
            handleStep={setCurrentStep}
            setSelectedStep={setSelectedStep}
            datasetStore={datasetStore}
            key={0}
          />,
          <></>,
        ],
        componentName: [
          {
            name: 'Metadata',
            helperText: 'Mandatory',
          },
        ],
      },
      distributions: {
        component: [
          <AddResource
            key={0}
            currentStep={currentStep}
            setSelectedStep={setSelectedStep}
            handleStep={setCurrentStep}
            updateStore={refetch}
          />,
          <AddSchema
            key={1}
            currentStep={currentStep}
            handleStep={setCurrentStep}
            updateStore={refetch}
            setSelectedStep={setSelectedStep}
          />,
          <TransformData
            key={2}
            transformerslist={transformerslist}
            apitransformerslist={apitransformerslist}
            currentStep={currentStep}
            handleStep={setCurrentStep}
            setSelectedStep={setSelectedStep}
            updateStore={refetch}
          />,
        ],
        componentName: [
          {
            name: 'Distribution',
            helperText: 'ApiMandatory' /* helper text is handling scroll */,
          },
          {
            name: 'Schema',
            helperText: 'Optional',
          },
          {
            name: 'Transformation',
            helperText: 'Optional',
          },
        ],
      },
      'data-access-model': {
        component: [
          <DataAccessModel
            key={0}
            handleStep={setCurrentStep}
            setSelectedStep={setSelectedStep}
            updateStore={refetch}
          />,
          <></>,
        ],
        componentName: [
          {
            name: 'Dataset Access Model',
            helperText: 'Mandatory',
          },
        ],
      },
      'additional-info': {
        component: [
          <AdditionalInfo
            key={0}
            setSelectedStep={setSelectedStep}
            updateStore={refetch}
          />,
          <></>,
        ],
        componentName: [
          {
            name: 'Additional Info',
            helperText: 'Optional',
          },
        ],
      },
      'ready-to-review': {
        component: [
          <Moderation
            key={0}
            updateStore={refetch}
            handleStep={setCurrentStep}
            setSelectedStep={setSelectedStep}
          />,
          <></>,
        ],
        componentName: [
          {
            name: 'Moderation',
            helperText: 'Mandatory',
          },
        ],
      },
    },
    external: {
      metadata: {
        component: [
          <Metadata
            handleStep={setCurrentStep}
            setSelectedStep={setSelectedStep}
            datasetStore={datasetStore}
            key={0}
          />,
          <></>,
        ],
        componentName: [
          {
            name: 'Metadata',
            helperText: 'Mandatory',
          },
        ],
      },
      distributions: {
        component: [
          <ExternalUpload
            setSelectedStep={setSelectedStep}
            key={0}
            updateStore={refetch}
          />,
          <></>,
        ],
        componentName: [
          {
            name: 'Distribution',
            helperText: 'Mandatory',
          },
        ],
      },
      'data-access-model': {
        component: [
          <ExternalDataAccessModel
            key={0}
            handleStep={setCurrentStep}
            setSelectedStep={setSelectedStep}
            updateStore={refetch}
          />,
          <></>,
        ],
        componentName: [
          {
            name: 'Dataset Access Model',
            helperText: 'Mandatory',
          },
        ],
      },
      'additional-info': {
        component: [
          <AdditionalInfo
            key={0}
            setSelectedStep={setSelectedStep}
            updateStore={refetch}
          />,
          <></>,
        ],
        componentName: [
          {
            name: 'Additional Information',
            helperText: 'Optional',
          },
        ],
      },
      'ready-to-review': {
        component: [
          <Moderation
            key={0}
            updateStore={refetch}
            handleStep={setCurrentStep}
            setSelectedStep={setSelectedStep}
          />,
          <></>,
        ],
        componentName: [
          {
            name: 'Moderation',
            helperText: 'Mandatory',
          },
        ],
      },
    },
  };

  return (
    <>
      {!loading && selectedStep !== '' && (
        <>
          <Upload>
            <div>
              <div className="content">
                {/* <Goback /> */}

                <ProviderHeader>
                  <DatasetHeader datasetStore={datasetStore} />
                  <FilterTags
                    data={providerStatusItems}
                    clickedTag={(selected) => {
                      setSelectedStep(selected);
                      setCurrentStep(0);
                    }}
                    defaultSelected={selectedStep}
                  />
                  {/* <DatasetFunnel providerStatusItems={providerStatusItems} /> */}

                  {/* <Aside
                    title={
                      'Placeholder Text for any remarks , indication or prompt message'
                    } 
                  /> */}
                  <Space></Space>
                </ProviderHeader>
                {/* {bar[count]} */}
                {componentList[data?.dataset?.dataset_type?.toLowerCase()] &&
                componentList[data?.dataset?.dataset_type?.toLowerCase()][
                  selectedStep
                ]?.component.length === 1 ? (
                  <>
                    <ComponentWrapper>
                      {componentList.file[selectedStep].component}
                    </ComponentWrapper>
                  </>
                ) : (
                  <Progressbar
                    currentIndex={currentStep}
                    getCurrentIndex={(updatedIndex) =>
                      setCurrentStep(updatedIndex)
                    }
                    progressBarLabels={
                      componentList[
                        data?.dataset?.dataset_type?.toLowerCase()
                      ] &&
                      componentList[data?.dataset?.dataset_type?.toLowerCase()][
                        selectedStep
                      ]?.componentName
                    }
                    components={
                      componentList[data?.dataset?.dataset_type?.toLowerCase()][
                        selectedStep
                      ]?.component
                    }
                  />
                )}
              </div>
            </div>
          </Upload>
        </>
      )}
    </>
  );
};

export default withAuth(DraftsUpload);

const ComponentWrapper = styled.div`
  background-color: var(--color-background-lighter);
  /* border: 3px solid var(--color-background-alt-dark); */
  margin-top: 20px;
  padding: 24px;
`;

const Space = styled.div`
  padding: 15px;
  background-color: var(--color-background-light);
`;
export const NextWrapper = styled.div`
  button {
    margin-left: auto;
  }
`;

const SupportButtonWrapper = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  background-color: var(--text-high-on-dark);
  border-top: 2px solid var(--color-gray-02);
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  padding: 20px;
`;
const ProviderHeader = styled.div`
  background-color: var(--text-high-on-dark);
  position: sticky;
  top: 112px;
  z-index: 110;
  /* border-bottom: 1px solid var(--color-gray-02); */
  @media (max-width: 640px) {
    top: 0px;
  }
`;
const Upload = styled.div`
  .container {
    display: flex;
    gap: 2rem;
  }
  .content {
    width: 100%;
    min-height: 700px;
  }

  // Style for Footer Buttons
  .footerContainer {
    padding: 0.5rem 0;
    button {
      margin-left: auto;
      padding: 10px 20px;
    }
  }
  @media (max-width: 920px) {
    .mainpage {
      flex-wrap: wrap;
    }
  }
`;

export const InstructionsWrapper = styled.div`
  border-bottom: 2px solid var(--color-gray-01);
  padding-block: 16px;
  > div {
    padding-left: 24px;
  }
  ul {
    list-style-type: disc;
  }
  li {
    padding-left: 4px;
    a {
      color: var(--color-link);
    }
  }
`;

export const InstructionWrapper = styled.div`
  padding-block: 16px;
  > div {
    padding-left: 24px;
  }
  ul {
    list-style-type: disc;
  }
  li {
    padding-left: 4px;
    a {
      color: var(--color-link);
    }
  }
`;
