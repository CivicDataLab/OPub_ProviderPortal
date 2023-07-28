import {
  CheckmarkCircle,
  DeleteOutline,
  Folder,
  UploadToCloudOutline,
} from '@opub-icons/workflow';
import { Button } from 'components/actions';
import { Text } from 'components/layouts';
import { Flex } from 'components/layouts/FlexWrapper';
import React, { useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { truncate } from 'utils/helper';
import { ErrorMessage } from '../BaseStyles';
import {
  FileUploadContainer,
  FormField,
  InputLabel,
  RemoveFileIcon,
  UploadedFile,
} from './FileUpload.styles';

const convertNestedObjectToArray = (nestedObj) =>
  Object.keys(nestedObj).map((key) => nestedObj[key]);

function supportedText(formats) {
  if (formats?.length) {
    return `Supported file type are ${formats}`;
  }
}

const FileUpload = ({
  label,
  onUpdate,
  values = null,
  setField = null,
  maxFileSizeInBytes = 8,
  FileSizeLabel = null,
  FormatLabel = null,
  isDisabled,
  ...otherProps
}) => {
  const fileInputField = useRef(null);
  const [files, setFiles] = useState({});
  const [sizeError, setSizeError] = useState(false);
  const [formatError, setFormatError] = useState(false);
  const sizeLimit = maxFileSizeInBytes * 1024 * 1024; // 8 MB
  React.useEffect(() => {
    // TODO handle this part for mutiple files
    if (values) {
      setFiles({ file: values });
    } else {
      setFiles({});
    }
  }, [values]);

  const addNewFiles = (newFiles) => {
    for (let file of newFiles) {
      if (file.size === 0 || file.type === '') {
        setFormatError(true);
        toast.error('File format not supported');
      } else if (file.size < sizeLimit) {
        setFormatError(false);
        setSizeError(false);
        if (!otherProps.multiple) {
          return { file };
        }
        files[file.name] = file;
      } else {
        setSizeError(true);
      }
    }
    return { ...files };
  };

  const callOnUpdate = (files) => {
    const filesAsArray = convertNestedObjectToArray(files);

    onUpdate(filesAsArray);
  };

  const handleNewFileUpload = (e) => {
    const { files: newFiles } = e.target;
    if (newFiles.length) {
      let updatedFiles = addNewFiles(newFiles);
      setFiles(updatedFiles);
      callOnUpdate(updatedFiles);
    }
  };

  const removeFile = (fileName) => {
    delete files[fileName];
    setFiles({ ...files });
    setField('file', null);
    callOnUpdate({ ...files });
  };

  React.useEffect(() => {
    if (
      values !== null &&
      values?.type &&
      otherProps?.accept &&
      !otherProps?.accept
        .replace(/\s/g, '')
        .split(',')
        .map((type) => type.toLowerCase())
        .includes(
          '.' + values?.type?.split('/').map((type) => type.toLowerCase())[1]
        )
    ) {
      Object.keys(files).map((fileName, index) => removeFile(fileName));
      toast.error('File format not supported');
    }
  }, [values]);

  return (
    <div>
      <FileUploadContainer>
        {Object.keys(files).length && !formatError ? (
          <div className="uploaded-file">
            {Object.keys(files).map((fileName, index) => {
              let file = files[fileName];
              return (
                <UploadedFile key={file.name + index}>
                  <Flex gap="12px">
                    <CheckmarkCircle size={24} fill="var(--color-success)" />
                    <Flex flexDirection="column" alignItems="flex-start">
                      <Text variant="pt16b">{truncate(file.name, 20)}</Text>
                      <Text color="var(--text-medium)" variant="pt12">
                        Successfully Selected
                      </Text>
                    </Flex>
                  </Flex>
                  <RemoveFileIcon onClick={() => removeFile(fileName)}>
                    <DeleteOutline size={24} fill="var(--text-medium)" />
                  </RemoveFileIcon>
                </UploadedFile>
              );
            })}
          </div>
        ) : (
          <div>
            <UploadToCloudOutline fill="var(--color-gray-03)" size={56} />
            <InputLabel>{label}</InputLabel>
            <Text mt="16px">Drag and drop files here, or</Text>
            <Button
              size="sm"
              kind="custom"
              icon={<Folder size={24} />}
              iconSide="left"
            >
              Choose File to Upload
            </Button>
            {FormatLabel && (
              <Text variant="pt12">{supportedText(otherProps.accept)}</Text>
            )}
            {FileSizeLabel && (
              <Text variant="pt12">
                The file size should not be more than {maxFileSizeInBytes} MB
              </Text>
            )}
          </div>
        )}

        <FormField
          disabled={isDisabled}
          type="file"
          ref={fileInputField}
          onChange={handleNewFileUpload}
          title=""
          value=""
          {...otherProps}
        />
      </FileUploadContainer>
      {sizeError ? (
        <ErrorMessage>{`Please upload file under ${
          sizeLimit / (1024 * 1024)
        } MB`}</ErrorMessage>
      ) : null}
    </div>
  );
};

export { FileUpload };
