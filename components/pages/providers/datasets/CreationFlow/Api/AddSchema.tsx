import React, { useEffect, useState } from 'react';
import { useMutation } from '@apollo/client';
import { Minus, Plus } from 'components/icons';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from 'components/actions/Accordian/Accordian';
import styled from 'styled-components';
import { Button } from 'components/actions';
import { Text } from 'components/layouts';
import { Heading } from 'components/layouts';

import { UPDATE_PATCH_OF_DATASET } from 'services/schema';
import { mutation } from 'services';
import { toast } from 'react-toastify';
import JSONSchema from '../JSONSchema';
import CSVSchema from '../CSVSchema';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'Store';
import { Link } from 'components/layouts/Link';
import { updateDatasetElements } from 'slices/addDatasetSlice';
import { ComponentWrapper, SubmitFotter } from '../../Metadata/Metadata';
import IconNext from 'components/icons/IconNext';
import { ChevronLeft } from '@opub-icons/workflow';
import { FooterButtons } from '../UploadSchema';
import { useConstants } from 'services/store';
import { Loader } from 'components/common';
import {
  InstructionsWrapper,
  InstructionWrapper,
} from 'components/pages/providers/CreationFlow';

interface schemaInput {
  type: string;
  name: string;
  id: number;
  value: string;
  placeholder: string;
  jsonOptions: { data: arrayType };
  arrayOptions: { data: arrayType };
}

type arrayType = schemaInput[];

const AddSchema = ({
  currentStep,
  handleStep,
  updateStore,
  setSelectedStep,
}) => {
  useEffect(() => {
    updateStore();
  }, []);
  const [currentAccordion, setCurrentAccordion] = useState();
  const formatIcons = useConstants((e) => e.formatIcons);
  const datasetStore = useSelector((state: RootState) => state.addDataset);
  const dispatch = useDispatch();

  const [patchDatasetFunnelReq, patchDatasetFunnelRes] = useMutation(
    UPDATE_PATCH_OF_DATASET
  );

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

  const movetoMetadata = () => {
    handleStep(0);
    setSelectedStep('metadata');
  };
  const [previewSchema, setPreviewSchema] = useState(false);

  const handleRestore = () => {
    setPreviewSchema(true);
    updateStore();
    setPreviewSchema(false);
  };
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 20, behavior: 'smooth' });
    }
  }, [currentAccordion]);
  return (
    <>
      <ComponentWrapper>
        <HeaderWrapper>
          <Heading as="h2" variant="h3" marginY={'auto'}>
            Schema (Optional)
          </Heading>
          <NextButton>
            <button
              onClick={() => handleStep(currentStep - 1)}
              title={'Move to Add Distribution'}
            >
              <IconNext />
            </button>
            <Button
              kind="secondary-outline"
              size="sm"
              onPress={() => handleStep(currentStep + 1)}
              title={'Move to Dataset Access Model'}
              icon={<ChevronLeft />}
              iconSide={'right'}
            >
              Skip
            </Button>
          </NextButton>
        </HeaderWrapper>
        {datasetStore.resource_set.length == 0 ? (
          <InstructionWrapper>
            <Heading variant="h5" as={'h2'}>
              Instruction
            </Heading>
            <div>
              <ul>
                <li>Add distribution to add schema</li>
              </ul>
            </div>
          </InstructionWrapper>
        ) : (
          <>
            <InstructionsWrapper>
              <Heading variant="h5" as={'h2'}>
                Instructions
              </Heading>
              <div>
                <ul>
                  <li>
                    Saving the schema is necessary to enable transformation and
                    field-based access models.
                  </li>
                  <li>
                    Edit and/or verify the values of Display Name, Description
                    and Format of each column of the distribution before saving
                    the schema.
                  </li>
                  <li>
                    Saving the schema is non-reversible. If you have saved
                    incorrect schema details for a distribution, kindly delete
                    and reupload the distribution file to add the correct schema
                    details.
                  </li>
                  <li>
                    If you have made incorrect changes to the schema details but
                    have not saved them, click on Restore to revert back the
                    schema details to the last saved version.
                  </li>
                  <li>
                    Deleting a parent node will delete all of its children nodes
                    (if any).
                  </li>
                </ul>
              </div>
            </InstructionsWrapper>

            {datasetStore.resource_set?.map((resource: any, index) => {
              const [formChanged, setFormChanged] = useState(false);

              return (
                <>
                  <Accordion
                    type="single"
                    collapsible
                    key={index}
                    value={currentAccordion}
                    onValueChange={(e: any) => setCurrentAccordion(e)}
                  >
                    <StyledTabItem value={resource.id}>
                      <StyledTabTrigger>
                        <div>
                          {formatIcons[resource?.api_details?.response_type]}
                          <Text variant="pt16b"> {resource.title}</Text>
                        </div>
                        <div>
                          {resource?.schema?.length === 0 || formChanged ? (
                            <Text
                              variant="pt16"
                              fontWeight={'500'}
                              color={'var(--color-warning)'}
                            >
                              Unsaved
                            </Text>
                          ) : (
                            <Text
                              fontWeight={'500'}
                              color={'var(--color-success)'}
                              variant="pt16"
                            >
                              Saved
                            </Text>
                          )}
                          <Button
                            onPress={() => {
                              handleRestore();
                              setFormChanged(false);
                            }}
                            title="Restore the previous saved Schema"
                            kind="custom"
                          >
                            Restore
                          </Button>
                          {currentAccordion === resource.id ? (
                            <Minus fill="var(--color-primary)" />
                          ) : (
                            <Plus fill="var(--color-primary)" />
                          )}
                        </div>
                      </StyledTabTrigger>

                      <StyledTabContent>
                        {previewSchema === true ? (
                          <Loader />
                        ) : resource?.api_details?.response_type === 'CSV' ? (
                          <>
                            <CSVSchema
                              item={resource}
                              updateStore={updateStore}
                              setFormChanged={setFormChanged}
                            />
                          </>
                        ) : (
                          //ADD JSONSchema component for json resources
                          <JSONSchema
                            resource={resource}
                            updateStore={updateStore}
                            setFormChanged={setFormChanged}
                          />
                        )}
                      </StyledTabContent>
                    </StyledTabItem>
                  </Accordion>
                </>
              );
            })}
          </>
        )}{' '}
      </ComponentWrapper>
      <SubmitFotter>
        <FooterButtons>
          <Button
            kind="primary-outline"
            onPress={() => movetoMetadata()}
            title={'Move to Metadata'}
            icon={<ChevronLeft />}
            iconSide={'left'}
          >
            Metadata
          </Button>
          <div>
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
              title={'Move to Dataset Access Model'}
            >
              Move to Dataset Access Model
            </Button>
          </div>
        </FooterButtons>
      </SubmitFotter>
    </>
  );
};

export default AddSchema;

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
export const FlexBtnWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;
const StyledTabItem = styled(AccordionItem)`
  background-color: var(--color-tertiary-1-06);
  margin-top: 16px;
`;

const StyledTabTrigger = styled(AccordionTrigger)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  width: 100%;
  padding: 16px;
  background-color: var(--color-tertiary-1-06);
  border: 1px solid var(--color-gray-03);
  :hover {
    background-color: var(--color-background-lightest);
  }
  font-weight: 600;
  font-size: 18px;

  > div {
    display: flex;
    align-items: center;
    gap: 8px;
  }
`;

const StyledTabContent = styled(AccordionContent)`
  padding: 16px;
  background-color: var(--color-background-lightest);
  border: 1px solid var(--color-gray-03);
`;
