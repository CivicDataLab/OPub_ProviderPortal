import React from 'react';
import styled from 'styled-components';
import {
  Heading,
  NoResult,
  Separator,
  Text,
  TruncateText,
} from 'components/layouts';
import { Flex } from 'components/layouts/FlexWrapper';
import { Info } from '@opub-icons/workflow';
import { Link } from 'components/layouts/Link';

const DataStories = ({ data }) => {
  return (
    <div>
      <div className="onlyDesktop">
        <Heading variant="h3" as="h2">
          Additional Information
        </Heading>
      </div>

      {data?.additionalinfo_set.length === 0 ? (
        <NoResult />
      ) : (
        <DataStoryWrapper>
          {data.additionalinfo_set?.map((story, index) => (
            <DataStoryCard key={`DataStoryCard-${index}`}>
              <Heading as="h3" variant="h4">
                {story.title}
              </Heading>
              <Text
                variant="pt16"
                color={'var(--text-medium)'}
                as="p"
                title={story.description}
              >
                <TruncateText linesToClamp={3}>
                  {story.description}
                </TruncateText>
              </Text>
              <Separator />
              <Footer>
                <Flex
                  gap="6px"
                  alignItems={'center'}
                  justifyContent={'space-between'}
                >
                  <Info fill="var(--color-gray-03)" />
                  <Text variant="pt14" color={'var(--text-light)'}>
                    {story.file != ''
                      ? 'Download file offline'
                      : 'More Details on external page'}
                  </Text>
                </Flex>
                <Link
                  target="_blank"
                  href={
                    story.remote_url != ''
                      ? story.remote_url
                      : `${process.env.NEXT_PUBLIC_BACKEND_URL}/public/${story.file}`
                  }
                  external={story.remote_url != '' ? true : false}
                >
                  <button className="storyfile">
                    {story.file != '' ? 'Download File' : 'Open Link'}
                  </button>
                </Link>
              </Footer>
            </DataStoryCard>
          ))}
        </DataStoryWrapper>
      )}
    </div>
  );
};

export default DataStories;

const DataStoryWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  // padding-top: 2%;
`;

const DataStoryCard = styled.div`
  margin-top: 16px;
  background-color: var(--color-white);
  box-shadow: var(--box-shadow);
  padding: 16px;
  flex: 1 0 300px;

  h3 {
    margin-bottom: 12px;
  }

  p {
    margin-bottom: 12px;
    overflow: hidden;
  }
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  padding-top: 16px;
  margin-top: auto;

  .storyfile {
    padding: 8px 16px;
    font-size: 0.875rem;
    line-height: 1.7;
    font-weight: var(--font-bold);
    display: flex;
    color: var(--color-background-lightest);
    background-color: var(--color-primary-01);
    border-radius: 2px;
    align-items: center;
    white-space: nowrap;
    width: fit-content;
    height: fit-content;

    &:hover {
      filter: brightness(110%);
    }
  }

  @media (max-width: 640px) {
    padding-top: 12px;
  }
`;
