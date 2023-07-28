import { useRef } from 'react';
import {useTableHeaderRow} from 'react-aria';

export function TableHeaderRow({ item, state, children }) {
  let ref = useRef();
  let { rowProps } = useTableHeaderRow({ node: item }, state, ref);

  return (
    <tr {...rowProps} ref={ref}>
      {children}
    </tr>
  );
}