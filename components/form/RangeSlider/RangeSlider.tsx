import React, { useRef } from 'react';
import { useSliderState } from 'react-stately';
import {
  mergeProps,
  useFocusRing,
  useNumberFormatter,
  useSlider,
  useSliderThumb,
  VisuallyHidden,
} from 'react-aria';
import { AriaSliderProps, AriaSliderThumbProps } from '@react-types/slider';
import styled from 'styled-components';

interface ThumbProps extends AriaSliderThumbProps {
  trackRef: any;
  state: any;
}

function Thumb(props: ThumbProps) {
  let { state, trackRef, index } = props;
  let inputRef = useRef(null);
  let { thumbProps, inputProps, isDragging } = useSliderThumb(
    {
      index,
      trackRef,
      inputRef,
    },
    state
  );

  let { focusProps, isFocusVisible } = useFocusRing();
  return (
    <ThumbWrapper>
      <div
        {...thumbProps}
        className={`thumb ${isFocusVisible ? 'focus' : ''} ${
          isDragging ? 'dragging' : ''
        }`}
      >
        <VisuallyHidden>
          <input
            key={state}
            ref={inputRef}
            {...mergeProps(inputProps, focusProps)}
          />
        </VisuallyHidden>
      </div>
    </ThumbWrapper>
  );
}

interface SliderProps extends AriaSliderProps {
  formatOptions?: any;
}

const RangeSlider = (props: SliderProps) => {
  let trackRef = useRef(null);

  let numberFormatter = useNumberFormatter(props.formatOptions);
  let state = useSliderState({ ...props, numberFormatter });
  let { groupProps, trackProps, labelProps, outputProps } = useSlider(
    props,
    state,
    trackRef
  );

  return (
    <SliderWrapper>
      <div {...groupProps} className={`slider ${state.orientation}`}>
        {props.label && (
          <div className="label-container">
            <label className="sr-only" {...labelProps}>
              {props.label}
            </label>
            <output {...outputProps}>
              {`${state.getThumbValueLabel(0).split(',').join('')} - ${state
                .getThumbValueLabel(1).split(',').join('')
              }`}
            </output>
          </div>
        )}
        <div
          {...trackProps}
          ref={trackRef}
          className={`track ${state.isDisabled ? 'disabled' : ''}`}
        >
          <Thumb index={0} state={state} trackRef={trackRef} />
          <Thumb index={1} state={state} trackRef={trackRef} />
        </div>
      </div>
    </SliderWrapper>
  );
};

export default RangeSlider;

export const SliderWrapper = styled.div`
  .slider {
    display: flex;
  }

  .slider.horizontal {
    flex-direction: column;
    width: 250px;
    margin-top: 1em;
  }

  .slider.vertical {
    height: 150px;
  }

  .label-container {
    display: flex;
    justify-content: flex-end;
  }

  .slider.horizontal .track {
    height: 30px;
    width: 100%;
  }

  output {
    font-size: 0.875rem;
    font-weight: var(--font-bold);
    margin-bottom: 4px;
  }

  /* track line */
  .track:before {
    content: attr(x);
    display: block;
    position: absolute;
    background: var(--color-gray-02);
  }

  .slider.horizontal .track:before {
    height: 3px;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
  }

  .slider.vertical .track {
    width: 30px;
    height: 100%;
  }

  .slider.vertical .track:before {
    width: 3px;
    height: 100%;
    left: 50%;
    transform: translateX(-50%);
  }

  .slider.horizontal .thumb {
    top: 50%;
  }

  .slider.vertical .thumb {
    left: 50%;
  }

  .track.disabled {
    opacity: 0.8;
  }
`;

const ThumbWrapper = styled.div`
  .thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: var(--color-primary-01);
  }

  .thumb.dragging {
    background-color: var(--color-primary-00);
  }

  .thumb.focus {
    background-color: var(--color-primary-00);
  }
`;
