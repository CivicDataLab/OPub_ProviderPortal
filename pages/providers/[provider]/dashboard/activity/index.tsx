import { useQuery } from '@apollo/client';
import { Loader } from 'components/common';
import ActivityListing from 'components/pages/shared/ActivityListing';
import React, { useState } from 'react';
import { ORG_ACTIVITY } from 'services';
import { useProviderStore } from 'services/store';
import { scrollTo } from 'utils/helper';
import useEffectOnChange from 'utils/hooks';

export default function OrgActivity() {
  const org = useProviderStore((e) => e.org);
  const [searchquery, setSearchQuery] = useState('');

  const [alter, setAlter] = React.useState({
    first: 10,
    page: 1,
    skip: 0,
    filters: [],
    final: false,
  });

  const { loading, data, refetch } = useQuery(ORG_ACTIVITY, {
    variables: {
      organization_id: org?.org_id,
      first: alter.first,
      skip: alter.skip,
      filters: alter.filters,
      search_query: searchquery,
    },
    skip: !org?.org_id,
  });

  useEffectOnChange(() => {
    refetch;
  }, [searchquery]);

  useEffectOnChange(() => {
    // scroll to top
    scrollTo('__next', 0);
    if (!loading) {
      // TODO hadle for last 10 results
      if (data?.org_activity.length < 10 || data?.org_activity.length === 0) {
        setAlter({
          ...alter,
          final: true,
        });
      } else {
        setAlter({
          ...alter,
          final: false,
        });
      }
    }
  }, [data]);

  return org?.org_id && data?.org_activity ? (
    <ActivityListing
      list={data?.org_activity}
      name={org.org_title}
      loading={loading}
      alter={alter}
      setAlter={setAlter}
      searchquery={searchquery}
      setSearchQuery={setSearchQuery}
    />
  ) : (
    <Loader />
  );
}
