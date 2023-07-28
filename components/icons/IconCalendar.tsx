import { SVGProps, forwardRef } from 'react';

interface Props extends SVGProps<SVGSVGElement> {}

const IconCalendar = (props, ref) => (
  <svg
    width={props.width ? props.width : 24}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    ref={ref}
    {...props}
  >
    <path
      d="M8.25001 10.75H7.41668C7.19566 10.75 6.9837 10.8378 6.82742 10.9941C6.67114 11.1504 6.58334 11.3623 6.58334 11.5833C6.58334 11.8043 6.67114 12.0163 6.82742 12.1726C6.9837 12.3289 7.19566 12.4167 7.41668 12.4167H8.25001C8.47102 12.4167 8.68299 12.3289 8.83927 12.1726C8.99555 12.0163 9.08334 11.8043 9.08334 11.5833C9.08334 11.3623 8.99555 11.1504 8.83927 10.9941C8.68299 10.8378 8.47102 10.75 8.25001 10.75Z"
      fill={props.fill}
    />
    <path
      d="M12.4167 10.75H11.5833C11.3623 10.75 11.1504 10.8378 10.9941 10.9941C10.8378 11.1504 10.75 11.3623 10.75 11.5833C10.75 11.8043 10.8378 12.0163 10.9941 12.1726C11.1504 12.3289 11.3623 12.4167 11.5833 12.4167H12.4167C12.6377 12.4167 12.8496 12.3289 13.0059 12.1726C13.1622 12.0163 13.25 11.8043 13.25 11.5833C13.25 11.3623 13.1622 11.1504 13.0059 10.9941C12.8496 10.8378 12.6377 10.75 12.4167 10.75Z"
      fill={props.fill}
    />
    <path
      d="M16.5833 10.75H15.75C15.529 10.75 15.317 10.8378 15.1607 10.9941C15.0045 11.1504 14.9167 11.3623 14.9167 11.5833C14.9167 11.8043 15.0045 12.0163 15.1607 12.1726C15.317 12.3289 15.529 12.4167 15.75 12.4167H16.5833C16.8044 12.4167 17.0163 12.3289 17.1726 12.1726C17.3289 12.0163 17.4167 11.8043 17.4167 11.5833C17.4167 11.3623 17.3289 11.1504 17.1726 10.9941C17.0163 10.8378 16.8044 10.75 16.5833 10.75Z"
      fill={props.fill}
    />
    <path
      d="M8.25001 14.0833H7.41668C7.19566 14.0833 6.9837 14.1711 6.82742 14.3274C6.67114 14.4837 6.58334 14.6956 6.58334 14.9166C6.58334 15.1377 6.67114 15.3496 6.82742 15.5059C6.9837 15.6622 7.19566 15.75 7.41668 15.75H8.25001C8.47102 15.75 8.68299 15.6622 8.83927 15.5059C8.99555 15.3496 9.08334 15.1377 9.08334 14.9166C9.08334 14.6956 8.99555 14.4837 8.83927 14.3274C8.68299 14.1711 8.47102 14.0833 8.25001 14.0833Z"
      fill={props.fill}
    />
    <path
      d="M12.4167 14.0833H11.5833C11.3623 14.0833 11.1504 14.1711 10.9941 14.3274C10.8378 14.4837 10.75 14.6956 10.75 14.9166C10.75 15.1377 10.8378 15.3496 10.9941 15.5059C11.1504 15.6622 11.3623 15.75 11.5833 15.75H12.4167C12.6377 15.75 12.8496 15.6622 13.0059 15.5059C13.1622 15.3496 13.25 15.1377 13.25 14.9166C13.25 14.6956 13.1622 14.4837 13.0059 14.3274C12.8496 14.1711 12.6377 14.0833 12.4167 14.0833Z"
      fill={props.fill}
    />
    <path
      d="M16.5833 14.0833H15.75C15.529 14.0833 15.317 14.1711 15.1607 14.3274C15.0045 14.4837 14.9167 14.6956 14.9167 14.9166C14.9167 15.1377 15.0045 15.3496 15.1607 15.5059C15.317 15.6622 15.529 15.75 15.75 15.75H16.5833C16.8044 15.75 17.0163 15.6622 17.1726 15.5059C17.3289 15.3496 17.4167 15.1377 17.4167 14.9166C17.4167 14.6956 17.3289 14.4837 17.1726 14.3274C17.0163 14.1711 16.8044 14.0833 16.5833 14.0833Z"
      fill={props.fill}
    />
    <path
      d="M8.25001 17.4167H7.41668C7.19566 17.4167 6.9837 17.5045 6.82742 17.6608C6.67114 17.817 6.58334 18.029 6.58334 18.25C6.58334 18.471 6.67114 18.683 6.82742 18.8393C6.9837 18.9956 7.19566 19.0834 7.41668 19.0834H8.25001C8.47102 19.0834 8.68299 18.9956 8.83927 18.8393C8.99555 18.683 9.08334 18.471 9.08334 18.25C9.08334 18.029 8.99555 17.817 8.83927 17.6608C8.68299 17.5045 8.47102 17.4167 8.25001 17.4167Z"
      fill={props.fill}
    />
    <path
      d="M12.4167 17.4167H11.5833C11.3623 17.4167 11.1504 17.5045 10.9941 17.6608C10.8378 17.817 10.75 18.029 10.75 18.25C10.75 18.471 10.8378 18.683 10.9941 18.8393C11.1504 18.9956 11.3623 19.0834 11.5833 19.0834H12.4167C12.6377 19.0834 12.8496 18.9956 13.0059 18.8393C13.1622 18.683 13.25 18.471 13.25 18.25C13.25 18.029 13.1622 17.817 13.0059 17.6608C12.8496 17.5045 12.6377 17.4167 12.4167 17.4167Z"
      fill={props.fill}
    />
    <path
      d="M16.5833 17.4167H15.75C15.529 17.4167 15.317 17.5045 15.1607 17.6608C15.0045 17.817 14.9167 18.029 14.9167 18.25C14.9167 18.471 15.0045 18.683 15.1607 18.8393C15.317 18.9956 15.529 19.0834 15.75 19.0834H16.5833C16.8044 19.0834 17.0163 18.9956 17.1726 18.8393C17.3289 18.683 17.4167 18.471 17.4167 18.25C17.4167 18.029 17.3289 17.817 17.1726 17.6608C17.0163 17.5045 16.8044 17.4167 16.5833 17.4167Z"
      fill={props.fill}
    />
    <path
      d="M19.9167 4.5H17.625C17.5698 4.5 17.5168 4.47805 17.4777 4.43898C17.4386 4.39991 17.4167 4.34692 17.4167 4.29167V2.83333C17.4167 2.61232 17.3289 2.40036 17.1726 2.24408C17.0163 2.0878 16.8044 2 16.5833 2C16.3623 2 16.1504 2.0878 15.9941 2.24408C15.8378 2.40036 15.75 2.61232 15.75 2.83333V6.79167C15.75 6.95743 15.6842 7.1164 15.5669 7.23361C15.4497 7.35082 15.2908 7.41667 15.125 7.41667C14.9592 7.41667 14.8003 7.35082 14.6831 7.23361C14.5659 7.1164 14.5 6.95743 14.5 6.79167V4.91667C14.5 4.80616 14.4561 4.70018 14.378 4.62204C14.2998 4.5439 14.1938 4.5 14.0833 4.5H8.875C8.8199 4.5 8.76703 4.47817 8.72798 4.43928C8.68894 4.40039 8.66689 4.34761 8.66667 4.2925V2.83333C8.66667 2.61232 8.57887 2.40036 8.42259 2.24408C8.26631 2.0878 8.05435 2 7.83334 2C7.61232 2 7.40036 2.0878 7.24408 2.24408C7.0878 2.40036 7 2.61232 7 2.83333V6.79167C7 6.95743 6.93416 7.1164 6.81695 7.23361C6.69974 7.35082 6.54077 7.41667 6.37501 7.41667C6.20924 7.41667 6.05027 7.35082 5.93306 7.23361C5.81585 7.1164 5.75001 6.95743 5.75001 6.79167V4.91667C5.75001 4.80616 5.70611 4.70018 5.62797 4.62204C5.54983 4.5439 5.44385 4.5 5.33334 4.5H4.08334C3.64131 4.5 3.21739 4.67559 2.90483 4.98816C2.59227 5.30072 2.41667 5.72464 2.41667 6.16667V20.3333C2.41667 20.7754 2.59227 21.1993 2.90483 21.5118C3.21739 21.8244 3.64131 22 4.08334 22H19.9167C20.3587 22 20.7826 21.8244 21.0952 21.5118C21.4077 21.1993 21.5833 20.7754 21.5833 20.3333V6.16667C21.5833 5.72464 21.4077 5.30072 21.0952 4.98816C20.7826 4.67559 20.3587 4.5 19.9167 4.5ZM19.9167 19.9167C19.9167 20.0272 19.8728 20.1332 19.7946 20.2113C19.7165 20.2894 19.6105 20.3333 19.5 20.3333H4.50001C4.3895 20.3333 4.28352 20.2894 4.20538 20.2113C4.12724 20.1332 4.08334 20.0272 4.08334 19.9167V9.91667C4.08334 9.80616 4.12724 9.70018 4.20538 9.62204C4.28352 9.5439 4.3895 9.5 4.50001 9.5H19.5C19.6105 9.5 19.7165 9.5439 19.7946 9.62204C19.8728 9.70018 19.9167 9.80616 19.9167 9.91667V19.9167Z"
      fill={props.fill}
    />
  </svg>
);

const ForwardRef = forwardRef<SVGSVGElement, Props>(IconCalendar);
export { ForwardRef as IconCalendar };
