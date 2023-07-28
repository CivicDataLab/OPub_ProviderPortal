import { CrossSize500 } from '@opub-icons/ui';
import { Button, Modal } from 'components/actions';
import React from 'react';
import styled from 'styled-components';
import { Heading } from '../Heading';
import SwaggerUI from 'swagger-ui-react';
import { Download } from '@opub-icons/workflow';
import { Flex } from '../FlexWrapper';
import { Link } from '../Link';

export const ApiDetails = ({ spec, hasAgreed, damStatus, request }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <Wrapper>
      <Button
        fluid
        isDisabled={
          request === false ||
          !hasAgreed ||
          damStatus === 'REQUESTED' ||
          damStatus === 'REJECTED'
        }
        kind="primary-outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
      >
        API Details
      </Button>
      <Modal
        label="api details"
        isOpen={isOpen}
        modalHandler={() => setIsOpen(!isOpen)}
      >
        <ModalWrapper id="api-modal">
          <header>
            <Heading as="h1" variant="h3">
              IDP Data API
            </Heading>
            <Flex gap="10px" alignItems={'center'}>
              <Link
                href={`data:text/json;charset=utf-8,${encodeURIComponent(
                  JSON.stringify(spec)
                )}`}
                target="_blank"
                download={`Swagger.json`}
                title={'Download Swagger document'}
              >
                <Button kind="primary-outline" icon={<Download />} iconOnly>
                  Download
                </Button>
              </Link>
              <Button
                icon={<CrossSize500 />}
                iconOnly
                kind="custom"
                onClick={() => setIsOpen(!isOpen)}
              >
                Close Modal
              </Button>
            </Flex>
          </header>
          <Content>
            <SwaggerUI spec={spec} />
          </Content>
        </ModalWrapper>
      </Modal>
    </Wrapper>
  );
};

const Wrapper = styled.div``;

const ModalWrapper = styled.div`
  padding: 16px;
  background-color: var(--color-white);
  border-radius: 4px;
  width: 100vw;
  height: 100vh;
  max-width: 1216px;
  max-height: 720px;
  overflow-y: auto;

  @media (max-width: 640px) {
    max-height: 100%;
  }

  > header {
    display: flex;
    gap: 16px;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid var(--color-gray-01);
    padding-bottom: 12px;
  }

  textarea {
    position: absolute;
    left: -100%;
  }
`;

const Content = styled.div`
  margin-top: 16px;
`;
