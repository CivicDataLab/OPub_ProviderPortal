import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'components/actions';
import { RootState } from 'Store';
import { useSelector } from 'react-redux';
import {
  GET_RESOURCE_COLUMNS,
  mutation,
  UPDATE_RESOURCE_SCHEMA,
} from 'services';
import { useMutation, useQuery } from '@apollo/client';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { NextWrapper } from 'components/pages/providers/CreationFlow';
import { fetchapischema } from 'utils/fetch';
import { Loader } from 'components/common';
import { AddCircle, Delete } from '@opub-icons/workflow';
import { CrossSize300 } from '@opub-icons/ui';
import { Heading } from 'components/layouts';
import { Flex } from 'components/layouts/FlexWrapper';
import DeleteSchemaModal from './DeleteSchemaModal';
import { useSession } from 'next-auth/react';
import { useProviderStore } from 'services/store';

const CSVSchema = ({ item, updateStore, setFormChanged }) => {
  const datasetStore = useSelector((state: RootState) => state.addDataset);
  const [addSchemaReq, addSchemaRes] = useMutation(UPDATE_RESOURCE_SCHEMA);

  const FormatTypes = [
    {
      id: 'string',
      name: 'String',
    },
    {
      id: 'integer',
      name: 'Integer',
    },
    {
      id: 'boolean',
      name: 'Boolean',
    },
    {
      id: 'datetime',
      name: 'Date',
    },
    {
      id: 'number',
      name: 'Decimal',
    },
  ];
  const [resourceIdForSchema, setResourceIdForSchema] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  const getResourceColumnsRes = useQuery(GET_RESOURCE_COLUMNS, {
    variables: {
      resource_id: resourceIdForSchema,
    },
    skip: !resourceIdForSchema,
  });

  const [dataLocalSchema, setDataLocalSchema] = useState([
    {
      filterable: true,
      key: '',
      display_name: '',
      description: '',
      format: '',
    },
  ]);

  const [dataSchemaList, setData] = useState([
    {
      name: '',
      display_name: '',
      description: '',
      format: '',
    },
  ]);

  const [enableAdd, setEnableAdd] = useState('no');

  useEffect(() => {
    setIsLoading(true);

    if (item?.schema?.length > 0) {
      setIsLoading(false);
      setEnableAdd('yes');

      setResourceIdForSchema(null);
      setDataLocalSchema(
        item.schema.map((item) => {
          return {
            filterable: item.filterable,
            key: item.key,
            display_name: item.display_name,
            description: item.description,
            format: item.format,
          };
        })
      );
    } else {
      if (item?.file_details) {
        setResourceIdForSchema(item.id);
        if (!getResourceColumnsRes.loading && !getResourceColumnsRes.error) {
          setIsLoading(false);
          if (getResourceColumnsRes.data?.resource_columns) {
            try {
              let newSchema = getResourceColumnsRes.data.resource_columns.map(
                (item) =>
                  JSON.parse(item.replaceAll(`'`, `*`).replaceAll(`*`, `"`))
              );
              if (newSchema.length > 0) {
                setEnableAdd('yes');
                setDataLocalSchema([
                  ...newSchema.map((item) => {
                    return {
                      filterable: true,
                      key: item.key,
                      description: '',
                      format: item.format,
                      display_name: item.display_name,
                    };
                  }),
                ]);
              }
            } catch (error) {
              toast.error('Failed ' + error);
            }
          }
        }
      }
    }
  }, [getResourceColumnsRes.data]);

  const { data: session } = useSession();
  const currentOrgRole = useProviderStore((e) => e.org);

  useEffect(() => {
    if (item?.api_details?.response_type === 'CSV') {
      setIsLoading(true);
      if (item?.schema?.length > 0) {
        setIsLoading(false);
        setEnableAdd('yes');

        setData(
          item.schema.map((item) => {
            return {
              name: item.key,
              description: item.description,
              format: item.format,
              display_name: item.display_name,
            };
          })
        );
      } else {
        setIsLoading(true);
        fetchapischema(item.id, session, currentOrgRole?.org_id)
          .then((data) => {
            if (data?.schema?.length > 0) {
              setEnableAdd('yes');
              // const fetchSchema = data.schema.slice(1);
              const fetchSchema = data.schema;
              setIsLoading(false);
              setData(
                fetchSchema.map((item) => {
                  return {
                    name: item.key,
                    description: '',
                    format: item.format,
                    display_name: item.key,
                  };
                })
              );
            }
          })
          .catch(() => {
            setIsLoading(false);
          });
      }
    }
  }, []);

  const handleSchemaFilterable = (e, index) => {
    const newArr = [...dataLocalSchema];
    newArr[index].filterable = e.target.checked;
    setDataLocalSchema(newArr);
  };

  const handleSchemaDisplayname = (e, index) => {
    const newArr = [...dataLocalSchema];
    newArr[index].display_name = e.target.value;
    setDataLocalSchema(newArr);
  };

  const handleSchemadesc = (e, index) => {
    const newArr = [...dataLocalSchema];
    newArr[index].description = e.target.value;
    setDataLocalSchema(newArr);
  };

  const handleType = (e, index) => {
    const newArr = [...dataLocalSchema];
    newArr[index].format = e.target.value;

    setDataLocalSchema(newArr);
  };

  const handleSchemaAdd = () => {
    setDataLocalSchema((schema) => {
      return [
        ...schema,
        {
          filterable: true,
          key: '',
          display_name: '',
          description: '',
          format: 'string',
        },
      ];
    });
  };

  const handleSchemaRemove = (index) => {
    //const List = [...schemaList];
    let newArr = [...dataLocalSchema];
    newArr.splice(index, 1);
    setDataLocalSchema(newArr);
    //setSchemaList(List);
  };

  const handlenewSchemaname = (e, index) => {
    let newArr = [...dataSchemaList];
    newArr[index].name = e.target.value;
    setData(newArr);
  };

  const handlenewSchemaDisplayname = (e, index) => {
    let newArr = [...dataSchemaList];
    newArr[index].display_name = e.target.value;
    setData(newArr);
  };

  const handlenewSchemadesc = (e, index) => {
    let newArr = [...dataSchemaList];
    newArr[index].description = e.target.value;
    setData(newArr);
  };
  const handlenewType = (e, index) => {
    let newArr = [...dataSchemaList];
    newArr[index].format = e.target.value;

    setData(newArr);
  };

  const handlenewSchemaAdd = () => {
    setData((schema) => {
      return [
        ...schema,
        {
          name: '',
          display_name: '',
          description: '',
          format: 'string',
        },
      ];
    });
  };

  const handlenewSchemaRemove = (index) => {
    //const List = [...schemaList];
    let newArr = [...dataSchemaList];
    newArr.splice(index, 1);
    setData(newArr);
    //setSchemaList(List);
  };

  const resourceSchemaToServer = (item) => {
    const resourceObj = Object.assign({}, item);
    delete resourceObj?.issued;
    delete resourceObj?.datarequest_set;
    delete resourceObj?.modified;

    const fileBasedSchema = [
      ...dataLocalSchema.map((item) => {
        return {
          description: item.description,
          format: item.format,
          display_name: item.display_name,
          key: item.key.length > 0 ? item.key : item.display_name,
          filterable: item.filterable,
        };
      }),
    ];

    const ApiSchema = [
      ...dataSchemaList.map((item) => {
        return {
          description: item.description,
          format: item.format,
          display_name: item.display_name,
          key: item.name.length > 0 ? item.name : item.display_name,
        };
      }),
    ];

    const value =
      item?.file_details?.format === 'CSV' ||
      item?.file_details?.format === 'PDF'
        ? fileBasedSchema
        : ApiSchema;

    mutation(addSchemaReq, addSchemaRes, {
      resource_data: {
        id: resourceObj.id,
        schema: value,
      },
    })
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
      })
      .catch(() => {
        toast.error('Failed to add schema');
      });
    modalHandler();
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
      <h3> Schema Details</h3>{' '}
      <Wrapper>
        <Header>
          {datasetStore.dataset_type === 'FILE' && <td>Exposed Parameter</td>}
          <td>Column Key</td>
          <td>Display Name</td>
          <td>Description</td>
          <td>Format</td>
          {dataLocalSchema.length > 0 && <td></td>}
        </Header>
        <hr></hr>

        <form onSubmit={(e) => handleForm(e)}>
          <div className="schemadetails">
            {isLoading ? (
              <Loader />
            ) : (
              <>
                {' '}
                {item?.file_details?.format === 'CSV' ||
                item?.file_details?.format === 'PDF' ? (
                  <>
                    {dataLocalSchema.map((singleSchema, index) => (
                      <>
                        <div className="fields" key={index}>
                          <label className="checkbox">
                            <input
                              type="checkbox"
                              checked={singleSchema.filterable}
                              onChange={(e) => handleSchemaFilterable(e, index)}
                            />
                          </label>
                          <label className="name">
                            <input
                              type="text"
                              placeholder="Column Key"
                              maxLength={100}
                              value={singleSchema.key}
                              // onChange={(e) => handleSchemaname(e, index)}
                              disabled
                            />
                          </label>
                          <label className="name">
                            <input
                              type="text"
                              placeholder="Display Name"
                              maxLength={100}
                              value={singleSchema.display_name}
                              onChange={(e) => {
                                setFormChanged(true);
                                handleSchemaDisplayname(e, index);
                              }}
                              required
                            />
                          </label>
                          <label className="description">
                            <textarea
                              placeholder="Description"
                              id="message"
                              maxLength={500}
                              value={singleSchema.description}
                              onChange={(e) => {
                                setFormChanged(true);
                                handleSchemadesc(e, index);
                              }}
                            />
                          </label>
                          <label className="format">
                            <select
                              value={singleSchema.format}
                              placeholder="Format"
                              required
                              onChange={(e) => {
                                setFormChanged(true);
                                handleType(e, index);
                              }}
                            >
                              <>
                                <option value={''} selected disabled>
                                  Select Format
                                </option>
                                {FormatTypes.map((type) => (
                                  <option key={index} value={type.id}>
                                    {type.name}
                                  </option>
                                ))}
                              </>
                            </select>
                          </label>

                          {dataLocalSchema.length > 1 && (
                            // <Button
                            //   className="remove"
                            //   size="sm"
                            //   kind="custom"
                            //   icon={<Delete />}
                            //   onPress={() => {
                            //     setFormChanged(true);
                            //     handleSchemaRemove(index);
                            //   }}
                            // />
                            <DeleteSchemaModal
                              index={index}
                              handleDelete={handleSchemaRemove}
                              setFormChanged={setFormChanged}
                              setIsLoading={setIsLoading}
                              type={'csv'}
                            />
                          )}
                        </div>
                        {enableAdd === 'no' && (
                          <div className="flow">
                            {dataLocalSchema.length - 1 === index && (
                              <Button
                                kind="custom"
                                onPress={() => {
                                  setFormChanged(true);
                                  handleSchemaAdd();
                                }}
                                icon={<AddCircle />}
                              />
                            )}
                          </div>
                        )}
                      </>
                    ))}
                  </>
                ) : (
                  <>
                    {dataSchemaList.map((singleSchema, index) => (
                      <>
                        <div className="fields" key={index}>
                          <label className="name">
                            <input
                              type="text"
                              placeholder="Column Key"
                              maxLength={100}
                              value={singleSchema.name}
                              // onChange={(e) => handlenewSchemaname(e, index)}
                              disabled
                            />
                          </label>
                          <label className="name">
                            <input
                              type="text"
                              placeholder="Display Name"
                              maxLength={100}
                              value={singleSchema.display_name}
                              onChange={(e) => {
                                setFormChanged(true);
                                handlenewSchemaDisplayname(e, index);
                              }}
                              required
                            />
                          </label>
                          <label className="description">
                            <textarea
                              placeholder="Description"
                              id="message"
                              maxLength={500}
                              value={singleSchema.description}
                              onChange={(e) => {
                                setFormChanged(true);
                                handlenewSchemadesc(e, index);
                              }}
                            />
                          </label>
                          <label className="format">
                            <select
                              value={singleSchema.format}
                              placeholder="Format"
                              required
                              onChange={(e) => {
                                setFormChanged(true);
                                handlenewType(e, index);
                              }}
                            >
                              <>
                                <option value={''} selected disabled>
                                  Select Format
                                </option>
                                {FormatTypes.map((type) => (
                                  <option key={index} value={type.id}>
                                    {type.name}
                                  </option>
                                ))}
                              </>
                            </select>
                          </label>

                          {dataSchemaList.length > 1 && (
                            <Button
                              className="remove"
                              size="sm"
                              kind="custom"
                              icon={<Delete />}
                              onPress={() => {
                                setFormChanged(true);
                                handlenewSchemaRemove(index);
                              }}
                            />
                          )}
                        </div>
                        {enableAdd === 'no' && (
                          <div className="flow">
                            {dataSchemaList.length - 1 === index && (
                              <Button
                                kind="custom"
                                onPress={() => {
                                  setFormChanged(true);
                                  handlenewSchemaAdd();
                                }}
                                icon={<AddCircle />}
                              />
                            )}
                          </div>
                        )}
                      </>
                    ))}
                  </>
                )}
              </>
            )}
          </div>
          <NextWrapper>
            <Button kind="primary-outline" size="sm" type="submit">
              Save Schema
            </Button>
          </NextWrapper>
        </form>
        {isValid && <SaveSchemaModel />}
      </Wrapper>
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
                onPress={() => resourceSchemaToServer(item)}
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
export default CSVSchema;

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
const Wrapper = styled.section`
  margin-top: 10px;
  > div {
    display: flex;
  }

  .schemadetails {
    .fields {
      display: flex;
      margin: 10px 0;
      align-items: center;
      label:first-child {
        flex: 0.3;
      }
      .checkbox {
        input {
          box-shadow: none;
        }
      }
    }
    label {
      margin-left: 10px;
    }
    .flow {
      display: flex;
      margin-top: 10px;
      margin-bottom: 10px;
      justify-content: space-between;
    }
    input,
    textarea,
    select {
      background-color: var(--color-white);
      border: none;
      box-shadow: 0 0 2px black;
      line-height: 2;
      min-height: 40px;
      margin: auto;
      border-radius: 5px;
      padding: 0 10px;
      font-weight: 600;
    }

    button {
      padding: 5px 10px;
      margin-left: 10px;
    }
    .remove {
      height: fit-content;
      margin-top: 8px;
    }
    .name {
      flex: 1.2;
      input {
        min-height: 50px;
        width: 100%;
      }
    }
    .description {
      flex: 2;
      textarea {
        width: 100%;
        height: 50px;
        resize: none;
      }
    }
    .format {
      flex: 1;
      select {
        min-height: 50px;
        width: 100%;
      }
    }
  }
  .managecolumns {
    margin: 1rem 0;
    padding: 10px;
    background-color: var(--color-background-alt-light);
    .select__input {
      box-shadow: none;
      min-height: 4px;
    }
    input:focus-visible {
      outline: 0px solid var(--color-white) !important;
    }
  }
`;

const Form = styled.form`
  > div {
    display: flex;
    gap: 10px;
    margin: 20px 0;
    > div {
      width: 100%;
      > div > label {
        padding: 0px;
      }
    }
  }
`;
const Header = styled.div`
  width: 100%;
  justify-content: space-between;
  td:first-child {
    flex: 0.4;
  }
  td:nth-child(2) {
    flex: 1;
  }
  td:nth-child(3) {
    flex: 1;
  }
  td:nth-child(4) {
    flex: 1.7;
  }

  td:nth-child(5) {
    flex: 1;
  }
`;

const SelectWrapper = styled.div``;
