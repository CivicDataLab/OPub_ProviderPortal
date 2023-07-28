import { useTable } from 'react-aria';
import { useTableState } from 'react-stately';
import { useRef } from 'react';
import {
  TableHeaderRow,
  TableRowGroup,
  TableColumnHeader,
  TableRow,
  TableCell,
} from './components';
import styled from 'styled-components';

export function TableComp(props) {
  let { selectionMode, selectionBehavior } = props;
  let state = useTableState({
    ...props,
    showSelectionCheckboxes:
      selectionMode === 'multiple' && selectionBehavior !== 'replace',
  });

  let ref = useRef();
  let { collection } = state;
  let { gridProps } = useTable(props, state, ref);

  return (
    <TableWrapper>
      <Table {...gridProps} ref={ref}>
        <TableRowGroup type="thead">
          {collection.headerRows.map((headerRow) => (
            <TableHeaderRow key={headerRow.key} item={headerRow} state={state}>
              {[...headerRow.childNodes].map((column) => (
                <TableColumnHeader
                  key={column.key}
                  column={column}
                  state={state}
                />
              ))}
            </TableHeaderRow>
          ))}
        </TableRowGroup>
        <TableRowGroup type="tbody">
          {[...collection.body.childNodes].map((row) => (
            <TableRow key={row.key} item={row} state={state}>
              {[...row.childNodes].map((cell) => (
                <TableCell key={cell.key} cell={cell} state={state} />
              ))}
            </TableRow>
          ))}
        </TableRowGroup>
      </Table>
    </TableWrapper>
  );
}

const TableWrapper = styled.div`
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;
  background-color: inherit;
  width: 100%;
  overflow-x: auto;
  position: relative;
`;

const Table = styled.table`
  --border-color: var(--color-gray-02);
  border-collapse: collapse;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  width: 100%;
  background-color: var(--color-white);

  thead,
  tr {
    border-bottom: 1px solid var(--border-color);
  }

  td,
  th {
    border-right: 1px solid var(--border-color);
  }

  th {
    background-color: var(--color-gray-02);
  }
`;
