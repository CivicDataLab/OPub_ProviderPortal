import { Contrast, Reply, Workflow } from '@opub-icons/workflow';
import { Button } from 'components/actions';
import { Link } from 'components/layouts/Link';
import { Tooltip } from 'components/overlays';
import { useRouter } from 'next/router';
import { Select } from 'components/form';
import { Text } from 'components/layouts';
import React from 'react';
import styled from 'styled-components';
import { setTheme } from 'styles/themes';
import useTranslation from 'next-translate/useTranslation';

function changeTheme() {
  const isContrast = document
    .querySelector('html')
    .getAttribute('data-contrast');
  setTheme(!isContrast || isContrast == 'false' ? 'contrast' : 'blue');
}

const AccessibilityNav = () => {
  const router = useRouter();

  const { lang } = useTranslation();

  const langOptions = [
    {
      label: 'English',
      value: 'en',
    },
    {
      label: 'हिन्दी',
      value: 'hi',
    },
  ];

  const [disabled, setDisabled] = React.useState<
    'increase' | 'decrease' | 'none'
  >('none');

  const AccessibilityIcons = [
    {
      label: '-A',
      action: 'decrease',
      disabled: disabled === 'decrease',
    },
    {
      label: 'A',
      action: 'reset',
    },
    {
      label: 'A+',
      action: 'increase',
      disabled: disabled === 'increase',
    },
  ];

  function handleDisable(fontSize) {
    if (fontSize >= 20) setDisabled('increase');
    else if (fontSize <= 12) setDisabled('decrease');
    else setDisabled('none');
  }

  function changeFontSize(type, fontSize) {
    if (type == 'reset') return 16;

    if (type == 'increase') return fontSize + 1;

    if (type == 'decrease') return fontSize - 1;
  }

  function handleFontButton(type) {
    const el = document.querySelector('html');
    const style = window
      .getComputedStyle(el, null)
      .getPropertyValue('font-size');
    const fontSize = parseFloat(style);

    const newValue = changeFontSize(type, fontSize);
    handleDisable(newValue);
    el.style.fontSize = newValue + 'px';
  }

  return (
    <Wrapper>
      <div>
        <SkipLinks>
          <div>
            <Link
              href={'https://digitalindia.gov.in/'}
              rel="noopener noreferrer"
              color="var(--text-medium)"
              underline="always"
              variant="pt12"
              target="_blank"
              external
            >
              <span>A Digital India Initiative</span>
            </Link>
          </div>
          <div>
            <Link
              href={' #main'}
              color="var(--text-medium)"
              underline="always"
              variant="pt12"
              onClick={() => {
                if (document !== undefined) {
                  document?.getElementById('globalSearch')?.focus();
                }
              }}
            >
              Skip to Main Content
            </Link>
          </div>
        </SkipLinks>
        <RightSide>
          <FontSizer>
            {AccessibilityIcons.map((type, index) => (
              <Tooltip key={index}>
                <Button
                  data-disabled={type.disabled}
                  aria-label={'Font size ' + type.action}
                  isDisabled={type.disabled}
                  onPress={() => handleFontButton(type.action)}
                  kind="custom"
                >
                  {type.label}
                </Button>
                <span>{'Font size ' + type.action}</span>
              </Tooltip>
            ))}
          </FontSizer>
          <Buttons>
            <Tooltip>
              <Button
                kind="custom"
                onPress={() => changeTheme()}
                icon={<Contrast width={20} />}
                iconOnly
              >
                Change Theme
              </Button>
              <span>Change Theme</span>
            </Tooltip>

            <Tooltip>
              <Button
                kind="custom"
                data-type="sitemap"
                icon={<Workflow width={20} />}
                iconOnly
                onPress={() => {
                  router.push('/sitemap');
                }}
              >
                Sitemap
              </Button>
              <span>Sitemap</span>
            </Tooltip>
          </Buttons>
          <AD>
            <Link
              href={'https://digitalindia.gov.in/'}
              rel="noopener noreferrer"
              color="var(--text-medium)"
              underline="always"
              variant="pt12l"
              target="_blank"
              external
            >
              <span>A Digital India Initiative</span>
            </Link>
          </AD>
        </RightSide>
      </div>
    </Wrapper>
  );
};

export default AccessibilityNav;

export const Wrapper = styled.div`
  --border: 2px solid var(--color-gray-02);
  background-color: var(--color-primary-06);
  color: var(--text-high);
  padding-inline: 32px;

  @media (max-width: 640px) {
    padding-inline: 0px;

    > div {
      display: block !important;
    }
  }

  > div {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 6px;
    z-index: 100;
  }
`;

const SkipLinks = styled.div`
  display: flex;
  background-color: var(--color-primary-06);
  box-shadow: var(--box-shadow);

  > div:first-of-type {
    border-left: var(--border);
    padding-block: 8px;
    padding-inline: 20px;
    display: inline-block;

    font-size: 12px;

    span {
      font-weight: 400;
    }
  }

  > div > a {
    &:first-of-type {
      border-inline: var(--border);
      padding-block: 8px;
      padding-inline: 20px;
      display: inline-block;
    }

    @media (max-width: 640px) {
      flex-wrap: wrap;
      justify-content: space-between;

      &:first-of-type {
        display: none;
        border-inline: none;
      }
      &:last-of-type {
        display: flex;
      }
    }
  }

  @media (max-width: 640px) {
    display: none;
  }
`;

const RightSide = styled.div`
  display: flex;
  align-items: center;

  button {
    padding: 8px 16px;

    &:hover,
    &:focus-visible {
      background-color: var(--color-primary-05);
    }

    svg {
      fill: var(--color-primary-01);
    }
  }

  [data-type='sitemap'] {
    border-inline: var(--border);

    svg {
      transform: rotate(90deg);
    }
  }

  @media (max-width: 640px) {
    justify-content: space-between;
    flex-direction: row-reverse;

    button {
      padding: 8px 12px;
    }
  }
`;

const FontSizer = styled.div`
  display: flex;
  align-items: center;
  gap: 1px;
  border-inline: var(--border);

  button {
    padding: 8px 16px;
    font-weight: var(--font-bold);
    display: flex;
    align-items: center;
    justify-content: center;

    &[data-disabled] {
      font-size: 0.875rem;
      padding-block: 9.5px;
      font-weight: var(--font-normal);
    }

    &[data-disabled='true'] {
      background-color: var(--color-gray-01-on-dark);
      pointer-events: none;
    }

    &:hover,
    &:focus-visible {
      background-color: var(--color-primary-05);
    }
  }

  @media (max-width: 640px) {
    border-inline: none;

    button {
      padding: 8px 12px;
    }
  }
`;

const Buttons = styled.div`
  display: flex;
  align-items: center;
  gap: 1px;

  @media (max-width: 640px) {
    flex-direction: row-reverse;
    border-right: var(--border);
  }
`;

const AD = styled.div`
  display: none;

  @media (max-width: 640px) {
    display: block;
  }
`;
