import React, { useState } from 'react';
import styled from 'styled-components';
import { Flex } from 'components/layouts/FlexWrapper';
import { Heading, Text } from 'components/layouts';
import { Checkbox, SearchField, Select, TextField } from 'components/form';
import {
  useTable,
  useGlobalFilter,
  useAsyncDebounce,
  usePagination,
  useRowSelect,
  useMountedLayoutEffect,
} from 'react-table';
import { Button } from 'components/actions';
import { ChevronLeft, ChevronRight, Filter } from '@opub-icons/workflow';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';

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

const IndeterminateCheckbox = React.forwardRef(
  ({ indeterminate, ...rest }: any, ref) => {
    const defaultRef = React.useRef();
    const resolvedRef = ref || defaultRef;

    React.useEffect(() => {
      resolvedRef['current'].indeterminate = indeterminate;
    }, [resolvedRef, indeterminate]);

    return (
      <>
        <input type="checkbox" ref={resolvedRef} {...rest} />
      </>
    );
  }
);

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

const SelectSortFilterListingTable: React.FC<{
  data: any;
  columns: any;
  title: string;
  onRowSelect: any;
  globalSearchPlaceholder?: string;
  initialState: any;
}> = ({
  columns,
  data,
  title,
  globalSearchPlaceholder,
  onRowSelect,
  initialState,
}) => {
  const [totalRows, setTotalRows] = useState(paginationOptions[0]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    rows,
    setGlobalFilter,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    selectedFlatRows,
    state: { globalFilter, pageIndex, pageSize, selectedRowIds },
  } = useTable(
    {
      columns,
      data,
      initialState,
    },
    useGlobalFilter,
    usePagination,
    useRowSelect,
    (hooks) => {
      hooks.visibleColumns.push((columns) => [
        {
          id: 'selection',
          Header: ({ getToggleAllPageRowsSelectedProps }) => (
            <div>
              <IndeterminateCheckbox {...getToggleAllPageRowsSelectedProps()} />
            </div>
          ),
          Cell: ({ row }) => (
            <Flex justifyContent={'left'}>
              <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
            </Flex>
          ),
        },
        ...columns,
      ]);
    }
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

        <Flex alignItems={'center'}>
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

  // Set the selected rows to the parent component handler
  useMountedLayoutEffect(() => {
    onRowSelect(selectedRowIds);
  }, [selectedRowIds]);

  return (
    <>
      <Flex
        justifyContent={'space-between'}
        alignItems={'center'}
        marginBottom="10px"
      >
        <Heading variant="h3">{title}</Heading>
        <GlobalFilter
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          searchPlaceholder={globalSearchPlaceholder}
        />
      </Flex>

      <ListTable {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup, hgi) => (
            <tr key={`ColumnData${hgi}`} {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column, columnIndex) => (
                <th
                  key={`Table-Head-${columnIndex}`}
                  {...column.getHeaderProps()}
                >
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
                                <NavigationMenu.Content className="PopUpMenu">
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
                                        {[...getFilterOptions({ column })]?.map(
                                          (optSelectItem, index) => (
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
                                          )
                                        )}
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
                                        {[true, false]?.map(
                                          (optSelectItem, index) => (
                                            <NavigationMenu.Item
                                              key={`${index}-${optSelectItem}`}
                                            >
                                              <Checkbox
                                                onChange={() => {
                                                  const sortCopyArray = [
                                                    ...sortSelectionValue,
                                                  ];

                                                  if (
                                                    sortCopyArray[
                                                      columnIndex
                                                    ] !== optSelectItem
                                                  ) {
                                                    sortCopyArray[columnIndex] =
                                                      optSelectItem;
                                                  } else {
                                                    sortCopyArray[columnIndex] =
                                                      '';
                                                  }

                                                  setSortSelectionValue(
                                                    sortCopyArray
                                                  );
                                                }}
                                                isSelected={
                                                  sortSelectionValue[
                                                    columnIndex
                                                  ] === optSelectItem
                                                }
                                              />
                                              <Text>
                                                {optSelectItem
                                                  ? 'Ascending'
                                                  : 'Descending'}
                                              </Text>
                                            </NavigationMenu.Item>
                                          )
                                        )}
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
          {page.map((row, ri) => {
            prepareRow(row);
            return (
              <tr key={`Data${ri}`} {...row.getRowProps()}>
                {row.cells.map((cell, celli) => {
                  return (
                    <td key={`RowElements${celli}`} {...cell.getCellProps()}>
                      {cell.render('Cell')}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </ListTable>
      {rows.length > 10 && <TablePagination />}
    </>
  );
};

export default SelectSortFilterListingTable;

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
  td:nth-child(n + 3) {
    /* text-align: center; */
  }
`;

const PaginationWrapper = styled.div`
  display: flex;
  flex-direction: row;
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
  padding-right: 20px;
  color: var(--color-primary-01);
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
  margin-left: 20px;
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

const SelectOptionsWrapper = styled.div`
  list-style: none;

  .PopUpMenu {
    position: absolute;
    width: 266px;
    padding: 16px;
    background-color: var(--color-white);
    border: 1px solid var(--color-gray-02);
    border-radius: 0px 0px 4px 4px;
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
