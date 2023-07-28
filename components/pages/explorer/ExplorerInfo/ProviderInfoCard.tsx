import { Button } from 'components/actions';
import { Heading, TruncateText } from 'components/layouts';
import Image from 'next/image';
import { Link } from 'components/layouts/Link';
import router from 'next/router';
import React from 'react';
import styled from 'styled-components';
import { Flex } from 'components/layouts/FlexWrapper';
import { Text } from 'components/layouts/Text';
import { LinkOut } from '@opub-icons/workflow';
import { Org_types } from 'utils/government-entities';

export const ProviderInfoCard = ({ headerData }) => {
  const [logo, setLogo] = React.useState('logo');

  return (
    <Infobox>
      <ImagePlaceHolder>
        {logo === 'logo' ? (
          <Image
            alt={`Logo of ${headerData.organization.title}`}
            title="Provider Logo | Click here to see all datasets by this Provider"
            src={`${process.env.NEXT_PUBLIC_INTERNAL_BACKEND_URL}/public/${headerData.organization.image_url}`}
            className="img-contain"
            onError={() => setLogo('fallback')}
            width={112}
            height={112}
          />
        ) : (
          <Image
            src={
              Org_types.includes(
                headerData?.organization?.type.replaceAll('_', ' ')
              )
                ? `/assets/icons/Government.svg`
                : `/assets/icons/Private.svg`
            }
            alt={`Logo of ${headerData.organization.title}`}
            width={112}
            height={112}
            className="img-contain"
            style={{ marginLeft: '-2px' }}
          />
        )}
      </ImagePlaceHolder>
      <Flex
        flexDirection={'column'}
        alignItems={'flex-start'}
        gap="8px"
        marginTop={'12px'}
        marginBottom={'24px'}
      >
        <Heading as="h4" variant="h5">
          {headerData.organization.title}
        </Heading>
        <Text>
          <TruncateText linesToClamp={4}>
            {headerData.organization.description}
          </TruncateText>
        </Text>
      </Flex>

      <Button
        kind="primary"
        className="info_box__button"
        fluid
        onPress={() => {
          router.push({
            pathname: `/connect-with-idp`,
            query: {
              provider: headerData.organization.title,
              providerID: headerData.organization.id,
              dataset: router.query.explorer as string,
            },
          });
        }}
      >
        Contact Data Provider
      </Button>
      <Flex gap="12px" marginTop={'8px'}>
        <Link
          underline="none"
          href={`/providers/${headerData?.organization?.title}_${headerData?.organization?.id}`}
        >
          <Button kind="primary-outline">View Datasets</Button>
        </Link>
        {headerData?.organization?.homepage && (
          <Button kind="primary-outline" icon={<LinkOut />}>
            <Link
              target="_blank"
              href={`${headerData?.organization?.homepage}`}
              external
            >
              {' '}
              Website
            </Link>
          </Button>
        )}
      </Flex>
    </Infobox>
  );
};

const Infobox = styled.article`
  background-color: var(--color-white);
  filter: var(--drop-shadow);
  padding: 16px;
  font-size: 1rem;
  min-width: 320px;

  a {
    width: 100%;
  }
  button {
    width: 100%;
    justify-content: center;
    svg {
      margin-left: 8px;
    }
  }
`;

const ImagePlaceHolder = styled.div`
  text-align: center;
  border: 1px solid var(--color-gray-03);
  border-radius: 2px;
  padding-block: 16px;
`;
