import { useQuery } from '@apollo/client';
import { Loader } from 'components/common';
import { NoResult } from 'components/layouts';
import ActivityListing from 'components/pages/shared/ActivityListing';
import React, { useState } from 'react';
import { USER_ACTIVITY } from 'services';
import { useUserStore } from 'services/store';
import { scrollTo } from 'utils/helper';
import useEffectOnChange from 'utils/hooks';

function UserActivity() {
  const user = useUserStore((e) => e.user);
  const [searchquery, setSearchQuery] = useState('');

  const [alter, setAlter] = React.useState({
    first: 10,
    page: 1,
    skip: 0,
    filters: [],
    final: false,
  });

  const { data, loading, refetch } = useQuery(USER_ACTIVITY, {
    variables: {
      user: user.username,
      first: alter.first,
      skip: alter.skip,
      filters: alter.filters,
      search_query: searchquery,
    },
    skip: !user.username,
  });

  useEffectOnChange(() => {
    refetch;
  }, [searchquery]);

  useEffectOnChange(() => {
    // scroll to top
    scrollTo('__next', 0);
    if (!loading) {
      // TODO hadle for last 10 results
      if (
        data?.user_activity?.length < 10 ||
        data?.user_activity?.length === 0
      ) {
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

  return loading ? (
    <Loader />
  ) : data?.user_activity?.length > 0 ? (
    <ActivityListing
      list={data.user_activity}
      name={user.username}
      loading={loading}
      alter={alter}
      setAlter={setAlter}
      searchquery={searchquery}
      setSearchQuery={setSearchQuery}
    />
  ) : (
    <NoResult label={'No User Activity Found'} />
  );
}

export default UserActivity;
