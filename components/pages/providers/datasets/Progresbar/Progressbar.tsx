import { Text } from 'components/layouts';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const Progressbar = ({
  components,
  currentIndex,
  progressBarLabels,
  getCurrentIndex,
}) => {
  const [activeStep, setActiveStep] = useState(currentIndex);

  useEffect(() => {
    setActiveStep(currentIndex);
  }, [currentIndex]);

  return (
    <Status isActive={progressBarLabels[0].helperText === 'ApiMandatory'}>
      <ProgressBar>
        <div>
          {progressBarLabels?.map((item, index) => (
            <>
              <button
                onClick={() => {
                  setActiveStep(index);
                  getCurrentIndex(index);
                }}
                className={`circle ${activeStep === index && 'active'}`}
              >
                <Text fontWeight={'bold'}>{item.name}</Text>
                {/* <span className="subtitle">{item.helperText}</span> */}
              </button>
            </>
          ))}
        </div>
      </ProgressBar>
      <div>{components && components[activeStep]}</div>
    </Status>
  );
};

export default Progressbar;

const SupportButtonWrapper = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Status = styled.section<any>`
  overflow-y: ${(props) => (props.isActive ? 'scroll' : 'hidden')};
  /* max-height: ${(props) => (props.isActive ? '90vh' : 'auto')}; */

  ::-webkit-scrollbar {
    display: none; /* safari and chrome */
  }
  -ms-overflow-style: none; /* internet explorer */
  scrollbar-width: none; /* firefox */
`;

const ProgressBar = styled.div`
  /* background-color: var(--text-high-on-dark); */
  /* border-top: 2px solid var(--color-gray-02); */
  display: flex;
  justify-content: space-between;
  .circle {
    color: var(--text-light);
    margin-right: 10px;
  }

  .active {
    color: var(--color-primary-01);
    background-color: white;
    padding: 10px;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
  }
  .active span {
    border-bottom: 2px solid var(--color-primary-01);
    padding: 8px 18px;
  }
`;
