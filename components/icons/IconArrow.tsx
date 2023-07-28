import { SVGProps, forwardRef } from 'react';

interface Props extends SVGProps<SVGSVGElement> {}

const IconArrow = (props, ref) => (
  <svg
    width={props.width ? props.width : 24}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    ref={ref}
    {...props}
  >
    <path d="M10.1934 8.47334C9.93335 8.73334 9.93335 9.15334 10.1934 9.41334L12.78 12L10.1934 14.5867C9.93335 14.8467 9.93335 15.2667 10.1934 15.5267C10.4534 15.7867 10.8734 15.7867 11.1334 15.5267L14.1934 12.4667C14.4534 12.2067 14.4534 11.7867 14.1934 11.5267L11.1334 8.46667C10.88 8.21334 10.4534 8.21334 10.1934 8.47334Z" />
  </svg>
);

const ForwardRef = forwardRef<SVGSVGElement, Props>(IconArrow);
export { ForwardRef as IconArrow };
