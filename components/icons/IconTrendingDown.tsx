import { SVGProps, forwardRef } from 'react';

interface Props extends SVGProps<SVGSVGElement> {}

const IconTrendingDown = (props, ref) => (
  <svg
    width={props.width ? props.width : 24}
    viewBox="0 0 24 24"
    fill="black"
    xmlns="http://www.w3.org/2000/svg"
    ref={ref}
    {...props}
  >
    <path d="M16.8972 18.1035L18.3332 16.6595L13.4398 11.793L10.1589 15.0921C9.76995 15.4831 9.13996 15.4849 8.74888 15.0959L2.73234 9.10251C2.34127 8.71358 2.33953 8.08358 2.72846 7.69251C3.11738 7.30144 3.74738 7.2997 4.13845 7.68862L9.44304 12.974L12.724 9.67497C13.1129 9.2839 13.7429 9.28216 14.134 9.67108L19.7393 15.2357L21.1753 13.7917C21.4845 13.4808 22.0251 13.6993 22.0263 14.1393L22.0381 18.4293C22.0389 18.7093 21.8195 18.9299 21.5395 18.9307L17.2495 18.9425C16.8095 18.9537 16.5881 18.4144 16.8972 18.1035Z" />
  </svg>
);

const ForwardRef = forwardRef<SVGSVGElement, Props>(IconTrendingDown);
export { ForwardRef as IconTrendingDown };
