import React, { ReactElement } from 'react';
import type { Node } from '@react-types/shared';
import type { AriaMenuProps, MenuTriggerProps } from '@react-types/menu';
import {
  TreeState,
  useMenuTriggerState,
  useTreeState,
  Item,
} from 'react-stately';
import {
  useMenu,
  useMenuItem,
  useMenuSection,
  useMenuTrigger,
  useSeparator,
} from 'react-aria';
import Button from '../Button';
import { Popover } from '../Popover';
import styled from 'styled-components';

interface MenuButtonProps<T extends object>
  extends AriaMenuProps<T>,
    MenuTriggerProps {
  label?: string;
  icon?: ReactElement;
  iconOnly?: boolean;
  kind?:
    | 'primary'
    | 'secondary'
    | 'primary-outline'
    | 'secondary-outline'
    | 'custom';

  size?: 'sm' | 'md';
  fluid?: boolean;
}

export { Item };

export function MenuButton<T extends object>(props: MenuButtonProps<T>) {
  // Create state based on the incoming props
  let state = useMenuTriggerState(props);

  // Get props for the menu trigger and menu elements
  let ref = React.useRef();
  let { menuTriggerProps, menuProps } = useMenuTrigger({}, state, ref);

  return (
    <MenuButtonWrapper style={{ width: props?.fluid ? '100%' : 'auto' }}>
      <Button
        kind={props.kind || 'custom'}
        size={props.size || 'md'}
        className="menu-trigger"
        iconOnly={props?.iconOnly && props?.iconOnly}
        fluid={props?.fluid}
        {...menuTriggerProps}
        ref={ref}
        icon={props?.icon && props.icon}
      >
        {props.label}
      </Button>
      {state.isOpen && (
        <Popover isOpen onClose={state.close}>
          <Menu
            {...menuProps}
            {...props}
            autoFocus={state.focusStrategy || true}
            onClose={() => state.close()}
          />
        </Popover>
      )}
    </MenuButtonWrapper>
  );
}

function Menu(props) {
  // Create menu state based on the incoming props
  let state = useTreeState(props);

  // Get props for the menu element
  let ref = React.useRef();
  let { menuProps } = useMenu(props, state, ref);

  return (
    <StyledList {...menuProps} ref={ref}>
      {[...state.collection].map((item) =>
        item.type === 'section' ? (
          <MenuSection
            onAction={props.onAction}
            onClose={props.onClose}
            key={item.key}
            section={item}
            state={state}
          />
        ) : (
          <MenuItem
            onAction={props.onAction}
            onClose={props.onClose}
            key={item.key}
            item={item}
            state={state}
          />
        )
      )}
    </StyledList>
  );
}

interface MenuSectionProps<T> {
  section: Node<T>;
  state: TreeState<T>;
  onAction: (key: React.Key) => void;
  onClose: () => void;
}

function MenuSection<T>({
  section,
  state,
  onAction,
  onClose,
}: MenuSectionProps<T>) {
  let { itemProps, groupProps } = useMenuSection({
    heading: section.rendered,
    'aria-label': section['aria-label'],
  });

  let { separatorProps } = useSeparator({
    elementType: 'li',
  });

  return (
    <>
      {section.key !== state.collection.getFirstKey() && (
        <li {...separatorProps} />
      )}
      <li {...itemProps}>
        <ul {...groupProps}>
          {[...section.childNodes].map((node) => (
            <MenuItem
              key={node.key}
              item={node}
              state={state}
              onAction={onAction}
              onClose={onClose}
            />
          ))}
        </ul>
      </li>
    </>
  );
}

interface MenuItemProps<T> {
  item: Node<T>;
  state: TreeState<T>;
  onAction: (key: React.Key) => void;
  onClose: () => void;
}

function MenuItem<T>({ item, state, onAction, onClose }: MenuItemProps<T>) {
  // Get props for the menu item element
  let ref = React.useRef();
  let { menuItemProps, isFocused, isSelected, isDisabled } = useMenuItem(
    {
      key: item.key,
      onAction,
      onClose,
    },
    state,
    ref
  );

  return (
    <StyledListItem isFocused={isFocused} ref={ref} {...menuItemProps}>
      {item.rendered}
      {isSelected && <span aria-hidden="true">✅</span>}
    </StyledListItem>
  );
}

const StyledList = styled.ul`
  list-style: none;
  outline: none !important;
  box-shadow: var(--box-shadow);
  min-width: 165px;
`;

const StyledListItem = styled.li<any>`
  background-color: ${(props) =>
    props.isFocused ? 'var(--color-primary-06)' : 'var(--color-white)'};
  outline: none !important;
  padding: 8px 24px;
  cursor: pointer;
`;

const MenuButtonWrapper = styled.div`
  position: relative;
  display: inline-block;
`;
