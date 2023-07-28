import React from 'react';
import Image from 'next/image';
import styled from 'styled-components';

const DatasetFunnel = ({ providerStatusItems }) => {
  return (
    <Wrapper>
      {providerStatusItems.map((item, index) => (
        <div
          className="button"
          data-tooltip={item.tooltip}
          key={item.name + index}
        >
          <Image width={20} height={20} src={item.image} alt="" />
          <h2>{item.name}</h2>
        </div>
      ))}
    </Wrapper>
  );
};

export default DatasetFunnel;

const Wrapper = styled.button`
  display: flex;
  margin-top: 15px;

  .button {
    background-color: #becad5;
    padding: 5px 10px;
    display: flex;
    margin: 5px;
    h2 {
      font-size: 16px;
      font-weight: 400;
      padding-left: 10px;
    }
  }
  [data-tooltip]:before {
    content: attr(data-tooltip);
    position: absolute;
    opacity: 0;

    transition: all 0.15s ease;
    padding: 10px;
    color: #333;
    border-radius: 10px;
    box-shadow: 2px 2px 1px silver;
  }
  [data-tooltip]:hover:before {
    opacity: 1;

    background: white;
    margin-top: -50px;
    margin-left: 20px;
  }
  [data-tooltip]:not([data-tooltip-persistent]):before {
    pointer-events: none;
  }

  .active {
    background-color: #22a8b9;
    color: white;
  }
`;
