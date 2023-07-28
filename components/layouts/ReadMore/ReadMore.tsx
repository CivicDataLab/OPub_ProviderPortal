import React from 'react';
import styled from 'styled-components';
import { Text } from '../Text';
import type { TextProps } from '../Text';

interface Props extends TextProps {
  children: any;
  characterLimit?: number;
}

const ReadMore = ({ children, characterLimit = 180, ...others }: Props) => {
  const text = children;
  const [isReadMore, setIsReadMore] = React.useState(true);
  const toggleReadMore = () => {
    setIsReadMore(!isReadMore);
  };

  if (text.length <= characterLimit)
    return (
      <Text title={text} {...others}>
        {text}
      </Text>
    );

  return (
    <Text title={text} {...others}>
      {isReadMore ? text.slice(0, characterLimit) : text}
      <ReadMoreSpan onClick={toggleReadMore}>
        {' '}
        {isReadMore ? '...read more' : ' show less'}
      </ReadMoreSpan>
    </Text>
  );
};

export { ReadMore };

const ReadMoreSpan = styled.button`
  all: unset;
  cursor: pointer;
  margin-left: 8px;
  font-weight: 700;
  color: var(--text-high);
`;
