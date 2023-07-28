import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { useTable, usePagination, useSortBy } from 'react-table';
import {
  PaginationComp,
  PaginationJump,
  PaginationButtons,
  ButtonsLabel,
} from '../Pagination/PaginationComp';
import { Button, Menu } from 'components/actions';
import { ArrowDown, SortIcon } from 'components/icons';
import {
  MenuButton,
  MenuContent,
  MenuLabel,
} from 'components/actions/Menu/MenuComp';

const paginationItems = [
  {
    id: '10',
    name: '10',
  },
  {
    id: '20',
    name: '20',
  },
  {
    id: '50',
    name: '50',
  },
];

const ReactTable = ({ columns, data }) => {
  const [totalRows, setTotalRows] = useState('10');

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page, // Instead of using 'rows', we'll use page,
    // which has only the rows for the active page
    rows,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0 },
    },
    useSortBy,
    usePagination
  );

  const TableControls = () => {
    return (
      <PaginationComp>
        <Menu
          options={paginationItems}
          heading="Rows:"
          handleChange={(e) => {
            setTotalRows(e);
            setPageSize(Number(e));
          }}
          value={totalRows}
          top={true}
          position="left"
        />

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
          <div>
            <Button
              onPress={() => previousPage()}
              kind="custom"
              className="pagination__back"
              icon={<ArrowDown />}
              iconOnly={true}
            >
              Previous Page
            </Button>
            <Button
              onPress={() => nextPage()}
              className="pagination__next"
              icon={<ArrowDown />}
              iconOnly={true}
            >
              Next Page
            </Button>
          </div>
        </PaginationButtons>
      </PaginationComp>
    );
  };

  return (
    <Wrapper>
      <TableWrapper {...getTableProps()}>
        <THead>
          {headerGroups.map((headerGroup, index) => (
            <tr
              key={`table-tr-${index}`}
              {...headerGroup.getHeaderGroupProps()}
            >
              {headerGroup.headers.map((column, j) => (
                <th
                  key={`table-th-${j}`}
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                >
                  {column.render('Header')}{' '}
                  <Button
                    icon={
                      column.isSorted ? (
                        column.isSortedDesc ? (
                          <ArrowDown fill="#000000" />
                        ) : (
                          <ArrowDown
                            fill="#000000"
                            style={{ transform: 'rotate(180deg)' }}
                          />
                        )
                      ) : (
                        <SortIcon fill="#000000" />
                      )
                    }
                    iconOnly
                    kind="custom"
                  >
                    Sort
                  </Button>
                </th>
              ))}
            </tr>
          ))}
        </THead>
        <TBody {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row);
            return (
              <tr key={`table-tr1-${i}`} {...row.getRowProps()}>
                {row.cells.map((cell, j) => {
                  return (
                    <td key={`table-td-${j}`} {...cell.getCellProps()}>
                      {cell.render('Cell')}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </TBody>
      </TableWrapper>
      {page.length > 10 && <TableControls />}
    </Wrapper>
  );
};

const Arrow = ({ sortDir, isCurrent }) => {
  const ascending = sortDir === 'ascending';
  return (
    <svg viewBox="0 0 100 200" width="100" height="200">
      {!(!ascending && isCurrent) && <polyline points="20 50, 50 20, 80 50" />}
      <line x1="50" y1="20" x2="50" y2="180" />
      {!(ascending && isCurrent) && (
        <polyline points="20 150, 50 180, 80 150" />
      )}
    </svg>
  );
};

//Function can be seen as general and not needed in the component
//scope. This also removes the need to declare it in the
//dependency arrays of hooks such as useMemo.
const sortRowsByIndex = (rows, sortedIndex, sortedDirection) =>
  rows.slice(0).sort((a, b) => {
    if (sortedDirection === 'ascending') {
      return a[sortedIndex] > b[sortedIndex]
        ? 1
        : a[sortedIndex] < b[sortedIndex]
        ? -1
        : 0;
    } else {
      return a[sortedIndex] < b[sortedIndex]
        ? 1
        : a[sortedIndex] > b[sortedIndex]
        ? -1
        : 0;
    }
  });

const Table = ({ headers, rows, caption, sortable }) => {
  headers = headers.map((item, index) => {
    return {
      Header: item,
      accessor: item.replace(/[!@#$%^&*.,+=<>[\]()/\'";:?]/g, '') || `${index}`,
    };
  });

  rows.map((rowObject) => {
    Object.keys(rowObject).forEach((key, i) => {
      const value = rowObject[key];
      delete rowObject[key]; //Delete the propety early to avoid duplication issue
      rowObject[key.replace(/[!@#$%^&*.,+=<>[\]()/\'";:?]/g, '') || `${i}`] =
        value;
    });
  });

  const columns = useMemo(() => headers, [headers]);
  const data = useMemo(() => rows, [rows]);

  return columns.length ? <ReactTable columns={columns} data={data} /> : <></>;
};

export default Table;

const Wrapper = styled.div`
  /* height: 100%; */
  width: 55rem;

  background-color: var(--color-white);

  @media (max-width: 900px) {
    width: calc(100vw - 80px);
  }

  position: relative;
  overflow: auto;

  ${PaginationComp} {
    position: sticky;
    bottom: 0;
    left: 0;
    right: 0;
    border-top: var(--border-1);
    border-radius: 0;
    height: 4rem;
    padding-block: 0;

    @media (max-width: 640px) {
      width: 100vw;
    }
  }

  ${MenuLabel} {
    color: var(--color-primary);
    font-size: 1rem;
    font-weight: var(--font-weight-medium);
  }

  ${MenuButton} {
    min-width: 80px;
  }

  ${MenuContent} {
    max-width: 80px;
    z-index: 1000;
  }
`;

export const TableWrapper = styled.table`
  border-collapse: collapse;
  line-height: 1.38;
  /* width: 100%; */
  /* min-height: 494px; */
  overflow-y: auto;
  overflow-x: auto;
  th,
  td {
    padding: 12px 12px;
    text-align: left;
  }

  caption {
    margin-bottom: 8px;
    font-style: italic;
    text-align: left;
  }
`;

const THead = styled.thead`
  background-color: var(--color-grey-600);
  border-radius: 4px;
  height: 4rem;

  th {
    font-weight: 600;
    text-transform: capitalize;
    align-items: center;
    gap: 16px;

    button {
      display: inline-block;
      vertical-align: middle;
      width: 44px;
      height: 44px;
    }
  }
`;

const TBody = styled.tbody`
  tr {
    &:not(:last-child) {
      border-bottom: var(--border-2);
    }
  }
`;
