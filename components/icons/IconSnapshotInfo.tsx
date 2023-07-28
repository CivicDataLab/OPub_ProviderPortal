import { SVGProps, forwardRef } from 'react';

interface Props extends SVGProps<SVGSVGElement> {}

const IconSnapshotInfo = (props, ref) => (
  <svg
    width={props.width ? props.width : 24}
    viewBox="0 0 24 24"
    fill="#020202"
    xmlns="http://www.w3.org/2000/svg"
    ref={ref}
    {...props}
  >
    <path d="M20.3333 3.25H3.66667C3.33515 3.25 3.01721 3.3817 2.78279 3.61612C2.54837 3.85054 2.41667 4.16848 2.41667 4.5V15.7942C2.41794 15.9559 2.45146 16.1158 2.51528 16.2644C2.5791 16.413 2.67193 16.5474 2.78834 16.6597C2.90475 16.772 3.04239 16.8599 3.19321 16.9184C3.34403 16.9768 3.50499 17.0045 3.66667 17H6.16667V20.3333C6.16675 20.4093 6.18758 20.4838 6.22692 20.5487C6.26626 20.6137 6.32261 20.6667 6.38988 20.7019C6.45714 20.7372 6.53277 20.7534 6.60858 20.7488C6.68439 20.7442 6.7575 20.719 6.82 20.6758L12.13 17H20.3333C20.6649 17 20.9828 16.8683 21.2172 16.6339C21.4516 16.3995 21.5833 16.0815 21.5833 15.75V4.5C21.5833 4.16848 21.4516 3.85054 21.2172 3.61612C20.9828 3.3817 20.6649 3.25 20.3333 3.25ZM10.1225 13.6667C10.1225 13.5009 10.1884 13.3419 10.3056 13.2247C10.4228 13.1075 10.5817 13.0417 10.7475 13.0417H11.7892V9.5C11.7892 9.44475 11.7672 9.39176 11.7282 9.35269C11.6891 9.31362 11.6361 9.29167 11.5808 9.29167H10.7475C10.5817 9.29167 10.4228 9.22582 10.3056 9.10861C10.1884 8.9914 10.1225 8.83243 10.1225 8.66667C10.1225 8.50091 10.1884 8.34194 10.3056 8.22472C10.4228 8.10751 10.5817 8.04167 10.7475 8.04167H11.5808C11.9675 8.04211 12.3382 8.19589 12.6115 8.46929C12.8849 8.74268 13.0387 9.11336 13.0392 9.5V13.0417H14.0833C14.2491 13.0417 14.4081 13.1075 14.5253 13.2247C14.6425 13.3419 14.7083 13.5009 14.7083 13.6667C14.7083 13.8324 14.6425 13.9914 14.5253 14.1086C14.4081 14.2258 14.2491 14.2917 14.0833 14.2917H10.75C10.6677 14.292 10.5862 14.2761 10.5101 14.2448C10.4339 14.2135 10.3647 14.1676 10.3064 14.1095C10.2481 14.0514 10.2019 13.9824 10.1703 13.9064C10.1388 13.8304 10.1225 13.749 10.1225 13.6667ZM11.5833 6.16667C11.5833 6.00185 11.6322 5.84073 11.7238 5.70369C11.8153 5.56665 11.9455 5.45984 12.0978 5.39677C12.25 5.33369 12.4176 5.31719 12.5792 5.34935C12.7409 5.3815 12.8894 5.46087 13.0059 5.57741C13.1225 5.69395 13.2018 5.84244 13.234 6.00409C13.2661 6.16574 13.2496 6.3333 13.1866 6.48557C13.1235 6.63784 13.0167 6.76799 12.8796 6.85956C12.7426 6.95113 12.5815 7 12.4167 7C12.1957 7 11.9837 6.9122 11.8274 6.75592C11.6711 6.59964 11.5833 6.38768 11.5833 6.16667Z" />
  </svg>
);

const ForwardRef = forwardRef<SVGSVGElement, Props>(IconSnapshotInfo);
export { ForwardRef as IconSnapshotInfo };
