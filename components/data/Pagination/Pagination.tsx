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

const Pagination: React.FC<{
  total: number;
  newPage: any;
  MultipleSort?: string;
}> = ({ total, newPage, MultipleSort = '5' }) => {
  const paginationItems = [
    {
      label: (+MultipleSort * 1).toString(),
      value: (+MultipleSort * 1).toString(),
    },
    {
      label: (+MultipleSort * 2).toString(),
      value: (+MultipleSort * 2).toString(),
    },
    {
      label: (+MultipleSort * 4).toString(),
      value: (+MultipleSort * 4).toString(),
    },
  ];

  const router = useRouter();
  const [page, setPage] = React.useState(1);
  const [resultSize, setResultSize] = React.useState(
    router.query.size || MultipleSort
  );
  const [maxPage, SetMaxPage] = React.useState(0);

  React.useEffect(() => {
    const from: any = router.query.from || '0';
    const size: any = router.query.size || MultipleSort;
    SetMaxPage(Math.floor((total - 1) / parseInt(size)) + 1);

    const pageNo = Math.floor(parseInt(from) / parseInt(size) + 1);
    (document.getElementById('jumpNumber') as HTMLInputElement).value =
      String(pageNo);

    setPage(pageNo);
  }, [router.query.from, page, resultSize, total]);

  useEffectOnChange(() => {
    if (router.query.size) {
      setResultSize(router.query.size);
      fetchNewResults('0', 'from');
    }
  }, [router.query.size]);

  function fetchNewResults(val: any, type: string) {
    newPage({
      value: val,
      query: type,
    });
  }

  function handleJump(val: string) {
    const jumpVal = parseInt(val);
    if (!(jumpVal < 1 || jumpVal > maxPage || jumpVal == page)) {
      const size: any = router.query.size || MultipleSort;
      const from = (jumpVal - 1) * parseInt(size);
      fetchNewResults(from, 'from');
    }
  }

  function handleButton(val: number) {
    if (!((page == 1 && val == -1) || (page == maxPage && val == 1))) {
      const size: any = router.query.size || MultipleSort;
      const oldFrom: any = router.query.from || '0';

      let from = parseInt(oldFrom) + val * parseInt(size);
      if (from < 0) from = 0;
      fetchNewResults(from, 'from');
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
        onChange={(e) => fetchNewResults(e.value, 'size')}
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

export default Pagination;
