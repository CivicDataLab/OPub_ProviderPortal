import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import 'keen-slider/keen-slider.min.css';
import { useKeenSlider } from 'keen-slider/react';

interface Props {
  /**
   * content for the carousel
   */
  children: any;

  /**
   * previous button content (icon or text)
   */
  prevBtn?: React.ReactNode;

  /**
   * next button content (icon or text)
   */
  nextBtn?: React.ReactNode;

  /**
   * label for the carousel (a11y)
   */
  label: string;
  /**
   * hide buttons
   */
  hideButtons?: boolean;
  /**
   * show dots
   */
  showDots?: boolean;
}

const CarouselMultiple = ({
  children,
  prevBtn,
  nextBtn,
  label,
  hideButtons,
  showDots,
}: Props) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [maxIdx, setMaxIdx] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const carouselRef = useRef(null);

  // check if children prop is wrapped in a fragment container
  let carouselItems = children;
  if (children.type == React.Fragment) {
    carouselItems = children.props.children;
  }
  // if it's a single element, put it in a array
  carouselItems = !Array.isArray(carouselItems)
    ? [carouselItems]
    : carouselItems;

  function handleArrowKeys(e) {
    if (e.key == 'ArrowRight') {
      instanceRef.current?.next();
      carouselRef.current.querySelector('.carouselNextBtn').focus();
    } else if (e.key == 'ArrowLeft') {
      instanceRef.current?.prev();
      carouselRef.current.querySelector('.carouselPrevBtn').focus();
    }
  }
  useEffect(() => {
    carouselRef.current.addEventListener('keydown', handleArrowKeys);
  }, []);

  const [refCallback, instanceRef] = useKeenSlider({
    // carousel methods
    mode: 'free',
    slides: {
      perView: () => {
        const isMobile = window.innerWidth < 480;
        const count = window.innerWidth / 500;
        return isMobile ? 1 : count <= 4 ? count : 3;
      },
    },
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
      const slidys = carouselRef.current.querySelectorAll(
        '.keen-slider__slide'
      );
      slidys.forEach(function (slidy, idx) {
        if (idx === slider.track.details.rel) {
          slidy.setAttribute('data-hidden', 'false');
          slidy.setAttribute('tabindex', '0');
        } else {
          slidy.setAttribute('data-hidden', 'true');
          slidy.removeAttribute('tabindex');
        }
      });
    },
    created(slider) {
      setMaxIdx(slider.track.details.maxIdx);
      setLoaded(true);
      setTimeout(() => {
        const slide = carouselRef.current.querySelector('.keen-slider__slide');
        slide.setAttribute('data-hidden', 'false');
        slide.setAttribute('tabindex', '0');
      }, 10);
    },
  });

  return (
    <CarouselWrapper
      ref={carouselRef}
      role="group"
      aria-roledescription="slider"
      aria-label={label}
    >
      <span className="sr-only" aria-live="polite">{`Showing slide ${
        currentSlide + 1
      } of ${carouselItems.length}`}</span>

      <div className="keen-slider" ref={refCallback}>
        {carouselItems.map((item, index) =>
          React.cloneElement(item, {
            key: `carouselItem-${index}`,
            className: 'keen-slider__slide',
            'data-hidden': 'true',
            'aria-roledescription': 'slide',
            role: 'group',
          })
        )}
      </div>

      {loaded && instanceRef.current && (
        <>
          {!hideButtons && (
            <BtnWrapper>
              <button
                className="carouselPrevBtn"
                aria-label="Previous Slide"
                onClick={(e: any) =>
                  e.stopPropagation() || instanceRef.current?.prev()
                }
                aria-disabled={currentSlide === 0 ? 'true' : undefined}
                tabIndex={currentSlide === 0 ? -1 : undefined}
              >
                {prevBtn}
              </button>
              <button
                className="carouselNextBtn"
                aria-label="Next Slide"
                onClick={(e: any) =>
                  e.stopPropagation() || instanceRef.current?.next()
                }
                aria-disabled={currentSlide === maxIdx ? 'true' : undefined}
                tabIndex={currentSlide === maxIdx ? -1 : undefined}
              >
                {nextBtn}
              </button>
            </BtnWrapper>
          )}
          {showDots && (
            <Dots>
              {[
                ...Array(
                  instanceRef.current.track.details.slides.length
                ).keys(),
              ].map((idx) => {
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      instanceRef.current?.moveToIdx(idx);
                    }}
                    className={'dot' + (currentSlide === idx ? ' active' : '')}
                  >
                    <span className="sr-only">{`Slide ${idx + 1}`}</span>
                  </button>
                );
              })}
            </Dots>
          )}
        </>
      )}
    </CarouselWrapper>
  );
};

export default CarouselMultiple;

export const CarouselWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;

  .keen-slider__slide {
    --t: opacity 0.5s cubic-bezier(0.39, 0.03, 0.56, 0.57),
      visibility 0.5s cubic-bezier(0.39, 0.03, 0.56, 0.57);
    transition: var(--t);
    padding-inline: 20px;
    padding-block: 20px 16px;
    margin-inline: -16px;
  }
`;

const BtnWrapper = styled.div`
  align-self: center;

  [aria-disabled='true'] {
    div {
      background-color: var(--color-white);
    }
    svg {
      fill: var(--color-gray-05);
    }
  }
`;

const Dots = styled.div`
  display: flex;
  justify-content: center;
  gap: 4px;

  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: rgb(217, 217, 217);
    cursor: pointer;
    transition: background-color 0.3s ease-in-out;
    padding: 0;

    &:hover {
      background-color: #7773f1;
    }
  }

  .active {
    background-color: #514af3;
  }
`;
