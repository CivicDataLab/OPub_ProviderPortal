import { useMutation } from '@apollo/client';
import {
  ChevronDown,
  Data,
  FileData,
  Info,
  NewsAdd,
} from '@opub-icons/workflow';
import {
  Accordion as AC,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from 'components/actions/Accordian/Accordian';
import { Heading } from 'components/layouts';
import { toast } from 'react-toastify';
import { ADD_RATING, mutation } from 'services';
import styled from 'styled-components';
import AboutData from './AboutData';
import { ProviderInfoCard } from './ProviderInfoCard';
import { DatasetAccessTab } from './DatasetAccessTab';
import ExternalDam from './ExternalDam';
import DataAndApis from './DataAndApis';
import DataStories from './DataStories';
import React from 'react';

export const MobileExplorerInfo = ({ datasetID, headerData, vizCompData }) => {
  const [selectedTab, setSelectedTab] = React.useState('');
  const [addRatingReq, addRatingResponse] = useMutation(ADD_RATING);

  const handleSubmit = (review, rating, clearFormOnSubmit) => {
    if (!addRatingResponse.loading && !addRatingResponse.error) {
      mutation(addRatingReq, addRatingResponse, {
        rating_data: {
          id: '',
          dataset: datasetID,
          review: review,
          data_quality: rating,
        },
      })
        .then(() => {
          toast.success(
            'Rating and Review submitted for moderation successfully!'
          );
          clearFormOnSubmit();
        })
        .catch((err) => {
          const errorMessage = err.toString().slice(7).split(',')[0];
          toast.error(errorMessage);
        });
    }
  };

  function handleGetAccessClick() {
    setSelectedTab(
      headerData.dataset_type !== 'EXTERNAL'
        ? 'Dataset Access Models'
        : 'Policy & Licence'
    );
  }

  const AccordionItems = [
    {
      title: 'About',
      data: (
        <AboutData
          callBack={(review, rating, clearFormOnSubmit) => {
            handleSubmit(review, rating, clearFormOnSubmit);
          }}
          datasetID={datasetID}
          data={headerData}
        />
      ),
      icon: <Info width={20} fill={'var(--color-primary-01)'} />,
    },
    {
      title:
        headerData.dataset_type !== 'EXTERNAL'
          ? 'Distributions'
          : 'Distributions Links',
      data: (
        <DataAndApis
          data={vizCompData}
          other={{ ...headerData, clickHandler: handleGetAccessClick }}
        />
      ),
      icon: <Data width={20} fill={'var(--color-primary-01)'} />,
    },
    {
      title:
        headerData.dataset_type !== 'EXTERNAL'
          ? 'Dataset Access Models'
          : 'Policy & Licence',
      data:
        headerData.dataset_type !== 'EXTERNAL' ? (
          <DatasetAccessTab datasetId={datasetID} />
        ) : (
          <ExternalDam data={headerData} />
        ),
      icon: <FileData width={20} fill={'var(--color-primary-01)'} />,
    },
    {
      title: 'Additional Information',
      data: <DataStories data={headerData} />,
      icon: <NewsAdd width={20} fill={'var(--color-primary-01)'} />,
    },
  ];

  return (
    <div>
      <StyledAccordion
        type="single"
        collapsible
        value={selectedTab}
        onValueChange={setSelectedTab}
      >
        {AccordionItems.map((item) => {
          return (
            <Accordion
              key={item.title}
              data={item.data}
              title={item.title}
              icon={item.icon}
              setSelectedTab={setSelectedTab}
            />
          );
        })}
      </StyledAccordion>
      <CardWrapper className="containerDesktop">
        <ProviderInfoCard headerData={headerData} />
      </CardWrapper>
    </div>
  );
};

const Accordion = ({ data, title, icon, setSelectedTab }) => {
  return (
    <StyledItem value={title}>
      <StyledAccordionTrigger>
        <ACHeading>
          {icon}
          <Heading variant="h5" as="h2">
            {title}
          </Heading>
        </ACHeading>
        <ChevronDown size={24} color="var(--text-medium)" />
      </StyledAccordionTrigger>
      <StyledACContent>{data}</StyledACContent>
    </StyledItem>
  );
};

const StyledAccordion = styled(AC)`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 8px;
`;

const StyledItem = styled(AccordionItem)`
  background: var(--color-background-lightest);
  padding-inline: 24px;
`;

const StyledAccordionTrigger = styled(AccordionTrigger)`
  display: flex;
  justify-content: space-between;
  gap: 8px;

  padding-block: 16px;
  width: 100%;
  color: var(--color-primary-01);
  text-transform: capitalize;

  > svg {
    transition: transform 0.1s ease-in-out;
  }

  &[aria-expanded='true'] {
    > svg {
      transform: rotate(-180deg);
    }
  }
`;

const StyledACContent = styled(AccordionContent)`
  padding-block: 20px;
  border-top: 1px solid var(--color-gray-01);
`;

const ACHeading = styled.span`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CardWrapper = styled.div`
  margin-top: 16px;
`;
