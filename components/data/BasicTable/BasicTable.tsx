import { Cell, Column, Row, TableBody, TableHeader } from 'react-stately';

import { TableComp } from './TableComp';

export const Table = ({ columnData, rowData, label, heading }) => {
  return (
    <>
      <span className="sr-only" id={`table-${label}`}>
        {heading}
      </span>
      <TableComp aria-label={label} aria-describedby={`table-${label}`}>
        <TableHeader>
          {columnData.map((column, index) => (
            <Column key={`${column.headerName}-${index}`}>
              {column.headerName}
            </Column>
          ))}
        </TableHeader>
        <TableBody>
          {/* The rowData should be having the same key as the columnName */}
          {rowData.map((row, index) => (
            <Row key={`${row}-${index}`}>
              {columnData.map((column, index) => (
                <Cell key={index}>{row[column.headerName]}</Cell>
              ))}
            </Row>
          ))}
        </TableBody>
      </TableComp>
    </>
  );
};
