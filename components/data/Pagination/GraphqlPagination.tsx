import { useRouter } from 'next/router';
import React from 'react';
import {
  PaginationComp,
  PaginationJump,
  PaginationButtons,
  ButtonsLabel,
} from './PaginationComp';
import { Button } from 'components/actions';
import { ArrowDown } from 'components/icons';
import { Select } from 'components/form';
import useEffectOnChange from 'utils/hooks';

const paginationItems = [
  {
    label: '5',
    value: '5',
  },
  {
    label: '10',
    value: '10',
  },
  {
    label: '20',
    value: '20',
  },
];

const GraphqlPagination: React.FC<{ total: number; newPage: any }> = ({
  total,
  newPage,
}) => {
  const router = useRouter();
  const [page, setPage] = React.useState(1);
  const [resultSize, setResultSize] = React.useState(router.query.first || '5');
  const [maxPage, SetMaxPage] = React.useState(0);

  React.useEffect(() => {
    const first: any = router.query.first || '10';
    const skip: any = router.query.skip || '0';
    // total 62
    SetMaxPage(Math.floor((total - 1) / parseInt(first)) + 1);

    const pageNo = Math.floor(parseInt(skip) / parseInt(first) + 1);
    (document.getElementById('jumpNumber') as HTMLInputElement).value =
      String(pageNo);

    setPage(pageNo);
  }, [router.query.first, page, resultSize, total, router.query.skip]);

  useEffectOnChange(() => {
    if (router.query.first) {
      setResultSize(router.query.first);
      fetchNewResults('0', 'skip');
    }
  }, [router.query.first]);

  function fetchNewResults(val: any, type: string) {
    newPage({
      value: val,
      query: type,
    });
  }

  function handleJump(val: string) {
    const jumpVal = parseInt(val);
    if (!(jumpVal < 1 || jumpVal > maxPage || jumpVal == page)) {
      const first: any = router.query.first || '5';
      const skip = (jumpVal - 1) * parseInt(first);
      fetchNewResults(skip, 'skip');
    }
  }

  function handleButton(val: number) {
    if (!((page == 1 && val == -1) || (page == maxPage && val == 1))) {
      const first: any = router.query.first || '5';
      const oldFrom: any = router.query.skip || '0';

      let skip = parseInt(oldFrom) + val * parseInt(first);
      if (skip < 0) skip = 0;
      fetchNewResults(skip, 'skip');
    }
  }

  return (
    <PaginationComp className="pagination">
      <Select
        label="Rows: "
        labelSide="left"
        inputId="pagination-menu"
        instanceId="pagination-menu-1"
        aria-label="Pagination Menu datasets"
        options={paginationItems}
        isSearchable={false}
        defaultValue={{ value: resultSize, label: resultSize }}
        onChange={(e) => fetchNewResults(e.value, 'first')}
      />

      <PaginationJump>
        <label className="label-green" htmlFor="jumpNumber">
          Jump to: &nbsp;
          <input
            type="text"
            id="jumpNumber"
            onBlur={(e) => handleJump(e.target.value)}
            maxLength={50}
            onKeyDown={(e) => {
              e.key === 'Enter'
                ? handleJump(e.target['value'] ? e.target['value'] : '')
                : '';
            }}
          />
        </label>
      </PaginationJump>

      <PaginationButtons>
        <ButtonsLabel>
          Page: {<span>{page}</span>} of {<span>{maxPage}</span>}
        </ButtonsLabel>
        <div>
          <Button
            onPress={() => handleButton(-1)}
            className="pagination__back"
            icon={<ArrowDown />}
            iconOnly={true}
            isDisabled={page === 1}
          >
            Previous Page
          </Button>
          <Button
            onPress={() => handleButton(1)}
            className="pagination__next"
            icon={<ArrowDown />}
            iconOnly={true}
            isDisabled={page === maxPage}
          >
            Next Page
          </Button>
        </div>
      </PaginationButtons>
    </PaginationComp>
  );
};

export default GraphqlPagination;
