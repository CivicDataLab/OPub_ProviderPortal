import { SVGProps, forwardRef } from 'react';

interface Props extends SVGProps<SVGSVGElement> {}

const IconDropdown = (props, ref) => (
  <svg
    width={props.width ? props.width : 24}
    viewBox="0 0 24 24"
    fill="black"
    xmlns="http://www.w3.org/2000/svg"
    ref={ref}
    {...props}
  >
    <path d="M7 10L12 15L17 10H7Z" />
  </svg>
);

const ForwardRef = forwardRef<SVGSVGElement, Props>(IconDropdown);
export { ForwardRef as IconDropdown };
