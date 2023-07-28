import {useTableRowGroup} from 'react-aria';

interface TableRowGroupProps {
    type : any,
    style? : object,
    children: React.ReactNode;
}

export function TableRowGroup({ type: Element, style, children }:TableRowGroupProps) {
  let { rowGroupProps } = useTableRowGroup();
  return (
    <Element {...rowGroupProps} style={style}>
      {children}
    </Element>
  );
}