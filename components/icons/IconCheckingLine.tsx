import { SVGProps, forwardRef } from 'react';

interface Props extends SVGProps<SVGSVGElement> {}

const IconCheckingLine = (props, ref) => (
  <svg
    width={props.width ? props.width : 24}
    viewBox="0 0 24 24"
    fill="black"
    xmlns="http://www.w3.org/2000/svg"
    ref={ref}
    {...props}
  >
    <path
      d="M16.32 8.29935C16.2319 8.23444 16.1319 8.18752 16.0257 8.16126C15.9195 8.13501 15.8092 8.12994 15.701 8.14635C15.5929 8.16276 15.489 8.20032 15.3954 8.25688C15.3017 8.31345 15.2202 8.38791 15.1553 8.47602L11.206 13.836L8.69465 11.8267C8.5215 11.694 8.30327 11.6345 8.08674 11.6609C7.87022 11.6872 7.67263 11.7973 7.53634 11.9676C7.40005 12.1379 7.3359 12.3548 7.35764 12.5719C7.37938 12.7889 7.48529 12.9888 7.65265 13.1287L10.8413 15.6793C10.9294 15.7483 11.0304 15.7989 11.1383 15.8284C11.2462 15.8579 11.3589 15.8655 11.4699 15.8509C11.5808 15.8364 11.6877 15.7998 11.7843 15.7434C11.8809 15.6871 11.9653 15.612 12.0326 15.5227L16.4993 9.46468C16.5641 9.37641 16.6109 9.27623 16.6369 9.16988C16.663 9.06352 16.6678 8.95307 16.6512 8.84485C16.6345 8.73662 16.5967 8.63274 16.5399 8.53914C16.483 8.44554 16.4083 8.36406 16.32 8.29935Z"
      fill={props.fill}
    />
    <path
      d="M12 4C10.4177 4 8.87103 4.46919 7.55544 5.34824C6.23985 6.22729 5.21447 7.47672 4.60897 8.93853C4.00347 10.4003 3.84504 12.0089 4.15372 13.5607C4.4624 15.1126 5.22433 16.538 6.34315 17.6568C7.46197 18.7757 8.88743 19.5376 10.4393 19.8463C11.9911 20.155 13.5997 19.9965 15.0615 19.391C16.5233 18.7855 17.7727 17.7601 18.6518 16.4446C19.5308 15.129 20 13.5822 20 12C19.9977 9.87897 19.1541 7.84547 17.6543 6.34568C16.1545 4.84588 14.121 4.00229 12 4V4ZM12 18.6667C10.6815 18.6667 9.39253 18.2757 8.2962 17.5431C7.19987 16.8106 6.34539 15.7694 5.84081 14.5512C5.33622 13.333 5.2042 11.9926 5.46143 10.6994C5.71867 9.40619 6.35361 8.2183 7.28596 7.28595C8.21831 6.3536 9.40619 5.71867 10.6994 5.46143C11.9926 5.2042 13.333 5.33622 14.5512 5.8408C15.7694 6.34539 16.8106 7.19987 17.5431 8.2962C18.2757 9.39252 18.6667 10.6815 18.6667 12C18.6647 13.7675 17.9617 15.4621 16.7119 16.7119C15.4621 17.9617 13.7675 18.6647 12 18.6667Z"
      fill={props.fill}
    />
  </svg>
);

const ForwardRef = forwardRef<SVGSVGElement, Props>(IconCheckingLine);
export { ForwardRef as IconCheckingLine };