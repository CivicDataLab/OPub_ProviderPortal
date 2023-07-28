import { Add, Remove } from '@opub-icons/workflow';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
} from '@radix-ui/react-accordion';
import {
  Checkbox,
  CheckboxGroup,
  DatePicker,
  SearchField,
} from 'components/form';
import { Heading, Text } from 'components/layouts';
import { Flex } from 'components/layouts/FlexWrapper';
import { Link } from 'components/layouts/Link';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import {
  capitalize,
  convertDateFormatWithoutTimezone,
  debounce,
} from 'utils/helper';
import { filterChange } from './filter.helper';
import { FilterComp, FilterContent, FilterHeading } from './FilterComp';

const filterSearch = {};

const simplifyNames = {
  organization: 'Data Providers',
  sector: 'sectors',
  geography: 'geographies',
  format: 'File Types',
  duration: 'Data Duration',
  type: 'Access Types',
  org_types: 'Data provider types',
  payment_type: 'Payment Type',
  license: 'Licence',
};

const Filter: React.FC<{
  data: any;
  newFilters: any;
  simpleNames?: any;
  selectedFacets: any;
  filterHeadingAs?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span' | 'p';
}> = ({ data, newFilters, selectedFacets, filterHeadingAs }) => {
  const router = useRouter();

  function getResetLink(path) {
    if (path.includes('/providers/'))
      return `/providers/${router.query.provider}`;

    if (path.includes('/sectors/')) return `/sectors/${router.query.sector}`;

    return '/datasets';
  }

  const orderedList = [
    'type',
    'org_types',

    data.organization && !router.pathname.includes('/providers/')
      ? 'organization'
      : null,
    'duration',
    !router.pathname.includes('/sectors/') ? 'sector' : null,
    'geography',
    'format',
    'license',
    process.env.NEXT_PUBLIC_ENABLE_PAYMENT === 'true' ? 'payment_type' : null,
  ];

  const [filterResult, setFilterResult] = useState({});
  const selected = React.useMemo(
    () => Object.assign({}, ...selectedFacets),
    [selectedFacets]
  );

  const { end_duration, start_duration } = selected;
  const maxDuration = data.duration.max.value_as_string || 2010;
  const minDuration = data.duration.min.value_as_string || 2000;

  const [duration, setDuration] = useState([
    start_duration || minDuration,
    end_duration || maxDuration,
  ]);
  const filterRef = useRef(null);
  useEffect(() => {
    const organization = data.organization?.all?.buckets;
    Object.keys(data).forEach((val) => {
      if (!['duration'].includes(val)) {
        filterSearch[val] = data[val].buckets || data[val].all.buckets;
        filterSearch[val].sort((a, b) => (a.count > b.count ? -1 : 1));
      }
    });
    if (organization) setFilterResult({ organization, ...filterSearch });
    else setFilterResult({ ...filterSearch });
  }, [data]);

  function handleFilterSearch(val: string, id: string) {
    const organization = data.organization.all.buckets;
    const searchFilter = data[id].buckets
      ? data[id].buckets.filter((item: any) =>
          JSON.stringify(item).toLowerCase().includes(val.toLowerCase())
        )
      : data[id].all.buckets.filter((item: any) =>
          JSON.stringify(item).toLowerCase().includes(val.toLowerCase())
        );
    filterSearch[id] = searchFilter;
    // TODO move each filter to it's own component
    setFilterResult({ organization, ...filterSearch });
  }

  const handleFilterChange = (category, selectedArr) => {
    const finalFilter = filterChange(category, selectedArr, selected);

    newFilters({
      query: 'fq',
      value: finalFilter,
    });
  };

  function handRangeFilterChange(e) {
    const startDurationObj = new Date(`Jan 1 , ${e[0]}`);
    const endDurationObj = new Date(`Jan 1 , ${e[1]}`);
    const startDuration = convertDateFormatWithoutTimezone(startDurationObj);
    const endDuration = convertDateFormatWithoutTimezone(endDurationObj);

    newFilters({
      query: 'start_duration',
      value: startDuration,
    });

    newFilters({
      query: 'end_duration',
      value: endDuration,
    });

    setDuration(e);
  }

  function handDateChange(e, type) {
    if (type === 'start' && !router.query?.end_duration) {
      newFilters({
        query: 'start_duration',
        value: e,
      });
      newFilters({
        query: 'end_duration',
        value: duration[1],
      });
    } else if (type === 'end' && !router.query?.start_duration) {
      newFilters({
        query: 'start_duration',
        value: duration[0],
      });
      newFilters({
        query: 'end_duration',
        value: e,
      });
    } else {
      newFilters({
        query: type === 'start' ? 'start_duration' : 'end_duration',
        value: e,
      });
    }
  }

  return (
    <FilterComp className="filters" ref={filterRef}>
      <Flex gap="24px" alignItems="center" justifyContent="space-between">
        <Heading variant="h5" as={filterHeadingAs ? filterHeadingAs : 'h3'}>
          Filters
        </Heading>

        <>
          <Link
            href={getResetLink(router.pathname)}
            underline="always"
            variant="pt14"
          >
            Reset
          </Link>
        </>
      </Flex>
      {orderedList.map((filter: any, index: number) => {
        const count = filterResult[filter]?.length;
        const initialCount =
          data[filter]?.buckets?.length || data[filter]?.all?.buckets?.length;
        return (
          <React.Fragment key={`filters-${index}`}>
            <Accordion
              type="multiple"
              defaultValue={['duration', ...Object.keys(selected)]}
            >
              {filter && (
                <AccordionItem value={filter}>
                  <FilterHeading>
                    <Text variant="pt14b">
                      {simplifyNames[filter] || filter}
                      {count?.toString() && ` (${count})`}
                    </Text>
                    <div>
                      <Add
                        fill="var(--color-gray-04)"
                        data-state="closed"
                        aria-hidden="true"
                      />
                      <Remove
                        fill="var(--color-gray-04)"
                        data-state="opened"
                        aria-hidden="true"
                      />
                    </div>
                  </FilterHeading>

                  <AccordionContent>
                    {filter === 'duration' ? (
                      <DurationContainer>
                        <DatePicker
                          onDateChange={(e) => handDateChange(e, 'start')}
                          label="From"
                          defaultVal={duration[0]}
                        />
                        <DatePicker
                          onDateChange={(e) => handDateChange(e, 'end')}
                          label="To"
                          defaultVal={duration[1]}
                        />

                        {/* <RangeSlider
                          label="Dataset Date"
                          maxValue={maxDuration}
                          minValue={minDuration}
                          defaultValue={duration}
                          onChangeEnd={(e) => handRangeFilterChange(e)}
                        /> */}
                      </DurationContainer>
                    ) : (
                      <>
                        <FilterContent>
                          {initialCount && initialCount > 4 ? (
                            <SearchField
                              onChange={(e) => handleFilterSearch(e, filter)}
                              aria-label={`Search for ${
                                simplifyNames[filter] || filter
                              }`}
                              placeholder={`Search ${
                                simplifyNames[filter].toLowerCase() || filter
                              }`}
                              size="sm"
                            />
                          ) : null}

                          <CheckboxGroup
                            onChange={debounce(
                              (e) => handleFilterChange(filter, e),
                              700
                            )}
                            data-type={filter}
                            defaultValue={selected[filter]}
                            key={selected[filter]}
                            aria-label={`checkbox for ${
                              simplifyNames[filter] || filter
                            }`}
                          >
                            {filterResult[filter] &&
                              filterResult[filter].map((item: any) => (
                                <Checkbox
                                  key={item.key}
                                  name={item.key}
                                  value={item.key}
                                  data-type={filter}
                                >
                                  {filter === 'format'
                                    ? `${item.key}`
                                    : `${capitalize(item.key)}`}
                                </Checkbox>
                              ))}
                          </CheckboxGroup>
                        </FilterContent>
                      </>
                    )}
                  </AccordionContent>
                </AccordionItem>
              )}
            </Accordion>
          </React.Fragment>
        );
      })}
    </FilterComp>
  );
};

export default Filter;

const DurationContainer = styled.div`
  display: flex;
  justify-content: space-around;
  gap: 10px;
  margin-top: 12px;
`;
