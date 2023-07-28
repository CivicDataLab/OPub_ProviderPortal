import { Close } from '@opub-icons/workflow';
import Button from 'components/actions/Button/Button';
import Modal from 'components/actions/Modal/Modal';
import React, { useState } from 'react';
import styled from 'styled-components';
import { Text } from 'components/layouts';
import { Flex } from 'components/layouts/FlexWrapper';
import { Label } from 'components/form/BaseStyles';
import { convertDateFormat } from 'utils/helper';

export const HistoryWrapper = ({ data }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  function modalHandler() {
    setIsModalOpen(!isModalOpen);
  }
  return (
    <>
      {data.length > 0 && (
        <Button
          kind="custom"
          fluid
          size="sm"
          // isDisabled={data.data.length <= 0}
          onPress={(e) => {
            modalHandler();
          }}
        >
          History
        </Button>
      )}
      <Modal
        isOpen={isModalOpen}
        modalHandler={() => modalHandler()}
        label="Confirmation Modal"
      >
        <ModalContainer>
          <Flex justifyContent={'space-between'} alignItems={'center'}>
            <Text as={'h3'}>History</Text>
            <Button
              kind="custom"
              icon={<Close />}
              onPress={() => modalHandler()}
            />
          </Flex>
          <Line />
          <HistoryData>
            {data.map((item, index) => (
              <div key={index}>
                <Flex gap="10px">
                  <Label>Date</Label>
                  <Text>{convertDateFormat(item.issued || '-')}</Text>
                </Flex>
                <Flex gap="10px">
                  <Label>Description</Label>
                  <Text>{item.description || '-'}</Text>
                </Flex>
                <Flex gap="10px">
                  <Label>Remark</Label>

                  <Text>{item.remark || '-'}</Text>
                </Flex>
              </div>
            ))}
          </HistoryData>
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
  max-height: 400px;
  overflow-y: auto;
`;
const HistoryData = styled.div`
  label {
    max-width: 30%;
    min-width: 30%;
  }
  > div {
    padding-top: 10px;
  }
`;

const Line = styled.div`
  border: 1px solid var(--color-gray-01);
`;
