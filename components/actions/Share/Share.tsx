import { Link, ShareAndroid } from '@opub-icons/workflow';

import { Facebook, Linkedin, Twitter } from 'components/icons';
import { Item, MenuButton } from '../MenuOpub';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import { ButtonProps } from '../Button/Button';

function copyURL() {
  let url = document.location.href;

  if (typeof navigator.clipboard !== 'undefined') {
    navigator.clipboard.writeText(url).then(
      function () {
        toast.success('URL copied');
      },
      function () {
        toast.error('URL copy failed');
      }
    );
  } else {
    let textArea = document.createElement('textarea');
    textArea.value = url;
    // make the textarea out of viewport
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      var successful = document.execCommand('copy');
      var msg = successful ? 'URL copied' : 'URL copy failed';
      toast.success(msg);
    } catch (err) {
      toast.error('Error in copying link', err);
    }

    document.body.removeChild(textArea);
  }
}

export const Share = (props: ButtonProps) => {
  const { t } = useTranslation('common');

  const currentURL = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <Wrapper>
      <MenuButton
        label={t('intro-card-share-button')}
        icon={<ShareAndroid />}
        size={props.size || 'sm'}
        kind={props.kind || 'secondary-outline'}
        fluid={props.fluid || false}
        onAction={(key: any) => {
          if (key === 'copy') {
            copyURL();
          } else {
            if (window.confirm(`You are being redirected to ${key}`)) {
              window.open(key);
            }
          }
        }}
      >
        <Item key={`https://www.facebook.com/sharer.php?u=${currentURL}/`}>
          <StyledLink>
            <Facebook />
            <span>{t('intro-card-share-facebook')}</span>
            <span className="sr-only"> :opens in new window</span>
          </StyledLink>
        </Item>
        <Item key={`https://twitter.com/intent/tweet?url=${currentURL}/`}>
          <StyledLink>
            <Twitter />
            <span>{t('intro-card-share-twitter')}</span>
            <span className="sr-only"> :opens in new window</span>
          </StyledLink>
        </Item>
        <Item key={`https://www.linkedin.com/shareArticle?url=${currentURL}/`}>
          <StyledLink>
            <Linkedin />
            <span>{t('intro-card-share-linkedin')}</span>
            <span className="sr-only"> :opens in new window</span>
          </StyledLink>
        </Item>
        <Item key={`copy`}>
          <StyledLink>
            <Link style={{ transform: 'scale(0.7)' }} />
            <span>{t('intro-card-share-copy-link')}</span>
            <span className="sr-only"> :opens in new window</span>
          </StyledLink>
        </Item>
      </MenuButton>
    </Wrapper>
  );
};

const StyledLink = styled.button`
  display: flex;
  align-items: center;
  text-decoration: none;
  gap: 6px;

  svg {
    width: 24px;
  }
`;

const Wrapper = styled.div`
  .menu-trigger {
    color: var(--color-secondary-00);
    border: 2px solid var(--color-secondary-00);

    &:hover,
    &:focus-visible {
      background-color: var(--color-secondary-05);
    }

    svg {
      fill: var(--color-secondary-00);
      margin-inline-start: 0.5em;
    }
  }
`;
