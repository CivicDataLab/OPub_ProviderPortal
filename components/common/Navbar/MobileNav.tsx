import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import IdpNavLogo from 'components/icons/IdpNavLogo';
import { ArrowTail, Cross, Hamburger } from 'components/icons';
import styled from 'styled-components';
import { Button } from 'components/actions';
import Modal from 'components/actions/Modal';
import { sectionCollapse } from 'utils/helper';
import { signIn, signOut, useSession } from 'next-auth/react';
import { NextLink } from 'components/layouts/Link';
import { platform_name } from 'platform-constants';
import { Close } from '@opub-icons/workflow';

const MobileNav = ({ data }) => {
  const [navIsOpen, setNavIsOpen] = useState(false);
  const menuBtnRef = useRef(null);
  const menuRef = useRef(null);
  const router = useRouter();

  const { data: session } = useSession();

  // opening / closing mobile navbar
  function mobileNavHandler() {
    menuBtnRef.current.setAttribute('aria-expanded', !navIsOpen);
    setNavIsOpen(!navIsOpen);
  }

  return (
    <>
      <MobileHeader>
        <div>
          <Button
            icon={<Hamburger />}
            iconOnly
            kind="custom"
            aria-expanded="false"
            onClick={() => mobileNavHandler()}
            ref={menuBtnRef}
          >
            <span className="sr-only">
              {navIsOpen ? 'close menu' : 'open menu'}
            </span>
          </Button>

          <div className={'header__logo'}>
            <NextLink href="/">
              <LogoContainer title="IDP Logo">
                <span className="sr-only">{platform_name}</span>
                <IdpNavLogo alt="IDP Logo" width={143} height={40} />
              </LogoContainer>
            </NextLink>
          </div>
        </div>
      </MobileHeader>

      <Modal
        isOpen={navIsOpen}
        modalHandler={mobileNavHandler}
        label="mobile menu"
        from="left"
      >
        <MobileNavWrapper>
          <div>
            <MenuHeader>
              <Button
                icon={<Close />}
                iconOnly
                kind="custom"
                onPress={mobileNavHandler}
              >
                close menu
              </Button>
            </MenuHeader>

            <LinksWrapper ref={menuRef}>
              {data.links &&
                data.links.map((navItem: any, index: number) => (
                  <li key={`navItemMobile-${index}`}>
                    {navItem.submenu ? (
                      <>
                        <MenuItem
                          as="button"
                          type="button"
                          aria-expanded="false"
                          onClick={(e) => sectionCollapse(e, menuRef)}
                        >
                          {navItem.name}
                        </MenuItem>
                        <SubMenu hidden>
                          {navItem.submenu.length > 0 && (
                            <ul>
                              {navItem.submenu.map((item, num) => (
                                <li key={`sub-${index}-${num}`}>
                                  <Link href={item.link}>
                                    <a>
                                      {item.name}
                                      <ArrowTail width={24} height={24} />
                                    </a>
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          )}
                        </SubMenu>
                      </>
                    ) : (
                      <MenuItem
                        href={navItem.link}
                        onClick={mobileNavHandler}
                        data-active={router.pathname == navItem.link}
                        className={`navbar__item`}
                      >
                        {navItem.name}
                      </MenuItem>
                    )}
                  </li>
                ))}

              {session && (
                <li>
                  <MenuItem
                    as="button"
                    onClick={() => {
                      router.push('/user/entities');
                    }}
                  >
                    {session.user.name}
                  </MenuItem>
                </li>
              )}
            </LinksWrapper>
          </div>

          <ButtonWrapper>
            {session ? (
              <Button
                fluid
                kind="primary-outline"
                className="invert-button-outline"
                as="button"
                onClick={() => {
                  signOut();
                }}
              >
                Logout
              </Button>
            ) : (
              <>
                <Button
                  kind="primary-outline"
                  className="invert-button-outline"
                  fluid
                  onPress={() => {
                    signIn();
                  }}
                >
                  Sign In
                </Button>

                <Button
                  kind="primary"
                  className="invert-button"
                  fluid
                  onPress={() => {}}
                >
                  Register
                </Button>
              </>
            )}
          </ButtonWrapper>
        </MobileNavWrapper>
      </Modal>
    </>
  );
};

export default MobileNav;

export const MobileHeader = styled.header`
  display: none;
  align-items: center;
  background-color: var(--nav-background);
  color: var(--text-high-on-dark);

  [aria-expanded] {
    line-height: 0;
  }

  @media (max-width: 800px) {
    display: block;
  }

  > div {
    display: flex;
    gap: 16px;
    padding: 16px 16px;
    justify-content: flex-start;
    align-items: center;
  }

  a {
    text-decoration: none;
  }

  button {
    color: var(--text-high-on-dark);

    svg {
      fill: currentColor;
    }
  }
`;

const LogoContainer = styled.a`
  display: flex;
  flex-basis: 200px;
`;

export const MobileNavWrapper = styled.nav`
  background-color: var(--color-background-darkest);
  color: var(--text-high-on-dark);
  height: 100%;
  width: 256px;

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .invert-button-outline {
    border-color: var(--color-primary-06);
    color: var(--color-primary-06);
  }

  .invert-button {
    background-color: var(--color-primary-06);
    color: var(--color-primary-00);
  }

  a {
    text-decoration: none;
  }

  button {
    color: var(--text-high-on-dark);
  }
`;

export const MenuHeader = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 4px 12px;

  svg {
    width: 24px;
  }
`;

const LinksWrapper = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const MenuItem = styled.a`
  padding: 12px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  line-height: 2rem;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-white);

  &[data-active='true'] {
    background-color: var(--color-primary-06);
    color: var(--color-primary-00);
  }

  &:hover,
  &:focus-visible {
    background-color: var(--color-primary-01);
  }

  &[type='button'] {
    &::after {
      border-bottom: 2px solid #0b0c0c;
      border-bottom-color: rgb(11, 12, 12);
      border-right: 2px solid #0b0c0c;
      border-right-color: rgb(11, 12, 12);
      content: ' ';
      display: inline-block;
      height: 8px;
      margin: 0 2px 0 1rem;
      transform: translateY(-35%) rotate(45deg);
      vertical-align: middle;
      width: 8px;
      border-color: var(--color-white);
      transition: transform 300ms ease;
    }
  }

  &[aria-expanded='true'] {
    background-color: var(--color-background-lightest);

    &::after {
      transform: rotate(-135deg);
    }

    & + ul {
      background-color: var(--color-background-lightest);
      padding-bottom: 1rem;
    }
  }
`;

export const SubMenu = styled.ul`
  width: 100%;

  a {
    padding: 1rem 1.5rem;
    display: block;
    padding-left: 2rem;
    display: flex;
    justify-content: space-between;
  }

  svg {
    fill: var(--text-high-on-dark);
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 24px;
`;
