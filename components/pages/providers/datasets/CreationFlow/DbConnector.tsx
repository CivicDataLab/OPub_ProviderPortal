import React, { useState } from 'react';
import styled from 'styled-components';

const DbConnector = () => {
  return (
    <Status>
      <div className="api">
      <h2>Need to design</h2>
    
      </div>
    </Status>
  );
};

export default DbConnector;

const Status = styled.section`
  .api {
    padding: 1rem;
    margin-top: 2rem;
    label {
      display: flex;
      width: 100%;
      flex-wrap: wrap;
      margin-bottom: 1rem;
    }
    span {
      color: var(--color-black);
      font-weight: 600;
    }
    input,
    select {
      background-color: var(--color-white);
      border: none;
      box-shadow: 0 0 2px black;
      line-height: 2;
      min-height: 40px;
      border-radius: 5px;
      padding: 0 10px;
      margin-top: 2px;
      font-weight: 400;
      width: 100%;
    }
    .row {
      display: flex;
      gap: 10px;
    }
 
  }
`;
