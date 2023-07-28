import styled from 'styled-components';
import { Heading, Text } from '../../../layouts';
import { Button } from '../../../actions';
import { FindOrganization, RequestOrganization } from '../index';
import React from 'react';
import Image from 'next/image';
import { Flex } from 'components/layouts/FlexWrapper';
import { platform_name } from 'platform-constants';

export function NewOrganization(props: {
  onPress: () => void;
  onPress1: () => void;
  tab: any;
  userOrgsListRes: any;
}) {
  return (
    <>
      <Banner>
        <Wrapper>
          <Heading color={'var(--text-high)'} variant="h3" as={'span'}>
            Looking forward to share data on <br />
            {platform_name}?
          </Heading>
          <Flex gap="16px" flexWrap={'wrap'}>
            <Button onPress={props.onPress} kind="primary-outline">
              Find Your Organisation
            </Button>
            <Button onPress={props.onPress1} kind="primary">
              Request New Organisation
            </Button>
          </Flex>
        </Wrapper>

        <Image
          src={'/assets/images/homeorgbanner.svg'}
          alt={'about section image'}
          width={383}
          height={252}
        />
      </Banner>
      {props.tab === 'find' ? (
        <FindOrganization userOrgsListRes={props.userOrgsListRes} />
      ) : (
        <RequestOrganization />
      )}
    </>
  );
}

const Banner = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 45px;
  flex-wrap: wrap;
  place-content: center;
  gap: 50px;
  margin-top: 30px;
  background-color: var(--color-background-lightest);
`;

const Wrapper = styled.div`
  width: 580px;
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 45px;
  gap: 19px;
  flex-direction: column;
  @media (max-width: 1050px) {
    width: auto;
  }
`;

const TextWrapper = styled.div`
  flex-grow: 1;
  max-width: 420px;

  > span {
    margin-top: 8px;
    display: inline-block;
  }
`;
const ButtonWrapper = styled.div`
  flex-grow: 1;
  max-width: 350px;

  display: flex;
  flex-direction: column;
  justify-items: center;
  align-content: center;
  text-align: center;
  gap: 16px;
`;
