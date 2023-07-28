import { Button } from 'components/actions';
import { TextArea, TextField } from 'components/form';
import { FieldArray, FormikProvider } from 'formik';
import { AddCircle, Delete } from '@opub-icons/workflow';
import styled from 'styled-components';

const LicenseAddition = ({ valueName, formik }) => {
  return (
    <div>
      <FormikProvider value={formik}>
        <FieldArray name={valueName} validateOnChange={false}>
          {({ push, remove, form }) => {
            return (
              <>
                <Wrapper>
                  <FieldsWrapper>
                    {formik.values &&
                      formik.values[valueName].map((field, index) => {
                        const fieldName = `${valueName}.${index}`;
                        const errors = form.errors['license_additions'];

                        return (
                          <Fields key={`${fieldName}`}>
                            <TextField
                              label="Title"
                              name={`${fieldName}.title`}
                              maxLength={100}
                              onChange={(e: any) => {
                                formik.setFieldValue(`${fieldName}.title`, e);
                                errors &&
                                  errors[index]?.title &&
                                  formik.validateField(`${fieldName}.title`);
                              }}
                              value={field.title}
                              errorMessage={errors && errors[index]?.title}
                              isRequired
                            />
                            <TextArea
                              label="Description"
                              maxLength={10000}
                              name={`${fieldName}.description`}
                              onChange={(e: any) => {
                                formik.setFieldValue(
                                  `${fieldName}.description`,
                                  e
                                );
                                errors &&
                                  errors[index]?.description &&
                                  formik.validateField(
                                    `${fieldName}.description`
                                  );
                              }}
                              isRequired
                              value={field.description}
                              errorMessage={
                                errors && errors[index]?.description
                              }
                            />

                            <Button
                              onPress={() => remove(index)}
                              iconOnly
                              icon={<Delete />}
                              bg="var(--color-error)"
                            >
                              Remove Addition Entry
                            </Button>
                          </Fields>
                        );
                      })}
                  </FieldsWrapper>
                  <AddButton>
                    <Button
                      type="button"
                      size="sm"
                      onPress={() =>
                        push({
                          title: '',
                          description: '',
                          generic_item: false,
                        })
                      }
                      icon={
                        <AddCircle width={14} fill="var(--text-high-on-dark)" />
                      }
                      iconSide="left"
                    >
                      Additional Terms and Conditions
                    </Button>
                  </AddButton>
                </Wrapper>
              </>
            );
          }}
        </FieldArray>
      </FormikProvider>
    </div>
  );
};

export { LicenseAddition };

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const AddButton = styled.div`
  margin-top: 8px;
  width: fit-content;
  align-self: flex-end;
  display: flex;
  gap: 16px;
  justify-content: space-between;
  width: 100%;

  > button {
    transition: transform 130ms ease;
    background-color: var(--color-secondary-01);
    &:hover,
    &:focus-visible {
      transform: scale(1.05);
    }
  }
`;

const FieldsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-top: 16px;
`;

const Fields = styled.div`
  width: 100%;
  display: flex;
  gap: 16px;
  flex-wrap: wrap;

  > div:first-of-type {
    flex-basis: 320px;
  }

  > div:last-of-type {
    flex-grow: 1;
  }

  > button {
    /* align-self: center; */
    margin-top: 30px;

    &:hover {
      background-color: rgb(245, 64, 9);
    }
  }
`;
