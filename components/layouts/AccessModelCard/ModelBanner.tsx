import { capitalizeFirstLetter, dateFormat, formatDate } from 'utils/helper';
import { Banner } from '../Banner';
import { Flex } from '../FlexWrapper';
import { Text } from '../Text';

export const ModelBanner = ({ requestSet, quotaReached, damObj, data }) => {
  const request = requestSet[0];
  const statusObj = {
    APPROVED: {
      label: 'Access is valid since',
      varaint: request?.is_valid ? 'success' : 'warning',
    },
    REJECTED: {
      label:
        'Your dataset access request has been rejected with the following remarks: ',
      varaint: 'error',
    },
    REQUESTED: {
      label: 'Request for data access is pending from provider’s end',
      varaint: 'warning',
    },
    PAYMENTPENDING: {
      label: 'Please complete payment to use the dataset.',
      varaint: 'warning',
    },
  };

  if (quotaReached) {
    return (
      <Banner
        variant={request.status === 'APPROVED' ? 'info' : 'error'}
        mt="4px"
      >
        <Content>
          <Text variant="pt14">
            Quota of the day has been expired. Please try next{' '}
            {capitalizeFirstLetter(damObj.validation_unit.toLowerCase())}.
          </Text>
          {request.validity && (
            <span>
              <Text variant="pt14b">Valid Till: </Text>
              {damObj.validation_unit.toLowerCase() === 'lifetime'
                ? capitalizeFirstLetter(damObj.validation_unit.toLowerCase())
                : request.validity}
            </span>
          )}
        </Content>
      </Banner>
    );
  }

  if (request && request?.is_valid === true) {
    return (
      <Banner variant={statusObj[request.status].varaint} mt="4px">
        <Content>
          <Text variant="pt14">
            {statusObj[request.status].label}{' '}
            {request.status === 'APPROVED'
              ? `${formatDate(request.modified)}`
              : null}
            {request.status === 'REJECTED'
              ? ` '${request.remark}'. You may resubmit the dataset access request.`
              : null}
          </Text>

          {request.validity && (
            <span>
              <Text variant="pt14">
                {request?.is_valid ? 'and till ' : 'expires on '}{' '}
                {damObj.validation_unit.toLowerCase() === 'lifetime'
                  ? capitalizeFirstLetter(damObj.validation_unit.toLowerCase())
                  : request.validity}
              </Text>
            </span>
          )}
        </Content>
      </Banner>
    );
  }
  if (request?.is_valid === null) {
    return (
      <Banner variant="warning" mt="4px">
        <Content>
          <Text variant="pt14">
            {damObj.type === 'RESTRICTED' && data.payment_type === 'FREE'
              ? 'You will be informed via email once the your dataset access request is processed.'
              : damObj.type === 'RESTRICTED' && data.payment_type === 'PAID'
              ? 'You will be informed via email to complete the payment once your dataset access request is processed.'
              : damObj.type === 'REGISTERED' && data.payment_type === 'FREE'
              ? 'Please click on Get Access to use the dataset.'
              : damObj.type === 'REGISTERED' && data.payment_type === 'PAID'
              ? 'Please complete payment to use the dataset.'
              : ''}
          </Text>
        </Content>
      </Banner>
    );
  }

  return (
    <Banner variant="warning" mt="4px">
      <Content>
        <Text variant="pt14">
          {damObj.type === 'REGISTERED' && data.payment_type === 'FREE'
            ? 'Please click on Get Access to use the dataset.'
            : damObj.type === 'REGISTERED' && data.payment_type === 'PAID'
            ? 'Please click on Get Access and complete payment to use the dataset.'
            : damObj.type === 'RESTRICTED' && data.payment_type === 'FREE'
            ? 'Please submit dataset access request for approval by the authority concerned.'
            : damObj.type === 'RESTRICTED' && data.payment_type === 'PAID'
            ? 'Please submit dataset access request for approval by the authority concerned and then complete payment.'
            : ''}
        </Text>
      </Content>
    </Banner>
  );
};

const Content = ({ children }) => (
  <Flex alignItems="center" flexWrap="wrap" gap="6px" width="100%">
    {children}
  </Flex>
);
