import { SVGProps, forwardRef } from 'react';

interface Props extends SVGProps<SVGSVGElement> {}

const IconPopOut = (props, ref) => (
  <svg
    width={props.width ? props.width : 24}
    viewBox="0 0 24 24"
    fill="black"
    xmlns="http://www.w3.org/2000/svg"
    ref={ref}
    {...props}
  >
    <path d="M9 6C9.55228 6 10 6.44772 10 7C10 7.55228 9.55228 8 9 8H5V19H16V15C16 14.4477 16.4477 14 17 14C17.5523 14 18 14.4477 18 15V20C18 20.2652 17.8946 20.5196 17.7071 20.7071C17.5196 20.8946 17.2652 21 17 21H4C3.73478 21 3.48043 20.8946 3.29289 20.7071C3.10536 20.5196 3 20.2652 3 20V7C3 6.73478 3.10536 6.48043 3.29289 6.29289C3.48043 6.10536 3.73478 6 4 6H9ZM20 3C20.5523 3 21 3.44772 21 4V10C21 10.5523 20.5523 11 20 11C19.4477 11 19 10.5523 19 10V6.413L11.914 13.4999C11.5235 13.8904 10.8904 13.8904 10.5 13.5C10.1095 13.1095 10.1095 12.4765 10.4999 12.086L17.585 5H14C13.4477 5 13 4.55228 13 4C13 3.44772 13.4477 3 14 3H20Z" />
  </svg>
);

const ForwardRef = forwardRef<SVGSVGElement, Props>(IconPopOut);
export { ForwardRef as IconPopOut };
