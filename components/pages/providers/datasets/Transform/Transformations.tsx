import { useQuery } from '@apollo/client';
import { CrossSize300 } from '@opub-icons/ui';
import { Add, Close, Refresh, Visibility } from '@opub-icons/workflow';
import { Button, Modal } from 'components/actions';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from 'components/actions/Accordian/Accordian';
import { Loader } from 'components/common';
import { Table } from 'components/data/BasicTable';
import { Switch } from 'components/form';
import { Minus, Plus } from 'components/icons';
import { Heading } from 'components/layouts';
import { Flex } from 'components/layouts/FlexWrapper';
import { LinkButton } from 'components/pages/dashboard/helpers';
import React, { useEffect, useState } from 'react';
import JSONPretty from 'react-json-pretty';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { GET_RESOURCE_COLUMNS } from 'services';
import { RootState } from 'Store';
import styled from 'styled-components';
import { capitalizeFirstLetter } from 'utils/helper';
import { fetchapipreview } from 'utils/fetch';
import { prepareCSVPreviewForTable } from 'utils/helper';
import Aside from '../Aside';
import { Text } from 'components/layouts';
import { useSession } from 'next-auth/react';
import { useProviderStore } from 'services/store';

const Transformations = ({
  resourceData,
  transformerslist,
  selectedResource,
  setCurrentTab,
  pipelineId,
  isLoading,
  handleResourceRefresh,
  updateStore,
}) => {
  const datasetStore = useSelector((state: RootState) => state.addDataset);
  const { data: session } = useSession();

  const [currentAccordion, setCurrentAccordion] = useState();
  function addClass(status) {
    if (status.includes('Failed')) return 'failed';
    else return status.toLowerCase().replace(/ /g, '');
  }
  function tasks(str) {
    const formatStr = str.replace(/[{}''\[\]'_+]/g, ' ').split(',');
    return (
      <TransformationViewer>
        {formatStr.map((item) => (
          <span key={item[0]}>
            <strong>{item.split(':')[0]}: </strong>
            {item.split(':')[1]}
          </span>
        ))}
      </TransformationViewer>
    );
    // return str;
    return str.replace(/[{}''\[\]'_+]/g, ' ');
  }
  function humanize(str: any) {
    var i,
      frags = str.split('_');
    for (i = 0; i < frags.length; i++) {
      frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1);
    }
    return frags.join(' ');
  }

  const [transformList, setTransform] = useState([
    { name: 'pipeline__transformation' },
  ]);

  let resourceId = resourceData
    .filter((resouceItem) => resouceItem.pipeline_id === pipelineId)
    .map((item) => item.resultant_res_id);

  let distributionId = resourceData
    .filter((resouceItem) => resouceItem.pipeline_id === pipelineId)
    .map((item) => item.tasks.length);

  let distCol = resourceData
    .filter((resouceItem) => resouceItem.pipeline_id === pipelineId)
    .map((item) => item.resource_id);

  const TaskStatus = resourceData
    .filter((resouceItem) => resouceItem.pipeline_id === pipelineId)
    .map((item) => item.tasks.map((task) => task.status));

  let enable_add = true;

  let filetype = datasetStore?.resource_set
    .filter((item) => item.id === resourceId[0])
    .map((item) => item.file_details.format)
    .toString();

  const transformers =
    filetype === 'JSON'
      ? transformerslist.result.filter((item) => item.name !== 'aggregate')
      : transformerslist.result;

  TaskStatus[0]?.forEach((item) => {
    if (['Requested', 'Created', 'Inprogress'].includes(item)) {
      enable_add = false;
      return;
    }
  });

  // disable add step button after change format step
  const TaskName = resourceData
    .filter((resouceItem) => resouceItem.pipeline_id === pipelineId)
    .map((item) => item.tasks.map((task) => task.task_name));

  TaskName[0]?.forEach((item) => {
    if (['change_format_to_pdf'].includes(item)) {
      enable_add = false;
      return;
    }
  });
  useEffect(() => {
    updateStore();
  }, []);

  const TransformerDetails = resourceData
    .filter((item) => item.resultant_res_id === resourceId[0])
    .map((trans) => trans);

  return (
    <>
      <HeaderWrapper>
        <Heading as="h2" variant="h3">
          Steps of Transformation
        </Heading>
        <AddTransform title="Back to Add New Transformation">
          <LinkButton
            label="Back to Add New Transformation"
            type="back"
            onClick={() => setCurrentTab('list')}
          />
        </AddTransform>
      </HeaderWrapper>
      <Flex>
        {TransformerDetails.map((item) => (
          <>
            <Text paddingY={'20px'} key={item.pipeline_id}>
              <strong>Distribution Name: </strong>
              {datasetStore.resource_set.map((resourceItem) => {
                if (resourceItem.id === item.resultant_res_id) {
                  return resourceItem.title;
                }
              })}
              -({item.db_action})
            </Text>
          </>
        ))}
      </Flex>
      {distributionId[0] != 0 && (
        <PreviewButtons>
          <FilePreviewModal item={resourceId[0]} enable_add={enable_add} />
          <FileSchemaPreviewModal
            item={resourceId[0]}
            enable_add={enable_add}
            datasetStore={datasetStore}
            updateStore={updateStore}
          />
        </PreviewButtons>
      )}

      {resourceData
        .filter((resouceItem) => resouceItem.pipeline_id === pipelineId)
        .map((item) =>
          item.tasks.map(
            (task) =>
              task.status !== 'Done' &&
              task.status !== 'Failed' && (
                <Aside title={'Refresh to Update the Status'} />
              )
          )
        )}
      <Accordion
        type="single"
        collapsible
        onValueChange={(e: any) => setCurrentAccordion(e)}
      >
        {resourceData
          .filter((resouceItem) => resouceItem.pipeline_id === pipelineId)
          .map((item) =>
            item.tasks.map((task) => (
              <>
                <StyledTabItem key={task.task_id} value={task.task_id}>
                  <StyledTabTrigger isActive={isLoading}>
                    <div>
                      <Text variant="pt16b">{humanize(task.task_name)}</Text>
                      {task.status !== 'Done' && task.status !== 'Failed' && (
                        <Button
                          onPress={() => {
                            handleResourceRefresh();
                            updateStore();
                          }}
                          title="Refresh to See the status"
                          kind="custom"
                          icon={<Refresh />}
                          className="refresh"
                        />
                      )}
                    </div>
                    <div>
                      {' '}
                      <p className={`pipeline__${addClass(item?.status)}`}>
                        {task?.status}{' '}
                      </p>
                      {currentAccordion === task.task_id ? (
                        <Minus fill="var(--color-primary)" />
                      ) : (
                        <Plus fill="var(--color-primary)" />
                      )}
                    </div>
                  </StyledTabTrigger>

                  <StyledTabContent>
                    <div>{tasks(task.context)}</div>
                  </StyledTabContent>
                </StyledTabItem>
              </>
            ))
          )}
      </Accordion>

      <TransformationModal
        transformers={transformers}
        transformList={transformList}
        setTransform={setTransform}
        selectedResource={selectedResource}
        datasetStore={datasetStore}
        distCol={distCol}
        resourceId={resourceId}
        pipelineId={pipelineId}
        resourceData={resourceData}
        enable_add={enable_add}
        handleResourceRefresh={handleResourceRefresh}
        updateStore={updateStore}
        setCurrentTab={setCurrentTab}
        session={session}
      />
    </>
  );
};

export function FilePreviewModal({
  item,
  enable_add,
  distributionStatus = undefined,
}) {
  const datasetStore = useSelector((state: RootState) => state.addDataset);
  const [isModalOpen, setIsModalOpen] = useState(false);
  function modalHandler() {
    setIsModalOpen(!isModalOpen);
  }
  const [previewData, setPreviewData] = useState();
  const { data: session } = useSession();
  const currentOrgRole = useProviderStore((e) => e.org);

  const handlePreview = (e) => {
    modalHandler();
    fetchapipreview(e, session, currentOrgRole?.org_id)
      .then((res) => {
        if (res.Success === true) {
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
  const [distTitle, setDistTitle] = useState('');

  const handleDistname = (e) => {
    let title = datasetStore.resource_set
      .filter((resItem) => resItem.id == e)
      .map((distSchema) => distSchema.title)[0];

    setDistTitle(title);
  };

  return (
    <>
      <Button
        kind="primary-outline"
        size="sm"
        title={
          !enable_add
            ? 'Refresh to Preview the Updated Distribution'
            : 'See a Preview of the Updated Distribution'
        }
        data-id={item}
        icon={<Visibility />}
        iconSide={'left'}
        isDisabled={!enable_add || distributionStatus === true}
        onPress={(e: any) => {
          handlePreview(e.target.dataset.id),
            handleDistname(e.target.dataset.id);
        }}
      >
        Preview Updated Distribution
      </Button>

      <Modal
        isOpen={isModalOpen}
        modalHandler={() => modalHandler()}
        label="Add API Source"
      >
        <Status>
          <Header>
            <Heading as="h2" variant={'h3'}>
              Preview - {distTitle}
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
              datasetStore.resource_set.find((ele) => ele.id === item)
                ?.file_details?.format === 'CSV' ? (
                <>
                  <Table
                    columnData={
                      prepareCSVPreviewForTable(previewData).columnData
                    }
                    rowData={prepareCSVPreviewForTable(previewData).rows}
                    label={'CSV Table'}
                    heading={''}
                  />
                </>
              ) : (
                <JSONPretty id="json-pretty" data={previewData} />
              )
            ) : (
              <Loader isSection />
            )}
          </DataWrapper>
        </Status>
      </Modal>
    </>
  );
}

export function FileSchemaPreviewModal({
  item,
  enable_add,
  datasetStore,
  updateStore,
  distributionStatus = undefined,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  function modalHandler() {
    setIsModalOpen(!isModalOpen);
  }
  const [previewData, setPreviewData] = useState([]);
  const [distTitle, setDistTitle] = useState('');

  const handlePreview = (e) => {
    let schemaData = datasetStore.resource_set
      .filter((resItem) => resItem.id == e)
      .map((distSchema) => distSchema.schema);

    let schemaVal = schemaData[0];

    setPreviewData(schemaVal);

    modalHandler();
  };

  const handleDistname = (e) => {
    let title = datasetStore.resource_set
      .filter((resItem) => resItem.id == e)
      .map((distSchema) => distSchema.title)[0];

    setDistTitle(title);
  };

  return (
    <>
      <Button
        kind="primary-outline"
        size="sm"
        title={
          !enable_add
            ? 'Refresh to Preview the Updated Schema'
            : 'See a Preview of the Updated Schema'
        }
        data-id={item}
        icon={<Visibility />}
        iconSide={'left'}
        isDisabled={!enable_add || distributionStatus === true}
        onPress={(e: any) => {
          updateStore();
          handlePreview(e.target.dataset.id);
          handleDistname(e.target.dataset.id);
        }}
      >
        Preview Updated Schema
      </Button>

      <Modal
        isOpen={isModalOpen}
        modalHandler={() => modalHandler()}
        label="Add API Source"
      >
        <Status>
          <Header>
            <Heading as="h3" variant={'h3'}>
              Preview - {distTitle}
            </Heading>
            <Button
              kind="custom"
              size="md"
              icon={<Close />}
              onPress={() => setIsModalOpen(!isModalOpen)}
            />
          </Header>
          <hr />
          <DataWrapper>
            {previewData ? (
              <>
                <Table
                  columnData={[
                    'Key',
                    'Display Name',
                    'Format',
                    'Description',
                  ].map((item) => {
                    return {
                      headerName: item,
                    };
                  })}
                  rowData={previewData.map((schemaRow) => {
                    const rowObj = {};
                    rowObj['Key'] = schemaRow.key;
                    rowObj['Display Name'] = schemaRow.display_name;
                    rowObj['Format'] = capitalizeFirstLetter(schemaRow.format);
                    rowObj['Description'] = schemaRow.description || '-';
                    return rowObj;
                  })}
                  label={'Schema'}
                  heading={''}
                />
              </>
            ) : (
              <Loader isSection />
            )}
          </DataWrapper>
        </Status>
      </Modal>
    </>
  );
}
function TransformationModal({
  transformers,
  selectedResource,
  transformList,
  setTransform,
  datasetStore,
  distCol,
  resourceId,
  pipelineId,
  handleResourceRefresh,
  resourceData,
  enable_add,
  updateStore,
  setCurrentTab,
  session,
}) {
  const [selectedTransform, setSelectedTransform] = useState('');
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
      // Condition for retain columns toggle since it does not have target ids
      [e?.target?.id ? e.target.id : e.id]: e?.target?.value
        ? e.target.value
        : Array.isArray(e?.value)
        ? e?.value
        : e?.value?.toString(),
    };
    // 4. Put it back into our array. N.B. we *are* mutating the array here, but that's why we made a copy first
    items[index] = item;

    // 5. Set the state to our new copy
    setTransform(items);
  };

  const [columnsToTransform, setColumnsToTransform] = useState({});
  const [transformListData, setTransformListData] = useState([]);
  const [outputColumnValue, setOutputColumnValue] = useState({});

  const [isModalOpen, setIsModalOpen] = useState(false);
  function modalHandler() {
    setIsModalOpen(!isModalOpen);
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 20, behavior: 'smooth' });
    }
  }, []);

  const handleSubmit = (resourceData1, e) => {
    e.preventDefault();
    let res_id1 = resourceData
      .filter((resouceItem) => resouceItem.pipeline_id === pipelineId)
      .map((item) => item.resultant_res_id);

    let finalData;

    finalData = {
      res_id: res_id1[0],
      p_id: pipelineId,
      pipe_action: 'update',
      db_action: 'update',
      dataset_id: datasetStore.id,
      transformers_list: transformList.map(
        (item) => item.name === 'change_format_to_pdf'
      )[0]
        ? [
            {
              name: 'change_format_to_pdf',
              order_no: 1,
              context: { format: 'pdf' },
            },
          ]
        : transformList,
    };
    const postData: any = finalData;

    submitData(
      `${process.env.NEXT_PUBLIC_TRANSFORMATION_URL}/transformer/pipe_update`,
      postData
    );

    async function submitData(url: any, data: any) {
      await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization:
            session && session['access']?.token ? session['access'].token : '',
        },
        body: JSON.stringify(data),
      }).then((res) => {
        if (res.status == 200) {
          toast.success('Step added to transformation');
          handleResourceRefresh();
          updateStore();
          modalHandler();
          setTransform([{ name: 'pipeline__transformation' }]);
        } else {
          toast.error('Error while adding step to transformation');
        }
      });
    }
  };

  return (
    <>
      <SubmitWrapper>
        <Button
          isDisabled={!enable_add}
          kind="primary"
          size="sm"
          icon={<Add />}
          title="Add New Step"
          iconSide={'left'}
          onPress={() => {
            modalHandler();
            setTransform([{ name: 'pipeline__transformation' }]);
            handleResourceRefresh();
          }}
        >
          Add New Step
        </Button>
        <Button size="sm" onPress={() => setCurrentTab('list')}>
          Done
        </Button>
      </SubmitWrapper>

      <Modal
        isOpen={isModalOpen}
        modalHandler={() => modalHandler()}
        label="Add API Source"
      >
        <Wrapper onSubmit={(e) => handleSubmit(resourceData, e)}>
          <>
            <ModalHeader>
              <div>
                <Heading as="h2" variant="h3">
                  Add New Step
                </Heading>
                <Button
                  // isDisabled={}
                  kind="custom"
                  size="md"
                  icon={<CrossSize300 />}
                  onPress={() => setIsModalOpen(!isModalOpen)}
                />
              </div>
            </ModalHeader>
            <Line />
            <ContentWrapper>
              <ModalTransformer>
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
                      distCol={distCol}
                    />
                  </>
                ))}
              </ModalTransformer>
              <Line />
              <Flex paddingY={'16px'} gap={'10px'} justifyContent="center">
                <Button kind="primary-outline" size="sm" type="submit">
                  Save Step
                </Button>
              </Flex>
            </ContentWrapper>
          </>
        </Wrapper>
      </Modal>
    </>
  );
}

export default Transformations;

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

const Headers = styled.div`
  display: flex;
  input {
    background-color: var(--color---color-background-lightest);
    border: none;
    font-weight: bold;
    text-align: center;
    font-size: 20px;
    width: 70%;
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
const PreviewButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-bottom: 24px;
  gap: 10px;
  button {
    border: 2px solid var(--color-tertiary-1-00);
    color: var(--color-tertiary-1-00);
    background-color: var(--color-background-lightest);
  }
`;
const SchemaData = styled.div`
  display: flex;
  input {
    text-align: center;
    font-size: 20px;
    font-weight: 500;
    width: 70%;
  }
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
const Line = styled.div`
  border: 1px solid var(--color-gray-01);
  margin-inline: 20px;
`;

const ModalTransformer = styled.div`
  padding-block: 12px;
  padding-inline: 24px;
  overflow-y: auto;
  max-height: 42vh;
  > div {
    margin-bottom: 12px;
  }
  .transform__data {
    > div {
      margin-bottom: 12px;
    }
  }
  input,
  select {
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
    width: 100%;
    font-weight: 400;
  }
`;
const ContentWrapper = styled.div``;
const Wrapper = styled.form`
  background-color: white;
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
const TransformationViewer = styled.div`
  padding: 1rem;
  background-color: var(--color-white);
  border: none;
  box-shadow: 0 0 2px black;
  line-height: 2;
  border-radius: 5px;
  padding: 0 10px;
  margin-top: 4px;
  font-weight: 400;
  width: 100%;

  strong {
    font-weight: 600;
    text-transform: capitalize;
  }
  span {
    display: flex;
    gap: 0.4rem;
    font-weight: 400;
  }
`;
const StyledTabItem = styled(AccordionItem)`
  background-color: var(--color-tertiary-1-06);
  margin-top: 16px;
`;

const StyledTabTrigger = styled(AccordionTrigger)<any>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  width: 100%;
  padding: 16px;
  background-color: var(--color-tertiary-1-06);
  border: 1px solid var(--color-gray-03);
  :hover {
    background-color: var(--color-background-lightest);
  }
  font-weight: 600;
  font-size: 18px;

  > div {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .refresh {
    transition: ${(props) => (props.isActive ? 'transform 0.5s' : '0s')};
    padding-right: 0;
    margin-right: 20px;
    svg {
      margin-inline-start: 0em;
    }
    animation: ${(props) =>
      props.isActive ? 'rotation 1s infinite linear' : ''};
    transform: ${(props) =>
      props.isActive ? 'rotate(0deg)' : 'rotate(360deg)'};
  }
`;

const StyledTabContent = styled(AccordionContent)`
  padding: 16px;
  background-color: var(--color-background-lightest);
  border: 1px solid var(--color-gray-03);
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
  distCol,
}) => {
  //humanize the types of transformers getting from backend
  function humanize(str: any) {
    var i,
      frags = str.split('_');
    for (i = 0; i < frags.length; i++) {
      frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1);
    }
    return frags.join(' ');
  }

  let colVal = selectedResource.value?.toString() || distCol?.toString();

  const data = datasetStore.resource_set.find(
    (item) => item.id.toString() === colVal
  );

  const getResourceColumnsRes = useQuery(GET_RESOURCE_COLUMNS, {
    variables: {
      resource_id: selectedResource,
    },
    skip: !selectedResource,
  });

  const OptionSingleList = [
    { value: 'replace_all', label: 'Replace All' },
    { value: 'replace_nth', label: 'Replace every nth character' },
    { value: 'retain_first_n', label: 'Retain First n characters' },
  ];
  const FormatList = [
    { value: 'xml', label: 'XML' },
    { value: 'pdf', label: 'PDF' },
    { value: 'json', label: 'JSON' },
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
              required
              name={name}
              placeholder={placeholder}
            />
          </div>
        );
      case 'field_multi':
        return (
          <div>
            <span>{placeholder}</span>
            <select
              key={index}
              id={name}
              required
              onChange={(e) => handletransformerfill(e, transformerIndex)}
            >
              <option value="" selected disabled>
                Select the Column
              </option>

              {/* {getResourceColumnsRes?.data?.resource_columns?.map(
        (item, index) => (
          <option key={index} id={`${name}_${index}`}>
            {item}
          </option>
        )
      )} */}

              {data?.schema?.map((item, index) => (
                <option key={index} id={`${name}_${index}`}>
                  {item.display_name}
                </option>
              ))}
            </select>
          </div>
        );

      //    <Select isMulti options={item}/>
      case 'field_single':
        return (
          <div>
            <span>{placeholder}</span>
            <select
              key={index}
              id={name}
              required
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
        );
      case 'option_single':
        return (
          <div>
            <span>{placeholder}</span>
            <select
              key={index}
              id={name}
              required
              onChange={(e: any) => {
                handletransformerfill(e, transformerIndex);
                setReplaceAllOption(e.target.value);
              }}
            >
              <option value="" selected disabled>
                Select the option
              </option>
              {OptionSingleList.map((item) => (
                <option
                  key={item.label}
                  id={`${name}_${index}`}
                  value={item.value}
                >
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
              required
              onChange={(e) => handletransformerfill(e, transformerIndex)}
            >
              <option value="" selected disabled>
                Select the Special char
              </option>
              {SpecialCharacterList.map((item) => (
                <option
                  key={item.label}
                  id={`${name}_${index}`}
                  value={item.value}
                >
                  {item.label}
                </option>
              ))}
            </select>
          </div>
        );
      case 'formatfield_single':
        return (
          <>
            {/* <div>
              <span>{placeholder}</span>
              <select
                key={index}
                id={name}
                required
                onChange={(e) => handletransformerfill(e, transformerIndex)}
              >
                <option value="" selected disabled>
                  Select the Format
                </option>
                {FormatList.map((item) => (
                  <option
                    key={item.label}
                    id={`${name}_${index}`}
                    value={item.value}
                  >
                    {item.label}
                  </option>
                ))}
              </select>
            </div> */}

            <Aside
              title={
                'Distribution will be converted to Pdf and no further transformations will be applied '
              }
            />
          </>
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
              min={'0'}
              type="number"
              key={index}
              required
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
      case 'boolean':
        return (
          <div>
            <span>{placeholder}</span>
            <Switch
              key={index}
              defaultSelected={false}
              name={name}
              value={false}
              onChange={(e: any) => {
                handletransformerfill({ id: name, value: e }, transformerIndex);
              }}
            >
              Retain Column
            </Switch>
          </div>
        );
      default:
        return <input></input>;
    }
  }

  return (
    <>
      <div>
        <label htmlFor="transform_1">
          <span> Transformation Method&#42;</span>
          <select
            // disabled={!selectedResource.value}
            name={`${item.name}_${transformerIndex}`}
            className="transform__select"
            required
            value={transformList[transformerIndex].name}
            // defaultValue={transformList[0].name}
            onChange={(e) =>
              handletransformerselect(e.target.value, transformerIndex)
            }
          >
            <option value="" hidden>
              Transformation Method
            </option>
            {transformers.map((transformer: any, index: any) => (
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
      </div>
      <div
        id={`transform_data_${transformerIndex}`}
        className="transform__data"
      >
        {transformers.filter(
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
    </>
  );
};
