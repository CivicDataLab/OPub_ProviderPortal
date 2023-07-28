import { useMutation } from '@apollo/client';
import { CrossSize300 } from '@opub-icons/ui';
import { Delete } from '@opub-icons/workflow';
import { Button, Modal } from 'components/actions';
import { Heading, Text } from 'components/layouts';
import { Flex } from 'components/layouts/FlexWrapper';

import { useState } from 'react';
import { toast } from 'react-toastify';
import { DELETE_DAM_RESOURCE, mutation } from 'services';
import styled from 'styled-components';

export const AccessModelDelete = ({ editId, setCurrentTab, datasetId }) => {
  const [accessModelDelete, accessModelDeleteRes] =
    useMutation(DELETE_DAM_RESOURCE);
  const [isModalOpen, setIsModalOpen] = useState(false);

  function handleDelete() {
    mutation(accessModelDelete, accessModelDeleteRes, {
      access_model_resource_data: { dam_id: editId, dataset_id: datasetId },
    })
      .then(() => {
        toast.success('Successfully Deleted');
        setCurrentTab('list');
      })
      .catch(() => toast.error('Error while Deleting Dataset Access Model'));
  }
  return (
    <>
      <Button
        kind="secondary-outline"
        size="md"
        title="Delete the Distribution"
        // icon={<Delete color={'var(--color-secondary-01'} />}
        onPress={(e: any) => {
          setIsModalOpen(!isModalOpen);
        }}
      >
        Delete
      </Button>
      <Modal
        isOpen={isModalOpen}
        modalHandler={() => setIsModalOpen(!isModalOpen)}
        label="Add API Source"
      >
        <Wrapper>
          <ModalHeader>
            <div>
              <Heading as="h2" variant="h3">
                Delete Dataset Access Model
              </Heading>
              <Button
                kind="custom"
                size="md"
                icon={<CrossSize300 />}
                onPress={() => setIsModalOpen(!isModalOpen)}
              />
            </div>
          </ModalHeader>
          <Line />
          <Text
            as="h3"
            variant="pt16"
            paddingTop="24px"
            padding={'24px'}
            fontWeight="400"
          >
            Are you sure you want to dataset access model{' '}
          </Text>
          <Line />
          <Flex padding={'16px'} gap={'10px'} justifyContent="flex-end">
            <Button
              kind="primary-outline"
              onPress={() => setIsModalOpen(!isModalOpen)}
            >
              No, Cancel
            </Button>
            <Button
              kind="primary-outline"
              onPress={() => {
                handleDelete();
                setIsModalOpen(!isModalOpen);
              }}
            >
              {' '}
              Yes, Delete
            </Button>
          </Flex>
        </Wrapper>
      </Modal>
    </>
  );
};

const Wrapper = styled.section`
  background-color: var(--color-background-lightest);
  max-height: 90vh;
  min-width: 629px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
`;
const ModalHeader = styled.div`
  > div {
    display: flex;
    justify-content: space-between;
    padding: 24px;
  }
  Button {
    margin: auto 0;
    padding: 0;
  }
`;
const Line = styled.div`
  border: 1px solid var(--color-gray-01);
  margin-inline: 20px;
`;
