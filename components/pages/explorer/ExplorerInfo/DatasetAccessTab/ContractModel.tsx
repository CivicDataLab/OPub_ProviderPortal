import { useMutation } from '@apollo/client';
import { CrossSize500 as Cross } from '@opub-icons/ui';
import { LockClosed, LockOpen, Login } from '@opub-icons/workflow';
import Button from 'components/actions/Button';
import Modal from 'components/actions/Modal';
import { Checkbox, Select, TextArea, TextField } from 'components/form';
import { Heading } from 'components/layouts';
import { Flex } from 'components/layouts/FlexWrapper';
import { Link } from 'components/layouts/Link';
import { Tooltip } from 'components/overlays';
import React from 'react';
import { toast } from 'react-toastify';
import { AGREEMENT_REQUEST, mutation } from 'services';
import styled from 'styled-components';
import { purposeList } from './constants';
import { useProviderStore } from 'services/store';

export const ContractModel = ({
  damData,
  title,
  id,
  refetch,
  session,
  request,
  status,
  quotaReached,
  data,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [accepted, setAccepted] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [purpose, setPurpose] = React.useState(purposeList[0]);
  const [isModal, setIsModal] = React.useState(false);
  const isRejected = request?.status === 'REJECTED';

  const { setOrg } = useProviderStore();

  const typeObj = {
    OPEN: {
      icon: <LockOpen width={30} fill="var(--color-secondary-01)" />,
      label: 'Publicly Available',
    },
    RESTRICTED: {
      icon: <LockClosed width={30} fill="var(--color-secondary-01)" />,
      label: 'Request Data Access',
    },
    REGISTERED: {
      icon: <Login width={30} fill="var(--color-secondary-01)" />,
      label: 'Registered Access',
    },
  };

  function checkValid() {
    if (!session) {
      if (!accepted || name.length == 0 || email.length == 0) return false;
      return true;
    }

    if (!accepted) return false;
    return true;
  }

  function handleRequest() {
    if (checkValid()) {
      setIsOpen(!isOpen);
      handleSubmit();
    } else {
      setError(true);
    }
  }

  const [requestDAM, requestDAMRes] = useMutation(AGREEMENT_REQUEST);

  function handleSubmit() {
    setOrg({ org_id: damData.orgId || null });

    const values = {
      description,
      purpose: purpose.value,
      dataset_access_model: id,
    };

    mutation(requestDAM, requestDAMRes, {
      agreement_request: values,
    })
      .then((res) => {
        toast.success('Submission of the Data Access Request is successful.');
        setOrg({ org_id: null });
        refetch();
      })
      .catch(() => toast.error('Error while requesting Dataset Access Model'));

    setIsModal(!isModal);
  }

  return (
    <Wrapper>
      <Tooltip mode="dark" disabled={!(status === 'DISABLED')}>
        <Button
          isDisabled={quotaReached || status === 'DISABLED'}
          size="sm"
          fluid
          onPress={() => setIsOpen(!isOpen)}
        >
          {quotaReached && status !== 'DISABLED'
            ? 'Quota Expired'
            : status === 'DISABLED'
            ? 'Model Disabled'
            : isRejected || (request?.is_valid && !request?.is_valid)
            ? 'Request Again'
            : damData.type === 'REGISTERED' && data.payment_type === 'PAID'
            ? 'Pay and Get Access'
            : damData.type === 'REGISTERED' && data.payment_type === 'FREE'
            ? 'Get Access'
            : damData.type === 'RESTRICTED' && data.payment_type === 'FREE'
            ? 'Request Access'
            : damData.type === 'RESTRICTED' && data.payment_type === 'PAID'
            ? 'Request Access and Pay'
            : ''}
        </Button>
        {quotaReached && status !== 'DISABLED' ? (
          <span>Quota Expired. Try again later.</span>
        ) : (
          <span>Dataset Access Model is disabled</span>
        )}
      </Tooltip>

      <Modal
        label="contract modal"
        isOpen={isOpen}
        modalHandler={() => setIsOpen(!isOpen)}
      >
        <PDFViewerWrapper>
          <header>
            <Heading as="h1" variant="h3">
              Data Access Request
            </Heading>
            <Button
              kind="custom"
              onPress={() => setIsOpen(!isOpen)}
              iconOnly
              icon={<Cross />}
            >
              Close Modal
            </Button>
          </header>

          <Content>
            <PDFWrapper>
              <Link
                className="agreement-link"
                href={`${process.env.NEXT_PUBLIC_BACKEND_URL}/public/${damData.contract}`}
              >
                Download Agreement
              </Link>

              <object
                type="application/pdf"
                data={`${process.env.NEXT_PUBLIC_BACKEND_URL}/public/${damData.contract}`}
              >
                {damData.title} License{' '}
                <a
                  target="_blank"
                  rel="noreferrer"
                  href={`${process.env.NEXT_PUBLIC_BACKEND_URL}/public/${damData.contract}`}
                >
                  pdf link
                </a>
              </object>
            </PDFWrapper>

            <RightSide>
              <DAMDetails>
                <Flex gap="16px" mb="16px">
                  <Icon>{typeObj[damData.type].icon}</Icon>

                  <div>
                    <Heading color="var(--text-light)" variant="h6">
                      {damData.type} ACCESS
                    </Heading>
                    <Heading variant="h4" as="h3">
                      {damData.title}
                    </Heading>
                  </div>
                </Flex>

                {/* <Text as="p" mt="16px">
                  {<>{damData.description}</>}
                </Text> */}
              </DAMDetails>

              <div>
                <Form onSubmit={() => handleRequest()}>
                  <div>
                    {!session && (
                      <Flex gap="16px">
                        <TextField
                          label="Name"
                          isRequired
                          maxLength={100}
                          name="name"
                          onChange={(e) => setName(e)}
                          errorMessage={error && name.length == 0 && 'Required'}
                        />
                        <TextField
                          label="Email"
                          isRequired
                          maxLength={100}
                          name="email"
                          onChange={(e) => setEmail(e)}
                          errorMessage={
                            error && email.length == 0 && 'Required'
                          }
                        />
                      </Flex>
                    )}

                    <Select
                      label="Purpose of Use"
                      inputId="purpose-of-use"
                      onChange={(e: any) => {
                        setPurpose(e);
                      }}
                      options={purposeList}
                      isSearchable={false}
                      defaultValue={purpose}
                      isRequired
                    />

                    <TextArea
                      label="Message for Data Provider"
                      maxLength={500}
                      name="message"
                      onChange={(e: any) => {
                        setDescription(e);
                      }}
                      rows={4}
                    />
                  </div>

                  <Checkbox
                    marginStart="12px"
                    validationState={error && !accepted ? 'invalid' : null}
                    marginTop="8px"
                    onChange={(e) => {
                      setAccepted(e);
                      error && setError(false);
                    }}
                  >
                    I hereby agree to the terms and conditions of access, usage
                    and storage contained in the Data Access Agreement
                  </Checkbox>
                </Form>
                <ButtonWrapper>
                  <Button
                    size="sm"
                    onPress={() => {
                      setIsOpen(!isOpen);
                      error && setError(false);
                    }}
                    kind="primary-outline"
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onPress={() => handleRequest()}
                    kind="primary"
                  >
                    Submit Data Access Request
                  </Button>
                </ButtonWrapper>
              </div>
            </RightSide>
          </Content>
        </PDFViewerWrapper>
      </Modal>
    </Wrapper>
  );
};

const Wrapper = styled.div``;

const Content = styled.div`
  display: flex;
  height: 100%;
  gap: 20px;
  margin-top: 16px;

  @media (max-width: 640px) {
    flex-wrap: wrap;
    height: fit-content;
  }
`;

const PDFViewerWrapper = styled.div`
  padding: 16px;
  background-color: var(--color-white);
  border-radius: 4px;
  filter: var(--drop-shadow);
  flex-direction: column;
  display: flex;

  width: 100vw;
  height: 100vh;
  max-width: 1216px;
  max-height: 720px;

  > header {
    display: flex;
    gap: 16px;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid var(--color-gray-01);
    padding-bottom: 12px;
  }

  object {
    height: 100%;
  }
`;

const PDFWrapper = styled.div`
  height: 100%;
  flex-grow: 1;

  .agreement-link {
    display: none;
    white-space: nowrap;
    display: 100%;
  }

  object {
    width: 100%;
  }

  @media (max-width: 640px) {
    height: fit-content;
    object {
      display: none;
    }

    .agreement-link {
      display: block;
    }
  }
`;

const RightSide = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 99%;
  padding-bottom: 2px;
  flex-basis: 420px;
  overflow-y: auto;

  @media (max-width: 872px) {
    flex-basis: 320px;
  }

  @media (max-width: 640px) {
    flex-basis: 100%;
  }

  > * {
    height: 100%;
  }
`;

const DAMDetails = styled.div``;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid var(--color-gray-01);
  padding-bottom: 14px;

  > header {
    display: flex;
    justify-content: space-between;
    gap: 32px;
    align-items: center;
  }

  > div {
    margin-top: 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;

    label {
      width: 100%;
      display: block;
    }

    textarea {
      display: block;
      width: 100%;
    }
  }

  p {
    overflow: hidden;
    -webkit-line-clamp: 4;
    line-clamp: 4;
    -webkit-box-orient: vertical;
    display: -webkit-box;
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  gap: 16px;
  justify-content: flex-end;
  margin-top: 16px;
`;

const Icon = styled.div`
  padding: 10px;
  border-radius: 2px;
  border: 1px solid var(--color-gray-01);
  background-color: var(--color-secondary-06);
  width: 52px;
  height: 52px;
`;
