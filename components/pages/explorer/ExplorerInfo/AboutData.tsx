import React from 'react';
import styled from 'styled-components';
import { Table } from 'components/data/BasicTable';
import { Heading } from 'components/layouts';
import RatingsReviews from './RatingsReviews';
import { capitalize, dateFormat, getDuration } from 'utils/helper';
import { NextLink } from 'components/layouts/Link';

const AboutData = ({ callBack, datasetID, data }) => {
  const columnData = [
    {
      headerName: 'Fields',
    },
    {
      headerName: 'Value',
    },
  ];

  const dataObj = {
    ...(data.organization.title
      ? {
          Organization: (
            <NextLink
              href={`/providers/${data.organization.title}_${data.organization.id}`}
            >
              {data.organization.title}
            </NextLink>
          ),
        }
      : {}),
    ...(data?.author ? { Author: data?.author } : {}),
    ...(data?.source ? { Source: data?.source } : {}),
    ...(data?.remote_issued
      ? { 'Data Created Date': dateFormat(data?.remote_issued) }
      : {}),
    ...(data?.remote_modified
      ? { 'Data Modified Date': dateFormat(data?.remote_modified) }
      : {}),
    ...(data?.period_from && (data?.period_to || data?.is_datedynamic)
      ? {
          'Data Duration': getDuration(
            data?.period_from,
            data?.is_datedynamic ? 'Till Date' : data?.period_to
          ),
        }
      : {}),
    ...(data?.period_to ? { 'Period To': dateFormat(data?.period_to) } : {}),
    ...(data?.maintainer ? { Maintainer: data?.maintainer } : {}),
    ...(data?.geography?.length
      ? {
          Geography: data.geography.map((geography, index) => {
            return (
              <>
                <NextLink
                  href={`/datasets?fq=geography%3D${geography.name}&q=&sort_by=&sort=&size=&from=0&start_duration=&end_duration=`}
                >
                  {geography.name}
                </NextLink>
                {index < data.geography.length - 1 ? ',' : ''}{' '}
              </>
            );
          }),
        }
      : {}),
    ...(data?.sector.length
      ? {
          Sector: data.sector.map((sector, index) => {
            return (
              <>
                <NextLink href={`/sectors/${sector.name}`} key={sector.name}>
                  {sector.name}
                </NextLink>
                {index < data.sector.length - 1 ? ',' : ''}{' '}
              </>
            );
          }),
        }
      : {}),
    ...(data.state ? { 'Dataset State': capitalize(data.state) } : {}),
    ...(data.tags.length
      ? {
          Tags: data.tags.map((tag, index) => {
            return (
              <>
                <NextLink
                  href={`/datasets?fq=&q=${capitalize(
                    tag.name
                  )}&sort_by=&sort=&size=&from=0&start_duration=&end_duration=`}
                >
                  {capitalize(tag.name)}
                </NextLink>
                {index < data.tags.length - 1 ? ',' : ''}{' '}
              </>
            );
          }),
        }
      : {}),
    ...(data.confirms_to ? { 'Conforms to': data.confirms_to } : {}),
    ...(data.contact_point ? { 'Contact Point': data.contact_point } : {}),
    ...(data.in_series ? { 'In Series': data.in_series } : {}),
    ...(data.language ? { Language: data.language } : {}),
    ...(data.qualified_attribution
      ? { 'Qualified Attribution': data.qualified_attribution }
      : {}),
    ...(data.spatial_coverage
      ? { 'Spatial Coverage': data.spatial_coverage }
      : {}),
    ...(data.spatial_resolution
      ? { 'Spatial Resolution': data.spatial_resolution }
      : {}),
    ...(data.temporal_coverage
      ? { 'Temporal Coverage': data.temporal_coverage }
      : {}),
    ...(data.temporal_resolution
      ? { 'Temporal Resolution': data.temporal_resolution }
      : {}),
    ...(data.theme ? { Theme: data.theme } : {}),
  };

  const rowData = Object.keys(dataObj).map((key) => ({
    Fields: key,
    Value: dataObj[key],
  }));

  return (
    <AboutDataSection>
      <div className="metaDataContainer">
        <Heading as={'h3'} variant="h3">
          Metadata
        </Heading>
        <Table
          columnData={columnData}
          rowData={rowData}
          label="Metadata"
          heading={`Metadata fields for ${data?.title}`}
        />
      </div>
      <Heading variant="h3" as={'h3'}>
        Ratings & Reviews
      </Heading>
      <RatingsReviews
        datasetID={datasetID}
        handleSubmitCallback={(review, rating, clearFormOnSubmit) => {
          callBack(review, rating, clearFormOnSubmit);
        }}
      />
    </AboutDataSection>
  );
};

export default AboutData;

const AboutDataSection = styled.section`
  display: flex;
  flex-direction: column;
  h3 {
    margin-bottom: 16px;
  }
  a {
    font-weight: 700;
    color: var(--color-link);
  }
  .metaDataContainer {
    margin-bottom: 32px;
  }
  @media (max-width: 640px) {
    table td:nth-of-type(2) {
      word-break: break-all;
      word-wrap: break-word;
    }

    .metaDataContainer {
      margin-bottom: 20px;
    }
  }
  table {
    td:first-of-type {
      min-width: 200px;
    }
  }

  @media (max-width: 600px) {
    table {
      td:first-of-type {
        min-width: auto;
      }
    }
  }
`;
