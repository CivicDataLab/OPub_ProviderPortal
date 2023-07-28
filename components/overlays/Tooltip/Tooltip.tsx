import { AlertSmall, InfoSmall, SuccessSmall } from '@opub-icons/ui';
import Tippy, { TippyProps } from '@tippyjs/react/headless';
import React from 'react';
import styled from 'styled-components';
import { inlinePositioning } from 'tippy.js/headless';
import { omit } from 'utils/helper';

let iconMap = {
  info: InfoSmall,
  positive: SuccessSmall,
  negative: AlertSmall,
};

interface Props extends TippyProps {
  children: React.ReactElement;
  variant?: 'neutral' | 'positive' | 'negative' | 'info';
  mode?: 'light' | 'dark';
}

// overwrite children accept 2 react elements
interface TooltipProps extends Omit<Props, 'children'> {
  // first element is trigger and second is content
  children: [React.ReactElement, React.ReactElement];
}
// TODO add variants and singleton
function Tooltip(props: TooltipProps) {
  let { children, mode = 'light' } = props;
  const tippyProps = omit(props, ['children']);

  let [trigger, tooltip] = React.Children.toArray(children);
  // let Icon = iconMap[props.variant];
  return (
    <Wrapper>
      <Tippy
        delay={200}
        interactive
        inlinePositioning
        // offset={[0, 2]}
        plugins={[inlinePositioning]}
        render={(attrs) => {
          return (
            <Content mode={mode} tabIndex={-1} {...attrs}>
              {tooltip}
              <Arrow
                mode={mode}
                data-placement={attrs['data-placement']}
                data-popper-arrow=""
              />
            </Content>
          );
        }}
        {...tippyProps}
      >
        <div>{trigger}</div>
      </Tippy>
    </Wrapper>
  );
}

/**
 * Display container for Tooltip content. Has a directional arrow dependent on its placement.
 */
let _Tooltip = React.forwardRef(Tooltip);
export { _Tooltip as Tooltip };

const Wrapper = styled.div``;

const Content = styled.div<any>`
  background-color: ${(props) =>
    props.mode === 'light' ? 'var(--color-white)' : 'var(--color-black)'};
  color: ${(props) =>
    props.mode === 'light' ? 'var(--text-high)' : 'var(--text-high-on-dark)'};
  padding: 8px;
  font-size: 0.875rem;
  font-weight: var(--font-bold);
  border-radius: 2px;
  max-width: 200px;
`;

const Arrow = styled.div<any>`
  visibility: hidden;
  position: absolute;
  isolation: isolate;
  z-index: 9999;
  top: ${(props) => (props['data-placement'] === 'bottom' ? '-4px' : null)};
  bottom: ${(props) => (props['data-placement'] === 'top' ? '-4px' : null)};
  width: 12px;
  height: 12px;
  background: inherit;
  background-color: ${(props) =>
    props.mode === 'light' ? 'var(--color-white)' : 'var(--color-black)'};
  border-color: ${(props) =>
    props.mode === 'light' ? 'var(--color-white)' : 'var(--color-black)'};

  &::before {
    position: absolute;
    border-radius: 1px;

    width: 12px;
    height: 12px;
    background: inherit;
    background-color: ${(props) =>
      props.mode === 'light' ? 'var(--color-white)' : 'var(--color-black)'};
    border-color: ${(props) =>
      props.mode === 'light' ? 'var(--color-white)' : 'var(--color-black)'};

    visibility: visible;
    content: '';
    transform: rotate(45deg);
  }
`;
