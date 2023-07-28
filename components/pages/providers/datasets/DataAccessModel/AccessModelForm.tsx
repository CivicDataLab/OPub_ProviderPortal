import { useMutation, useQuery } from '@apollo/client';
import { Button, Modal } from 'components/actions';
import { Indicator, Label } from 'components/form/BaseStyles';
import {
  Checkbox,
  NumberField,
  RadioGroup,
  Select,
  Switch,
  TextArea,
  TextField,
} from 'components/form';
import { ErrorMessage } from 'components/form/BaseStyles';
import { Banner, Heading, Text } from 'components/layouts';
import { Flex } from 'components/layouts/FlexWrapper';
import { Link, NextLink } from 'components/layouts/Link';
import { LinkButton } from 'components/pages/dashboard/helpers';
import { Formik, useFormik } from 'formik';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import {
  ACCESS_MODEL_RESOURCE,
  GET_DAM_BY_ID,
  mutation,
  ORG_DATA_ACCESS_MODELS,
  UPDATE_ACCESS_MODEL_RESOURCE,
} from 'services';
import { useProviderStore } from 'services/store';
import styled from 'styled-components';
import useEffectOnChange from 'utils/hooks';
import Aside from '../Aside';
import { AccessModelDelete } from './AccessModelDelete';
import { CrossSize300 } from '@opub-icons/ui';
import { Loader } from 'components/common';
import { Table } from 'components/data/BasicTable';
import JSONPretty from 'react-json-pretty';
import { fetchpreview } from 'utils/fetch';
import { Visibility } from '@opub-icons/workflow';
import { ALL_PUBLISHED_POLICY } from 'services/schema';
import { omit } from 'utils/helper';
import { useSession } from 'next-auth/react';

// const validationSchema = Yup.object().shape({
//   access_model_id: Yup.string().required('Required'),
//   title: Yup.string().required('Required'),
// });

export const AccessModelForm = ({
  datasetId,
  datasetData,
  setCurrentTab,
  editId = undefined,
}) => {
  const [selectValue, setSelectValue] = React.useState<any>();
  const [selectPolicyValue, setSelectPolicyValue] = React.useState<any>();
  const [pricingAction, setPricingAction] = useState('FREE');

  const handledbAction = (e) => {
    setPricingAction(e.target.name);
    formik.setFieldValue('payment_type', e.target.name);
  };

  const org = useProviderStore((e) => e.org);
  const router = useRouter();
  const resourceSet = [...datasetData.resource_set].sort(
    (a, b): any => a.id < b.id
  );
  const { data: modelsList } = useQuery(ORG_DATA_ACCESS_MODELS, {
    variables: { organization_id: org?.org_id },
    skip: !org?.org_id,
  });

  const { data: policyRes } = useQuery(ALL_PUBLISHED_POLICY, {
    skip: !org?.org_id,
  });
  const policyList = React.useMemo(() => {
    if (policyRes?.approved_policy) {
      const filtered = [...policyRes.approved_policy].filter(
        (e) => e.status == 'PUBLISHED'
      );

      return filtered.map((item) => ({
        label: item.title,
        value: item.id,
        description: item.description,
      }));
    }
    return [];
  }, [policyRes]);

  const [accessModelResourceReq, accessModelResourceRes] = useMutation(
    ACCESS_MODEL_RESOURCE
  );

  const [updateAccessModelResourceReq, updateAccessModelResourceRes] =
    useMutation(UPDATE_ACCESS_MODEL_RESOURCE);

  // if edit id is provided, fetch that
  const { data: damRes } =
    editId != undefined
      ? useQuery(GET_DAM_BY_ID, {
          variables: { id: editId },
          skip: !editId,
        })
      : { data: null };

  const damDetails = damRes?.dataset_access_model_by_id;

  // run this on dam details, its for edit section
  useEffectOnChange(() => {
    if (damDetails) {
      const damId = damDetails?.data_access_model?.id;
      const damLabel = damDetails?.data_access_model?.title;

      const policyValue = damDetails?.policy?.id;
      const policyLabel = damDetails?.policy?.title;
      const damTitle = damDetails?.title;
      const damDesc = damDetails?.description;

      const paymentType = damDetails?.payment_type;
      const payment = damDetails?.payment;

      let damResources = damDetails?.datasetaccessmodelresource_set;
      damResources.sort((a, b) => a.resource.id < b.resource.id);

      setSelectValue({ label: damLabel, value: damId });
      setSelectPolicyValue({ label: policyLabel, value: policyValue });

      formik.setFieldValue('title', damTitle);
      formik.setFieldValue('description', damDesc);
      formik.setFieldValue('access_model_id', damId);
      formik.setFieldValue('policy_id', policyValue);
      formik.setFieldValue('payment_type', paymentType);
      setPricingAction(paymentType);

      formik.setFieldValue('payment', payment);

      formik.setFieldValue(
        'resource_map',
        resourceSet.map((item) => {
          const fieldsArray = [];
          const dam = damResources.find(
            (damE) => damE?.resource.id === item.id
          );
          if (dam) {
            dam.fields.forEach((e) => {
              fieldsArray.push({
                label: e.key,
                value: e.id,
              });
            });
          }
          return {
            resource_id: dam ? item.id : '',
            fields: fieldsArray,
            sample_enabled: dam?.sample_enabled,
            sample_rows: dam?.sample_rows,
            parameters: dam?.parameters?.map((item) => {
              return {
                ...JSON.parse(item),
              };
            }),
          };
        })
      );
    }
  }, [damDetails]);
  const list = React.useMemo(() => {
    return modelsList?.org_data_access_models
      .filter((e) => e.status === 'ACTIVE')
      .map((item) => item);
  }, [modelsList]);

  const [isValid, setisValid] = useState(false);
  const [isTitleValid, setisTitleValid] = useState(false);
  const [isDescValid, setisDescValid] = useState(false);
  const [isDatasetId, setisDatasetId] = useState(false);
  const [isPolicyID, setisPolicyId] = useState(false);
  const [isPricing, setisPricing] = useState(false);
  const [isPaymentType, setisPaymentType] = useState(false);

  const formik: any = useFormik({
    initialValues: {
      access_model_id: '',
      policy_id: '',
      title: '',
      description: '',
      dataset_id: datasetId,
      payment_type: 'FREE',
      payment: 0,
      resource_map: resourceSet.map((e) => ({
        resource_id: '',
        fields: [],
        sample_enabled: '',
        sample_rows: 0,
        parameters: [],
      })),
    },

    validateOnChange: false,
    onSubmit: (values) => {
      if (
        formik.values.resource_map.filter((item) => item.resource_id !== '')
          .length == 0 ||
        formik.values.title === '' ||
        formik.values.description === '' ||
        formik.values.access_model_id === '' ||
        formik.values.policy_id === ''
      ) {
        {
          formik.values.resource_map.filter((item) => item.resource_id !== '')
            .length == 0 && setisValid(true);
        }
        {
          formik.values.title === '' && setisTitleValid(true);
        }
        {
          formik.values.description === '' && setisDescValid(true);
        }
        {
          formik.values.access_model_id === '' && setisDatasetId(true);
        }
        {
          formik.values.policy_id === '' && setisPolicyId(true);
        }

        Damdata?.type !== 'OPEN' &&
        formik.values.payment_type === 'PAID' &&
        formik.values.payment > 0
          ? setisPricing(false)
          : setisPricing(true);
      } else {
        let submitValues: any = {
          ...values,

          resource_map: values.resource_map
            .filter((e) => e != undefined && e.resource_id != '')
            .map((resourceItem) => {
              return {
                resource_id: resourceItem.resource_id,
                fields: resourceItem.fields.map((e) => e.value),
                sample_enabled: resourceItem?.sample_enabled,
                sample_rows: resourceItem?.sample_rows,
                parameters: resourceItem?.parameters,
              };
            }),
        };
        if (submitValues.payment_type === 'FREE')
          submitValues = omit(submitValues, ['payment']);

        if (editId) {
          submitValues.id = editId;
          mutation(updateAccessModelResourceReq, updateAccessModelResourceRes, {
            access_model_resource_data: submitValues,
          })
            .then(() => {
              toast.success('Successfully updated!');
              setCurrentTab('list');
            })
            .catch((err) => {
              toast.error(
                err.message || 'Error while updating Dataset Access Model'
              );
            });
        } else {
          mutation(accessModelResourceReq, accessModelResourceRes, {
            access_model_resource_data: submitValues,
          })
            .then(() => {
              toast.success('Successfully created!');

              setCurrentTab('list');
            })
            .catch((err) => {
              toast.error(
                err.message || 'Error while creating Dataset Access Model'
              );
            });
        }
      }
    },
  });
  const Damdata = list?.find(
    (item) => item?.id == formik?.values?.access_model_id
  );

  useEffect(() => {
    formik.setFieldValue('payment', formik.values.payment);
    setisPricing(false);
  }, [formik.values.payment_type]);

  return (
    <>
      <main>
        <HeaderWrapper>
          <Heading as="h2" variant="h3">
            {editId ? 'Modify' : 'Add'} Dataset Access Model
          </Heading>
          <AddTransform title="Back to Dataset Access Model List">
            <LinkButton
              label="Back to Dataset Access Model List"
              type="back"
              onClick={() => setCurrentTab('list')}
            />
          </AddTransform>
        </HeaderWrapper>

        <Wrapper onSubmit={formik.handleSubmit}>
          <TextField
            label={'Title of the Dataset Access Model'}
            isRequired
            value={formik.values.title}
            onChange={(e) => {
              formik.setFieldValue('title', e);
              setisTitleValid(false);
            }}
            maxLength={100}
            errorMessage={isTitleValid === true && 'Required'}
          />

          <TextArea
            label={'Description of the Dataset Access Model'}
            isRequired
            value={formik.values.description}
            rows={5}
            onChange={(e) => {
              formik.setFieldValue('description', e);
              setisDescValid(false);
            }}
            maxLength={1500}
            errorMessage={isDescValid === true && 'Required'}
          />

          <Select
            label="Select an Access Model"
            inputId="data-access-list"
            options={list?.map((item) => {
              return {
                label: item.title,
                value: item.id,
              };
            })}
            defaultValue={selectValue}
            key={selectValue}
            isRequired
            onChange={(e) => {
              formik.setFieldValue('access_model_id', e.value);
              setisDatasetId(false);
            }}
            errorMessage={isDatasetId === true && 'This field is required'}
          />

          <DAMData>
            {formik?.values?.access_model_id && (
              <>
                <Flex justifyContent={'space-between'}>
                  <Text>
                    <strong>Rate Limit:</strong> {Damdata?.rate_limit} /{' '}
                    {Damdata?.rate_limit_unit}{' '}
                  </Text>
                </Flex>
                <Flex justifyContent={'space-between'}>
                  {Damdata?.subscription_quota && (
                    <Text>
                      {' '}
                      <strong> Subscription Quota:</strong>{' '}
                      {Damdata?.subscription_quota} /{' '}
                      {Damdata?.subscription_quota_unit}
                    </Text>
                  )}
                </Flex>
                <Flex justifyContent={'space-between'}>
                  {Damdata?.validation && (
                    <Text>
                      {' '}
                      <strong> Validity:</strong> {Damdata?.validation} /{' '}
                      {Damdata?.validation_unit}
                    </Text>
                  )}
                </Flex>
                <Flex justifyContent={'space-between'}>
                  <Text>
                    {' '}
                    <strong>Type:</strong> {Damdata?.type}
                  </Text>
                </Flex>
              </>
            )}
          </DAMData>

          <div>
            {org.role === 'DPA' ? (
              <NextLink
                href={`/providers/${router.query.provider}/dashboard/data-access-model/create`}
              >
                <Link>Add New Access Model</Link>
              </NextLink>
            ) : (
              <Aside
                title={
                  'Please contact Data Provider Admin to create new Access Model'
                }
              />
            )}
          </div>

          <Select
            label="Select a Policy"
            inputId="policy"
            options={policyList?.map((item) => {
              return {
                label: item.label,
                value: item.value,
              };
            })}
            defaultValue={selectPolicyValue}
            key={selectPolicyValue}
            isRequired
            onChange={(e) => {
              formik.setFieldValue('policy_id', e.value);
              setisPolicyId(false);
            }}
            errorMessage={isPolicyID === true && 'This field is required'}
          />
          <div>
            {org.role === 'DPA' ? (
              <NextLink
                href={`/providers/${router.query.provider}/dashboard/policy/request`}
              >
                <Link>Add New Policy</Link>
              </NextLink>
            ) : (
              <Aside
                title={
                  'Please contact Data Provider Admin to create new Policy'
                }
              />
            )}
          </div>
          {Damdata?.type !== 'OPEN' && (
            <PricingWrapper>
              <Label>
                Pricing Type <Indicator>(Required)</Indicator>
              </Label>

              <Flex gap="10px" paddingY={'16px'}>
                <div>
                  <Flex gap="8px">
                    <input
                      type="radio"
                      name="FREE"
                      value={pricingAction}
                      checked={pricingAction === 'FREE'}
                      required={pricingAction === ''}
                      defaultChecked
                      onChange={(e) => handledbAction(e)}
                    />
                    <p>Free</p>
                  </Flex>
                  <Dbdescription>
                    A Sample description about the pricing model
                  </Dbdescription>
                </div>
                <div>
                  <Flex gap="8px">
                    <input
                      type="radio"
                      name="PAID"
                      required={pricingAction === ''}
                      checked={pricingAction === 'PAID'}
                      value={pricingAction}
                      onChange={(e) => handledbAction(e)}
                    />
                    <p>Paid</p>
                  </Flex>
                  <Dbdescription>
                    A Sample description about the pricing model
                  </Dbdescription>
                  {pricingAction === 'PAID' ? (
                    <>
                      <NumberField
                        label="Enter the price of dataset"
                        isRequired
                        value={formik.values.payment}
                        onChange={(e) => {
                          setisPricing(false);
                          formik.setFieldValue('payment', e);
                        }}
                        minValue={0}
                        errorMessage={isPricing === true && 'Required'}
                      />
                    </>
                  ) : (
                    ''
                  )}
                </div>
              </Flex>

              {process.env.NEXT_PUBLIC_ENABLE_PAYMENT === 'false' &&
                pricingAction === 'PAID' && (
                  <Banner variant="warning">
                    <Text>
                      Please note that the payment mechanism is not enabled and
                      Data Consumers will not be able to complete payment to
                      access priced datasets.
                    </Text>
                  </Banner>
                )}
            </PricingWrapper>
          )}

          <div>
            <Heading as="h3" variant={'h5'}>
              Select the Distributions for this Dataset Access Model{' '}
              <Indicator>(Required)</Indicator>
            </Heading>
          </div>
          <ResourceList>
            {resourceSet.map((item, index) => {
              const formatted: any = [];
              const selected: any = [];

              item.schema?.forEach((e) => {
                formatted.push({
                  label: e.key,
                  value: e.id,
                });
                if (
                  formik.values.resource_map[index]?.fields
                    ?.map((fieldItem) => fieldItem.value)
                    .includes(e.id)
                ) {
                  selected.push({
                    label: e.key,
                    value: e.id,
                  });
                }
              });

              const isChecked = formik.values.resource_map[index]?.resource_id;

              // Select all if selected is empty
              if (selected.length < 1 && isChecked && formatted.length) {
                selected.push(...formatted);
                formik.setFieldValue(`resource_map.${index}.fields`, selected);
              }

              return (
                <ReasourceCard key={item.id}>
                  <Checkbox
                    isSelected={!!isChecked}
                    onChange={(e) => {
                      formik.setFieldValue(
                        `resource_map.${index}.resource_id`,
                        e ? item.id : ''
                      );
                      setisValid(false);
                    }}
                  >
                    {item.title}
                  </Checkbox>

                  <ContentBlock>
                    <Select
                      inputId={`select fields ${item.id}`}
                      options={formatted}
                      // label="Select the required fields"
                      onChange={(val) => {
                        // Select all fields if the input is cleared
                        if (val.length > 0) {
                          formik.setFieldValue(
                            `resource_map.${index}.fields`,
                            val
                          );
                        } else {
                          formik.setFieldValue(
                            `resource_map.${index}.fields`,
                            formatted
                          );
                        }
                      }}
                      defaultValue={selected}
                      key={selected} // TODO this causes the component to rerender
                      isDisabled={!formatted.length || !isChecked}
                      description={
                        !formatted.length &&
                        'There are no fields in this distrbution.'
                      }
                      isMulti
                      allowSelectAll={formatted.length !== selected.length}
                      isClearable={false}
                    />
                  </ContentBlock>

                  {formatted.length > 0 && (
                    <Aside
                      title={
                        'Please note that the dropdown selects all fields if you try to empty the selection'
                      }
                    />
                  )}

                  <PreviewWrapper>
                    {isChecked ? (
                      <>
                        <div
                          title={
                            item.api_details?.parameters?.map((param) => {
                              if (param.type === 'PAGINATION') {
                                return param;
                              }
                            }).length <= 0
                              ? 'Please add pagination parameters to enable preview'
                              : item.file_details?.format.toLowerCase() == 'pdf'
                              ? "Preview can't be enabled for PDF file"
                              : 'Enable preview'
                          }
                        >
                          <Switch
                            key={index}
                            defaultSelected={false}
                            isDisabled={
                              item.api_details?.parameters?.map((param) => {
                                if (param.type === 'PAGINATION') {
                                  return param;
                                }
                              }).length <= 0 ||
                              item.file_details?.format.toLowerCase() == 'pdf'
                            }
                            isSelected={
                              formik.values.resource_map[index]?.sample_enabled
                            }
                            // onChange={(e: any) => setisPreview(e)}
                            onChange={(e) => {
                              formik.setFieldValue(
                                `resource_map.${index}.sample_enabled`,
                                e
                              );
                            }}
                          >
                            Enable Preview
                          </Switch>
                        </div>
                        <div className="optionsWrapper">
                          {item?.file_details !== null ? (
                            formik.values.resource_map[index]
                              ?.sample_enabled === true && (
                              <Flex gap="12px">
                                <TextField
                                  label={'Number of rows'}
                                  placeholder={'Number of rows'}
                                  type="number"
                                  defaultValue={
                                    formik.values.resource_map[index]
                                      ?.sample_rows
                                  }
                                  onChange={(e: any) => {
                                    formik.setFieldValue(
                                      `resource_map.${index}.sample_rows`,
                                      e
                                    );
                                  }}
                                />

                                {+formik.values.resource_map[index]
                                  ?.sample_rows !== 0 ? (
                                  <>
                                    <PreviewModel
                                      isChecked={isChecked}
                                      rowsValue={
                                        formik.values.resource_map[index]
                                          ?.sample_rows
                                      }
                                      fields={formik.values.resource_map
                                        .find(
                                          (item) =>
                                            item.resource_id === isChecked
                                        )
                                        .fields.map((item) => item.value)}
                                      resourceSet={resourceSet}
                                      parameters={undefined}
                                      datasetData={datasetData}
                                    />
                                  </>
                                ) : (
                                  ''
                                )}
                              </Flex>
                            )
                          ) : formik.values.resource_map[index]
                              ?.sample_enabled === true &&
                            item.api_details.parameters.length > 0 ? (
                            <Flex gap="12px">
                              {item.api_details.parameters.map(
                                (param, paramIndex) =>
                                  param.type === 'PAGINATION' && (
                                    <TextField
                                      label={param.key}
                                      placeholder={'value'}
                                      defaultValue={
                                        formik.values.resource_map[index]
                                          ?.parameters?.length > 0
                                          ? formik.values.resource_map[index]
                                              ?.parameters[paramIndex]?.value
                                          : param.default
                                      }
                                      onChange={(e) => {
                                        formik.setFieldValue(
                                          `resource_map.${index}.parameters[${paramIndex}].key`,
                                          param.key
                                        );
                                        formik.setFieldValue(
                                          `resource_map.${index}.parameters[${paramIndex}].value`,
                                          e
                                        );
                                      }}
                                    />
                                  )
                              )}{' '}
                              <PreviewModel
                                isChecked={isChecked}
                                parameters={
                                  formik.values.resource_map[index]?.parameters
                                }
                                fields={formik.values.resource_map
                                  .find(
                                    (item) => item.resource_id === isChecked
                                  )
                                  .fields.map((item) => item.value)}
                                resourceSet={resourceSet}
                                rowsValue={undefined}
                                datasetData={datasetData}
                              />
                            </Flex>
                          ) : (
                            ''
                          )}
                        </div>
                      </>
                    ) : (
                      ''
                    )}
                  </PreviewWrapper>
                </ReasourceCard>
              );
            })}

            {isValid === true && (
              <ErrorMessage>Please Select Atleast one</ErrorMessage>
            )}
          </ResourceList>
          <Flex mt="16px" gap="8px" justifyContent="center">
            <div>
              {editId ? (
                <AccessModelDelete
                  setCurrentTab={setCurrentTab}
                  editId={editId}
                  datasetId={datasetId}
                />
              ) : null}
            </div>
            <SubmitWrapper title="Save Dataset Access Model">
              <Button type="button" onPress={(e) => formik.handleSubmit(e)}>
                Save Dataset Access Model
              </Button>
            </SubmitWrapper>
          </Flex>
        </Wrapper>
      </main>
    </>
  );
};

function PreviewModel({
  isChecked,
  rowsValue,
  fields,
  resourceSet,
  parameters,
  datasetData,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  function modalHandler() {
    setIsModalOpen(!isModalOpen);
  }
  const { data: session } = useSession();
  const currentOrgRole = useProviderStore((e) => e.org);

  const [previewData, setPreviewData] = useState();
  const Format = resourceSet
    .filter((item) => item.id === isChecked)
    .map((item) =>
      item?.file_details
        ? item.file_details?.format
        : item.api_details?.response_type
    );

  const handlePreview = (e) => {
    modalHandler();
    fetchpreview(
      isChecked,
      rowsValue,
      fields,
      parameters,
      session,
      currentOrgRole?.org_id
    )
      .then((res) => {
        if (res.Success === true && res.data.length > 0) {
          setPreviewData(res.data);
        } else {
          setIsModalOpen(false);
          toast.error('Error in Fetching API Preview');
        }
      })
      .catch(() => {
        setIsModalOpen(false);
        toast.error('Error in Fetching API Preview');
      });
  };

  const getTableData = (csvData) => {
    const totalArray = csvData;
    const columnData = Object?.keys(totalArray[0]).map((item) => {
      return {
        headerName: item,
      };
    });

    const rowsData = totalArray.map((item) => {
      const rowElements = Object.values(item);
      const singleRow = {};
      rowElements.forEach((element, index) => {
        singleRow[columnData[index]?.headerName || 'dummy'] = element;
      });
      return singleRow;
    });

    return {
      columnData: columnData,
      rows: rowsData,
    };
  };

  return (
    <Previewmodel>
      <Button
        kind="primary"
        size="md"
        icon={<Visibility />}
        iconSide={'left'}
        title="See a Preview of the Distribution"
        onPress={(e: any) => handlePreview(e.target.dataset.id)}
      >
        Preview
      </Button>

      <Modal
        isOpen={isModalOpen}
        modalHandler={() => modalHandler()}
        label="Add API Source"
      >
        <Status>
          <Header>
            <Heading variant="h3">
              Data Preview - &nbsp;
              {datasetData.resource_set
                .filter((item) => item.id === isChecked)
                .map((res) => res.title)}
            </Heading>

            <Button
              kind="custom"
              size="md"
              icon={<CrossSize300 />}
              onPress={() => setIsModalOpen(!isModalOpen)}
            />
          </Header>
          <hr />
          <DataWrapper>
            {previewData ? (
              Format[0] === 'CSV' ? (
                <Table
                  columnData={getTableData(previewData).columnData}
                  rowData={getTableData(previewData).rows}
                  label={'CSV Table'}
                  heading={''}
                />
              ) : (
                <JSONPretty id="json-pretty" data={previewData} />
              )
            ) : (
              <Loader isSection />
            )}
          </DataWrapper>
        </Status>
      </Modal>
    </Previewmodel>
  );
}

const DAMData = styled.div`
  span {
    padding-block: 5px;
    width: 100%;
  }
`;
const Previewmodel = styled.div`
  margin-top: 24px;
  > button {
    height: 48px;
    border: 2px solid var(--color-tertiary-1-00);
    color: var(--color-tertiary-1-00);
    background-color: var(--color-background-lightest);
  }
`;

const PreviewWrapper = styled.div`
  > label {
    padding-bottom: 10px;
  }

  .optionsWrapper {
    padding-top: 8px;
  }

  padding-block: 8px;
  width: 50%;
`;
const Header = styled.div`
  background-color: var(--color-background-lightest);
  justify-content: space-between;
  display: flex;
  margin-bottom: 10px;
  button {
    margin-block: auto;
  }
`;
const Status = styled.section`
  background-color: var(--color-background-lightest);
  padding: 10px 24px;
  border-radius: 8px;
  button {
    /* padding: 10px; */
  }
  .__json-pretty__,
  .__json-pretty-error__ {
    margin-top: 30px;
    white-space: break-spaces;
  }
`;
const AddTransform = styled.div`
  button {
    border: 2px solid var(--color-secondary-01);
    color: var(--color-secondary-01);
    background-color: var(--color-background-lightest);
    margin-left: 8px;
  }
`;
const DataWrapper = styled.div`
  white-space: break-spaces;
  max-height: 70vh;
  max-width: 50vw;
  min-width: 50vw;
  overflow: auto;
  @media screen and (max-width: 920px) {
    max-width: 100%;
  }
`;
const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  border-bottom: 2px solid var(--color-gray-01);
  padding-bottom: 17px;
`;
const Wrapper = styled.form`
  min-height: 50vh;
  margin-top: 16px;
  margin-bottom: 16px;
  > div {
    margin-bottom: 20px;
  }
  a {
    color: var(--color-secondary-01);
  }
`;

const SubmitWrapper = styled.div`
  > button {
    background-color: var(--color-secondary-01);
    color: var(--color-background-lightest);
    margin-left: 8px;
  }
`;

const ResourceList = styled.div`
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 12px;
`;

const ReasourceCard = styled.div`
  /* border: 2px solid var(--color-gray-03); */
  /* padding: 8px; */

  > label {
    width: 100%;
    height: 100%;

    /* padding: 16px; */
    /* background-color: var(--color-primary-06); */
    font-weight: var(--font-bold);
  }

  > .is-checked {
    /* background-color: var(--color-white); */

    /* + div {
      display: block;
    } */
  }
`;

const ContentBlock = styled.div`
  /* display: none; */
  margin-block: 12px;
`;

const FieldsWrapper = styled.div`
  background-color: var(--color-primary-06);
  border: 2px solid var(--color-gray-03);
  padding: 16px;

  .checbox-items {
    max-height: 360px;
    overflow-y: auto;
  }
`;

const PricingWrapper = styled.div`
  gap: 0.5rem;

  p {
    margin: auto 1px;
  }
`;

const Dbdescription = styled.p`
  font-size: 12px;
  color: var(--color-gray-05);
  max-width: 224px;
  padding-block: 8px;
  line-height: 20px;
`;
