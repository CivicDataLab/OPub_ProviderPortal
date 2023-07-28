import { SVGProps, forwardRef } from 'react';

interface Props extends SVGProps<SVGSVGElement> {}

const IconLinkedin = (props, ref) => (
  <svg
    width={props.width ? props.width : 24}
    viewBox="0 0 24 24"
    fill="black"
    xmlns="http://www.w3.org/2000/svg"
    ref={ref}
    {...props}
  >
    <path
      fill={props.fill || 'white'}
      d="M7.09234 5.00089C7.09207 5.53129 6.87623 6.03987 6.49231 6.41473C6.10838 6.7896 5.58783 7.00004 5.04515 6.99978C4.50247 6.99951 3.98213 6.78856 3.59859 6.41332C3.21505 6.03808 2.99973 5.52929 3 4.99889C3.00027 4.46849 3.21611 3.95991 3.60003 3.58505C3.98396 3.21018 4.50452 2.99974 5.04719 3C5.58987 3.00027 6.11021 3.21122 6.49375 3.58646C6.87729 3.9617 7.09261 4.47049 7.09234 5.00089ZM7.15373 8.4807H3.06139V21H7.15373V8.4807ZM13.6196 8.4807H9.54774V21H13.5787V14.4304C13.5787 10.7706 18.4588 10.4306 18.4588 14.4304V21H22.5V13.0704C22.5 6.90078 15.277 7.13077 13.5787 10.1606L13.6196 8.4807Z"
    />
  </svg>
);

const ForwardRef = forwardRef<SVGSVGElement, Props>(IconLinkedin);
export { ForwardRef as IconLinkedin };
