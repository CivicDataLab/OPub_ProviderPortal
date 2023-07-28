import { SVGProps, Ref, forwardRef } from 'react';

interface Props extends SVGProps<SVGSVGElement> {}

const External = (props, ref) => (
  <svg
    width={props.width ? props.width : 48}
    ref={ref}
    {...props}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="24" height="24" rx="2" fill="#FCF3EC" />
    <g>
      <path
        d="M11 17.1775C10.6442 17.135 10.2955 17.0457 9.963 16.912C9.703 17.172 9.213 17.6855 9.1065 17.793C8.72186 18.1772 8.20039 18.3929 7.65674 18.3928C7.11309 18.3926 6.59175 18.1766 6.20733 17.7922C5.82291 17.4078 5.60687 16.8864 5.60672 16.3428C5.60656 15.7991 5.8223 15.2777 6.2065 14.893L9.8 11.3C10.0223 11.0842 10.2861 10.9157 10.5753 10.8046C10.8646 10.6936 11.1734 10.6424 11.483 10.654C11.8689 10.6642 12.2439 10.7843 12.564 11H14.4405C14.2801 10.7025 14.0781 10.4294 13.8405 10.189C13.1535 9.51871 12.2304 9.14551 11.2706 9.15C10.3108 9.15449 9.39121 9.53631 8.7105 10.213L5.1195 13.806C4.44658 14.4789 4.06853 15.3916 4.06853 16.3433C4.06853 17.2949 4.44658 18.2076 5.1195 18.8805C5.79242 19.5534 6.70509 19.9315 7.65675 19.9315C8.6084 19.9315 9.52108 19.5534 10.194 18.8805C10.302 18.7725 10.634 18.4305 11 18.06V17.1775Z"
        fill="#AE5816"
      />
      <path
        d="M14.861 6.23949C15.0514 6.0489 15.2774 5.89768 15.5263 5.79448C15.7751 5.69129 16.0419 5.63813 16.3112 5.63805C16.5806 5.63798 16.8474 5.69098 17.0963 5.79403C17.3452 5.89709 17.5713 6.04818 17.7618 6.23866C17.9523 6.42915 18.1034 6.6553 18.2065 6.9042C18.3095 7.1531 18.3625 7.41986 18.3624 7.68925C18.3624 7.95864 18.3092 8.22537 18.206 8.47421C18.1028 8.72305 17.9516 8.94911 17.761 9.13949L15.9 11H18.0745L18.85 10.2265C19.5219 9.55304 19.899 8.64041 19.8984 7.68911C19.8979 6.7378 19.5197 5.82562 18.8471 5.15294C18.1744 4.48027 17.2622 4.10212 16.3109 4.10156C15.3596 4.10101 14.447 4.4781 13.7735 5.14999C13.581 5.34249 11.6415 7.26099 11.098 7.80449C11.7367 7.75997 12.3771 7.86385 12.969 8.10799C13.2295 7.84999 14.7535 6.34699 14.861 6.23949Z"
        fill="#AE5816"
      />
      <path
        d="M11 12.625C10.7956 12.4506 10.6391 12.2269 10.5455 11.975C10.4675 12.0184 10.3956 12.0718 10.3315 12.134L9.5135 12.99C9.67633 13.2971 9.883 13.5789 10.127 13.8265C10.382 14.0718 10.6773 14.2714 11 14.4165V12.625Z"
        fill="#AE5816"
      />
      <path
        d="M12 12.5V20.5C12 20.6326 12.0527 20.7598 12.1464 20.8536C12.2402 20.9473 12.3674 21 12.5 21H20.5C20.6326 21 20.7598 20.9473 20.8536 20.8536C20.9473 20.7598 21 20.6326 21 20.5V12.5C21 12.3674 20.9473 12.2402 20.8536 12.1464C20.7598 12.0527 20.6326 12 20.5 12H12.5C12.3674 12 12.2402 12.0527 12.1464 12.1464C12.0527 12.2402 12 12.3674 12 12.5ZM20 20H13V14H20V20Z"
        fill="#AE5816"
      />
    </g>
    <defs>
      <clipPath id="clip0_355_20654">
        <rect width="18" height="18" fill="white" transform="translate(3 3)" />
      </clipPath>
    </defs>
  </svg>
);

const ForwardRef = forwardRef<SVGSVGElement, Props>(External);
export { ForwardRef as External };
