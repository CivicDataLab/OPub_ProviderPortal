import { SVGProps, forwardRef } from 'react';

interface Props extends SVGProps<SVGSVGElement> {}

const IconLocation = (props, ref) => (
  <svg
    width={props.width ? props.width : 24}
    viewBox="0 0 24 24"
    fill="black"
    xmlns="http://www.w3.org/2000/svg"
    ref={ref}
    {...props}
  >
    <path d="M18 8C18 4.69 15.31 2 12 2C8.69 2 6 4.69 6 8C6 12.5 12 19 12 19C12 19 18 12.5 18 8ZM10 8C10 6.9 10.9 6 12 6C13.1 6 14 6.9 14 8C14 9.1 13.11 10 12 10C10.9 10 10 9.1 10 8ZM5 20V22H19V20H5Z" />
  </svg>
);

const ForwardRef = forwardRef<SVGSVGElement, Props>(IconLocation);
export { ForwardRef as IconLocation };
