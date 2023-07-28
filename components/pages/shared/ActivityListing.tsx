import { CrossSize200 } from '@opub-icons/ui';
import { Button } from 'components/actions';
import { SearchField } from 'components/form';
import {
  Box,
  DashboardHeader,
  Heading,
  NoResult,
  Text,
} from 'components/layouts';
import { Flex } from 'components/layouts/FlexWrapper';
import { Link } from 'components/layouts/Link';
import { MainWrapper } from 'components/pages/user/Layout';
import Head from 'next/head';
import styled from 'styled-components';
import { getRandomColor, truncate } from 'utils/helper';
import { platform_name } from 'platform-constants';

const link = {
  dataset: '/datasets/',
};

export default function ActivityListing({
  list,
  loading,
  name,
  alter,
  setAlter,
  setSearchQuery,
  searchquery,
}) {
  function handlePaginate(val) {
    const skip = alter.skip + val * 10;
    const first = alter.first + val * 10;
    const page = alter.page + val;

    if (skip >= 0 && first >= 10 && page > 0) {
      const newAlter = {
        ...alter,
        skip: alter.skip + val * 10,
        first: alter.first + val * 10,
        page,
        final: false,
      };
      setAlter(newAlter);
    }
  }

  function handleFilters(val) {
    if (
      !alter.filters.find((e) => e.type === val.type && e.value === val.value)
    ) {
      const filters = [...alter.filters, val];
      const newAlter = {
        ...alter,
        filters,
      };
      setAlter(newAlter);
    }
  }

  function removeFilter(val) {
    const filters = [...alter.filters].filter(
      (e) => e.type !== val.type && e.value !== val.value
    );
    const newAlter = {
      ...alter,
      filters,
    };
    setAlter(newAlter);
  }

  function handleclear() {
    setSearchQuery('');
  }
  return (
    <MainWrapper fullWidth>
      <Head>
        <title>Activity Log | {platform_name} (IDP)</title>
      </Head>

      <DashboardHeader>
        <Heading
          id="activity-page"
          as={'h1'}
          variant="h3"
          paddingBottom={'24px !important'}
        >
          Activity Log
        </Heading>
      </DashboardHeader>
      <FiltersWrapper>
        <BadgeWrapper>
          {alter.filters.map((e) => (
            <li key={e.type + e.value}>
              <Button
                kind="custom"
                size="sm"
                onPress={() => removeFilter({ type: e.type, value: e.value })}
              >
                <span>{e.type}:</span> <span>{e.value}</span>
                <CrossSize200 />
              </Button>
            </li>
          ))}
        </BadgeWrapper>
        <SearchField
          placeholder="Search Activity log"
          aria-label="Search Activity log"
          showBtnLabel={true}
          onClear={handleclear}
          defaultValue={searchquery}
          onSubmit={(e) => {
            setSearchQuery(e);
          }}
        />
      </FiltersWrapper>
      {list && list?.length > 0 ? (
        <>
          <Box>
            <ListHead>
              <Heading variant="h4" as="h2">
                Recent Events
              </Heading>
            </ListHead>
            <ListWrapper>
              {loading ? (
                <>Loading...</>
              ) : (
                <ul>
                  {list.map((item) => (
                    <ListItem
                      handleFilters={handleFilters}
                      id={`activity-${item.id}`}
                      key={item.id}
                      data={item}
                    />
                  ))}
                </ul>
              )}
            </ListWrapper>
          </Box>
          <LoadMore>
            <Button
              onPress={() => {
                handlePaginate(-1);
              }}
              isDisabled={alter.page === 1}
              kind="custom"
              size="sm"
            >
              Newer
            </Button>
            <Button
              onPress={() => {
                handlePaginate(1);
              }}
              isDisabled={alter.final}
              size="sm"
              kind="custom"
            >
              Older
            </Button>
          </LoadMore>
        </>
      ) : (
        <NoResult label={`No Activity for ${name}`} />
      )}
    </MainWrapper>
  );
}

const FiltersWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  gap: 10px;
  @media screen and (max-width: 600px) {
    flex-wrap: wrap;
  }
`;

const BadgeWrapper = styled.ul`
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;

  button {
    padding: 8px 12px;
    border-radius: 16px;
    background-color: var(--color-primary-06);

    font-size: 0.75rem;
    font-weight: 700;

    &:hover {
      background-color: var(--color-primary-05);
    }

    > span:first-of-type {
      margin-right: 4px;
    }

    svg {
      margin-left: 6px;
      margin-bottom: -1px;
    }
  }
`;

const ListHead = styled.div`
  padding: 16px;
  background-color: var(--color-canvas-subtle);
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
`;

const ListWrapper = styled.div`
  overflow-x: auto;
  width: 100%;

  @media screen and (max-width: 640px) {
    max-width: calc(100vw - 52px);
  }

  /* min-height: 1052px; */
`;

const LoadMore = styled.div`
  margin-top: 16px;

  display: flex;
  gap: 12px;
  justify-content: center;

  > button {
    justify-content: center;
    font-size: 1rem;
    padding: 6px 12px;
    border: 1px solid transparent;
    border-radius: 4px;

    &:hover {
      border-color: var(--color-gray-03);
    }

    &.is-disabled {
      border-color: transparent;
      background-color: transparent !important;
      color: var(--text-light) !important;
      pointer-events: none;
    }
  }
`;

const ListItem = ({ data, id, handleFilters }) => {
  const { character, color } = getRandomColor(data.actor);

  return (
    <ListItemWrapper id={id} tabIndex={0}>
      <Avatar style={{ backgroundColor: color }}>{character}</Avatar>

      <div>
        <Flex alignItems="center" gap="8px">
          <Button
            kind="custom"
            onPress={() => handleFilters({ type: 'actor', value: data.actor })}
          >
            {data.actor}
          </Button>
          {' - '}
          <Button
            kind="custom"
            onPress={() => handleFilters({ type: 'verb', value: data.verb })}
          >
            {data.verb?.toLowerCase() || ''}
          </Button>
        </Flex>
        <div>
          <Text mr="3px" variant="pt14">
            {data.verb} {data.target_object_id ? `the ${data.target_type}` : ''}
          </Text>
          {data.target_object_id && (
            <Link
              href={link.dataset + data.target_object_id}
              underline="hover"
              variant="pt14"
            >
              #{truncate(data.target_object_id, 50)}
            </Link>
          )}
        </div>
        <Meta>
          {data.ip ? (
            <>
              <Button
                onPress={() => handleFilters({ type: 'ip', value: data.ip })}
                kind="custom"
              >
                {data.ip}
              </Button>
              <Separator />
            </>
          ) : null}

          <>
            <Text variant="pt14">{data.dtf_passed_time}</Text>
            <Separator />
          </>

          <Text variant="pt14">{data.passed_time} ago</Text>
        </Meta>
      </div>
    </ListItemWrapper>
  );
};

const ListItemWrapper = styled.li`
  background-color: var(--color-white);
  padding: 16px;
  border-top: 1px solid var(--border-default);
  display: inline-flex;
  gap: 16px;
  align-items: center;
  width: 100%;
  outline: none;

  > div:last-of-type {
    display: flex;
    flex-direction: column;
  }

  > img {
    border-radius: 50%;
  }

  &:last-of-type {
    border-bottom-left-radius: 6px;
    border-bottom-right-radius: 6px;
  }

  a,
  button {
    width: fit-content;
  }

  button {
    color: var(--color-link);

    &:hover {
      text-decoration: underline;
    }
  }
`;

const Avatar = styled.span`
  border-radius: 50%;
  width: 45px;
  height: 45px;
  min-width: 45px;
  min-height: 45px;

  display: inline-flex;
  align-content: center;
  justify-content: center;
  font-size: 1.8rem;
`;

const Meta = styled.div`
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;

  button {
    font-size: 0.875rem;
  }
`;

const Separator = styled.span`
  display: inline-block;
  background-color: var(--color-gray-02);
  width: 2px;
  height: 16px;
  margin-inline: 8px;
`;
