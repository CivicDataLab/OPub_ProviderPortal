import { omit } from './helper';

// TODO: Convert pipeline URLs to env variables
export const fetchTransformersList = async () => {
  const response = await fetch(
    `${process.env.INTERNAL_TRANSFORMATION_URL}/transformer/trans_list`
  );
  const data = await response.json();
  return data;
};

export const fetchApiTransformersList = async () => {
  const response = await fetch(
    `${process.env.INTERNAL_TRANSFORMATION_URL}/transformer/api_transformer_list`
  );
  const data = await response.json();
  return data;
};

export const fetchUserCount = async () => {
  const response = await fetch(`${process.env.AUTH_URL}/users/get_user_count`);
  const data = await response.json();
  return data;
};

export const fetchpipelineList = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_TRANSFORMATION_URL}/transformer/pipe_list`
  );
  const data = await response.json();
  return data;
};

export const fetchresetToken = async (id, session, org_id) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/resettoken/${id}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization:
          session && session['access']?.token ? session['access'].token : '',
        organization: org_id,
      },
    }
  );
  const data = await response.json();
  return data;
};

export const fetchpaymenturl = async (requestId, session, org_id) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_PAYMENT_URL}/${requestId}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization:
          session && session['access']?.token ? session['access'].token : '',
        organization: org_id,
      },
    }
  );

  const data = await response.json();
  return data;
};

export const fetchresourcedata = async (datasetId, session, org_id) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_TRANSFORMATION_URL}/transformer/pipeline_filter?datasetId=${datasetId}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization:
          session && session['access']?.token ? session['access'].token : '',
        organization: org_id,
      },
    }
  );
  const data = await response.json();
  return data;
};

export const deleteAPItransformation = async (
  transformationID,
  session,
  org_id
) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_TRANSFORMATION_URL}/transformer/delete_api_res_transform`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization:
          session && session['access']?.token ? session['access'].token : '',
        organization: org_id,
      },
      body: JSON.stringify({ pipeline_id: transformationID }),
    }
  );
  const data = await response.json();
  return data;
};

export const fetchapischema = async (resourceId, session, org_id) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api_schema/${resourceId}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization:
          session && session['access']?.token ? session['access'].token : '',
        organization: org_id,
      },
    }
  );
  const data = await response.json();
  return data;
};

export const fetchpreview = async (
  isChecked,
  rowsValue,
  fields,
  parameters,
  session,
  org_id
) => {
  let paramString = '';
  if (parameters) {
    paramString = parameters
      .map((item) => {
        if (item) return item.key + '=' + item.value;
      })
      .join('&');
  }
  const response = await fetch(
    parameters
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/data_preview?resource_id=${isChecked}&fields=${fields}&` +
          paramString
      : `${process.env.NEXT_PUBLIC_BACKEND_URL}/data_preview?resource_id=${isChecked}&row_count=${rowsValue}&fields=${fields}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization:
          session && session['access']?.token ? session['access'].token : '',
        organization: org_id,
      },
    }
  );
  const data = await response.text();

  return JSON.parse(data.replace(/\bNaN\b/g, 'null'));
};

export const fetchDamResourcePreview = async (dam_id, session, org_id) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/data_preview?dam_id=${dam_id}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization:
          session && session['access']?.token ? session['access'].token : '',
        organization: org_id,
      },
    }
  );
  const data = await response.text();

  return JSON.parse(data.replace(/\bNaN\b/g, 'null'));
};

export const fetchapipreview = async (resourceId, session, org_id) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api_preview/${resourceId}/`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        authorization:
          session && session['access']?.token ? session['access'].token : '',
        organization: org_id,
      },
    }
  );
  const data = await response.text();

  return JSON.parse(data.replace(/\bNaN\b/g, 'null'));
};

export const fetchDatasets = async (variables) => {
  // * Creating a string of parameter from object of variables for elasticSearch use
  const varArray = Object.keys(variables).map((key) => {
    return `${key}=${variables[key]}`;
  });

  let varString = varArray.length > 0 ? varArray.join('&') : ``;
  varString = varString.replace('fq=', '');
  const urlToFetch = `${process.env.BACKEND_URL}/facets?${varString}`;

  const response = await fetch(urlToFetch);
  const data = await response.json();
  return data;
};

export const fetchFeaturedDatasets = async () => {
  const numberOfFeatured = 6;

  const response = await fetch(
    `${process.env.BACKEND_URL}/facets/?q=&size=${numberOfFeatured}&from=0&sort_by=downloads`
  );

  const featuredData = await response.json();

  return featuredData;
};

export const fetchPartnersDatasets = async () => {
  const response = await fetch(
    `${process.env.BACKEND_URL}/search/organizations?sort=trends&size=10`
  );

  const PartnersData = await response.json();

  return PartnersData;
};

export const featchPopularSearches = async () => {
  const response = await fetch(`${process.env.STRAPI_URL}/popular-searches`);

  const popularSearchesRes = await response.json();

  return popularSearchesRes.map((item) => {
    return item.search_text;
  });
};

export async function fetchFilters(variable, org = null) {
  try {
    const varArray = Object.keys(variable).map((key) => {
      return `${key}=${variable[key]}`;
    });
    // adds org id to var arra
    if (org) varArray.push(`organization=${org}`);
    let varString = varArray.length > 0 ? varArray.join('&') : ``;
    varString = varString.replace('fq=', '');
    // * If filters and search found in url, also use those

    const response = await fetch(
      varString
        ? `${process.env.BACKEND_URL}/facets/?${varString}`
        : `${process.env.BACKEND_URL}/facets/?`
    ).then((res) => {
      return res.json();
    });

    return response;
  } catch (error) {
    throw new Error(error);
  }
}

export async function fetchProviders(query = '', size = '6', from = '0') {
  try {
    const response = await fetch(
      `${process.env.BACKEND_URL}/search/organizations?q=${query}&size=${size}&from=${from}`
    ).then((res) => {
      return res.json();
    });
    return response;
  } catch (error) {
    throw new Error(error);
  }
}

export function convertToSearchQuery(query) {
  const elasticQuery = {
    q: query.q || '',
    fq: query.fq || '',
    sort_by: query.sort_by || 'recent',
    sort: query.sort || '',
    size: query.size,
    from: query.from || 0,
    start_duration: query.start_duration || '',
    end_duration: query.end_duration || '',
  };

  const finalQuery: any =
    query.size == undefined ? omit(elasticQuery, ['size']) : elasticQuery;

  // * This is to format the facets query that would be accepted by elastic search
  if (query.fq) {
    finalQuery.fq = finalQuery.fq.replaceAll('&', '%26');

    if (query.fq.includes(' QU5E ')) {
      finalQuery.fq = finalQuery.fq.replaceAll(' QU5E ', '&'); // reverting base64 of AND to symbol for query
    }
    if (query.fq.includes(' T1I= ')) {
      finalQuery.fq = finalQuery.fq.replaceAll(' T1I= ', '||');
    }
  }

  return finalQuery;
}

// Authorization API check
export const fetchUserData = async (token) => {
  return new Promise<any>(async (resolve, reject) => {
    try {
      const fetchUserDataRes = await fetch(
        `${process.env.NEXT_PUBLIC_AUTH_URL}/users/check_user`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            access_token: token,
          }),
        }
      );
      resolve(fetchUserDataRes.json());
    } catch (err) {
      reject(err);
    }
  });
};

// Get Providers under the Organization and child organisations
export const fetchProvidersDataUnderOrg = async (token, orgID) => {
  return new Promise<any>(async (resolve, reject) => {
    try {
      const fetchProvidersFromOrg = await fetch(
        `${process.env.NEXT_PUBLIC_AUTH_URL}/users/get_org_providers`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            access_token: token,
            org_id: orgID,
          }),
        }
      );
      resolve(fetchProvidersFromOrg.json());
    } catch (err) {
      reject(err);
    }
  });
};

// Change user role in the Organization
export const updateUserRoleFunc = async (updateUserObj) => {
  return new Promise<any>(async (resolve, reject) => {
    try {
      const fetchProvidersFromOrg = await fetch(
        `${process.env.NEXT_PUBLIC_AUTH_URL}/users/update_user_role`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...updateUserObj,
          }),
        }
      );
      resolve(fetchProvidersFromOrg.json());
    } catch (err) {
      reject(err);
    }
  });
};

export const subscribeForUpdates = async (email, session, org_id) => {
  return new Promise<any>(async (resolve, reject) => {
    try {
      const sendEmailForSubscription = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/subscribe`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            authorization:
              session && session['access']?.token
                ? session['access'].token
                : '',
            organization: org_id,
          },
          body: JSON.stringify({
            email: email,
          }),
        }
      );
      resolve(sendEmailForSubscription.json());
    } catch (err) {
      reject(err);
    }
  });
};

export const sendEmailToConsumers = async (emailFormData) => {
  return new Promise<any>(async (resolve, reject) => {
    try {
      const sendEmailReq = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/contact_consumer`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            authorization: emailFormData.token,
            organization: emailFormData.organization,
          },
          body: JSON.stringify({
            ...emailFormData.formData,
          }),
        }
      );
      resolve(sendEmailReq.json());
    } catch (err) {
      reject(err);
    }
  });
};

export const logSignInSignOutActivity = async (token, action) => {
  return new Promise<any>(async (resolve, reject) => {
    try {
      const logActivity = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/activity/${action}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            authorization: token,
          },
        }
      );
      resolve(logActivity.json());
    } catch (error) {
      reject(error);
    }
  });
};

export const fetchUserInfo = async (name, session) => {
  return new Promise<any>(async (resolve, reject) => {
    try {
      const fetchUserInfoRes = await fetch(
        `${process.env.NEXT_PUBLIC_AUTH_URL}/users/get_user_info`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            authorization:
              session && session['access']?.token
                ? session['access'].token
                : '',
          },
          body: JSON.stringify({
            user_name: name,
          }),
        }
      );
      resolve(fetchUserInfoRes.json());
    } catch (err) {
      reject(err);
    }
  });
};
