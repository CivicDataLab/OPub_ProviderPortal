import { Close } from '@opub-icons/workflow';
import Button from 'components/actions/Button/Button';
import Modal from 'components/actions/Modal/Modal';
import React, { useState } from 'react';
import styled from 'styled-components';
import { Text } from 'components/layouts';
import { Flex } from 'components/layouts/FlexWrapper';
import { useSession } from 'next-auth/react';
import { fetchresetToken } from 'utils/fetch';
import { toast } from 'react-toastify';
import { useProviderStore } from 'services/store';

export const ResetTokenWrapper = ({ data }) => {
  const { data: session } = useSession();
  const currentOrgRole = useProviderStore((e) => e.org);

  const [isModalOpen, setIsModalOpen] = useState(false);
  function modalHandler() {
    setIsModalOpen(!isModalOpen);
  }

  function resetToken(id) {
    fetchresetToken(id, session, currentOrgRole?.org_id)
      .then((res) => {
        if ((res.status = 200)) {
          setIsModalOpen(!isModalOpen);
          toast.success('Token reset successfully');
        }
      })
      .catch((err) => {
        setIsModalOpen(!isModalOpen);
        toast.error('Failed to reset token');
      });
  }
  return (
    <>
      <Button
        kind="custom"
        fluid
        size="sm"
        // isDisabled={data.data.length <= 0}
        onPress={(e) => {
          modalHandler();
        }}
      >
        Reset Token
      </Button>

      <Modal
        isOpen={isModalOpen}
        modalHandler={() => modalHandler()}
        label="Confirmation Modal"
      >
        <ModalContainer>
          <Flex justifyContent={'space-between'} alignItems={'center'}>
            <Text as={'h3'}>Reset Token</Text>
            <Button
              kind="custom"
              icon={<Close />}
              onPress={() => modalHandler()}
            />
          </Flex>
          <Line />
          <Text paddingY={'10px'}>Are You sure to reset the token</Text>
          <Line />
          <Flex gap={'10px'} justifyContent="flex-end">
            <Button
              kind="primary-outline"
              size="sm"
              onPress={() => setIsModalOpen(!isModalOpen)}
            >
              No, Cancel
            </Button>

            <Button
              kind="primary-outline"
              size="sm"
              onPress={(e) =>
                resetToken(data?.datasetaccessmodelrequest_set[0]?.id)
              }
            >
              Yes
            </Button>
          </Flex>
        </ModalContainer>
      </Modal>
    </>
  );
};

const ModalContainer = styled.div`
  padding: 15px;
  background-color: var(--color-white);
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 400px;
`;

const Line = styled.div`
  border: 1px solid var(--color-gray-01);
`;
