import { Select } from 'components/form/Select';
import styled from 'styled-components';
import { Button } from 'components/actions';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Checkbox, TextField } from 'components/form';
import { Text } from 'components/layouts/Text';
import { omit } from 'utils/helper';
import * as Yup from 'yup';
import { updateDataset } from 'slices/addDatasetSlice';
import { useMutation, useQuery } from '@apollo/client';
import {
  GET_ALL_GEOGRAPHY,
  GET_ALL_SECTOR,
  GET_ALL_TAGS,
  mutation,
  UPDATE_DATASET,
} from 'services';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import { DashboardHeader, Heading } from 'components/layouts';
import { Link } from 'components/layouts/Link';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from 'components/actions/Accordian/Accordian';
import { Minus, Plus } from 'components/icons';
import { Flex } from 'components/layouts/FlexWrapper';
import { useRouter } from 'next/router';
import { LinkOutLight } from '@opub-icons/workflow';
import { useProviderStore } from 'services/store';

const validationSchema = Yup.object().shape(
  {
    source: Yup.string().required('Required'),
    remote_issued: Yup.date()
      .nullable()
      .transform((value, originalValue) =>
        originalValue === '' ? null : value
      )
      .required('Required'),

    remote_modified: Yup.date()
      .nullable()
      .notRequired()
      .when(['remote_modified'], {
        is: (remote_issued) => {
          return remote_issued;
        },
        then: Yup.date()
          .min(
            Yup.ref('remote_issued'),
            "Modified date can't be before Created date"
          )
          .required('required'),
      }),

    period_from: Yup.date()
      .when(['period_to', 'is_datedynamic'], {
        is: (period_to, is_datedynamic) => {
          return period_to && !is_datedynamic;
        },
        then: Yup.date()
          .max(Yup.ref('period_to'), "Start date can't be after end date")
          .required('required'),
      })
      .when(['is_datedynamic'], {
        is: true,
        then: Yup.date().required('required'),
      }),
    period_to: Yup.date()
      .when(['period_from', 'is_datedynamic'], {
        is: (period_from, is_datedynamic) => {
          return period_from && !is_datedynamic;
        },
        then: Yup.date()
          .min(Yup.ref('period_from'), "End date can't be before start date")
          .required('required'),
      })
      .when(['is_datedynamic'], {
        is: true,
        then: Yup.date().notRequired(),
      }),
    sector_list: Yup.array().min(1).required('Required'),
    geo_list: Yup.array().min(1).required('Required'),
    update_frequency: Yup.string().required('Required'),
  },
  [
    ['period_from', 'period_to'],
    ['remote_modified', 'remote_modified'],
  ]
);

const Metadata = ({ setSelectedStep, datasetStore, handleStep }) => {
  const tagsRes = useQuery(GET_ALL_TAGS);
  const allGeographyRes = useQuery(GET_ALL_GEOGRAPHY);
  const allSectorRes = useQuery(GET_ALL_SECTOR);

  const router = useRouter();
  const currentOrg = useProviderStore((e) => e.org);

  const [userFurtherAction, setUserFurtherAction] = useState('Distribution');

  const [allTagsList, setAllTagsList] = useState([]);
  const [allGeographyList, setAllGeographyList] = useState([]);
  const [allSectorList, setAllSectorList] = useState([]);

  useEffect(() => {
    if (!tagsRes.loading && !tagsRes.error) {
      setAllTagsList([
        ...tagsRes.data.all_tag?.map((item) => {
          return {
            label: item.name,
            value: item.id,
          };
        }),
      ]);
    }
  }, [tagsRes.data]);

  useEffect(() => {
    if (!allGeographyRes.loading && !allGeographyRes.error) {
      setAllGeographyList([
        ...allGeographyRes.data.all_geography
          .sort((a, b) => {
            if (a.name < b.name) return -1;
            else if (a.name > b.name) return 1;
            else return 0;
          })
          .map((item) => {
            return {
              label: item.name,
              value: item.id,
            };
          }),
      ]);
    }
  }, [allGeographyRes.data]);

  useEffect(() => {
    if (!allSectorRes.loading && !allSectorRes.error) {
      setAllSectorList([
        ...allSectorRes.data.all_sector?.map((item) => {
          return {
            label: item.name,
            value: item.id,
          };
        }),
      ]);
    }
  }, [allSectorRes.data]);

  const dispatch = useDispatch();

  const [updateDatasetReq, datasetUpdateRes] = useMutation(UPDATE_DATASET);
  const [currentAccordion, setCurrentAccordion] = useState();

  const initialValues = {
    id: datasetStore.id,
    source: datasetStore.source || currentOrg.org_title,
    sector_list: [
      ...datasetStore.sector.map((item) => {
        return item['value'];
      }),
    ],
    geo_list: [
      ...datasetStore.geography.map((item) => {
        return item['label'];
      }),
    ],
    highlights1:
      (datasetStore?.highlights && datasetStore?.highlights[0]) || '',
    highlights2:
      (datasetStore?.highlights && datasetStore?.highlights[1]) || '',
    remote_issued: datasetStore.remote_issued,
    remote_modified: datasetStore.remote_modified,

    period_from: datasetStore.period_from,
    period_to: datasetStore.period_to,
    is_datedynamic: datasetStore.is_datedynamic,
    update_frequency: datasetStore.update_frequency || '',
    funnel:
      datasetStore.funnel === 'Metadata'
        ? 'Distributions'
        : datasetStore.funnel,
    tags_list: [
      ...datasetStore.tags.map((item) => {
        return item['label'];
      }),
    ],
    confirms_to: datasetStore.confirms_to,
    contact_point: datasetStore.contact_point,
    in_series: datasetStore.in_series,
    language: datasetStore.language,
    qualified_attribution: datasetStore.qualified_attribution,
    spatial_coverage: datasetStore.spatial_coverage,
    spatial_resolution: datasetStore.spatial_resolution,
    temporal_coverage: datasetStore.temporal_coverage,
    temporal_resolution: datasetStore.temporal_resolution,
    theme: datasetStore.theme,
  };

  const formik: any = useFormik({
    initialValues,
    validationSchema,
    validateOnChange: false,
    // validate,
    onSubmit: (values) => {
      onMetadataSave(values);
    },
  });

  const { errors } = formik;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 20, behavior: 'smooth' });
    }
  }, [errors]);

  const UpdateFreqList = [
    { value: 'One Time', label: 'One Time' },
    { value: 'Yearly', label: 'Yearly' },
    { value: 'Monthly', label: 'Monthly' },
    { value: 'Daily', label: 'Daily' },
  ];

  const onMetadataSave = (values) => {
    // e.preventDefault();

    let submitValues: any = {
      ...values,
      highlights:
        values.highlights1 || values.highlights2
          ? [
              values.highlights1 !== '' && values.highlights1,
              values.highlights2 !== '' && values.highlights2,
            ].filter(Boolean)
          : [],
      is_datedynamic: values.is_datedynamic ? 'True' : 'False',
    };

    submitValues = omit(submitValues, ['highlights1', 'highlights2']);
    if (!submitValues.remote_modified)
      submitValues = omit(submitValues, ['remote_modified']);
    if (!submitValues.period_from)
      submitValues = omit(submitValues, ['period_from']);
    if (!submitValues.period_to)
      submitValues = omit(submitValues, ['period_to']);

    mutation(updateDatasetReq, datasetUpdateRes, {
      updated_dataset: submitValues,
    })
      .then((updateSuccessRes) => {
        // Redirect to Upload component with the ID on success of the above promise
        toast.success(
          'Metadata saved successfully for ' +
            updateSuccessRes?.update_dataset?.dataset?.title
        );

        dispatch(updateDataset(updateSuccessRes.update_dataset.dataset));

        if (userFurtherAction === 'Distribution') {
          handleStep(0);
          setSelectedStep('distributions');
        } else {
          window
            ? window.open(`/datasets/${datasetStore.slug}`, '_blank')
            : router.push(`/datasets/${datasetStore.slug}`);
        }
      })

      .catch(() => {
        toast.error('Error in updating metadata');
      });
  };

  const dcatLinks = {
    confirms_to:
      'https://www.w3.org/TR/vocab-dcat-3/#Property:resource_conforms_to',
    contact_point:
      'https://www.w3.org/TR/vocab-dcat-3/#Property:resource_contact_point',
    in_series: 'https://www.w3.org/TR/vocab-dcat-3/#Property:dataset_in_series',
    language: 'https://www.w3.org/TR/vocab-dcat-3/#Property:resource_language',
    qualified_attribution:
      'https://www.w3.org/TR/vocab-dcat-3/#Property:resource_qualified_attribution',
    spatial_coverage:
      'https://www.w3.org/TR/vocab-dcat-3/#Property:dataset_spatial',
    spatial_resolution:
      'https://www.w3.org/TR/vocab-dcat-3/#Property:dataset_spatial_resolution',
    temporal_coverage:
      'https://www.w3.org/TR/vocab-dcat-3/#Property:dataset_temporal',
    temporal_resolution:
      'https://www.w3.org/TR/vocab-dcat-3/#Property:dataset_temporal_resolution',
    theme: 'https://www.w3.org/TR/vocab-dcat-3/#Property:resource_theme',
  };

  return (
    <>
      <ComponentWrapper>
        <DashboardHeader>
          <Heading as="h2" variant="h3">
            Metadata
          </Heading>
        </DashboardHeader>
        <Status onSubmit={(e) => e.preventDefault()} noValidate>
          <>
            <TextField
              label="Source"
              name="source"
              isRequired
              placeholder="Source of the Dataset"
              maxLength={100}
              value={formik.values.source}
              onChange={(e) => {
                formik.setFieldValue('source', e);
                errors.source && formik.validateField('source');
              }}
              errorMessage={errors.source}
            />

            <DateWrapper>
              <Flex flexWrap={'wrap'} gap={'20px'}>
                <TextField
                  label="Dataset Creation Date"
                  name="remote_issued"
                  isRequired
                  type="date"
                  max="9999-12-12"
                  defaultValue={formik.values.remote_issued}
                  onChange={(e) => {
                    formik.setFieldValue('remote_issued', e);
                    errors.remote_issued &&
                      formik.validateField('remote_issued');
                  }}
                  errorMessage={errors.remote_issued}
                />
                <TextField
                  label="Dataset Modification Date"
                  name="remote_modified"
                  type="date"
                  max="9999-12-12"
                  defaultValue={formik.values.remote_modified}
                  onChange={(e) => {
                    formik.setFieldValue('remote_modified', e);
                  }}
                  errorMessage={errors.remote_modified}
                />
              </Flex>
              <Flex flexWrap={'wrap'} gap={'20px'}>
                <TextField
                  label="Data Duration (Start)"
                  name="period_from"
                  type="date"
                  max="9999-12-12"
                  defaultValue={formik.values.period_from}
                  onChange={(e) => {
                    formik.setFieldValue('period_from', e);
                  }}
                  errorMessage={errors.period_from}
                />
                <Flex
                  flexWrap={'wrap'}
                  flexGrow={'inherit'}
                  flexDirection={'column'}
                >
                  <div style={{ width: '100%' }}>
                    <TextField
                      label="Data Duration (End)"
                      name="period_to"
                      type="date"
                      max="9999-12-12"
                      isDisabled={formik.values.is_datedynamic}
                      defaultValue={formik.values.period_to}
                      onChange={(e) => {
                        formik.setFieldValue('period_to', e);
                      }}
                      errorMessage={errors.period_to}
                    />
                  </div>
                  <Checkbox
                    name={''}
                    defaultSelected={formik.values.is_datedynamic}
                    data-type={'checkbox'}
                    onChange={(e) => {
                      formik.setFieldValue('is_datedynamic', e);
                      if (e) {
                        formik.setFieldValue('period_to', '');
                      }
                    }}
                  >
                    Set dynamically
                  </Checkbox>
                </Flex>
              </Flex>
            </DateWrapper>

            <Select
              options={UpdateFreqList}
              isRequired
              inputId={formik.update_frequency}
              defaultValue={{
                label: datasetStore.update_frequency || 'Select..',
                value: datasetStore.update_frequency || '',
              }}
              onChange={(e) => {
                formik.setFieldValue('update_frequency', e.value);
                if (errors.update_frequency) errors.update_frequency = false;
              }}
              label={'Update Frequency'}
              errorMessage={errors.update_frequency}
            />

            <Select
              options={allGeographyList}
              inputId={formik.geo_list}
              isRequired
              isClearable
              isMulti
              defaultValue={datasetStore.geography}
              onChange={(e: any) => {
                formik.setFieldValue(
                  'geo_list',
                  e.value ? e.value : e.map((elm) => elm.label)
                );
                if (errors.geo_list) errors.geo_list = false;
              }}
              label={'Geography'}
              errorMessage={errors.geo_list && 'Required'}
            />

            <Select
              options={allSectorList}
              inputId={formik.sector_list}
              isClearable
              isMulti
              isRequired
              defaultValue={datasetStore.sector}
              onChange={(e: any) => {
                formik.setFieldValue(
                  'sector_list',
                  e.value ? e.value : e.map((elm) => elm.value)
                );
                if (errors.sector_list) errors.sector_list = false;
              }}
              label={'Sector'}
              errorMessage={errors.sector_list && 'Required'}
            />

            <Select
              options={allTagsList}
              inputId={formik.tags_list}
              creatable
              isClearable
              isMulti
              defaultValue={datasetStore.tags}
              onChange={(e: any) => {
                formik.setFieldValue(
                  'tags_list',
                  e.value ? e.value : e.map((elm) => elm.label)
                );
              }}
              label={'Tags'}
            />

            <FlexWrapper>
              <TextField
                label="Highlight #1"
                name="highlights1"
                placeholder="Add here brief insights from or key features of the data"
                maxLength={100}
                value={formik.values.highlights1}
                onChange={(e) => {
                  formik.setFieldValue('highlights1', e);
                }}
              />
              <TextField
                label="Highlight #2"
                name="highlights2"
                placeholder="Add here brief insights from or key features of the data"
                maxLength={100}
                value={formik.values.highlights2}
                onChange={(e) => {
                  formik.setFieldValue('highlights2', e);
                }}
              />
            </FlexWrapper>

            <Accordion
              type="single"
              collapsible
              key={'Additional Fields'}
              value={currentAccordion}
              onValueChange={(e: any) => setCurrentAccordion(e)}
            >
              <StyledTabItem value="Additional">
                <StyledTabTrigger>
                  <Heading
                    variant={'h5'}
                    fontWeight={'bold'}
                    color={'var(--text-light)'}
                  >
                    Optional Fields{' '}
                  </Heading>
                  <div>
                    {currentAccordion === 'Additional' ? (
                      <Minus fill="var(--color-primary)" />
                    ) : (
                      <Plus fill="var(--color-primary)" />
                    )}
                  </div>
                </StyledTabTrigger>

                <StyledTabContent>
                  <TextField
                    label={'Conforms To'}
                    name="confirmsTo"
                    maxLength={100}
                    value={formik.values.confirms_to}
                    onChange={(e) => {
                      formik.setFieldValue('confirms_to', e);
                    }}
                    externalHelpLink={dcatLinks.confirms_to}
                  />
                  <TextField
                    label={'Contact Point'}
                    name="contact_point"
                    maxLength={100}
                    value={formik.values.contact_point}
                    onChange={(e) => {
                      formik.setFieldValue('contact_point', e);
                    }}
                    externalHelpLink={dcatLinks.contact_point}
                  />
                  <TextField
                    label={'In Series'}
                    name="in_series"
                    maxLength={100}
                    value={formik.values.in_series}
                    onChange={(e) => {
                      formik.setFieldValue('in_series', e);
                    }}
                    externalHelpLink={dcatLinks.in_series}
                  />
                  <TextField
                    label={'Language'}
                    name="language"
                    maxLength={100}
                    value={formik.values.language}
                    onChange={(e) => {
                      formik.setFieldValue('language', e);
                    }}
                    externalHelpLink={dcatLinks.language}
                  />
                  <TextField
                    label={'Qualified Attribution'}
                    name="qualified_attribution"
                    maxLength={100}
                    value={formik.values.qualified_attribution}
                    onChange={(e) => {
                      formik.setFieldValue('qualified_attribution', e);
                    }}
                    externalHelpLink={dcatLinks.qualified_attribution}
                  />
                  <FlexWrapper>
                    <TextField
                      label={'Spatial Coverage'}
                      name="spatial_coverage"
                      maxLength={100}
                      value={formik.values.spatial_coverage}
                      onChange={(e) => {
                        formik.setFieldValue('spatial_coverage', e);
                      }}
                      externalHelpLink={dcatLinks.spatial_coverage}
                    />
                    <TextField
                      label={'Spatial Resolution'}
                      name="spatial_resolution"
                      maxLength={100}
                      value={formik.values.spatial_resolution}
                      onChange={(e) => {
                        formik.setFieldValue('spatial_resolution', e);
                      }}
                      externalHelpLink={dcatLinks.spatial_resolution}
                    />
                  </FlexWrapper>
                  <FlexWrapper>
                    <TextField
                      label={'Temporal Coverage'}
                      name="temporal_coverage"
                      maxLength={100}
                      value={formik.values.temporal_coverage}
                      onChange={(e) => {
                        formik.setFieldValue('temporal_coverage', e);
                      }}
                      externalHelpLink={dcatLinks.temporal_coverage}
                    />
                    <TextField
                      label={'Temporal Resolution'}
                      name="temporal_resolution"
                      maxLength={100}
                      value={formik.values.temporal_resolution}
                      onChange={(e) => {
                        formik.setFieldValue('temporal_resolution', e);
                      }}
                      externalHelpLink={dcatLinks.temporal_resolution}
                    />
                  </FlexWrapper>
                  <TextField
                    label={'Theme'}
                    name="theme"
                    maxLength={100}
                    value={formik.values.theme}
                    onChange={(e) => {
                      formik.setFieldValue('theme', e);
                    }}
                    externalHelpLink={dcatLinks.theme}
                  />
                </StyledTabContent>
              </StyledTabItem>
            </Accordion>
          </>
        </Status>
        <Text>
          *The Metadata framework is adopted from{' '}
          <Link
            href={'https://www.w3.org/TR/vocab-dcat-3/'}
            target="_blank"
            external
          >
            DCAT v3 <LinkOutLight size={10} />
          </Link>
        </Text>
      </ComponentWrapper>
      <SubmitFotter>
        <Flex justifyContent={'flex-end'} gap="10px" flexWrap={'wrap'}>
          <Button
            kind="primary-outline"
            type="submit"
            title={'Preview Dataset'}
            onPress={() => {
              setUserFurtherAction('Preview');
              formik.handleSubmit();
            }}
          >
            Save and Preview Dataset
          </Button>

          <Button
            kind="primary"
            type="submit"
            onPress={() => {
              setUserFurtherAction('Distribution');
              formik.handleSubmit();
            }}
            title={'Move to Distributions'}
          >
            Save & Move to Distributions
          </Button>
        </Flex>
      </SubmitFotter>
    </>
  );
};

export { Metadata };

export const ComponentWrapper = styled.div`
  background-color: var(--color-background-lighter);
  /* border: 3px solid var(--color-background-alt-dark); */
  padding: 24px;
`;
const FlexWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  flex-wrap: wrap;
  width: 100%;
  > div {
    width: 100%;
  }
`;
const DateWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  div {
    flex-grow: 1;
    align-items: flex-start;
    min-width: 200px;
    /* flex: 1 0 25%; */
  }
  @media (max-width: 925px) {
    div {
      width: 100%;
    }
  }
`;
const Status = styled.form`
  > div {
    margin-bottom: 20px;
  }
`;

const StyledTabItem = styled(AccordionItem)`
  background-color: var(--color-background-lightest);
  margin-top: 16px;
`;

const StyledTabTrigger = styled(AccordionTrigger)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  width: 100%;
  padding-block: 12px 8px;
  padding-inline: 0;
  background-color: var(--color-background-lightest);
  border-bottom: 1px solid var(--color-grey-500);

  font-weight: 600;
  font-size: 18px;

  > div {
    display: flex;
    align-items: center;
    gap: 8px;
  }
`;

const StyledTabContent = styled(AccordionContent)`
  padding-block: 16px;
  > div {
    margin-bottom: 20px;
  }
`;
export const SubmitFotter = styled.div`
  margin-block: 16px;
  padding: 16px;
  background-color: var(--color-background-lightest);
`;
