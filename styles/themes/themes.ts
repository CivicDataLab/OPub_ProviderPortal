import { css } from 'styled-components';
import { blue } from './blue';

export const themes = css`
  [data-contrast='true'] {
    filter: invert(100%);
  }

  [data-theme='blue'] {
    ${blue}
  }
`;

export const defaultTheme = 'blue';

// TODO remove the `img` logic when there is another theme
export function setTheme(theme) {
  if (theme == 'contrast') {
    document.querySelector('html').setAttribute('data-contrast', 'true');
    document
      .querySelectorAll('img')
      .forEach((e) => (e.style.filter = 'invert(100%)'));
  } else {
    document.querySelectorAll('img').forEach((e) => (e.style.filter = ''));
    document.querySelector('html').setAttribute('data-contrast', 'false');
    document.querySelector('html').setAttribute('data-theme', theme);
  }
}
