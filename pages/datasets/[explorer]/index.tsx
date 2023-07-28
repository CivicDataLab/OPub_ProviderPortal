import { useQuery } from '@apollo/client';
import { ErrorPage, Loader } from 'components/common';
import { Breadcrumbs } from 'components/layouts';
import { ExplorerHeader, ExplorerInfo } from 'components/pages/explorer';
import { MobileExplorerInfo } from 'components/pages/explorer/ExplorerInfo';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { platform_name } from 'platform-constants';
import React, { useState } from 'react';
import { GET_DATASET_BY_SLUG } from 'services';
import { useProviderStore } from 'services/store';
import styled from 'styled-components';

type Props = {
  data: any;
  headerData: any;
  relatedData: any;
  orgDetails: any;
};

const Explorer: React.FC<Props> = ({}) => {
  const router = useRouter();

  // Convert the string from router query to Number datatype as the API accepts a specific datatype
  const datasetName = router.query.explorer as string;

  const { loading, data } = useQuery(GET_DATASET_BY_SLUG, {
    variables: {
      dataset_slug: datasetName,
      skip: !datasetName,
    },
  });

  const resourcesData = { allRes: [] };

  const dataset = data?.dataset_by_slug;

  const { setOrg } = useProviderStore();

  React.useEffect(() => {
    // Set organization in Provider store for mutation from the dataset landing page
    setOrg({ org_id: dataset?.catalog?.organization?.id || null });
  }, [dataset]);

  React.useEffect(() => {
    if (router.query.jump) {
      var headerOffset = 100;
      setTimeout(() => {
        const element = document.getElementById('explorer-tab-container');
        if (element) {
          var offsetPosition = element.offsetTop - headerOffset;
          window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        }
      }, 400);
    }
  }, [router.query.jump]);

  let headerData = {};

  if (loading) return <Loader />;

  if (dataset) {
    headerData = { ...dataset };
    headerData['name'] = datasetName;
    headerData['organization'] = {
      id: dataset.catalog.organization.id,
      name: dataset.catalog.organization.title,
      description: dataset.catalog.organization.description,
      image_url: dataset.catalog.organization.logo,
      title: dataset.catalog.organization.title,
      homepage: dataset.catalog.organization.homepage,
      type: dataset.catalog?.organization?.organization_types,
    };
    headerData['published'] = dataset.issued;
    headerData['metadata_modified'] = dataset.modified;
    headerData['license_title'] =
      dataset.License !== 'not_specified' ? dataset.License : '';
    resourcesData.allRes =
      dataset?.dataset_type === 'EXTERNAL'
        ? dataset?.resource_set
        : Object.values(
            dataset.datasetaccessmodel_set
              .map((accessModel) => {
                return accessModel.datasetaccessmodelresource_set.map(
                  (resource_set) => {
                    return resource_set.resource;
                  }
                );
              })
              .flat()
              .reduce((acc, obj) => ({ ...acc, [obj.id]: obj }), {})
          );
  } else {
    return <ErrorPage />;
  }

  const { title, id } = dataset || '';

  return (
    Object.keys(headerData).length !== 0 && (
      <>
        <Head>
          <title>
            {title || 'Explorer'} | {platform_name} (IDP)
          </title>
        </Head>
        <Wrapper>
          <div>
            <Breadcrumbs title={title} container />
            <ExplorerHeader data={headerData} vizCompData={resourcesData} />
          </div>
          <div className="onlyDesktop">
            <ExplorerInfo
              datasetID={id}
              headerData={headerData}
              vizCompData={resourcesData}
            />
          </div>
          <div className="onlyMobile">
            <MobileExplorerInfo
              datasetID={id}
              headerData={headerData}
              vizCompData={resourcesData}
            />
          </div>
        </Wrapper>
      </>
    )
  );
};

export default Explorer;

const Wrapper = styled.main`
  margin-bottom: 48px;

  .indicator-mobile {
    margin-top: 2rem;

    @media (min-width: 980px) {
      display: none;
    }
  }

  .heading {
    margin-bottom: 0.5rem;
    font-weight: 900;
    font-size: 2.5rem;
  }
`;
