import { Button } from 'components/actions';
import { Heading } from 'components/layouts';
import { useRouter } from 'next/router';
import styled from 'styled-components';

export const DatasetHeading = () => {
  const router = useRouter();

  return (
    <Wrapper>
      <Heading variant="h3" as="h1">
        Here to create new Dataset?
      </Heading>
      <Button
        as="a"
        size="sm"
        href={`/providers/${router.query.provider}/dashboard/datasets/create-new`}
      >
        Create Dataset
      </Button>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  padding: 24px;
  background-color: var(--color-white);
  margin-bottom: 24px;

  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
`;
