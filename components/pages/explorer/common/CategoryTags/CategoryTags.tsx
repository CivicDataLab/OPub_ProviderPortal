import styled from 'styled-components';
import { color, ColorProps } from 'styled-system';
import { Text } from 'components/layouts';
import Image from 'next/image';
import { Link, NextLink } from 'components/layouts/Link';
import React from 'react';
import { toCamelCase } from 'utils/helper';

interface Props extends ColorProps {
  className?: string;
}

type CategoryTagProps = React.ComponentProps<typeof StyledTag> & Props;

const CategoryTags = ({ categories, ...props }: CategoryTagProps) => {
  const [logo, setLogo] = React.useState('logo');

  return categories.map((category) => (
    <StyledTag key={`${category.id}`} {...props}>
      <NextLink href={`/sectors/${category.name}`}>
        <Link underline="hover">
          <Icon>
            {logo === 'logo' ? (
              <Image
                src={`/assets/icons/${toCamelCase(category.name)}.svg`}
                alt={`Icon of ${category.name} sector`}
                title={`Click to see datasets of ${category.name} sector`}
                width={20}
                height={20}
                onError={() => {
                  setLogo('fallback');
                }}
              />
            ) : (
              <Image
                src={`/assets/icons/Organisation.svg`}
                alt={`Icon of ${category.name} sector`}
                width={20}
                height={20}
                style={{ marginLeft: '-2px' }}
              />
            )}
          </Icon>

          <Text variant={'pt14b'}>{category.name}</Text>
        </Link>
      </NextLink>
    </StyledTag>
  ));
};

export default CategoryTags;

export const StyledTag = styled.span`
  background-color: var(--color-primary-06);
  height: fit-content;
  text-align: center;
  color: var(--color-primary-01);
  font-weight: var(--font-bold);
  text-transform: capitalize;
  border-radius: 40px;

  a {
    padding: 8px 24px;
    display: block;

    display: flex;
    align-items: center;
    gap: 8px;
  }
  ${color};

  @media (max-width: 640px) {
    background-color: transparent;

    a {
      padding: 0;
      text-decoration: underline;
    }
  }
`;

const Icon = styled.span`
  display: block;

  @media (max-width: 640px) {
    display: none;
  }
`;
