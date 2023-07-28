import React, { useEffect, useRef, useState } from 'react';
import { Button } from 'components/actions';
import styled from 'styled-components';
import { fetchTransformersList } from 'utils/fetch';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Add from 'components/icons/Add';
import Delete from 'components/icons/Delete';
import { useDispatch, useSelector } from 'react-redux';
import { gql, useQuery } from '@apollo/client';
import { RootState } from 'Store';
import { updateDataset } from 'slices/addDatasetSlice';
import { ArrowDown } from 'components/icons';

type Props = {
  variables: any;
  transformerslist: any;
};

const ResourceTransform = ({
  transformerslist,
  pipelineName,
  setPipelineName,
  setDatabaseAction,
  databaseAction,
  setTransform,
  transformList,
  selected,
  setSelected,
}) => {
  const finalData = {
    name: '',
    id: '',
    db_action: '',
    transformers_list: [],
  };

  const datasetStore = useSelector((state: RootState) => state.addDataset);
  // const [selected, setSelected] = useState('');
  //const [pipelineName, setPipelineName] = useState('');
  // const [databaseAction, setDatabaseAction] = useState('Create');
  // const [isDisabled, setIsDisabled] = useState(false);
  const [transformData, setTransformData] = useState(finalData);
  // const [transformList, setTransform] = useState([
  //   { name: 'pipeline__transformation' },
  // ]);

  const transformers = transformerslist.result;
  const nameForm = useRef(null);

  const handleServiceAdd = () => {
    setTransform([...transformList, { name: 'pipeline__transformation' }]);
  };

  const handleServiceRemove = (index: any) => {
    const List = [...transformList];

    if (List.length <= 1) {
      alert('Atleast one transformer required!');
      alert('Select atleast 1 transformer');
    } else {
      List.splice(index, 1);
      setTransform(List);
    }
  };

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

  const handletransformerfill = (e: any, index: any) => {
    // 1. Make a shallow copy of the item
    const items = [...transformList];

    // 2. Make a shallow copy of the item you want to mutate
    const item: any = { ...items[index] };

    // 3. Replace the property you're intested in
    item['context'] = {
      ...item['context'],
      [e.target.id]:
        item.name == 'skip_column' ? e.target.value.split(',') : e.target.value,
    };

    // 4. Put it back into our array. N.B. we *are* mutating the array here, but that's why we made a copy first
    items[index] = item;

    // 5. Set the state to our new copy
    setTransform(items);
  };

  // const handleSubmit = (index) => {
  //   const form: any = nameForm.current;
  //   const postData: any = {
  //     pipeline_name: pipelineName,
  //     db_action: databaseAction,
  //     res_id: selected,
  //     transformers_list: transformList,
  //   };

  //

  //   if (postData.transformers_list[0].name == 'pipeline__transformation') {
  //     alert('Select atleast 1 transformer');
  //   } else {
  //     submitData(`${post_url}/transformer/res_transform`, postData);
  //   }
  //   async function submitData(url: any, data: any) {
  //     await fetch(url, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(data),
  //     }).then((res) => {
  //       if (res.status == 200) {
  //         alert('Pipeline Created');
  //         //  setTransformData([...transformData, finalData]);
  //       } else {
  //         alert('Error while creating Pipeline');
  //       }
  //     });
  //   }
  // };

  // post data to server

  function humanize(str: any) {
    let i,
      frags = str.split('_');
    for (i = 0; i < frags.length; i++) {
      frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1);
    }
    return frags.join(' ');
  }

  const handleResourceSelection = (e) => {
    setSelected(e.target.value);
    // let newArr = [...transformData];
    // newArr[index].id = e.target.value;
    // setTransformData(newArr);
  };

  const handlePipelineName = (e) => {
    setPipelineName(e.target.value);
    // let newArr = [...transformData];
    // newArr[index].name = e.target.value;
    // setTransformData(newArr);
  };
  const handledbAction = (e) => {
    setDatabaseAction(e.target.value);
    // let newArr = [...transformData];
    // newArr[index].db_action = e.target.value;
    // setTransformData(newArr);
  };
  // const removeResourceTransform = (index) => {
  //   //const List = [...schemaList];
  //   let newArr = [...transformData];
  //   newArr.splice(index, 1);
  //   setTransformData(newArr);
  //
  //   //setSchemaList(List);
  // };

  return (
    <Resourcetransform>
      <form id="main" ref={nameForm}>
        <div className="wrapper pipeline">
          <div className="resourceselction">
            <label>
              <span>Name</span>
              <input
                type="text"
                id="name"
                value={selected.name}
                maxLength={100}
                onChange={(e) => handlePipelineName(e)}
              />
            </label>
            <label>
              <span>Select the resource to Transform&#42;</span>

              <select
                //onChange={(e) => setSelected(e.target.value)}
                value={selected.id}
                // disabled={isDisabled}
                onChange={(e) => handleResourceSelection(e)}
                //value={singleSchema.name}
              >
                {datasetStore.resource_set.map((dataStoreItem, index) => (
                  <>
                    <option key={index} value={dataStoreItem.id.toString()}>
                      {dataStoreItem.title}
                    </option>
                  </>
                ))}
              </select>
            </label>
            <div className="radio">
              <label>
                <span>Database Action</span>
              </label>

              <input
                type="radio"
                name="value"
                value="create"
                defaultChecked
                onChange={(e) => handledbAction(e)}
              />
              <p>Create</p>
              <input
                type="radio"
                name="value"
                value="update"
                onChange={(e) => handledbAction(e)}
              />
              <p>Update</p>
            </div>
          </div>

          <div className="view">
            <div className="pipeline__transformation">
              <div className="transform">
                <div className="addstep">
                  <h3>Transform</h3>

                  {transformList.map((singleTransform, index) => (
                    <div className="addmore" key={index}>
                      {transformList.length - 1 === index && (
                        <Button
                          size="sm"
                          onPress={handleServiceAdd}
                          kind="primary-outline"
                          icon={<Add />}
                        >
                          Add More
                        </Button>
                      )}
                    </div>
                  ))}
                </div>

                {transformList.map((singleTransform, index) => (
                  <>
                    <hr></hr>
                    <div key={index} className="transform__item">
                      <div className="transform__selector">
                        <label htmlFor="transform_1">
                          <span>Select Transformer&#42;</span>
                          <select
                            name="transform_1"
                            id="transform_1"
                            className="transform__select"
                            value={transformList[index].name}
                            defaultValue={transformList[0].name}
                            onChange={(e) =>
                              handletransformerselect(e.target.value, index)
                            }
                          >
                            <option value="" hidden>
                              Select Transformer
                            </option>
                            {transformers.map(
                              (transformer: any, index: any) => (
                                <option
                                  value={transformer.name}
                                  defaultValue={transformer.name[0]}
                                  key={index}
                                >
                                  {humanize(transformer.name)}
                                </option>
                              )
                            )}
                          </select>
                        </label>
                        <div
                          className="transform__remove"
                          onClick={() => handleServiceRemove(index)}
                        >
                          <Delete />
                        </div>
                      </div>

                      <div id="transform_data_1" className="transform__data">
                        {transformers.filter(
                          (x: { name: string }) =>
                            x.name == transformList[index].name
                        ).length > 0 &&
                          transformers
                            .filter(
                              (x: { name: string }) =>
                                x.name == transformList[index].name
                            )[0]
                            .context.map((input: any, index1: any) => (
                              <input
                                onChange={(e) =>
                                  handletransformerfill(e, index)
                                }
                                maxLength={100}
                                id={input.name}
                                type={input.type}
                                key={index1}
                                name={input.name}
                                placeholder={input.desc}
                                required
                              />
                            ))}
                      </div>
                    </div>
                  </>
                ))}
              </div>
            </div>
            {/* 
                {transformData.length > 1 && (
                  <Button
                    onClick={removeResourceTransform}
                    icon={<Delete />}
                    size="sm"
                    kind="primary-outline"
                  >
                    Remove Resource
                  </Button>
                )} */}
          </div>
        </div>
      </form>
    </Resourcetransform>
  );
};

export default ResourceTransform;

const Resourcetransform = styled.section`
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
    background-color: var(--color-background-alt-dark);
    padding: 1rem;
    label {
      display: flex;
      width: 100%;
      flex-wrap: wrap;
      margin-bottom: 1rem;
      margin-top: 10px;
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
    .radio {
      display: flex;
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
    display: grid;
    min-height: 25rem;
    grid-template-rows: repeat(3, max-content) 1fr max-content;
    gap: 0.5rem;
    &__source {
      display: contents;
      /* flex-wrap: wrap; */
      gap: 0.5rem;
      align-items: center;
      margin: 1rem 0 2rem;

      input {
        height: 1.8rem;
        margin-top: 4px;
        width: 100%;
        background-color: var(--color-white);
        border: none;
        box-shadow: 0 0 2px black;
        line-height: 2;
        border-radius: 5px;
        padding: 0 10px;
        font-weight: 600;
        width: 100%;
        min-height: 50px;

        /* @media (min-width: 769px) {
          width: calc(100% - 105px);
        } */
      }
    }
    &__org_name {
      input {
        height: 1.8rem;
        width: 100%;
        padding: 0.5rem;
        @media (min-width: 769px) {
          width: calc(97% - 135px);
        }
      }
    }
    /* &__name {
     margin: 1rem 0; 
      input {
        @media (min-width: 769px) {
          width: calc(100% - 65px);
        }
      }
    } */

    &__status {
      font-size: 0.8rem;

      &--true {
        color: green;
      }

      &--false {
        color: #ff605c;
        overflow-y: auto;
      }
    }

    &__transformation {
      margin-bottom: 1rem;
      overflow-y: auto;
    }

    &__title {
      margin: 1rem 0 0.3rem;
      display: block;
    }
    .view {
      overflow-y: auto;
      background-color: var(--color-background-alt-light);
      padding: 0.5rem 1rem;
    }
    .transform {
      margin-top: 1rem;
      &__selector {
        display: flex;
        label {
          width: 100%;
        }
      }
      &__select {
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

      &__item {
        min-height: 120px;
        display: flex;
        -webkit-flex-direction: column;
        -ms-flex-direction: column;
        flex-direction: column;
        /* border: 1px solid #bdbdbd; */
        padding: 1rem 0.1rem;
        margin-bottom: 1.5rem;
        /* gap: 1rem; */
        position: relative;
        /* background-color: #ffffff; */
        /* line-height: 2; */
        border-radius: 5px;
      }

      &__remove {
        margin-top: 2rem;
        padding-left: 10px;
      }

      &__enabler {
        position: absolute;
        right: 0.5rem;
        top: 4rem;
        font-size: 0.8rem;

        @media (min-width: 585px) {
          right: 4rem;
          top: 0.5rem;
        }
      }

      &__new {
        padding: 0.6rem 0.9rem;
        align-self: center;
        background: #4e74a1;
        align-self: flex-end;
        margin: -2rem auto 0;
        position: absolute;
        bottom: -1rem;
        left: 50%;
        transform: translateX(-50%);
      }

      &__data {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        margin: 1rem 0;

        input {
          height: 2rem;
          margin-right: 1rem;

          /* padding: 0 0.5rem; */
          background-color: var(--color-white);
          border: none;
          box-shadow: 0 0 2px black;
          line-height: 2;
          border-radius: 5px;
          padding: 0 10px;
          min-height: 50px;
          min-width: 45%;
          font-weight: 600;
        }
      }
    }

    &__submit {
      width: 120px;
      align-self: flex-end;
      justify-self: flex-end;
    }
  }
`;
