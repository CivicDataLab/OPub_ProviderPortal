import styled from 'styled-components';

interface ButtonProps {
  readonly buttonType?: string;
  readonly size?: string;
  readonly bg?: string;
  readonly iconSide?: string;
  readonly iconOnly?: boolean;
  readonly fluid?: boolean;
}

function bgColor(type: string, bg: string) {
  if (type == 'custom') {
    return 'inherit';
  } else if (bg) {
    return bg;
  } else {
    switch (type) {
      case 'primary':
        return 'var(--color-primary-01)';
      case 'secondary':
        return 'var(--color-secondary-00)';
      default:
        return 'transparent';
    }
  }
}

function color(type: string) {
  if (type == 'custom') {
    return 'inherit';
  }
  if (type == 'primary' || type == 'secondary') return 'white';
  else if (type == 'primary-outline') return 'var(--color-primary-01)';
  else return 'var(--color-secondary-00)';
}

function border(type: string) {
  if (type == 'custom') {
    return 'null';
  }
  if (type == 'primary' || type == 'secondary') return 'none';
  else if (type == 'primary-outline')
    return `2px solid ${'var(--color-primary-01)'}`;
  else return `2px solid ${'var(--color-secondary-00)'}`;
}

function buttonSize(size: string, type: string) {
  if (type == 'custom') {
    return 'inherit';
  }
  if (type == 'primary-outline' || type == 'secondary-outline') {
    if (size == 'sm') return '6px 10px';
    else return '10px 22px';
  } else {
    if (size == 'sm') return '8px 16px';
    else return '12px 24px';
  }
}

function buttonDisable(type: string, val) {
  if (type == 'custom') {
    return 'inherit';
  }
  let a;
  if (type == 'primary-outline' || type == 'secondary-outline') {
    a = {
      bg: 'transparent',
      color: 'var(--text-disabled)',
      border: 'var(--color-gray-03)',
    };
  } else {
    a = {
      bg: 'var(--color-gray-03)',
      color: 'var(--text-medium-on-dark)',
      border: 'var(--color-gray-03)',
    };
  }

  if (val === 'border') return a.border;
  if (val === 'bg') return a.bg;
  if (val === 'color') return a.color;
}

function buttonFont(size: string) {
  if (size == 'sm') return '0.875rem';
  else return '1rem';
}

// change inline padding incase of icon
function iconPadding(iconSide, size, iconOnly) {
  if (iconOnly) {
    return 'padding: 8px;';
  }

  if (iconSide) {
    if (size == 'sm') {
      if (iconSide == 'left') return 'padding-left: 8px;';
      else return 'padding-right: 8px;';
    }
    if (iconSide == 'left') return 'padding-left: 20px;';
    else return 'padding-right: 20px;';
  }
}

const ButtonWrapper = styled.button<ButtonProps>`
  font-size: ${(props: any) => buttonFont(props.size)};
  line-height: ${(props: any) => (props.size === 'sm' ? '1.7' : '1.5')};
  font-weight: var(--font-bold);
  display: flex;
  align-items: center;
  width: ${(props: any) => (props.fluid == true ? '100%' : 'fit-content')};
  justify-content: ${(props: any) => (props.fluid == true ? 'center' : null)};
  cursor: pointer;
  height: fit-content;

  background-color: ${(props: any) => bgColor(props.buttonType, props.bg)};
  color: ${(props: any) => color(props.buttonType)};
  padding: ${(props: any) => buttonSize(props.size, props.buttonType)};
  border: ${(props: any) => border(props.buttonType)};
  border-radius: ${(props: any) => (props.type == 'custom' ? 0 : '2px')};
  text-decoration: none;
  white-space: nowrap;

  transition: filter 130ms ease, transform 130ms ease,
    background-color 130ms ease;

  ${(props: any) => iconPadding(props.iconSide, props.size, props.iconOnly)}

  &.is-hovered {
    filter: ${(props) => props.buttonType !== 'custom' && 'brightness(110%)'};
  }

  &.is-active {
    transform: scale(0.99);
  }

  &.is-disabled {
    background-color: ${(props: any) => buttonDisable(props.buttonType, 'bg')};
    color: ${(props: any) => buttonDisable(props.buttonType, 'color')};
    border-color: ${(props: any) => buttonDisable(props.buttonType, 'border')};
    cursor: auto;
  }

  svg {
    max-width: ${(props: any) =>
      props.size == 'sm' ? '18px' : props.iconOnly ? '32px' : '24px'};
    max-height: ${(props: any) =>
      props.size == 'sm' ? '18px' : props.iconOnly ? '32px' : '24px'};
    fill: currentColor;
    pointer-events: none;

    ${(props: any) =>
      !props.iconOnly
        ? props.iconSide == 'left'
          ? 'margin-inline-end: 0.5em'
          : 'margin-inline-start: 0.5em'
        : null}
  }
`;

export default ButtonWrapper;
