import { SVGProps, forwardRef } from 'react';

interface Props extends SVGProps<SVGSVGElement> {}

const IconInfo = (props, ref) => (
  <svg
    width={props.width ? props.width : 24}
    viewBox="0 0 24 24"
    fill="black"
    xmlns="http://www.w3.org/2000/svg"
    ref={ref}
    {...props}
  >
    <path
      d="M12 2C6.475 2 2 6.475 2 12C2 17.525 6.475 22 12 22C17.525 22 22 17.525 22 12C22 6.475 17.525 2 12 2ZM13 17H11V11H13V17ZM13 9H11V7H13V9Z"
      fillOpacity={0.87}
    />
  </svg>
);

const ForwardRef = forwardRef<SVGSVGElement, Props>(IconInfo);
export { ForwardRef as IconInfo };
