import { fetchFilters } from './fetch';
import { slug } from './helper';

function changeKeyName(key) {
  if (key == 'size') return 'rows';
  else if (key == 'from') return 'start';
  else return key;
}

export async function fetchOrgDatasets(id, variable) {
  try {
    // * Creating a string of parameter from object of variables for elasticSearch use
    const varArray = Object.keys(variable).map((key) => {
      return `${variable[key]}`;
    });

    const varString = varArray.length > 0 ? varArray.join('&') : ``;

    const response = await fetch(
      `${process.env.BACKEND_URL}/facets/?organization=${id}&${varString}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(error);
  }
}

export async function fetchSectorDatasets(id, variable) {
  try {
    // * Creating a string of parameter from object of variables for elasticSearch use
    const varArray = Object.keys(variable).map((key) => {
      return `${variable[key]}`;
    });

    const varString = varArray.length > 0 ? varArray.join('&') : ``;

    const response = await fetch(
      `${process.env.BACKEND_URL}/facets/?sector=${id}&${varString}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(error);
  }
}

export async function fetchSectorFilters(variable, title) {
  try {
    variable.sector = title.replaceAll('&', '%26');
    const data: any = await fetchFilters(variable);
    return data;
  } catch (error) {
    throw new Error(error);
  }
}

export async function fetchOrgFilters(variable, title) {
  try {
    variable.organization = title.replaceAll('&', '%26');
    const data: any = await fetchFilters(variable);
    return data;
  } catch (error) {
    throw new Error(error);
  }
}

export function formatResults(results) {
  return results?.map((e: any) => {
    const dataset = e?._source;

    return {
      name: `${slug(dataset.dataset_title || '')}`,
      title: dataset.dataset_title || '',
      description: dataset.dataset_description || '',
      slug: dataset.slug || '',
      sector: dataset.sector || '',
      organization: {
        name: dataset.org_title || '',
        image_url: dataset.org_logo || '',
        title: dataset.org_title || '',
        id: dataset.org_id || '',
        type: dataset.org_types || '',
      },
      hvd_rating: dataset.hvd_rating || 0,
      license_title: dataset.license || '',
      published: dataset.published_date || '',
      tags: dataset.tags || '',
      extras: dataset.extras || [],
      format: [...new Set(dataset.format || [])],
      metadata_modified: dataset.last_updated || '',
      access_type: dataset.access_type || '',
      period_from: dataset.period_from || '',
      period_to: dataset.period_to || '',
      frequency: dataset.update_frequency || '',
      damTypes: dataset.data_access_model_type || [],
      datasetaccessmodel_set: dataset.dataset_access_models || [],
      rating: dataset.average_rating || 0,
      downloads: dataset.download_count || 0,
      highlights: dataset.highlights || [],
      type: dataset.dataset_type || '',
      resource_count: dataset?.resource_count,
      duration:
        dataset?.period_from && dataset?.period_to
          ? `FY ${dataset?.period_from.split('-')[0]} to ${
              dataset?.period_to.split('-')[0]
            }`
          : 'NA',
    };
  });
}
