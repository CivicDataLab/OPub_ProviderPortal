import { Filter, SortOrderDown } from '@opub-icons/workflow';
import { Button, Modal } from 'components/actions';
import { Label } from 'components/form/BaseStyles';
import { Heading, Text } from 'components/layouts';
import { Flex } from 'components/layouts/FlexWrapper';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { tabbedInterface } from 'utils/explorer';
import useEffectOnChange from 'utils/hooks';
import {
  Fieldset,
  FilterAlter,
  Footer,
  Header,
  MobileAlterComp,
  Wrapper,
} from './MobileAlterComp';
import { capitalize } from 'utils/helper';

// TODO add duration filter

const objMobile = {};
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
};

const MobileAlter: React.FC<{
  data?: any;
  newData?: any;
  sortShow?: boolean;
  count;
  selectedFacets?: any;
  sortOptions: any;
}> = ({
  data,
  newData,
  sortShow = true,
  count,
  selectedFacets,
  sortOptions,
}) => {
  const displaySort = sortShow == false ? false : true;

  const router = useRouter();
  const [sortIsOpen, setSortIsOpen] = useState(false);
  const [filterIsOpen, setFilterIsOpen] = useState(false);
  const [currentSort, setCurrentSort] = useState<any>(sortOptions[0].value);
  const [selectedSort, setSelectedSort] = useState<any>(sortOptions[0].value);

  useEffect(() => {
    const sortBy = router.query.sort_by
      ? router.query.sort_by
      : sortOptions[0].value;
    const sortOrder = router.query.sort ? router.query.sort : '';
    setCurrentSort(sortOrder ? `${sortBy}_${sortOrder}` : sortBy);
  }, [router.query.sort_by, router.query.sort]);

  const orderedList = [
    'type',
    'org_types',

    data.organization ? 'organization' : null,
    // 'duration',
    'sector',
    'geography',
    'format',
    'payment_type',
  ];

  const [filterResult, setFilterResult] = useState({});
  const selected = React.useMemo(
    () => Object.assign({}, ...selectedFacets),
    [selectedFacets]
  );

  useEffect(() => {
    const organization = data.organization?.all?.buckets;

    Object.keys(data).forEach((val) => {
      if (!['duration', 'organization'].includes(val)) {
        filterSearch[val] = data[val].buckets || data[val].all.buckets;
        filterSearch[val].sort((a, b) => (a.count > b.count ? -1 : 1));
      }
    });

    if (organization) setFilterResult({ organization, ...filterSearch });
    else setFilterResult({ ...filterSearch });
  }, [data]);

  function checkInput(key, selected) {
    const filterElement = document.getElementById(
      `${selected}-${key}`
    ) as HTMLInputElement;
    if (filterElement) filterElement.checked = true;
  }

  useEffect(() => {
    setTimeout(() => {
      // create tabbed interface
      const tablist = document.getElementById('filterSelector');
      const panels = document.querySelectorAll(
        '#modalFilter [role="tabpanel"]'
      );
      if (tablist) tabbedInterface(tablist, panels);

      // Create filter object
      if (filterResult)
        Object.keys(filterResult).forEach((val) => {
          objMobile[val] = [];
        });

      // check previous selected filters
      Object.keys(selected).forEach((key) => {
        checkInput(key, selected[key]);
      });
    }, 50);
  }, [filterIsOpen, filterResult]);

  useEffect(() => {
    if (sortShow) {
      setTimeout(() => {
        if (document.querySelector('#modalSort')) {
          document
            .querySelector('#modalSort')
            .addEventListener('change', (e: any) => {
              setSelectedSort(e.target.value);
            });
        }

        const sortElm = sortOptions.find((e) => e.value === currentSort);
        if (sortElm) {
          const selectedSort = document.getElementById(
            sortElm.label
          ) as HTMLInputElement;

          if (selectedSort) {
            selectedSort.checked = true;
          }
        }
      }, 50);
    }
    return () => {
      if (document.querySelector('#modalSort'))
        document
          .querySelector('#modalSort')
          .addEventListener('change', (e: any) => {
            setSelectedSort(e.target.value);
          });
    };
  }, [sortIsOpen]);

  useEffectOnChange(() => {
    if (sortShow) {
      newData({
        query: 'sort',
        value: currentSort.split('_'),
      });
    }
  }, [currentSort]);

  function handleFilterClick() {
    setFilterIsOpen(!filterIsOpen);
  }

  function handleFilterClear() {
    // reset object
    if (data)
      Object.keys(data).forEach((val) => {
        objMobile[val] = [];
      });

    const selectedFilters = document.querySelectorAll(
      '#modalFilter input:checked'
    );

    selectedFilters.forEach((filter: HTMLInputElement) => {
      const filterElement = document.getElementById(
        `${filter.id}`
      ) as HTMLInputElement;
      if (filterElement) filterElement.checked = false;
    });
  }

  function applyFilterChange() {
    // select checked inputs
    const selectedFilters = document.querySelectorAll(
      '#modalFilter input:checked'
    );

    // reset object
    if (filterResult)
      Object.keys(filterResult).forEach((val) => {
        objMobile[val] = [];
      });

    // add checked filters to object
    selectedFilters.forEach((filter: HTMLInputElement) => {
      const type = filter.dataset.type;
      const value = filter.value;
      const index = objMobile[type].indexOf(value);
      if (index == -1) {
        objMobile[type].push(value);
      }
    });

    const final = [];
    Object.keys(objMobile).forEach((val) => {
      if (objMobile[val].length > 0) {
        let filter = '';

        filter = filter.concat(`${val}=`);
        const valArray = [];

        objMobile[val].forEach((item: string) => {
          valArray.push(`${item}`);
        });

        const valString = valArray.join(' OR ');
        filter = filter.concat(valString);
        final.push(filter);
      }
    });

    const finalFilter = final.join(' AND ');
    newData({
      query: 'fq',
      value: finalFilter,
    });

    handleFilterClick();
  }

  function handleSortClick() {
    setSortIsOpen(!sortIsOpen);
  }

  function applySortChange() {
    const current = sortOptions.filter((e) => e.value === selectedSort)[0];
    setCurrentSort(current.value);
    handleSortClick();
  }

  function cancelSortChange() {
    setSelectedSort(currentSort);
    handleSortClick();
  }

  function DataAlterFooter({ cancel, apply }) {
    return (
      <Footer>
        <Button kind="secondary-outline" size="sm" onPress={cancel} fluid>
          Close
        </Button>
        <Button kind="secondary" size="sm" onPress={apply} fluid>
          Apply
        </Button>
      </Footer>
    );
  }

  return (
    <MobileAlterComp>
      <div className="data-alter">
        <Flex flexDirection="column">
          <Flex alignItems="center" gap="4px">
            <Heading variant="h5l" as="span">
              Showing
            </Heading>
            <Heading variant="h5" as="span">
              {count} Datasets
            </Heading>
          </Flex>
          {selectedFacets.length > 0 && <Text variant="pt12b">(filtered)</Text>}
        </Flex>
        <div className="data-alter__buttons">
          <Button
            kind="primary-outline"
            onClick={handleFilterClick}
            icon={<Filter />}
            iconSide="left"
          >
            Add Filters
          </Button>
          <Button
            kind="primary-outline"
            onClick={handleFilterClick}
            icon={<Filter />}
            iconOnly={true}
            className="alter__small"
          >
            Add Filters
          </Button>
          {displaySort && (
            <>
              <Button
                kind="primary-outline"
                onClick={handleSortClick}
                icon={<SortOrderDown size={20} />}
                iconSide="left"
              >
                Sort Results
              </Button>
              <Button
                kind="primary-outline"
                onClick={handleSortClick}
                icon={<SortOrderDown size={20} />}
                iconOnly={true}
                className="alter__small"
              >
                Sort Results
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Sort Modal */}
      {displaySort && (
        <Modal
          isOpen={sortIsOpen}
          label="open sort modal"
          modalHandler={handleSortClick}
        >
          <Header>
            <h1 id="modal-head">Sort Datasets</h1>
          </Header>
          <Wrapper>
            <Fieldset id="modalSort">
              <legend className="sr-only">Sort Results</legend>
              {sortOptions.map((elm, index) => {
                return (
                  <Label key={`sort-${index}`} htmlFor={elm.label}>
                    <input
                      type="radio"
                      value={elm.value}
                      name="sort-group"
                      id={elm.label}
                    />
                    {elm.label}
                  </Label>
                );
              })}
            </Fieldset>
            <DataAlterFooter
              cancel={cancelSortChange}
              apply={applySortChange}
            />
          </Wrapper>
        </Modal>
      )}

      {/* Filter Modal */}
      <Modal
        isOpen={filterIsOpen}
        label="open filter modal"
        modalHandler={handleFilterClick}
      >
        <Header>
          <h1 id="modal-head">Add Filters</h1>
          <Button
            kind="custom"
            aria-label="Clear Selected Filters"
            onPress={handleFilterClear}
          >
            clear all
          </Button>
        </Header>
        <Wrapper>
          <Fieldset id="modalFilter">
            <legend className="sr-only">Add Filters</legend>
            {data && (
              <FilterAlter>
                <ul id="filterSelector" role="tablist">
                  {orderedList.map((filter: any, index: number) => (
                    <li role="presentation" key={`filterTitle-${index}`}>
                      <a
                        role="tab"
                        tabIndex={-1}
                        href={`#${filter}`}
                        data-id={filter}
                        id={`filterTab${index}`}
                      >
                        {simplifyNames[filter]}
                      </a>
                    </li>
                  ))}
                </ul>
                {orderedList.map((filter: any, index: number) => (
                  <div
                    key={`filter-${index}`}
                    id={filter}
                    role="tabpanel"
                    tabIndex={-1}
                    aria-labelledby={`filterTab${index}`}
                  >
                    {filterResult[filter]?.length ? (
                      filterResult[filter].map((item: any, index: number) => (
                        <label
                          key={`filterItem-${index}`}
                          htmlFor={`${item.key}-${filter}`}
                        >
                          <input
                            type="checkbox"
                            value={item.key}
                            name="sort-group"
                            id={`${item.key}-${filter}`}
                            data-type={filter}
                          />
                          {filter === 'format'
                            ? `${item.key}`
                            : `${capitalize(item.key)}`}
                        </label>
                      ))
                    ) : (
                      <>No Filter Available</>
                    )}
                  </div>
                ))}
              </FilterAlter>
            )}
          </Fieldset>
          <DataAlterFooter
            cancel={handleFilterClick}
            apply={applyFilterChange}
          />
        </Wrapper>
      </Modal>
    </MobileAlterComp>
  );
};

export default MobileAlter;
