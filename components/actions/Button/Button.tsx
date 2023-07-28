import React, { ElementType, ReactElement } from 'react';
import ButtonWrapper from './ButtonComp';
import { AriaButtonProps } from '@react-types/button';
import { mergeProps, useButton } from 'react-aria';
import { useHover } from '@react-aria/interactions';
import classNames from 'clsx';

export interface ButtonProps extends AriaButtonProps {
  /**
   * Is this primary button or secondary?
   */
  kind?:
    | 'primary'
    | 'secondary'
    | 'primary-outline'
    | 'secondary-outline'
    | 'custom';

  /**
   * add a native tooltip on hver
   */
  title?: string;

  /**
   * How large should the button be?
   */
  size?: 'sm' | 'md';
  /**
   * overwrite background color
   */
  bg?: string;

  /**
   * whether to take full width
   */
  fluid?: boolean;

  className?: string;

  as?: 'button' | 'a';

  onClick?: (e: any) => void;
}

type IconProps =
  | { icon?: false; iconSide?: never }
  | {
      icon?: ReactElement;
      iconSide?: 'left' | 'right';
      children?: React.ReactNode;
    };

type IconOnlyProps =
  | { iconOnly?: false }
  | {
      iconOnly?: true;
      icon: ReactElement;
      iconSide?: never;
    };

type Props<T> = ButtonProps & IconProps & IconOnlyProps;

const Button = <T extends ElementType = 'button'>(
  props: Props<T>,
  ref: React.RefObject<HTMLButtonElement>
) => {
  let { buttonProps, isPressed } = useButton(props, ref);
  let {
    as = 'button',
    kind = 'primary',
    size = 'md',
    iconSide = 'right',
    isDisabled,
    icon,
    iconOnly,
    className,
    children,
    title,
    fluid,
    bg,
    href,
  } = props;
  let { hoverProps, isHovered } = useHover({ isDisabled });

  return (
    <>
      <ButtonWrapper
        className={classNames(
          isPressed ? 'is-active' : '',
          isDisabled ? 'is-disabled' : '',
          isHovered ? 'is-hovered' : '',
          className
        )}
        buttonType={kind}
        as={as}
        ref={ref}
        href={href}
        fluid={fluid}
        size={size}
        bg={bg}
        target={props.target}
        title={title}
        iconOnly={iconOnly}
        iconSide={icon && iconSide}
        {...mergeProps(buttonProps, hoverProps)}
      >
        {icon && iconSide == 'left' && icon}
        {iconOnly ? <span className="sr-only">{children}</span> : children}
        {icon && iconSide == 'right' && icon}
      </ButtonWrapper>
    </>
  );
};
export default React.forwardRef(Button);
