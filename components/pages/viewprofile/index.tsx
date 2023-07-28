import { Close } from '@opub-icons/workflow';
import { Button, Modal } from 'components/actions';
import { Heading } from 'components/layouts';
import { Flex } from 'components/layouts/FlexWrapper';
import React, { useState } from 'react';
import { Text } from 'components/layouts';
import styled from 'styled-components';
import { fetchUserInfo } from 'utils/fetch';
import { useSession } from 'next-auth/react';
import { toast } from 'react-toastify';
import { Loader } from 'components/common';

const ViewProfile = ({ username }) => {
  const [showRemindModal, setShowRemindModal] = useState(false);
  const { data: session } = useSession();
  const [profileDetails, setProfileDetails] = useState(Object);
  const [isLoading, setIsLoading] = useState(true);

  const LoadProfileInfo = () => {
    setShowRemindModal(!showRemindModal);
    fetchUserInfo(username, session)
      .then((response) => {
        if (response.Success) {
          setProfileDetails(response);
          setIsLoading(false);
        } else {
          setIsLoading(false);
          setShowRemindModal(showRemindModal);
          toast.error('Failed to fetch user info');
        }
      })
      .catch((err) => {
        setIsLoading(false);
        setShowRemindModal(!showRemindModal);
        toast.error('Failed to fetch user info');
      });
  };

  return (
    <ProfileWrapper>
      <Button kind="custom" as="a" onPress={() => LoadProfileInfo()}>
        {username}
      </Button>

      <Modal
        label={''}
        isOpen={showRemindModal}
        modalHandler={() => {
          setShowRemindModal(!showRemindModal);
        }}
      >
        <RemarkModalContentWrapper>
          <Flex
            flexDirection={'row'}
            justifyContent="space-between"
            alignItems={'center'}
          >
            <Text as={'h1'}>Profile Details</Text>
            <Button
              kind="custom"
              icon={<Close />}
              onPress={() => setShowRemindModal(!showRemindModal)}
            />
          </Flex>
          <hr />
          {isLoading ? (
            <Loader />
          ) : (
            <Wrapper>
              {profileDetails?.first_name && (
                <div>
                  <Text color={'var(--text-medium)'}>Full Name</Text>
                  <Heading variant="h4l" as={'h4'}>
                    {profileDetails?.first_name + profileDetails?.last_name}
                  </Heading>
                </div>
              )}{' '}
              {profileDetails?.email && (
                <div>
                  <Text color={'var(--text-medium)'}>Email</Text>
                  <Heading variant="h4l" as={'h4'}>
                    {profileDetails?.email}
                  </Heading>
                </div>
              )}
              {profileDetails?.user_type && (
                <div>
                  <Text color={'var(--text-medium)'}>User Type</Text>
                  <Heading variant="h4l" as={'h4'}>
                    {profileDetails?.user_type}
                  </Heading>
                </div>
              )}
              {profileDetails?.phn && (
                <div>
                  <Text color={'var(--text-medium)'}>Phone Number</Text>
                  <Heading variant="h4l" as={'h4'}>
                    {profileDetails?.phn}
                  </Heading>
                </div>
              )}
            </Wrapper>
          )}
        </RemarkModalContentWrapper>
      </Modal>
    </ProfileWrapper>
  );
};

export default ViewProfile;

const ProfileWrapper = styled.div`
  > a {
    color: var(--color-link);
  }
`;

const RemarkModalContentWrapper = styled.section`
  background-color: var(--color-background-lightest);
  max-height: 90vh;
  min-width: 30vw;
  max-width: 1014px;
  padding: 20px;
  border-radius: 8px;
`;

const Wrapper = styled.div`
  /* display: flex;
  flex-wrap: wrap; */
  display: grid;
  grid-template-columns: auto auto;
  padding: 20px;
  gap: 10px;
  > div {
    display: flex;

    flex-direction: column;
    min-width: 300px;
    flex-grow: 1;
  }
  @media (max-width: 925px) {
    div {
      min-width: auto;
    }
  }
`;
