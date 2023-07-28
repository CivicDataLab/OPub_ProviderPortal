import { useMutation } from '@apollo/client';
import { Button } from 'components/actions';
import { Minus, Plus } from 'components/icons';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { mutation, UPDATE_PATCH_OF_DATASET } from 'services';
import { RootState } from 'Store';
import styled from 'styled-components';
import { Text } from 'components/layouts';
import { Flex } from 'components/layouts/FlexWrapper';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from 'components/actions/Accordian/Accordian';
import CSVSchema from './CSVSchema';
import JSONSchema from './JSONSchema';
import { Heading } from 'components/layouts';
import { Link } from 'components/layouts/Link';
import { ComponentWrapper, SubmitFotter } from '../Metadata/Metadata';
import { ChevronLeft } from '@opub-icons/workflow';
import IconNext from 'components/icons/IconNext';
import { useConstants } from 'services/store';
import { updateDatasetElements } from 'slices/addDatasetSlice';
import { toast } from 'react-toastify';
import { Loader } from 'components/common';
import { InstructionsWrapper, InstructionWrapper } from '../../CreationFlow';

const UploadSchema = ({
  currentStep,
  handleStep,
  updateStore,
  setSelectedStep,
}) => {
  const [currentAccordion, setCurrentAccordion] = useState();
  const formatIcons = useConstants((e) => e.formatIcons);

  const datasetStore = useSelector((state: RootState) => state.addDataset);
  useEffect(() => {
    updateStore();
  }, []);

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

  const [previewSchema, setPreviewSchema] = useState(false);

  const handleRestore = () => {
    setPreviewSchema(true);
    updateStore();
    // setFormChanged(true);
    setPreviewSchema(false);
  };
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 20, behavior: 'smooth' });
      // const element = document.getElementById('content');
      // element?.scrollIntoView();
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
              title={'Move to Transformation'}
              icon={<ChevronLeft />}
              iconSide={'right'}
            >
              Skip
            </Button>
          </NextButton>
        </HeaderWrapper>
        {datasetStore.resource_set.length == 0 ? (
          <InstructionWrapper>
            <Heading variant="h5">Instruction</Heading>
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

            {datasetStore.resource_set?.map((item: any, index) => {
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
                    <StyledTabItem value={item.id}>
                      <StyledTabTrigger>
                        <div>
                          {formatIcons[item?.file_details?.format]}
                          <Text variant="pt16b"> {item.title}</Text>
                        </div>

                        <div>
                          {item?.schema?.length === 0 || formChanged ? (
                            <Text
                              variant="pt16"
                              fontWeight={'500'}
                              color={'var(--color-warning)'}
                            >
                              Unsaved
                            </Text>
                          ) : (
                            <Text
                              variant="pt16"
                              fontWeight={'500'}
                              color={'var(--color-success)'}
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
                          {currentAccordion === item.id ? (
                            <Minus fill="var(--color-primary)" />
                          ) : (
                            <Plus fill="var(--color-primary)" />
                          )}
                        </div>
                      </StyledTabTrigger>

                      <StyledTabContent>
                        {previewSchema === true ? (
                          <Loader />
                        ) : item.file_details?.format.toLowerCase() ===
                            'json' ||
                          item.file_details?.format.toLowerCase() === 'xml' ? (
                          <JSONSchema
                            resource={item}
                            updateStore={updateStore}
                            setFormChanged={setFormChanged}
                          />
                        ) : (
                          <CSVSchema
                            item={item}
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
        )}
      </ComponentWrapper>
      <SubmitFotter>
        <Flex justifyContent={'space-between'} gap="10px">
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
              onPress={() => {
                movetoDataaccessmodel();
              }}
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

export default UploadSchema;

const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  border-bottom: 2px solid var(--color-gray-01);
`;

export const FooterButtons = styled.section`
  display: flex;
  justify-content: space-between;
  margin-top: 10px;

  > div {
    display: flex;
    gap: 10px;
  }
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
const StyledTabItem = styled(AccordionItem)`
  background-color: var(--color-tertiary-1-06);
  margin-top: 16px;
`;

const StyledTabTrigger = styled(AccordionTrigger)`
  display: flex;
  gap: 10px;
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

    span {
      text-align: left;
    }
  }
`;

const StyledTabContent = styled(AccordionContent)`
  padding: 16px;
  background-color: var(--color-background-lightest);
  border: 1px solid var(--color-gray-03);
`;
