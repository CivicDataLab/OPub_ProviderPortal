import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from 'components/actions/Accordian/Accordian';
import { Delete, Minus, Plus } from 'components/icons';
import React, { useState } from 'react';
import styled from 'styled-components';
import PipelineStatusForm from './PipelineStatusForm';
import { Heading, Text } from 'components/layouts';
import { Button } from 'components/actions';
import { Edit, Refresh } from '@opub-icons/workflow';
import { Flex } from 'components/layouts/FlexWrapper';
import { deleteAPItransformation } from 'utils/fetch';
import { toast } from 'react-toastify';
import { useSession } from 'next-auth/react';
import { useProviderStore } from 'services/store';

const PipelineStatus = ({
  resourceData,
  datasetStore,
  updateStore,
  setCurrentTab,
  setPipelineId,
  isLoading,
  handleResourceRefresh,
}) => {
  const [currentAccordion, setCurrentAccordion] = useState();

  // const [resourceData, setResourceData] = useState([]);

  const { data: session } = useSession();
  const currentOrgRole = useProviderStore((e) => e.org);

  function addClass(status) {
    if (status.includes('Failed')) return 'failed';
    else return status.toLowerCase().replace(/ /g, '');
  }

  // Method to show modal on click of delete
  // const PipelineDelete = (pipelineID) => {
  //   const [isModalOpen, setIsModalOpen] = useState(false);

  //   const modalHandler = () => {
  //     setIsModalOpen(!isModalOpen);
  //   };

  //   return (
  //     <>
  //       <Button
  //         kind={'custom'}
  //         title={'Delete the transformation'}
  //         icon={<Delete />}
  //         iconOnly
  //         onPress={() => {}}
  //       />

  //       <Modal
  //         isOpen={isModalOpen}
  //         modalHandler={() => modalHandler()}
  //         label="Confirmation Modal"
  //       >
  //         <ModalContainer>
  //           <Flex justifyContent={'space-between'} alignItems={'center'}>
  //             <Text as={'h2'}>Confirmation</Text>
  //             <Button
  //               kind="custom"
  //               icon={<Close />}
  //               onPress={() => modalHandler()}
  //             />
  //           </Flex>

  //           <p>Are you sure you want to perform this action ?</p>
  //           <Flex
  //             flexDirection={'row'}
  //             justifyContent={'flex-end'}
  //             gap={'10px'}
  //           >
  //             <Button
  //               onPress={() => {
  //                 modalHandler();
  //               }}
  //               kind="primary-outline"
  //               className="downloadButton"
  //             >
  //               Cancel
  //             </Button>
  //             <Button
  //               onPress={() => {
  //                 deleteAPItransformation(pipelineID)
  //                   .then((res) => {
  //                     if (res.result.Success === true) {
  //                       toast.success('Deleted transformation successfully');
  //                       handleResourceRefresh();
  //                       modalHandler();
  //                     }
  //                   })
  //                   .catch((err) => {
  //                     modalHandler();
  //                     toast.error('Error in deleting transformation. ' + err);
  //                   });
  //               }}
  //               kind="primary"
  //             >
  //               Submit
  //             </Button>
  //           </Flex>
  //         </ModalContainer>
  //       </Modal>
  //     </>
  //   );
  // };

  return (
    resourceData.length > 0 && (
      <>
        <Line />
        <Status isActive={isLoading}>
          <Flex justifyContent={'space-between'} marginTop={'20px'}>
            <Heading
              as="h2"
              variant={'h4'}
              marginTop={'20px'}
              marginBottom={'8px'}
              color={'var(--color-dodger-blue-06)'}
            >
              {resourceData.length > 1
                ? `${resourceData.length} Transformations Added`
                : `${resourceData.length}  Transformation Added`}
            </Heading>
            <Button
              onPress={() => handleResourceRefresh()}
              kind="custom"
              title="Refresh to See the status"
              icon={<Refresh />}
              className="refresh"
            />
          </Flex>
          {resourceData?.length > 0 ? (
            <Accordion
              type="single"
              collapsible
              onValueChange={(e: any) => setCurrentAccordion(e)}
            >
              {resourceData.map((item) => (
                <StyledTabItem key={item.pipeline_id} value={item.pipeline_id}>
                  <StyledTabTrigger>
                    <div>
                      <Text variant="pt16b">{item.pipeline_name}</Text>
                    </div>
                    <div>
                      {' '}
                      <p className={`pipeline__${addClass(item?.status)}`}>
                        {item?.status}
                      </p>
                      {datasetStore.dataset_type == 'FILE' && (
                        <Button
                          kind="custom"
                          size={'sm'}
                          title={
                            datasetStore.resource_set
                              .map((res) => res.id)
                              .includes(item.resultant_res_id)
                              ? 'Edit'
                              : 'Distribution does not exist'
                          }
                          onPress={() => {
                            datasetStore.resource_set
                              .map((res) => res.id)
                              .includes(item.resultant_res_id)
                              ? (setCurrentTab('Edit'),
                                setPipelineId(item.pipeline_id))
                              : '';
                          }}
                          icon={
                            datasetStore.resource_set
                              .map((res) => res.id)
                              .includes(item.resultant_res_id) ? (
                              <Edit />
                            ) : (
                              <Edit color="var(--text-disabled  )" />
                            )
                          }
                        />
                      )}
                      {datasetStore.dataset_type == 'API' && (
                        <Button
                          kind={'custom'}
                          title={'Delete the transformation'}
                          icon={<Delete />}
                          iconOnly
                          onPress={() => {
                            deleteAPItransformation(
                              item.pipeline_id,
                              session,
                              currentOrgRole?.org_id
                            )
                              .then((res) => {
                                if (res.Success === true) {
                                  toast.success(
                                    'Deleted transformation successfully'
                                  );
                                  handleResourceRefresh();
                                }
                              })
                              .catch((err) => {
                                toast.error(
                                  'Error in deleting transformation. Please try again later.',
                                  err
                                );
                              });
                          }}
                        />
                      )}
                      {currentAccordion === item.pipeline_id ? (
                        <Minus fill="var(--color-primary)" />
                      ) : (
                        <Plus fill="var(--color-primary)" />
                      )}
                    </div>
                  </StyledTabTrigger>

                  <StyledTabContent>
                    <PipelineStatusForm
                      resourceData={item}
                      updateStore={updateStore}
                    />
                  </StyledTabContent>
                </StyledTabItem>
              ))}
            </Accordion>
          ) : (
            <Text marginBottom={'10px'}>No transformations added yet.</Text>
          )}
        </Status>
      </>
    )
  );
};

export default PipelineStatus;
const Status = styled.div<any>`
  .refresh {
    transition: ${(props) => (props.isActive ? 'transform 0.5s' : '0s')};
    padding-right: 0;
    margin-right: 20px;
    svg {
      margin-inline-start: 0em;
    }
    animation: ${(props) =>
      props.isActive ? 'rotation 1s infinite linear' : ''};
    transform: ${(props) =>
      props.isActive ? 'rotate(0deg)' : 'rotate(360deg)'};
  }
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
const Line = styled.div`
  border: 1px solid var(--color-gray-01);
  margin-inline: 20px;
`;
const StyledTabContent = styled(AccordionContent)`
  padding: 16px;
  background-color: var(--color-background-lightest);
  border: 1px solid var(--color-gray-03);
`;
