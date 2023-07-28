import { SVGProps, forwardRef } from 'react';

interface Props extends SVGProps<SVGSVGElement> {}

const IconShare = (props, ref) => (
  <svg
    width={props.width ? props.width : 24}
    viewBox="0 0 24 24"
    fill="#020202"
    xmlns="http://www.w3.org/2000/svg"
    ref={ref}
    {...props}
  >
    <path d="M17.8333 13.6667C17.2751 13.6671 16.7226 13.7802 16.2091 13.9993C15.6956 14.2184 15.2316 14.5389 14.845 14.9417L10.2675 12.6525C10.3067 12.4371 10.3287 12.2189 10.3333 12C10.3288 11.7811 10.3068 11.5629 10.2675 11.3475L14.845 9.05835C15.518 9.75 16.4106 10.1861 17.3699 10.2919C18.3291 10.3977 19.2953 10.1666 20.1029 9.63823C20.9105 9.10988 21.5092 8.31713 21.7965 7.39582C22.0837 6.4745 22.0417 5.48196 21.6775 4.58825C21.3133 3.69454 20.6497 2.95528 19.8003 2.49714C18.9509 2.039 17.9686 1.8905 17.0218 2.07706C16.0749 2.26363 15.2224 2.77366 14.6103 3.51977C13.9982 4.26588 13.6646 5.20162 13.6667 6.16668C13.6712 6.38586 13.6932 6.60433 13.7325 6.82001L9.155 9.10751C8.57851 8.50961 7.83648 8.09764 7.02418 7.92449C6.21187 7.75133 5.36635 7.82489 4.59614 8.13573C3.82594 8.44656 3.16621 8.98048 2.70163 9.66896C2.23706 10.3574 1.98884 11.169 1.98884 11.9996C1.98884 12.8302 2.23706 13.6418 2.70163 14.3302C3.16621 15.0187 3.82594 15.5526 4.59614 15.8635C5.36635 16.1743 6.21187 16.2479 7.02418 16.0747C7.83648 15.9016 8.57851 15.4896 9.155 14.8917L13.7325 17.18C13.6932 17.3957 13.6712 17.6142 13.6667 17.8333C13.6667 18.6574 13.911 19.463 14.3689 20.1482C14.8267 20.8334 15.4775 21.3675 16.2388 21.6828C17.0002 21.9982 17.838 22.0807 18.6462 21.92C19.4545 21.7592 20.1969 21.3623 20.7796 20.7796C21.3623 20.1969 21.7592 19.4545 21.9199 18.6462C22.0807 17.838 21.9982 17.0002 21.6828 16.2388C21.3675 15.4775 20.8334 14.8267 20.1482 14.3689C19.463 13.9111 18.6574 13.6667 17.8333 13.6667Z" />{' '}
  </svg>
);

const ForwardRef = forwardRef<SVGSVGElement, Props>(IconShare);
export { ForwardRef as IconShare };