import { FileUpload, TextField } from 'components/form';
import { ErrorMessage, Label } from 'components/form/BaseStyles';
import LinkIcon from 'components/icons/Link';
import UploadIcon from 'components/icons/Upload';
import React from 'react';
import styled from 'styled-components';
import Button from 'components/actions/Button';

export type Props = {
  formik: any;
  id: string;
  urlName?: string;
  fileName?: string;
  linkDescription?: string;
  fileTypes?: string;
  sizeLimit?: number;
  label?: string;
  uploadValArr: any;
  isDisabled?: boolean;
};

const FormikUpload = ({
  formik,
  urlName,
  fileName,
  linkDescription,
  id,
  fileTypes = '',
  label,
  uploadValArr,
  isDisabled = false,
}: Props) => {
  const [fileUpload, setFileUpload] = React.useState(fileName ? true : false);
  const setUploadValue = uploadValArr[1];
  const uploadVal = uploadValArr[0];

  function handleFileChange(files) {
    Array.from(files).forEach((file: any) => {
      formik.setFieldValue(fileName, file);
    });
    setUploadValue(files[0] || null);
    if (urlName) formik.setFieldValue(urlName, '');
  }

  const error =
    fileUpload && formik.errors[fileName]
      ? formik.errors[fileName]
      : formik.errors[urlName]
      ? formik.errors[urlName]
      : '';

  return (
    <div>
      {label && <Label>{label}</Label>}
      {fileName && urlName && (
        <ButtonWrapper>
          {fileName && (
            <Button
              size="sm"
              icon={
                <UploadIcon
                  path={fileUpload ? 'var(--primary)' : 'var(--color-white)'}
                />
              }
              iconSide="left"
              kind={fileUpload ? 'primary' : 'primary-outline'}
              onPress={() => {
                setFileUpload(true);
              }}
            >
              Upload
            </Button>
          )}
          {urlName && (
            <Button
              size="sm"
              icon={
                <LinkIcon
                  path={fileUpload ? 'var(--color-white)' : 'var(--primary)'}
                />
              }
              iconSide="left"
              kind={fileUpload ? 'primary-outline' : 'primary'}
              onPress={() => {
                {
                  setFileUpload(false);
                }
              }}
            >
              Link
            </Button>
          )}
        </ButtonWrapper>
      )}

      <InputWrapper>
        {fileUpload ? (
          <>
            <FileUpload
              name={fileName}
              label=""
              onUpdate={(e) => handleFileChange(e)}
              accept={fileTypes}
              values={formik.values[fileName]}
              setField={formik.setFieldValue}
              id={fileUpload ? id : null}
              isDisabled={isDisabled}
            />
          </>
        ) : (
          <TextField
            aria-label="Enter link"
            placeholder="Enter the Url"
            maxLength={200}
            name={urlName}
            value={formik.values[urlName]}
            id={!fileUpload ? id : null}
            description={linkDescription || 'Enter the URL of the file'}
            onChange={(e) => {
              formik.setFieldValue(urlName, e);
              setUploadValue(e);
              if (fileName) formik.setFieldValue(fileName, null);
            }}
            isRequired
          />
        )}
      </InputWrapper>
      {error &&
        !uploadVal &&
        (formik.touched[fileName] || formik.touched[urlName]) && (
          <ErrorMessage>{error}</ErrorMessage>
        )}
    </div>
  );
};

export { FormikUpload };

const ButtonWrapper = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 4px;
`;

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
