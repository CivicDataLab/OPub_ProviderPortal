import styled from 'styled-components';

export const FileUploadContainer = styled.section`
  border: 2px dashed var(--color-gray-03);
  background-color: var(--color-tertiary-1-06);
  border-radius: 12px;
  padding-top: 24px;
  padding-bottom: 12px;
  position: relative;
  color: var(--text-medium);
  flex-grow: 1;
  min-height: 248px;

  > div {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding-inline: 50px;

    > span {
      max-width: 500px;
    }

    > button {
      color: var(--color-gray-04);
      border-radius: 2px;
      border: 2px solid var(--color-gray-04);
      background-color: var(--color-white);

      padding-block: 8px;
      padding-right: 16px;
      padding-left: 12px;

      margin-block: 16px;
    }
  }

  .uploaded-file {
    padding-inline: 30px;
  }
`;

export const FormField = styled.input`
  font-size: 18px;
  display: block;
  width: 100%;
  border: none;
  text-transform: none;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0;
`;

export const InputLabel = styled.label`
  top: -21px;
  font-size: 13px;
  color: black;
  left: 0;
  position: absolute;
`;

export const RemoveFileIcon = styled.button`
  cursor: pointer;
  svg {
    &:hover {
      fill: var(--color-error);
    }
  }
`;

export const Browse = styled.span`
  color: var(--color-primary-01);
  font-weight: 700;
  text-decoration: underline;
  z-index: 10;
`;

export const UploadedFile = styled.div`
  background-color: var(--color-white);
  border-radius: 2px;
  border: 1px solid var(--color-gray-02);
  padding: 8px 12px;
  border-bottom: 4px solid var(--color-success);
  margin-top: 62px;
  min-width: 276px;

  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: space-between;

  z-index: 100;
`;
