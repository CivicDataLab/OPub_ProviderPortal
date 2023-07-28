import React from 'react';
import Button from 'components/actions/Button';
import styled from 'styled-components';
import { ChevronDown, ChevronUp } from '@opub-icons/workflow';

interface ShowMoreProps {
  children: any;
  openLabel?: string;
  closeLabel?: string;
  height?: number;
}

type LabelProps =
  | { openLabel?: never }
  | {
      openLabel?: String;
      closeLabel: String;
    };

type Props = ShowMoreProps & LabelProps;

const ShowMore = ({ children, ...props }: Props) => {
  const [isRequired, setIsRequired] = React.useState(false);
  const [hidden, setHidden] = React.useState(true);
  const ref: any = React.useRef();

  React.useEffect(() => {
    const defaultHeight = 200;
    const divHeight = ref?.current.offsetHeight;

    const heightLimit = props.height ?? defaultHeight;
    if (heightLimit < divHeight) {
      setIsRequired(true);
    }
  }, [children]);

  if (!isRequired) {
    return (
      <Content ref={ref} height={props.height}>
        {children}
      </Content>
    );
  }

  return (
    <Wrapper>
      <Content ref={ref} height={props.height} data-hidden={hidden}>
        {children}
      </Content>

      <Button
        size="sm"
        fluid
        aria-expanded={!hidden}
        kind="custom"
        icon={hidden ? <ChevronDown /> : <ChevronUp />}
        onPress={() => setHidden(!hidden)}
      >
        {hidden === true ? props.openLabel : props.closeLabel}
      </Button>
    </Wrapper>
  );
};

export { ShowMore };

const Wrapper = styled.section`
  > button {
    height: 32px;
    position: relative;
    border-radius: 0px 0px 4px 4px;
    border-width: 0px;
    transition: background-color 200ms ease 0s,
      box-shadow 0.15s cubic-bezier(0.47, 0.03, 0.49, 1.38) 0s;
    cursor: pointer;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: #5e6c84;
    margin-top: 16px;

    &:hover {
      background-color: #f4f5f7;
    }
  }
`;

const Content = styled.div<ShowMoreProps>`
  --mask: linear-gradient(
    to bottom,
    var(--color-black, black) 25%,
    transparent
  );

  position: relative;

  &[data-hidden='true'] {
    max-height: ${(props) => `${props.height}px` || '200px'};
    overflow: hidden;
    mask: var(--mask);
  }
`;
