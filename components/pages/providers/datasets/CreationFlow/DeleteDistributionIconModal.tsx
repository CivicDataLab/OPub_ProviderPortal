import { CrossSize300 } from '@opub-icons/ui';
import { Delete } from '@opub-icons/workflow';
import { Button, Modal } from 'components/actions';
import { Heading, Text } from 'components/layouts';
import { Flex } from 'components/layouts/FlexWrapper';
import { useState } from 'react';
import styled from 'styled-components';
import { dateFormat } from 'utils/helper';

const DeleteDistributionIconModal = ({ distributionItem, handleDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button
        kind="custom"
        size="md"
        title="Delete the Distribution"
        data-id={distributionItem.id}
        icon={<Delete color={'var(--color-secondary-01'} />}
        onPress={(e: any) => {
          setIsModalOpen(!isModalOpen);
        }}
      />

      <Modal
        isOpen={isModalOpen}
        modalHandler={() => setIsModalOpen(!isModalOpen)}
        label="Add API Source"
      >
        <Wrapper>
          <ModalHeader>
            <div>
              <Heading as="h2" variant="h3">
                Delete Distribution
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
            The distribution would be deleted in all the linked Dataset Access
            Models.
            <br />
            Are you sure you want to delete{' '}
            <strong>{distributionItem.title}</strong> added on{' '}
            {dateFormat(distributionItem.issued)}?
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
                handleDelete(distributionItem.id);
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

export default DeleteDistributionIconModal;

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
