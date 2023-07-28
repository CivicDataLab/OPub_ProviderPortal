import { useQuery } from '@apollo/client';
import { Button } from 'components/actions';
import { Loader } from 'components/common';
import { CarouselMultiple, Heading } from 'components/layouts';
import { Flex } from 'components/layouts/FlexWrapper';
import { NextLink } from 'components/layouts/Link';
import { Text } from 'components/layouts/Text';
import useTranslation from 'next-translate/useTranslation';
import React from 'react';
import { GET_ACTIVE_SECTOR } from 'services';
import styled from 'styled-components';
import { SectorCard } from './SectorCard';
import { useWindowSize } from 'utils/hooks';

const HomeSectors = () => {
  const [sectorData, setSectorData] = React.useState([]);
  const windowSize = useWindowSize();

  const allSectorRes = useQuery(GET_ACTIVE_SECTOR);

  React.useEffect(() => {
    if (allSectorRes.data) {
      const data = [...allSectorRes.data.active_sector]
        .sort((a, b) => {
          return a.dataset_count > b.dataset_count
            ? -1
            : b.dataset_count > a.dataset_count
            ? 1
            : 0;
        })
        .slice(0, 8);

      setSectorData(data);
    }
  }, [allSectorRes.data]);

  const { t } = useTranslation('home');

  return (
    <Wrapper>
      <div className="container">
        <Flex flexDirection={'column'} alignItems={'center'}>
          <Heading variant="h2" as="h2">
            {t('explore-the-sectors-1')}{' '}
            <Text color={'var(--color-secondary-01)'}>
              {t('explore-the-sectors-2')}
            </Text>
          </Heading>
          <Heading variant="h4" as="h3" color="var(--text-light)" mt="4px">
            {t('browse-data-and-apis-organised-by-sectors')}
          </Heading>
        </Flex>

        <List>
          {!allSectorRes.loading ? (
            sectorData.map((sectorItem, index) => (
              <li key={`CategoryItem-${index}`}>
                <SectorCard sectorItem={sectorItem} />
              </li>
            ))
          ) : (
            <Loader />
          )}
        </List>
        <MobileList>
          {sectorData.length > 0 && (
            <CarouselMultiple label="Sector List" hideButtons showDots>
              {sectorData.map((sectorItem, index) => (
                <CardContainer key={`CategoryItsm-${index}`}>
                  <SectorCard sectorItem={sectorItem} />
                </CardContainer>
              ))}
            </CarouselMultiple>
          )}
        </MobileList>

        <Explore>
          <NextLink href="/sectors">
            <Button
              kind="primary"
              data-type="explore"
              size={windowSize.width > 480 ? 'md' : 'sm'}
            >
              {t('view-all-sectors')}
            </Button>
          </NextLink>
        </Explore>
      </div>
    </Wrapper>
  );
};

export default HomeSectors;

const Wrapper = styled.section`
  margin-top: 64px;

  @media (max-width: 640px) {
    margin-top: 40px;

    h3 {
      text-align: center;
    }
  }

  span {
    font-weight: var(--font-bold);
  }
`;

const List = styled.ul`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(270px, 100%), 1fr));
  gap: 24px;
  margin-top: 40px;

  > div {
    height: 25vh;
  }

  @media (max-width: 640px) {
    margin-top: 22px;
    display: none;
  }
`;

const Explore = styled.div`
  margin-top: 40px;

  button {
    margin: auto;
  }

  @media (max-width: 640px) {
    margin-top: 24px;
  }
`;

const CardContainer = styled.div`
  min-width: 312px;
`;

const MobileList = styled.div`
  display: none;

  @media (max-width: 640px) {
    display: block;
  }
`;
