export function filterChange(category, selectedArr, selectedFilters) {
  selectedFilters[category] = selectedArr;

  const final = [];
  Object.keys(selectedFilters).forEach((val) => {
    if (selectedFilters[val].length > 0) {
      let filter = '';

      filter = filter.concat(`${val}=`);
      const valArray = [];
      typeof selectedFilters[val] === 'object' &&
        selectedFilters[val].forEach((item: string) => {
          valArray.push(`${item.replaceAll('&', '%26')}`);
        });

      const valString = valArray.join(' T1I= '); // Base64 of `OR`
      filter = filter.concat(valString);
      final.push(filter);
    }
  });

  const finalFilter = final.join(' QU5E '); // Base64 of `AND`
  return finalFilter;
}
