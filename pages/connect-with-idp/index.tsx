import { Button } from 'components/actions';
import { Select, TextArea, TextField } from 'components/form';
import { ErrorMessage } from 'components/form/BaseStyles';
import { Banner, Breadcrumbs, Heading, Separator } from 'components/layouts';
import { useFormik } from 'formik';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useUserStore } from 'services/store';
import styled from 'styled-components';
import * as Yup from 'yup';
import { Text } from 'components/layouts';
import { Flex } from 'components/layouts/FlexWrapper';
import { GetServerSideProps } from 'next';
import Captcha from 'components/pages/explorer/ExplorerInfo/Captcha';

const catogories = [
  {
    label: 'Regarding the Platform',
    value: 'Platform',
  },
  {
    label: 'Regarding Providers',
    value: 'Providers',
  },
  {
    label: 'Suggest Datasets',
    value: 'Suggest',
  },
  // {
  //   label: 'Regarding Newsletter Subscription',
  //   value: 'Subscription',
  // },
  {
    label: 'Feedback for Datasets',
    value: 'Feedback',
  },
];

const validationSchema = Yup.object().shape({
  Category: Yup.string().required('Required'),
  Description: Yup.string()
    .max(500, 'Description should be maximum 500 characters')
    .required('Required'),
});

const ConnectWithUs = ({ contacts }) => {
  const user = useUserStore((e) => e.user);

  const router = useRouter();
  const [toggleDatasetURL, setToggleDatasetURL] = useState<boolean>();
  const [selectVal, setSelectVal] = useState<any>();
  const [validateCaptcha, setValidateCaptcha] = React.useState<
    'new' | 'mismatch' | 'match'
  >('new');

  React.useEffect(() => {
    if (router.query?.datasetURL?.length) {
      setToggleDatasetURL(true);
      setSelectVal(catogories[3]);
      formik.setFieldValue('Category', 'Feedback');
      formik.setFieldValue('DatasetURL', router.query?.datasetURL);
    }
  }, [router.query?.datasetURL]);

  React.useEffect(() => {
    if (router.query?.requestNew?.length) {
      setSelectVal(catogories[2]);
      formik.setFieldValue('Category', 'Suggest');
    }
  }, [router.query?.requestNew]);

  React.useEffect(() => {
    if (router.query?.provider?.length) {
      setSelectVal(catogories[1]);
      formik.setFieldValue('Category', 'Providers');
    }
  }, [router.query?.provider]);

  const formik: any = useFormik({
    initialValues: {
      Name: '',
      Email: '',
      Category: '',
      Description: '',
      DatasetURL: '',
      captcha: '',
    },
    validationSchema,
    validateOnChange: false,
    onSubmit: async (values, { resetForm }) => {
      if (user.name) {
        if (validateCaptcha === 'match') {
          values.Name = user.name;
          values.Email = user.email;

          fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/contact_provider`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              Name: user.email,
              user: user.name,
              dataset_id:
                (router.query.dataset as string)?.split('_')[1] ||
                (router.query.datasetURL as string)
                  ?.substring(router.query.datasetURL.lastIndexOf('/') + 1)
                  ?.split('_')[1],
              category: values.Category,
              desc: values.Description,
              org_id: router.query.providerID,
            }),
          })
            .then((res) => res.json())
            .then((res) => {
              if (res.Success) {
                toast.success(
                  `${
                    ['Providers', 'Feedback'].includes(values.Category)
                      ? 'Details submitted. Email initiated successfully'
                      : 'Details submitted. '
                  }`
                );
                setValidateCaptcha('new');

                setSelectVal(null);
                resetForm();
                if (router.query.dataset) {
                  router.push(`/datasets/${router.query.dataset}`);
                } else if (router.query.datasetURL) {
                  router.push(
                    `/datasets/${(router.query.datasetURL as string)?.substring(
                      router.query.datasetURL.lastIndexOf('/') + 1
                    )}`
                  );
                } else {
                  router.push('/connect-with-idp');
                }
              } else {
                toast.error(
                  `${
                    ['Providers', 'Feedback'].includes(values.Category)
                      ? 'Error in initiating email.'
                      : 'Error in submission'
                  }`
                );
              }
            });
        } else {
          setValidateCaptcha('mismatch');
        }
      } else {
        toast.error('User not logged in');
      }
    },
  });
  const { errors, values } = formik;

  function handleSelect(val) {
    if (val.value === 'Feedback') {
      setToggleDatasetURL(true);
    } else {
      setToggleDatasetURL(false);
    }
    setSelectVal(val);
    formik.setFieldValue('Category', val.value);
  }

  const pageTitle = `Connect with ${
    router.query.providerID ? 'Provider' : 'IDP'
  }`;

  return (
    <Wrapper>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <TextDecaration>
        <Breadcrumbs container title={pageTitle} />
      </TextDecaration>
      <Header>
        <div className="wrapperContainer containerDesktop">
          <Heading variant="h2" as="h1">
            {pageTitle}
          </Heading>
        </div>
      </Header>

      <div className="wrapperContainer containerDesktop">
        <div className="bg-connect">
          <Image
            src="/assets/images/connect.png"
            width={394}
            height={394}
            alt="Image showing data requests, comments, suggestions and various feedback being shared with IDP"
          />
        </div>
        <Form>
          <div>
            <Select
              label="Category"
              options={catogories}
              onChange={(e) => handleSelect(e)}
              value={selectVal}
              inputId="category"
              name="Category"
              isRequired
            />
            {errors.Category && <ErrorMessage>{errors.Category}</ErrorMessage>}
          </div>
          {toggleDatasetURL && (
            <TextField
              name="DatasetURL"
              onChange={(e) => formik.setFieldValue('DatasetURL', e)}
              label="Dataset URL"
              maxLength={200}
              isReadOnly={router.query?.datasetURL ? true : false}
              value={values.DatasetURL}
              errorMessage={errors.DatasetURL}
            />
          )}
          {router.query.providerID && router.query.provider && (
            <TextField
              name="Provider"
              label="Provider"
              isDisabled
              isReadOnly
              value={router.query.provider as string}
            />
          )}
          <TextArea
            name="Description"
            onChange={(e) =>
              formik.setFieldValue(
                'Description',
                e.replace(/[^A-Za-z0-9, "'.?;:&_ ()@$#*^+=[\]!-]/, '')
              )
            }
            label="Description"
            rows={6}
            maxLength={500}
            value={values.Description}
            errorMessage={errors.Description}
            isRequired
            maxHeight={'200px'}
          />
          {user.name && (
            <Captcha
              setValidateCaptcha={setValidateCaptcha}
              ValidateCaptcha={validateCaptcha}
            />
          )}
          <Separator height="1px" marginY="4px" />
          <Button
            isDisabled={!user.name}
            onPress={(e) => formik.handleSubmit(e)}
            size="sm"
          >
            Submit
          </Button>
          {!user.name ? (
            <Banner variant="warning">
              Please register and/or sign in to connect with IDP.{' '}
            </Banner>
          ) : null}
        </Form>
      </div>
      {contacts.length > 0 && (
        <ContactCardsWrapper className="container">
          <Text as={'h2'} paddingBottom={'10px'}>
            Get in Touch
          </Text>
          <ContactCardsContainer>
            {contacts?.map((getInTouch, index) => (
              <ContactCard key={`Get-In-Touch` + index}>
                <Image
                  src={`${process.env.NEXT_PUBLIC_INTERNAL_BACKEND_URL}/cms${getInTouch.image.url}`}
                  alt={'Decorative Image'}
                  width={200}
                  height={200}
                  className="img-contain"
                />
                <Flex flexDirection={'column'} justifyContent={'left'}>
                  <Text fontWeight={'700'}>{getInTouch.role}</Text>
                  <Text>{getInTouch.name}</Text>
                  <Text>{getInTouch.address}</Text>
                  <Text>{getInTouch.email}</Text>
                  <Text>{getInTouch.phone}</Text>
                </Flex>
              </ContactCard>
            ))}
          </ContactCardsContainer>
        </ContactCardsWrapper>
      )}
    </Wrapper>
  );
};

export default ConnectWithUs;

export const getServerSideProps: GetServerSideProps = async () => {
  const contacts = await fetch(`${process.env.STRAPI_URL}/get-in-touches`).then(
    (res) => {
      return res.json();
    }
  );

  return {
    props: {
      contacts,
    },
  };
};

const Wrapper = styled.main`
  .bg-connect {
    position: absolute;
    z-index: -1;
    top: 50%;
    transform: translateY(-50%);
  }

  .wrapperContainer {
    display: flex;
    flex-direction: column;
    position: relative;
  }

  @media (max-width: 640px) {
    .bg-connect {
      display: none;
    }
  }
`;

const ContactCardsWrapper = styled.div`
  border-top: 2px solid var(--color-gray-02);
  padding: 20px 0px 30px 0px;
`;

const ContactCardsContainer = styled.div`
  display: flex;
  gap: 10px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ContactCard = styled.div`
  background-color: var(--color-white);
  border-radius: 4px;
  border: 2px solid var(--color-gray-02);
  box-shadow: var(--box-shadow);
  width: 50%;
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 16px;

  @media (max-width: 768px) {
    width: 100%;
  }

  > span {
    align-self: center;
  }
`;

const TextDecaration = styled.div`
  a {
    text-transform: none;
  }
`;
const Header = styled.header`
  background-color: var(--color-white);
  padding-block: 24px;

  @media (max-width: 640px) {
    padding-block: 16px;
  }
`;

const Form = styled.form`
  align-self: flex-end;
  width: 100%;
  background-color: var(--color-white);
  padding: 16px;
  max-width: 728px;
  margin-block: clamp(32px, 100%, 76px);

  display: flex;
  flex-direction: column;
  gap: 12px;

  button {
    align-self: flex-end;
  }

  > div:first-of-type {
    > div:first-of-type {
      flex-grow: 1;
    }
    > div:last-of-type {
      flex-basis: 350px;
      flex-grow: 1;
    }
  }

  @media (max-width: 640px) {
    margin-top: 16px;
    margin-bottom: 32px;
  }
`;

const CaptchaContainer = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;

  div:first-child {
    flex: 1 1 auto;
  }
  div:last-child {
    display: flex;
    flex-direction: row;
  }
`;
