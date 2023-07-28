import { SVGProps, forwardRef } from 'react';

interface Props extends SVGProps<SVGSVGElement> {}

const IconBigArrow = (props, ref) => (
  <svg
    width={props.width ? props.width : 24}
    viewBox="0 0 24 24"
    fill="black"
    xmlns="http://www.w3.org/2000/svg"
    ref={ref}
    {...props}
  >
    <path d="M7.38 21.01C7.87 21.5 8.66 21.5 9.15 21.01L17.46 12.7C17.85 12.31 17.85 11.68 17.46 11.29L9.15 2.98C8.66 2.49 7.87 2.49 7.38 2.98C6.89 3.47 6.89 4.26 7.38 4.75L14.62 12L7.37 19.25C6.89 19.73 6.89 20.53 7.38 21.01Z" />
  </svg>
);

const ForwardRef = forwardRef<SVGSVGElement, Props>(IconBigArrow);
export { ForwardRef as IconBigArrow };
