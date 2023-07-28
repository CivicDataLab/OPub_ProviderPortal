import { SVGProps, forwardRef } from 'react';

interface Props extends SVGProps<SVGSVGElement> {}

const IconPieChart = (props, ref) => (
  <svg
    width={props.width ? props.width : 24}
    viewBox="0 0 24 24"
    fill="black"
    xmlns="http://www.w3.org/2000/svg"
    ref={ref}
    {...props}
  >
    <path d="M11 3.18002V20.82C11 21.46 10.41 21.94 9.79 21.8C5.32 20.8 2 16.79 2 12C2 7.21002 5.32 3.20002 9.79 2.20002C10.41 2.06002 11 2.54002 11 3.18002ZM13.03 3.18002V9.99002C13.03 10.54 13.48 10.99 14.03 10.99H20.82C21.46 10.99 21.94 10.4 21.8 9.77002C20.95 6.01002 18 3.05002 14.25 2.20002C13.62 2.06002 13.03 2.54002 13.03 3.18002ZM13.03 14.01V20.82C13.03 21.46 13.62 21.94 14.25 21.8C18.01 20.95 20.96 17.98 21.81 14.22C21.95 13.6 21.46 13 20.83 13H14.04C13.48 13.01 13.03 13.46 13.03 14.01Z" />
  </svg>
);

const ForwardRef = forwardRef<SVGSVGElement, Props>(IconPieChart);
export { ForwardRef as IconPieChart };
