import { ArrowSize400 } from '@opub-icons/ui';
import Button from 'components/actions/Button';
import { Heading, Text, TruncateText } from 'components/layouts';
import { Link } from 'components/layouts/Link';
import useTranslation from 'next-translate/useTranslation';
import Image from 'next/image';
import React from 'react';
import styled from 'styled-components';
import { Org_types } from 'utils/government-entities';

const OrgCard: React.FC<{ data: any; isSector?: boolean }> = ({
  data,
  isSector,
}) => {
  const [logo, setLogo] = React.useState('logo');
  const { t } = useTranslation('common');

  return (
    <Wrapper>
      <DataWrapper>
        <CardHeader>
          <Link href={`${data.redirect_url}`} passHref>
            <LogoWrapper>
              <Logo>
                {data.logo && logo === 'logo' ? (
                  <Image
                    src={
                      isSector
                        ? data.logo
                        : `${process.env.NEXT_PUBLIC_INTERNAL_BACKEND_URL}/public/${data.logo}`
                    }
                    className="img-contain"
                    layout="fill"
                    onError={() => {
                      setLogo('fallback');
                    }}
                    alt={
                      isSector
                        ? 'Icon of ' + data.title + ' sector'
                        : 'Logo of ' + data.title
                    }
                  />
                ) : (
                  <Image
                    src={
                      isSector
                        ? `/assets/icons/Organisation.svg`
                        : Org_types.includes(data?.type.replaceAll('_', ' '))
                        ? `/assets/icons/Government.svg`
                        : `/assets/icons/Private.svg`
                    }
                    alt={
                      isSector
                        ? 'Icon of ' + data.title + ' sector'
                        : 'Logo of ' + data.title
                    }
                    layout="fill"
                    className="img-contain"
                    style={{ marginLeft: '-2px' }}
                  />
                )}
              </Logo>
            </LogoWrapper>
          </Link>
          <div className="onlyMobile">
            <Heading as="h2" variant="h4">
              <TruncateText linesToClamp={2}>{data.title}</TruncateText>
            </Heading>
          </div>
        </CardHeader>

        <CardContent>
          <div className="onlyDesktop">
            <Heading as="h2" variant="h4" textAlign="center">
              <TruncateText linesToClamp={2}>{data.title}</TruncateText>
            </Heading>
          </div>
          {data.organization_types && (
            <Text as={'p'} textAlign="center">
              {data.organization_types
                .toLowerCase()
                .replace(/_/g, ' ')
                .replace(/(?: |\b)(\w)/g, function (key) {
                  return key.toUpperCase();
                })}
            </Text>
          )}
          <Text as="p" textAlign="center">
            <TruncateText linesToClamp={2}>{data.description}</TruncateText>
          </Text>
        </CardContent>
      </DataWrapper>

      <Button
        kind="primary-outline"
        href={`${data.redirect_url}`}
        as="a"
        fluid
        iconSide="right"
        icon={<ArrowSize400 width={18} />}
      >
        <DatasetsCount>
          {data.package_count > 0
            ? `${data.package_count} Datasets`
            : t('datasets-coming-soon')}
        </DatasetsCount>
      </Button>
    </Wrapper>
  );
};

export { OrgCard };

const Wrapper = styled.section`
  text-decoration: none;
  padding: 16px;
  gap: 24px;
  display: flex;
  flex-direction: column;
  border-radius: 6px;
  transition: transform 200ms ease;
  height: 100%;
  border-radius: 4px;
  background-color: var(--color-background-lighter);
  position: relative;
  box-shadow: var(--box-shadow);

  @media (max-width: 640px) {
    gap: 14px;
  }
`;

const DatasetsCount = styled.span`
  margin-left: 18px;
  width: 100%;
  text-align: center;
`;

const DataWrapper = styled.article`
  height: 100%;
`;

export const CardHeader = styled.div`
  @media (max-width: 640px) {
    display: flex;
    gap: 12px;
  }
`;

const CardContent = styled.div`
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;

  h4,
  p {
    word-break: break-word;
  }

  @media (max-width: 640px) {
    gap: 8px;
    margin-top: 8px;

    > p {
      text-align: start;
    }
  }
`;

const LogoWrapper = styled.div`
  display: flex;
  justify-content: center;

  padding-block: 40px;
  background-color: var(--color-primary-06);
  margin-inline: auto;
  border-radius: 2px;
  border: 1px solid var(--color-gray-01);

  @media (max-width: 640px) {
    padding: 10px;
  }
`;

const Logo = styled.div`
  position: relative;
  width: 112px;
  height: 112px;

  @media (max-width: 640px) {
    width: 62px;
    height: 62px;
  }
`;
