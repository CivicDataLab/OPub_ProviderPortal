import { FileUpload, TextField } from 'components/form';
import { ErrorMessage } from 'components/form/BaseStyles';
import { Text } from 'components/layouts';
import React from 'react';
import styled from 'styled-components';

export type Props = {
  formik: any;
  id: string;
  urlName?: string;
  fileName?: string;
  linkDescription?: string;
  errorMessage?: boolean;
  fileTypes?: string;
  sizeLimit?: number;
  isDisabled?: boolean;
};

const FormikUpload = ({
  formik,
  urlName,
  fileName,
  linkDescription,
  id,
  errorMessage = false,
  fileTypes = '',
  isDisabled = false,
}: Props) => {
  function handleFileChange(files) {
    Array.from(files).forEach((file: any) => {
      formik.setFieldValue(fileName, file);
    });
    if (urlName) formik.setFieldValue(urlName, '');
  }

  return (
    <>
      <InputWrapper>
        {fileName ? (
          <FileUpload
            name={fileName}
            label=""
            onUpdate={(e) => handleFileChange(e)}
            accept={fileTypes}
            values={formik.values[fileName]}
            setField={formik.setFieldValue}
            id={id + '_file'}
            isDisabled={isDisabled}
          />
        ) : null}
        {urlName ? (
          <LinkWrapper>
            <Text>or enter URL:</Text>
            <TextField
              aria-label="Enter link"
              placeholder="Link to your file"
              name={urlName}
              value={formik.values[urlName]}
              id={id + '_url'}
              onChange={(e) => {
                formik.setFieldValue(urlName, e);
                if (fileName) formik.setFieldValue(fileName, null);
              }}
              isRequired
            />
          </LinkWrapper>
        ) : null}
      </InputWrapper>
      {errorMessage && <ErrorMessage>Required</ErrorMessage>}
    </>
  );
};

export { FormikUpload };

const InputWrapper = styled.div`
  margin-top: 8px;

  [type='file'] {
    min-height: 60px;
    box-shadow: none;
    padding-left: 0;
    cursor: pointer;

    &::file-selector-button {
      padding: 12px 16px;
      border: none;
      border: 2px solid var(--color-primary-01);
      color: var(--color-primary-01);
      background-color: transparent;
      cursor: pointer;
      border-radius: 2px;

      font-weight: var(--font-bold);
      font-size: 0.875rem;
    }
  }
`;

const LinkWrapper = styled.div`
  margin-top: 16px;
  color: var(--text-medium);

  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  align-items: center;

  > div {
    flex-grow: 1;
  }
`;
