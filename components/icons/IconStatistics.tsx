import { SVGProps, forwardRef } from 'react';

interface Props extends SVGProps<SVGSVGElement> {}

const IconStatistics = (props, ref) => (
  <svg
    width={props.width ? props.width : 24}
    viewBox="0 0 24 24"
    fill="#635AE2"
    xmlns="http://www.w3.org/2000/svg"
    ref={ref}
    {...props}
  >
    <path
      d="M21.7102 10.0659L16.6157 12.0834C15.4235 12.5149 14.17 12.7529 12.9027 12.7884H10.6394C9.56657 12.8327 8.51428 13.0968 7.54751 13.5642L2.10992 16.5C2.07676 16.5176 2.04901 16.5439 2.02964 16.576C2.01028 16.6082 2.00003 16.645 2 16.6825V19.0259C2.00007 19.0635 2.01032 19.1004 2.02965 19.1326C2.04899 19.1649 2.07669 19.1913 2.10982 19.2091C2.14295 19.2269 2.18027 19.2353 2.21782 19.2336C2.25537 19.2319 2.29175 19.22 2.32309 19.1992L6.99542 16.1025C8.10729 15.4384 9.38591 15.1067 10.6802 15.1467L12.9535 15.3134C14.0874 15.3667 15.2237 15.2827 16.3376 15.0634L21.8335 13.8242C21.8803 13.8146 21.9225 13.7892 21.9528 13.7521C21.9832 13.7151 21.9998 13.6688 22 13.6209V10.2592C21.9997 10.2253 21.9913 10.192 21.9753 10.1621C21.9593 10.1323 21.9363 10.1067 21.9083 10.0877C21.8803 10.0687 21.8481 10.0568 21.8145 10.053C21.7808 10.0492 21.7468 10.0536 21.7152 10.0659H21.7102Z"
      fill="#635AE2"
    />
    <path
      d="M21.4446 2.46667C21.2836 2.40829 21.1086 2.40097 20.9434 2.44571C20.7781 2.49044 20.6307 2.58506 20.5211 2.71667L16.3859 7.70917C16.1792 7.92731 15.9183 8.08651 15.6299 8.17043C15.3415 8.25434 15.0359 8.25994 14.7446 8.18667L11.791 7.15667C10.593 6.79721 9.30197 6.92073 8.19369 7.50083L3.97768 9.93417C3.94607 9.95243 3.91021 9.96206 3.8737 9.96208C3.83719 9.9621 3.80132 9.95251 3.76969 9.93427C3.73805 9.91604 3.71177 9.8898 3.69347 9.85819C3.67517 9.82657 3.66549 9.7907 3.66542 9.75417V2.83333C3.66542 2.61232 3.57769 2.40036 3.42152 2.24408C3.26536 2.0878 3.05356 2 2.83271 2C2.61186 2 2.40006 2.0878 2.2439 2.24408C2.08773 2.40036 2 2.61232 2 2.83333V14.7858C1.99988 14.822 2.00918 14.8575 2.02699 14.8889C2.04479 14.9203 2.07048 14.9465 2.10152 14.965C2.13256 14.9834 2.16786 14.9934 2.20395 14.994C2.24003 14.9946 2.27565 14.9857 2.30727 14.9683L6.95545 12.4625C8.10414 11.8966 9.35977 11.581 10.6394 11.5367H12.9027C14.0143 11.4998 15.1135 11.2906 16.161 10.9167L21.8676 8.66C21.9063 8.64456 21.9395 8.61791 21.9629 8.58346C21.9864 8.54901 21.999 8.50834 21.9992 8.46667V3.25C21.9987 3.07814 21.9452 2.91062 21.8459 2.77038C21.7466 2.63015 21.6065 2.52407 21.4446 2.46667Z"
      fill="#635AE2"
    />
    <path
      d="M21.7402 15.1217L16.6116 16.2784C15.3787 16.5251 14.1201 16.6186 12.8644 16.5567L10.5919 16.39C9.57343 16.3695 8.56883 16.6289 7.68742 17.14L2.12326 20.8267C2.08864 20.8511 2.06217 20.8854 2.04732 20.9251C2.03246 20.9648 2.02991 21.008 2.03998 21.0492C2.10396 21.3181 2.25605 21.5578 2.47202 21.7302C2.68799 21.9025 2.95539 21.9975 3.23159 22H20.7634C21.0923 21.9974 21.4067 21.8643 21.6376 21.6299C21.8685 21.3956 21.997 21.0791 21.995 20.75V15.3242C21.9946 15.2935 21.9875 15.2633 21.9741 15.2356C21.9607 15.208 21.9414 15.1836 21.9176 15.1643C21.8937 15.145 21.8659 15.1311 21.8361 15.1238C21.8063 15.1164 21.7753 15.1157 21.7452 15.1217H21.7402Z"
      fill="#635AE2"
    />
  </svg>
);

const ForwardRef = forwardRef<SVGSVGElement, Props>(IconStatistics);
export { ForwardRef as IconStatistics };
