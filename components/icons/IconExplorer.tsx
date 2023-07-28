import { SVGProps, forwardRef } from 'react';

interface Props extends SVGProps<SVGSVGElement> {}

const IconExplorer = (props, ref) => (
  <svg
    width={props.width ? props.width : 24}
    viewBox="0 0 24 24"
    fill="black"
    xmlns="http://www.w3.org/2000/svg"
    ref={ref}
    {...props}
  >
    <path d="M19 21H13C11.9 21 11 20.1 11 19V5C11 3.9 11.9 3 13 3H19C20.1 3 21 3.9 21 5V19C21 20.1 20.1 21 19 21ZM5 21H7C8.1 21 9 20.1 9 19V13C9 11.9 8.1 11 7 11H5C3.9 11 3 11.9 3 13V19C3 20.1 3.9 21 5 21ZM9 7V5C9 3.9 8.1 3 7 3H5C3.9 3 3 3.9 3 5V7C3 8.1 3.9 9 5 9H7C8.1 9 9 8.1 9 7Z" />
  </svg>
);

const ForwardRef = forwardRef<SVGSVGElement, Props>(IconExplorer);
export { ForwardRef as IconExplorer };
