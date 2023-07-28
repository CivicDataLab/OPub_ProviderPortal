import { useMutation, useQuery } from '@apollo/client';
import { Button, Modal } from 'components/actions';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import {
  DATA_REQUEST,
  GET_RESOURCE_BY_ID,
  mutation,
  OPEN_DATA_REQUEST,
} from 'services';
import { Item, MenuButton } from 'components/actions/MenuOpub';
import { ChevronDown } from '@opub-icons/workflow';
import { useGuestStore } from 'services/store';
import { Heading } from '../Heading';
import styled from 'styled-components';
import { CrossSize300 } from '@opub-icons/ui';
import { Loader } from 'components/common';
import { Input, Select, TextField } from 'components/form';
import { capitalize } from 'utils/helper';
import { Text } from '../Text';
import { Flex } from '../FlexWrapper';
import { useWindowSize } from 'utils/hooks';

export function ResourceCardButton({
  hasAgreed,
  data,
  data_token = '',
  request,
}) {
  const setOpenDAMIDs = useGuestStore((e) => e.setOpenDAMIDs);
  const { width } = useWindowSize();

  const {
    damReqId: dam_req_id,
    id: res_id,
    type: dam_type,
    damStatus: dam_status,
    status: res_status,
    resourceId: resource_id,
    refetch,
    dataset_model_id,
    supported_formats,
    api_details: apiDetails,
    title: resourceTitle,
  } = data;

  const [requestData, requestDataRes] = useMutation(DATA_REQUEST);
  const [openRequestData, openRequestDataRes] = useMutation(OPEN_DATA_REQUEST);

  function handleSubmit() {
    mutation(requestData, requestDataRes, {
      data_request: {
        dataset_access_model_request: dam_req_id,
        resource: res_id,
      },
    })
      .then((e) => {
        toast.success('Successfully requested Data');
        refetch();
      })
      .catch(() => toast.error('Error while requesting Data'));
  }

  function setRequestId(id) {
    const agreements = localStorage.getItem('data_request_id');
    const str = (agreements ? agreements : '') + `${id},`;
    setOpenDAMIDs(str);
    localStorage.setItem('data_request_id', str);
  }

  function handleOpenSubmit() {
    mutation(openRequestData, openRequestDataRes, {
      data_request: {
        dataset_access_model: dataset_model_id,
        resource: res_id,
      },
    })
      .then((res) => {
        toast.success('Successfully requested Data');
        if (!data.session) setRequestId(res.open_data_request.data_request.id);
        refetch();
      })
      .catch(() => toast.error('Error while requesting Data'));
  }

  // for quota reached state
  if (request === false || !hasAgreed)
    return (
      <Button size="sm" isDisabled>
        Get Access
      </Button>
    );

  if (dam_type === 'OPEN') {
    // if (dam_req_id) {
    <DownloadButton
      id={resource_id}
      data_token={data_token}
      supported_formats={supported_formats}
      width={width}
      apiDetails={apiDetails}
      resTitle={resourceTitle}
    />;
    // } else {
    //   return (
    //     <Button size="sm" onPress={() => handleOpenSubmit()}>
    //       Get Access
    //     </Button>
    //   );
    // }
  }

  return dam_req_id == undefined ? (
    // <Button
    //   size="sm"
    //   isDisabled={checkDisabled({ type: dam_type, damStatus: dam_status })}
    // >
    //   Get Access
    // </Button>
    <DownloadButton
      id={resource_id}
      width={width}
      data_token={data_token}
      supported_formats={supported_formats}
      apiDetails={apiDetails}
      resTitle={resourceTitle}
    />
  ) : dam_status === 'REJECTED' ? (
    <Button size="sm" isDisabled>
      Get Access
    </Button>
  ) : dam_status === 'REQUESTED' ? (
    <Button size="sm" isDisabled>
      Get Access
    </Button>
  ) : dam_status === 'APPROVED' ? (
    <DownloadButton
      id={resource_id}
      data_token={data_token}
      supported_formats={supported_formats}
      apiDetails={apiDetails}
      resTitle={resourceTitle}
      width={width}
    />
  ) : res_status === undefined ? (
    <Button size="sm" onPress={() => handleSubmit()}>
      Get Data
    </Button>
  ) : res_status === 'FETCHED' ? (
    <DownloadButton
      id={resource_id}
      width={width}
      data_token={data_token}
      supported_formats={supported_formats}
      apiDetails={apiDetails}
      resTitle={resourceTitle}
    />
  ) : (
    <Button isDisabled fluid={width < 480} size="sm">
      Please Wait
    </Button>
  );
}

const DownloadButton = ({
  id,
  data_token,
  supported_formats = [],
  apiDetails = null,
  resTitle = '',
  width,
}) => {
  // const apiDistRes = useQuery(GET_RESOURCE_BY_ID, {
  //   variables: {
  //     resource_id: id,
  //   },
  //   skip: !id && apiDetails === null,
  // });

  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);

  // const isLargeDataset =
  //   apiDetails?.is_large_dataset;

  const paramCategories = [
    {
      value: 'exposed',
      title: 'Exposed Parameters',
    },
    {
      value: 'pagination',
      title: 'Pagination Parameters',
    },
  ];

  if (apiDetails !== null) {
    let urlParams = {};

    urlParams[apiDetails?.format_key] =
      apiDetails?.download_same_as_api &&
      apiDetails?.supported_formats?.length === 1
        ? apiDetails?.supported_formats[0]
        : !apiDetails?.download_same_as_api &&
          apiDetails?.download_formats?.length === 1
        ? apiDetails?.download_formats[0]
        : apiDetails?.default_format;

    apiDetails?.parameters.map((paramItem) => {
      if (
        !(
          (paramItem.download_api_options_same &&
            paramItem.options?.length > 1) ||
          (!paramItem.download_api_options_same &&
            paramItem.download_options?.length > 1)
        )
      ) {
        urlParams[paramItem.id] =
          paramItem.options?.length === 1 && paramItem.download_api_options_same
            ? paramItem.options[0]
            : !paramItem.download_api_options_same &&
              paramItem.download_options?.length === 1
            ? paramItem.download_options[0]
            : paramItem.default;
      }
    });

    return (
      <>
        <Button
          size="sm"
          title="Download"
          kind="primary"
          fluid={width < 480}
          onClick={() => {
            setIsDownloadModalOpen(!isDownloadModalOpen);
          }}
        >
          Download
        </Button>

        <Modal
          label={'Download API distribution Modal'}
          isOpen={isDownloadModalOpen}
          modalHandler={() => {
            setIsDownloadModalOpen(!isDownloadModalOpen);
          }}
        >
          <ModalWrapper>
            <ModalHeader>
              <Heading as="h2" variant="h3">
                Download Distribution {`"${resTitle}"`}
              </Heading>
            </ModalHeader>

            <DownloadParamForm>
              <FormElementsWrapper>
                {paramCategories.map(
                  (paramCategory) =>
                    apiDetails?.parameters.filter(
                      (item) => item.type.toLowerCase() === paramCategory.value
                    ).length > 0 && (
                      <ParamWrapper key={paramCategory.value}>
                        <Text
                          variant="pt16b"
                          color={`var(--color-gray-07)`}
                          paddingBottom={'12px'}
                        >
                          {paramCategory.title}
                        </Text>
                        <div className="parameterList">
                          {apiDetails?.parameters
                            .filter(
                              (item) =>
                                item.type.toLowerCase() === paramCategory.value
                            )
                            .map((paramItem, index) => (
                              <div key={`paramItem-${index}`}>
                                <Flex flexDirection={'column'}>
                                  {(paramItem.download_api_options_same &&
                                    paramItem.options?.length > 1) ||
                                  (!paramItem.download_api_options_same &&
                                    paramItem.download_options?.length > 1) ? (
                                    <Select
                                      label={capitalize(paramItem.key)}
                                      inputId={paramItem.key}
                                      options={
                                        paramItem.download_api_options_same
                                          ? paramItem.options.map(
                                              (optionItem) => {
                                                return {
                                                  label: optionItem,
                                                  value: optionItem,
                                                };
                                              }
                                            )
                                          : paramItem.download_options.map(
                                              (optionItem) => {
                                                return {
                                                  label: optionItem,
                                                  value: optionItem,
                                                };
                                              }
                                            )
                                      }
                                      onChange={(e) => {
                                        urlParams[paramItem.id] = e.value;
                                      }}
                                    />
                                  ) : (
                                    <TextField
                                      label={capitalize(paramItem.key)}
                                      id={paramItem.key}
                                      isDisabled={
                                        (paramItem.options?.length === 1 &&
                                          paramItem.download_api_options_same) ||
                                        (paramItem.download_options?.length ===
                                          1 &&
                                          !paramItem.download_api_options_same)
                                      }
                                      onChange={(e) => {
                                        urlParams[paramItem.id] = e;
                                      }}
                                      defaultValue={urlParams[paramItem.id]}
                                    />
                                  )}
                                  <Text as={'p'} color={`var(--text-medium)`}>
                                    {paramItem.description}
                                  </Text>
                                </Flex>
                              </div>
                            ))}
                        </div>
                      </ParamWrapper>
                    )
                )}

                <ParamWrapper>
                  <Text
                    variant="pt16b"
                    color={`var(--color-gray-07)`}
                    paddingBottom={'12px'}
                  >
                    File Format Parameters
                  </Text>
                  <div className="parameterList">
                    {(apiDetails?.download_same_as_api &&
                      apiDetails?.supported_formats.filter((optionItem) => {
                        return optionItem.trim() !== '';
                      })?.length > 1) ||
                    (!apiDetails?.download_same_as_api &&
                      apiDetails?.download_formats?.filter((optionItem) => {
                        return optionItem.trim() !== '';
                      })?.length > 1) ? (
                      <Select
                        inputId="FileFormat"
                        label="Download file as"
                        defaultValue={[
                          ...(apiDetails?.download_same_as_api
                            ? apiDetails?.supported_formats?.map(
                                (supportFormatItem) => {
                                  return {
                                    label: supportFormatItem,
                                    value: supportFormatItem,
                                  };
                                }
                              )
                            : apiDetails?.download_formats?.map(
                                (supportFormatItem) => {
                                  return {
                                    label: supportFormatItem,
                                    value: supportFormatItem,
                                  };
                                }
                              )),
                        ].find(
                          (item) =>
                            item.value === urlParams[apiDetails?.format_key]
                        )}
                        options={
                          apiDetails?.download_same_as_api
                            ? apiDetails?.supported_formats?.map(
                                (supportFormatItem) => {
                                  return {
                                    label: supportFormatItem,
                                    value: supportFormatItem,
                                  };
                                }
                              )
                            : apiDetails?.download_formats?.map(
                                (supportFormatItem) => {
                                  return {
                                    label: supportFormatItem,
                                    value: supportFormatItem,
                                  };
                                }
                              )
                        }
                        onChange={(e) => {
                          urlParams[apiDetails?.format_key] = e.value;
                        }}
                      />
                    ) : (
                      <TextField
                        id={apiDetails?.format_key}
                        label="Download file as"
                        isDisabled={
                          (apiDetails?.download_same_as_api &&
                            apiDetails?.supported_formats?.length === 1) ||
                          (!apiDetails?.download_same_as_api &&
                            apiDetails?.download_formats?.length === 1)
                        }
                        onChange={(e) => {
                          urlParams[apiDetails?.format_key] = e;
                        }}
                        defaultValue={urlParams[apiDetails?.format_key]}
                      />
                    )}
                  </div>
                </ParamWrapper>
              </FormElementsWrapper>
              <Flex gap="12px" justifyContent={'flex-end'} paddingTop={'16px'}>
                <Button
                  kind="primary-outline"
                  onPress={() => {
                    setIsDownloadModalOpen(!isDownloadModalOpen);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  kind="primary"
                  onPress={() => {
                    let urlParamString = '';
                    for (const id in urlParams) {
                      if (Number(id)) {
                        urlParamString = urlParamString.concat(
                          `${
                            apiDetails?.parameters?.find(
                              (paramItem) => paramItem.id === id
                            )?.key
                          }=${urlParams[id]}&`
                        );
                      } else {
                        urlParamString = urlParamString.concat(
                          id + '=' + urlParams[id]
                        );
                      }
                    }

                    window?.open(
                      `${process.env.NEXT_PUBLIC_BACKEND_URL}/get_dist_data/?token=${data_token}&${urlParamString}&type=file`
                    );
                    setIsDownloadModalOpen(!isDownloadModalOpen);
                  }}
                >
                  Download
                </Button>
              </Flex>
            </DownloadParamForm>
          </ModalWrapper>
        </Modal>
      </>
    );
  } else {
    if (supported_formats?.filter((item) => item.length > 0)?.length > 0) {
      return (
        <div>
          <MenuButton
            size="sm"
            label="Download As"
            fluid={width < 480}
            kind="primary"
            icon={<ChevronDown />}
            onAction={(key: any) => window.open(key)}
          >
            {supported_formats.map((supported_format_item) => (
              <Item
                key={`${process.env.NEXT_PUBLIC_BACKEND_URL}/get_dist_data/?token=${data_token}&format=${supported_format_item}&type=file`}
              >
                {supported_format_item}
              </Item>
            ))}
          </MenuButton>
        </div>
      );
    } else {
      return (
        <Button
          as="a"
          target="_blank"
          kind="primary"
          size="sm"
          title="No supported formats available"
          isDisabled={true}
        >
          Download
        </Button>
      );
    }
  }
};

const ModalWrapper = styled.section`
  padding: 16px;
  background-color: var(--color-white);
  border-radius: 4px;
`;

const ModalHeader = styled.div`
  padding: 15px 0px;
  border-bottom: 1px solid var(--color-gray-01);
`;
const DownloadParamForm = styled.form``;

const FormElementsWrapper = styled.section`
  border-bottom: 1px solid var(--color-gray-01);
  max-height: 70vh;
  max-width: 50vw;
  min-width: 50vw;
  overflow: auto;
  @media screen and (max-width: 920px) {
    max-width: 100%;
  }
`;

const ParamWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px 0px;

  .parameterList {
    display: grid;
    grid-gap: 24px;
    grid-template-columns: 1fr 1fr;

    label {
      color: var(--text-medium);
      font-weight: 700;
    }

    @media (max-width: 640px) {
      grid-template-columns: 1fr;
    }
  }
`;
