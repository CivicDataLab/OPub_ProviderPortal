import React, { useState, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Button } from 'components/actions';
import styled from 'styled-components';
import ButtonComp from '../Button/ButtonComp';

interface Props extends React.HTMLAttributes<HTMLElement> {
  /**
   * Button Content
   */
  buttonContent: string;

  /**
   * Button Content
   */
  icon: React.ReactElement;

  /**
   * Button title
   */
  title?: string;

  /**
   * custom class for button
   */
  buttonClass?: string;

  /**
   * Button style
   */
  buttonStyle?:
    | 'primary'
    | 'secondary'
    | 'primary-outline'
    | 'secondary-outline'
    | 'custom';
}
const widgetID = uuidv4();

const Widget = ({
  buttonContent,
  title = 'widget',
  buttonStyle = 'custom',
  buttonClass,
  icon,
  children,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const activatorRef = useRef(null);
  const dropdownListRef = useRef(null);

  const wrapKeyHandler = (event) => {
    if (event.key === 'Escape' && isOpen) {
      // escape key
      setIsOpen(false);
      activatorRef.current.focus();
    }
  };

  const clickHandler = () => {
    setIsOpen(!isOpen);
  };

  const clickOutsideHandler = (event) => {
    if (
      dropdownListRef.current.contains(event.target) ||
      activatorRef.current.contains(event.target)
    ) {
      return;
    }
    setIsOpen(false);
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mouseup', clickOutsideHandler);
      dropdownListRef.current.querySelector(':not([disabled])').focus();
    } else {
      document.removeEventListener('mouseup', clickOutsideHandler);
    }

    return () => {
      document.removeEventListener('mouseup', clickOutsideHandler);
    };
  }, [isOpen]);

  return (
    <WidgetComp onKeyUp={wrapKeyHandler}>
      <Button
        kind={buttonStyle}
        aria-expanded="false"
        icon={icon}
        aria-controls={widgetID}
        aria-label={`Show ${title}`}
        data-text-for-show={`Show ${title}`}
        data-text-for-hide={`Hide ${title}`}
        onPress={clickHandler}
        className={buttonClass ? buttonClass : null}
      >
        {buttonContent}
      </Button>
      {
        <WidgetContent
          className={`${isOpen ? 'widget__active' : ''}`}
          id={widgetID}
          ref={dropdownListRef}
          tabIndex={-1}
        >
          {children}
        </WidgetContent>
      }
    </WidgetComp>
  );
};
export default Widget;

export const WidgetComp = styled.div`
  position: relative;
  height: 100%;

  ${ButtonComp} {
    &[aria-expanded='true'] {
      background-color: #ebfeff;
    }
  }
`;

const WidgetContent = styled.div`
  position: absolute;
  top: 3.5rem;
  /* right: 0; */
  display: none;
  isolation: isolate;
  z-index: 20;

  &.widget__active {
    display: block;
  }
`;
