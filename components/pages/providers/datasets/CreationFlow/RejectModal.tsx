import { Close } from '@opub-icons/workflow';
import { Button, Modal } from 'components/actions';
import { TextArea } from 'components/form';
import { Heading } from 'components/layouts';
import { Flex } from 'components/layouts/FlexWrapper';
import { useState } from 'react';
import styled from 'styled-components';

const RejectModal = ({ isModalOpen, onCancel, onSubmit }) => {
  const [rejectionReason, setRejectionReason] = useState('');
  return (
    <Modal
      isOpen={isModalOpen}
      modalHandler={() => onCancel()}
      label="Add API Source"
    >
      <ModalContentWrapper>
        <ModalHeader>
          <Heading as="h3" variant="h4">
            Reject Request
          </Heading>
          <Button
            kind="custom"
            size="md"
            icon={<Close />}
            onPress={() => onCancel()}
          />
        </ModalHeader>

        <Flex
          flexDirection={'column'}
          flexWrap={'wrap'}
          gap="10px"
          justifyContent={'center'}
        >
          <TextArea
            minHeight={'150px'}
            label="Reason"
            maxLength={500}
            value={rejectionReason}
            onChange={(e) => {
              setRejectionReason(e);
            }}
          />

          <Line />

          <Flex gap="15px" justifyContent={'flex-end'} alignItems={'center'}>
            <Button
              onPress={() => onCancel()}
              kind="primary-outline"
              className="downloadButton"
            >
              Cancel
            </Button>
            <Button
              onPress={() => {
                onSubmit(rejectionReason);
              }}
              kind="primary"
              className="downloadButton"
            >
              Submit
            </Button>
          </Flex>
        </Flex>
      </ModalContentWrapper>
    </Modal>
  );
};

export default RejectModal;

const ModalContentWrapper = styled.div`
  background-color: var(--color-background-lightest);
  min-width: 629px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  padding: 16px;

  textarea {
    min-height: 150px;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  padding-bottom: 10px;
`;

const Line = styled.div`
  border: 1px solid var(--color-gray-01);
  margin-inline: 20px;
  margin-top: 10px;
  margin-bottom: 5px;
`;
