import { SVGProps, forwardRef } from 'react';

interface Props extends SVGProps<SVGSVGElement> {}

const IconClose = (props, ref) => (
  <svg
    width={props.width ? props.width : 24}
    viewBox="0 0 24 24"
    fill="black"
    xmlns="http://www.w3.org/2000/svg"
    ref={ref}
    {...props}
  >
    <path d="M16.2 7.80668C15.94 7.54668 15.52 7.54668 15.26 7.80668L12 11.06L8.74 7.80001C8.48 7.54001 8.06 7.54001 7.8 7.80001C7.54 8.06001 7.54 8.48001 7.8 8.74001L11.06 12L7.8 15.26C7.54 15.52 7.54 15.94 7.8 16.2C8.06 16.46 8.48 16.46 8.74 16.2L12 12.94L15.26 16.2C15.52 16.46 15.94 16.46 16.2 16.2C16.46 15.94 16.46 15.52 16.2 15.26L12.94 12L16.2 8.74001C16.4533 8.48668 16.4533 8.06001 16.2 7.80668V7.80668Z" />
  </svg>
);

const ForwardRef = forwardRef<SVGSVGElement, Props>(IconClose);
export { ForwardRef as IconClose };
