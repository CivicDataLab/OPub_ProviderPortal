import { Text } from 'components/layouts';
import React from 'react';
import styled from 'styled-components';

type TextProps = React.ComponentProps<typeof Text>;

const TruncateText = ({
  as = 'span',
  linesToClamp = 4,
  showButton = false,
  children,
  ...props
}) => {
  const [clickedReadMore, setClickedReadMore] = React.useState(false);
  return (
    <StyledSpan linesToClamp={linesToClamp}>
      <span
        title={children}
        aria-label={children}
        className={!clickedReadMore ? 'line-clamp' : ''}
        {...props}
      >
        {children}
      </span>
      {showButton && (
        <button onClick={() => setClickedReadMore(!clickedReadMore)}>
          <Text variant="pt14b" color={'var(--color-primary-01)'}>
            {clickedReadMore ? 'Read Less' : 'Read More'}
          </Text>
        </button>
      )}
    </StyledSpan>
  );
};

export { TruncateText };

const StyledSpan = styled.span<any>`
  .line-clamp {
    display: -webkit-box;
    overflow: hidden;
    -webkit-line-clamp: ${(props) => props.linesToClamp};
    -webkit-box-orient: vertical;
  }

  button {
    appearance: none;
    padding: 0;
  }
`;
