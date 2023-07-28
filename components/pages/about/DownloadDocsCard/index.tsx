import { Box, Heading, Text } from 'components/layouts';
import { Flex } from 'components/layouts/FlexWrapper';
import styled from 'styled-components';
import { Link as FileLink } from 'components/layouts/Link';
import { Download } from '@opub-icons/workflow';

const DownloadDocsCard = ({ downloadDocs, separator = true }) => {
  return (
    <DownloadDocsWrapper>
      <Heading variant="h5" as="h2">
        Documents
      </Heading>

      <DocsContainer className={separator && 'separator'}>
        {downloadDocs?.length > 0 ? (
          downloadDocs.map((downloadDoc, index) => (
            <div className="docCard" key={`Download-${index}`}>
              <Flex
                gap="10px"
                justifyContent={'space-between'}
                alignItems={'center'}
              >
                <Flex flexDirection={'column'}>
                  <Text
                    variant="pt16b"
                    color={'var(--color-tertiary-1-00)'}
                    lineHeight={'24px'}
                  >
                    {downloadDoc.filename}
                  </Text>
                  <Text color={'var(--color-gray-05)'}>
                    {(downloadDoc.file.size / 1024)?.toFixed(3)} MB
                  </Text>
                </Flex>

                <FileLink
                  target="_blank"
                  rel="noreferrer"
                  href={`${process.env.NEXT_PUBLIC_BACKEND_URL}/cms${downloadDoc.file.url}`}
                >
                  <span className="sr-only">
                    Download {downloadDoc.filename}
                  </span>
                  <Download width={'24px'} color="var(--color-tertiary-1-00)" />
                </FileLink>
              </Flex>
            </div>
          ))
        ) : (
          <Flex
            minHeight={'100px'}
            justifyContent={'center'}
            alignItems={'center'}
          >
            <Text>No Documents</Text>
          </Flex>
        )}
      </DocsContainer>
    </DownloadDocsWrapper>
  );
};

export default DownloadDocsCard;

const DownloadDocsWrapper = styled.div`
  width: 100%;
  padding: 10px 0px;

  h5 {
    margin-bottom: 12px;
  }
`;

const DocsContainer = styled.div`
  margin-top: 20px;

  display: flex;
  flex-direction: column;
  gap: 8px;

  &.separator {
    padding-top: 12px;
    margin-top: 16px;
    border-top: 1px solid var(--color-gray-02);
  }

  .docCard {
    padding: 8px 12px;
    background-color: var(--color-white);
    border: 1px solid var(--border-default);
    border-radius: 2px;

    a {
      line-height: 0;
    }
  }
`;
