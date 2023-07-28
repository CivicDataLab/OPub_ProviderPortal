import React from 'react';
import styled from 'styled-components';

const RelatedDatasets = ({ relatedData }) => {
  const convertDateFormat = (toBeConverted) => {
    const date = new Date(toBeConverted);
    return `${date.getDate()} ${date.toLocaleString('default', {
      month: 'short',
    })} ${date.getFullYear().toString().substr(-2)}`;
  };

  return (
    <RelatedDatasetsContainer>
      <div className="container">
        <h2>Related Datasets</h2>
        <div className="relatedDataContainer">
          {relatedData &&
            relatedData.map((dataset, index) => (
              <a
                key={`FeaturedItem-${index}`}
                href={`/datasets/${dataset.name}`}
              >
                <h4 className="sectorTag">
                  {dataset.extras.find((x) => x.key === 'sector')
                    ? dataset.extras.find((x) => x.key === 'sector').value
                    : ''}
                </h4>

                <h4>{dataset.title}</h4>

                {dataset.organization.title && (
                  <div className="datePublisher">
                    <p>By</p>
                    <h4 title="Provider Name">{dataset.organization.title}</h4>
                  </div>
                )}
                {dataset.extras.find((x) => x.key === 'published') && (
                  <div className="datePublisher">
                    <p>Published on</p>
                    <h4 title="Published Date">
                      {dataset.extras.find((x) => x.key === 'published')
                        ? convertDateFormat(
                            dataset.extras.find((x) => x.key === 'published')
                              .value
                          )
                        : ''}
                    </h4>
                  </div>
                )}
              </a>
            ))}
        </div>
      </div>
    </RelatedDatasetsContainer>
  );
};

export default RelatedDatasets;

const RelatedDatasetsContainer = styled.div`
  background-color: var(--color-background-alt-light);
  margin-top: 1rem;
  padding-top: 2rem;
  padding-bottom: 2rem;
  /* margin-bottom: 40px; */

  .relatedDataContainer {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(300px, 100%), 1fr));
    gap: 16px;
    margin-top: 16px;

    .sectorTag {
      color: var(--color-tag-yellow);
    }

    a {
      text-decoration: none;
      flex-basis: 100%;
      padding: 16px;
      border: 2px solid var(--color-background-alt-dark);
      background: white;
      /* flex-basis: 32%;
      flex-grow: 1; */
    }

    .datePublisher {
      display: flex;
      flex-flow: row wrap;
      color: #788896;
      margin-top: 0.5em;
      gap: 5px;
    }
  }
`;
