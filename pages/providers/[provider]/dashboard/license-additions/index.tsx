import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from 'components/actions/Accordian/Accordian';
import { IconArrow } from 'components/icons';
import { DashboardHeader, Heading, NoResult } from 'components/layouts';
import { Link } from 'components/layouts/Link';
import { Text } from 'components/layouts/Text';
import Head from 'next/head';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { LICENSE_ADDITIONS } from 'services';
import { useQuery } from '@apollo/client';
import { LinkButton } from 'components/pages/dashboard/helpers';
import { MainWrapper } from 'components/pages/user/Layout';
import { useProviderStore } from 'services/store';
import { Loader } from 'components/common';
import { Flex } from 'components/layouts/FlexWrapper';
import { platform_name } from 'platform-constants';

const LicenseAdditions = () => {
  const router = useRouter();
  const currentOrgRole = useProviderStore((e) => e.org);
  const { data, loading, error } = useQuery(LICENSE_ADDITIONS, {
    skip: !currentOrgRole?.org_id,
  });

  const licenseList = React.useMemo(() => {
    if (data) {
      return data.all_license_additions?.filter((e) => e.title.length);
    }
    return [];
  }, [data]);

  return (
    <MainWrapper fullWidth>
      <Head>
        <title>License Additions | {platform_name} (IDP)</title>
      </Head>

      <div>
        <DashboardHeader>
          <Heading variant="h3">License Additions</Heading>
          <LinkButton
            label="Request New"
            href={`/providers/${router.query.provider}/dashboard/license-additions/request`}
            type="create"
          />
        </DashboardHeader>
        <AccordionWrapper type="single" collapsible>
          {!loading && !error && currentOrgRole?.org_id ? (
            licenseList && licenseList.length > 0 ? (
              licenseList.map((item) => (
                <StyledItem key={item.id} value={item.id}>
                  <StyledTrigger>
                    <IconArrow />
                    <Heading variant="h4" as="h3">
                      {item.title}
                    </Heading>
                  </StyledTrigger>
                  <StyledContent>
                    <Text variant="pt14">{item.description}</Text>
                    <Flex gap="5px">
                      <Text variant="pt14b">Generic Condition:</Text>
                      <Text variant="pt14">
                        {item.generic_item ? 'Yes' : 'No'}
                      </Text>
                    </Flex>
                    <Flex gap="5px">
                      <Text variant="pt14b"> Corresponding License: </Text>
                      <Link
                        target="_blank"
                        variant="pt14"
                        href={
                          item.remote_url ||
                          `${process.env.NEXT_PUBLIC_BACKEND_URL}/download/license/${item.license.id}`
                        }
                      >
                        {item.license.title}
                      </Link>
                    </Flex>
                  </StyledContent>
                </StyledItem>
              ))
            ) : (
              <NoResult label={'No License Additions Available'} />
            )
          ) : (
            <Loader loadingText="Loading License Additions..." />
          )}
        </AccordionWrapper>
      </div>
    </MainWrapper>
  );
};

export default LicenseAdditions;

const AccordionWrapper = styled(Accordion)`
  margin-top: 8px;
  display: flex;
  flex-wrap: wrap;
`;

const StyledItem = styled(AccordionItem)`
  width: 100%;
  transition: background-color 200ms ease;
  border-bottom: 1px solid var(--color-gray-02);

  &:hover,
  &:focus-visible,
  &[data-state='open'] {
    background-color: var(--color-gray-01);
  }
`;

const StyledTrigger = styled(AccordionTrigger)`
  padding: 8px;
  width: 100%;
  padding-top: 24px;
  text-align: start;
  display: flex;
  align-items: center;
  gap: 4px;

  > svg {
    transform: rotate(90deg) scale(1.5);
    transition: transform 200ms ease;
  }

  &[data-state='open'] {
    svg {
      transform: rotate(-90deg) scale(1.5);
    }
  }
`;

const StyledContent = styled(AccordionContent)`
  padding-inline: 38px;
  padding-bottom: 16px;

  display: flex;
  flex-direction: column;
  gap: 8px;
`;
