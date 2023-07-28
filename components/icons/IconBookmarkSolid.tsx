import { SVGProps, forwardRef } from 'react';

interface Props extends SVGProps<SVGSVGElement> {}

const IconBookmarkSolid = (props, ref) => (
  <svg
    width={props.width ? props.width : 24}
    viewBox="0 0 24 24"
    fill="black"
    xmlns="http://www.w3.org/2000/svg"
    ref={ref}
    {...props}
  >
    <path d="M6.05 20.55C5.8 20.6667 5.5625 20.65 5.3375 20.5C5.1125 20.35 5 20.1417 5 19.875V4.375C5 3.975 5.15 3.625 5.45 3.325C5.75 3.025 6.1 2.875 6.5 2.875H17.5C17.9 2.875 18.25 3.025 18.55 3.325C18.85 3.625 19 3.975 19 4.375V19.875C19 20.1417 18.8875 20.35 18.6625 20.5C18.4375 20.65 18.2 20.6667 17.95 20.55L12 18L6.05 20.55Z" />
  </svg>
);

const ForwardRef = forwardRef<SVGSVGElement, Props>(IconBookmarkSolid);
export { ForwardRef as IconBookmarkSolid };
