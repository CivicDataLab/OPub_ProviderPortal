import { useMutation } from '@apollo/client';
import { DeleteOutline } from '@opub-icons/workflow';
import { Button } from 'components/actions';
import {
  Radio,
  RadioGroup,
  Select,
  TextArea,
  TextField,
} from 'components/form';
import { Plus } from 'components/icons';
import { Text } from 'components/layouts';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { CREATE_API_SOURCE, mutation } from 'services';
import { RootState } from 'Store';
import styled from 'styled-components';

const ApiSourceForm = ({ onMutationComplete, apiData }) => {
  const datasetStore = useSelector((state: RootState) => state.addDataset);

  const parsedCreds = apiData?.id ? JSON.parse(apiData?.auth_credentials) : [];

  const [authType, setAuthType] = useState(
    apiData?.id ? apiData?.auth_type : 'CREDENTIALS'
  );

  const credentials = apiData?.id
    ? [
        {
          auth_cred_key_1: parsedCreds[0]?.key,
          auth_cred_value_1: parsedCreds[0]?.value,
          auth_cred_desc_1: parsedCreds[0]?.description,
        },
        {
          auth_cred_key_2: parsedCreds[1]?.key,
          auth_cred_value_2: parsedCreds[1]?.value,
          auth_cred_desc_2: parsedCreds[1]?.description,
        },
      ]
    : [];

  const [headerList, setHeaderList] = useState(
    apiData?.id
      ? apiData.headers.map((item) => {
          return {
            ...JSON.parse(item),
            errors: {
              key: null,
              value: null,
              description: null,
            },
          };
        })
      : [
          {
            key: '',
            value: '',
            description: '',
            errors: {
              key: null,
              value: null,
              description: null,
            },
          },
        ]
  );

  const handleCommonHeadersAdd = () => {
    const newArr = [...headerList];
    newArr.push({
      key: '',
      value: '',
      description: '',
      errors: {
        key: null,
        value: null,
        description: null,
      },
    });
    setHeaderList(newArr);
  };

  const handleCommonHeadersRemove = (index) => {
    const newArr = [...headerList];
    newArr.splice(index, 1);
    setHeaderList(newArr);
  };

  const [createAPISource, createAPISourceRes] = useMutation(CREATE_API_SOURCE);

  function handleAPISave(e) {
    e.preventDefault();
    e.stopPropagation();

    const res = Object.fromEntries(new FormData(e.target).entries());

    const headerArr = headerList.map((item, index) => ({
      key: res[`header_key_${index}`],
      value: res[`header_value_${index}`],
      description: res[`header_desc_${index}`],
    }));

    const API_source = {
      title: res.title,
      base_url: res.base_url,
      description: res.description,
      api_version: res.api_version,
      headers: headerArr.filter((item) => item.key !== ''),
      auth_loc: res.auth_loc,
      auth_type: res.auth_type,
      auth_credentials: res.auth_cred_key_1
        ? [
            {
              key: res.auth_cred_key_1,
              value: res.auth_cred_value_1,
              description: res.auth_cred_desc_1,
            },
            {
              key: res.auth_cred_key_2,
              value: res.auth_cred_value_2,
              description: res.auth_cred_desc_2,
            },
          ]
        : [],
      auth_token: res.auth_token || '',
      auth_token_key: res.auth_token_key || '',
    };

    mutation(createAPISource, createAPISourceRes, {
      api_source_data: API_source,
    })
      .then((res) => {
        toast.success('New API Source created');
        onMutationComplete(res.create_api_source.API_source.id);
      })
      .catch(() => toast.error('Error while creating API Source'));
  }

  return (
    <Status onSubmit={(e) => handleAPISave(e)}>
      <TextField
        name="title"
        label="Title"
        maxLength={100}
        defaultValue={
          apiData?.id ? `${apiData?.title} - (clone)` : datasetStore.title
        }
        placeholder="Add a title to identify the API source"
        isRequired
      />

      <TextField
        label="Base URL"
        name="base_url"
        maxLength={200}
        placeholder="Add the URL of the API source"
        isRequired
        defaultValue={apiData?.id ? apiData?.base_url : ''}
      />

      <TextArea
        label="Description"
        placeholder="Add a brief description of the API source"
        maxLength={500}
        defaultValue={
          apiData?.id ? apiData?.description : datasetStore.description
        }
        name="description"
      />

      <TextField
        label="Version"
        maxLength={100}
        placeholder="Add a version number for the API source, if any"
        name="api_version"
        defaultValue={apiData?.id ? apiData?.api_version : ''}
      />

      <div className="commonheaders">
        <span>Common Headers</span>
        {headerList.map((singleHeader, index) => (
          <div className="header-fields" key={index}>
            <TextField
              placeholder="Key"
              name={`header_key_${index}`}
              maxLength={100}
              defaultValue={singleHeader.key}
            />

            <TextField
              placeholder="Value"
              name={`header_value_${index}`}
              maxLength={100}
              defaultValue={singleHeader.value}
            />

            <TextField
              placeholder="Description"
              name={`header_desc_${index}`}
              maxLength={100}
              defaultValue={singleHeader.description}
            />

            {headerList.length > 1 && (
              <Button
                kind="custom"
                icon={<DeleteOutline />}
                iconOnly
                onPress={() => handleCommonHeadersRemove(index)}
              />
            )}
          </div>
        ))}

        <Button
          kind="custom"
          className="AddCommonHeadersBtn"
          onPress={() => handleCommonHeadersAdd()}
          iconSide="left"
          icon={<Plus />}
        >
          Add Common Headers
        </Button>
      </div>
      <div className="authentication">
        <div className="radioGroupContainer">
          <Text as={'h5'} variant="pt16">
            Authentication Type
          </Text>
          <RadioGroup
            name="auth_type"
            value={authType}
            onChange={(e) => setAuthType(e)}
          >
            <Radio id="username" value="CREDENTIALS">
              Credentials
            </Radio>
            <Radio value="TOKEN">Token</Radio>
            <Radio value="NO_AUTH">No Auth</Radio>
          </RadioGroup>
        </div>
        {authType === 'CREDENTIALS' ? (
          <div className="cred-inputs">
            <Text>
              Credentials{' '}
              <Text
                as="span"
                fontSize={'0.75rem'}
                lineHeight={'1.3'}
                fontWeight={`var(--font-normal)`}
              >
                (Required)
              </Text>
            </Text>
            <div>
              <TextField
                placeholder="Username Key"
                name="auth_cred_key_1"
                maxLength={100}
                isRequired
                defaultValue={
                  credentials[0]?.auth_cred_key_1
                    ? credentials[0]?.auth_cred_key_1
                    : ''
                }
              />

              <TextField
                placeholder="Username Value"
                name="auth_cred_value_1"
                maxLength={100}
                isRequired
                defaultValue={
                  credentials[0]?.auth_cred_value_1
                    ? credentials[0]?.auth_cred_value_1
                    : ''
                }
              />

              <TextField
                placeholder="Description"
                name="auth_cred_desc_1"
                maxLength={100}
                isRequired
                defaultValue={
                  credentials[0]?.auth_cred_desc_1
                    ? credentials[0]?.auth_cred_desc_1
                    : ''
                }
              />
            </div>
            <div>
              <TextField
                placeholder="Password Key"
                name="auth_cred_key_2"
                maxLength={100}
                isRequired
                defaultValue={
                  credentials[1]?.auth_cred_key_2
                    ? credentials[1]?.auth_cred_key_2
                    : ''
                }
              />

              <TextField
                placeholder="Password Value"
                name="auth_cred_value_2"
                maxLength={100}
                isRequired
                defaultValue={
                  credentials[1]?.auth_cred_value_2
                    ? credentials[1]?.auth_cred_value_2
                    : ''
                }
              />

              <TextField
                placeholder="Description"
                name="auth_cred_desc_2"
                maxLength={100}
                isRequired
                defaultValue={
                  credentials[1]?.auth_cred_desc_2
                    ? credentials[1]?.auth_cred_desc_2
                    : ''
                }
              />
            </div>
          </div>
        ) : authType == 'TOKEN' ? (
          <>
            <TextField
              name="auth_token_key"
              placeholder="Auth Token Key"
              maxLength={100}
              isRequired
              label="Auth Token Key"
              defaultValue={apiData?.auth_token_key || ''}
            />

            <TextField
              name="auth_token"
              placeholder="Auth Token"
              maxLength={2000}
              isRequired
              label="Auth Token"
              defaultValue={apiData?.auth_token || ''}
            />
          </>
        ) : (
          <></>
        )}
        {authType !== 'NO_AUTH' && (
          <label>
            <Select
              name="auth_loc"
              inputId={'auth_loc'}
              label="In"
              isRequired
              defaultValue={[
                {
                  label: 'Header',
                  value: 'HEADER',
                },
                {
                  label: 'Parameter',
                  value: 'PARAM',
                },
              ].find((item) => item.value === apiData?.auth_loc)}
              onChange={(e) => {
                return e.value;
              }}
              options={[
                {
                  label: 'Header',
                  value: 'HEADER',
                },
                {
                  label: 'Parameter',
                  value: 'PARAM',
                },
              ]}
            />
          </label>
        )}
      </div>
      <Button type="submit">Create API Source</Button>
    </Status>
  );
};

export default ApiSourceForm;

const Status = styled.form`
  padding: 15px;
  /* margin-top: 10px; */
  min-width: 1014px;
  max-height: 90vh;
  overflow-y: auto;
  overflow-x: auto;
  display: flex;
  flex-direction: column;
  align-items: flex-end;

  @media (max-width: 720px) {
    max-width: 100vw;
    min-width: 100vw;
  }

  > div {
    margin-bottom: 20px;
    width: 100%;

    > label {
      /* margin-bottom: 8px; */
      display: block;
    }
  }

  .fieldError {
    color: var(--color-error);
    font-size: small;
  }

  .commonheaders {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;

    .AddCommonHeadersBtn {
      border: 2px solid var(--color-tertiary-1-00);
      color: var(--color-tertiary-1-00);
      padding: 8px 16px 8px 12px;
    }
  }

  .header-fields {
    display: flex;
    gap: 8px;
    margin-bottom: 8px;
    flex-wrap: wrap;
    width: 100%;

    > div {
      flex-grow: 1;
    }
  }

  .cred-inputs {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 10px;

    > div {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;

      > div {
        flex-grow: 1;
      }
    }
  }
  .authentication {
    .radioGroupContainer {
      > div {
        border-bottom: 1px solid var(--color-gray-02);
        margin: 8px 0px;
        > div {
          display: flex;
          flex-direction: row;
          gap: 32px;
          margin: 8px;

          span {
            color: var(--text-medium);
            font-size: 16px;
            font-style: normal;
            font-weight: 700;
          }
        }
      }
    }
  }
`;
