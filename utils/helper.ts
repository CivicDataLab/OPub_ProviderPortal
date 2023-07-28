export function sectionCollapse(e: any, wrapperRef) {
  const btn = e.target;
  const target = btn.nextElementSibling;
  const expanded = btn.getAttribute('aria-expanded') === 'true';

  const selectedBtn = wrapperRef.current.querySelector(
    '[aria-expanded = "true"]'
  );
  if (selectedBtn && !expanded) {
    selectedBtn.setAttribute('aria-expanded', 'false');
    (selectedBtn.nextElementSibling as HTMLElement).hidden = true;
  }

  btn.setAttribute('aria-expanded', !expanded);
  target.hidden = expanded;
}

export function truncate(str, num) {
  if (str?.length > num) {
    return str.slice(0, num) + '...';
  } else {
    return str;
  }
}

export function simplifyNaming(key, obj) {
  if (obj[key]) return obj[key];
  else return key;
}

export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export const convertDateFormat = (toBeConverted) => {
  const date = new Date(toBeConverted);
  return `${date.getDate()} ${date.toLocaleString('default', {
    month: 'short',
  })} ${date.getFullYear().toString()}`;
};

// * Converts date format to YYYY-MM-DD

export const convertDateFormatWithoutTimezone = (dateObj) => {
  const year = dateObj.toLocaleString('default', { year: 'numeric' });
  const month = dateObj.toLocaleString('default', { month: '2-digit' });
  const day = dateObj.toLocaleString('default', { day: '2-digit' });
  return `${year}-${month}-${day}`;
};

export const omit = (originalObj = {}, keysToOmit: string[]) =>
  Object.fromEntries(
    Object.entries(originalObj).filter(([key]) => !keysToOmit.includes(key))
  );

export function deSlug(id: string | string[]) {
  if (id) {
    const str = String(id);
    return str.toLowerCase().split('-').join('');
  }
  return id;
}

export function slug(id: string | string[]) {
  if (id) {
    let str = String(id);
    return str.split(' ').join('-');
  }
  return id;
}

export function getOrgDetails(roles, provider) {
  const currentOrg = roles
    ? roles?.filter(
        (item) =>
          item['org_title'] &&
          slug(item['org_title']) == slug(provider) &&
          item['status'].toLowerCase() === 'approved'
      )[0]
    : {};

  return currentOrg;
}

export function getRandomColor(name) {
  // get first alphabet in upper case
  const firstAlphabet = name.charAt(0).toLowerCase();

  // get the ASCII code of the character
  const asciiCode = firstAlphabet.charCodeAt(0);

  // number that contains 3 times ASCII value of character -- unique for every alphabet
  const colorNum =
    asciiCode.toString() + asciiCode.toString() + asciiCode.toString();

  var num = Math.round(0xffffff * parseInt(colorNum));
  var r = (num >> 16) & 255;
  var g = (num >> 8) & 255;
  var b = num & 255;

  return {
    color: 'rgb(' + r + ', ' + g + ', ' + b + ', 0.3)',
    character: firstAlphabet.toUpperCase(),
  };
}

export function dateFormat(date) {
  const options: any = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  if (!date?.length) return '-';
  return new Date(date).toLocaleString('en-IN', options) || '';
}

export function toCamelCase(str) {
  return str
    ?.split(' ')
    .map(function (word, index) {
      // If it is not the first word only upper case the first char and lowercase the rest.
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join('');
}

export function formatDate(oDate) {
  var oTempDate = new Date(oDate),
    sMonth = '' + (oTempDate.getMonth() + 1),
    sDay = '' + oTempDate.getDate(),
    iYear = oTempDate.getFullYear();

  if (sMonth.length < 2) {
    sMonth = '0' + sMonth;
  }
  if (sDay.length < 2) {
    sDay = '0' + sDay;
  }

  return [sDay, sMonth, iYear].join('-');
}

export function dateTimeFormat(date) {
  const options: any = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  };
  if (!date?.length) return '-';
  return (
    new Date(date).toLocaleString('en-IN', options).toLocaleUpperCase() || ''
  );
}

export function getDuration(from, to) {
  const options: any = {
    month: 'short',
    year: 'numeric',
  };
  if (!from || !to) return '-';
  const fromStr = new Date(from).toLocaleString('en-IN', options) || '';
  const toStr =
    to === 'Till Date'
      ? 'Till Date'
      : new Date(to).toLocaleString('en-IN', options) || '';

  return `${fromStr} - ${toStr}`;
}

export function debounce(func, timeout = 500) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}

// counts the occurence of key inside array
export function countOccurrence(iterable, key) {
  return iterable.filter((e) => e === key).length;
}

// counts the occurence of key inside array
export function countOccurrenceObj(iterable, keys) {
  const abc = {};
  keys.forEach((elm) => {
    abc[elm] = 0;
  });

  return iterable.forEach((e) => {
    if (abc[e]) abc[e] += 1;
  });
}

export function capitalize(str, deslug = false) {
  if (deslug) {
    return str
      .toLowerCase()
      .replaceAll('-', ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }
  return str.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

function copyScript(id) {
  var codeText = document.getElementById(id).textContent;
  var textArea = document.createElement('textarea');
  textArea.className = 'sr-only';
  textArea.textContent = codeText;

  const wrapper = document.getElementById('api-modal');
  wrapper.append(textArea);
  textArea.focus();
  textArea.select();
  document.execCommand('copy');
  // toast.success('Code copied successfully');
}

function copyWithNavigator(id) {
  var text_to_copy = document.getElementById(id).innerHTML;

  if (!navigator.clipboard) {
    copyScript(id);
  } else {
    navigator.clipboard
      .writeText(text_to_copy)
      .then(function () {
        // toast.success('Code copied successfully');
      })
      .catch(function () {
        // toast.error('Error while copying code');
      });
  }
}

export function scrollTo(id, offset) {
  const element = document.getElementById(id as string);
  if (element) {
    var elementPosition = element.getBoundingClientRect().top;
    var offsetPosition = elementPosition + window.pageYOffset - offset;
    window?.scrollTo({ behavior: 'smooth', top: offsetPosition });
  }
}

export const prepareCSVPreviewForTable = (csvData) => {
  const totalArray = csvData;
  if (csvData.length == 0) {
    return {
      columnData: [
        {
          headerName: '',
        },
      ],
      rows: [],
    };
  }
  const columnData = Object?.keys(totalArray[0]).map((item) => {
    return {
      headerName: item,
    };
  });

  const rowsData = totalArray.map((item) => {
    const rowElements = Object.values(item);
    const singleRow = {};
    rowElements.forEach((element, index) => {
      singleRow[columnData[index]?.headerName || 'dummy'] = element;
    });
    return singleRow;
  });

  return {
    columnData: columnData,
    rows: rowsData,
  };
};
