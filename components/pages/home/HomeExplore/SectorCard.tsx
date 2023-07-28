import { ArrowSize500 } from '@opub-icons/ui';
import { Data, FileData, User } from '@opub-icons/workflow';
import { Heading, Text } from 'components/layouts';
import { Flex } from 'components/layouts/FlexWrapper';
import { NextLink } from 'components/layouts/Link';
import { Tooltip } from 'components/overlays';
import useTranslation from 'next-translate/useTranslation';
import Image from 'next/image';
import React from 'react';
import styled, { css } from 'styled-components';
import { toCamelCase } from 'utils/helper';

export const SectorCard = ({ sectorItem }) => {
  const { t } = useTranslation('sectors');
  const [logo, setLogo] = React.useState('logo');

  return (
    <NextLink href={`/sectors/${sectorItem.name}`}>
      {/* TODO change names either in backend or designs for icons */}
      <Card>
        {logo === 'logo' ? (
          <Image
            className="leftIcon"
            src={`/assets/icons/${toCamelCase(sectorItem.name)}.svg`}
            alt={`Icon of ${sectorItem.name} sector`}
            title={`Click to see datasets of ${sectorItem.name} sector`}
            width={48}
            height={48}
            onError={() => {
              setLogo('fallback');
            }}
          />
        ) : (
          <Image
            src={`/assets/icons/Organisation.svg`}
            alt={`Icon of ${sectorItem.name} sector`}
            width={48}
            height={48}
            style={{ marginLeft: '-2px' }}
          />
        )}

        <Flex
          alignItems={'center'}
          gap="10px"
          marginTop={'auto'}
          marginBottom={'auto'}
        >
          <div title="Datasets">
            <Flex gap="4px" margin={'auto'}>
              <Text variant="pt14" color="var(--text-medium)">
                {sectorItem.dataset_count || '0'}
              </Text>
              <Data fill="var(--color-gray-04)" />
            </Flex>
          </div>
          <div title="Dataset Access Models">
            <Flex gap="4px" margin={'auto'}>
              <Text variant="pt14" color="var(--text-medium)">
                {sectorItem.dam_count || '0'}
              </Text>
              <FileData fill="var(--color-gray-04)" />
            </Flex>
          </div>
          <div title="Providers">
            <Flex gap="4px" margin={'auto'}>
              <Text variant="pt14" color="var(--text-medium)">
                {sectorItem.organization_count || '0'}
              </Text>
              <User fill="var(--color-gray-04)" />
            </Flex>
          </div>
        </Flex>

        <Heading
          variant="h5"
          as="h4"
          title={sectorItem.name}
          marginTop={'auto'}
          marginBottom={'auto'}
        >
          {t(sectorItem.name.toLowerCase().replaceAll(' ', '-'))}
        </Heading>
        <ArrowSize500 fill="var(--color-primary-01)" />
      </Card>
    </NextLink>
  );
};

const CardStyles = css`
  padding: 16px;
  /* width: 100%; */
  align-self: stretch;
  height: 100%;
  min-height: 120px;
  display: grid;
  grid-template-columns: 1fr 25px;
  grid-template-rows: 1fr 40px;
  text-decoration: none;
  gap: 12px;
  background-color: var(--color-white);
  border-radius: 4px;
  border: 2px solid var(--color-gray-02);
  box-shadow: var(--box-shadow);
  transition: text-decoration-color 200ms ease;

  h3,
  svg {
    margin-top: auto;
    margin-bottom: auto;
  }

  div > svg {
    margin-top: inherit;
  }

  > div {
    justify-self: flex-end;
  }

  span,
  svg {
    justify-self: flex-start;
  }

  &:hover,
  &:focus-visible {
    border-color: var(--color-primary-01);
  }

  > a {
    margin: auto;
    grid-column: 1/3;
    grid-row: 1/3;
  }

  &[data-type='explore'] {
    font-weight: 700;
    font-size: 1.25rem;
    color: var(--color-primary-01);

    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const Card = styled.a`
  ${CardStyles}
`;
