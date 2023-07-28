import { SearchField } from 'components/form';
import { Heading } from 'components/layouts';
import { Text } from 'components/layouts/Text';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useWindowSize } from 'utils/hooks';
import { Particle } from './Particle';
import useTranslation from 'next-translate/useTranslation';

const HomeHeader = ({ users, statsData, popularSearches }) => {
  const [search, setSearch] = useState('');
  const [popularSearchValue, setPopularSearchValue] = useState(false);
  const router = useRouter();

  const { t } = useTranslation('home');

  useEffect(() => {
    if (search !== '' && !popularSearchValue) {
      router.push({
        pathname: `/datasets`,
        query: {
          q: search,
        },
      });
    }
  }, [search]);

  useEffect(() => {
    if (search !== '' && popularSearchValue) {
      router.push({
        pathname: `/datasets`,
        query: {
          q: search,
        },
      });
    }
  }, [popularSearchValue]);

  function handleDatasetsChange(val) {
    setSearch(val);
  }

  function handlePopularSearch(value) {
    setSearch(value);
    setPopularSearchValue(true);
  }

  const list = [
    {
      label: 'Datasets',
      value: statsData?.dataset_count.toString() || '...',
      link: '/datasets',
    },
    {
      label: 'Geographies',
      value: statsData?.geography_count.toString() || '...',
    },
    {
      label: 'Sectors',
      value: statsData?.sector_count.toString() || '...',
      link: '/sectors',
    },
    {
      label: 'Providers',
      value: statsData?.organization_count.toString() || '...',
      link: '/providers',
    },
    {
      label: 'Consumers',
      value: users,
    },
  ];

  const windowSize: any = useWindowSize();

  return (
    <Wrapper>
      {windowSize.width > 680 ? (
        <Layer1>
          <Particle />
        </Layer1>
      ) : null}

      <div>
        <Header className="container">
          <TextWrapper>
            <Heading variant="h1" as="h1">
              {t('searching-for-nationwide datasets-1')}{' '}
              <Text color={'var(--color-primary-01)'}>
                {t('searching-for-nationwide datasets-2')}
              </Text>
              ?
            </Heading>

            <Heading color="var(--text-medium)" variant="h4" as="span">
              {t('find-and-access-high-quality-data-apis')}
            </Heading>
          </TextWrapper>

          <Container>
            <SearchField
              id="globalSearch"
              autoFocus={windowSize.width > 480}
              onSubmit={(e) => handleDatasetsChange(e)}
              defaultValue={search !== '' ? search : ''}
              showBtnLabel={windowSize.width > 480 ? true : false}
              showSubmit
              submitVisible={windowSize.width > 480 ? true : false}
              size={windowSize.width > 480 ? 'xl' : 'lg'}
              placeholder="Search here"
              aria-label="search through datasets"
              btnLabel="Search"
            />

            {popularSearches.length > 0 && (
              <PopularSearchTags>
                <Text variant="pt14" color={'var(--text-medium)'}>
                  {t('popular-searches')}
                </Text>
                <div>
                  {popularSearches?.map((item, index) => (
                    <button
                      onClick={() => handlePopularSearch(item)}
                      key={`${item}-${index}`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </PopularSearchTags>
            )}
          </Container>
        </Header>
        <Assets>
          <AssetsWrapper className="container">
            <Heading variant="h2" as="h2">
              <Text color={'var(--color-primary-01)'}>
                {t('our-assets-1')}{' '}
              </Text>
              {t('our-assets-2')}
            </Heading>
            <div className="arrow-icon">
              <Image
                src={'/assets/images/assets.svg'}
                alt="Arrow pointing towards right"
                width={72}
                height={36}
              />
            </div>
            <Stats>
              {list.map((item) => (
                <div key={item.label}>
                  <li>
                    <Heading
                      color="var(--color-secondary-01)"
                      variant="h3"
                      as="span"
                    >
                      {item.value}
                    </Heading>
                    <Heading variant="h5" as="span" color="var(--text-medium)">
                      {t(item.label.toLowerCase())}
                    </Heading>
                  </li>
                </div>
              ))}
            </Stats>
          </AssetsWrapper>
        </Assets>
      </div>
    </Wrapper>
  );
};

export default HomeHeader;

const Layer1 = styled.div`
  inset: 0%;
  z-index: 2;
  position: relative;

  .particles-js-canvas-el {
    canvas {
      min-height: 556px !important;
      position: absolute !important;
      z-index: -1;
    }
  }

  @media (max-width: 680px) {
    display: none;
  }
`;

const Wrapper = styled.header`
  isolation: isolate;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;

  position: relative;

  .container {
    z-index: 10;
    position: relative;
  }

  background-color: #f5f5f8;
`;

const Header = styled.div`
  @media (max-width: 990px) {
    margin-top: 16px;
  }

  @media (max-width: 640px) {
    margin-top: 0px;
  }
`;

const TextWrapper = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  padding-top: 56px;
  gap: 8px;

  h1 > span {
    font-weight: var(--font-bold);
  }

  h3 {
    color: var(--text-light);
  }

  @media (max-width: 640px) {
    padding-top: 20px;
  }
`;

const Container = styled.div`
  max-width: 800px;
  margin-inline: auto;
  margin-top: 40px;

  @media (max-width: 640px) {
    margin-top: 22px;
  }
`;

const PopularSearchTags = styled.div`
  margin-top: 24px;

  > div {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 10px;
  }

  button {
    background-color: var(--color-white);
    min-width: 97px;
    min-height: 32px;
    border-radius: 2px;
    padding: 4px 12px;
    border: 1px solid transparent;
    line-height: 1;

    &:hover {
      border-color: var(--color-primary-01);
    }
  }

  @media (max-width: 640px) {
    margin-top: 16px;
  }
`;

const Assets = styled.div`
  padding-top: 56px;
  max-width: 1008px;
  margin-inline: auto;

  @media (max-width: 640px) {
    margin-top: 32px;
    padding-top: 24px;
    padding-bottom: 26px;
    background-color: var(--color-background-lightest);
    box-shadow: var(--box-shadow);

    h3 {
      font-size: 1.5rem;
    }

    ul {
      justify-content: space-evenly;
    }
  }
`;

const AssetsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 14px;

  @media (max-width: 848px) {
    .arrow-icon {
      display: none;
    }
  }

  h3 > span {
    font-weight: var(--font-bold);
  }
`;

const Stats = styled.ul`
  margin-top: 12px;
  display: flex;
  flex-wrap: wrap;
  gap: 16px;

  @media (max-width: 848px) {
    margin-top: 0;
  }

  li {
    padding: 8px;
    border-radius: 2px;

    display: flex;
    flex-direction: column;
    gap: 4px;
    text-align: center;
  }
`;
