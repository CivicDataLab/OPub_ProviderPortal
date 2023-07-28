import { SVGProps, forwardRef } from 'react';

interface Props extends SVGProps<SVGSVGElement> {}

const IconFullScreenExit = (props, ref) => (
  <svg
    width={props.width ? props.width : 24}
    viewBox="0 0 24 24"
    fill="black"
    xmlns="http://www.w3.org/2000/svg"
    ref={ref}
    {...props}
  >
    <path d="M6 16H8V18C8 18.55 8.45 19 9 19C9.55 19 10 18.55 10 18V15C10 14.45 9.55 14 9 14H6C5.45 14 5 14.45 5 15C5 15.55 5.45 16 6 16ZM8 8H6C5.45 8 5 8.45 5 9C5 9.55 5.45 10 6 10H9C9.55 10 10 9.55 10 9V6C10 5.45 9.55 5 9 5C8.45 5 8 5.45 8 6V8ZM15 19C15.55 19 16 18.55 16 18V16H18C18.55 16 19 15.55 19 15C19 14.45 18.55 14 18 14H15C14.45 14 14 14.45 14 15V18C14 18.55 14.45 19 15 19ZM16 8V6C16 5.45 15.55 5 15 5C14.45 5 14 5.45 14 6V9C14 9.55 14.45 10 15 10H18C18.55 10 19 9.55 19 9C19 8.45 18.55 8 18 8H16Z" />
  </svg>
);

const ForwardRef = forwardRef<SVGSVGElement, Props>(IconFullScreenExit);
export { ForwardRef as IconFullScreenExit };
