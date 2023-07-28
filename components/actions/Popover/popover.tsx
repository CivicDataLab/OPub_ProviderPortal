import React from 'react';
import { DismissButton, FocusScope, useOverlay } from 'react-aria';
import styled from 'styled-components';

interface PopoverProps {
    popoverRef?: React.RefObject<HTMLDivElement>;
    children: React.ReactNode;
    isOpen?: boolean;
    onClose: () => void;
  }

  
  export function Popover(props: PopoverProps) {
    let ref = React.useRef<HTMLDivElement>(null);
    let { popoverRef = ref, isOpen, onClose, children } = props;

  // Handle events that should cause the popup to close,
  // e.g. blur, clicking outside, or pressing the escape key.
  let { overlayProps } = useOverlay(
    {
      isOpen,
      onClose,
      shouldCloseOnBlur: true,
      isDismissable: true,
    },
    popoverRef
  );

  // Add a hidden <DismissButton> component at the end of the popover
  // to allow screen reader users to dismiss the popup easily.
  return (
    <FocusScope restoreFocus>
      <PopupWrapper
        {...overlayProps}
        ref={popoverRef}
      >
        {children}
        <DismissButton onDismiss={onClose} />
      </PopupWrapper>
    </FocusScope>
  );
}

const PopupWrapper = styled.div`
  position: absolute;
  min-width: 100%;
  margin-top: 12px;
  right: 0;
  z-index: 999;
`;
