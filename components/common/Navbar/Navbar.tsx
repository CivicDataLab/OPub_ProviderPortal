import { ChevronDown, ChevronRight } from '@opub-icons/workflow';
import { Button } from 'components/actions';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import MobileNav from './MobileNav';
import IdpNavLogo from 'components/icons/IdpNavLogo';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import { NextLink } from 'components/layouts/Link';
import { signIn, signOut, useSession } from 'next-auth/react';
import { toast } from 'react-toastify';
import { useUserStore } from 'services/store';
import { fetchUserData, logSignInSignOutActivity } from 'utils/fetch';
import { slug } from 'utils/helper';
import shallow from 'zustand/shallow';
import { TruncateText } from 'components/layouts';
import useTranslation from 'next-translate/useTranslation';
import { platform_name } from 'platform-constants';

const Nav = ({ data }) => {
  const router = useRouter();
  const { data: session } = useSession();
  const { t } = useTranslation('common');

  const { access, user, setUser, setAccess } = useUserStore(
    (state) => ({
      access: state.access,
      setUser: state.setUser,
      setAccess: state.setAccess,
      user: state.user,
    }),
    shallow
  );

  useEffect(() => {
    if (session && router.query?.clientLogin) {
      logSignInSignOutActivity(session['access']?.token, 'loggedin').then(
        (res) => {
          if (res.success) {
            router.replace(
              `${window.location.href.split('clientLogin')[0]}`,
              undefined,
              { shallow: true }
            );
          }
        }
      );
    }

    if (session) {
      fetchUserData(session['access']?.token)
        .then(async (response) => {
          // set zustand global store data
          if (!response.Success) {
            toast.error('Session expired! Logging Out');

            await signOut({ redirect: false });
            await fetch(`/api/auth/logout`)
              .then((res) => res.json())
              .then((path) => {
                router.push(path);
              });
          }
          setUser({
            username: response.username,
            email: response.email,
            name: session.user.name,
          });
          setAccess({ token: response.access_token, roles: response.access });
          localStorage.setItem('access_roles', JSON.stringify(response.access));
          localStorage.setItem('username', JSON.stringify(response.username));
        })
        .catch(async () => {
          toast.error('Error while fetching user roles');

          await signOut({ redirect: false });
          await fetch(`/api/auth/logout`)
            .then((res) => res.json())
            .then((path) => {
              router.push(path);
            });
        });
    }
  }, [session]);

  const logout = async (): Promise<void> => {
    const sessionToken = session['access']?.token;

    await logSignInSignOutActivity(sessionToken, 'loggedout').then(async () => {
      await signOut({ redirect: false }).then(async () => {
        await fetch(`/api/auth/logout`)
          .then((res) => res.json())
          .then((path) => {
            router.push(path);
          });
      });
    });

    // await logSignInSignOutActivity(sessionToken, 'loggedout')
    //   .then(() => {
    //     signOut({ redirect: false });
    //   })
    //   .then(() => {
    //     fetch(`/api/auth/logout`)
    //       .then((res) => res.json())
    //       .then((path) => {
    //         router.push(path);
    //       });
    //   });
  };

  return (
    <>
      <NavbarWrapper>
        <div>
          <NextLink href="/">
            <LogoContainer title="IDP Logo">
              <span className="sr-only">{platform_name}</span>
              <IdpNavLogo alt="IDP Logo" width={215} height={72} />
            </LogoContainer>
          </NextLink>

          <Navlinks>
            <NavigationMenu.List>
              {data.links &&
                data.links.map((navItem: any, index: number) => (
                  <NavigationMenu.Item
                    key={`menu-${index}`}
                    className={navItem.submenu}
                  >
                    {navItem.submenu ? (
                      <>
                        <Navitem as={NavigationMenu.Trigger}>
                          {navItem.name} <ChevronDown />
                        </Navitem>
                        {navItem.submenu.length > 0 && (
                          <ContentList>
                            <ul>
                              {navItem.submenu.map((item, num) => (
                                <li key={`sub-${index}-${num}`}>
                                  <NextLink href={item.link}>
                                    <a>
                                      {item.name}
                                      <ChevronRight />
                                    </a>
                                  </NextLink>
                                </li>
                              ))}
                            </ul>
                          </ContentList>
                        )}
                      </>
                    ) : (
                      <NextLink
                        key={`navItemDesktop-${index}`}
                        href={navItem.link}
                      >
                        <Navitem
                          className={
                            router.pathname == navItem.link && 'active'
                          }
                        >
                          {t(navItem.name.toLowerCase())}
                        </Navitem>
                      </NextLink>
                    )}
                  </NavigationMenu.Item>
                ))}

              {session ? (
                <>
                  <NavigationMenu.Item>
                    <Navitem as={NavigationMenu.Trigger}>
                      {user.name} <ChevronDown />
                    </Navitem>
                    <ContentList>
                      <ul>
                        {access.roles?.length > 0 &&
                          access.roles
                            ?.filter(
                              (item) => item.status.toLowerCase() === 'approved'
                            )
                            .map(
                              (item, num) =>
                                item.org_title && (
                                  <li key={`ProfileSubMenu-${num}`}>
                                    <a
                                      href={`/providers/${
                                        item.org_title
                                          ? slug(item.org_title)
                                          : ''
                                      }/dashboard/datasets/drafts`}
                                    >
                                      <TruncateText linesToClamp={1}>
                                        {item.org_title}
                                      </TruncateText>
                                      <ChevronRight />
                                    </a>
                                  </li>
                                )
                            )}

                        <NavigationMenu.Item>
                          <a href={`/user/profile`}>User Dashboard</a>
                        </NavigationMenu.Item>

                        <NavigationMenu.Item>
                          <button
                            className="submenu-logout"
                            onClick={() => logout()}
                          >
                            Logout
                          </button>
                        </NavigationMenu.Item>
                      </ul>
                    </ContentList>
                  </NavigationMenu.Item>
                </>
              ) : (
                <NavigationMenu.Item>
                  <Button
                    kind="primary-outline"
                    className="invert-button-outline"
                    onPress={() => {
                      if (typeof window !== 'undefined') {
                        signIn('keycloak', {
                          callbackUrl: `${window.location.origin}/user/profile?clientLogin=true`,
                        });
                      }
                    }}
                  >
                    {t('sign-in-register')}
                  </Button>
                </NavigationMenu.Item>
              )}
            </NavigationMenu.List>
          </Navlinks>
        </div>
      </NavbarWrapper>
      <MobileNav data={data} />
    </>
  );
};

export default Nav;

export const NavbarWrapper = styled.div`
  background-color: var(--nav-background);
  color: var(--text-high-on-dark);
  padding-block: 8px;
  padding-inline: 32px;

  @media (max-width: 800px) {
    display: none;
  }

  > div {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    align-items: center;
    margin: 0 auto;
  }

  a {
    text-decoration: none;
  }
`;

const LogoContainer = styled.a`
  display: flex;
  flex-basis: 200px;
`;

const Navlinks = styled(NavigationMenu.Root)`
  position: relative;

  > div > ul {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .invert-button-outline {
    border-color: var(--color-primary-06);
    color: var(--text-high-on-dark);
  }
  .invert-button {
    background-color: var(--color-primary-06);
    color: var(--color-primary-01);

    .submenu-logout {
      width: 100%;
    }
  }
`;

const Navitem = styled(NavigationMenu.Link)`
  all: unset;
  text-transform: capitalize;

  padding: 8px;
  align-items: center;
  display: flex;
  color: var(--text-high-on-dark);
  transition: background-color 200ms ease;
  width: max-content;
  cursor: pointer;
  position: relative;
  font-weight: var(--font-bold);

  &:hover:not([aria-expanded]),
  &:focus-visible:not([aria-expanded]) {
    color: var(--color-white);

    &::before {
      content: '';
      width: 8px;
      height: 8px;
      border-radius: 100%;
      background-color: var(--color-white);
      position: absolute;
      left: 50%;
      margin-left: -4px;
      bottom: -2px;
      z-index: 100;
    }

    &.active {
      &::before {
        content: none;
      }
    }
  }

  &.active {
    box-shadow: inset 0 -2px 0 0 #fff;
    font-weight: 500;

    @media (max-width: 800px) {
      box-shadow: inset 3px 0 0 0 #fff;
    }
  }

  svg {
    fill: var(--text-high-on-dark);
    pointer-events: none;
  }
`;

const enterFromRight = keyframes({
  from: { transform: 'translateX(200px)', opacity: 0 },
  to: { transform: 'translateX(0)', opacity: 1 },
});

const enterFromLeft = keyframes({
  from: { transform: 'translateX(-200px)', opacity: 0 },
  to: { transform: 'translateX(0)', opacity: 1 },
});

const exitToRight = keyframes({
  from: { transform: 'translateX(0)', opacity: 1 },
  to: { transform: 'translateX(200px)', opacity: 0 },
});

const exitToLeft = keyframes({
  from: { transform: 'translateX(0)', opacity: 1 },
  to: { transform: 'translateX(-200px)', opacity: 0 },
});

const ContentList = styled(NavigationMenu.Content)`
  @media (prefers-reduced-motion: no-preference) {
    animation-duration: 250ms;
    animation-timing-function: ease;
    &[data-motion='from-start'] {
      animation-name: ${enterFromLeft};
    }
    &[data-motion='from-end'] {
      animation-name: ${enterFromRight};
    }
    &[data-motion='to-start'] {
      animation-name: ${exitToLeft};
    }
    &[data-motion='to-end'] {
      animation-name: ${exitToRight};
    }
  }

  ul {
    position: absolute;
    top: 110%;
    right: 0;
    background-color: var(--color-background-darkest);
    padding: 8px;
    width: max-content;
    border-radius: 4px;
    min-width: 210px;
    z-index: 200;
    max-height: 80vh;
    overflow-y: auto;
    &::before {
      content: '';
      display: inline-block;
      position: absolute;
      border-left: 14px solid transparent;
      border-right: 14px solid transparent;
      border-bottom: 17px solid var(--color-background-darkest);
      top: -15px;
      right: 5px;
    }

    li {
      margin-top: 4px;
      transition: background-color 200ms ease;
      border-radius: 4px;

      span {
        max-width: 200px;
      }

      &:first-child {
        margin-top: 0;
      }

      &:hover {
        background-color: var(--color-background-dark);
      }
    }

    a,
    button {
      line-height: 1.5;
      padding: 4px 8px 4px 12px;
      color: var(--text-high-on-dark);
      fill: var(--text-high-on-dark);
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
    }
  }
`;
