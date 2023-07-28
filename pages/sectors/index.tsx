import { useQuery } from '@apollo/client';
import { Loader } from 'components/common';
import { Breadcrumbs, Header } from 'components/layouts';
import { OrgCard } from 'components/pages/providers/OrgCard';
import useTranslation from 'next-translate/useTranslation';
import Head from 'next/head';
import React from 'react';
import { GET_ACTIVE_SECTOR } from 'services';
import styled from 'styled-components';
import { platform_name } from 'platform-constants';
import { toCamelCase } from 'utils/helper';

type Props = {
  sectorData: any;
};

const Sectors: React.FC<Props> = () => {
  const { t } = useTranslation('sectors');
  const headerData = {
    title: t('all-sectors'),
  };

  const { loading, data, error } = useQuery(GET_ACTIVE_SECTOR);

  // Transform sectorData to fit the format of Organization Card
  const sectorsData = data?.active_sector?.map((sectItem) => {
    /\s/g.test(sectItem.name)
      ? (sectItem.logo = toCamelCase(sectItem.name))
      : (sectItem.logo = toCamelCase(sectItem.name));

    return {
      title: t(sectItem?.name.toLowerCase().replaceAll(' ', '-')),
      redirect_url: `/sectors/${sectItem.name}`,
      name: sectItem.name,
      description:
        sectItem.description ||
        t('click-on-the-image-to-explore-sector-datasets', {
          sector: sectItem.name,
        }),
      package_count: sectItem.dataset_count,
      logo: `/assets/icons/${sectItem.logo}.svg`,
    };
  });

  return (
    <>
      <Head>
        <title>Sectors | {platform_name} (IDP)</title>
      </Head>

      <Breadcrumbs container title={t('breadcrumb-sector-title')} />

      <Header data={headerData} />

      <main className="containerDesktop">
        <List>
          {loading ? (
            <Loader />
          ) : (
            sectorsData?.map((item, index) => {
              return (
                <li key={`list-${index}`} className="list__item">
                  <OrgCard data={item} isSector={true} />
                </li>
              );
            })
          )}
        </List>
      </main>
    </>
  );
};

export default Sectors;

const List = styled.ul`
  display: grid;
  gap: 16px;
  margin-block: 32px;
  align-items: stretch;

  grid-template-columns: repeat(auto-fit, minmax(min(350px, 100%), 1fr));

  @media (max-width: 640px) {
    margin-block: 16px;
  }
`;
