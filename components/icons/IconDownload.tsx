import { SVGProps, forwardRef } from 'react';

interface Props extends SVGProps<SVGSVGElement> {}

const IconDownload = (props, ref) => (
  <svg
    width={props.width ? props.width : 24}
    viewBox="0 0 24 24"
    fill="black"
    xmlns="http://www.w3.org/2000/svg"
    ref={ref}
    {...props}
  >
    <path d="M16.59 9H15V4C15 3.45 14.55 3 14 3H10C9.45 3 9 3.45 9 4V9H7.41C6.52 9 6.07 10.08 6.7 10.71L11.29 15.3C11.68 15.69 12.31 15.69 12.7 15.3L17.29 10.71C17.92 10.08 17.48 9 16.59 9ZM5 19C5 19.55 5.45 20 6 20H18C18.55 20 19 19.55 19 19C19 18.45 18.55 18 18 18H6C5.45 18 5 18.45 5 19Z" />
  </svg>
);

const ForwardRef = forwardRef<SVGSVGElement, Props>(IconDownload);
export { ForwardRef as IconDownload };
