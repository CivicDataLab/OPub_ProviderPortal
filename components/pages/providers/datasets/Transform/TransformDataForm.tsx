import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'components/actions';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RootState } from 'Store';
import { toast } from 'react-toastify';
import Aside from '../Aside';
import { LinkButton } from 'components/pages/dashboard/helpers';
import { Heading, Text } from 'components/layouts';
import { Select, TextField } from 'components/form';
import { Flex } from 'components/layouts/FlexWrapper';
import { CrossSize300 } from '@opub-icons/ui';
import { useQuery } from '@apollo/client';
import { GET_RESOURCE_COLUMNS } from 'services';
import { Indicator, Label } from 'components/form/BaseStyles';
import { useSession } from 'next-auth/react';

type Props = {
  variables: any;
  transformerslist: any;
};

const TransformDataForm = ({
  apitransformerslist,
  handleResourceRefresh,
  setCurrentTab,
  setselectedResource,
  selectedResource,
  setPipelineId,
  updateStore,
}) => {
  const transformers = apitransformerslist?.result;

  const datasetStore = useSelector((state: RootState) => state.addDataset);

  const { data: session } = useSession();

  const [pipelineName, setPipelineName] = useState('');
  const [distributionName, setDistributionName] = useState('');

  const [databaseAction, setDatabaseAction] = useState('');

  const handledbAction = (e) => {
    setDatabaseAction(e.target.name);
  };

  // use selectedResource.value when we change select to Select
  const getHelperText = () => {
    const filteredResource = datasetStore.resource_set.find(
      (item) => item.id.toString() === selectedResource
    );

    return filteredResource?.title;
  };

  useEffect(() => {
    updateStore();
  }, []);

  const [transformList, setTransform] = useState([
    { name: 'skip_column' },
    { name: 'anonymize' },
  ]);

  const handletransformerselect = (value: any, index: any) => {
    // 1. Make a shallow copy of the items
    const items = [...transformList];
    // 2. Make a shallow copy of the item you want to mutate
    const item: any = { ...items[index] };
    // 3. Replace the property you're intested in
    item.name = value;
    item['order_no'] = index + 1;
    // 4. Put it back into our array. N.B. we *are* mutating the array here, but that's why we made a copy first
    items[index] = item;
    // 5. Set the state to our new copy
    setTransform(items);
  };

  const handletransformerfill = (e: any, index: any, multi: string = '') => {
    // 1. Make a shallow copy of the item
    const items = [...transformList];
    // 2. Make a shallow copy of the item you want to mutate
    const item: any = { ...items[index] };
    item['order_no'] = index + 1;

    // 3. Replace the property you're intested in
    if (multi.length > 0) {
      item['context'] = {
        ...item['context'],
        [multi]: e?.map((columnItem) => columnItem.value),
      };
    } else {
      item['context'] = {
        ...item['context'],
        // Condition for retain columns toggle since it does not have target ids
        [e?.target?.id ? e.target.id : e.id]: e?.target?.value
          ? e.target.value
          : Array.isArray(e?.value)
          ? e?.value
          : e?.value?.toString(),
      };
    }

    // 4. Put it back into our array. N.B. we *are* mutating the array here, but that's why we made a copy first
    items[index] = item;

    // 5. Set the state to our new copy
    setTransform(items);
  };

  const handleSubmit = () => {
    let finalData;
    datasetStore.dataset_type == 'FILE'
      ? (finalData = {
          dataset_id: datasetStore.id,
          pipeline_name: pipelineName,
          db_action: databaseAction,
          // for form Select component
          // res_id: selectedResource.value,
          res_id: selectedResource,
          new_res_name: distributionName,
          pipe_action: 'create',
        })
      : (finalData = {
          dataset_id: datasetStore.id,
          pipeline_name: pipelineName,
          // for form Select component
          // api_source_id: selectedResource.value,
          api_source_id: selectedResource,
          transformers_list: transformList.filter(
            (item: any) => 'order_no' in item
          ),
        });
    const postData: any = finalData;

    if (postData?.transformers_list?.length === 0) {
      toast.error('Select atleast one Transformation Method');
    } else {
      submitData(
        datasetStore.dataset_type == 'FILE'
          ? `${process.env.NEXT_PUBLIC_TRANSFORMATION_URL}/transformer/pipe_create`
          : `${process.env.NEXT_PUBLIC_TRANSFORMATION_URL}/transformer/api_res_transform`,
        postData
      );
    }
    async function submitData(url: any, data: any) {
      const resultFromAPI = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization:
            session && session['access']?.token ? session['access'].token : '',
        },
        body: JSON.stringify(data),
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.Success) {
            toast.success('Transformation Created');
            setPipelineId(res.result.p_id);
            handleResourceRefresh();
            modalHandler();
            updateStore();
            setselectedResource('');
            setDatabaseAction('');
            setPipelineName('');
            setDistributionName('');
            if (datasetStore?.dataset_type == 'FILE') {
              setCurrentTab('edit');
            } else {
              setCurrentTab('list');
            }

            datasetStore.dataset_type == 'API' &&
              setTransform([{ name: 'pipeline__transformation' }]);
          } else {
            toast.error('Error while creating Transformation');
          }
        })
        .catch((err) => toast.error('Failed to create transformation. ', err));
    }
  };
  useEffect(() => {
    setselectedResource('');
    setDatabaseAction('');
    setPipelineName('');
    setDistributionName('');
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);
  function modalHandler() {
    setIsModalOpen(!isModalOpen);
  }

  const [isValid, setIsValid] = useState(false);

  const handleForm = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (datasetStore.dataset_type == 'FILE') {
      setIsValid(true);
      modalHandler();
    } else {
      handleSubmit();
    }
  };

  const transData = transformers.map((index) =>
    index.context.map((item) => item.name)
  );
  const transId = transData
    .map((a) => a.join(','))
    .join(',')
    .split(',');

  function reset() {
    for (const id of transId) {
      (document.getElementById(id) as HTMLSelectElement).selectedIndex = 0;
    }
    (document.getElementById('n') as HTMLInputElement).value = null;
    setTransform([{ name: 'skip_column' }, { name: 'anonymize' }]);
  }

  return (
    <>
      <Transform>
        <HeaderWrapper>
          <Heading as="h2" variant="h3" marginY={'auto'}>
            Add New Transformation
          </Heading>
          <AddTransform title="Back to Transformations">
            <LinkButton
              kind="primary"
              label="Back to All Transformations"
              type="back"
              onClick={() => setCurrentTab('list')}
            />
          </AddTransform>
        </HeaderWrapper>
        <FormWrapper>
          {datasetStore.resource_set.find(
            (dataStoreItem) => dataStoreItem.schema?.length === 0
          ) ? (
            <Aside
              title={'Only Distributions with schema can be transformed'}
            />
          ) : (
            ''
          )}
          <form id="main" onSubmit={(e) => handleForm(e)}>
            <div className="wrapper pipeline">
              <div className="resourceselction">
                {/* <label>
                <span>the Transformation&#42;</span>
                <input
                  type="text"
                  id="name"
                  required
                  onChange={(e) => setPipelineName(e.target.value)}
                  value={pipelineName}
                />
              </label> */}
                <TextField
                  label="Name of the Transformation"
                  isRequired
                  maxLength={100}
                  value={pipelineName}
                  onChange={(e) => setPipelineName(e)}
                />

                {/* <Select
                  label=" Select the Distribution"
                  inputId="Select Column Filter"
                  value={selectedResource}
                  onChange={(e) => {
                    setselectedResource(e);
                  }}
                  isRequired
                  options={datasetStore.resource_set
                    .filter(
                      (item) =>
                        item.schema.length > 0 &&
                        (item.file_details?.format.toLowerCase() === 'csv' ||
                          item.file_details?.format.toLowerCase() === 'json' ||
                          item.file_details?.format.toLowerCase() === 'xml' ||
                          item.api_details?.response_type.toLowerCase() ===
                            'csv' ||
                          item.api_details?.response_type.toLowerCase() ===
                            'json')
                    )
                    .map((resourceItem) => {
                      return {
                        label: resourceItem.title,
                        value: resourceItem.id,
                      };
                    })}
                /> */}
                <DistributionWrapper>
                  <Label>
                    <span>
                      Select the Distribution <Indicator>(Required)</Indicator>
                    </span>

                    <select
                      onChange={(e) => {
                        setselectedResource(e.target.value);
                      }}
                      value={selectedResource}
                      required
                    >
                      <option value="" disabled>
                        Select the Distribution
                      </option>

                      {datasetStore?.resource_set
                        .filter(
                          (item) =>
                            item.schema.length > 0 &&
                            (item.file_details?.format.toLowerCase() ===
                              'csv' ||
                              item.file_details?.format.toLowerCase() ===
                                'json' ||
                              item.file_details?.format.toLowerCase() ===
                                'xml' ||
                              item.api_details?.response_type.toLowerCase() ===
                                'csv' ||
                              item.api_details?.response_type.toLowerCase() ===
                                'json' ||
                              item.api_details?.response_type.toLowerCase() ===
                                'xml')
                        )
                        .map((dataStoreItem, index) => (
                          <>
                            <option
                              key={index}
                              value={dataStoreItem.id.toString()}
                            >
                              {dataStoreItem.title}
                            </option>
                          </>
                        ))}
                    </select>
                  </Label>
                </DistributionWrapper>
                {selectedResource && datasetStore.dataset_type == 'FILE' && (
                  <>
                    <div className="radio">
                      <label>
                        <Text variant="pt14">
                          <strong>Action</strong>{' '}
                          <Indicator>(Required)</Indicator>
                        </Text>
                      </label>
                      <Flex gap="10px" paddingY={'16px'}>
                        <div>
                          <Flex gap="8px">
                            <input
                              type="radio"
                              name="create"
                              value={databaseAction}
                              checked={databaseAction === 'create'}
                              required={databaseAction === ''}
                              // defaultChecked
                              onChange={(e) => handledbAction(e)}
                            />
                            <p>Create</p>
                          </Flex>
                          <Dbdescription>
                            A copy of
                            <strong>
                              {' '}
                              {selectedResource && getHelperText()}{' '}
                            </strong>
                            will be created after applying the selected
                            transformation.{' '}
                            <strong>
                              {selectedResource && getHelperText()}{' '}
                            </strong>
                            will not be modified
                          </Dbdescription>
                        </div>
                        <div>
                          <Flex gap="8px">
                            <input
                              type="radio"
                              name="update"
                              required={databaseAction === ''}
                              checked={databaseAction === 'update'}
                              value={databaseAction}
                              onChange={(e) => handledbAction(e)}
                            />
                            <p>Update</p>
                          </Flex>
                          <Dbdescription>
                            <strong>
                              {' '}
                              {selectedResource && getHelperText()}{' '}
                            </strong>
                            will be updated with transformed data.{' '}
                            <strong>
                              {selectedResource && getHelperText()}
                            </strong>{' '}
                            will be irreversibly modified
                          </Dbdescription>
                        </div>
                      </Flex>
                    </div>

                    {/* <div>
                      {databaseAction === 'create' ? (
                        <Text as="p" marginBottom={'10px'}>
                          &#42;The Distribution
                          <strong>
                            {' '}
                            {selectedResource && getHelperText()}{' '}
                          </strong>
                          will be copied to new resource within the same dataset
                          and updated with transformed data
                        </Text>
                      ) : (
                        <Text as="p" marginBottom={'10px'}>
                          &#42;The Distribution
                          <strong>
                            {' '}
                            {selectedResource && getHelperText()}{' '}
                          </strong>
                          will be updated with transformed data
                        </Text>
                      )}
                    </div> */}
                  </>
                )}

                {databaseAction === 'create' ? (
                  <>
                    <TextField
                      label="Name of the New Distribution"
                      isRequired
                      maxLength={100}
                      value={distributionName}
                      onChange={(e) => setDistributionName(e)}
                    />
                  </>
                ) : (
                  ''
                )}
                {datasetStore.dataset_type == 'API' && (
                  <>
                    {selectedResource && (
                      <section>
                        <Flex
                          justifyContent={'space-between'}
                          marginBottom={'1px'}
                        >
                          <Label>
                            Transformation Method{' '}
                            <Indicator>(Required)</Indicator>
                          </Label>
                          {/* <button
                            onClick={(e) => {
                              e.preventDefault();
                              reset();
                            }}
                            title="Reset the Transformation Method"
                          >
                            Reset
                          </button> */}
                        </Flex>
                      </section>
                    )}

                    <div className="transform">
                      {transformList.map((singleTransform, index) => (
                        <>
                          <TransformerItem
                            item={singleTransform}
                            transformerIndex={index}
                            transformList={transformList}
                            transformers={transformers}
                            selectedResource={selectedResource}
                            datasetStore={datasetStore}
                            handletransformerfill={handletransformerfill}
                            handletransformerselect={handletransformerselect}
                          />
                        </>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            <SubmitWrapper>
              <Button
                kind="primary"
                size="sm"
                type="submit"
                title="Save Transformation"
              >
                Save Transformation
              </Button>
            </SubmitWrapper>
          </form>
        </FormWrapper>
        {isValid && <TransformModal />}
        {/* <Button kind="primary-outline" onPress={addResourceTransform}>
          Transform Another Resource
        </Button> */}
      </Transform>
    </>
  );

  function TransformModal() {
    return (
      <>
        <Modal
          isOpen={isModalOpen}
          modalHandler={() => modalHandler()}
          label="Add API Source"
        >
          <Wrapper>
            {databaseAction === 'create' ? (
              <>
                <ModalHeader>
                  <div>
                    <Heading as="h2" variant="h3">
                      Add New Transformation
                    </Heading>
                    <Button
                      kind="custom"
                      size="md"
                      icon={<CrossSize300 />}
                      onPress={() => setIsModalOpen(!isModalOpen)}
                    />
                  </div>
                </ModalHeader>
                <Line />
                <Heading
                  as="h3"
                  variant="h4"
                  paddingTop="24px"
                  paddingX={'24px'}
                  fontWeight="400"
                >
                  Are you sure you want to Create a new distribution??
                </Heading>
                <Text paddingY="12px" paddingX={'24px'} font-weight="400">
                  On creating, the Distribution will be copied to new
                  Distribution within the same dataset and updated with
                  transformed data
                </Text>
                <Line />
                <Flex paddingY={'16px'} gap={'10px'} justifyContent="center">
                  <Button
                    kind="primary-outline"
                    onPress={() => setIsModalOpen(!isModalOpen)}
                  >
                    No, Cancel
                  </Button>
                  <Button kind="primary" onPress={() => handleSubmit()}>
                    Yes, Create
                  </Button>
                </Flex>
              </>
            ) : (
              <>
                <ModalHeader>
                  <div>
                    <Heading as="h2" variant="h3">
                      Add New Transformation
                    </Heading>
                    <Button
                      kind="custom"
                      size="md"
                      icon={<CrossSize300 />}
                      onPress={() => setIsModalOpen(!isModalOpen)}
                    />
                  </div>
                </ModalHeader>
                <Line />
                <Heading
                  as="h3"
                  variant="h4"
                  paddingTop="24px"
                  paddingX={'24px'}
                  fontWeight="400"
                >
                  Are you sure you want to Update an existing distribution?
                </Heading>
                <Text paddingY="12px" paddingX={'24px'}>
                  On updating, the Distribution will be updated with transformed
                  data.
                </Text>
                <Line />
                <Flex paddingY={'16px'} gap={'10px'} justifyContent="center">
                  <Button
                    kind="primary-outline"
                    onPress={() => setIsModalOpen(!isModalOpen)}
                  >
                    No, Cancel
                  </Button>
                  <Button kind="primary" onPress={() => handleSubmit()}>
                    Yes Update
                  </Button>
                </Flex>
              </>
            )}
          </Wrapper>
        </Modal>
      </>
    );
  }
};

export default TransformDataForm;

const Dbdescription = styled.p`
  font-size: 12px;
  color: var(--color-gray-05);
  max-width: 224px;
  padding-block: 8px;
  line-height: 20px;
`;

const SubmitWrapper = styled.div`
  margin: auto;
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 32px;

  > button {
    background-color: var(--color-secondary-01);
    color: var(--color-background-lightest);
    margin-left: 8px;
  }
`;

const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  border-bottom: 2px solid var(--color-gray-01);
  padding-bottom: 20px;
`;
const AddTransform = styled.div`
  button {
    border: 2px solid var(--color-secondary-01);
    color: var(--color-secondary-01);
    background-color: var(--color-background-lightest);
    margin-left: 8px;
  }
`;

const FormWrapper = styled.div`
  padding-block: 20px;
`;
const Line = styled.div`
  border: 1px solid var(--color-gray-01);
  margin-inline: 20px;
`;
const Wrapper = styled.div`
  background-color: white;
  max-height: 90vh;
  min-width: 629px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
`;

const ModalHeader = styled.div`
  > div {
    display: flex;
    justify-content: space-between;
    padding: 24px;
  }
  Button {
    margin: auto 0;
    padding: 0;
  }
`;
const DistributionWrapper = styled.div`
  display: block;
  width: 100%;

  div {
    display: flex;
    gap: 10px;
  }
  select {
    margin-top: 4px;
    background-color: var(--color-background-light);
    border-color: var(--color-gray-02);
    border-width: 1px;
    border-radius: 2px;
    line-height: 2;
    height: 48px;
    padding: 0 10px;
    font-weight: 400;
    width: 100%;

    option {
      font-size: 16px;
    }
  }
`;
const Transform = styled.section`
  .transformdata {
    margin-top: 1rem;
  }
  .headersection {
    display: flex;
    justify-content: space-between;
  }

  .resourcecontext {
    display: flex;
    gap: 1rem;
  }

  .removetransform {
    padding: 0 1rem;

    button {
      margin-left: auto;
      margin-bottom: 1rem;
    }
  }

  .upload {
    background-color: white;
    padding: 0px 18px;
    height: auto;
    margin-top: 4rem;
    border: 3px dashed #e3d6d6;
    display: block;
  }
  .lastsection {
    margin: auto;
    padding: 1rem;
  }

  .wrapper {
    margin-top: 1rem;
  }
  .next {
    display: flex;
    padding: 16px;

    #next {
      margin-left: auto;
    }
    #prev {
      margin-right: auto;
    }
    button {
      padding: 5px 10px;
      border: 1px solid #22a8b9;
      color: #22a8b9;
      background-color: white;
    }
    button svg {
      transform: rotate(270deg);
      margin-top: auto;
    }
    #prev svg {
      transform: rotate(90deg);
    }
  }
  .resourceselction {
    > div {
      margin-bottom: 20px;
    }
    .radio {
      gap: 0.5rem;
      label {
        width: auto;
        gap: 0.2rem;
      }
      p {
        margin: auto 1px;
      }
      input {
        background-color: var(--color-white);
        border: none;
        box-shadow: none;
        line-height: 0;
        min-height: 0;
        border-radius: 0;
        padding: 0;

        font-weight: 400;
        width: 20px;
      }
    }
  }
  .addstep {
    display: flex;

    margin-bottom: 5px;
    .addmore {
      margin-left: auto;
      circle {
        display: none;
      }
    }
  }
  .pipeline {
    &__done {
      color: green;
    }
    &__inprogress {
      color: red;
    }
    &__started {
      color: rgb(118, 163, 28);
    }

    &__failed {
      color: #ff605c;
    }
  }
`;

const TransformerItem = ({
  item,
  transformerIndex,
  transformers,
  handletransformerselect,
  handletransformerfill,
  transformList,
  selectedResource,
  datasetStore,
}) => {
  const [selectedTransform, setSelectedTransform] = useState('');
  const [outputColumnValue, setOutputColumnValue] = useState({});
  const [columnsToTransform, setColumnsToTransform] = useState({});

  //humanize the types of transformers getting from backend
  function humanize(str: any) {
    var i,
      frags = str.split('_');
    for (i = 0; i < frags.length; i++) {
      frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1);
    }
    return frags.join(' ');
  }

  // use selectedResource.value when we change select to Select
  const data = datasetStore.resource_set.find(
    (item) => item.id.toString() === selectedResource
  );

  const handleColumnInput = (e, index) => {
    const outputColumnObj = { [e.target.name]: e.target.value };
    setOutputColumnValue({ ...outputColumnValue, ...outputColumnObj });
  };

  const handleColumnSelect = (e) => {
    let columnObj = {};
    switch (selectedTransform) {
      case 'merge_columns':
        columnObj = { [e.target.name]: e.target.value };
        break;
      case 'skip_column':
        columnObj = { [e.target.name]: e.target.value };
        break;
      default:
        columnObj = {};
        break;
    }
    setColumnsToTransform({ ...columnsToTransform, ...columnObj });
  };

  const getResourceColumnsRes = useQuery(GET_RESOURCE_COLUMNS, {
    variables: {
      resource_id: selectedResource,
    },
    skip: !selectedResource,
  });

  const OptionSingleList = [
    { value: 'replace_all', label: 'Replace All' },
    { value: 'replace_nth', label: 'Replace nth character' },
    { value: 'retain_first_n', label: 'Retain First n characters' },
  ];

  const SpecialCharacterList = [
    { value: 'random', label: 'Random' },
    { value: '&', label: '&' },
    { value: '|', label: '|' },
    { value: '*', label: '*' },
  ];

  const [replaceAllOPtion, setReplaceAllOption] = useState('');

  function showElementsBasedOnTransformer(
    type,
    placeholder,
    name,
    transformerIndex,
    index,
    getResourceColumnsRes
  ) {
    switch (type) {
      case 'string':
        return (
          <div>
            <span>{placeholder}</span>
            <input
              onChange={(e) => handletransformerfill(e, transformerIndex)}
              id={name}
              type={type}
              key={index}
              disabled={!selectedResource}
              name={name}
              placeholder={placeholder}
            />
          </div>
        );
      case 'field_multi':
        return (
          <>
            <Text variant="pt16b">Skip Column</Text>
            <div className="MultiSelectColumns">
              <span>{placeholder}</span>
              {/*  <select
                key={index}
                id={name}
                disabled={!selectedResource}
                onChange={(e) =>
                  handletransformerfill(e, transformerIndex)
                }
              >
                <option value="" selected disabled>
                  Select the Column
                </option>

                {data?.schema?.map((item, index) => (
                  <option key={index} id={`${name}_${index}`}>
                    {item.display_name}
                  </option>
                ))}
              </select>
              */}
              <Select
                inputId={name}
                isDisabled={!selectedResource}
                isMulti
                isClearable
                options={data?.schema?.map((item) => {
                  return {
                    value: item.display_name,
                    label: item.display_name,
                  };
                })}
                onChange={(e) =>
                  handletransformerfill(e, transformerIndex, name)
                }
              />
            </div>
          </>
        );

      //    <Select isMulti options={item}/>
      case 'field_single':
        return (
          <>
            <Text variant="pt16b">Anonymize</Text>
            <div>
              <span>{placeholder}</span>
              <select
                key={index}
                id={name}
                disabled={!selectedResource}
                onChange={(e) => handletransformerfill(e, transformerIndex)}
              >
                <option value="" selected disabled>
                  Select the Column
                </option>

                {data?.schema?.map((item, index) => (
                  <option key={index} id={`${name}_${index}`}>
                    {item.display_name}
                  </option>
                ))}
              </select>
            </div>
          </>
        );
      case 'option_single':
        return (
          <div>
            <span>{placeholder}</span>
            <select
              key={index}
              id={name}
              disabled={!selectedResource}
              onChange={(e: any) => {
                handletransformerfill(e, transformerIndex);
                setReplaceAllOption(e.target.value);
              }}
            >
              <option value="" selected disabled>
                Select the option
              </option>
              {OptionSingleList.map((item) => (
                <option key={index} id={`${name}_${index}`} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
        );
      case 'special_char_single':
        return (
          <div>
            <span>{placeholder}</span>
            <select
              key={index}
              id={name}
              disabled={!selectedResource}
              onChange={(e) => handletransformerfill(e, transformerIndex)}
            >
              <option value="" selected disabled>
                Select the Special char
              </option>
              {SpecialCharacterList.map((item) => (
                <option key={index} id={`${name}_${index}`} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
        );
      case 'n_type':
        return replaceAllOPtion === 'replace_nth' ||
          replaceAllOPtion === 'retain_first_n' ? (
          <div>
            <span>{placeholder}</span>
            <input
              onChange={(e) => handletransformerfill(e, transformerIndex)}
              id={name}
              maxLength={100}
              type="number"
              min={'0'}
              key={index}
              disabled={!selectedResource}
              name={name}
              placeholder={placeholder}
            />
          </div>
        ) : (
          <div>
            <span>{placeholder}</span>
            <input
              onChange={(e) => handletransformerfill(e, transformerIndex)}
              id={name}
              maxLength={100}
              type={type}
              key={index}
              disabled
              name={name}
              placeholder={'disabled'}
            />
          </div>
        );

      default:
        return <input></input>;
    }
  }

  return (
    <TransformationWrapper>
      {selectedResource && (
        <>
          <div>
            <label htmlFor="transform_1" className="transformationlabel">
              <span>
                {' '}
                Transformation Method <Indicator>(Required)</Indicator>
              </span>
              <select
                disabled={!selectedResource}
                name={`${item.name}_${transformerIndex}`}
                className="transform__select"
                required
                value={transformList[transformerIndex].name}
                // defaultValue={transformList[0].name}
                onChange={(e) =>
                  handletransformerselect(e.target.value, transformerIndex)
                }
              >
                {transformers?.map((transformer: any, index: any) => (
                  <option
                    value={transformer.name}
                    defaultValue={transformer.name[0]}
                    key={index}
                  >
                    {humanize(transformer.name)}
                  </option>
                ))}
              </select>
            </label>
            <div
              id={`transform_data_${transformerIndex}`}
              className="transform__data"
            >
              {transformers?.filter(
                (x: { name: string }) =>
                  x.name == transformList[transformerIndex].name
              ).length > 0 &&
                transformers
                  .filter(
                    (x: { name: string }) =>
                      x.name == transformList[transformerIndex].name
                  )[0]
                  .context.map((transform: any, index1: any) =>
                    showElementsBasedOnTransformer(
                      transform.type,
                      transform.desc,
                      transform.name,
                      transformerIndex,
                      index1,
                      getResourceColumnsRes
                    )
                  )}
            </div>
          </div>
        </>
      )}
    </TransformationWrapper>
  );
};

const TransformationWrapper = styled.section`
  padding-top: 4px;
  > div {
    border: 2px solid var(--color-secondary-01);
    padding: 12px;
    margin-bottom: 20px;
    div {
      margin-block: 10px;
    }
  }
  .transformationlabel {
    display: none;
  }
  label {
    display: grid;
    margin-bottom: 20px;
    span {
      font-size: 0.875rem;
      margin-bottom: 4px;
      line-height: 1.4;
      width: 100%;
      font-weight: var(--font-bold);
    }
  }
  input,
  select {
    height: 2rem;
    margin-right: 1rem;
    background-color: var(--color-white);
    border: none;
    box-shadow: 0 0 2px black;
    line-height: 2;
    border-radius: 5px;
    padding: 0 10px;
    min-height: 50px;
    width: 100%;
    font-weight: 400;
  }

  .MultiSelectColumns {
    input,
    select {
      box-shadow: none;
      min-height: min-content;
      margin: 0px;
    }

    div div {
      margin-block: 0px;
    }
  }
`;
