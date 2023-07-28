import { useRef } from 'react';
import {useTableRow , mergeProps, useFocusRing } from 'react-aria';

export function TableRow({ item, children, state }) {
  let ref = useRef();
  let isSelected = state.selectionManager.isSelected(item.key);
  let { rowProps, isPressed } = useTableRow(
    {
      node: item
    },
    state,
    ref
  );
  let { isFocusVisible, focusProps } = useFocusRing();

  return (
    <tr
      style={{
        background: isSelected ? 'blueviolet' : isPressed
          ? 'var(--spectrum-global-color-gray-400)'
          : item.index % 2
          ? 'var(--spectrum-alias-highlight-hover)'
          : 'none',
        color: isSelected ? 'white' : null,
        outline: isFocusVisible ? '2px solid orange' : 'none'
      }}
      {...mergeProps(rowProps, focusProps)}
      ref={ref}
    >
      {children}
    </tr>
  );
}