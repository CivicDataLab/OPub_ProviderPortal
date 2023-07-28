import { Edit } from '@opub-icons/workflow';
import { Select, TextField } from 'components/form';
import { Heading, Text } from 'components/layouts';
import { Flex } from 'components/layouts/FlexWrapper';
import router from 'next/router';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { GET_ORGANIZATION_BY_ID } from 'services';
import { useQuery } from '@apollo/client';
import { useProviderStore, useUserStore } from 'services/store';
import Button from 'components/actions/Button';
import { fetchUserInfo } from 'utils/fetch';
import { useSession } from 'next-auth/react';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import { Tabs, TabsList, TabsTrigger } from '@radix-ui/react-tabs';
import { Link } from 'components/layouts/Link';
import { platform_name } from 'platform-constants';
import Head from 'next/head';
import { Loader } from 'components/common';
import shallow from 'zustand/shallow';

const Profile = () => {
  const currentOrgRole = useProviderStore((e) => e.org);
  const userDetails = useUserStore((e) => e.user);
  const roles = useUserStore((e) => e.access.roles);

  var dp = false;
  for (var i = 0; i < roles?.length; i++) {
    if (roles[i].role == 'DP') {
      dp = true;
      break;
    }
  }
  var dpa = false;
  for (var i = 0; i < roles?.length; i++) {
    if (roles[i].role == 'DPA') {
      dpa = true;
      break;
    }
  }

  const [typeofPreview, setTypeofPreview] = useState(dp ? 'dp' : 'dpa');
  useEffect(() => {
    setTypeofPreview(dp ? 'dp' : 'dpa');
  }, [dp]);

  const organizationResponse = useQuery(GET_ORGANIZATION_BY_ID, {
    variables: {
      organization_id: currentOrgRole?.org_id,
    },
    skip: !currentOrgRole?.org_id,
  });

  const orgDetails =
    organizationResponse?.data &&
    organizationResponse?.data?.organization_by_id;

  const TabHeaders = [
    dp && {
      name: (
        <Flex padding="10px 0" gap="10px">
          <Heading as="h2" variant="h5" title="Data Provider">
            Data Provider
          </Heading>
        </Flex>
      ),
      id: 'dp',
      disabled: false,
    },
    dpa && {
      name: (
        <Flex padding="10px 0" gap="10px">
          <Heading as="h2" variant="h5" title="Data Provider Admin">
            Data Provider Admin
          </Heading>
        </Flex>
      ),
      id: 'dpa',
    },
  ];

  const [edit, setEdit] = useState(true);

  const [userRoleData, setUserRoleData] = useState({ DP: [], DPA: [] });

  const { data: session } = useSession();
  const [refetch, setRefetch] = useState(false);

  const [userData, setUserData] = useState({});
  const [isLoggedin, setIsLoggedin] = useState<string>('');

  const [isLoading, setIsLoading] = useState(true);

  const { setUser } = useUserStore(
    (state) => ({
      setUser: state.setUser,
    }),
    shallow
  );

  useEffect(() => {
    fetchUserInfo(userDetails.username, session)
      .then((response) => {
        const data = {
          user_name: response?.username,
          first_name: response?.first_name,
          last_name: response?.last_name,
          user_type: response.user_type,
          phn: response?.phn,
          email: response?.email,
        };
        formik.setValues(data);
        setUserRoleData(response.access);
      })
      .catch((err) => {
        toast.error('Failed to fetch user info');
      });
  }, [userDetails, refetch]);

  useEffect(() => {
    fetchUserInfo(userDetails.username, session)
      .then((response) => {
        setUserData({
          first_name: response?.first_name,
          last_name: response?.last_name,
          user_type: response.user_type,
          phn: response?.phn,
          email: response?.email,
        });
        setIsLoading(false);
      })
      .catch((err) => {
        toast.error('Failed to fetch user info');
      });
  }, [userDetails]);

  const formik: any = useFormik({
    initialValues: {
      user_name: '',
      first_name: '',
      last_name: '',
      user_type: '',
      phn: '',
      email: '',
    },
    // validate,
    onSubmit: (values) => {
      fetch(`${process.env.NEXT_PUBLIC_AUTH_URL}/users/update_user_info`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'access-token':
            session && session['access']?.token ? session['access'].token : '',
        },
        body: JSON.stringify({
          user_name: values.user_name,
          first_name: values.first_name,
          last_name: values.last_name,
          user_type: values.user_type,
          phn: values.phn,
          email: values.email,
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.Success) {
            toast.success('Profile updated sucessfully');
            setUser({
              username: res.username,
              email: res.email,
              name: values.first_name + ' ' + values.last_name,
            });
            setEdit(true);
            setRefetch(true);
          } else {
            toast.error('Failed to update profile');
            setEdit(true);
            setRefetch(true);
          }
          setRefetch(false);
        })
        .catch(() => toast.error('Failed to update profile'));
    },
  });

  useEffect(() => {
    if (router.query?.clientLogin) {
      setIsLoggedin(router.query?.clientLogin?.toString());
    }
  }, [router.query?.clientLogin]);

  const ProfileData = Object.values(userData);

  function checkArray(my_arr) {
    if (my_arr.length > 0) {
      for (var i = 0; i < my_arr.length; i++) {
        if (my_arr[i] === '' || my_arr[i] === undefined || my_arr[i] == null)
          return false;
      }
      return true;
    } else {
      return false;
    }
  }

  useEffect(() => {
    if (isLoggedin && checkArray(ProfileData)) {
      router.replace('/user/entities');
    }
  }, [ProfileData]);

  const UserTypeList = [
    { value: 'Academia', label: 'Academia' },
    { value: 'Central Government', label: 'Central Government' },
    { value: 'Citizen', label: 'Citizen' },
    {
      value: 'Civil Society Organisation',
      label: 'Civil Society Organisation',
    },
    { value: 'Data/Technology Community', label: 'Data/Technology Community' },
    { value: 'Private Sector Company', label: 'Private Sector Company' },
    { value: 'Public Sector Company', label: 'Public Sector Company' },
    { value: 'Media', label: 'Media' },
    { value: 'State Government', label: 'State Government' },
    { value: 'Union Territory', label: 'Union Territory' },
    { value: 'Urban Local Body,', label: 'Urban Local Body,' },
    { value: 'Other', label: 'Other' },
  ];

  return (
    <>
      <Head>
        <title>Profile | {platform_name} (IDP)</title>
      </Head>
      {isLoading && typeof userData !== undefined ? (
        <Loader />
      ) : (
        <>
          <Wrapper>
            <Header>
              <Heading as="h1" variant="h3">
                Profile Details
              </Heading>
              <Flex justifyContent={'flex-end'} gap="12px">
                {!edit && (
                  <>
                    <Button
                      kind="primary-outline"
                      onPress={() => {
                        setEdit(true);
                        setRefetch(true);
                        setRefetch(false);
                      }}
                      size="sm"
                    >
                      Cancel
                    </Button>
                    <Button
                      kind="primary-outline"
                      onPress={formik.handleSubmit}
                      size="sm"
                    >
                      Save Changes
                    </Button>
                  </>
                )}
                {edit && (
                  <Button
                    kind="primary-outline"
                    onPress={() => setEdit(false)}
                    size="sm"
                    icon={<Edit />}
                    iconSide="left"
                    isDisabled
                    title="Please visit JanParichay to update profile"
                  >
                    Edit
                  </Button>
                )}
              </Flex>
            </Header>
            <ProfileWrapper>
              {/* <Flex
            flexDirection={'column'}
            alignItems={'center'}
            width={'248px'}
            gap="16px"
            marginX={'80px'}
            flexWrap={'wrap'}
          >
            <ImageWrapper>
              {router.asPath.includes('/providers/') ? (
                orgDetails?.logo && logo === 'logo' ? (
                  <Image
                    alt="Organization Image"
                    width={'56px'}
                    height={'56px'}
                    className="img-contain"
                    src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/public/${orgDetails?.logo}`}
                    onError={() => {
                      setLogo('fallback');
                    }}
                  />
                ) : (
                  <Image
                    src={`/assets/icons/Organisation.svg`}
                    alt={'Organisation Logo'}
                    width={56}
                    height={56}
                    className="img-contain"
                  />
                )
              ) : (
                <User size={56} />
              )}
            </ImageWrapper>
            <Button as="a" kind="custom">
              Edit
            </Button>
          </Flex> */}
              <FieldsWrapper onSubmit={(e) => e.preventDefault()} noValidate>
                <TextField
                  label="First Name"
                  name="first_name"
                  value={formik.values.first_name}
                  isDisabled={edit}
                  onChange={(e) => {
                    formik.setFieldValue('first_name', e);
                  }}
                />
                <TextField
                  label="Last Name"
                  name="last_name"
                  value={formik.values.last_name}
                  isDisabled={edit}
                  onChange={(e) => {
                    formik.setFieldValue('last_name', e);
                  }}
                />

                {/* <TextField
              label="Entity Type"
              name="org"
              isDisabled={edit}
              onChange={(e) => {}}
            /> */}

                <TextField
                  label="Email Id"
                  name="email"
                  value={formik.values.email}
                  isDisabled
                  onChange={(e) => {
                    formik.setFieldValue('email', e);
                  }}
                />

                <TextField
                  label="Phone Number"
                  name="phn"
                  value={formik.values.phn}
                  maxLength={10}
                  pattern="[1-9]{1}[0-9]{9}"
                  type="text"
                  isDisabled={edit}
                  onChange={(e) => {
                    formik.setFieldValue('phn', e);
                  }}
                />
                <Select
                  options={UserTypeList}
                  label="User Type"
                  value={{
                    label: formik.values?.user_type,
                    value: formik.values?.user_type,
                  }}
                  isDisabled={edit}
                  onChange={(e) => {
                    formik.setFieldValue('user_type', e.value);
                  }}
                  inputId={formik.user_type}
                />
              </FieldsWrapper>
            </ProfileWrapper>
          </Wrapper>
          {(dp || dpa) && (
            <Wrapper>
              <Header>
                <Heading as="h2" variant="h3">
                  User Roles
                </Heading>
              </Header>
              <Tabs
                onValueChange={(selected) => setTypeofPreview(selected)}
                value={typeofPreview}
              >
                <StyledTabList>
                  {TabHeaders.filter(Boolean).map((item) => (
                    <StyledTabTrigger
                      key={item?.id}
                      value={item?.id}
                      disabled={item?.disabled}
                    >
                      {item?.name}
                    </StyledTabTrigger>
                  ))}
                </StyledTabList>
                {userRoleData && (
                  <ProfileWrapper>
                    <UserRoleWrapper>
                      <Flex justifyContent={'space-between'}>
                        <Text variant="pt16b">Name of the Entity</Text>
                        <Text variant="pt16b">Link to Dashboard</Text>
                      </Flex>
                      {typeofPreview === 'dp'
                        ? userRoleData?.DP.filter(
                            (item) => item.status === 'approved'
                          ).map((item, index) => (
                            <Flex
                              key={index}
                              justifyContent={'space-between'}
                              flexWrap="wrap"
                            >
                              <Text>{item.org_title}</Text>
                              <Link
                                href={`/providers/${item.org_title}/dashboard/datasets/drafts`}
                              >
                                View Dashboard
                              </Link>
                            </Flex>
                          ))
                        : userRoleData?.DPA.filter(
                            (item) => item.status === 'approved'
                          ).map((item, index) => (
                            <Flex
                              key={index}
                              justifyContent={'space-between'}
                              flexWrap="wrap"
                            >
                              <Text key={index}>{item.org_title}</Text>
                              <Link
                                href={`/providers/${item.org_title}/dashboard/datasets/drafts`}
                              >
                                View Dashboard
                              </Link>
                            </Flex>
                          ))}
                    </UserRoleWrapper>
                  </ProfileWrapper>
                )}
              </Tabs>
            </Wrapper>
          )}
        </>
      )}
    </>
  );
};

export default Profile;

const Wrapper = styled.div`
  padding: 16px 25px;
  background-color: var(--color-white);
  margin-bottom: 24px;
`;

const UserRoleWrapper = styled.div`
  max-width: 600px;
  div {
    margin-block: 10px;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  border-bottom: 2px solid var(--border-default);
  padding-bottom: 16px;
  align-items: center;
`;

const ProfileWrapper = styled.div`
  margin-block: 24px;
  > div a {
    color: var(--color-link);
    text-decoration: underline;
  }
`;
const ImageWrapper = styled.div`
  background-color: var(--color-gray-01);
  padding: 30px;
  border-radius: 2px;
  height: 120px;
  width: 120px;
`;
const FieldsWrapper = styled.form`
  display: grid;
  grid-template-columns: auto auto;
  align-items: stretch;
  gap: 20px;

  @media (max-width: 925px) {
    display: flex;
    flex-wrap: wrap;
  }

  > div {
    width: 100%;
  }
`;

const StyledTabList = styled(TabsList)`
  display: flex;
  gap: 30px;
  width: 100%;
  overflow-x: auto;
  margin-top: 16px;
  margin-bottom: 24px;
`;

const StyledTabTrigger = styled(TabsTrigger)`
  color: var(--text-medium);
  border-bottom: 2px solid white;
  > div {
    padding: 0 0 18px 0;
  }
  h2 {
    white-space: nowrap;
  }
  :disabled {
    color: var(--text-disabled);
    svg {
      fill: var(--text-disabled);
    }
  }
  > div > svg {
    fill: var(--color-gray-04);
  }
  &[data-state='active'] {
    border-bottom: 2px solid var(--color-primary-01);
    color: var(--color-primary-01);
    > div > svg {
      fill: var(--color-primary-01);
    }
  }
`;
