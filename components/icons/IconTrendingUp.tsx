import { SVGProps, forwardRef } from 'react';

interface Props extends SVGProps<SVGSVGElement> {}

const IconTrendingUp = (props, ref) => (
  <svg
    width={props.width ? props.width : 24}
    viewBox="0 0 24 24"
    fill="black"
    xmlns="http://www.w3.org/2000/svg"
    ref={ref}
    {...props}
  >
    <path d="M16.8688 6.8697L18.3128 8.30572L13.4462 13.1992L10.1472 9.91823C9.75612 9.52931 9.12612 9.53105 8.7372 9.92212L2.75379 15.9486C2.36486 16.3397 2.3666 16.9697 2.75767 17.3586C3.14875 17.7476 3.77874 17.7458 4.16767 17.3547L9.44304 12.0402L12.7421 15.3211C13.1332 15.71 13.7632 15.7083 14.1521 15.3172L19.7267 9.72183L21.1707 11.1579C21.4815 11.467 22.0209 11.2455 22.0197 10.8055L22.0078 6.50553C22.0171 6.22551 21.7965 6.00611 21.5165 6.00688L17.2265 6.01871C16.7765 6.01995 16.558 6.56055 16.8688 6.8697Z" />
  </svg>
);

const ForwardRef = forwardRef<SVGSVGElement, Props>(IconTrendingUp);
export { ForwardRef as IconTrendingUp };
