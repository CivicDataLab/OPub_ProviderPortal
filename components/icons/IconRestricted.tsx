import { forwardRef, SVGProps } from 'react';

interface Props extends SVGProps<SVGSVGElement> {}

const IconRestricted = (props, ref) => (
  <svg
    width={props.width ? props.width : 24}
    viewBox="0 0 24 24"
    fill="black"
    xmlns="http://www.w3.org/2000/svg"
    ref={ref}
    {...props}
  >
    <path d="M18.25 9.91667H17.625V7.625C17.625 6.13316 17.0324 4.70242 15.9775 3.64752C14.9226 2.59263 13.4918 2 12 2C10.5082 2 9.07742 2.59263 8.02253 3.64752C6.96763 4.70242 6.375 6.13316 6.375 7.625V9.91667H5.75C5.30798 9.91667 4.88405 10.0923 4.57149 10.4048C4.25893 10.7174 4.08334 11.1413 4.08334 11.5833V20.3333C4.08334 20.7754 4.25893 21.1993 4.57149 21.5118C4.88405 21.8244 5.30798 22 5.75 22H18.25C18.692 22 19.116 21.8244 19.4285 21.5118C19.7411 21.1993 19.9167 20.7754 19.9167 20.3333V11.5833C19.9167 11.1413 19.7411 10.7174 19.4285 10.4048C19.116 10.0923 18.692 9.91667 18.25 9.91667ZM14.9167 17C14.7519 17 14.5907 16.9511 14.4537 16.8596C14.3167 16.768 14.2098 16.6378 14.1468 16.4856C14.0837 16.3333 14.0672 16.1657 14.0993 16.0041C14.1315 15.8424 14.2109 15.694 14.3274 15.5774C14.444 15.4609 14.5924 15.3815 14.7541 15.3493C14.9157 15.3172 15.0833 15.3337 15.2356 15.3968C15.3878 15.4598 15.518 15.5666 15.6096 15.7037C15.7011 15.8407 15.75 16.0018 15.75 16.1667C15.75 16.3877 15.6622 16.5996 15.5059 16.7559C15.3496 16.9122 15.1377 17 14.9167 17ZM15.75 19.0833C15.75 19.2481 15.7011 19.4093 15.6096 19.5463C15.518 19.6833 15.3878 19.7902 15.2356 19.8532C15.0833 19.9163 14.9157 19.9328 14.7541 19.9007C14.5924 19.8685 14.444 19.7891 14.3274 19.6726C14.2109 19.556 14.1315 19.4076 14.0993 19.2459C14.0672 19.0843 14.0837 18.9167 14.1468 18.7644C14.2098 18.6122 14.3167 18.482 14.4537 18.3904C14.5907 18.2989 14.7519 18.25 14.9167 18.25C15.1377 18.25 15.3496 18.3378 15.5059 18.4941C15.6622 18.6504 15.75 18.8623 15.75 19.0833ZM14.9167 14.0833C14.7519 14.0833 14.5907 14.0345 14.4537 13.9429C14.3167 13.8513 14.2098 13.7212 14.1468 13.5689C14.0837 13.4166 14.0672 13.2491 14.0993 13.0874C14.1315 12.9258 14.2109 12.7773 14.3274 12.6607C14.444 12.5442 14.5924 12.4648 14.7541 12.4327C14.9157 12.4005 15.0833 12.417 15.2356 12.4801C15.3878 12.5432 15.518 12.65 15.6096 12.787C15.7011 12.9241 15.75 13.0852 15.75 13.25C15.75 13.471 15.6622 13.683 15.5059 13.8393C15.3496 13.9955 15.1377 14.0833 14.9167 14.0833ZM12 17C11.8352 17 11.6741 16.9511 11.537 16.8596C11.4 16.768 11.2932 16.6378 11.2301 16.4856C11.167 16.3333 11.1505 16.1657 11.1827 16.0041C11.2148 15.8424 11.2942 15.694 11.4107 15.5774C11.5273 15.4609 11.6758 15.3815 11.8374 15.3493C11.9991 15.3172 12.1666 15.3337 12.3189 15.3968C12.4712 15.4598 12.6013 15.5666 12.6929 15.7037C12.7845 15.8407 12.8333 16.0018 12.8333 16.1667C12.8333 16.3877 12.7455 16.5996 12.5893 16.7559C12.433 16.9122 12.221 17 12 17ZM12.8333 19.0833C12.8333 19.2481 12.7845 19.4093 12.6929 19.5463C12.6013 19.6833 12.4712 19.7902 12.3189 19.8532C12.1666 19.9163 11.9991 19.9328 11.8374 19.9007C11.6758 19.8685 11.5273 19.7891 11.4107 19.6726C11.2942 19.556 11.2148 19.4076 11.1827 19.2459C11.1505 19.0843 11.167 18.9167 11.2301 18.7644C11.2932 18.6122 11.4 18.482 11.537 18.3904C11.6741 18.2989 11.8352 18.25 12 18.25C12.221 18.25 12.433 18.3378 12.5893 18.4941C12.7455 18.6504 12.8333 18.8623 12.8333 19.0833ZM12 14.0833C11.8352 14.0833 11.6741 14.0345 11.537 13.9429C11.4 13.8513 11.2932 13.7212 11.2301 13.5689C11.167 13.4166 11.1505 13.2491 11.1827 13.0874C11.2148 12.9258 11.2942 12.7773 11.4107 12.6607C11.5273 12.5442 11.6758 12.4648 11.8374 12.4327C11.9991 12.4005 12.1666 12.417 12.3189 12.4801C12.4712 12.5432 12.6013 12.65 12.6929 12.787C12.7845 12.9241 12.8333 13.0852 12.8333 13.25C12.8333 13.471 12.7455 13.683 12.5893 13.8393C12.433 13.9955 12.221 14.0833 12 14.0833ZM9.08334 17C8.91852 17 8.7574 16.9511 8.62036 16.8596C8.48332 16.768 8.37651 16.6378 8.31344 16.4856C8.25036 16.3333 8.23386 16.1657 8.26601 16.0041C8.29817 15.8424 8.37754 15.694 8.49408 15.5774C8.61062 15.4609 8.75911 15.3815 8.92076 15.3493C9.08241 15.3172 9.24997 15.3337 9.40224 15.3968C9.55451 15.4598 9.68466 15.5666 9.77623 15.7037C9.86779 15.8407 9.91667 16.0018 9.91667 16.1667C9.91667 16.3877 9.82887 16.5996 9.67259 16.7559C9.51631 16.9122 9.30435 17 9.08334 17ZM9.91667 19.0833C9.91667 19.2481 9.86779 19.4093 9.77623 19.5463C9.68466 19.6833 9.55451 19.7902 9.40224 19.8532C9.24997 19.9163 9.08241 19.9328 8.92076 19.9007C8.75911 19.8685 8.61062 19.7891 8.49408 19.6726C8.37754 19.556 8.29817 19.4076 8.26601 19.2459C8.23386 19.0843 8.25036 18.9167 8.31344 18.7644C8.37651 18.6122 8.48332 18.482 8.62036 18.3904C8.7574 18.2989 8.91852 18.25 9.08334 18.25C9.30435 18.25 9.51631 18.3378 9.67259 18.4941C9.82887 18.6504 9.91667 18.8623 9.91667 19.0833ZM9.08334 14.0833C8.91852 14.0833 8.7574 14.0345 8.62036 13.9429C8.48332 13.8513 8.37651 13.7212 8.31344 13.5689C8.25036 13.4166 8.23386 13.2491 8.26601 13.0874C8.29817 12.9258 8.37754 12.7773 8.49408 12.6607C8.61062 12.5442 8.75911 12.4648 8.92076 12.4327C9.08241 12.4005 9.24997 12.417 9.40224 12.4801C9.55451 12.5432 9.68466 12.65 9.77623 12.787C9.86779 12.9241 9.91667 13.0852 9.91667 13.25C9.91667 13.471 9.82887 13.683 9.67259 13.8393C9.51631 13.9955 9.30435 14.0833 9.08334 14.0833ZM8.45834 7.625C8.45834 6.68569 8.83147 5.78485 9.49567 5.12066C10.1599 4.45647 11.0607 4.08333 12 4.08333C12.9393 4.08333 13.8401 4.45647 14.5043 5.12066C15.1685 5.78485 15.5417 6.68569 15.5417 7.625V9.5C15.5417 9.61051 15.4978 9.71649 15.4196 9.79463C15.3415 9.87277 15.2355 9.91667 15.125 9.91667H8.875C8.7645 9.91667 8.65851 9.87277 8.58037 9.79463C8.50223 9.71649 8.45834 9.61051 8.45834 9.5V7.625Z" />
  </svg>
);

const ForwardRef = forwardRef<SVGSVGElement, Props>(IconRestricted);
export { ForwardRef as IconRestricted };