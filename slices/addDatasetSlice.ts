import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
// import StateManagedSelect from 'react-select/dist/declarations/src/stateManager';

export interface Dataset {
  id: number;
  title: string;
  source: string;
  slug: string;
  description: string;
  dataset_type: string;
  remote_issued: string;
  remote_modified: string;
  sector: Array<Record<string, unknown>>;
  geography: Array<Record<string, unknown>>;
  License: string;
  access_type: string;
  status: string;
  funnel: string;
  accepted_agreement: string;
  update_frequency: string;
  resource_set: Array<Resource>;
  highlights: Array<string>;
  additionalinfo_set: Array<AdditionalInfo>;
  externalaccessmodel_set: Array<ExternalAccessModelType>;
  tags: Array<Record<string, unknown>>;
  period_from: string;
  period_to: string;
  is_datedynamic: boolean;
  confirms_to: string;
  contact_point: string;
  in_series: string;
  language: string;
  qualified_attribution: string;
  spatial_coverage: string;
  spatial_resolution: string;
  temporal_coverage: string;
  temporal_resolution: string;
  theme: string;
}

export interface Resource {
  id: number;
  title: string;
  description: string;
  dataset: number;
  status: string;
  file_details: FileDetailsType;
  api_details: ApiDetailsType;
  schema: Array<Schema>;
  masked_fields: Array<string>;
  byte_size: string;
  external_url: string;
  checksum: string;
  compression_format: string;
  media_type: string;
  packaging_format: string;
  release_date: string;
}

export interface FileDetailsType {
  file: File;
  remote_url: string;
  format: string;
  source_file_name: string;
}

export interface ApiDetailsType {
  api_source: ApiSourceType;
  auth_required: boolean;
  response_type: string;
  url_path: string;
  format_loc: string;
  default_format: string;
  format_key: string;
  parameters: Array<Parameters>;
  supported_formats: Array<String>;
}

export interface ApiSourceType {
  api_version: String;
  auth_credentials: String;
  auth_loc: String;
  auth_token: String;
  auth_type: String;
  base_url: String;
  description: String;
  headers: object;
  id: string;
  title: String;
}

export interface Schema {
  id: string;
  key: string;
  description: string;
  format: string;
}

export interface Parameters {
  id: string;
  key: string;
  description: string;
  format: string;
  default: string;
  type: string;
}

export interface AdditionalInfo {
  dataset: String;
  description: String;
  file: File;
  format: String;
  id: string;
  remote_url: String;
  title: String;
  type: string;
}

export interface ExternalAccessModelType {
  id: String;
  dataset: String;
  license: {
    type: String;
    description: String;
    file: File;
    id: String;
    remote_url: String;
    title: String;
  };
  policy: {
    type: String;
    description: String;
    file: File;
    id: String;
    remote_url: String;
    title: String;
  };
}

const initialState: Dataset = {
  id: 0,
  title: '',
  source: '',
  slug: '',
  description: '',
  dataset_type: '',
  accepted_agreement: '',
  remote_issued: '',
  remote_modified: '',
  sector: [],
  geography: [],
  License: '',
  access_type: '',
  status: '',
  funnel: '',
  update_frequency: '',
  resource_set: [],
  highlights: [],
  additionalinfo_set: [],
  externalaccessmodel_set: [],
  tags: [],
  period_from: '',
  period_to: '',
  is_datedynamic: false,
  confirms_to: '',
  contact_point: '',
  in_series: '',
  language: '',
  qualified_attribution: '',
  spatial_coverage: '',
  spatial_resolution: '',
  temporal_coverage: '',
  temporal_resolution: '',
  theme: '',
};

export const addDatasetSlice = createSlice({
  name: 'addDataset',
  initialState,
  reducers: {
    updateDataset: (state, action: PayloadAction<Dataset>) => {
      return {
        ...initialState,
        id: action.payload.id,
        title: action.payload.title,
        source: action.payload.source,
        description: action.payload.description,
        slug: action.payload.slug,
        accepted_agreement: action.payload.accepted_agreement,
        dataset_type: action.payload.dataset_type,
        remote_issued: action.payload.remote_issued?.substring(0, 10) || '',
        remote_modified: action.payload.remote_modified?.substring(0, 10) || '',
        sector: action.payload.sector?.map((item) => {
          return {
            label: item['name'],
            value: item['id'],
          };
        }),
        geography: action.payload.geography?.map((item) => {
          return {
            label: item['name'],
            value: item['id'],
          };
        }),
        License: action.payload.License,
        highlights: action.payload.highlights,
        access_type: action.payload.access_type || state.access_type,
        resource_set: action.payload.resource_set || state.resource_set,
        additionalinfo_set:
          action.payload.additionalinfo_set || state.additionalinfo_set,
        externalaccessmodel_set:
          action.payload.externalaccessmodel_set ||
          state.externalaccessmodel_set,
        status: action.payload.status || state.funnel,
        funnel: action.payload.funnel || state.funnel,
        period_from: action.payload.period_from || '',
        period_to: action.payload.period_to || '',
        is_datedynamic: action.payload.is_datedynamic || false,
        update_frequency: action.payload.update_frequency || '',
        tags: action.payload.tags?.map((item) => {
          return {
            label: item['name'],
            value: item['id'],
          };
        }),
        confirms_to: action.payload.confirms_to,
        contact_point: action.payload.contact_point,
        in_series: action.payload.in_series,
        language: action.payload.language,
        qualified_attribution: action.payload.qualified_attribution,
        spatial_coverage: action.payload.spatial_coverage,
        spatial_resolution: action.payload.spatial_resolution,
        temporal_coverage: action.payload.temporal_coverage,
        temporal_resolution: action.payload.temporal_resolution,
        theme: action.payload.theme,
      };
    },
    updateDatasetElements: (state, action: PayloadAction<Object>) => {
      switch (action.payload['type']) {
        case 'updateTitle':
          return {
            ...state,
            title: action.payload['value'],
          };
        case 'updateSource':
          return {
            ...state,
            source: action.payload['source'],
          };
        case 'updateDescription':
          return {
            ...state,
            description: action.payload['value'],
          };
        case 'updateIssued':
          return {
            ...state,
            remote_issued: action.payload['value'],
          };
        case 'updateModified':
          return {
            ...state,
            remote_modified: action.payload['value'],
          };
        case 'updateDataPeriodFrom':
          return {
            ...state,
            period_from: action.payload['value'],
          };
        case 'updateDataPeriodTo':
          return {
            ...state,
            period_to: action.payload['value'],
          };
        case 'update_frequency':
          return {
            ...state,
            update_frequency: action.payload['value'],
          };
        case 'updateGeography':
          return {
            ...state,
            geography: action.payload['value'],
          };
        case 'updateAccessType':
          return {
            ...state,
            access_type: action.payload['value'],
          };
        case 'updateLicense':
          return {
            ...state,
            License: action.payload['value'],
          };
        case 'updateSector':
          return {
            ...state,
            sector: action.payload['value'],
          };
        case 'updateTags':
          return {
            ...state,
            tags: action.payload['value'],
          };
        case 'updateFunnel':
          return {
            ...state,
            funnel: action.payload['value'],
          };
        case 'pushToResourceSet':
          return {
            ...state,
            resource_set: [...state.resource_set, action.payload['value']],
          };

        case 'updateResourceSet':
          return {
            ...state,
            resource_set: action.payload['value'],
          };

        case 'pushToAdditionalInfo':
          return {
            ...state,
            additionalinfo_set: [
              ...state.additionalinfo_set,
              action.payload['value'],
            ],
          };
        case 'removeFromResourceSet':
          return {
            ...state,
            resource_set: action.payload['value'],
          };
        case 'removeFromAdditionalInfo':
          return {
            ...state,
            additionalinfo_set: action.payload['value'],
          };

        case 'updateResourceSchema':
          return {
            ...state,
            resource_set: action.payload['value'],
          };

        default:
          break;
      }
    },
    resetDatasetStore: () => {
      return { ...initialState };
    },
  },
});

// Action methods for each case reducer function for global usage
export const { updateDataset, updateDatasetElements, resetDatasetStore } =
  addDatasetSlice.actions;

export default addDatasetSlice.reducer;
