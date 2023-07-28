import Link from 'next/link';
import styled from 'styled-components';
import { useBreadcrumbItem, useBreadcrumbs } from 'react-aria';
import React from 'react';
import { NextLink } from '../Link';
import { ChevronSize75 } from '@opub-icons/ui';
interface Props {
  data: any;
  bgColor?: string;
}

const Breadcrumb = ({ data, bgColor = 'var(--color-background-lightest)' }) => {
  return (
    <Wrapper style={{ backgroundColor: bgColor }}>
      <div>
        {data.map((item, index) => (
          <Link key={item.link + index} href={item.link}>
            <a>
              {item.text}
              {index < data.length - 1 && <> &gt;</>}
            </a>
          </Link>
        ))}
      </div>
    </Wrapper>
  );
};

export default Breadcrumb;

const Wrapper = styled.div`
  /* background-color: var(--color-background-alt-light); */
  padding: 16px 0;
  font-weight: 600;
  font-size: 0.9rem;

  .container {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
  }

  a {
    text-decoration-color: transparent;
    color: #2586f5;

    &:hover {
      text-decoration-color: initial;
    }
  }
`;

export function Breadcrumbs(props) {
  let { navProps } = useBreadcrumbs(props);
  let children = React.Children.toArray(props.children);

  return (
    <nav {...navProps}>
      <Ol>
        {children.map((child: any, i) =>
          React.cloneElement(child, { isCurrent: i === children.length - 1 })
        )}
      </Ol>
    </nav>
  );
}

export function BreadcrumbItem(props) {
  let ref = React.useRef();
  let { itemProps } = useBreadcrumbItem(props, ref);
  return (
    <li>
      {props.isCurrent ? (
        <Item {...itemProps} ref={ref}>
          {props.children}
        </Item>
      ) : (
        <NextLink href={props.href || '#'}>
          <Item {...itemProps} ref={ref}>
            {props.children}
          </Item>
        </NextLink>
      )}

      {!props.isCurrent && (
        <Separator aria-hidden="true">{<ChevronSize75 />}</Separator>
      )}
    </li>
  );
}

const Ol = styled.ol`
  display: flex;
  flex-wrap: wrap;
  list-style: none;
  margin: 0;
  padding: 0;
`;

const Item = styled.a`
  text-transform: capitalize;
  color: var(--text-medium);
  font-size: 0.875rem;
  font-weight: var(--font-bold);
  cursor: pointer;
  text-decoration: underline;

  &[aria-current='page'],
  &[aria-disabled='true'] {
    text-decoration: none;
    cursor: default;
  }
`;

const Separator = styled.span`
  padding: 0 6px;
  user-select: none;
  svg {
    margin-bottom: -2px;
    color: var(--text-medium);
  }
`;
