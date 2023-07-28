import { SVGProps, forwardRef } from 'react';

interface Props extends SVGProps<SVGSVGElement> {}

const IconCommunity = (props, ref) => (
  <svg
    width={props.width ? props.width : 56}
    viewBox="0 0 56 56"
    fill="black"
    xmlns="http://www.w3.org/2000/svg"
    ref={ref}
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M11.5367 16.3333C11.5367 14.4003 13.1037 12.8333 15.0368 12.8333H41.9997C43.9327 12.8333 45.4997 14.4003 45.4997 16.3333V42C45.4997 43.9331 43.9327 45.5 41.9997 45.5H17.4997C15.5667 45.5 13.9997 43.9331 13.9997 42C13.9997 40.067 15.5667 38.5 17.4997 38.5H38.4997V19.8333H15.0368C13.1037 19.8333 11.5367 18.2664 11.5367 16.3333Z"
      fill="#E7E6F5"
    />
    <path
      d="M3.7385 7.92432C3.88264 5.91537 5.19155 4.35203 7.18275 4.04915C9.07086 3.76194 11.9848 3.5 16.3333 3.5C20.6819 3.5 23.5958 3.76194 25.484 4.04915C27.4751 4.35203 28.784 5.91537 28.9282 7.92432C29.0556 9.70051 29.1667 12.382 29.1667 16.3333C29.1667 20.2847 29.0556 22.9662 28.9282 24.7423C28.784 26.7513 27.4751 28.3147 25.484 28.6175C23.5958 28.9048 20.6819 29.1667 16.3333 29.1667C11.9848 29.1667 9.07086 28.9048 7.18275 28.6175C5.19155 28.3147 3.88264 26.7513 3.7385 24.7423C3.61107 22.9662 3.5 20.2847 3.5 16.3333C3.5 12.382 3.61107 9.70051 3.7385 7.92432Z"
      fill="#635AE2"
    />
    <path
      d="M17.5524 18.899C17.5931 18.2288 18.0291 17.7098 18.6948 17.623C19.2087 17.5559 19.9515 17.5 21 17.5C22.0485 17.5 22.7913 17.5559 23.3052 17.623C23.9709 17.7098 24.4069 18.2288 24.4476 18.899C24.4768 19.3782 24.5 20.0563 24.5 21C24.5 21.9437 24.4768 22.6218 24.4476 23.101C24.4069 23.7712 23.9709 24.2902 23.3052 24.377C22.7913 24.4441 22.0485 24.5 21 24.5C19.9515 24.5 19.2087 24.4441 18.6948 24.377C18.0291 24.2902 17.5931 23.7712 17.5524 23.101C17.5232 22.6218 17.5 21.9437 17.5 21C17.5 20.0563 17.5232 19.3782 17.5524 18.899Z"
      fill="#E7E6F5"
    />
    <path
      d="M33.918 12.1322C34.0123 10.1203 35.3163 8.57851 37.3198 8.3723C38.4657 8.25437 39.9927 8.16666 42 8.16666C44.0074 8.16666 45.5343 8.25437 46.6802 8.3723C48.6838 8.57851 49.9877 10.1202 50.0821 12.1322C50.1315 13.1837 50.1667 14.5568 50.1667 16.3333C50.1667 18.1098 50.1315 19.483 50.0821 20.5345C49.9877 22.5464 48.6838 24.0882 46.6802 24.2943C45.5343 24.4123 44.0074 24.5 42 24.5C39.9927 24.5 38.4657 24.4123 37.3198 24.2943C35.3163 24.0882 34.0123 22.5464 33.918 20.5345C33.8686 19.483 33.8334 18.1098 33.8334 16.3333C33.8334 14.5568 33.8686 13.1837 33.918 12.1322Z"
      fill="#635AE2"
    />
    <path
      d="M7.08458 37.7988C7.17892 35.7869 8.48292 34.2452 10.4864 34.039C11.6323 33.9211 13.1593 33.8333 15.1667 33.8333C17.174 33.8333 18.701 33.9211 19.8469 34.039C21.8504 34.2452 23.1544 35.7869 23.2488 37.7988C23.2981 38.8504 23.3333 40.2235 23.3333 42C23.3333 43.7765 23.2981 45.1497 23.2488 46.2012C23.1544 48.2131 21.8504 49.7548 19.8469 49.961C18.701 50.0789 17.174 50.1667 15.1667 50.1667C13.1593 50.1667 11.6323 50.0789 10.4864 49.961C8.48292 49.7548 7.17892 48.2131 7.08458 46.2012C7.03528 45.1497 7 43.7765 7 42C7 40.2235 7.03528 38.8504 7.08458 37.7988Z"
      fill="#635AE2"
    />
    <path
      d="M31.657 35.6968C31.7792 33.6864 33.0872 32.1294 35.0845 31.8688C36.6262 31.6675 38.8544 31.5 42 31.5C45.1456 31.5 47.3738 31.6675 48.9155 31.8688C50.9128 32.1294 52.2208 33.6864 52.343 35.6968C52.4303 37.1348 52.5 39.169 52.5 42C52.5 44.831 52.4303 46.8652 52.343 48.3031C52.2208 50.3135 50.9128 51.8706 48.9155 52.1312C47.3738 52.3325 45.1456 52.5 42 52.5C38.8544 52.5 36.6262 52.3325 35.0845 52.1312C33.0872 51.8706 31.7792 50.3135 31.657 48.3031C31.5696 46.8652 31.5 44.831 31.5 42C31.5 39.169 31.5696 37.1348 31.657 35.6968Z"
      fill="#635AE2"
    />
  </svg>
);

const ForwardRef = forwardRef<SVGSVGElement, Props>(IconCommunity);
export { ForwardRef as IconCommunity };
