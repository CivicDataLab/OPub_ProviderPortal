import { CrossSize500 } from '@opub-icons/ui';
import Button from 'components/actions/Button';
import Modal from 'components/actions/Modal';
import styled from 'styled-components';
import { Heading } from '../Heading';
import { Separator } from '../Separator/Separator';

const PDFViewer = ({ isOpen, setOpen, link, label }) => {
  return (
    <div>
      <Modal
        isOpen={isOpen}
        label="pdf viewer"
        modalHandler={() => setOpen(!isOpen)}
      >
        <PDFViewerWrapper>
          <header>
            <Heading variant="h4">{label}</Heading>
            <Button
              icon={<CrossSize500 />}
              iconOnly
              kind="custom"
              onPress={() => setOpen(!isOpen)}
            >
              close modal
            </Button>
          </header>
          <Separator />
          <PDFWrapper>
            <object type="application/pdf" data={link} width="100%">
              alt : <a href={link}>pdf link</a>
            </object>
          </PDFWrapper>
        </PDFViewerWrapper>
      </Modal>
    </div>
  );
};

export { PDFViewer };

const PDFViewerWrapper = styled.div`
  padding: 16px;
  background-color: var(--color-white);
  border-radius: 4px;
  filter: var(--drop-shadow);
  flex-direction: column;
  display: flex;

  width: 100vw;
  height: 100vh;
  max-width: 1014px;
  max-height: 720px;

  > header {
    display: flex;
    gap: 16px;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid var(--color-gray-01);
    padding-bottom: 12px;
  }

  object {
    height: 100%;
  }
`;

const PDFWrapper = styled.main`
  margin-top: 16px;
  height: 100%;
`;
