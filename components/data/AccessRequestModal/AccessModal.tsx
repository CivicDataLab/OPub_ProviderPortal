import React, { useState } from 'react';
import { Button, Modal } from 'components/actions';
import { mutation, CREATE_DATA_REQ } from 'services';
import { useMutation } from '@apollo/client';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';

const AccessModal = ({ modalHandler, resources, isModalTriggerd }) => {
  const router = useRouter();

  const [createDataReq, createDataRes] = useMutation(CREATE_DATA_REQ);
  const [descError, setDescError] = useState('');

  const resourceList = [];
  resources.map((item) => {
    resourceList.push({
      label: item.title,
      id: item.id,
    });
  });

  const purposeList = [
    {
      id: 'EDUCATION',
      label: 'Education',
    },
    {
      id: 'RESEARCH',
      label: 'Research',
    },
    {
      id: 'PERSONAL',
      label: 'Personal',
    },
    {
      id: 'OTHERS',
      label: 'Others',
    },
  ];
  return (
    <Modal
      isOpen={isModalTriggerd}
      modalHandler={modalHandler}
      label="Give Access"
    >
      <ModalContainer>
        <AccessForm
          setDescError={setDescError}
          descError={descError}
          modalHandler={modalHandler}
          createDataReq={createDataReq}
          createDataRes={createDataRes}
          resourceList={resourceList}
          purposeList={purposeList}
        />
      </ModalContainer>
    </Modal>
  );
};

function submitDataRequest(e, modalHandler, createDataReq, createDataRes) {
  e.preventDefault();
  const data = new FormData(e.target);
  const value = Object.fromEntries(data.entries());
  const mutationRequest = {
    data_request: {
      description: value.Description,
      resource_list: value.Resource,
      status: 'REQUESTED',
      remark: '',
      purpose: value.Purpose,
    },
  };
  mutation(createDataReq, createDataRes, mutationRequest)
    .then(() => {
      modalHandler();
      toast.success('Success in Data request');
    })
    .catch(() => {
      toast.error('Error in the Data Request');
    });
}

function AccessForm({
  setDescError,
  descError,
  modalHandler,
  resourceList,
  purposeList,
  createDataReq,
  createDataRes,
}) {
  return (
    <form
      onSubmit={(e) =>
        submitDataRequest(e, modalHandler, createDataReq, createDataRes)
      }
    >
      <h3>Define your Data Requirements</h3>
      <label className="required" htmlFor="name">
        Purpose
      </label>
      <select onChange={(e) => {}} name="Purpose" id="purpose">
        {purposeList.map((item) => (
          <option key={item.id} value={item.id}>
            {item.label}
          </option>
        ))}
      </select>
      <label className="required" htmlFor="name">
        Resource Set
      </label>
      <select name="Resource" id="resource">
        {resourceList.map((resource) => (
          <option id={resource.id} key={resource.id} value={resource.id}>
            {resource.label}
          </option>
        ))}
      </select>
      <label className="required" htmlFor="description">
        Message for the Provider
      </label>
      <textarea
        placeholder={`Fill with A-Za-z0-9, "'.?;:&_ ()@$#*^+=[]!-`}
        name="Description"
        id="description"
        title="Message to the provider"
        maxLength={1000}
        onChange={(e) => {
          e.target.value = e.target.value.replace(
            /[^A-Za-z0-9, "'.?;:&_ ()@$#*^+=[\]!-]/,
            ''
          );
          setDescError(e.target.validationMessage);
        }}
        onInvalid={(e) => {
          setDescError(
            e.target['validationMessage'] ? e.target['validationMessage'] : ''
          );
        }}
        required
      />
      {descError && (
        <span className="fieldError" id="descError">
          {descError}
        </span>
      )}
      <Button type="submit">Save</Button>
    </form>
  );
}

export default AccessModal;

const ModalContainer = styled.div`
  background-color: #fff;
  width: 45em;
  max-height: fit-content;
  padding: 2em;

  form {
    display: grid;
    gap: 1em;

    label {
      font-weight: 600;
    }

    button {
      margin: 0 0 0 auto;
    }
  }
`;
