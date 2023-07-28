import { Overlay as ReactAriaOverlay } from '@react-aria/overlays';
import { OverlayProps } from '@react-types/overlays';
import { DOMRef } from '@react-types/shared';
import React, { useCallback, useState } from 'react';
import { OpenTransition } from './OpenTransition';

function Overlay(props: OverlayProps, ref: DOMRef<HTMLDivElement>) {
  let {
    children,
    isOpen,
    container,
    onEnter,
    onEntering,
    onEntered,
    onExit,
    onExiting,
    onExited,
  } = props;
  let [exited, setExited] = useState(!isOpen);

  let handleEntered = useCallback(() => {
    setExited(false);
    if (onEntered) {
      onEntered();
    }
  }, [onEntered]);

  let handleExited = useCallback(() => {
    setExited(true);
    if (onExited) {
      onExited();
    }
  }, [onExited]);

  // Don't un-render the overlay while it's transitioning out.
  let mountOverlay = isOpen || !exited;
  if (!mountOverlay) {
    // Don't bother showing anything if we don't have to.
    return null;
  }

  return (
    <ReactAriaOverlay portalContainer={container}>
      <OpenTransition
        in={isOpen}
        appear
        onExit={onExit}
        onExiting={onExiting}
        onExited={handleExited}
        onEnter={onEnter}
        onEntering={onEntering}
        onEntered={handleEntered}
      >
        {children}
      </OpenTransition>
    </ReactAriaOverlay>
  );
}

let _Overlay = React.forwardRef(Overlay);
export { _Overlay as Overlay };
