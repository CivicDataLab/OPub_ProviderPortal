import { createGlobalStyle } from 'styled-components';
import { transparentize } from 'polished';
import cssReset from './Reset';
import cssNormalise from './Normalise';
import { DEFAULT_THEME } from 'config/theme';
import { MenuContent } from 'components/actions/Menu/MenuComp';
import { themes } from './themes';

const theme = DEFAULT_THEME;

export const GlobalStyle = createGlobalStyle`
${cssReset}
${cssNormalise}
${themes}

html {

  /* Older starts here */
  /* --color-primary: ${theme.primary};
  --color-secondary : ${theme.color_maple_100};
  --color-tertiary : ${theme.color_olive_100}; */

  --color-tag-yellow: ${theme.color_tag_yellow};

  --color-background-alt-light: ${theme.background_color_alternate_light};
  --color-background-alt-dark:${theme.background_color_alternate_black};


  /* --color-background-dark : ${theme.background_dark}; */
  --background-dark-hover : ${theme.color_amazon_600};
  --color-background-darker : ${theme.background_darker};
  /* --color-background-light : ${theme.background_light}; */
  --color-background-lighter : ${theme.background_lighter};

  --color-white : ${theme.color_white};
  --color-violet : ${theme.color_violet};
  --color-honey : ${theme.color_honey};
  --color-amazon-100 : ${theme.color_amazon_100};
  --color-amazon-200 : ${theme.color_amazon_200};
  --color-amazon-300 : ${theme.color_amazon_300};
  --color-amazon-400 : ${theme.color_amazon_400};
  --color-amazon-500 : ${theme.color_amazon_500};
  --color-amazon-600 : ${theme.color_amazon_600};
  --color-carrot : ${theme.color_carrot};
  --color-carrot-2 : ${theme.color_carrot_2};
  --color-carrot-3 : ${theme.color_carrot_3};
  --color-violet-3 : ${theme.color_violet_3};
  --color-sapphire-3 : ${theme.color_sapphire_3};
  --color-sapphire-5 : ${theme.color_sapphire_5};

  --color-success : ${theme.color_success};
  --color-error : ${theme.color_error};
  --color-warning : ${theme.color_warning};
  --color-notice : ${theme.color_notice};

  --color-grey-100 : ${theme.grey_100};
  --color-grey-200 : ${theme.grey_200};
  --color-grey-300 : ${theme.grey_300};
  --color-grey-400 : ${theme.grey_400};
  --color-grey-500 : ${theme.grey_500};
  --color-grey-600 : ${theme.grey_600};

  --text-high : ${theme.text_light_high};
  --text-medium : ${theme.text_light_medium};
  --text-light : ${theme.text_light_light};
 --text-disabled : ${theme.text_light_disabled};

  --text-high-on-dark : ${theme.text_dark_high};
  --text-medium-on-dark : ${theme.text_dark_medium};
  --text-light-on-dark : ${theme.text_dark_light};
  --text-disabled-on-dark : ${theme.text_dark_disabled};

  --gradient-basic : ${theme.gradient_basic};
  --gradient-hotPink : ${theme.gradient_hotPink};
  --gradient-sapphire : ${theme.gradient_sapphire};

  --border-1 : 1px solid var(--color-grey-500);
  --border-2 : 1px solid var(--color-grey-600);
  --box-shadow-1 : 0px 4px 12px rgba(0, 0, 0, 0.08);
  --box-shadow-inset: inset 0px 0px 4px rgba(0, 0, 0, 0.08);
  --separator-5: 1px solid ${transparentize('0.5', `${theme.grey_500}`)};
  --separator-5-2: 2px solid ${transparentize('0.5', `${theme.grey_500}`)};
  --separator-6: 1px solid ${transparentize('0.5', `${theme.grey_500}`)};

  --font-weight-bold: 600;
  --font-weight-medium: 500;
  --font-weight-light: 400;

  --nav-bg: var(--color-background-dark);
  --nav-bg-hover: var(${theme.navigation_background_hover});
  --nav-submenu: var(--color-amazon-400);
  --nav-submenu-hover: var(--color-amazon-600);
  --nav-mobile: var(--color-amazon-400);
  
  box-sizing: border-box;

  &.ReactModal__Html--open {
    overflow-y: hidden;
  }
}
*, *:before, *:after {
  box-sizing: inherit;
}

/* :focus-visible {
  outline: 3px solid #78aeda !important;
} */

.focus-ring {
  box-shadow: 0 0 0 2px var(--form-active);
}

html {
  font-size: 16px;

  @font-face {
  font-family: 'Mukta';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: local('Mukta-Regular'), url(/fonts/Mukta-Regular.ttf) format('ttf');
}

  @font-face {
  font-family: 'Mukta';
  font-style: bold;
  font-weight: 700;
  font-display: swap;
  src: local('Mukta-Bold'), url(/fonts/Mukta-Bold.ttf) format('ttf');
}
}

body {
  margin: 0;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-family: 'Mukta',-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
		Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif !important;
  background-color: var(--color-background-light);
  line-height: 1.5;
  color: var(--text-high);
}

#__next {
  min-height: 100vh;
}

button {
  border:  none;
  background: none;
  cursor: pointer;
}

a {
  color: inherit;
}

ul, ol {
  margin: 0;
  padding: 0;
}

.sr-only {
  &:not(:where(:focus, :active, :focus-within)) {
    clip: rect(0 0 0 0);
    clip-path: inset(50%);
    height: 1px;
    overflow: hidden;
    position: absolute;
    white-space: nowrap;
    width: 1px;
  }
}

.container {
  padding-right: 15px;
  padding-left: 15px;
  margin-right: auto;
  margin-left: auto;
  
  width: calc(100vw - 20px);
  max-width: 1246px;
}

.containerDesktop {
  padding-right: 15px;
  padding-left: 15px;
  margin-right: auto;
  margin-left: auto;
  
  width: calc(100vw - 20px);
  max-width: 1246px;

  @media (max-width: 780px) {
    width: 100%;
    max-width: 100%;
  }
}

.header-freeze {
  position: sticky;
  top: 0;
  z-index: 999;
  background-color: #fff;

  @media (max-width: 800px) {
    position: initial
  }
}

.img-cover {
   object-fit: cover;
}
.img-contain {
   object-fit: contain;
}

.fill {
    flex-grow: 1;

    button {
      width: 100%;
    }

    ${MenuContent} {
      width: 100%;
    }
  }

  .onlyMobile {
    display: none;

    @media (max-width: 640px) {
      display: block;
    }
  }

  .onlyDesktop {
    display: block;

    @media (max-width: 640px) {
      display: none;
    }
  }

button.scroll-to-top  {
  border-radius: 20px;
  outline: 2px solid var(--color-primary-01);
  box-shadow: var(--box-shadow-1);
  line-height: 0;

  @media (max-width: 640px) {
    width: 32px;
    height: 32px;
    bottom: 20px;
    right: 20px;

    svg {
      width: 20px;
      height: 20px;
    }
  }
}
`;
