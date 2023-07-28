import { SVGProps, forwardRef } from 'react';

interface Props extends SVGProps<SVGSVGElement> {}

const IconContrast = (props, ref) => (
  <svg
    width={props.width ? props.width : 24}
    viewBox="0 0 24 24"
    fill="black"
    xmlns="http://www.w3.org/2000/svg"
    ref={ref}
    {...props}
  >
    <path d="M20.9858 11.2633L18.9358 9.21335C18.9164 9.19416 18.901 9.17133 18.8904 9.14616C18.8798 9.12099 18.8743 9.09398 18.8742 9.06668V6.16668C18.8739 5.89063 18.7642 5.62593 18.5691 5.43065C18.374 5.23537 18.1094 5.12546 17.8333 5.12501H14.9333C14.878 5.12502 14.825 5.10315 14.7858 5.06418L12.7358 3.01418C12.5404 2.81923 12.2756 2.70975 11.9996 2.70975C11.7235 2.70975 11.4588 2.81923 11.2633 3.01418L9.21332 5.06418C9.17412 5.10315 9.1211 5.12502 9.06582 5.12501H6.16666C5.89038 5.12523 5.62547 5.23503 5.43003 5.4303C5.2346 5.62558 5.1246 5.8904 5.12416 6.16668V9.06668C5.12419 9.09393 5.11883 9.12092 5.10839 9.14609C5.09795 9.17126 5.08263 9.19412 5.06332 9.21335L3.01332 11.2633C2.81832 11.4589 2.70882 11.7238 2.70882 12C2.70882 12.2762 2.81832 12.5411 3.01332 12.7367L5.06332 14.7867C5.08269 14.806 5.09804 14.829 5.10848 14.8544C5.11892 14.8797 5.12425 14.9068 5.12416 14.9342V17.8333C5.12438 18.1097 5.23431 18.3746 5.42979 18.57C5.62527 18.7653 5.89031 18.875 6.16666 18.875H9.06665C9.12193 18.875 9.17496 18.8969 9.21415 18.9358L11.2642 20.9858C11.4595 21.181 11.7243 21.2906 12.0004 21.2906C12.2765 21.2906 12.5413 21.181 12.7367 20.9858L14.7867 18.9358C14.8259 18.8969 14.8789 18.875 14.9342 18.875H17.8333C18.1094 18.8748 18.3742 18.7649 18.5694 18.5696C18.7645 18.3743 18.8742 18.1095 18.8742 17.8333V14.9342C18.8742 14.9067 18.8797 14.8796 18.8903 14.8543C18.9009 14.829 18.9163 14.806 18.9358 14.7867L20.9858 12.7367C21.0826 12.6399 21.1593 12.5251 21.2117 12.3987C21.2641 12.2723 21.291 12.1368 21.291 12C21.291 11.8632 21.2641 11.7277 21.2117 11.6013C21.1593 11.4749 21.0826 11.3601 20.9858 11.2633ZM16.1667 12C16.1675 13.0768 15.7515 14.1121 15.0058 14.8889C14.2601 15.6657 13.2426 16.1236 12.1667 16.1667C12.1453 16.1683 12.1238 16.1655 12.1036 16.1583C12.0833 16.1512 12.0648 16.14 12.0491 16.1253C12.0335 16.1107 12.021 16.093 12.0125 16.0732C12.0041 16.0535 11.9998 16.0323 12 16.0108V8.04751C12 8.01922 12.0057 7.99121 12.0168 7.9652C12.028 7.9392 12.0443 7.91573 12.0648 7.89623C12.0853 7.87674 12.1096 7.86163 12.1361 7.85182C12.1626 7.84201 12.1909 7.83771 12.2192 7.83918C13.2848 7.89531 14.2883 8.35816 15.0227 9.13231C15.7572 9.90646 16.1666 10.9329 16.1667 12Z" />
  </svg>
);

const ForwardRef = forwardRef<SVGSVGElement, Props>(IconContrast);
export { ForwardRef as IconContrast };