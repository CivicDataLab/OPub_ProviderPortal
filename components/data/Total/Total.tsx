import { Heading } from 'components/layouts';
import { Flex } from 'components/layouts/FlexWrapper';

const Total: React.FC<{ total: number; text?: string }> = ({ total, text }) => {
  return (
    <Flex alignItems="center" gap="4px">
      <Heading variant="h5l" as="span" color={`var(--text-medium)`}>
        {text ? text + ' ' : 'Results'}
      </Heading>
      <Heading variant="h5" as="span" color={`var(--color-gray-06)`}>
        {total?.toLocaleString('en', { useGrouping: true }) || 0} Datasets
      </Heading>
    </Flex>
  );
};

export default Total;
