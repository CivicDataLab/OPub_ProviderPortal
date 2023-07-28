import { gql } from '@apollo/client';

// TODO: Rearrange Schemas with comments

export const CREATE_DATA_REQ = gql`
  mutation CreateDataRequest($data_request: DataRequestInput!) {
    data_request(data_request: $data_request) {
      success
      errors
      data_request {
        id
        status
        description
        remark
        purpose
        resource {
          id
        }
        file
      }
    }
  }
`;

export const CREATE_API_SOURCE = gql`
  mutation CreateAPISource($api_source_data: APISourceInput!) {
    create_api_source(api_source_data: $api_source_data) {
      API_source {
        id
        title
        base_url
        description
        api_version
        headers
        auth_loc
        auth_type
        auth_credentials
        auth_token
      }
    }
  }
`;
export const GET_ALL_API_SOURCES = gql`
  query GetAllApiSources {
    all_api_source_by_org {
      id
      title
      base_url
      description
      api_version
      headers
      auth_loc
      auth_type
      auth_credentials
      auth_token
      all_dataset_count
      apidetails_set {
        resource {
          title
        }
      }
    }
  }
`;

export const DELETE_API_SOURCE = gql`
  mutation DeleteAPISource($api_source_id: Int!) {
    delete_api_source(api_source_id: $api_source_id) {
      success
      errors
    }
  }
`;

export const GET_API_SOURCE_BY_ID = gql`
  query GetApiSourceByID($api_source_id: Int) {
    api_source(api_source_id: $api_source_id) {
      id
      title
      base_url
      description
      api_version
      headers
      auth_loc
      auth_type
      auth_credentials
      auth_token
    }
  }
`;

export const GET_ORGANIZATIONS = gql`
  query GetAllOrganizations {
    organizations {
      id
      title
      description
      issued
      modified
      homepage
      contact_email
      logo
      dataset_count
      user_count
      average_rating
      organization_types
      catalog_set {
        id
        title
        description
        issued
        modified
        dataset_set {
          id
          status
        }
      }
    }
  }
`;

export const GET_ORGANIZATION_PROVIDER_PAGE = gql`
  query GetOrganizationForProvidersPage($organization_id: Int) {
    published_organization_by_id(organization_id: $organization_id) {
      id
      title
      description
      logo
      issued
      modified
      homepage
      contact_email
      api_count
      dataset_count
      dam_count
      usecase_count
      organization_types
    }
  }
`;

export const GET_ORGANIZATION_BY_ID = gql`
  query GetOrganizationByID($organization_id: Int) {
    organization_by_id(organization_id: $organization_id) {
      id
      title
      description
      logo
      issued
      modified
      homepage
      contact_email
      organization_types
    }
  }
`;

export const GET_ALL_DATA_REQUEST_LIST = gql`
  query GetAllDataRequests {
    all_data_requests {
      id
      status
      description
      remark
      purpose
      resource {
        id
        title
        description
        issued
        modified
        status
        masked_fields
        dataset {
          id
          title
        }
      }
      api_resource {
        id
        title
        description
        issued
        modified
        status
        masked_fields
      }
    }
  }
`;
export const GET_ALL_DATA_ACCESS_MODEL_REQUEST_LIST_BY_ORG = gql`
  query GetDataAccessModelRequestsByOrg {
    data_access_model_request_org {
      id
      access_model {
        id
        data_access_model {
          type
        }
        dataset {
          id
          title
          slug
          dataset_type
        }
      }
      user
      status
      description
      remark
      purpose
      issued
      modified
    }
  }
`;

export const RESPOND_TO_DATA_REQUEST = gql`
  mutation RespondDataAccessRequest(
    $data_request: DataRequestApproveRejectInput!
  ) {
    approve_reject_data_request(data_request: $data_request) {
      success
      errors
      data_request {
        id
        status
        description
        remark
        purpose
        file
      }
    }
  }
`;

export const RESPOND_TO_DATA_ACCESS_MODEL_REQUEST = gql`
  mutation ApproveRejectDataAccessModelRequest(
    $data_access_model_request: DataAccessModelRequestUpdateInput!
  ) {
    approve_reject_data_access_model_request(
      data_access_model_request: $data_access_model_request
    ) {
      success
      errors
      data_access_model_request {
        id
        user
        status
        description
        remark
        purpose
        issued
        modified
      }
    }
  }
`;

export const GET_RATINGS_REVIEWS = gql`
  query GetRatingsForDataset($dataset_id: Int) {
    dataset_rating(dataset_id: $dataset_id) {
      id
      dataset {
        id
      }
      review
      data_quality
      user
      status
      issued
    }
  }
`;

export const GET_ALL_RATINGS_REVIEWS = gql`
  query GetAllRatings {
    rating_by_org {
      id
      dataset {
        id
        title
        dataset_type
      }
      review
      data_quality
      status
      user
      issued
    }
  }
`;

export const UPDATE_DATASET_RATING_STATUS = gql`
  mutation UpdateDatasetRatingRequest(
    $rating_data: DatasetRatingApproveRejectInput!
  ) {
    approve_reject_dataset_rating(rating_data: $rating_data) {
      success
      errors
      dataset_rating {
        id
        review
        data_quality
        status
        user
      }
    }
  }
`;

export const ADD_RESOURCE = gql`
  mutation CreateResourceMutation($resource_data: ResourceInput!) {
    create_resource(resource_data: $resource_data) {
      success
      errors
      resource {
        id
        title
        description
        issued
        modified
        byte_size
        checksum
        compression_format
        media_type
        packaging_format
        release_date
        file_details {
          remote_url
          format
          file
          source_file_name
        }
        api_details {
          api_source {
            id
            title
            base_url
          }
          auth_required
          url_path
          response_type
          request_type
          parameters {
            id
            key
            format
            description
            default
            type
          }
          supported_formats
          format_loc
          default_format
          format_key
        }
        status
      }
    }
  }
`;

export const DELETE_RESOURCE = gql`
  mutation DeleteResourceMutation($resource_data: DeleteResourceInput) {
    delete_resource(resource_data: $resource_data) {
      success
    }
  }
`;

export const DELETE_ORGANIZATION_REQUEST = gql`
  mutation DeleteOrganizationRequest(
    $delete_organization_request: OrganizationRequestUpdateInput
  ) {
    delete_organization_request(
      delete_organization_request: $delete_organization_request
    ) {
      success
      errors
    }
  }
`;

export const DELETE_ADDITIONALINFO = gql`
  mutation DeleteAdditionalInfoMutation($id: ID) {
    delete_additional_info(id: $id) {
      additional_info {
        id
        title
        description
        issued
        modified
        remote_url
        format
        type
        file
      }
    }
  }
`;

export const UPDATE_RESOURCE = gql`
  mutation UpdateResourceMutation($resource_data: ResourceInput!) {
    update_resource(resource_data: $resource_data) {
      success
      errors
      resource {
        id
        title
        description
        issued
        file_details {
          file
          format
          remote_url
        }
        api_details {
          response_type
          url_path
          request_type
          auth_required
          api_source {
            id
            title
            description
            base_url
          }
          parameters {
            id
            key
            format
            description
            default
            type
          }
          supported_formats
          format_loc
          default_format
          format_key
        }
        modified
        status
        byte_size
        checksum
        compression_format
        media_type
        packaging_format
        release_date
        schema {
          key
          filterable
          display_name
          format
          description
          id
          path
          parent_path
          parent {
            key
          }
          array_field {
            key
          }
        }
      }
    }
  }
`;

export const UPDATE_RESOURCE_SCHEMA = gql`
  mutation UpdateResourceMutation($resource_data: UpdateSchemaInput!) {
    update_schema(resource_data: $resource_data) {
      success
      errors
      resource {
        id
        title
        description
        issued
        file_details {
          file
          format
          remote_url
        }
        api_details {
          response_type
          url_path
          request_type
          auth_required
          api_source {
            id
            title
            description
            base_url
          }
          parameters {
            id
            key
            format
            description
            default
            type
          }
          supported_formats
          format_loc
          default_format
          format_key
        }
        modified
        status
        byte_size
        checksum
        compression_format
        media_type
        packaging_format
        release_date
        schema {
          key
          filterable
          display_name
          format
          description
          id
          path
          parent_path
          parent {
            key
          }
          array_field {
            key
          }
        }
      }
    }
  }
`;

export const CREATE_DATASET = gql`
  mutation createDatasetMutation($dataset_data: CreateDatasetInput) {
    create_dataset(dataset_data: $dataset_data) {
      success
      errors
      dataset {
        id
        title
        description
        dataset_type
      }
    }
  }
`;

export const CREATE_MODERATION_REQUEST = gql`
  mutation ModerationRequestMutation(
    $moderation_request: ModerationRequestInput!
  ) {
    moderation_request(moderation_request: $moderation_request) {
      success
      errors
      moderation_request {
        id
        status
        description
        remark
        dataset {
          id
        }
        creation_date
        modified_date
        reject_reason
        user
      }
    }
  }
`;

export const CREATE_REVIEW_REQUEST = gql`
  mutation ReviewRequestMutation($review_request: ReviewRequestInput) {
    review_request(review_request: $review_request) {
      success
      errors
      review_request {
        id
        status
        description
        remark
        dataset {
          id
        }
        creation_date
        modified_date
        reject_reason
        user
      }
    }
  }
`;

export const UPDATE_DATASET = gql`
  mutation updateDatasetMutation($updated_dataset: UpdateDatasetInput) {
    update_dataset(dataset_data: $updated_dataset) {
      dataset {
        id
        title
        source
        description
        dataset_type
        remote_issued
        remote_modified
        highlights
        sector {
          id
          name
        }
        geography {
          id
          name
        }
        status
        action
        funnel
        period_from
        period_to
        update_frequency
        confirms_to
        contact_point
        in_series
        language
        qualified_attribution
        spatial_coverage
        spatial_resolution
        temporal_coverage
        temporal_resolution
        theme
        slug
        tags {
          id
          name
        }
        resource_set {
          id
          title
          description
          file_details {
            remote_url
            file
            format
          }
          api_details {
            response_type
            url_path
            auth_required
            request_type
            api_source {
              id
              title
              description
              base_url
            }
            parameters {
              id
              key
              format
              description
              default
              type
            }
            supported_formats
            format_loc
            default_format
            format_key
          }
          schema {
            key
            filterable
            display_name
            format
            description
            parent {
              key
            }
            array_field {
              key
            }
          }
        }
      }
    }
  }
`;

export const UPDATE_PATCH_OF_DATASET = gql`
  mutation UpdateFunnelStatusDataset($dataset_data: PatchDatasetInput) {
    patch_dataset(dataset_data: $dataset_data) {
      success
      errors
    }
  }
`;

export const GET_RESOURCE_COLUMNS = gql`
  query GetResourceColumns($resource_id: Int) {
    resource_columns(resource_id: $resource_id)
  }
`;

export const CREATE_ADDLINFO = gql`
  mutation CreateAdditionalInfo($info_data: AdditionalInfoInput!) {
    create_additional_info(info_data: $info_data) {
      success
      errors
      resource {
        id
        title
        description
        issued
        modified
        remote_url
        format
        file
      }
    }
  }
`;
export const UPDATE_ADDLINFO = gql`
  mutation UpdateAdditionalInfo($info_data: AdditionalInfoInput!) {
    update_additional_info(info_data: $info_data) {
      success
      errors
      additional_info {
        id
        title
        description
        issued
        modified
        remote_url
        format
        file
      }
    }
  }
`;

// Get all the tags
export const GET_ALL_TAGS = gql`
  query GetTags {
    all_tag {
      id
      name
    }
  }
`;

// Get all the geographies
export const GET_ALL_GEOGRAPHY = gql`
  query GetGeography {
    all_geography {
      id
      name
    }
  }
`;

// Get all the sector
export const GET_ALL_SECTOR = gql`
  query GetAllSector {
    all_sector {
      id
      name
      dataset_set {
        id
        title
        status
      }
    }
  }
`;

export const GET_ACTIVE_SECTOR = gql`
  query GetActiveSector {
    active_sector {
      id
      name
      description
      dataset_count
      organization_count
      dam_count
      dataset_set {
        id
        title
        status
      }
    }
  }
`;
export const GET_ALL_STATS_COUNT = gql`
  query GetAllStatsCount {
    stat_count {
      sector_count
      geography_count
      organization_count
      dataset_count
      api_count
    }
  }
`;
export const GET_ALL_DATASETS_COUNT = gql`
  query GetAllDatasetsCount($first: Int, $skip: Int) {
    all_datasets(first: $first, skip: $skip) {
      id
    }
  }
`;

export const GET_ALL_DATASETS = gql`
  query GetAllDatasets($first: Int, $skip: Int) {
    all_datasets(first: $first, skip: $skip) {
      id
      title
      description
      dataset_type
      sector {
        id
        name
      }

      catalog {
        organization {
          title
          id
        }
      }

      datasetaccessmodel_set {
        id
        title
        resource_formats
        usage
        payment_type
        payment
        agreements {
          id
          accepted_agreement
        }
        data_access_model {
          id
          title
          type
          description
          issued
          modified
          contract
          license {
            id
            title
          }
          subscription_quota
          subscription_quota_unit
          rate_limit
          rate_limit_unit
          validation
          validation_unit
        }

        datasetaccessmodelrequest_set {
          id
          status
          remark
          issued
          modified
          is_valid
          datarequest_set {
            id
            status
            resource {
              id
            }
          }
        }

        datasetaccessmodelresource_set {
          id
          supported_formats
          resource {
            id
            title
            description
            api_details {
              response_type
            }
            file_details {
              format
            }
          }
          fields {
            id
            key
          }
        }
      }
    }
  }
`;

export const GET_RESOURCES_DATASET = gql`
  query GetResourcesDataset($dataset_id: Int!) {
    resource_dataset(dataset_id: $dataset_id) {
      id
      title
      description
      issued
      modified
      status
    }
  }
`;

export const GET_DATASET_BY_SLUG = gql`
  query GetDataset($dataset_slug: String!) {
    dataset_by_slug(dataset_slug: $dataset_slug) {
      id
      title
      description
      source
      dataset_type
      issued
      remote_issued
      average_rating
      download_count
      remote_modified
      period_from
      period_to
      is_datedynamic
      update_frequency
      confirms_to
      contact_point
      in_series
      language
      qualified_attribution
      spatial_coverage
      spatial_resolution
      temporal_coverage
      temporal_resolution
      theme
      modified
      highlights
      published_date
      last_updated
      sector {
        id
        name
      }
      status
      funnel
      action
      geography {
        id
        name
      }
      catalog {
        organization {
          contact_email
          title
          description
          logo
          modified
          homepage
          organization_types
          id
        }
      }
      tags {
        id
        name
      }
      externalaccessmodel_set {
        id
        policy {
          id
          title
          remote_url
          file
          description
        }
        license {
          id
          title
          remote_url
          file
          description
        }
      }
      additionalinfo_set {
        title
        description
        remote_url
        file
        type
      }
      datasetaccessmodel_set {
        id
        issued
        modified
        data_access_model {
          type
        }
        payment_type
        payment
        datasetaccessmodelresource_set {
          resource {
            id
            title
            description
            issued
            modified
            status
            byte_size
            checksum
            compression_format
            media_type
            packaging_format
            release_date
            external_url
            schema {
              format
              display_name
              key
              description
              array_item {
                key
              }
              parent {
                key
              }
            }
            file_details {
              format
              file
              remote_url
            }
            api_details {
              api_source {
                id
                title
                base_url
                description
                api_version
                headers
                auth_loc
                auth_type
                auth_credentials
                auth_token
              }
              auth_required
              url_path
              response_type
              request_type
              parameters {
                id
                key
                format
                description
                default
                type
              }
              supported_formats
              format_loc
              default_format
              format_key
            }
          }
        }
      }
      resource_set {
        id
        title
        description
        issued
        modified
        status
        byte_size
        checksum
        compression_format
        media_type
        packaging_format
        release_date
        external_url
        schema {
          format
          display_name
          key
          description
          array_item {
            key
          }
          parent {
            key
          }
        }
        file_details {
          format
          file
          remote_url
        }
        api_details {
          api_source {
            id
            title
            base_url
            description
            api_version
            headers
            auth_loc
            auth_type
            auth_credentials
            auth_token
          }
          auth_required
          url_path
          response_type
          request_type
          parameters {
            id
            key
            format
            description
            default
            type
          }
          supported_formats
          format_loc
          default_format
          format_key
        }
      }
    }
  }
`;

export const GET_DATASET = gql`
  query GetDataset($dataset_id: Int!) {
    dataset(dataset_id: $dataset_id) {
      id
      title
      source
      description
      slug
      dataset_type
      issued
      remote_issued
      remote_modified
      period_from
      period_to
      is_datedynamic
      update_frequency
      confirms_to
      contact_point
      in_series
      language
      accepted_agreement
      qualified_attribution
      spatial_coverage
      spatial_resolution
      temporal_coverage
      temporal_resolution
      theme
      modified
      highlights
      sector {
        id
        name
      }
      status
      funnel
      action
      geography {
        id
        name
      }
      catalog {
        id
        title
        description
        issued
        modified
        organization {
          contact_email
          title
          description
          modified
        }
      }
      tags {
        id
        name
      }
      additionalinfo_set {
        id
        title
        description
        issued
        modified
        remote_url
        format
        type
        file
      }
      externalaccessmodel_set {
        id
        policy {
          id
          title
          remote_url
          file
          description
          type
        }
        license {
          id
          title
          remote_url
          file
          description
          type
        }
      }
      resource_set {
        id
        title
        description
        issued
        modified
        status
        file_details {
          format
          file
          remote_url
          source_file_name
        }
        api_details {
          api_source {
            id
            title
            base_url
            description
            api_version
            headers
            auth_loc
            auth_type
            auth_credentials
            auth_token
          }
          auth_required
          url_path
          response_type
          request_type
          parameters {
            id
            key
            format
            description
            default
            type
          }
          supported_formats
          format_loc
          default_format
          format_key
        }
        schema {
          id
          key
          filterable
          display_name
          format
          description
          parent {
            key
          }
          array_field {
            key
          }
          path
          parent_path
        }
      }
    }
  }
`;

export const GET_RESOURCES_BY_DATASET = gql`
  query GetResourcesByDataset($dataset_id: Int) {
    resource_dataset(dataset_id: $dataset_id) {
      id
      title
      description
      issued
      modified
      status
      byte_size
      checksum
      compression_format
      media_type
      packaging_format
      release_date
      schema {
        key
        filterable
        display_name
        format
        description
        parent {
          key
        }
        array_field {
          key
        }
      }
      dataset {
        id
        title
      }
      api_details {
        response_type
        url_path
        auth_required
        request_type
        api_source {
          id
          title
          base_url
        }
        parameters {
          id
          key
          format
          description
          default
          type
        }
        supported_formats
        format_loc
        default_format
        format_key
      }
    }
  }
`;

export const GET_RESOURCE_BY_ID = gql`
  query GetResourceById($resource_id: Int) {
    resource(resource_id: $resource_id) {
      id
      title
      description
      issued
      modified
      status
      masked_fields
      byte_size
      checksum
      compression_format
      media_type
      packaging_format
      release_date
      external_url
      api_details {
        api_source {
          id
          title
          description
          auth_loc
          auth_type
          auth_token
          auth_credentials
        }
        is_large_dataset
        auth_required
        url_path
        response_type
        request_type
        parameters {
          id
          key
          format
          description
          default
          type
          download_api_options_same
          options
          download_options
        }
        supported_formats
        download_formats
        format_loc
        default_format
        format_key
        download_same_as_api
      }
      file_details {
        format
        file
        remote_url
      }
    }
  }
`;

export const ADD_RATING = gql`
  mutation CreateRating($rating_data: DatasetRatingInput!) {
    create_dataset_rating(rating_data: $rating_data) {
      dataset_rating {
        id
        review
        data_quality
      }
    }
  }
`;

export const CREATE_ACCESS_DATA_MODEL = gql`
  mutation CreateAccessDataModel(
    $data_access_model_data: DataAccessModelInput
  ) {
    create_data_access_model(data_access_model_data: $data_access_model_data) {
      success
      errors
      data_access_model {
        id
        title
        type
        description
        issued
        modified
        license {
          id
          title
          description
        }
        rate_limit
        rate_limit_unit
        subscription_quota
        subscription_quota_unit
      }
    }
  }
`;

export const DATASET_DATA_ACCESS_MODELS = gql`
  query getDatasetDataAccessModels(
    $dataset_id: ID!
    $anonymous_users: [String]!
  ) {
    dataset_access_model(
      dataset_id: $dataset_id
      anonymous_users: $anonymous_users
    ) {
      id
      title
      description
      payment_type
      payment
      resource_formats
      usage
      policy {
        id
        title
        remote_url
        file
      }
      payment_type
      payment
      agreements {
        id
        accepted_agreement
      }
      data_access_model {
        id
        title
        type
        description
        issued
        modified
        contract
        validation
        validation_unit
        status
        license {
          id
          title
          short_name
        }

        subscription_quota
        subscription_quota_unit
        rate_limit
        rate_limit_unit
      }

      datasetaccessmodelrequest_set {
        id
        user
        status
        description
        remark
        purpose
        issued
        validity
        is_valid
        modified
        remaining_quota
        datarequest_set {
          id
          status
          reject_reason
          resource {
            id
          }
        }
      }

      datasetaccessmodelresource_set {
        id
        supported_formats
        resource {
          id
          title
          description
          api_details {
            response_type
            url_path
            request_type
            auth_required
            api_source {
              id
              title
              description
              base_url
            }
            parameters {
              id
              key
              format
              description
              default
              type
              download_api_options_same
              options
              download_options
            }
            supported_formats
            download_formats
            format_loc
            default_format
            format_key
            download_same_as_api
          }
          file_details {
            format
          }
        }
        fields {
          id
          key
        }
        sample_enabled
        sample_rows
      }
    }
  }
`;

export const DATA_ACCESS_MODEL_REQUEST = gql`
  mutation DataAccessModelRequest(
    $data_access_model_request: DataAccessModelRequestInput!
  ) {
    data_access_model_request(
      data_access_model_request: $data_access_model_request
    ) {
      success
      errors
      data_access_model_request {
        id
        user
        status
        description
        remark
        purpose
        issued
        modified
      }
    }
  }
`;

export const DATA_REQUEST = gql`
  mutation DataRequest($data_request: DataRequestInput!) {
    data_request(data_request: $data_request) {
      success
      errors
      data_request {
        id
        status
        resource {
          id
          title
        }
        file
        creation_date
        reject_reason
        dataset_access_model_request {
          id
        }
        user
      }
    }
  }
`;

export const DATA_ACCESS_MODEL_REQUESTS = gql`
  query GetDataAccessModelRequests {
    data_access_model_request_user {
      id
      access_model {
        id
        title
        resource_formats
        usage
        agreements {
          id
          accepted_agreement
        }
        data_access_model {
          id
          title
          type
          description
          issued
          modified
          contract
          license {
            id
            title
          }
          subscription_quota
          subscription_quota_unit
          rate_limit
          rate_limit_unit
        }

        datasetaccessmodelrequest_set {
          id
          user
          status
          description
          remark
          purpose
          issued
          modified
          datarequest_set {
            id
            status
            resource {
              id
            }
          }
        }

        datasetaccessmodelresource_set {
          id
          resource {
            id
            title
            description
            api_details {
              response_type
            }
            file_details {
              format
            }
          }
          fields {
            id
            key
          }
        }

        dataset {
          id
          title
          dataset_type
          description
          slug
          catalog {
            organization {
              title
            }
          }
        }
      }
      user
      status
      description
      remark
      purpose
      issued
      modified
      datarequest_set {
        id
        status
        file
        creation_date
        reject_reason
        user
        resource {
          id
        }
      }
    }
  }
`;

export const ALL_PUBLISHED_LICENSES = gql`
  query getAllPublishedLicenses {
    licenses {
      id
      title
      description
      issued
      modified
      remote_url
      file
      status
      additions {
        id
        title
        description
        generic_item
        issued
        modified
      }
    }
  }
`;

export const LICENSES_BY_ORG = gql`
  query LicensesByOrg {
    license_by_org {
      id
      title
      description
      issued
      modified
      remote_url
      file
      reject_reason
      status
      short_name
      licenseaddition_set {
        id
        title
        description
      }
    }
  }
`;

export const FETCH_LICENSE_BY_ID = gql`
  query GetLicenseById($license_id: Int) {
    license(license_id: $license_id) {
      id
      title
      description
      issued
      modified
      remote_url
      file
      short_name
      status
      licenseaddition_set {
        id
        title
        description
      }
    }
  }
`;

export const POLICY_BY_ORG = gql`
  query PolicyByOrg {
    policy_by_org {
      id
      title
      description
      issued
      modified
      remote_url
      file
      status
      reject_reason
    }
  }
`;

export const ALL_PUBLISHED_POLICY = gql`
  query getAllPublishedPolicies {
    approved_policy {
      id
      title
      description
      issued
      modified
      remote_url
      file
      status
    }
  }
`;

export const LICENSE_ADDITIONS = gql`
  query LicenseAdditions {
    all_license_additions {
      id
      title
      description
      issued
      modified
      generic_item
      reject_reason
      status
      license {
        id
        title
      }
      dataaccessmodel_set {
        id
        title
      }
    }
  }
`;

export const CREATE_LICENSE = gql`
  mutation CreateLicense($license_data: LicenseInput!) {
    create_license(license_data: $license_data) {
      success
      errors
      license {
        id
        title
        description
        issued
        modified
        remote_url
        file
        status
        licenseaddition_set {
          id
          title
          description
          issued
          modified
        }
        additions {
          id
          title
          description
        }
      }
    }
  }
`;

export const UPDATE_LICENSE = gql`
  mutation CreateLicense($license_data: LicenseInput!) {
    update_license(license_data: $license_data) {
      success
      errors
      license {
        id
        title
        description
        issued
        modified
        remote_url
        file
        status
      }
    }
  }
`;

export const CREATE_POLICY = gql`
  mutation CreatePolicy($policy_data: PolicyInput!) {
    create_policy(policy_data: $policy_data) {
      success
      errors
      policy {
        id
        title
        description
        issued
        modified
        remote_url
        file
        status
        reject_reason
      }
    }
  }
`;

export const UPDATE_POLICY = gql`
  mutation UpdatePolicy($policy_data: PolicyInput!) {
    update_policy(policy_data: $policy_data) {
      success
      errors
      policy {
        id
        title
        description
        issued
        modified
        remote_url
        file
        status
        reject_reason
      }
    }
  }
`;

export const CREATE_LICENSE_ADDITION = gql`
  mutation CreateLicenseAddition(
    $license_addition_data: LicenseAdditionsCreateInput!
  ) {
    create_license_addition(license_addition_data: $license_addition_data) {
      success
      errors
      license {
        id
        title
        description
        issued
        modified
        generic_item
        license {
          id
        }
        status
        dataaccessmodel_set {
          id
          title
        }
      }
    }
  }
`;

export const ORG_DATA_ACCESS_MODELS = gql`
  query orgDataAccessModels($organization_id: ID!) {
    org_data_access_models(organization_id: $organization_id) {
      id
      title
      type
      description
      issued
      modified
      contract
      status
      license {
        id
        title
        remote_url
        file
      }

      subscription_quota
      subscription_quota_unit
      rate_limit
      rate_limit_unit
      active_users
      validation
      validation_unit
      is_global
    }
  }
`;

export const DATA_ACCESS_MODEL = gql`
  query dataAccessModel($data_access_model_id: ID!) {
    data_access_model(data_access_model_id: $data_access_model_id) {
      id
      title
      type
      description
      issued
      modified
      contract
      subscription_quota
      subscription_quota_unit
      validation_unit
      validation
      rate_limit
      rate_limit_unit
      active_users
      license {
        id
        title
        description
      }

      license_additions {
        id
        title
        description
        generic_item
        issued
        modified
      }
    }
  }
`;

export const UPDATE_DATA_ACCESS_MODEL = gql`
  mutation UpdateDAM($data_access_model_data: DataAccessModelInput!) {
    update_data_access_model(data_access_model_data: $data_access_model_data) {
      success
      errors
    }
  }
`;

export const DELETE_DATA_ACCESS_MODEL = gql`
  mutation DeleteDAM($id: ID!) {
    delete_data_access_model(data_access_model_data: { id: $id }) {
      success
    }
  }
`;

export const ACCESS_MODEL_RESOURCE = gql`
  mutation AccessModelResource(
    $access_model_resource_data: AccessModelResourceInput!
  ) {
    access_model_resource(
      access_model_resource_data: $access_model_resource_data
    ) {
      success
      errors
    }
  }
`;

export const ORGANIZATION_REQUEST = gql`
  mutation organization_request(
    $organization_request: OrganizationRequestInput!
  ) {
    organization_request(organization_request: $organization_request) {
      success
      errors
    }
  }
`;

export const CREATE_ORGANIZATION = gql`
  mutation create_organization($organization_data: OrganizationInput!) {
    create_organization(organization_data: $organization_data) {
      success
      errors
    }
  }
`;

export const USER_ACTIVITY = gql`
  query userActivity(
    $user: String!
    $first: Int
    $skip: Int
    $filters: [ActivityFilter]
    $search_query: String
  ) {
    user_activity(
      user: $user
      first: $first
      skip: $skip
      filters: $filters
      search_query: $search_query
    ) {
      id
      actor
      verb
      description
      target_object_id
      target_group_object_id
      action_object_object_id
      issued
      public
      passed_time
      dtf_passed_time
      target_type
      ip
    }
  }
`;

export const ORG_ACTIVITY = gql`
  query orgActivity(
    $organization_id: ID!
    $first: Int
    $skip: Int
    $filters: [ActivityFilter]
    $search_query: String
  ) {
    org_activity(
      organization_id: $organization_id
      first: $first
      skip: $skip
      filters: $filters
      search_query: $search_query
    ) {
      id
      actor
      verb
      description
      target_object_id
      target_group_object_id
      action_object_object_id
      issued
      public
      passed_time
      target_type
      ip
    }
  }
`;

export const ORG_DATASETS_LIST = gql`
  query org_datasets($status: DatasetStatus) {
    org_datasets(status: $status) {
      id
      title
      description
      source
      issued
      remote_issued
      remote_modified
      period_from
      period_to
      update_frequency
      modified
      status
      funnel
      action
      dataset_type
    }
  }
`;

export const GET_ORGANIZATION_REQUESTS = gql`
  query GetAllOrganizationRequests {
    all_organization_requests {
      id
      user
      description
      organization {
        id
        title
        description
      }
      issued
      status
      modified
      remark
    }
  }
`;

export const RESPOND_TO_ORGANIZATION_REQUEST = gql`
  mutation ApproveRejectOrganizationRequest(
    $organization_request: OrganizationRequestUpdateInput
  ) {
    approve_reject_organization_request(
      organization_request: $organization_request
    ) {
      errors
      success
      organization_request {
        id
        remark
        user
        description
      }
    }
  }
`;

export const AGREEMENT_REQUEST = gql`
  mutation agreementRequest($agreement_request: AgreementInput) {
    agreement_request(agreement_request: $agreement_request) {
      success
      errors
      agreement {
        id
        status
        accepted_agreement
        username
      }
    }
  }
`;

export const GET_CONSUMERS_BY_ORGANIZATION_ID = gql`
  query GetConsumersByOrganizationId($org_id: Int) {
    data_access_model_request_org(org_id: $org_id) {
      access_model {
        title
        dataset {
          title
          version_name
          id
          slug
        }
        data_access_model {
          title
          type
          validation
          validation_unit
        }
      }
      description
      status
      purpose
      user
    }
  }
`;

export const RESPOND_TO_REVIEW_REQUEST = gql`
  mutation ApproveRejectReviewRequest(
    $review_request: ReviewRequestsApproveRejectInput
  ) {
    approve_reject_review_request(review_request: $review_request) {
      errors
      success
      review_requests {
        id
        reject_reason
        user
        status
        remark
        description
        creation_date
        dataset {
          id
        }
      }
    }
  }
`;

export const GET_REVIEW_REQUEST_USER = gql`
  query GetReviewRequestsByUser {
    review_request_user {
      id
      description
      creation_date
      modified_date
      reject_reason
      remark
      dataset {
        id
        title
        description
        dataset_type
        slug
        issued
        update_frequency
        accepted_agreement
      }
      status
      user
      request_type
      parent {
        id
        user
      }
      parent_field {
        id
        description
        creation_date
        modified_date
        status
        request_type
      }
    }
  }
`;

export const GET_ALL_REVIEW_REQUESTS = gql`
  query GetAllReviewRequests {
    all_review_requests {
      id
      remark
      dataset {
        id
      }
      status
      user
      request_type
    }
  }
`;

export const GET_SECTOR_BY_TITLE = gql`
  query GetSectorDetailsByTitle($sector_title: String) {
    sector_by_title(sector_title: $sector_title) {
      id
      name
      description
      organization_count
      dataset_count
      api_count
      highlights
      dam_count
    }
  }
`;

export const GET_DAM_BY_ID = gql`
  query GetDatasetAccessModelByID($id: ID) {
    dataset_access_model_by_id(dataset_access_model_id: $id) {
      id
      title
      description
      issued
      modified
      data_access_model {
        id
        title
      }
      policy {
        id
        title
      }
      payment_type
      payment
      datasetaccessmodelresource_set {
        id
        resource {
          id
          title
          schema {
            id
            key
          }
        }
        fields {
          id
          key
        }
        sample_enabled
        sample_rows
        parameters
      }
    }
  }
`;

export const DELETE_DAM_RESOURCE = gql`
  mutation DeleteDAMResource(
    $access_model_resource_data: DeleteAccessModelResourceInput
  ) {
    delete_access_model_resource(
      access_model_resource_data: $access_model_resource_data
    ) {
      errors
      success
    }
  }
`;

export const UPDATE_ACCESS_MODEL_RESOURCE = gql`
  mutation UpdateAccessModelResource(
    $access_model_resource_data: AccessModelResourceInput!
  ) {
    update_access_model_resource(
      access_model_resource_data: $access_model_resource_data
    ) {
      success
      errors
    }
  }
`;

export const DISABLE_DATA_ACCESS_MODEL = gql`
  mutation DisableDAM($id: ID!) {
    disable_data_access_model(data_access_model_data: { id: $id }) {
      success
      errors
    }
  }
`;

export const OPEN_DATA_REQUEST = gql`
  mutation OpenDataRequest($data_request: OpenDataRequestInput) {
    open_data_request(data_request: $data_request) {
      success
      errors
      data_request {
        id
        status
        file
        creation_date
        reject_reason
        user
        remaining_quota
      }
    }
  }
`;

export const GET_USER_DATASET_SUBSCRIPTION = gql`
  query GetUserDatasetSubscription($dataset_id: Int) {
    user_dataset_subscription(dataset_id: $dataset_id) {
      id
      user
      dataset {
        id
      }
    }
  }
`;

export const SUB_UNSUB_DATASET = gql`
  mutation SetSubsscribeUnsubscribe($subscribe_input: SubscribeInput!) {
    subscribe_mutation(subscribe_input: $subscribe_input) {
      success
      errors
    }
  }
`;

export const GET_ORGANIZATION_JOIN_REQUESTS_BY_USER = gql`
  query GetOrganizationsJoinReqsByUser {
    organization_request_user {
      organization {
        id
        title
      }
      modified
      remark
      status
    }
  }
`;

export const GET_ORGANIZATION_CREATE_REQUESTS_BY_USER = gql`
  query GetOrganizationsCreateReqsByUser {
    organizations_by_user {
      id
      title
      modified
      organizationcreaterequest {
        status
        remark
      }
    }
  }
`;

export const GET_DISTRIBUTION_SPEC = gql`
  query GetDistributionSpec(
    $resource_id: ID!
    $dataset_access_model_request_id: ID
    $dataset_access_model_resource_id: ID!
  ) {
    data_spec(
      resource_id: $resource_id
      dataset_access_model_request_id: $dataset_access_model_request_id
      dataset_access_model_resource_id: $dataset_access_model_resource_id
    )
  }
`;

export const ADDRESS_MODERATION_REQ = gql`
  mutation AddressModerationRequest(
    $moderation_request: ModerationRequestsApproveRejectInput!
  ) {
    address_moderation_requests(moderation_request: $moderation_request) {
      success
      errors
    }
  }
`;

export const NEW_VERSION_DATASET_ID_REQUEST = gql`
  mutation GetNewVersionDatasetID($dataset_data: EditDatasetInput) {
    edit_dataset(dataset_data: $dataset_data) {
      success
      errors
      dataset_id
    }
  }
`;

export const ADD_ORG_PROVIDER = gql`
  mutation AddOrgProvider($organization_request: OrganizationRequestInput) {
    organization_request(organization_request: $organization_request) {
      success
      errors
    }
  }
`;

export const ORGANIZATION_WITHOUT_DPA = gql`
  query OrganisationWithoutDpa($organization_id: Int) {
    organization_without_dpa(organization_id: $organization_id) {
      id
      title
    }
  }
`;

export const GET_ORG_DETAILS_BY_DATASET_ID = gql`
  query GetOrgDetailsByDatasetID($dataset_id: Int) {
    dataset(dataset_id: $dataset_id) {
      catalog {
        organization {
          id
        }
      }
    }
  }
`;

export const CREATE_EXTERNAL_ACCESS_MODEL = gql`
  mutation CreateExternalAccessModel(
    $external_access_model_data: ExternalAccessModelInput!
  ) {
    create_external_access_model(
      external_access_model_data: $external_access_model_data
    ) {
      success
      errors
      external_access_model {
        id
      }
    }
  }
`;

export const GET_EXTRENAL_ACCESS_MODEL_BY_ID = gql`
  query GetExtrenalAccessModelById($dataset_id: ID) {
    external_access_model_by_dataset(dataset_id: $dataset_id) {
      id
      policy {
        id
        title
      }
      license {
        id
        title
      }
    }
  }
`;
