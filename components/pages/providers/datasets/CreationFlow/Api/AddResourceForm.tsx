import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Button, Modal } from 'components/actions';
import { useQuery, useMutation } from '@apollo/client';
import { toast } from 'react-toastify';
import {
  mutation,
  GET_ALL_API_SOURCES,
  ADD_RESOURCE,
  UPDATE_RESOURCE,
} from 'services';
import { useFormik } from 'formik';
import { useRouter } from 'next/router';
import { GET_RESOURCE_BY_ID } from 'services';
import { useSelector } from 'react-redux';
import { Flex } from 'components/layouts/FlexWrapper';
import { RootState } from 'Store';
import Aside from '../../Aside';
import { Heading, Text } from 'components/layouts';
import { Checkbox, Select, TextArea, TextField } from 'components/form';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@radix-ui/react-accordion';
import JSONPretty from 'react-json-pretty';
import {
  Add,
  ChevronDown,
  ChevronUp,
  Delete,
  Edit,
  MoreSmallListVert,
  Link as LinkIcon,
} from '@opub-icons/workflow';
import { CrossSize300 } from '@opub-icons/ui';
import ApiSourceForm from './NewApiSource';
import { LinkButton } from 'components/pages/dashboard/helpers';
import { InstructionsWrapper } from 'components/pages/providers/CreationFlow';
import { Loader } from 'components/common';
import { capitalize } from 'utils/helper';
import { Indicator, Label } from 'components/form/BaseStyles';
import * as Yup from 'yup';

const AddResourceForm = ({
  setResId = undefined,
  resId = undefined,
  updateStore,
  setCurrentTab,
}: any) => {
  interface Params {
    key: string;
    format: string;
    default: string;
    description: string;
    options: Array<string>;
    download_options: Array<string>;
    download_api_options_same: boolean;
    type: 'EXPOSED' | 'PAGINATION' | 'FORMAT' | 'DOWNLOAD';
  }

  const [apiSourceModalTrigger, setApiSourceModalTrigger] = useState(false);
  const [currentAccordion, setCurrentAccordion] = useState();
  const datasetStore = useSelector((state: RootState) => state.addDataset);

  const router = useRouter();

  const GetAllApiSourcesListRes = useQuery(GET_ALL_API_SOURCES);

  const [distributionCreationTab, setDistributionCreationTab] = useState<{
    page:
      | 'editDistribution'
      | 'editExposedParam'
      | 'editPaginationParam'
      | 'editFormatParam'
      | 'editDownloadParam';
    paramObj?: Params;
  }>({
    page: 'editDistribution',
  });

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 20, behavior: 'smooth' });
    }
  }, [distributionCreationTab.page]);

  const apiSourceList: any = GetAllApiSourcesListRes.data
    ? GetAllApiSourcesListRes.data.all_api_source_by_org
    : [];

  const [createResourceReq, createResourceRes] = useMutation(ADD_RESOURCE);
  const [updateAPIResource, updateAPIResourceRes] =
    useMutation(UPDATE_RESOURCE);

  const [newApi, setNewApi] = useState('');

  useEffect(() => {
    formik.values.api_source = newApi;
  }, [newApi]);

  const [headerList, setHeaderList] = useState<Params[]>([]);

  const [paginationParam, setPaginationParam] = useState<Params[]>([]);

  const handlepaginationParameRemove = (index) => {
    let newArr = [...paginationParam];
    newArr.splice(index, 1);
    setPaginationParam(newArr);
  };

  const setAllFlagsToSameAsAPI = () => {
    formik.setFieldValue('download_same_as_api', true);

    let expTempParams = headerList;
    expTempParams.map((item) => {
      item.download_api_options_same = true;
    });

    setHeaderList(expTempParams);

    let paginTempParams = paginationParam;
    paginTempParams.map((item) => {
      item.download_api_options_same = true;
    });

    setPaginationParam(paginTempParams);
  };

  const GetResourceByIDRes = useQuery(GET_RESOURCE_BY_ID, {
    variables: {
      resource_id: resId,
    },
    skip: !resId,
  });

  const formData = !GetResourceByIDRes.loading &&
    !GetResourceByIDRes.error && { ...GetResourceByIDRes.data?.resource };

  React.useEffect(() => {
    if (resId) {
      const updateResourceObj = {
        // ...formik.values,
        ...formData,
        ...formData.api_details,
        api_source: formData?.api_details?.api_source?.id,
      };

      delete updateResourceObj.__typename;

      formik.setValues(updateResourceObj);
      let parametersArray = formData.api_details?.parameters;

      const tempPaginationArr = [];
      const tempExposedArr = [];

      parametersArray?.map((item) => {
        // If options array is empty, add blank string
        if (item.options?.length === 0) {
          item.options = [''];
        }

        if (item.download_options?.length === 0) {
          item.download_options = [''];
        }

        if (item.type.toLowerCase() === 'pagination') {
          tempPaginationArr.push(item);
        } else {
          tempExposedArr.push(item);
        }
      });

      tempExposedArr.length > 0 && setHeaderList(tempExposedArr);
      tempPaginationArr.length > 0 && setPaginationParam(tempPaginationArr);
    }
  }, [GetResourceByIDRes.loading]);

  const handleCommonHeadersRemove = (index) => {
    let newArr = [...headerList];
    newArr.splice(index, 1);
    setHeaderList(newArr);
  };

  const formik: any = useFormik({
    initialValues: {
      title: datasetStore.title,
      description: datasetStore.description,
      api_source: '',
      url_path: '',
      request_type: 'GET',
      auth_required: 'true',
      is_large_dataset: false,
      response_type: 'JSON',
      status: 'string',
      schema: [],
      format_loc: '',
      default_format: '',
      format_key: '',
      download_same_as_api: true,
      download_formats: [''],
      supported_formats: [''],
      dataset: router.query.datasetId,
      byte_size: 0,
      checksum: '',
      compression_format: '',
      media_type: '',
      packaging_format: '',
      release_date: '',
    },
    onSubmit: (values) => {
      let tempHeaderArr = [...headerList];
      tempHeaderArr.map((tempItem) => {
        tempItem.options = tempItem.options.filter((optionItem) => {
          return optionItem.trim() !== '';
        });

        tempItem.download_options = tempItem.download_options?.filter(
          (optionItem) => {
            return optionItem.trim() !== '';
          }
        );
      });

      setHeaderList(tempHeaderArr.filter((item) => item.key !== ''));

      let tempPaginationArr = [...paginationParam];
      tempPaginationArr.map((tempItem) => {
        tempItem.options = tempItem.options.filter((optionItem) => {
          return optionItem.trim() !== '';
        });

        tempItem.download_options = tempItem.download_options?.filter(
          (optionItem) => {
            return optionItem.trim() !== '';
          }
        );
      });

      setHeaderList(tempPaginationArr.filter((item) => item.key !== ''));

      resId ? handleResourceUpdate(values, resId) : handleResourceSave(values);
    },
  });

  function handleResourceSave(values) {
    {
      values.url_path === ''
        ? toast.error('Please fill all the fields')
        : mutation(createResourceReq, createResourceRes, {
            resource_data: {
              dataset: values.dataset,
              title: values.title,
              description: values.description,
              status: 'Draft',
              api_details: {
                api_source: values.api_source,
                auth_required: JSON.parse(values.auth_required),
                is_large_dataset: values.is_large_dataset,
                url_path: values.url_path,
                response_type:
                  values.default_format === '' ? values.response_type : null,
                request_type: values.request_type,
                parameters: [...headerList, ...paginationParam],
                ...(values.format_loc ? { format_loc: values.format_loc } : {}),
                default_format: values.default_format,
                format_key: values.format_key,
                download_same_as_api: values.download_same_as_api,
                supported_formats: values.supported_formats,
                download_formats: values.download_formats.filter(
                  (optionItem) => {
                    return optionItem.trim() !== '';
                  }
                ),
              },
              schema: [],
              file_details: null,
              // masked_fields: [],
              byte_size: values.byte_size,
              checksum: values.checksum,
              compression_format: values.compression_format,
              media_type: values.media_type,
              packaging_format: values.packaging_format,
              ...(values.release_date.length > 0
                ? { release_date: values.release_date }
                : {}),
            },
          })
            .then((res) => {
              if (res.create_resource.success === true) {
                updateStore();
                formik.resetForm();
                setHeaderList([
                  {
                    key: '',
                    format: '',
                    default: '',
                    description: '',
                    options: [''],
                    download_options: [''],
                    download_api_options_same: true,
                    type: 'EXPOSED',
                  },
                ]);
                setPaginationParam([
                  {
                    key: '',
                    format: '',
                    default: '',
                    description: '',
                    options: [''],
                    download_options: [''],
                    download_api_options_same: true,
                    type: 'PAGINATION',
                  },
                ]);

                setCurrentTab('list');

                toast.success('Distribution added successfully');
              } else {
                toast.error(res.create_resource.errors.id[0]);
              }
            })
            .catch((err) => toast.error(err.message));
    }
  }

  function handleResourceUpdate(values, id) {
    const oldSchema = datasetStore.resource_set.find((item) => item.id === id);
    mutation(updateAPIResource, updateAPIResourceRes, {
      resource_data: {
        id: id,
        dataset: router.query.datasetId,
        title: values.title,
        description: values.description,
        status: 'Draft',
        api_details: {
          api_source: values.api_source,
          auth_required: JSON.parse(values.auth_required),
          is_large_dataset: values.is_large_dataset,
          url_path: values.url_path,
          response_type:
            values.default_format === '' ? values.response_type : null,
          request_type: values.request_type,
          parameters: [...headerList, ...paginationParam],
          ...(values.format_loc ? { format_loc: values.format_loc } : {}),
          default_format: values.default_format,
          format_key: values.format_key,
          download_same_as_api: values.download_same_as_api,
          supported_formats: values.supported_formats,
          download_formats: values.download_formats.filter((optionItem) => {
            return optionItem.trim() !== '';
          }),
        },
        schema: oldSchema.schema,
        file_details: null,
        // masked_fields: [],
        byte_size: values.byte_size,
        checksum: values.checksum,
        compression_format: values.compression_format,
        media_type: values.media_type,
        packaging_format: values.packaging_format,
        release_date: values.release_date,
      },
    })
      .then((res) => {
        if (res.update_resource.success === true) {
          toast.success('Distribution modified successfully');

          updateStore();
          setCurrentTab('list');

          formik.resetForm();
          setHeaderList([
            {
              key: '',
              format: '',
              default: '',
              description: '',
              options: [''],
              download_options: [''],
              download_api_options_same: true,
              type: 'EXPOSED',
            },
          ]);
          setPaginationParam([
            {
              key: '',
              format: '',
              default: '',
              description: '',
              options: [''],
              download_options: [''],
              download_api_options_same: true,
              type: 'PAGINATION',
            },
          ]);

          setResId(null);
        }
      })

      .catch(() => toast.error('Error while modifying the distribution'));
  }

  const validate = (values) => {
    const errors: any = {};
    if (!values.firstName) {
      errors.firstName = 'Required';
    } else if (values.firstName.length > 15) {
      errors.firstName = 'Must be 15 characters or less';
    }

    if (!values.lastName) {
      errors.lastName = 'Required';
    } else if (values.lastName.length > 20) {
      errors.lastName = 'Must be 20 characters or less';
    }

    if (!values.email) {
      errors.email = 'Required';
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
    ) {
      errors.email = 'Invalid email address';
    }

    return errors;
  };

  const FormatTypes = [
    {
      label: 'string',
      value: 'string',
    },
    {
      label: 'integer',
      value: 'integer',
    },
    {
      label: 'boolean',
      value: 'boolean',
    },
    {
      label: 'date',
      value: 'date',
    },
  ];

  const RequestType = [
    { value: 'GET', label: 'GET' },
    // { value: 'PUT', label: 'PUT' },
    { value: 'POST', label: 'POST' },
  ];

  const InType = [
    { value: 'HEADER', label: 'Header' },
    { value: 'PARAM', label: 'Parameter' },
  ];

  const dcatLinks = {
    byte_size: 'https://www.w3.org/TR/vocab-dcat-3/#Property:distribution_size',
    checksum:
      'https://www.w3.org/TR/vocab-dcat-3/#Property:distribution_checksum',
    compression_format:
      'https://www.w3.org/TR/vocab-dcat-3/#Property:distribution_compression_format',
    media_type:
      'https://www.w3.org/TR/vocab-dcat-3/#Property:distribution_media_type',
    packaging_format:
      'https://www.w3.org/TR/vocab-dcat-3/#Property:distribution_packaging_format',
    release_date:
      'https://www.w3.org/TR/vocab-dcat-3/#Property:resource_release_date',
  };

  const createAPISource = () => {
    return (
      <>
        <ApiSourcebutton>
          <Button
            kind="custom"
            size="sm"
            onPress={() => setApiSourceModalTrigger(!apiSourceModalTrigger)}
          >
            Create New API Source
          </Button>
        </ApiSourcebutton>
        <Modal
          label={'Create API Source'}
          isOpen={apiSourceModalTrigger}
          modalHandler={() => {}}
        >
          <Wrapper>
            <ModalHeader>
              <div>
                <Heading as="h2" variant="h3">
                  Add API Source
                </Heading>
                <Button
                  // isDisabled={}
                  kind="custom"
                  size="md"
                  icon={<CrossSize300 />}
                  onPress={() =>
                    setApiSourceModalTrigger(!apiSourceModalTrigger)
                  }
                />
              </div>
            </ModalHeader>
            <ApiSourceForm
              onMutationComplete={(e) => {
                GetAllApiSourcesListRes.refetch();
                setNewApi(e);
                setApiSourceModalTrigger(!apiSourceModalTrigger);
              }}
              apiData={{}}
            />
          </Wrapper>
        </Modal>
      </>
    );
  };

  const ApiSourceDetails = apiSourceList?.find(
    (item) => item?.id === formik?.values?.api_source
  );

  const HeaderTextObject = {
    editDistribution: formik.values.id
      ? `Edit Distribution - ${formik?.values?.title}`
      : 'Add Distribution',
    editExposedParam: distributionCreationTab.paramObj?.key
      ? `Exposed Parameter - ` + distributionCreationTab.paramObj?.key
      : 'Exposed Parameter',
    editPaginationParam: distributionCreationTab.paramObj?.key
      ? 'Pagination Parameter - ' + distributionCreationTab.paramObj?.key
      : 'Pagination Parameter',
    editFormatParam: 'Format Parameter',
    editDownloadParam: 'Manage Download Parameters',
  };

  const EditParameterView: React.FC<{
    parameterCategory: 'EXPOSED' | 'PAGINATION';
  }> = ({ parameterCategory = 'EXPOSED' }) => {
    const [userFurtherAction, setUserFurtherAction] = useState<
      'Save' | 'SaveAndAdd'
    >();

    const validationSchema = Yup.object().shape({
      key: Yup.string().required('Required'),
      format: Yup.string().required('Required'),
      default: Yup.string().required('Required'),
    });

    const currentParamIndex =
      distributionCreationTab.paramObj?.type === 'EXPOSED'
        ? headerList.findIndex(
            (item) => item.key === distributionCreationTab.paramObj?.key
          )
        : distributionCreationTab.paramObj?.type === 'PAGINATION'
        ? paginationParam.findIndex(
            (item) => item.key === distributionCreationTab.paramObj?.key
          )
        : -1;

    const editParamFormik: any = useFormik({
      initialValues: {
        key: distributionCreationTab.paramObj?.key || '',
        default: distributionCreationTab.paramObj?.default || '',
        format: distributionCreationTab.paramObj?.format || '',
        description: distributionCreationTab.paramObj?.description || '',
        options: distributionCreationTab.paramObj?.options || [''],
        download_options: distributionCreationTab.paramObj
          ?.download_options || [''],
        download_api_options_same:
          distributionCreationTab.paramObj?.download_api_options_same || true,
        type: parameterCategory,
      },
      validationSchema,
      validateOnChange: false,

      onSubmit: () => {
        saveParameterToDistribution();

        if (userFurtherAction === 'Save') {
          setDistributionCreationTab({
            page: 'editDistribution',
            paramObj: {
              key: '',
              format: '',
              default: '',
              description: '',
              options: [''],
              download_options: [''],
              download_api_options_same: true,
              type: parameterCategory,
            },
          });
        } else if (userFurtherAction === 'SaveAndAdd') {
          clearForm();
          setDistributionCreationTab({
            page:
              parameterCategory === 'EXPOSED'
                ? 'editExposedParam'
                : 'editPaginationParam',
            paramObj: {
              key: '',
              format: '',
              default: '',
              description: '',
              options: [''],
              download_options: [''],
              download_api_options_same: true,
              type: parameterCategory,
            },
          });
        }
      },
    });

    const { values: editParamValues, errors: editParamErrors } =
      editParamFormik;

    const clearForm = () => {
      editParamFormik.resetForm({
        values: editParamFormik.initialValues,
      });
      editParamFormik.setFieldValue('options', ['']);
    };

    const saveParameterToDistribution = () => {
      switch (parameterCategory) {
        case 'EXPOSED':
          const headerArr = headerList;

          if (currentParamIndex >= 0) {
            headerArr[currentParamIndex] = { ...editParamValues };
          } else {
            headerArr.push({ ...editParamValues });
          }
          setHeaderList(headerArr);
          break;
        case 'PAGINATION':
          const paginateArr = paginationParam;

          if (currentParamIndex >= 0) {
            paginateArr[currentParamIndex] = { ...editParamValues };
          } else {
            paginateArr.push({ ...editParamValues });
          }
          setPaginationParam(paginateArr);

          break;
      }
    };

    return (
      <EditParamWrapper>
        <EditParamForm>
          <div className="elementContainer">
            <Select
              label="Type"
              name="format"
              className="selectType"
              inputId={`SelectExposedParamFormat`}
              options={FormatTypes}
              onChange={(e) => {
                editParamFormik.setFieldValue('format', e.value);
              }}
              value={FormatTypes.find(
                (item) => item.value === editParamValues.format
              )}
              isRequired
              errorMessage={editParamErrors.format}
            />

            <div className="keyDescContainer">
              <Flex flexDirection={'column'} gap="24px">
                <TextField
                  name="key"
                  label="Key"
                  onChange={(e) => editParamFormik.setFieldValue('key', e)}
                  value={editParamValues.key}
                  isRequired
                  maxLength={100}
                  placeholder="Key"
                  errorMessage={editParamErrors.key}
                />

                <TextField
                  type="text"
                  label="Default"
                  name="default"
                  onChange={(e) => editParamFormik.setFieldValue('default', e)}
                  value={editParamFormik.values.default}
                  isRequired
                  placeholder="Default Value"
                  maxLength={100}
                  errorMessage={editParamErrors.default}
                />
              </Flex>

              <TextArea
                type="text"
                label="Description"
                name="description"
                onChange={(e) =>
                  editParamFormik.setFieldValue('description', e)
                }
                value={editParamValues.description}
                placeholder="Description"
                maxLength={500}
              />
            </div>

            <div className="optionsContainer">
              <Text
                as={'h4'}
                paddingBottom={'16px'}
                fontWeight={'700'}
                color={'var(--color-tertiary-1-00)'}
              >{`Options (${editParamValues.options.length})`}</Text>
              {editParamValues.options?.map((singleOptionText, optionIndex) => (
                <OptionWrapper key={`Options-${optionIndex}`}>
                  <TextField
                    type="text"
                    label={`Option ${optionIndex + 1}`}
                    name="option"
                    value={singleOptionText}
                    onChange={(e) => {
                      const optionsArr = editParamValues.options;
                      optionsArr[optionIndex] = e;
                      editParamFormik.setFieldValue('options', optionsArr);
                    }}
                    maxLength={100}
                  />

                  {editParamValues.options.length > 1 && (
                    <Button
                      kind="custom"
                      className="deleteOption"
                      onPress={() => {
                        const optionsArr = editParamValues.options;
                        optionsArr.splice(optionIndex, 1);
                        editParamFormik.setFieldValue('options', optionsArr);
                      }}
                      iconOnly
                      icon={<Delete width={'24px'} height={'24px'} />}
                    />
                  )}
                </OptionWrapper>
              ))}

              <Button
                kind="custom"
                className="addOption"
                iconSide="left"
                icon={<Add />}
                onPress={() => {
                  const optionsArr = editParamValues.options;
                  optionsArr.push('');
                  editParamFormik.setFieldValue('options', optionsArr);
                }}
              >
                Add Option
              </Button>
            </div>
          </div>
          <div className="formFooterButtons">
            <Button
              kind="secondary-outline"
              onPress={() => {
                setDistributionCreationTab({
                  page: 'editDistribution',
                  paramObj: {
                    key: '',
                    format: '',
                    default: '',
                    description: '',
                    options: [''],
                    download_options: [''],
                    download_api_options_same: true,
                    type: parameterCategory,
                  },
                });
              }}
            >
              Cancel
            </Button>

            <Button
              kind="secondary-outline"
              className="push"
              onPress={() => {
                setUserFurtherAction('Save');
                editParamFormik.handleSubmit();
              }}
            >
              Save
            </Button>

            <Button
              kind="secondary"
              onPress={() => {
                setUserFurtherAction('SaveAndAdd');
                editParamFormik.handleSubmit();
              }}
            >
              {`Save and Add New ${capitalize(
                parameterCategory.toLowerCase()
              )} Parameter`}
            </Button>
          </div>
        </EditParamForm>
      </EditParamWrapper>
    );
  };

  const EditFormatParameterView: React.FC<{
    paramObj: any;
  }> = ({ paramObj }) => {
    const formatFormik: any = useFormik({
      initialValues: {
        format_key: paramObj?.format_key || '',
        default_format: paramObj?.default_format || '',
        format_loc: paramObj?.format_loc || '',
        description: paramObj?.description || '',
        supported_formats: paramObj.supported_formats || [''],
        download_formats: paramObj?.download_formats || [''],
        download_same_as_api: paramObj?.download_same_as_api || true,
      },

      onSubmit: () => {},
    });

    const { values } = formatFormik;

    const saveFormatToDistribution = () => {
      formik.setFieldValue('format_key', values.format_key);
      formik.setFieldValue('default_format', values.default_format);
      formik.setFieldValue('format_loc', values.format_loc);
      formik.setFieldValue('supported_formats', values.supported_formats);

      setDistributionCreationTab({
        page: 'editDistribution',
      });
    };

    return (
      <EditParamWrapper>
        <EditParamForm>
          <div className="elementContainer">
            <Select
              isRequired={values.format_key !== ''}
              name="format_loc"
              options={InType}
              value={InType.find((item) => item.value === values.format_loc)}
              label={'In'}
              inputId={'Select Format'}
              onChange={(e) =>
                formatFormik.setFieldValue('format_loc', e.value)
              }
            />

            <div className="keyDescContainer">
              <TextField
                type="text"
                name="format_key"
                maxLength={100}
                label="Format Key"
                onChange={(e) => formatFormik.setFieldValue('format_key', e)}
                value={values.format_key}
              />

              <TextField
                type="text"
                name="default_format"
                label="Default Format"
                maxLength={100}
                isRequired={values.format_key !== ''}
                onChange={(e) =>
                  formatFormik.setFieldValue('default_format', e)
                }
                value={values.default_format}
              />
            </div>

            <div className="optionsContainer">
              <Text
                as={'h4'}
                paddingBottom={'16px'}
                fontWeight={'700'}
                color={'var(--color-tertiary-1-00)'}
              >{`Options (${values.supported_formats.length})`}</Text>

              {values.supported_formats?.map((item, index) => (
                <OptionWrapper key={`FormatOptions-${index}`}>
                  <TextField
                    type="text"
                    name="format"
                    label={`Option ${index + 1}`}
                    isRequired={values.format_key != ''}
                    onChange={(e) => {
                      const supportedFormatsArr = values.supported_formats;
                      supportedFormatsArr[index] = e;
                      formatFormik.setFieldValue(
                        'supported_formats',
                        supportedFormatsArr
                      );
                    }}
                    defaultValue={item}
                    placeholder={`Supported format option ${index + 1}`}
                    maxLength={100}
                  />

                  {values.supported_formats.length > 1 && (
                    <Button
                      kind="custom"
                      onPress={() => {
                        const supportedFormatsArr = values.supported_formats;
                        supportedFormatsArr.splice(index, 1);
                        formatFormik.setFieldValue(
                          'supported_formats',
                          supportedFormatsArr
                        );
                      }}
                      iconOnly
                      className="deleteOption"
                      icon={<Delete fill={'var(--color-secondary-01'} />}
                    />
                  )}
                </OptionWrapper>
              ))}
              <Button
                kind="custom"
                className="addOption"
                iconSide="left"
                icon={<Add />}
                onPress={() => {
                  const supportedFormatsArr = values.supported_formats;
                  supportedFormatsArr.push('');
                  formatFormik.setFieldValue(supportedFormatsArr);
                }}
              >
                Add Option
              </Button>
            </div>
          </div>
          <div className="formFooterButtons apart">
            <Button
              kind="secondary-outline"
              onPress={() => {
                setDistributionCreationTab({
                  page: 'editDistribution',
                });
              }}
            >
              Cancel
            </Button>

            <Button
              kind="secondary"
              onPress={() => {
                // clearForm();
                saveFormatToDistribution();
              }}
            >
              Save & Back to Distributions
            </Button>
          </div>
        </EditParamForm>
      </EditParamWrapper>
    );
  };

  const ManageDownloadParamsView = () => {
    const downloadFormik: any = useFormik({
      initialValues: {
        exposed: headerList,
        pagination: paginationParam,
        format: {
          format_key: formik.values.format_key,
          default_format: formik.values.default_format,
          supported_formats: formik.values.supported_formats || [''],
          download_formats: formik.values.download_formats || [''],
          download_same_as_api: formik.values.download_same_as_api,
        },
      },
      onSubmit: () => {
        setHeaderList(downloadFormValues.exposed);

        setPaginationParam(downloadFormValues.pagination);

        formik.setFieldValue(
          'download_formats',
          downloadFormValues.format.download_formats
        );

        formik.setFieldValue(
          'download_same_as_api',
          downloadFormValues.format.download_same_as_api
        );

        setDistributionCreationTab({ page: 'editDistribution' });
      },
    });

    const { values: downloadFormValues } = downloadFormik;

    const setDownloadFlagParam = (e, paramIndex, paramType) => {
      let newArr = [...downloadFormValues[paramType]];
      newArr[paramIndex].download_api_options_same = e;
      if (!e && newArr[paramIndex].download_options[0] === '') {
        newArr[paramIndex].download_options = [newArr[paramIndex].default];
      }
      downloadFormik.setFieldValue(paramType, newArr);
    };

    const setOptionInDownloadParams = (
      e,
      paramIndex,
      optionIndex,
      paramType
    ) => {
      let newArr = [...downloadFormValues[paramType]];
      newArr[paramIndex].download_options[optionIndex] = e;
      downloadFormik.setFieldValue(paramType, newArr);
    };

    const AddOptionInDownloadParams = (paramIndex, paramType) => {
      let newArr = [...downloadFormValues[paramType]];
      newArr[paramIndex].download_options.push('');
      downloadFormik.setFieldValue(paramType, newArr);
    };

    const DeleteOptionInDownloadParams = (
      paramIndex,
      optionIndex,
      paramType
    ) => {
      let newArr = [...downloadFormValues[paramType]];
      newArr[paramIndex].download_options?.splice(optionIndex, 1);
      downloadFormik.setFieldValue(paramType, newArr);
    };

    const AddOptionInFormatDownloadParams = () => {
      let formatObj = downloadFormValues.format;
      formatObj.download_formats.push('');
      downloadFormik.setFieldValue('format', formatObj);
    };

    const SetOptionInFormatDownloadParams = (e, optionIndex) => {
      let downloadArr = downloadFormValues.format.download_formats;
      downloadArr[optionIndex] = e;
      downloadFormik.setFieldValue('format', {
        ...downloadFormValues.format,
        download_formats: downloadArr,
      });
    };

    return (
      <EditParamWrapper>
        <EditParamForm>
          <div className="elementContainer">
            {downloadFormValues.exposed?.filter((item) => item.key !== '')
              .length < 1 &&
            downloadFormValues.pagination?.filter((item) => item.key !== '')
              .length < 1 &&
            formik.values.format_key === '' ? (
              <Text as={'span'}>
                Please add parameters above to add Download options
              </Text>
            ) : (
              <>
                {['exposed', 'pagination'].map((paramType) =>
                  downloadFormValues[paramType]?.map(
                    (paramItem: Params, paramIndex) => (
                      <DownloadParamEditBox key={`${paramType} ${paramIndex}`}>
                        <Flex justifyContent={'space-between'}>
                          <Text
                            as={'h5'}
                            color={`var(--color-gray-05)`}
                            variant="pt16b"
                          >
                            {`${capitalize(paramType)} Parameter ${
                              paramIndex + 1
                            }`}
                          </Text>
                          <Checkbox
                            defaultSelected={
                              paramItem.download_api_options_same
                            }
                            onChange={(e) => {
                              setDownloadFlagParam(e, paramIndex, paramType);
                            }}
                          >
                            Same as API
                          </Checkbox>
                        </Flex>

                        <TextField
                          type="text"
                          name="Key"
                          label="Key"
                          isDisabled
                          value={paramItem.key}
                          placeholder="Key"
                          maxLength={100}
                        />

                        <div className="optionsContainer">
                          {paramItem.download_api_options_same ? (
                            paramItem.options.map((optionItem, optIndex) => (
                              <OptionWrapper key={`DownloadOption-${optIndex}`}>
                                <TextField
                                  type="text"
                                  name="option"
                                  label={`Option ${optIndex + 1}`}
                                  isDisabled={true}
                                  value={optionItem}
                                  placeholder={`Option ${optIndex + 1}`}
                                  maxLength={100}
                                />
                              </OptionWrapper>
                            ))
                          ) : (
                            <>
                              {paramItem.download_options?.map(
                                (downloadItem, downIndex) => (
                                  <OptionWrapper
                                    key={`PaginationOption-${downIndex}`}
                                  >
                                    <TextField
                                      name="option"
                                      onChange={(e) => {
                                        setOptionInDownloadParams(
                                          e,
                                          paramIndex,
                                          downIndex,
                                          paramType
                                        );
                                      }}
                                      label={`Option ${downIndex + 1}`}
                                      value={downloadItem}
                                      placeholder={`Option ${downIndex + 1}`}
                                      maxLength={100}
                                    />

                                    {paramItem?.download_options?.length >
                                      1 && (
                                      <Button
                                        kind="custom"
                                        onPress={() => {
                                          DeleteOptionInDownloadParams(
                                            paramIndex,
                                            downIndex,
                                            paramType
                                          );
                                        }}
                                        className="deleteOption"
                                        iconOnly
                                        icon={<Delete />}
                                      />
                                    )}
                                  </OptionWrapper>
                                )
                              )}

                              <Button
                                kind="custom"
                                className="addOption"
                                iconSide="left"
                                icon={<Add />}
                                onPress={() => {
                                  AddOptionInDownloadParams(
                                    paramIndex,
                                    paramType
                                  );
                                }}
                              >
                                Add Option
                              </Button>
                            </>
                          )}
                        </div>
                      </DownloadParamEditBox>
                    )
                  )
                )}

                <DownloadParamEditBox key={`Format`}>
                  <Flex justifyContent={'space-between'}>
                    <Text
                      as={'h5'}
                      color={`var(--color-gray-05)`}
                      variant="pt16b"
                    >
                      {`Format Parameter`}
                    </Text>
                    <Checkbox
                      defaultSelected={
                        downloadFormValues.format.download_same_as_api
                      }
                      onChange={(e) => {
                        downloadFormik.setFieldValue('format', {
                          ...downloadFormValues.format,
                          download_same_as_api: e,
                          download_formats:
                            !e &&
                            downloadFormValues.format.download_formats.filter(
                              (item) => item !== ''
                            ).length < 1
                              ? [downloadFormValues.format.default_format, '']
                              : downloadFormValues.format.download_formats,
                        });
                      }}
                    >
                      Same as API
                    </Checkbox>
                  </Flex>

                  <TextField
                    type="text"
                    name="Key"
                    label="Key"
                    isDisabled
                    value={downloadFormValues.format.format_key}
                    placeholder="Key"
                    maxLength={100}
                  />

                  <div className="optionsContainer">
                    {downloadFormValues.format.download_same_as_api ? (
                      downloadFormValues.format.supported_formats.map(
                        (optionItem, optIndex) => (
                          <OptionWrapper key={`DownloadOption-${optIndex}`}>
                            <TextField
                              type="text"
                              name="option"
                              label={`Option ${optIndex + 1}`}
                              isDisabled={true}
                              value={optionItem}
                              placeholder={`Option ${optIndex + 1}`}
                              maxLength={100}
                            />
                          </OptionWrapper>
                        )
                      )
                    ) : (
                      <>
                        {downloadFormValues.format.download_formats.map(
                          (downloadItem, downIndex) => (
                            <OptionWrapper
                              key={`PaginationOption-${downIndex}`}
                            >
                              <TextField
                                name="option"
                                onChange={(e) => {
                                  SetOptionInFormatDownloadParams(e, downIndex);
                                }}
                                label={`Option ${downIndex + 1}`}
                                value={downloadItem}
                                placeholder={`Option ${downIndex + 1}`}
                                maxLength={100}
                              />

                              {downloadFormValues.format.download_formats
                                ?.length > 1 && (
                                <Button
                                  kind="custom"
                                  onPress={() => {
                                    const downloadArr =
                                      downloadFormValues.format
                                        .download_formats;

                                    downloadArr.splice(downIndex, 1);

                                    downloadFormik.setFieldValue('format', {
                                      ...downloadFormValues.format,
                                      download_formats: downloadArr,
                                    });
                                  }}
                                  className="deleteOption"
                                  iconOnly
                                  icon={<Delete />}
                                />
                              )}
                            </OptionWrapper>
                          )
                        )}

                        <Button
                          kind="custom"
                          className="addOption"
                          iconSide="left"
                          icon={<Add />}
                          onPress={() => {
                            AddOptionInFormatDownloadParams();
                          }}
                        >
                          Add Option
                        </Button>
                      </>
                    )}
                  </div>
                </DownloadParamEditBox>
              </>
            )}
          </div>
          <div className="formFooterButtons apart">
            <Button
              kind="secondary-outline"
              onPress={() => {
                setDistributionCreationTab({
                  page: 'editDistribution',
                });
              }}
            >
              Cancel
            </Button>

            <Button
              kind="secondary"
              onPress={() => {
                // clearForm();
                downloadFormik.handleSubmit();
              }}
            >
              Save
            </Button>
          </div>
        </EditParamForm>
      </EditParamWrapper>
    );
  };

  return resId && GetResourceByIDRes.loading ? (
    <Loader />
  ) : (
    <>
      <HeaderWrapper>
        <Heading as="h2" variant="h3" marginY={'auto'}>
          {HeaderTextObject[distributionCreationTab.page]}
        </Heading>
        <AddDistribution
          title={
            distributionCreationTab.page === 'editDistribution'
              ? 'Back to Distribution List'
              : 'Back to Edit Distribution'
          }
        >
          <LinkButton
            label={
              distributionCreationTab.page === 'editDistribution'
                ? 'Back to Distribution List'
                : 'Back to Edit Distribution'
            }
            type="back"
            onClick={() => {
              if (distributionCreationTab.page === 'editDistribution') {
                setCurrentTab('list');
              } else {
                setDistributionCreationTab({ page: 'editDistribution' });
              }
            }}
          />
        </AddDistribution>
      </HeaderWrapper>
      {distributionCreationTab.page === 'editDistribution' ? (
        <>
          <InstructionsWrapper>
            <Heading variant="h5" as={'h2'}>
              Instructions
            </Heading>
            <div>
              <ul>
                <li>
                  Ensure responses of API in different formats return same
                  header or keys or tags for similar data for access models to
                  filter up on
                </li>
              </ul>
            </div>
          </InstructionsWrapper>

          <Status
            onSubmit={(e) => {
              e.preventDefault();
              formik.handleSubmit();
            }}
          >
            <TextField
              label="Name of the Distribution"
              type="text"
              maxLength={100}
              onChange={(e) => formik.setFieldValue('title', e)}
              value={formik.values.title}
              isRequired
            />

            <TextArea
              label="Description"
              type="text"
              maxLength={500}
              onChange={(e) => formik.setFieldValue('description', e)}
              value={formik.values.description}
              isRequired
            />

            <Flex
              gap="10px"
              justifyContent={'space-between'}
              flexWrap={'wrap'}
              flexDirection={'column'}
            >
              <ApiSourceWrapper>
                <Select
                  inputId="Select API Source"
                  isRequired
                  placeholder="Select API Source"
                  label="Select API Source"
                  className="selectAPISource"
                  onChange={(e) => formik.setFieldValue('api_source', e.value)}
                  options={[
                    ...apiSourceList.map((item) => {
                      return {
                        label: item.title,
                        value: item.id,
                      };
                    }),
                  ]}
                  value={apiSourceList
                    .map((item) => {
                      return {
                        label: item.title,
                        value: item.id,
                      };
                    })
                    .find((item) =>
                      newApi
                        ? item.value === newApi
                        : item.value === formik.values.api_source
                    )}
                />
              </ApiSourceWrapper>
              {createAPISource()}
            </Flex>

            <DAMData>
              {ApiSourceDetails ? (
                <>
                  {ApiSourceDetails?.base_url && (
                    <Text as={'p'}>
                      <strong>Base URL:</strong> {ApiSourceDetails?.base_url}
                    </Text>
                  )}
                  {ApiSourceDetails?.auth_loc && (
                    <Text as={'p'}>
                      <strong>Auth Loc:</strong> {ApiSourceDetails?.auth_loc}
                    </Text>
                  )}
                  {ApiSourceDetails?.api_version && (
                    <Text as={'p'}>
                      {' '}
                      <strong>Api Version:</strong>{' '}
                      {ApiSourceDetails?.api_version}
                    </Text>
                  )}

                  {/* {ApiSourceDetails?.auth_token && (
                      <Text as={'p'}>
                        {' '}
                        <strong>Auth Token: </strong>
                        {ApiSourceDetails?.auth_token}{' '}
                      </Text>
                    )} */}

                  {ApiSourceDetails?.auth_type && (
                    <Text as={'p'}>
                      {' '}
                      <strong> Auth Type:</strong> {ApiSourceDetails?.auth_type}{' '}
                    </Text>
                  )}
                  {/* {ApiSourceDetails.auth_credentials && (
                      <Text as={'p'}>
                        {' '}
                        <strong>Auth Credentials:</strong>{' '}
                        <JSONPretty
                          data={JSON.parse(ApiSourceDetails.auth_credentials)}
                        />
                      </Text>
                    )} */}
                  {ApiSourceDetails.headers.length > 0 && (
                    <Text as={'p'}>
                      <strong>Common Headers: </strong>
                      {ApiSourceDetails.headers.map((headerItem, index) => (
                        <div key={index}>
                          <JSONPretty data={JSON.parse(headerItem)} />
                        </div>
                      ))}
                    </Text>
                  )}
                </>
              ) : (
                <Flex justifyContent={'center'}>
                  <Aside
                    title={
                      'Please select an API source above to see the details here'
                    }
                  />
                </Flex>
              )}
            </DAMData>

            <URLWrapper>
              <Label>
                Link <Indicator>(Required)</Indicator>
              </Label>

              <div
                title={
                  apiSourceList?.find(
                    (item) => item?.id === formik.values.api_source
                  )?.base_url || ''
                }
              >
                <LinkIcon width={'24px'} height={'24px'} />
                <span id="span_id">
                  {apiSourceList?.find(
                    (item) => item?.id === formik.values.api_source
                  )?.base_url || ''}
                </span>
                <input
                  name="url_path"
                  type="text"
                  onChange={formik.handleChange}
                  value={formik.values.url_path}
                  required
                  maxLength={500}
                />
              </div>
            </URLWrapper>

            <Select
              inputId={'Request Type'}
              name="request_type"
              label="Request Type"
              isRequired
              isSearchable={false}
              onChange={(e) => formik.setFieldValue('request_type', e.value)}
              value={RequestType.find(
                (item) => item.value === formik.values.request_type
              )}
              options={RequestType}
            />

            <div className="commonheaders">
              <Text as="h4" className={'distHeadingText'}>
                Exposed Parameters
              </Text>
              {headerList?.map((singleHeader, index) => (
                <div className="headers" key={index}>
                  <div className="param-card">
                    <Text
                      variant="pt16b"
                      as={'p'}
                      color={'var(--color-gray-07)'}
                    >
                      {singleHeader.key}
                    </Text>

                    <Text
                      variant="pt14b"
                      as={'p'}
                      color={'var(--color-gray-05)'}
                    >
                      {singleHeader.format}
                    </Text>

                    <div className="more">
                      <MoreSmallListVert width={24} />
                    </div>

                    <div className="paramActionBtns">
                      <Button
                        kind="custom"
                        iconOnly
                        icon={<Delete fill={'var(--color-secondary-01'} />}
                        onPress={() => {
                          handleCommonHeadersRemove(index);
                        }}
                      />

                      <Button
                        kind="custom"
                        iconOnly
                        icon={<Edit fill={'var(--color-secondary-01'} />}
                        onPress={() => {
                          setDistributionCreationTab({
                            page: 'editExposedParam',
                            paramObj: singleHeader,
                          });
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
              <Button
                onPress={() => {
                  setDistributionCreationTab({ page: 'editExposedParam' });
                }}
                kind="custom"
                className="manage-params-btn"
                iconSide="left"
                icon={<Add />}
              >
                Add Exposed Parameters
              </Button>
            </div>

            <div className="commonheaders">
              <Text as="h4" className={'distHeadingText'}>
                Pagination Parameters
              </Text>
              {/* {(paginationParam.length < 1 ||
                paginationParam[0]?.key === '') && (
                <Aside
                  title={
                    'Please Add Pagination Parameters if not response gets delayed for users'
                  }
                />
              )} */}

              {paginationParam?.map((singlePagination, index) => (
                <div className="headers" key={index}>
                  <div className="param-card">
                    <Text
                      variant="pt16b"
                      as={'p'}
                      color={'var(--color-gray-07)'}
                    >
                      {singlePagination.key}
                    </Text>

                    <Text
                      variant="pt14b"
                      as={'p'}
                      color={'var(--color-gray-05)'}
                    >
                      {singlePagination.format}
                    </Text>

                    <div className="more">
                      <MoreSmallListVert width={24} />
                    </div>

                    <div className="paramActionBtns">
                      <Button
                        kind="custom"
                        iconOnly
                        icon={<Delete fill={'var(--color-secondary-01'} />}
                        onPress={() => {
                          handlepaginationParameRemove(index);
                        }}
                      />

                      <Button
                        kind="custom"
                        iconOnly
                        icon={<Edit fill={'var(--color-secondary-01'} />}
                        onPress={() => {
                          setDistributionCreationTab({
                            page: 'editPaginationParam',
                            paramObj: singlePagination,
                          });
                        }}
                      />
                    </div>
                  </div>
                  {}
                </div>
              ))}

              <Button
                onPress={() => {
                  setDistributionCreationTab({ page: 'editPaginationParam' });
                }}
                kind="custom"
                className="manage-params-btn"
                iconSide="left"
                icon={<Add />}
                title="Add new pagination parameter"
              >
                Add Pagination Parameters
              </Button>
            </div>

            <div className="commonheaders">
              <Text as="h4" className={'distHeadingText'}>
                Format Parameters
              </Text>
              <>
                <div className="headers">
                  {formik.values.format_key !== '' && (
                    <div className="param-card">
                      <Text
                        variant="pt16b"
                        as={'p'}
                        color={'var(--color-gray-07)'}
                      >
                        {formik.values.format_key}
                      </Text>

                      <Text
                        variant="pt14b"
                        as={'p'}
                        color={'var(--color-gray-05)'}
                      >
                        {formik.values.format_loc}
                      </Text>

                      <div className="more">
                        <MoreSmallListVert width={24} />
                      </div>

                      <div className="paramActionBtns">
                        {/* <Button
                        kind="custom"
                        iconOnly
                        icon={<Delete fill={'var(--color-secondary-01'} />}
                        onPress={() => {
                          handlepaginationParameRemove(index);
                        }}
                      /> */}

                        <Button
                          kind="custom"
                          iconOnly
                          icon={<Edit fill={'var(--color-secondary-01'} />}
                          onPress={() => {
                            setDistributionCreationTab({
                              page: 'editFormatParam',
                            });
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {formik.values.format_key === '' && (
                    <Button
                      onPress={() => {
                        setDistributionCreationTab({
                          page: 'editFormatParam',
                        });
                      }}
                      kind="custom"
                      className="manage-params-btn"
                      iconSide="left"
                      icon={<Add />}
                      title="Add format parameter"
                    >
                      Add Format Parameter
                    </Button>
                  )}
                </div>
              </>
            </div>

            <div className="cards">
              <div className="subcards">
                <Text as="h4" className={'distHeadingText'}>
                  Does user need to be authenticated?{' '}
                  <Indicator>(Required)</Indicator>
                </Text>
                <div className="radio">
                  <RadioGroup
                    formik={formik}
                    data={{
                      name: 'auth_required',
                      checked: formik.values.auth_required,
                      list: [
                        {
                          label: 'Yes',
                          value: 'true',
                        },
                        {
                          label: 'No',
                          value: 'false',
                        },
                      ],
                    }}
                  />
                </div>
              </div>

              {formik.values.default_format === '' && (
                <div className="subcards">
                  <Text as="h4" className={'distHeadingText'}>
                    Response Type <Indicator>(Required)</Indicator>
                  </Text>
                  <div className="radio">
                    <RadioGroup
                      formik={formik}
                      data={{
                        name: 'response_type',
                        checked: formik.values.response_type,

                        list: [
                          {
                            label: 'JSON',
                            value: 'JSON',
                          },
                          {
                            label: 'CSV',
                            value: 'CSV',
                          },
                          {
                            label: 'XML',
                            value: 'XML',
                          },
                        ],
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            <DownloadParamContainer>
              <Checkbox
                isSelected={formik.values.is_large_dataset}
                onChange={(e) => {
                  formik.setFieldValue('is_large_dataset', e);
                  !e && setAllFlagsToSameAsAPI();
                }}
              >
                <Text
                  as={'h5'}
                  color={`var(--color-gray-07)`}
                  variant="pt16b"
                  paddingBottom={'16px'}
                >
                  Use Different Download Parameters
                </Text>
              </Checkbox>

              <Button
                onPress={() => {
                  setDistributionCreationTab({
                    page: 'editDownloadParam',
                  });
                }}
                isDisabled={!formik.values.is_large_dataset}
                kind="custom"
                className="manage-params-btn"
                iconSide="left"
                icon={<Add />}
                title="Manage Download Parameters"
              >
                Manage Download Parameters
              </Button>
            </DownloadParamContainer>

            <Accordion
              type="single"
              collapsible
              key={'Additional Fields'}
              value={currentAccordion}
              onValueChange={(e: any) => setCurrentAccordion(e)}
            >
              <StyledTabItem value="Additional">
                <StyledTabTrigger>
                  <Heading
                    variant={'h5'}
                    as={'h3'}
                    fontWeight={'bold'}
                    color={'var(--text-light)'}
                  >
                    Optional Fields{' '}
                  </Heading>
                  <div>
                    {currentAccordion === 'Additional' ? (
                      <ChevronUp fill="var(--color-primary)" />
                    ) : (
                      <ChevronDown fill="var(--color-primary)" />
                    )}
                  </div>
                </StyledTabTrigger>

                <StyledTabContent onClick={(e) => e.preventDefault()}>
                  <TextField
                    label={'Byte Size'}
                    maxLength={100}
                    onChange={(e) => formik.setFieldValue('byte_size', e)}
                    value={formik.values.byte_size}
                    type="number"
                    externalHelpLink={dcatLinks.byte_size}
                  />
                  <TextField
                    label={'Checksum'}
                    maxLength={100}
                    onChange={(e) => formik.setFieldValue('checksum', e)}
                    value={formik.values.checksum}
                    externalHelpLink={dcatLinks.checksum}
                  />
                  <TextField
                    label={'Compression Format'}
                    maxLength={100}
                    onChange={(e) =>
                      formik.setFieldValue('compression_format', e)
                    }
                    value={formik.values.compression_format}
                    externalHelpLink={dcatLinks.compression_format}
                  />
                  <TextField
                    label={'Media Type'}
                    maxLength={100}
                    onChange={(e) => formik.setFieldValue('media_type', e)}
                    value={formik.values.media_type}
                    externalHelpLink={dcatLinks.media_type}
                  />
                  <TextField
                    label={'Packaging Format'}
                    maxLength={100}
                    onChange={(e) =>
                      formik.setFieldValue('packaging_format', e)
                    }
                    value={formik.values.packaging_format}
                    externalHelpLink={dcatLinks.packaging_format}
                  />
                  <TextField
                    label={'Release Date'}
                    type="date"
                    onChange={(e) => formik.setFieldValue('release_date', e)}
                    value={formik.values.release_date}
                    externalHelpLink={dcatLinks.release_date}
                  />
                </StyledTabContent>
              </StyledTabItem>
            </Accordion>

            <Flex justifyContent={'center'} gap="10px" paddingBottom={'32px'}>
              <SaveWrapper>
                <Button
                  kind="primary"
                  type="submit"
                  title={
                    formik.values.id ? 'Save Distribution' : 'Add Distribution'
                  }
                >
                  {formik.values.id ? 'Save Distribution' : 'Add Distribution'}
                </Button>
              </SaveWrapper>
            </Flex>
          </Status>
          <Aside
            title={'Please Ensure to Whitelist IDP domain for restricted APIs'}
          />
        </>
      ) : distributionCreationTab.page === 'editExposedParam' ? (
        <EditParameterView parameterCategory="EXPOSED" />
      ) : distributionCreationTab.page === 'editPaginationParam' ? (
        <EditParameterView parameterCategory="PAGINATION" />
      ) : distributionCreationTab.page === 'editFormatParam' ? (
        <EditFormatParameterView paramObj={formik.values} />
      ) : (
        <ManageDownloadParamsView />
      )}
    </>
  );
};
export default AddResourceForm;

const RadioGroup = ({ data, formik }) => {
  return (
    <>
      {data.list.map((item) => {
        return (
          <label key={item.value}>
            <input
              checked={
                data.disabled
                  ? false
                  : formik.values[data.name]?.toString() == item.value
              }
              type="radio"
              name={data.name}
              onChange={formik.handleChange}
              value={item.value}
              required
            />
            <p>{item.label}</p>
          </label>
        );
      })}
    </>
  );
};

const SaveWrapper = styled.div`
  button {
    background-color: var(--color-secondary-01);
    color: var(--color-background-lightest);
  }
`;
const AddDistribution = styled.div`
  button {
    margin: auto;
    border: 2px solid var(--color-tertiary-1-00);
    color: var(--color-tertiary-1-00);
    background-color: var(--color-background-lightest);
  }
`;
const DAMData = styled.section`
  background-color: var(--form-bg);
  border: 1px solid var(--color-gray-02);
  border-radius: 2px;

  padding: 11px 15px;

  p {
    padding-block: 5px;
    width: 100%;
  }
  .__json-pretty__ {
    span {
      font-weight: 400;
    }
  }
`;

const ApiSourcebutton = styled.a`
  color: var(--color-secondary-01);
  font-size: 16px;
  text-decoration: underline;
`;
const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 18px;
  border-bottom: 2px solid var(--color-gray-01);
`;
const DownloadParamContainer = styled.div`
  padding: 12px 0px;
`;

const OptionWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 40px;
  align-items: center;
  margin-bottom: 16px;

  > div {
    flex-grow: 1;
  }

  @media (max-width: 768px) {
    gap: 20px;
  }

  @media (max-width: 640px) {
    gap: 0px;
  }
`;

const Status = styled.form`
  padding: 1rem 0;
  display: flex;
  flex-direction: column;
  gap: 10px;

  .commonheaders {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 16px 0px 6px 0px;
    border-top: 1px solid var(--border-default);
    margin-top: 12px;

    button {
      margin-top: 8px;
    }
  }

  .distHeadingText {
    font-size: 20px;
    font-weight: var(--font-bold);
    color: var(--color-gray-07);
  }

  .param-card {
    display: flex;
    justify-content: space-between;
    align-items: center;

    padding: 12px 16px;
    width: 100%;
    margin: 8px 0;
    border: 1px solid var(--color-gray-02);
    box-shadow: var(--box-shadow);
    background-color: var(--color-tertiary-1-06);

    .paramActionBtns {
      display: none;
    }

    .more {
      align-items: center;
      display: flex;
    }

    &:hover,
    &:focus,
    &:active {
      background-color: var(--color-background-lightest);

      .paramActionBtns {
        align-items: center;
        display: flex;
      }
      .more {
        display: none;
      }
    }
  }

  .manage-params-btn {
    background-color: transparent;
    color: var(--color-tertiary-1-00);
    padding: 10px 22px;
    border: 2px solid var(--color-tertiary-1-00);
    border-radius: 2px;

    :disabled {
      color: var(--color-gray-03);
      border-color: var(--color-gray-03);
    }
  }

  .header-options {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
  }

  .header-format {
    display: flex;
    gap: 8px;
    margin-bottom: 8px;
    width: 50%;
  }
  .supported-format {
    width: 50%;
  }

  .headers {
    width: 100%;
  }

  span {
    color: var(--color-black);
    font-weight: 500;
    font-size: 14px;
  }
  .cards {
    display: flex;
    width: 100%;
    gap: 1rem;
    padding: 16px 0px;
    margin: 12px 0px;

    border-top: 1px solid var(--color-gray-02);
    border-bottom: 1px solid var(--color-gray-02);

    @media (max-width: 640px) {
      flex-direction: column;
    }

    .subcards {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      width: 100%;
    }

    h2 {
      font-size: 16px;
      margin-bottom: auto;
      margin-top: auto;
      margin-right: auto;
    }
  }

  .radio {
    display: flex;
    align-items: center;
    gap: 8px;

    label {
      margin-right: 32px;
    }

    p {
      margin: auto;
      display: flex;
      align-items: center;
      color: var(--color-gray-05);
      font-size: 16px;
      font-weight: var(--font-bold);
    }

    label > input[type='radio'] {
      display: none;
    }

    label > input[type='radio'] + *::before {
      content: '';
      display: inline-block;
      vertical-align: middle;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      border-style: solid;
      border-width: 0.1rem;
      margin-right: 8px;
      border-color: var(--border-default);
    }

    label > input[type='radio']:checked + *::before {
      background: radial-gradient(
        var(--color-background-light) 20%,
        var(--color-tertiary-1-01) 70%,
        var(--color-tertiary-1-01) 100%
      );
      border-color: var(--color-tertiary-1-01);
    }

    label > input[type='radio']:checked + * {
      color: var(--color-tertiary-1-01);
    }
  }
  .addbtn button {
    margin-left: auto;
    margin-top: 1rem;
  }

  .dataview {
    display: block;
    width: 100%;
    overflow-y: auto;
  }
`;

const ApiSourceWrapper = styled.div`
  flex-grow: 1;
`;

const URLWrapper = styled.div`
  > label {
    margin-bottom: 5px;
    span {
      padding-left: 2px;
    }
  }
  div {
    display: flex;
    align-items: center;

    background-color: var(--form-bg);
    border: 1px solid var(--color-gray-02);
    border-radius: 2px;

    height: 48px;
    padding: 11px 15px;

    :focus-within {
      border-color: var(--form-active);
      border-width: 1px;
      box-shadow: none;
    }

    span {
      width: 250px;
      border: none;
      box-shadow: 0;
      padding-top: 2px;
      font-weight: bold;
      padding-inline-start: 3px;
      padding-inline-end: 3px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    input {
      background-color: var(--color-background-light);
      border: none;
      box-shadow: 0;
      line-height: 2;
      font-size: 16px;
      font-weight: 400;
      width: 100%;
    }
    input:focus {
      outline: none;
    }
  }
`;

const StyledTabItem = styled(AccordionItem)`
  background-color: var(--color-background-lightest);
  margin-top: 16px;
`;

const StyledTabTrigger = styled(AccordionTrigger)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  width: 100%;
  padding-block: 12px 8px;
  padding-inline: 0;
  background-color: var(--color-background-lightest);
  border-bottom: 1px solid var(--color-grey-500);

  font-weight: 600;
  font-size: 18px;

  > div {
    display: flex;
    align-items: center;
    gap: 8px;
  }
`;

const StyledTabContent = styled(AccordionContent)`
  padding-block: 16px;
  > div {
    margin-bottom: 16px;
  }
`;

const Wrapper = styled.div`
  background-color: white;

  /* padding: 15px; */
  border-radius: 8px;
  display: flex;
  flex-direction: column;
`;

const ModalHeader = styled.div`
  > div {
    display: flex;
    justify-content: space-between;
    padding: 10px 15px;
  }
  Button {
    margin: auto 0;
    padding: 0;
  }
`;

const EditParamWrapper = styled.section`
  padding-top: 16px;
`;

const EditParamForm = styled.form`
  .elementContainer {
    > div {
      margin-bottom: 24px;
    }

    .keyDescContainer {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
      > div {
        flex-grow: 1;
      }
    }

    .optionsContainer {
      .deleteOption {
        color: var(--color-error);
        padding: 10px 24px;

        :focus {
          outline-color: var(--color-error);
        }
      }
      .addOption {
        color: var(--color-tertiary-1-00);
        border-radius: 2px;
        border: 2px solid var(--color-tertiary-1-00);
        padding: 10px 22px;
        margin-top: 16px;

        :focus {
          outline-color: var(--color-tertiary-1-01);
        }
      }
    }
  }

  .formFooterButtons {
    display: flex;
    align-items: center;
    gap: 16px;
    flex-wrap: wrap-reverse;
    padding-top: 16px;
    margin-top: 16px;
    border-top: 1px solid var(--border-default);
    .push {
      margin-left: auto;
    }

    @media (max-width: 640px) {
      justify-content: space-between;
      .push {
        margin-left: 0px;
      }
    }
  }

  .apart {
    display: flex;
    justify-content: space-between;
  }
`;

const DownloadParamEditBox = styled.div`
  border-radius: 2px;
  border: 1px solid var(--color-gray-02);
  padding: 16px;

  display: flex;
  flex-direction: column;
  gap: 12px;
`;
