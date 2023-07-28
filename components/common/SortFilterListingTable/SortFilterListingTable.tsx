import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Filter,
} from '@opub-icons/workflow';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import { Button } from 'components/actions';
import {
  Checkbox,
  Radio,
  RadioGroup,
  SearchField,
  Select,
  TextField,
} from 'components/form';
import { Heading, Text } from 'components/layouts';
import { Flex } from 'components/layouts/FlexWrapper';
import React from 'react';
import { useMemo, useState } from 'react';

import {
  useTable,
  useSortBy,
  useGlobalFilter,
  useAsyncDebounce,
  useExpanded,
  usePagination,
  useFilters,
} from 'react-table';
import styled, { keyframes } from 'styled-components';
import { dateTimeFormat } from 'utils/helper';

export const formatDateTimeForTable = (dateTimeString) => {
  const dateTime = dateTimeFormat(dateTimeString).split(', ');

  return (
    <Flex
      flexDirection={'column'}
      alignItems={'flex-start'}
      justifyItems="center"
    >
      <Text variant="pt14b">{dateTime[0]}</Text>
      <Text color={'var(--color-gray-05)'}>{dateTime[1]}</Text>
    </Flex>
  );
};

export const GlobalFilter = ({
  searchPlaceholder,
  globalFilter,
  setGlobalFilter,
}) => {
  const [value, setValue] = useState(globalFilter);
  const onFieldChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 200);

  return (
    <SearchField
      onChange={(e) => {
        setValue(e);
        onFieldChange(e);
      }}
      value={value || ''}
      placeholder={searchPlaceholder || 'Search data'}
      aria-label={searchPlaceholder || 'search data'}
    />
  );
};

export const TextColumnFilter = ({
  column: { filterValue, preFilteredRows, setFilter },
}) => {
  return (
    <TextField
      maxLength={100}
      value={filterValue || ''}
      onChange={(e) => {
        setFilter(e || undefined);
      }}
    />
  );
};

const getFilterOptions = ({ column: { preFilteredRows, id } }) => {
  // const options = () => {
  const generatedOptions = new Set();
  preFilteredRows.forEach((row) => {
    generatedOptions.add(row.values[id] as string);
  });

  return [...generatedOptions.values()];
  // };

  // return options;
};

export const SelectColumnFilter = ({
  column: { filterValue, setFilter, preFilteredRows, id },
}) => {
  // const [enableMenu, setEnableMenu] = useState(false);
  // const [filterSelectionValue, setFilterSelectionValue] = useState(filterValue);
  const options = useMemo(() => {
    const generatedOptions = new Set();
    preFilteredRows.forEach((row) => {
      generatedOptions.add(row.values[id] as string);
    });

    return [...generatedOptions.values()];
  }, [id, preFilteredRows]);

  return [...options];

  // return (
  //   <SelectOptionsWrapper>
  //     <NavigationMenu.Root>
  //       <NavigationMenu.Item>
  //         <NavigationMenu.Trigger>
  //           <Button
  //             kind="custom"
  //             icon={<Filter size={15} />}
  //             iconOnly
  //             onPress={() => {
  //               enableMenu ? setEnableMenu(false) : setEnableMenu(true);
  //             }}
  //           />
  //         </NavigationMenu.Trigger>
  //         {enableMenu && (
  //           <NavigationMenu.Content className="PopUpMenuContent">
  //             <Flex justifyContent={'space-between'} alignItems={'center'}>
  //               <Heading variant="h5" as="h3">
  //                 Filters
  //               </Heading>
  //               <Button
  //                 kind="custom"
  //                 className="ClearButton"
  //                 onPress={() => setFilterSelectionValue('')}
  //               >
  //                 Clear
  //               </Button>
  //             </Flex>
  //             <OptionsContainer>
  //               {[...options].map((optSelectItem, index) => (
  //                 <NavigationMenu.Item key={`${index}-${optSelectItem}`}>
  //                   <Checkbox
  //                     onChange={() =>
  //                       filterSelectionValue === optSelectItem
  //                         ? setFilterSelectionValue('')
  //                         : setFilterSelectionValue(optSelectItem)
  //                     }
  //                     isSelected={filterSelectionValue === optSelectItem}
  //                   />
  //                   <Text>{optSelectItem}</Text>
  //                 </NavigationMenu.Item>
  //               ))}
  //             </OptionsContainer>

  //             <Flex justifyContent={'space-evenly'}>
  //               <Button
  //                 kind="primary-outline"
  //                 onPress={() => {
  //                   setEnableMenu(false);
  //                 }}
  //               >
  //                 Cancel
  //               </Button>
  //               <Button
  //                 kind="primary"
  //                 onPress={() => {
  //                   setFilter(filterSelectionValue);
  //                   setEnableMenu(false);
  //                 }}
  //               >
  //                 Submit
  //               </Button>
  //             </Flex>
  //           </NavigationMenu.Content>
  //         )}
  //       </NavigationMenu.Item>
  //     </NavigationMenu.Root>
  //   </SelectOptionsWrapper>
  // );
};

export const ExpanderCell = (row) => {
  return (
    <Flex marginRight={'5px'} justifyContent={'center'}>
      <span {...row.getToggleRowExpandedProps()}>
        {row.isExpanded ? (
          <Flex gap="2px">
            <ChevronUp />
          </Flex>
        ) : (
          <Flex gap="2px">
            <ChevronDown />
          </Flex>
        )}
      </span>
    </Flex>
  );
};

const paginationOptions = [
  {
    value: '10',
    label: '10',
  },
  {
    value: '20',
    label: '20',
  },
  {
    value: '50',
    label: '50',
  },
];

const SortFilterListingTable: React.FC<{
  data: any;
  columns: any;
  title: string;
  globalSearchPlaceholder?: string;
  paginationEnable?: boolean;
  hasSidebar?: boolean;
}> = ({
  columns,
  data,
  title,
  globalSearchPlaceholder,
  paginationEnable = true,
  hasSidebar = false,
}) => {
  const [totalRows, setTotalRows] = useState(paginationOptions[0]);

  const filterTypes = useMemo(
    () => ({
      text: (rows, id, filterValue) => {
        return rows.filter((row) => {
          const rowValue = row.values[id];
          return rowValue !== undefined
            ? String(rowValue)
                .toLowerCase()
                .startsWith(String(filterValue).toLowerCase())
            : true;
        });
      },
    }),
    []
  );

  const defaultColumn = useMemo(
    () => ({
      Filter: TextColumnFilter,
    }),
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    rows,
    visibleColumns,
    state: { globalFilter },
    prepareRow,
    resetSorting,
    setGlobalFilter,
    pageOptions,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex },
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      filterTypes,
      initialState: {
        pageIndex: 0,
        pageSize: paginationEnable ? 10 : 20, // to display 20 rows on change of size in pagination component
      },
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    useExpanded,
    usePagination
  );

  const [filterSelectionValue, setFilterSelectionValue] = useState(
    new Array(headerGroups[0].headers.length).fill('')
  );

  const [sortSelectionValue, setSortSelectionValue] = useState(
    new Array(headerGroups[0].headers.length).fill('')
  );

  const [enableMenu, setEnableMenu] = useState({});

  const TablePagination = () => {
    return (
      <PaginationWrapper>
        <Select
          label="Rows: "
          labelSide="left"
          inputId={'Pagination-Rows'}
          options={paginationOptions}
          onChange={(e) => {
            setTotalRows(e);
            setPageSize(Number(e.value));
          }}
          value={totalRows}
        />

        <Flex alignItems={'center'} gap="20px">
          <PaginationJump>
            <label className="label-green" htmlFor="jumpNumber">
              Jump to: &nbsp;
              <input
                type="text"
                id="jumpNumber"
                defaultValue={pageIndex + 1}
                maxLength={100}
                onChange={(e) => {
                  const page = e.target.value ? Number(e.target.value) - 1 : 0;
                  gotoPage(page);
                }}
              />
            </label>
          </PaginationJump>

          <PaginationButtons>
            <ButtonsLabel>
              Page No. {<span>{pageIndex + 1}</span>} of{' '}
              {<span>{pageOptions.length}</span>}
            </ButtonsLabel>

            <Button
              onPress={() => previousPage()}
              kind="custom"
              className="pagination__back"
              icon={<ChevronLeft />}
              iconOnly={true}
            >
              Previous Page
            </Button>
            <Button
              onPress={() => nextPage()}
              className="pagination__next"
              icon={<ChevronRight />}
              iconOnly={true}
            >
              Next Page
            </Button>
          </PaginationButtons>
        </Flex>
      </PaginationWrapper>
    );
  };

  return (
    <>
      <Flex
        justifyContent={'space-between'}
        alignItems={'center'}
        marginBottom="10px"
        flexWrap="wrap"
        gap="10px"
      >
        <Heading variant="h3">{title}</Heading>
        <GlobalFilter
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          searchPlaceholder={globalSearchPlaceholder}
        />
      </Flex>

      <TableWrapper
        className={`filter-table ${hasSidebar ? 'has-sidebar' : ''}`}
      >
        <ListTable {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup, index) => (
              <tr
                key={`Table-Header-${index}`}
                {...headerGroup.getHeaderGroupProps()}
              >
                {headerGroup.headers.map((column, columnIndex) => (
                  <th key={`Table-Head-${columnIndex}`}>
                    <Flex
                      gap="5px"
                      alignItems={'center'}
                      justifyContent={'space-between'}
                    >
                      {column.render('Header')}

                      {
                        ((column.canSort && column.sortType !== 'disabled') ||
                          column.canFilter) && (
                          <SelectOptionsWrapper>
                            <NavigationMenu.Root>
                              <NavigationMenu.Item>
                                <NavigationMenu.Trigger>
                                  <Button
                                    kind="custom"
                                    icon={<Filter size={15} />}
                                    iconOnly
                                    onPress={() => {
                                      enableMenu === column.id
                                        ? setEnableMenu('')
                                        : setEnableMenu(column.id);
                                    }}
                                  />
                                </NavigationMenu.Trigger>
                                {enableMenu === column.id && (
                                  <NavigationMenu.Content className="PopUpMenuContent">
                                    {column.canFilter && (
                                      <>
                                        <Flex
                                          justifyContent={'space-between'}
                                          alignItems={'center'}
                                        >
                                          <Heading variant="h5" as="h3">
                                            Filter
                                          </Heading>
                                          <Button
                                            kind="custom"
                                            className="ClearButton"
                                            onPress={() => {
                                              const filterCopyArray = [
                                                ...filterSelectionValue,
                                              ];

                                              filterCopyArray[columnIndex] = '';

                                              setFilterSelectionValue(
                                                filterCopyArray
                                              );
                                            }}
                                          >
                                            Clear
                                          </Button>
                                        </Flex>
                                        <OptionsContainer>
                                          {[
                                            ...getFilterOptions({ column }),
                                          ]?.map((optSelectItem, index) => (
                                            <NavigationMenu.Item
                                              key={`${index}-${optSelectItem}`}
                                            >
                                              <Checkbox
                                                onChange={() => {
                                                  const filterCopyArray = [
                                                    ...filterSelectionValue,
                                                  ];

                                                  if (
                                                    filterSelectionValue[
                                                      columnIndex
                                                    ] === optSelectItem
                                                  ) {
                                                    filterCopyArray[
                                                      columnIndex
                                                    ] = '';
                                                  } else {
                                                    filterCopyArray[
                                                      columnIndex
                                                    ] = optSelectItem;
                                                  }

                                                  setFilterSelectionValue(
                                                    filterCopyArray
                                                  );
                                                }}
                                                isSelected={
                                                  optSelectItem ===
                                                  filterSelectionValue[
                                                    columnIndex
                                                  ]
                                                }
                                              />
                                              <Text>{optSelectItem}</Text>
                                            </NavigationMenu.Item>
                                          ))}
                                        </OptionsContainer>
                                      </>
                                    )}

                                    {column.canSort && (
                                      <>
                                        <Flex
                                          justifyContent={'space-between'}
                                          alignItems={'center'}
                                        >
                                          <Heading variant="h5" as="h3">
                                            Sort
                                          </Heading>
                                          <Button
                                            kind="custom"
                                            className="ClearButton"
                                            onPress={() => {
                                              const sortCopyArray = [
                                                ...sortSelectionValue,
                                              ];

                                              sortCopyArray[columnIndex] =
                                                undefined;

                                              setSortSelectionValue(
                                                sortCopyArray
                                              );
                                            }}
                                          >
                                            Clear
                                          </Button>
                                        </Flex>
                                        <OptionsContainer>
                                          <NavigationMenu.Item
                                            key={`${index}-Radio`}
                                          >
                                            <RadioGroup
                                              onChange={(e) => {
                                                const sortCopyArray = new Array(
                                                  sortSelectionValue.length
                                                ).fill('');

                                                sortCopyArray[columnIndex] =
                                                  JSON.parse(e);

                                                setSortSelectionValue(
                                                  sortCopyArray
                                                );
                                              }}
                                              value={
                                                sortSelectionValue[
                                                  columnIndex
                                                ] === undefined
                                                  ? ''
                                                  : JSON.stringify(
                                                      sortSelectionValue[
                                                        columnIndex
                                                      ]
                                                    )
                                              }
                                            >
                                              <Radio value="true">
                                                Ascending
                                              </Radio>
                                              <Radio value="false">
                                                Descending
                                              </Radio>
                                            </RadioGroup>
                                          </NavigationMenu.Item>
                                        </OptionsContainer>
                                      </>
                                    )}

                                    <Flex justifyContent={'space-evenly'}>
                                      <Button
                                        kind="primary-outline"
                                        onPress={() => {
                                          setEnableMenu('');
                                        }}
                                      >
                                        Cancel
                                      </Button>
                                      <Button
                                        kind="primary"
                                        onPress={() => {
                                          column.canFilter &&
                                            column.setFilter(
                                              filterSelectionValue[columnIndex]
                                            );

                                          if (column.canSort) {
                                            column.toggleSortBy(
                                              sortSelectionValue[columnIndex],
                                              false
                                            );
                                          }

                                          setEnableMenu('');
                                        }}
                                      >
                                        Submit
                                      </Button>
                                    </Flex>
                                  </NavigationMenu.Content>
                                )}
                              </NavigationMenu.Item>
                            </NavigationMenu.Root>
                          </SelectOptionsWrapper>
                        )
                        // column.render('Filter')
                      }
                    </Flex>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row, i) => {
              prepareRow(row);
              return (
                <React.Fragment key={`Row-${i}`} {...row.getRowProps()}>
                  <tr>
                    {row.cells.map((cell, i) => {
                      return (
                        <td key={`Cell-${i}`} {...cell.getCellProps()}>
                          {cell.render('Cell')}
                        </td>
                      );
                    })}
                  </tr>
                  {row.isExpanded ? (
                    <tr>
                      <td colSpan={visibleColumns.length}>
                        {/* Passing expander directly instead of renderRowSubComponent method */}
                        {row.original.expander}
                      </td>
                    </tr>
                  ) : null}
                </React.Fragment>
              );
            })}
          </tbody>
        </ListTable>
      </TableWrapper>
      {rows.length > 10 && paginationEnable && <TablePagination />}
    </>
  );
};

export default SortFilterListingTable;

// add TableWrapper with overflow-x: auto
const TableWrapper = styled.div`
  overflow-x: auto;
  width: 100%;

  &.has-sidebar {
    max-width: calc(100vw - 391px);

    @media screen and (max-width: 767px) {
      max-width: calc(100vw - 52px);
    }
  }

  @media screen and (max-width: 640px) {
    max-width: calc(100vw - 52px);
  }
`;

const ListTable = styled.table`
  width: 100%;
  border-collapse: separate;
  /* border-spacing: 0 15px; */
  /* word-break: break-word; */
  border: 1px solid var(--color-gray-02);

  button {
    white-space: normal;
  }

  tr {
    :last-child {
      td {
        border-bottom: 0;
      }
    }
  }

  th {
    margin: 0;
    padding: 0.5rem;
    /* border-right: 1px solid var(--color-grey-500); */

    :first-child,
    :last-child {
      border-right: 0;
    }
  }

  thead {
    background-color: var(--color-gray-01);
  }

  th,
  td {
    vertical-align: middle;
    padding: 12px 16px;
    max-width: 350px;
    border: 1px solid var(--color-gray-02);
  }

  th,
  td {
    text-align: left;
  }
`;

const PaginationWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: space-between;
  margin-top: 20px;
  padding: 16px;
  align-items: center;
  border: 1px solid var(--color-gray-02);

  .opub-select__control {
    background-color: var(--color-white);
  }

  > div {
    > label {
      color: var(--color-primary-01);
    }
  }
`;

const PaginationJump = styled.div`
  border-right: 1px solid var(--color-gray-02);
  color: var(--color-primary-01);
  padding-right: 20px;
  font-weight: var(--font-bold);

  @media (max-width: 920px) {
    justify-self: flex-end;
    padding-right: 0;
  }

  input {
    width: 56px;
    height: 40px;
    border-radius: 4px;
    box-shadow: inset 0px 0px 4px var(--color-gray-01);
    border: 1px solid var(--color-gray-02);
    text-align: center;
  }
`;

const ButtonsLabel = styled.span`
  color: var(--text-medium);
  line-height: 140%;

  span {
    font-weight: var(--font-bold);

    @media (max-width: 920px) {
      margin: 0 5px;
    }
  }
`;

const PaginationButtons = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  @media (max-width: 920px) {
    grid-row: 2/3;
    grid-column: 1/3;
    justify-self: center;
    padding-top: 1rem;
    width: 100%;
    justify-content: space-between;
    margin-left: 0;
  }

  button {
    border-radius: 4px;
    padding: 4px;
    line-height: 0;

    &.is-disabled {
      background-color: var(--text-disabled);
      cursor: auto;
    }
  }

  .pagination__back {
    margin-left: 16px;
  }

  .pagination__next {
    margin-left: 8px;
    background-color: var(--color-primary-01);
  }
`;

const enterFromRight = keyframes({
  from: { transform: 'translateX(200px)', opacity: 0 },
  to: { transform: 'translateX(0)', opacity: 1 },
});

const enterFromLeft = keyframes({
  from: { transform: 'translateX(-200px)', opacity: 0 },
  to: { transform: 'translateX(0)', opacity: 1 },
});

const exitToRight = keyframes({
  from: { transform: 'translateX(0)', opacity: 1 },
  to: { transform: 'translateX(200px)', opacity: 0 },
});

const exitToLeft = keyframes({
  from: { transform: 'translateX(0)', opacity: 1 },
  to: { transform: 'translateX(-200px)', opacity: 0 },
});

const SelectOptionsWrapper = styled.div`
  list-style: none;

  @media screen and (max-width: 640px) {
    display: none;
  }

  .PopUpMenuContent {
    position: absolute;
    width: 266px;
    padding: 16px;
    background-color: var(--color-white);
    border: 1px solid var(--color-gray-02);
    border-radius: 0px 0px 4px 4px;
    z-index: 1;
    margin-left: -10%;

    @media (prefers-reduced-motion: no-preference) {
      animation-duration: 250ms;
      animation-timing-function: ease;
      &[data-motion='from-start'] {
        animation-name: ${enterFromLeft};
      }
      &[data-motion='from-end'] {
        animation-name: ${enterFromRight};
      }
      &[data-motion='to-start'] {
        animation-name: ${exitToLeft};
      }
      &[data-motion='to-end'] {
        animation-name: ${exitToRight};
      }
    }
  }

  .ClearButton {
    text-decoration: underline;
    color: var(--color-primary-01);
  }
`;

const OptionsContainer = styled.div`
  padding-top: 12px;
  padding-bottom: 12px;
  border-top: 1px solid var(--color-gray-02);
  border-bottom: 1px solid var(--color-gray-02);
  margin: 8px 0px;
  text-align: left;
  max-height: 266px;
  overflow-y: scroll;
`;
