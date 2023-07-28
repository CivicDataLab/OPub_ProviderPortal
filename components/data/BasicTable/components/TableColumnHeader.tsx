import { useRef } from 'react';
import {useTableColumnHeader , mergeProps, useFocusRing} from 'react-aria';


export function TableColumnHeader({ column, state }) {
  let ref = useRef();
  let { columnHeaderProps } = useTableColumnHeader(
    { node: column },
    state,
    ref
  );
  let { isFocusVisible, focusProps } = useFocusRing();
  let arrowIcon = state.sortDescriptor?.direction === 'ascending' ? '▲' : '▼';

  return (
    <th
      {...mergeProps(columnHeaderProps, focusProps)}
      colSpan={column.colspan}
      style={{
        textAlign: column.colspan > 1 ? 'center' : 'left',
        padding: '5px 10px',
        outline: isFocusVisible ? '2px solid orange' : 'none',
        cursor: 'default'
      }}
      ref={ref}
    >
      {column.rendered}
      {column.props.allowsSorting &&
        (
          <span
            aria-hidden="true"
            style={{
              padding: '0 2px',
              visibility: state.sortDescriptor?.column === column.key
                ? 'visible'
                : 'hidden'
            }}
          >
            {arrowIcon}
          </span>
        )}
    </th>
  );
}