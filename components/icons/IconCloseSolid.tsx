import { SVGProps, forwardRef } from 'react';

interface Props extends SVGProps<SVGSVGElement> {}

const IconCloseSolid = (props, ref) => (
  <svg
    width={props.width ? props.width : 24}
    viewBox="0 0 24 24"
    fill="black"
    xmlns="http://www.w3.org/2000/svg"
    ref={ref}
    {...props}
  >
    <path d="M4.92893 4.92892C1.0257 8.83215 1.0257 15.1678 4.92893 19.0711C8.83216 22.9743 15.1678 22.9743 19.0711 19.0711C22.9743 15.1678 22.9743 8.83215 19.0711 4.92892C15.1678 1.02569 8.83216 1.02569 4.92893 4.92892ZM16.2426 9.17156L13.4142 12L16.2426 14.8284L14.8284 16.2426L12 13.4142L9.17157 16.2426L7.75736 14.8284L10.5858 12L7.75736 9.17156L9.17157 7.75734L12 10.5858L14.8284 7.75734L16.2426 9.17156Z" />
  </svg>
);

const ForwardRef = forwardRef<SVGSVGElement, Props>(IconCloseSolid);
export { ForwardRef as IconCloseSolid };
