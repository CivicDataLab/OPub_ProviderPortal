import { useMutation, useQuery } from '@apollo/client';
import { CrossSize300 } from '@opub-icons/ui';
import { Button, Modal } from 'components/actions';
import { Loader } from 'components/common';
import { Heading } from 'components/layouts';
import { Flex } from 'components/layouts/FlexWrapper';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {
  GET_RESOURCE_COLUMNS,
  mutation,
  UPDATE_RESOURCE_SCHEMA,
} from 'services';
import { RootState } from 'Store';
import styled from 'styled-components';
import { fetchapischema } from 'utils/fetch';
import { omit } from 'utils/helper';
import DeleteSchemaModal from './DeleteSchemaModal';
import { useSession } from 'next-auth/react';
import { useProviderStore } from 'services/store';

interface schemaInput {
  type: string;
  name: string;
  id: number;
  value: string;
  required?: boolean;
  placeholder: string;
  jsonOptions: { data: arrayType };
  arrayOptions: { data: arrayType };
}

type arrayType = schemaInput[];

// Componenet to show/edit JSON based Schema
const JSONSchema = ({ resource, updateStore, setFormChanged }) => {
  const datasetStore = useSelector((state: RootState) => state.addDataset);

  const [selectedJsonTypes, setselectedJsonTypes] = useState([]);
  const [arrayItems, setArrayItems] = useState([]);
  const [isArrayItem, setIsArrayItem] = useState(false);
  const [dummyvar, setDummyvar] = useState(false);

  const schemaInputArr: arrayType = [
    {
      type: 'text',
      name: 'key',
      id: 0,
      value: '',
      required: true,
      placeholder: 'Field name',
      jsonOptions: { data: [] },
      arrayOptions: { data: [] },
    },
    {
      type: 'text',
      name: 'display_name',
      id: 1,
      value: '',
      required: true,
      placeholder: 'Display Name',
      jsonOptions: { data: [] },
      arrayOptions: { data: [] },
    },
    {
      type: 'select',
      id: 2,
      value: '',
      name: 'format',
      required: true,
      placeholder: 'Type',
      jsonOptions: { data: [] },
      arrayOptions: { data: [] },
    },
    {
      type: 'text',
      id: 3,
      name: 'description',
      value: '',
      placeholder: 'Description',
      jsonOptions: { data: [] },
      arrayOptions: { data: [] },
    },
    {
      type: 'select',
      id: 4,
      value: '',
      name: 'parent',
      placeholder: 'parent',
      jsonOptions: { data: selectedJsonTypes },
      arrayOptions: { data: [] },
    },
  ];

  // const schemaInputArr: arrayType = [
  //   {
  //     type: 'text',
  //     name: 'key',
  //     id: 0,
  //     value: '',
  //     required: true,
  //     placeholder: 'Field name',
  //     jsonOptions: { data: [] },
  //     arrayOptions: { data: [] },
  //   },
  //   {
  //     type: 'text',
  //     name: 'display_name',
  //     id: 1,
  //     value: '',
  //     required: true,
  //     placeholder: 'Display Name',
  //     jsonOptions: { data: [] },
  //     arrayOptions: { data: [] },
  //   },
  //   {
  //     type: 'select',
  //     id: 2,
  //     value: '',
  //     name: 'format',
  //     required: true,
  //     placeholder: 'Type',
  //     jsonOptions: { data: [] },
  //     arrayOptions: { data: [] },
  //   },
  //   {
  //     type: 'text',
  //     id: 3,
  //     name: 'description',
  //     value: '',
  //     placeholder: 'Description',
  //     jsonOptions: { data: [] },
  //     arrayOptions: { data: [] },
  //   },
  //   {
  //     type: 'select',
  //     id: 4,
  //     value: '',
  //     name: 'parent',
  //     placeholder: 'parent',
  //     jsonOptions: { data: selectedJsonTypes },
  //     arrayOptions: { data: [] },
  //   },
  // ];

  const [schemaFields, setschemaFields] = useState(schemaInputArr);
  // let a = Number(filteredarray[index]) - 3;
  const schemaHeaders = [
    {
      id: 'fields',
      name: 'Fields',
    },
    {
      id: 'display_name',
      name: 'Display Name',
    },
    {
      id: 'type',
      name: 'Type',
    },
    {
      id: 'description',
      name: 'Description',
    },
    {
      id: 'parent',
      name: 'Parent',
    },
    {
      id: 'array_field',
      name: 'Array Field',
    },
    {
      id: '',
      name: '',
    },
  ];

  const schemaTypes = [
    {
      id: 'string',
      name: 'string',
    },
    {
      id: 'json',
      name: 'json',
    },
    {
      id: 'array',
      name: 'array',
    },
  ];

  const addSchemaFields = () => {
    setschemaFields((schema) => {
      return [
        ...schema,
        {
          type: 'text',
          name: 'key',
          id: 0,
          value: '',
          required: true,
          placeholder: 'Field name',
          jsonOptions: { data: [] },
          arrayOptions: { data: [] },
        },
        {
          type: 'text',
          name: 'display_name',
          id: 1,
          value: '',
          required: true,
          placeholder: 'Display Name',
          jsonOptions: { data: [] },
          arrayOptions: { data: [] },
        },
        {
          type: 'select',
          id: 2,
          value: '',
          name: 'format',
          required: true,
          placeholder: 'Type',
          jsonOptions: { data: [] },
          arrayOptions: { data: [] },
        },
        {
          type: 'text',
          id: 3,
          name: 'description',
          value: '',
          placeholder: 'Description',
          jsonOptions: { data: [] },
          arrayOptions: { data: [] },
        },
        {
          type: 'select',
          id: 4,
          value: '',
          name: 'parent',
          placeholder: 'parent',
          jsonOptions: { data: selectedJsonTypes },
          arrayOptions: { data: [] },
        },
        {
          type: 'select',
          id: 5,
          value: '',
          name: 'array_field',
          placeholder: 'Array Item',
          jsonOptions: { data: [] },
          arrayOptions: { data: arrayItems },
        },
      ];
    });
  };
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = (e) => {
    return new Promise<void>((resolve, reject) => {
      let newArr = [...schemaFields];
      let keyVal = newArr[e.target.id * 5 - 6]['key'];
      newArr.splice(e.target.id * 5 - 6, 6);

      let rem_arr = [];
      for (let index = 0; index < newArr.length; index++) {
        if ('parent' in newArr[index] && newArr[index]['parent'] == keyVal) {
          rem_arr.push(index);
        }
      }

      let comp_rem_arr = [];
      for (let index = 0; index < rem_arr.length; index++) {
        comp_rem_arr.push(rem_arr[index] + 1);
        comp_rem_arr.push(rem_arr[index]);
        comp_rem_arr.push(rem_arr[index] - 1);
        comp_rem_arr.push(rem_arr[index] - 2);
        comp_rem_arr.push(rem_arr[index] - 3);
        comp_rem_arr.push(rem_arr[index] - 4);
      }

      let res_arr = newArr.filter((obj, index) => {
        return !comp_rem_arr.includes(index);
      });

      setschemaFields(res_arr);
      setDummyvar(!dummyvar);
      resolve();
    });
  };

  const [isFetchSchema, setIsFetchSchema] = useState(false);

  const [enableAdd, setEnableAdd] = useState('no');

  // Prefill data from the previously saved data
  const hydrateSchema = (schema) => {
    const schemaInputArr = [];
    const arrayFields = [];
    const jsonFields = [];
    if (schema.length > 0) {
      setEnableAdd('yes');
      const hasArrayField = schema.filter((item) => item.format === 'array');

      if (hasArrayField.length !== 0) {
        setIsArrayItem(true);
      }
      const jsonTypes = schema.filter((item) => item.format === 'json');
      if (jsonTypes.length > 0 && jsonTypes) {
        jsonTypes.map((item) => {
          jsonFields.push(item.key);
        });
      }

      schema.forEach((resObj) => {
        resObj = omit(resObj, ['id']);
        resObj = omit(resObj, ['filterable']);

        arrayFields.push(resObj.key);
        Object.keys(resObj).map((key, keyIndex) => {
          schemaInputArr.push({
            type:
              key === 'format' || key === 'parent' || key === 'array_field'
                ? 'select'
                : 'text',
            name: key,
            [key]:
              (key === 'array_field' || key === 'parent') && resObj[key]
                ? resObj[key]['key']
                : resObj[key]
                ? resObj[key]
                : '',
            id: keyIndex,
            value:
              (key === 'array_field' || key === 'parent') && resObj[key]
                ? resObj[key]['key']
                : resObj[key],
            placeholder: key,
            jsonOptions: { data: jsonFields },
            arrayOptions: {
              data: key === 'array_field' && resObj[key] ? arrayFields : [],
            },
          });
        });
      });
      setschemaFields(schemaInputArr);

      setArrayItems(arrayFields);
      setselectedJsonTypes(jsonFields);
    }
  };

  // Prefill data with schema generated after fetching the columns
  const hydrateFetchSchema = (schema) => {
    setIsFetchSchema(true);

    const schemaInputArr = [];
    const arrayFields = [];
    const jsonFields = [];

    const hasArrayField = schema?.filter((item) => item.format === 'array');
    if (hasArrayField?.length !== 0) {
      setIsArrayItem(true);
    }
    const jsonTypes = schema?.filter((item) => item.format === 'json');
    if (jsonTypes?.length > 0 && jsonTypes) {
      jsonTypes?.map((item) => {
        jsonFields?.push(item.key);
      });
    }
    schema.forEach((resObj) => {
      if (resObj.array_field !== '') {
        arrayFields.push(resObj.array_field);
      }

      Object.keys(resObj).map((key, keyIndex) => {
        schemaInputArr.push({
          type:
            key === 'format' || key === 'parent' || key === 'array_field'
              ? 'select'
              : 'text',
          name: key,
          [key]: resObj[key],
          id: keyIndex,
          value: resObj[key],
          placeholder: key,
          jsonOptions: { data: resObj.parent !== '' ? jsonFields : [] },
          arrayOptions: {
            data:
              key === 'array_field' && resObj.array_field !== '' && resObj[key]
                ? arrayFields
                : [],
          },
          path: resObj.path,
          parent_path: resObj.parent_path,
        });
      });

      // schemaInputArr.map((item) => {
      //   item.key ? (item.display_name = item.key) : null;
      // });
    });

    setschemaFields(schemaInputArr);

    setArrayItems(arrayFields);
    setselectedJsonTypes(jsonFields);
    setIsLoading(false);
  };

  const [resourceIdForSchema, setResourceIdForSchema] = useState(null);

  const getResourceColumnsRes = useQuery(GET_RESOURCE_COLUMNS, {
    variables: {
      resource_id: resourceIdForSchema,
    },
    skip: !resourceIdForSchema,
  });

  const setSchema = (data) => {
    if (
      (data.response_type.toLowerCase() === 'json' ||
        data.response_type.toLowerCase() === 'xml') &&
      data.schema.length > 0
    ) {
      setEnableAdd('yes');
      return hydrateFetchSchema(data.schema);
    }
    setIsLoading(false);
    setschemaFields(schemaInputArr);
  };
  const { data: session } = useSession();
  const currentOrgRole = useProviderStore((e) => e.org);
  useEffect(() => {
    setIsLoading(true);

    setIsFetchSchema(false);

    if (resource?.schema?.length > 0) {
      setIsLoading(false);
      setEnableAdd('yes');
      hydrateSchema(resource.schema);
    } else {
      if (resource?.file_details) {
        setResourceIdForSchema(resource.id);

        if (!getResourceColumnsRes.loading && !getResourceColumnsRes.error) {
          setIsLoading(false);
          if (getResourceColumnsRes.data?.resource_columns) {
            try {
              let newSchema = getResourceColumnsRes.data.resource_columns.map(
                (item) =>
                  JSON.parse(item.replaceAll(`'`, `*`).replaceAll(`*`, `"`))
              );
              if (newSchema.length >= 0) {
                setEnableAdd('yes');
                hydrateFetchSchema(newSchema);
              }
            } catch (error) {
              toast.error('Failed ' + error);
            }
          }
        }
      } else {
        fetchapischema(resource.id, session, currentOrgRole?.org_id)
          .then((data) => {
            setSchema(data);
          })
          .catch(() => {
            setIsLoading(false);
          });
      }

      // let newSchema = getResourceColumnsRes.data.resource_columns.map((item) =>
      //   JSON.parse(item.replaceAll(`'`, `*`).replaceAll(`*`, `"`))
      // );

      // hydrateFetchSchema(newSchema);
    }
  }, [resource?.schema, getResourceColumnsRes]);

  const handleTypeChange = (index, e) => {
    // * To set array fields dropdown for every field typed by user

    const allArrayColumnList = new Array(schemaFields[index - 1]['value']);
    const mergeWithPreviousColumns = [
      ...new Set([...arrayItems, ...allArrayColumnList]),
    ];
    setArrayItems(mergeWithPreviousColumns);

    handleFormChange(index, e);
    if (
      (e.target.value === 'json' || e.target.value === 'string') &&
      schemaFields[index + 3]?.name === 'array_field'
    ) {
      // *To remove array field if json or string is selected in that particular row

      schemaFields.splice(index + 3, 1);
      setschemaFields(schemaFields);
    }

    if (e.target.value === 'array' || e.target.value === 'string') {
      // *To update json types dropdown when user updates the format type

      if (selectedJsonTypes.includes(schemaFields[index - 1]['value'])) {
        const indexOfField = selectedJsonTypes.indexOf(
          schemaFields[index - 1]['value']
        );
        selectedJsonTypes.splice(indexOfField, 1);
        setselectedJsonTypes(selectedJsonTypes);
      }
    }

    if (e.target.value === 'json') {
      setselectedJsonTypes((types) => {
        return [...types, schemaFields[index - 1]['value']];
      });
    }

    if (e.target.value === 'array') {
      updateSchemaFields(index);
    }
  };

  const [columnName, setcolumnName] = useState(null);

  const [updateSchemaReq, updateSchemaRes] = useMutation(
    UPDATE_RESOURCE_SCHEMA
  );

  const updateSchemaFields = (index) => {
    const updatedSchemaFields = [...schemaFields];
    setIsArrayItem(true);

    // * To update the input array with array field if format selected is array

    updatedSchemaFields.splice(index + 4, 0, {
      type: 'select',
      id: 5,
      value: '',
      name: 'array_field',
      placeholder: 'Array Item',
      jsonOptions: { data: [] },
      arrayOptions: { data: arrayItems },
    });
    setschemaFields(updatedSchemaFields);
  };

  const updateJSONFilters = (index, e) => {
    if (e.target.name === 'parent') {
      const data = [...schemaFields];
      const filteredJSONValues = selectedJsonTypes.filter(
        (o) => o !== data[index - 4]['value']
      );
      data[index]['jsonOptions']['data'] = filteredJSONValues;
      setschemaFields(data);
    }
  };

  const updateArrayItems = (index, e) => {
    if (e.target.name === 'array_field') {
      const data = [...schemaFields];
      const filteredArrayValues = arrayItems.filter(
        (o) => o !== data[index - 5]['value']
      );
      data[index]['arrayOptions']['data'] = filteredArrayValues;
      setschemaFields(data);
    }
  };

  const handleColumnName = (index, e) => {
    if (e.target.name === 'key') {
      setcolumnName(e.target.value);
    }
    handleFormChange(index, e);
  };
  const dispatch = useDispatch();
  const submitDataRequest = (resource) => {
    const resourceObj = Object.assign({}, resource);
    delete resourceObj?.issued;
    delete resourceObj?.datarequest_set;
    delete resourceObj?.modified;

    const schemaValues = [];

    const schemaFieldLength = isArrayItem ? 4 : 3;

    for (let i = 0; i < schemaFields.length - schemaFieldLength; i++) {
      schemaValues.push({
        key: schemaFields[i].hasOwnProperty('key')
          ? schemaFields[i]['key']
          : '',
        display_name: schemaFields[i + 1].hasOwnProperty('display_name')
          ? schemaFields[i + 1]['display_name']
          : '',
        format: schemaFields[i + 2].hasOwnProperty('format')
          ? schemaFields[i + 2]['format']
          : '',
        description: schemaFields[i + 3].hasOwnProperty('description')
          ? schemaFields[i + 3]['description']
          : '',
        parent: schemaFields[i + 4]?.hasOwnProperty('parent')
          ? schemaFields[i + 4]['parent']
          : '',
        ...(isArrayItem && {
          array_field: schemaFields[i + 5]?.hasOwnProperty('array_field')
            ? schemaFields[i + 5]['array_field']
            : '',
        }),
        path: schemaFields[i + 6]?.hasOwnProperty('path')
          ? schemaFields[i + 6]['path']
          : '',
        parent_path: schemaFields[i + 7]?.hasOwnProperty('parent_path')
          ? schemaFields[i + 7]['parent_path']
          : '',
      });
    }

    const results = schemaValues.filter((o) => o.key !== '');

    const mutationVariables = {
      resource_data: {
        id: resourceObj.id,
        schema: results,
      },
    };

    mutation(updateSchemaReq, updateSchemaRes, mutationVariables)
      .then((res) => {
        if (res.update_schema.success === true) {
          toast.success('Schema added successfully');
          let temp_data = { ...datasetStore };

          const res_set = temp_data.resource_set.map(function (item) {
            if (item.id === res.update_schema.resource.id) {
              return { ...item, schema: res.update_schema.resource.schema };
            } else {
              return item;
            }
          });

          updateStore();
          modalHandler();
          setFormChanged(false);

          // setSelectedStep('data-access-model');
        }
        // setSelectedStep('data-access-model');
      })
      .catch(() => toast.error('Failed to add schema'));
    modalHandler();
  };

  const handleFormChange = (index, event) => {
    const data = [...schemaFields];
    data[index][event.target.name] = event.target.value;
    data[index]['value'] = event.target.value;
    setschemaFields(data);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  function modalHandler() {
    setIsModalOpen(!isModalOpen);
  }

  const [isValid, setIsValid] = useState(false);

  const handleForm = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setIsValid(true);
    modalHandler();
  };
  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <Wrapper>
          <div className="addmask_schema">
            <h3> Schema Details&#42;</h3>
            <div className="schemadata">
              <div className="headers">
                {schemaHeaders.map((item) => (
                  <p key={item.id}>{item.name}</p>
                ))}
              </div>
              <hr></hr>
              <form onSubmit={(e) => handleForm(e)} className="schemadetails">
                <div className="data" key={dummyvar.toString()}>
                  {schemaFields.map((item, index) => (
                    <>
                      {item.name !== 'path' && item.name !== 'parent_path' && (
                        <label
                          // style={{
                          //   gridColumn: item?.name === 'array_field' && '1/4',
                          // }}
                          key={index}
                        >
                          {item.type !== 'select' ? (
                            <input
                              type={item.type}
                              name={item.name}
                              // value={item.value}
                              defaultValue={item.value}
                              maxLength={item.placeholder === 'key' ? 200 : 500}
                              placeholder={item.placeholder}
                              required={item?.required}
                              disabled={item.name === 'key'}
                              onChange={(e) => {
                                setFormChanged(true);
                                handleColumnName(index, e);
                              }}
                            />
                          ) : item.name !== 'array_field' ? (
                            <select
                              id={item.name}
                              name={item.name}
                              placeholder={item.placeholder}
                              disabled
                              onFocus={(e) => updateJSONFilters(index, e)}
                              onChange={(e) => {
                                setFormChanged(true);
                                handleTypeChange(index, e);
                              }}
                              required={item?.required}
                            >
                              {item.name === 'format' ? (
                                <>
                                  <option
                                    value=""
                                    defaultValue={item.value}
                                    selected
                                    disabled
                                    key={index}
                                  >
                                    {item.value !== ''
                                      ? item.value
                                      : 'Choose type'}
                                  </option>
                                  {schemaTypes.map((type, index) => (
                                    <option key={index} value={type.id}>
                                      {type.name}
                                    </option>
                                  ))}
                                </>
                              ) : (
                                <>
                                  {!item.value && (
                                    <option disabled selected>
                                      Choose Parent
                                    </option>
                                  )}
                                  {item?.jsonOptions?.data?.map(
                                    (jsonOption, index) => (
                                      <>
                                        <option
                                          value={jsonOption.toString()}
                                          selected={
                                            item.value === jsonOption.toString()
                                          }
                                        >
                                          {jsonOption}
                                        </option>
                                      </>
                                    )
                                  )}
                                </>
                              )}
                            </select>
                          ) : (
                            <>
                              <select
                                // style={{ width: '25%' }}
                                id={item.name}
                                name={item.name}
                                key={index}
                                disabled
                                placeholder={item.placeholder}
                                onFocus={(e) => updateArrayItems(index, e)}
                                onChange={(e) => {
                                  setFormChanged(true);
                                  handleFormChange(index, e);
                                }}
                              >
                                <>
                                  {!item.value && (
                                    <option disabled selected>
                                      Choose Parent
                                    </option>
                                  )}
                                  {item?.arrayOptions?.data.length === 0 && (
                                    <option disabled selected>
                                      NA
                                    </option>
                                  )}
                                  {item?.arrayOptions?.data.length !== 0 &&
                                    item?.arrayOptions?.data?.map(
                                      (arrayItem, arrayIndex) => (
                                        <>
                                          <option
                                            value={arrayItem.toString()}
                                            selected={
                                              item.value ===
                                              arrayItem.toString()
                                            }
                                          >
                                            {arrayItem}
                                          </option>
                                        </>
                                      )
                                    )}
                                </>
                              </select>
                            </>
                          )}
                        </label>
                      )}
                      {item.id == 5 ? (
                        <>
                          <DeleteSchemaModal
                            index={index}
                            handleDelete={handleDelete}
                            setFormChanged={setFormChanged}
                            setIsLoading={setIsLoading}
                            type={'json'}
                          />
                          {/* <Button
                            kind="custom"
                            icon={<Delete />}
                            id={((index + 1) / 5).toString()}
                            onPress={(e) => {
                              setFormChanged(true);
                              setIsLoading(true);
                              handleDelete(e).then(() => {
                                setTimeout(() => {
                                  setIsLoading(false);
                                }, 10);
                              });
                            } } /> */}
                        </>
                      ) : (
                        ''
                      )}
                    </>
                  ))}
                </div>
                {enableAdd === 'no' && (
                  <Button
                    kind="primary-outline"
                    onPress={() => {
                      setFormChanged(true);
                      addSchemaFields();
                    }}
                  >
                    Add
                  </Button>
                )}
                <Button
                  className="submit-button"
                  type="submit"
                  kind="primary-outline"
                >
                  Save Schema
                </Button>
              </form>
              {isValid && <SaveSchemaModel />}
            </div>
          </div>
        </Wrapper>
      )}
    </>
  );
  function SaveSchemaModel({}) {
    return (
      <>
        <Modal
          isOpen={isModalOpen}
          modalHandler={() => modalHandler()}
          label="Add API Source"
        >
          <SchemaWrapper>
            <ModalHeader>
              <div>
                <Heading as="h2" variant="h3">
                  Save Schema
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
              padding={'24px'}
              fontWeight="400"
            >
              Are you sure you want to Save the Schema
            </Heading>
            <Line />
            <Flex padding={'16px'} gap={'10px'} justifyContent="flex-end">
              <Button
                kind="primary-outline"
                onPress={() => setIsModalOpen(!isModalOpen)}
              >
                No, Cancel
              </Button>
              <Button
                kind="primary-outline"
                onPress={() => submitDataRequest(resource)}
              >
                {' '}
                Save Schema
              </Button>
            </Flex>
          </SchemaWrapper>
        </Modal>
      </>
    );
  }
};

export default JSONSchema;

const SchemaWrapper = styled.section`
  background-color: var(--color-background-lightest);
  max-height: 90vh;
  min-width: 629px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
`;
const Line = styled.div`
  border: 1px solid var(--color-gray-01);
  margin-inline: 20px;
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
const Wrapper = styled.div`
  .addmask_schema {
    background-color: var(--color-background-lightest);
    padding: 16px;
    .maskingdata {
      margin-bottom: 1rem;
      margin-top: 10px;
      .select__input {
        box-shadow: none;
        min-height: 4px;
      }
      input:focus-visible {
        outline: 0px solid var(--color-white) !important;
        opacity: 0;
      }
      .basic-multi-select {
        width: 100%;
        margin-top: 5px;
      }
      .select__multi-value__label {
        font-weight: 700;
      }
    }
    .schemadata {
      display: block;
      width: 100%;
      margin-top: 10px;
      .headers {
        display: flex;
        p {
          width: 100%;
          padding-inline: 10px;
        }
      }
      .schemadetails {
        display: block;

        .submit-button {
          margin: 0 0 0 auto;
        }

        svg {
          margin-top: 1rem;
        }

        .data {
          gap: 1rem;
          margin-bottom: 10px;
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          width: 100%;
        }
        label {
          width: 100%;
        }
        input,
        select {
          background-color: var(--color-white);
          border: none;
          box-shadow: 0 0 2px black;
          line-height: 2;
          height: 40px;
          border-radius: 5px;
          padding: 0 10px;
          margin-top: 4px;
          font-weight: 400;
          width: 100%;
        }
        select option:disabled {
          display: none;
        }
      }
    }
  }
`;
