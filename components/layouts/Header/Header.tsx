import Link from 'next/link';
import styled from 'styled-components';
import { Heading } from 'components/layouts';
import { SearchField } from 'components/form';
import { useRouter } from 'next/router';

const Header = ({ data }) => {
  const router = useRouter();
  function handleclear() {
    router.replace({
      pathname: router.pathname,
      query: {
        ...router.query,
        q: '',
      },
    });
  }
  return (
    <HeaderWrapper>
      <div className="containerDesktop">
        {data.previousPage && (
          <Link href={data.previousLink}>
            <a>{`< Go Back to ${data.previousPage}`}</a>
          </Link>
        )}

        <HeadingWrapper>
          <Heading variant="h2" as="h1">
            {data.title}
          </Heading>

          {data.search && (
            <SearchField
              id="sectorProviderSearch"
              onSubmit={(e) => {
                router.replace({
                  pathname: router.pathname,
                  query: {
                    ...router.query,
                    q: e || '',
                  },
                });
              }}
              onClear={handleclear}
              showSubmit
              defaultValue={(router.query?.q as string) || ''}
              placeholder={data.searchPlaceholder || 'Search'}
              aria-label="Search through the list"
            />
          )}
        </HeadingWrapper>
      </div>
    </HeaderWrapper>
  );
};

export default Header;

export const HeaderWrapper = styled.div`
  background-color: var(--color-background-lightest);

  > div {
    padding-block: 20px;
    display: block;
  }

  @media (max-width: 640px) {
    > div {
      padding-block: 16px;
    }
  }
`;

const HeadingWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 640px) {
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    gap: 12px;
  }
`;
