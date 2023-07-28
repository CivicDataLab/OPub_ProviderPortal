import React from 'react';
import styled from 'styled-components';
import { Table } from 'components/data/BasicTable';
import { Heading, PDFViewer, Text, TruncateText } from 'components/layouts';
import { Link } from 'components/layouts/Link';
import { Flex } from 'components/layouts/FlexWrapper';
import { CardWrapper, DataWrapper } from '../ExplorerViz/ExplorerViz';

const ExternalDam = ({ data }) => {
  const [isLicenseOpen, setisLicenseOpen] = React.useState(false);
  const [isPolicyOpen, setisPolicyOpen] = React.useState(false);
  return (
    <section>
      <Heading as={'h3'} variant="h3">
        Policy & Licence
      </Heading>
      <Flex flexDirection={'column'} marginY={'16px'}>
        <Text variant="pt16b">Policy</Text>
        <CardWrapper>
          {data?.externalaccessmodel_set[0]?.policy ? (
            <DataWrapper>
              <div>
                <Heading as="h4" variant="h5">
                  {data?.externalaccessmodel_set[0]?.policy?.title}
                </Heading>

                <Text
                  as="p"
                  variant="pt14"
                  color="var(--text-medium)"
                  marginTop={'4px'}
                >
                  <TruncateText linesToClamp={10}>
                    {data?.externalaccessmodel_set[0]?.policy?.description}
                  </TruncateText>
                </Text>
              </div>

              {data?.externalaccessmodel_set[0]?.policy?.remote_url !== '' ? (
                <Link
                  external
                  target="_blank"
                  href={data?.externalaccessmodel_set[0]?.policy?.remote_url}
                >
                  <button className="storyfile"> Open Policy</button>
                </Link>
              ) : (
                <div>
                  <Link
                    as="button"
                    onClick={() => setisPolicyOpen(!isPolicyOpen)}
                    variant="pt16l"
                    underline="hover"
                    target="_blank"
                  >
                    <button className="storyfile"> View Policy</button>
                  </Link>
                  <PDFViewer
                    label={'Policy'}
                    isOpen={isPolicyOpen}
                    setOpen={setisPolicyOpen}
                    link={`${process.env.NEXT_PUBLIC_BACKEND_URL}/public/${data.externalaccessmodel_set[0].policy.file}`}
                  />
                </div>
              )}
            </DataWrapper>
          ) : (
            <Text>NA</Text>
          )}
        </CardWrapper>
      </Flex>

      <Flex flexDirection={'column'} marginY={'16px'}>
        <Text variant="pt16b">Licence</Text>

        <CardWrapper>
          {data?.externalaccessmodel_set[0]?.license ? (
            <DataWrapper>
              <div>
                <Heading as="h4" variant="h5">
                  {data?.externalaccessmodel_set[0]?.license?.title}
                </Heading>
                <Text
                  as="p"
                  variant="pt14"
                  color="var(--text-medium)"
                  marginTop={'4px'}
                >
                  <TruncateText linesToClamp={10}>
                    {data?.externalaccessmodel_set[0]?.license?.description}
                  </TruncateText>
                </Text>
              </div>

              {data?.externalaccessmodel_set[0]?.license?.remote_url !== '' ? (
                <Link
                  external
                  target="_blank"
                  href={data?.externalaccessmodel_set[0]?.license?.remote_url}
                >
                  <button className="storyfile"> Open Licence</button>
                </Link>
              ) : (
                <div>
                  <Link
                    as="button"
                    onClick={() => setisLicenseOpen(!isLicenseOpen)}
                    variant="pt16l"
                    underline="hover"
                    target="_blank"
                  >
                    <button className="storyfile"> View Licence</button>
                  </Link>
                  <PDFViewer
                    label={'Licence'}
                    isOpen={isLicenseOpen}
                    setOpen={setisLicenseOpen}
                    link={`${process.env.NEXT_PUBLIC_BACKEND_URL}/public/${data.externalaccessmodel_set[0].license.file}`}
                  />
                </div>
              )}
            </DataWrapper>
          ) : (
            <Text>NA</Text>
          )}
        </CardWrapper>
      </Flex>
    </section>
  );
};

export default ExternalDam;
