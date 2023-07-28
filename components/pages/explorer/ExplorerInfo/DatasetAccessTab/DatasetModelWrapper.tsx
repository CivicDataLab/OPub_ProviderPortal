import { Button, Modal } from 'components/actions';
import { AccessModelCard } from 'components/layouts/AccessModelCard';
import { signIn } from 'next-auth/react';
import React, { useState } from 'react';
import { ContractModel } from './ContractModel';
import { useRouter } from 'next/router';
import { fetchpaymenturl } from 'utils/fetch';
import { GET_ORG_DETAILS_BY_DATASET_ID } from 'services';
import { useQuery } from '@apollo/client';
import styled from 'styled-components';
import { useProviderStore } from 'services/store';
import { toast } from 'react-toastify';
import { Flex } from 'components/layouts/FlexWrapper';
import { Text } from 'components/layouts';
import { Close } from '@opub-icons/workflow';

export const DatasetModelWrapper = ({ item, session }) => {
  const [resOpen, setResOpen] = React.useState(false);
  const [hasAgreed, setHasAgreed] = React.useState<boolean>(false);
  const [quotaReached, setQuotaReached] = React.useState<boolean>(false);
  const requestSet = item?.datasetaccessmodelrequest_set;

  const OrgDetailsFromDatasetIDRes = useQuery(GET_ORG_DETAILS_BY_DATASET_ID, {
    variables: {
      dataset_id: item.datasetId,
    },
    skip: !item.datasetId,
  });

  React.useEffect(() => {
    if (item.data_access_model.type === 'OPEN') {
      setHasAgreed(true);
      return;
    }

    if (requestSet[0]) {
      if (requestSet[0].remaining_quota == 0) {
        setQuotaReached(true);
        // setHasAgreed(false);
        return;
      }
    }

    if (item.agreements.length) {
      if (
        item?.datasetaccessmodelrequest_set[0] &&
        item?.datasetaccessmodelrequest_set[0].status !== 'REJECTED' &&
        item?.datasetaccessmodelrequest_set[0].status !== 'PAYMENTPENDING'
      )
        setHasAgreed(true);
      else setHasAgreed(false);
    }
  }, [item.agreements]);

  return (
    <AccessModelCard
      key={item.title}
      resOpen={resOpen}
      setResOpen={setResOpen}
      data={{ ...item, quotaReached: quotaReached, session: session }}
      hasAgreed={hasAgreed}
      request={
        item?.datasetaccessmodelrequest_set &&
        item?.datasetaccessmodelrequest_set[0]
      }
      actionlist={true}
      customActions={
        <DatasetAccessModel
          setResOpen={() => setResOpen(!resOpen)}
          resOpen={resOpen}
          request={
            item?.datasetaccessmodelrequest_set &&
            item?.datasetaccessmodelrequest_set[0]
          }
          data={{
            ...item,
            quotaReached: quotaReached,
            orgId:
              OrgDetailsFromDatasetIDRes?.data?.dataset?.catalog?.organization
                ?.id,
          }}
          session={session}
          damData={item.data_access_model}
          setHasAgreed={setHasAgreed}
          hasAgreed={hasAgreed}
          reqid={item}
        />
      }
    />
  );
};

function DatasetAccessModel({
  data,
  request,
  session,
  damData,
  setResOpen,
  resOpen,
  setHasAgreed,
  hasAgreed,
  reqid,
}) {
  const router = useRouter();
  const [paymentNotAvailableModalOpen, setPaymentNotAvailableModalOpen] =
    React.useState(false);

  const { type, title, status } = data.data_access_model;
  const { id, quotaReached, orgId } = data;

  const approvedObj = {
    label: resOpen ? 'Hide Distributions' : 'Show Distributions',
    action: setResOpen,
  };

  const requestAccess = {
    label: 'Get Access',
    action: () => {
      !session &&
        typeof window !== 'undefined' &&
        signIn('keycloak', {
          callbackUrl: `${window.location.href}?clientLogin=true`,
        });
    },
  };

  const requestPending = {
    label: 'Access Requested',
    action: () => {},
  };

  const requestRejected = {
    label: 'Request Again',
    action: () => {},
  };

  const currentOrgRole = useProviderStore((e) => e.org);

  const paymentPending = {
    label: 'Make Payment',
    action: () => {
      if (
        router.query.payment === 'true' ||
        process.env.NEXT_PUBLIC_ENABLE_PAYMENT === 'true'
      ) {
        fetchpaymenturl(request.id, session, currentOrgRole?.org_id)
          .then((data) => {
            if (
              window.confirm(
                `You are being redirected to ${data.payment_request.longurl}`
              )
            ) {
              window.open(data.payment_request.longurl, '_self');
            }
          })
          .catch((err) => {
            toast.error(err);
          });
      } else {
        setPaymentNotAvailableModalOpen(!paymentNotAvailableModalOpen);
      }
    },
  };

  function getButtonState(session, type, hasAgreed) {
    if (type === 'OPEN') {
      return approvedObj;
    }

    if (type === 'REGISTERED') {
      if (session && hasAgreed && request?.is_valid) return approvedObj;
      if (session && !hasAgreed && request?.status === 'PAYMENTPENDING')
        return paymentPending;

      if (session && !hasAgreed) return requestAccess;
      return requestAccess;
    }

    if (type === 'RESTRICTED') {
      if (session && hasAgreed && request?.status) {
        if (request?.status === 'APPROVED' && request?.is_valid)
          return approvedObj;
        if (request?.status === 'REQUESTED') return requestPending;
        if (request?.status === 'REJECTED' || !request?.is_valid)
          return requestRejected;
      }
      if (session && !hasAgreed && request?.status === 'PAYMENTPENDING')
        return paymentPending;

      if (session && !hasAgreed) return requestAccess;
      return requestAccess;
    }
  }

  function getButton(session, hasAgreed, type) {
    if (type === 'OPEN') {
      return 'DAMButton';
    }

    if (type === 'REGISTERED' || type === 'RESTRICTED') {
      if (quotaReached) return 'contractButton';
      if (session && !hasAgreed && request?.status === 'PAYMENTPENDING')
        return 'DAMButton';
      if (session && !hasAgreed && request?.status !== 'PAYMENTPENDING')
        return 'contractButton';
      if (session && request?.status !== 'REQUESTED' && !request?.is_valid)
        return 'contractButton';
      return 'DAMButton';
    }
  }

  return getButton(session, hasAgreed, type) === 'DAMButton' ? (
    <>
      <Button
        fluid
        size="sm"
        isDisabled={request?.status === 'REQUESTED'}
        onPress={getButtonState(session, type, hasAgreed).action}
      >
        {getButtonState(session, type, hasAgreed).label}
      </Button>

      <Modal
        isOpen={paymentNotAvailableModalOpen}
        label="pdf viewer"
        modalHandler={() =>
          setPaymentNotAvailableModalOpen(!paymentNotAvailableModalOpen)
        }
      >
        <ModalContainer>
          <Flex justifyContent={'space-between'} alignItems={'center'}>
            <Text as={'h3'}>Payment Disabled</Text>
            <Button
              kind="custom"
              icon={<Close />}
              onPress={() =>
                setPaymentNotAvailableModalOpen(!paymentNotAvailableModalOpen)
              }
            />
          </Flex>
          <Line />
          <Text variant="pt14">
            Please note that the payment mechanism is not enabled and contact
            the Data Provider to access this priced dataset.
          </Text>

          <Flex justifyContent={'flex-end'}>
            <Button
              kind="primary"
              size="sm"
              onPress={() =>
                setPaymentNotAvailableModalOpen(!paymentNotAvailableModalOpen)
              }
            >
              OK
            </Button>
          </Flex>
        </ModalContainer>
      </Modal>
    </>
  ) : (
    <>
      <ContractModel
        title={title}
        damData={{ ...damData, orgId: orgId }}
        status={status}
        request={request}
        refetch={data.refetch}
        quotaReached={quotaReached}
        id={id}
        session={session}
        data={data}
      />
    </>
  );
}

export const RemarkModalContentWrapper = styled.section`
  background-color: var(--color-background-lightest);
  max-height: 90vh;
  min-width: 30vw;
  max-width: 1014px;
  padding: 20px;
  overflow-y: auto;
  border-radius: 8px;
`;

const ModalContainer = styled.div`
  padding: 15px;
  background-color: var(--color-white);
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 400px;
  max-height: 400px;
  overflow-y: auto;
`;

const Line = styled.div`
  border: 1px solid var(--color-gray-01);
`;
